import type { App, TFile } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Modal, Notice, setIcon } from 'obsidian';

import type { PluginSettings, QuickAction } from '../PluginSettings.ts';

import { createNote } from '../createNote.ts';
import { AppendPromptModal } from './AppendPromptModal.ts';

// ── Date helpers ─────────────────────────────────────────────────────────────

function headerDate(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
    .toUpperCase();
}

function fromNow(timestamp: number): string {
  const s = Math.floor((Date.now() - timestamp) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const day = Math.floor(h / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function extractPreview(raw: string): string {
  const body = raw.startsWith('---') ? raw.replace(/^---[\s\S]*?---\n?/, '') : raw;
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/%%[\s\S]*?%%/g, '')
    .replace(/!\[\[.*?\]\]/g, '')
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/^#{1,6}\s+.*/gm, '')
    .replace(/^\s*\|.*\|\s*$/gm, '')
    .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/`[^`\n]*`/g, '')
    .split('\n').map((l) => l.trim()).filter((l) => l.length > 2)
    .join(' ').replace(/\s{2,}/g, ' ').trim();
  return text.slice(0, 120);
}

function noteIcon(file: TFile, app: App): string {
  const cache = app.metadataCache.getFileCache(file);
  const tags = (cache?.tags ?? []).map((t) => t.tag.toLowerCase());
  const fm = (cache?.frontmatter?.['tags'] ?? []) as string[];
  const all = [...tags, ...fm.map((t) => `#${t}`.toLowerCase())];
  if (all.some((t) => t.includes('journal') || t.includes('daily'))) return 'calendar';
  if (all.some((t) => t.includes('task') || t.includes('todo'))) return 'check-square';
  if (all.some((t) => t.includes('moc') || t.includes('index'))) return 'layers';
  if (all.some((t) => t.includes('person') || t.includes('contact'))) return 'user';
  return 'file-text';
}

function noteTags(file: TFile, app: App): string[] {
  const cache = app.metadataCache.getFileCache(file);
  const inline = (cache?.tags ?? []).map((t) => t.tag);
  const fm = ((cache?.frontmatter?.['tags'] ?? []) as string[]).map((t) => `#${t}`);
  return [...new Set([...inline, ...fm])].slice(0, 2);
}

// ── Plugin API shims ─────────────────────────────────────────────────────────

interface TrashApi {
  getCandidates(): TFile[];
  openTriage(): Promise<void>;
}

interface ContinuePlugin {
  openedLog: string[];
}

function getTrashApi(app: App): TrashApi | null {
  const plugin = (app as unknown as { plugins: { plugins: Record<string, unknown> } })
    .plugins?.plugins?.['trash-collection'];
  if (!plugin) return null;
  const api = (plugin as { api?: unknown }).api;
  if (!api || typeof (api as TrashApi).getCandidates !== 'function') return null;
  return api as TrashApi;
}

function getContinuePlugin(app: App): ContinuePlugin | null {
  const plugin = (app as unknown as { plugins: { plugins: Record<string, unknown> } })
    .plugins?.plugins?.['obsidian-continue'];
  if (!plugin || !Array.isArray((plugin as ContinuePlugin).openedLog)) return null;
  return plugin as ContinuePlugin;
}

// ── Modal ────────────────────────────────────────────────────────────────────

export class DashboardModal extends Modal {
  private readonly settings: ReadonlyDeep<PluginSettings>;

  public constructor(app: App, settings: ReadonlyDeep<PluginSettings>) {
    super(app);
    this.settings = settings;
  }

  public override async onOpen(): Promise<void> {
    const { modalEl, contentEl, containerEl } = this;

    containerEl.addClass('qw-dash-container');
    modalEl.addClass('qw-dash-modal');
    contentEl.addClass('qw-dash');

    modalEl.createEl('div', { cls: 'qw-dash-handle' });

    const widgets = this.settings.dashboardWidgets ?? [];
    const trashEnabled = widgets.some((w) => w.type === 'trash' && w.enabled);
    const trashApi = trashEnabled ? getTrashApi(this.app) : null;
    const trashCount = trashApi ? trashApi.getCandidates().length : 0;

    this.renderCapture(contentEl);
    this.renderDateHeader(contentEl, trashCount > 0 ? { count: trashCount, api: trashApi! } : null);

    for (const widget of widgets) {
      if (!widget.enabled) continue;
      switch (widget.type) {
        case 'continue': await this.renderContinue(contentEl); break;
        case 'new-note': this.renderQuickActions(contentEl); break;
      }
    }
  }

  public override onClose(): void {
    this.contentEl.empty();
  }

  // ── Sections ───────────────────────────────────────────────────────────────

  private renderCapture(root: HTMLElement): void {
    const appendAction = (this.settings.quickActions ?? []).find((a) => a.action === 'append-to-note');
    const bar = root.createEl('div', { cls: 'qw-dash-capture' });
    const icon = bar.createEl('div', { cls: 'qw-dash-capture-icon' });
    setIcon(icon, 'pencil');
    bar.createEl('span', {
      cls: 'qw-dash-capture-placeholder',
      text: appendAction ? `Add to ${this.app.vault.getFileByPath(appendAction.notePath ?? '')?.basename ?? 'note'}…` : 'New note…',
    });
    bar.addEventListener('click', () => {
      if (appendAction) {
        void this.handleQuickAction(appendAction);
      } else {
        void this.handleQuickAction({ label: 'New note', icon: 'file-plus', action: 'new-note' });
      }
    });
  }

  private renderDateHeader(root: HTMLElement, trash: { count: number; api: TrashApi } | null): void {
    const row = root.createEl('div', { cls: 'qw-dash-date-row' });
    row.createEl('span', { cls: 'qw-dash-date', text: `TODAY · ${headerDate()}` });
    if (trash) {
      const badge = row.createEl('button', { cls: 'qw-dash-trash-badge' });
      const iconWrap = badge.createEl('span', { cls: 'qw-dash-trash-icon' });
      setIcon(iconWrap, 'trash-2');
      badge.createEl('span', { cls: 'qw-dash-trash-count', text: String(trash.count) });
      badge.addEventListener('click', () => { this.close(); void trash.api.openTriage(); });
    }
  }

  private async renderContinue(root: HTMLElement): Promise<void> {
    const files = this.getRecentFiles();
    if (files.length === 0) return;

    root.createEl('div', { cls: 'qw-dash-section-label', text: 'RECENTLY TOUCHED' });

    for (const [idx, file] of files.entries()) {
      const row = root.createEl('div', { cls: idx === 0 ? 'qw-dash-note-row qw-dash-note-row--recent' : 'qw-dash-note-row' });

      const iconWrap = row.createEl('div', { cls: 'qw-dash-note-icon' });
      setIcon(iconWrap, noteIcon(file, this.app));

      const meta = row.createEl('div', { cls: 'qw-dash-note-meta' });
      meta.createEl('div', { cls: 'qw-dash-note-title', text: file.basename });

      const tags = noteTags(file, this.app);
      if (tags.length > 0) {
        const detail = meta.createEl('div', { cls: 'qw-dash-note-detail' });
        for (const tag of tags) {
          detail.createEl('span', { cls: 'qw-dash-note-tag', text: tag });
        }
      }

      try {
        const raw = await this.app.vault.cachedRead(file);
        const preview = extractPreview(raw);
        if (preview && tags.length === 0) {
          meta.createEl('div', { cls: 'qw-dash-note-preview', text: preview });
        }
      } catch { /* skip */ }

      row.createEl('div', { cls: 'qw-dash-note-time', text: fromNow(file.stat.mtime) });
      row.addEventListener('click', () => { this.close(); void this.app.workspace.getMostRecentLeaf()?.openFile(file); });
    }
  }

  private renderQuickActions(root: HTMLElement): void {
    const actions = this.settings.quickActions ?? [];
    if (actions.length === 0) return;

    root.createEl('div', { cls: 'qw-dash-section-label', text: 'QUICK ACTIONS' });
    const row = root.createEl('div', { cls: 'qw-dash-actions' });

    for (const action of actions) {
      const btn = row.createEl('button', { cls: 'qw-dash-action-btn' });
      const iconEl = btn.createEl('span', { cls: 'qw-dash-action-icon' });
      setIcon(iconEl, action.icon || 'zap');
      btn.createEl('span', { text: action.label });
      btn.addEventListener('click', () => { void this.handleQuickAction(action); });
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private isExcluded(file: TFile): boolean {
    return (this.settings.continueExcluded ?? []).some((rule) =>
      rule.endsWith('/') ? file.path.startsWith(rule) : file.path === rule
    );
  }

  private getRecentFiles(): TFile[] {
    const MAX = 4;
    const continuePlug = getContinuePlugin(this.app);
    const paths = continuePlug && continuePlug.openedLog.length > 0
      ? continuePlug.openedLog
      : this.app.workspace.getLastOpenFiles();
    return paths
      .map((p) => this.app.vault.getFileByPath(p))
      .filter((f): f is TFile => f !== null && !this.isExcluded(f))
      .slice(0, MAX);
  }

  private async handleQuickAction(action: ReadonlyDeep<QuickAction>): Promise<void> {
    switch (action.action) {
      case 'new-note': {
        this.close();
        const file = await createNote(this.app, this.settings);
        await this.app.workspace.getMostRecentLeaf()?.openFile(file);
        break;
      }
      case 'homepage': {
        this.close();
        const target = this.settings.homePath;
        if (target) {
          const file = this.app.vault.getFileByPath(target);
          if (file) { await this.app.workspace.getMostRecentLeaf()?.openFile(file); return; }
        }
        try {
          if (this.app.commands.findCommand('homepage:open')) {
            this.app.commands.executeCommandById('homepage:open');
          } else {
            new Notice('No home note configured.');
          }
        } catch { new Notice('No home note configured.'); }
        break;
      }
      case 'command': {
        this.close();
        if (action.commandId) this.app.commands.executeCommandById(action.commandId);
        break;
      }
      case 'append-to-note': {
        const notePath = action.notePath;
        if (!notePath) { new Notice('No note path configured for this action.'); return; }
        const template = action.appendTemplate || '{{text}}';
        new AppendPromptModal(this.app, action.label, async (text) => {
          const file = this.app.vault.getFileByPath(notePath);
          if (!file) { new Notice(`Note not found: ${notePath}`); return; }
          const line = template.replace('{{text}}', text);
          const content = await this.app.vault.read(file);
          const sep = content.endsWith('\n') ? '' : '\n';
          await this.app.vault.modify(file, content + sep + line + '\n');
          new Notice(`Added to ${file.basename}`);
        }).open();
        break;
      }
    }
  }
}

import type { App, TFile } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Modal, Notice, setIcon } from 'obsidian';

import type { PulseCard, PluginSettings, QuickAction } from '../PluginSettings.ts';

import { createNote } from '../createNote.ts';
import { AppendPromptModal } from './AppendPromptModal.ts';

// ── Date helpers ─────────────────────────────────────────────────────────────

function headerDate(): string {
  return new Date()
    .toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
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

function stripMarkdown(raw: string): string[] {
  const body = raw.startsWith('---') ? raw.replace(/^---[\s\S]*?---\n?/, '') : raw;
  return body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/%%[\s\S]*?%%/g, '')
    .replace(/!\[\[.*?\]\]/g, '')
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')           // strip # markers but keep heading text
    .replace(/^\s*\|.*\|\s*$/gm, '')
    .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, '$1')
    .replace(/_([^_\n]+)_/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/`[^`\n]*`/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function extractTailPreview(raw: string): string {
  const lines = stripMarkdown(raw);
  return lines.slice(-3).join('  ·  ').replace(/\s{2,}/g, ' ').trim().slice(0, 140);
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

    const scroll = contentEl.createEl('div', { cls: 'qw-dash-scroll' });
    const inner = scroll.createEl('div', { cls: 'qw-dash' });

    // Overdrag-to-new-note indicator (hidden above content until pulled)
    const overdrag = inner.createEl('div', { cls: 'qw-overdrag' });
    overdrag.createEl('div', { cls: 'qw-overdrag-icon', text: '+' });

    const widgets = this.settings.dashboardWidgets ?? [];

    this.renderTodaySection(inner);

    for (const widget of widgets) {
      if (!widget.enabled) continue;
      switch (widget.type) {
        case 'continue': await this.renderContinue(inner); break;
        case 'graph': this.renderGraph(inner); break;
        case 'new-note': this.renderMoreActions(inner); break;
      }
    }

    this.attachOverdrag(contentEl, overdrag);
  }

  public override onClose(): void {
    this.contentEl.empty();
  }

  // ── Sections ───────────────────────────────────────────────────────────────


  private renderTodaySection(root: HTMLElement): void {
    const dateRow = root.createEl('div', { cls: 'qw-dash-date-row' });
    dateRow.createEl('span', { cls: 'qw-dash-date', text: `TODAY · ${headerDate()}` });

    const cards = (this.settings.pulseCards ?? []).filter((c) => c.enabled);
    if (cards.length === 0) return;

    // Resolve trash data once (needed for trash cards)
    const needsTrash = cards.some((c) => c.type === 'trash');
    const trashApi = needsTrash ? getTrashApi(this.app) : null;
    const trashCount = trashApi ? trashApi.getCandidates().length : 0;

    // Pre-compute shared vault stats once
    const allFiles = this.app.vault.getMarkdownFiles();
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const visibleCards = cards.filter((c) => {
      if (c.type === 'trash') return trashCount > 0;
      return true;
    });

    if (visibleCards.length === 0) return;

    const pulseRow = root.createEl('div', { cls: 'qw-dash-pulse-row' });

    for (const card of visibleCards) {
      this.renderPulseCard(pulseRow, card, { allFiles, today, trashApi, trashCount });
    }
  }

  private renderPulseCard(
    row: HTMLElement,
    card: PulseCard,
    ctx: { allFiles: TFile[]; today: Date; trashApi: TrashApi | null; trashCount: number },
  ): void {
    switch (card.type) {
      case 'daily-note': {
        const el = row.createEl('div', { cls: 'qw-dash-pulse-card qw-dash-pulse-card--accent' });
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Daily note' });
        el.createEl('div', { cls: 'qw-dash-pulse-value qw-dash-pulse-value--accent', text: 'Open' });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: 'Jump to today' });
        el.addEventListener('click', () => {
          this.close();
          try {
            const id = this.app.commands.findCommand('daily-notes:goto-today')
              ? 'daily-notes:goto-today'
              : 'periodic-notes:open-daily-note';
            this.app.commands.executeCommandById(id);
          } catch { /* plugin not installed */ }
        });
        break;
      }
      case 'modified-today': {
        const count = ctx.allFiles.filter((f) => f.stat.mtime >= ctx.today.getTime()).length;
        const el = row.createEl('div', { cls: 'qw-dash-pulse-card' });
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Modified' });
        el.createEl('div', { cls: 'qw-dash-pulse-value', text: String(count) });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: 'notes today' });
        break;
      }
      case 'vault': {
        const noteCount = ctx.allFiles.length;
        const noteStr = noteCount >= 1000 ? `${(noteCount / 1000).toFixed(1)}k` : String(noteCount);
        let linkCount = 0;
        for (const f of ctx.allFiles) linkCount += this.app.metadataCache.getFileCache(f)?.links?.length ?? 0;
        const linkStr = linkCount >= 1000 ? `${(linkCount / 1000).toFixed(1)}k` : String(linkCount);
        const el = row.createEl('div', { cls: 'qw-dash-pulse-card' });
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Vault' });
        el.createEl('div', { cls: 'qw-dash-pulse-value qw-dash-pulse-value--gold', text: noteStr });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: `notes · ${linkStr} links` });
        break;
      }
      case 'trash': {
        const el = row.createEl('div', { cls: 'qw-dash-pulse-card' });
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Needs review' });
        el.createEl('div', { cls: 'qw-dash-pulse-value', text: String(ctx.trashCount) });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: 'stale notes' });
        el.addEventListener('click', () => { this.close(); void ctx.trashApi?.openTriage(); });
        break;
      }
      case 'quick-action': {
        const action = card.quickAction;
        if (!action) break;
        const el = row.createEl('div', { cls: 'qw-dash-pulse-card' });
        const iconWrap = el.createEl('div', { cls: 'qw-dash-pulse-action-icon' });
        setIcon(iconWrap, action.icon || 'zap');
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: action.label });
        el.addEventListener('click', () => { void this.handleQuickAction(action); });
        break;
      }
    }
  }

  private async renderContinue(root: HTMLElement): Promise<void> {
    const files = this.getRecentFiles();
    if (files.length === 0) return;

    root.createEl('div', { cls: 'qw-dash-section-label', text: 'RECENTLY TOUCHED' });

    for (const [idx, file] of files.entries()) {
      const row = root.createEl('div', {
        cls: idx === 0 ? 'qw-dash-note-row qw-dash-note-row--recent' : 'qw-dash-note-row',
      });

      const meta = row.createEl('div', { cls: 'qw-dash-note-meta' });

      const titleRow = meta.createEl('div', { cls: 'qw-dash-note-title-row' });
      titleRow.createEl('span', { cls: 'qw-dash-note-title', text: file.basename });
      titleRow.createEl('span', { cls: 'qw-dash-note-time', text: fromNow(file.stat.mtime) });

      // Tags + backlink count
      const tags = noteTags(file, this.app);
      let backlinkCount = 0;
      for (const links of Object.values(this.app.metadataCache.resolvedLinks)) {
        if (links[file.path]) backlinkCount++;
      }
      const detail = meta.createEl('div', { cls: 'qw-dash-note-detail' });
      if (backlinkCount > 0) detail.createEl('span', { cls: 'qw-dash-note-links', text: `← ${backlinkCount}` });
      for (const tag of tags) detail.createEl('span', { cls: 'qw-dash-note-tag', text: tag });

      // Always show tail preview
      try {
        const preview = extractTailPreview(await this.app.vault.cachedRead(file));
        if (preview) meta.createEl('div', { cls: 'qw-dash-note-preview', text: preview });
      } catch { /* skip */ }
      row.addEventListener('click', () => {
        this.close();
        void this.app.workspace.getMostRecentLeaf()?.openFile(file);
      });
    }
  }

  private renderGraph(root: HTMLElement): void {
    const centerFile = this.getRecentFiles()[0];
    if (!centerFile) return;

    const resolvedLinks = this.app.metadataCache.resolvedLinks;
    const outgoing = Object.keys(resolvedLinks[centerFile.path] ?? {});
    const incoming: string[] = [];
    for (const [src, links] of Object.entries(resolvedLinks)) {
      if (src !== centerFile.path && links[centerFile.path]) incoming.push(src);
    }
    const neighborPaths = [...new Set([...outgoing, ...incoming])];
    const totalConnections = neighborPaths.length;

    root.createEl('div', { cls: 'qw-dash-section-label', text: 'ACTIVE CLUSTER' });

    const card = root.createEl('div', { cls: 'qw-dash-graph-card' });
    const canvas = card.createEl('div', { cls: 'qw-dash-graph-canvas' });
    const attachListeners = (expanded: boolean): void => {
      canvas.innerHTML = this.buildGraphSvg(centerFile, neighborPaths.slice(0, expanded ? 20 : 10), expanded);

      canvas.querySelectorAll<SVGElement>('[data-path]').forEach((el) => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const file = this.app.vault.getFileByPath(el.getAttribute('data-path') ?? '');
          if (file) { this.close(); void this.app.workspace.getMostRecentLeaf()?.openFile(file); }
        });
      });

      canvas.querySelector<SVGElement>('[data-center]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
        void this.app.workspace.getMostRecentLeaf()?.openFile(centerFile);
      });

      canvas.addEventListener('click', () => {
        const expanded2 = card.classList.toggle('qw-dash-graph-card--expanded');
        attachListeners(expanded2);
      }, { once: true });
    };

    attachListeners(false);

    const footer = card.createEl('div', { cls: 'qw-dash-graph-footer' });
    const stat = footer.createEl('div', { cls: 'qw-dash-graph-stat' });
    stat.createEl('div', { cls: 'qw-dash-graph-dot' });
    stat.createEl('span', { text: `${totalConnections} connected notes` });

    const btn = footer.createEl('button', { cls: 'qw-dash-graph-btn', text: 'FULL GRAPH →' });
    btn.addEventListener('click', () => {
      this.close();
      try { this.app.commands.executeCommandById('graph:open'); } catch { /* */ }
    });
  }

  private buildGraphSvg(center: TFile, neighborPaths: string[], expanded = false): string {
    const cx = 171;
    const viewH = expanded ? 356 : 178;
    const cy = viewH / 2;  // always vertically centered in the viewBox
    const r = expanded ? 115 : 58;
    const n = neighborPaths.length;

    const neighbors = neighborPaths.map((path, i) => {
      const angle = (i / Math.max(n, 1)) * 2 * Math.PI - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      const name = this.app.vault.getFileByPath(path)?.basename ?? path.split('/').pop()?.replace(/\.md$/, '') ?? '';
      return { x, y, name, path };
    });

    const edges = neighbors
      .map((nb) => `<line x1="${cx}" y1="${cy}" x2="${nb.x.toFixed(1)}" y2="${nb.y.toFixed(1)}" stroke="#2e2e3a" stroke-width="1" opacity="0.8"/>`)
      .join('');

    const nodes = neighbors
      .map((nb) => {
        const truncated = nb.name.length > 14 ? nb.name.slice(0, 14) + '…' : nb.name;
        const above = nb.y < cy;
        const ly = above ? nb.y - 10 : nb.y + 14;
        return `<g data-path="${nb.path}" style="cursor:pointer">
          <circle cx="${nb.x.toFixed(1)}" cy="${nb.y.toFixed(1)}" r="14" fill="transparent"/>
          <circle cx="${nb.x.toFixed(1)}" cy="${nb.y.toFixed(1)}" r="4" fill="#1e1e28" stroke="#3a3a50" stroke-width="1"/>
          <text x="${nb.x.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" fill="#9b7ce8" font-size="7" font-family="monospace" opacity="0.85">[[${truncated}]]</text>
        </g>`;
      })
      .join('');

    const centerLabel = center.basename.length > 20 ? center.basename.slice(0, 20) + '…' : center.basename;

    return `<svg viewBox="0 0 343 ${viewH}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <g>${edges}</g>
      <g>${nodes}</g>
      <g data-center style="cursor:pointer">
        <circle cx="${cx}" cy="${cy}" r="22" fill="transparent"/>
        <circle cx="${cx}" cy="${cy}" r="16" fill="none" stroke="#7c5cbf" stroke-width="1" opacity="0.2"/>
        <circle cx="${cx}" cy="${cy}" r="13" fill="#1a1230" stroke="#9b7ce8" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="7" fill="#7c5cbf"/>
        <circle cx="${cx}" cy="${cy}" r="3" fill="#d4b8ff"/>
        <text x="${cx}" y="${cy + 26}" text-anchor="middle" fill="#e8e8ec" font-size="8" font-family="sans-serif" font-weight="500">${centerLabel}</text>
      </g>
    </svg>`;
  }

  private renderMoreActions(root: HTMLElement): void {
    const actions = this.settings.quickActions ?? [];
    if (actions.length === 0) return;

    root.createEl('div', { cls: 'qw-dash-section-label', text: 'MORE ACTIONS' });
    const row = root.createEl('div', { cls: 'qw-dash-actions' });

    for (const action of actions) {
      const btn = row.createEl('button', { cls: 'qw-dash-action-btn' });
      const iconEl = btn.createEl('span', { cls: 'qw-dash-action-icon' });
      setIcon(iconEl, action.icon || 'zap');
      btn.createEl('span', { text: action.label });
      btn.addEventListener('click', () => { void this.handleQuickAction(action); });
    }
  }

  // ── Overdrag gesture ──────────────────────────────────────────────────────

  private attachOverdrag(scrollEl: HTMLElement, indicator: HTMLElement): void {
    const THRESHOLD = 72;
    const icon = indicator.querySelector('.qw-overdrag-icon') as HTMLElement;
    let startY = 0;
    let pulling = false;
    let peaked = false;

    const reset = (): void => {
      pulling = false;
      peaked = false;
      indicator.style.marginTop = '';
      indicator.classList.remove('qw-overdrag--ready', 'qw-overdrag--fired');
    };

    scrollEl.addEventListener('touchstart', (e: TouchEvent) => {
      if (scrollEl.scrollTop <= 0) {
        startY = e.touches[0]!.clientY;
        pulling = true;
        peaked = false;
      }
    }, { passive: true });

    scrollEl.addEventListener('touchmove', (e: TouchEvent) => {
      if (!pulling) return;
      if (scrollEl.scrollTop > 0) { reset(); return; }
      const delta = e.touches[0]!.clientY - startY;
      if (delta <= 0) { reset(); return; }

      e.preventDefault();

      const clamped = Math.min(delta, THRESHOLD * 1.4);
      // slide the indicator in from above: starts at -THRESHOLD, reaches 0 at threshold
      indicator.style.marginTop = `${Math.min(clamped - THRESHOLD, 0)}px`;

      const progress = delta / THRESHOLD;
      const scale = 0.5 + Math.min(progress, 1) * 0.5;
      icon.style.transform = `scale(${scale})`;

      if (progress >= 1 && !peaked) {
        peaked = true;
        indicator.classList.add('qw-overdrag--ready');
        try { (navigator as Navigator & { vibrate?: (d: number) => void }).vibrate?.(8); } catch { /* */ }
      } else if (progress < 1 && peaked) {
        peaked = false;
        indicator.classList.remove('qw-overdrag--ready');
      }
    }, { passive: false });

    scrollEl.addEventListener('touchend', async () => {
      if (!pulling) return;
      if (!peaked) { reset(); return; }

      pulling = false;
      indicator.classList.add('qw-overdrag--fired');
      try { (navigator as Navigator & { vibrate?: (d: number) => void }).vibrate?.(30); } catch { /* */ }

      await new Promise<void>((r) => setTimeout(r, 320));
      this.close();
      const file = await createNote(this.app, this.settings);
      await this.app.workspace.getMostRecentLeaf()?.openFile(file);
    });

    scrollEl.addEventListener('touchcancel', reset);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private isExcluded(file: TFile): boolean {
    return (this.settings.continueExcluded ?? []).some((rule) =>
      rule.endsWith('/') ? file.path.startsWith(rule) : file.path === rule,
    );
  }

  private getRecentFiles(): TFile[] {
    const MAX = 4;
    const activePath = this.app.workspace.getActiveFile()?.path;
    const continuePlug = getContinuePlugin(this.app);
    const paths =
      continuePlug && continuePlug.openedLog.length > 0
        ? continuePlug.openedLog
        : this.app.workspace.getLastOpenFiles();
    return paths
      .map((p) => this.app.vault.getFileByPath(p))
      .filter((f): f is TFile => f !== null && f.path !== activePath && !this.isExcluded(f))
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

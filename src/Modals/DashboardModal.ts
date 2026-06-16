import type { App, TFile } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Modal, setIcon } from 'obsidian';

import type { PulseCard, PluginSettings, QuickAction } from '../PluginSettings.ts';
import type { NeighborRelation } from '../breadcrumbs.ts';

import { getBCGraph, getFrontmatterLinkTargets, relColor, REL_PALETTE, resolveBCRelations } from '../breadcrumbs.ts';
import { createNote } from '../createNote.ts';
import { executeQuickAction } from '../quickActions.ts';
import { getRecentFiles, isExcluded } from '../recents.ts';
import { truncate } from '../text.ts';

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


function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function getTrashApi(app: App): TrashApi | null {
  const plugin = (app as unknown as { plugins: { plugins: Record<string, unknown> } })
    .plugins?.plugins?.['trash-collection'];
  if (!plugin) return null;
  const api = (plugin as { api?: unknown }).api;
  if (!api || typeof (api as TrashApi).getCandidates !== 'function') return null;
  return api as TrashApi;
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
    if (this.settings.handedness === 'right') modalEl.addClass('qw-dash-modal--right');

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
        case 'tasks': this.renderTasks(inner); break;
      }
    }

    this.attachOverdrag(contentEl, overdrag);
    this.attachKeyNav(modalEl, contentEl);
  }

  public override onClose(): void {
    this.contentEl.empty();
  }

  private attachKeyNav(modalEl: HTMLElement, contentEl: HTMLElement): void {
    let idx = -1;

    const rows = (): HTMLElement[] =>
      Array.from(modalEl.querySelectorAll<HTMLElement>('.qw-dash-note-row, .qw-dash-task-row'));

    const focus = (next: number): void => {
      const all = rows();
      all[idx]?.removeClass('qw-dash-row--focused');
      idx = Math.max(0, Math.min(next, all.length - 1));
      const el = all[idx];
      if (!el) return;
      el.addClass('qw-dash-row--focused');
      el.scrollIntoView({ block: 'nearest' });
    };

    modalEl.addEventListener('keydown', (e: KeyboardEvent) => {
      const all = rows();
      if (all.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          focus(idx < 0 ? 0 : idx + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          focus(idx < 0 ? all.length - 1 : idx - 1);
          break;
        case 'Enter':
          if (idx >= 0) { e.preventDefault(); all[idx]?.click(); }
          break;
        case 'ArrowLeft':
        case 'ArrowRight': {
          // Switch TOUCHED / MODIFIED tabs
          const tabs = modalEl.querySelectorAll<HTMLElement>('.qw-dash-segment-tab');
          const active = modalEl.querySelector<HTMLElement>('.qw-dash-segment-tab--active');
          if (tabs.length === 2 && active) {
            const next = active === tabs[0] ? tabs[1] : tabs[0];
            next?.click();
            idx = -1;
          }
          break;
        }
        case 'Escape':
          this.close();
          break;
      }
    });

    // Make modal focusable so keydown fires without clicking first
    if (!modalEl.hasAttribute('tabindex')) modalEl.setAttribute('tabindex', '-1');
    void contentEl;
    setTimeout(() => modalEl.focus(), 50);
  }

  // ── Sections ───────────────────────────────────────────────────────────────


  private renderTodaySection(root: HTMLElement): void {
    const dateRow = root.createEl('div', { cls: 'qw-dash-date-row' });
    dateRow.createEl('span', { cls: 'qw-dash-date', text: `TODAY · ${headerDate()}` });

    // Reverse hand-off to the radial menu (decoupled via command dispatch).
    if (this.settings.connectSurfaces) {
      const radialBtn = dateRow.createEl('div', { cls: 'qw-dash-radial-btn', attr: { 'aria-label': 'Open radial menu' } });
      setIcon(radialBtn, 'compass');
      radialBtn.addEventListener('click', () => {
        this.close();
        this.app.commands.executeCommandById('mobile-quick-widget:open-radial-menu');
      });
    }

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
        const count = ctx.allFiles.filter((f) => this.getModifiedTime(f) >= ctx.today.getTime()).length;
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
      case 'homepage': {
        const homePath = this.settings.homePath;
        const homeFile = homePath
          ? (this.app.vault.getFileByPath(homePath) ?? this.app.metadataCache.getFirstLinkpathDest(homePath, ''))
          : null;
        const el = row.createEl('div', { cls: 'qw-dash-pulse-card' });
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Home' });
        const iconEl = el.createEl('div', { cls: 'qw-dash-pulse-home-icon' });
        setIcon(iconEl, 'home');
        el.addEventListener('click', () => {
          this.close();
          if (homeFile) { void this.app.workspace.getMostRecentLeaf()?.openFile(homeFile); return; }
          try { this.app.commands.executeCommandById('homepage:open'); } catch { /* plugin not installed */ }
        });
        break;
      }
    }
  }

  private getModifiedTime(file: TFile): number {
    const field = this.settings.modifiedDateField;
    if (field) {
      const val = this.app.metadataCache.getFileCache(file)?.frontmatter?.[field] as unknown;
      if (val instanceof Date) return val.getTime();
      if (typeof val === 'number' && val > 1e11) return val; // looks like a ms epoch timestamp
      if (typeof val === 'string') {
        const t = Date.parse(val);
        if (!isNaN(t)) return t;
      }
    }
    return file.stat.mtime;
  }

  private getModifiedFiles(): TFile[] {
    const activePath = this.app.workspace.getActiveFile()?.path;
    return this.app.vault.getMarkdownFiles()
      .filter((f) => f.path !== activePath && !this.isExcluded(f))
      .sort((a, b) => this.getModifiedTime(b) - this.getModifiedTime(a))
      .slice(0, this.settings.modifiedListCount ?? 15);
  }

  private async renderContinue(root: HTMLElement): Promise<void> {
    const touchedFiles = this.getRecentFiles();
    if (touchedFiles.length === 0) return;

    let showModified = false;

    const header = root.createEl('div', { cls: 'qw-dash-segment-header' });
    const tabTouched = header.createEl('span', { cls: 'qw-dash-segment-tab qw-dash-segment-tab--active', text: 'TOUCHED' });
    header.createEl('span', { cls: 'qw-dash-segment-divider', text: '|' });
    const tabModified = header.createEl('span', { cls: 'qw-dash-segment-tab', text: 'MODIFIED' });

    const listEl = root.createEl('div');

    const render = async (): Promise<void> => {
      listEl.empty();
      const files = showModified ? this.getModifiedFiles() : touchedFiles;
      tabTouched.classList.toggle('qw-dash-segment-tab--active', !showModified);
      tabModified.classList.toggle('qw-dash-segment-tab--active', showModified);

      // Build backlink counts once per render instead of rescanning per row
      const backlinkCounts = new Map<string, number>();
      for (const links of Object.values(this.app.metadataCache.resolvedLinks)) {
        for (const target of Object.keys(links)) {
          backlinkCounts.set(target, (backlinkCounts.get(target) ?? 0) + 1);
        }
      }

      for (const file of files) {
        const row = listEl.createEl('div', { cls: 'qw-dash-note-row' });
        const meta = row.createEl('div', { cls: 'qw-dash-note-meta' });

        // Parent breadcrumb
        if (this.settings.showBreadcrumbs) {
          const parents = this.getParentNames(file);
          if (parents.length > 0) {
            meta.createEl('div', { cls: 'qw-dash-note-parents', text: parents.join(' › ') });
          }
        }

        const titleRow = meta.createEl('div', { cls: 'qw-dash-note-title-row' });
        titleRow.createEl('span', { cls: 'qw-dash-note-title', text: file.basename });
        titleRow.createEl('span', {
          cls: 'qw-dash-note-time',
          text: fromNow(showModified ? this.getModifiedTime(file) : file.stat.mtime),
        });

        const tags = noteTags(file, this.app);
        const backlinkCount = backlinkCounts.get(file.path) ?? 0;
        const detail = meta.createEl('div', { cls: 'qw-dash-note-detail' });
        if (backlinkCount > 0) detail.createEl('span', { cls: 'qw-dash-note-links', text: `← ${backlinkCount}` });
        for (const tag of tags) detail.createEl('span', { cls: 'qw-dash-note-tag', text: tag });

        try {
          const preview = extractTailPreview(await this.app.vault.cachedRead(file));
          if (preview) meta.createEl('div', { cls: 'qw-dash-note-preview', text: preview });
        } catch { /* skip */ }

        row.addEventListener('click', () => {
          this.close();
          void this.app.workspace.getMostRecentLeaf()?.openFile(file);
        });
      }
    };

    tabTouched.addEventListener('click', () => { showModified = false; void render(); });
    tabModified.addEventListener('click', () => { showModified = true; void render(); });

    await render();
  }

  private renderTasks(root: HTMLElement): void {
    const filesWithOpenTasks = this.app.vault.getMarkdownFiles().filter((file) =>
      (this.app.metadataCache.getFileCache(file)?.listItems ?? []).some((li) => li.task === ' '),
    );
    if (filesWithOpenTasks.length === 0) return;

    root.createEl('div', { cls: 'qw-dash-section-label', text: 'OPEN TASKS' });
    const card = root.createEl('div', { cls: 'qw-dash-task-card' });
    card.createEl('div', { cls: 'qw-dash-task-loading', text: 'Loading…' });

    void (async () => {
      card.empty();
      let count = 0;
      for (const file of filesWithOpenTasks) {
        if (count >= 10) break;
        try {
          const raw = await this.app.vault.cachedRead(file);
          const lines = raw.split('\n');
          for (const line of lines) {
            if (count >= 10) break;
            const m = line.match(/^(\s*[-*+]|\s*\d+\.) \[ \] (.+)/);
            if (!m) continue;
            const text = m[2]?.trim() ?? '';
            const row = card.createEl('div', { cls: 'qw-dash-task-row' });
            row.createEl('div', { cls: 'qw-dash-task-check' });
            row.createEl('div', { cls: 'qw-dash-task-text', text });
            row.createEl('div', { cls: 'qw-dash-task-src', text: file.basename });
            row.addEventListener('click', () => {
              this.close();
              void this.app.workspace.getMostRecentLeaf()?.openFile(file);
            });
            count++;
          }
        } catch { /* skip */ }
      }
      if (count === 0) card.createEl('div', { cls: 'qw-dash-task-loading', text: 'No open tasks' });
    })();
  }

  private renderGraph(root: HTMLElement): void {
    const centerFile = this.app.workspace.getActiveFile() ?? this.getRecentFiles()[0];
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
    const relations = resolveBCRelations(this.app, centerFile, neighborPaths, this.settings.breadcrumbField || 'up');
    const attachListeners = (expanded: boolean): void => {
      canvas.innerHTML = this.buildGraphSvg(centerFile, neighborPaths.slice(0, expanded ? 20 : 10), expanded, relations);

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

  private buildGraphSvg(center: TFile, neighborPaths: string[], expanded = false, relations: Map<string, NeighborRelation> = new Map()): string {
    const cx = 171;
    const viewH = expanded ? 356 : 178;
    const cy = viewH / 2;
    const r = expanded ? 115 : 58;
    const n = neighborPaths.length;

    const parentPaths  = neighborPaths.filter((p) => relations.get(p)?.rel === 'parent');
    const childPaths   = neighborPaths.filter((p) => relations.get(p)?.rel === 'child');
    const nextPaths    = neighborPaths.filter((p) => relations.get(p)?.rel === 'next');
    const prevPaths    = neighborPaths.filter((p) => relations.get(p)?.rel === 'prev');
    const siblingPaths = neighborPaths.filter((p) => relations.get(p)?.rel === 'sibling');
    const otherPaths   = neighborPaths.filter((p) => !relations.has(p));

    const spreadArc = (paths: string[], centerAngle: number, spread: number): { path: string; angle: number }[] =>
      paths.map((path, i) => ({
        path,
        angle: centerAngle + (paths.length === 1 ? 0 : (i / (paths.length - 1) - 0.5) * spread),
      }));

    type Positioned = { path: string; angle: number };
    let positioned: Positioned[];

    const hasBC = parentPaths.length > 0 || childPaths.length > 0 || nextPaths.length > 0 || prevPaths.length > 0 || siblingPaths.length > 0;
    if (hasBC) {
      // parents → top, children → bottom, prev ← left, next → right, siblings → upper sides, others scattered
      const parentA  = spreadArc(parentPaths,  -Math.PI / 2,       Math.PI * 0.4);
      const childA   = spreadArc(childPaths,    Math.PI / 2,        Math.PI * 0.4);
      const prevA    = spreadArc(prevPaths,     Math.PI,            Math.PI * 0.25);
      const nextA    = spreadArc(nextPaths,     0,                  Math.PI * 0.25);
      const siblingA = spreadArc(siblingPaths,  -Math.PI / 4,       Math.PI * 0.5);
      const otherA   = otherPaths.map((path, i) => ({
        path,
        angle: (i / Math.max(otherPaths.length, 1)) * 2 * Math.PI,
      }));
      positioned = [...parentA, ...childA, ...prevA, ...nextA, ...siblingA, ...otherA];
    } else {
      positioned = neighborPaths.map((path, i) => ({
        path,
        angle: (i / Math.max(n, 1)) * 2 * Math.PI - Math.PI / 2,
      }));
    }

    const neighbors = positioned.map(({ path, angle }) => {
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      const name = this.app.vault.getFileByPath(path)?.basename ?? path.split('/').pop()?.replace(/\.md$/, '') ?? '';
      const info = relations.get(path) ?? null;
      return { x, y, name, path, info };
    });

    // Edge lines — sequence edges get directional arrows, others plain
    const edges = neighbors.map((nb) => {
      const rel = nb.info?.rel;
      if (rel === 'next' || rel === 'prev') {
        const dx = nb.x - cx, dy = nb.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / dist, uy = dy / dist;
        const mx = cx + dx * 0.55, my = cy + dy * 0.55;
        const px = -uy * 3, py = ux * 3;
        const tip = rel === 'next' ? `${(mx + ux * 6).toFixed(1)},${(my + uy * 6).toFixed(1)}` : `${(mx - ux * 6).toFixed(1)},${(my - uy * 6).toFixed(1)}`;
        const w1 = rel === 'next' ? `${(mx - ux * 4 + px).toFixed(1)},${(my - uy * 4 + py).toFixed(1)}` : `${(mx + ux * 4 + px).toFixed(1)},${(my + uy * 4 + py).toFixed(1)}`;
        const w2 = rel === 'next' ? `${(mx - ux * 4 - px).toFixed(1)},${(my - uy * 4 - py).toFixed(1)}` : `${(mx + ux * 4 - px).toFixed(1)},${(my + uy * 4 - py).toFixed(1)}`;
        return `<line x1="${cx}" y1="${cy}" x2="${nb.x.toFixed(1)}" y2="${nb.y.toFixed(1)}" stroke="${REL_PALETTE.rose}" stroke-width="1" opacity="0.45"/>` +
               `<polygon points="${tip} ${w1} ${w2}" fill="${REL_PALETTE.rose}" opacity="0.6"/>`;
      }
      const stroke = rel ? relColor(rel).node : '#2e2e3a';
      const op = rel ? 0.45 : 0.8;
      return `<line x1="${cx}" y1="${cy}" x2="${nb.x.toFixed(1)}" y2="${nb.y.toFixed(1)}" stroke="${stroke}" stroke-width="1" opacity="${op}"/>`;
    }).join('');

    // Labels — wrap up to 3 lines of ~12 chars each
    const CHAR_W = 5.5;
    const LINE_H = 9;
    const LABEL_PAD_Y = 3;
    const MAX_LINE = 12;
    const MAX_LINES = 3;

    const wrapLabel = (name: string, glyph: string): string[] => {
      const lines: string[] = [];
      let rem = name;
      while (rem.length > 0 && lines.length < MAX_LINES) {
        if (rem.length <= MAX_LINE) { lines.push(rem); break; }
        let cut = MAX_LINE;
        for (let k = MAX_LINE - 1; k > MAX_LINE - 5; k--) {
          if (' -_'.includes(rem[k] ?? '')) { cut = k + 1; break; }
        }
        lines.push(rem.slice(0, cut).trimEnd());
        rem = rem.slice(cut).trimStart();
      }
      if (rem.length > 0) {
        const last = lines[lines.length - 1] ?? '';
        lines[lines.length - 1] = last.slice(0, MAX_LINE - 1) + '…';
      }
      if (glyph) lines[lines.length - 1] = (lines[lines.length - 1] ?? '') + glyph;
      return lines;
    };

    type LabelInfo = { x: number; y: number; w: number; totalH: number; lines: string[]; path: string; nx: number; ny: number; info: NeighborRelation | null };
    const labels: LabelInfo[] = neighbors.map((nb) => {
      const rel = nb.info?.rel;
      const glyph = rel === 'parent' ? ' ↑' : rel === 'child' ? ' ↓' : rel === 'next' ? ' →' : rel === 'prev' ? ' ←' : rel === 'sibling' ? ' ·' : '';
      const lines = wrapLabel(nb.name, glyph);
      const w = Math.max(...lines.map((l) => l.length)) * CHAR_W;
      const totalH = lines.length * LINE_H;
      const above = nb.y < cy;
      // y = top of the first line's baseline
      const ly = above ? nb.y - 4 - LABEL_PAD_Y - totalH + LINE_H : nb.y + 4 + LABEL_PAD_Y + LINE_H;
      return { x: nb.x, y: ly, w, totalH, lines, path: nb.path, nx: nb.x, ny: nb.y, info: nb.info };
    });

    // Collision resolution — AABB overlap, resolve on cheapest axis
    for (let pass = 0; pass < 12; pass++) {
      for (let i = 0; i < labels.length; i++) {
        for (let j = i + 1; j < labels.length; j++) {
          const a = labels[i]!, b = labels[j]!;
          const ho = Math.max(0, Math.min(a.x + a.w / 2, b.x + b.w / 2) - Math.max(a.x - a.w / 2, b.x - b.w / 2));
          const vo = Math.max(0, Math.min(a.y + a.totalH, b.y + b.totalH) - Math.max(a.y, b.y));
          if (ho <= 0 || vo <= 0) continue;
          if (ho <= vo) {
            const push = ho / 2 + 1;
            if (a.x <= b.x) { a.x -= push; b.x += push; }
            else             { a.x += push; b.x -= push; }
          } else {
            const push = vo / 2 + 1;
            if (a.y <= b.y) { a.y -= push; b.y += push; }
            else             { a.y += push; b.y -= push; }
          }
        }
      }
    }

    const nodes = labels.map((lb) => {
      const rel = lb.info?.rel;
      const { node: nodeColor, label: labelColor } = relColor(rel);
      const sibParent = lb.info?.siblingParent;
      const subLabel = rel === 'sibling' && sibParent
        ? `<text x="${lb.nx.toFixed(1)}" y="${(lb.ny - 8).toFixed(1)}" text-anchor="middle" fill="${REL_PALETTE.rose}" font-size="5.5" font-family="monospace" opacity="0.6">${escapeXml(sibParent.slice(0, 10))}</text>`
        : '';
      const textEls = lb.lines.map((line, li) =>
        `<text x="${lb.x.toFixed(1)}" y="${(lb.y + li * LINE_H).toFixed(1)}" text-anchor="middle" fill="${labelColor}" font-size="7" font-family="monospace" opacity="0.85">${escapeXml(line)}</text>`
      ).join('');
      const pad = 3;
      const rectX = (lb.x - lb.w / 2 - pad).toFixed(1);
      const rectY = (lb.y - LINE_H + 1 - pad).toFixed(1);
      const rectW = (lb.w + pad * 2).toFixed(1);
      const rectH = (lb.totalH + pad * 2).toFixed(1);
      return `<g data-path="${escapeXml(lb.path)}" style="cursor:pointer">
        <rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" fill="transparent"/>
        <circle cx="${lb.nx.toFixed(1)}" cy="${lb.ny.toFixed(1)}" r="8" fill="transparent"/>
        ${subLabel}
        <circle cx="${lb.nx.toFixed(1)}" cy="${lb.ny.toFixed(1)}" r="4" fill="#1e1e28" stroke="${nodeColor}" stroke-width="1"/>
        ${textEls}
      </g>`;
    }).join('');

    const centerLabel = escapeXml(truncate(center.basename, 20));

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
    return isExcluded(file, this.settings.continueExcluded ?? []);
  }

  private getParentNames(file: TFile): string[] {
    // Try Breadcrumbs plugin first — picks up all `up` direction edges regardless of field name
    const bcGraph = getBCGraph(this.app);
    if (bcGraph?.has_node(file.path)) {
      try {
        const edges = bcGraph.get_filtered_outgoing_edges(file.path);
        const names = edges
          .filter((e) => (e.attr?.field ?? '') === 'up' || (e.attr?.dir ?? e.attr?.direction ?? '') === 'up')
          .map((e) => {
            const path = e.target_id.endsWith('.md') ? e.target_id : e.target_id + '.md';
            return this.app.vault.getFileByPath(path)?.basename ?? this.app.vault.getFileByPath(e.target_id)?.basename ?? e.target_id.split('/').pop() ?? e.target_id;
          });
        if (names.length > 0) return names;
      } catch { /* fall through */ }
    }
    // Fall back to frontmatter links
    const field = this.settings.breadcrumbField || 'up';
    const targets = getFrontmatterLinkTargets(this.app, file, field);
    return Array.from(targets, (path) => this.app.vault.getFileByPath(path)?.basename ?? path);
  }

  private getRecentFiles(): TFile[] {
    return getRecentFiles(this.app, this.settings.continueExcluded ?? [], this.settings.recentListCount ?? 15);
  }

  private async handleQuickAction(action: ReadonlyDeep<QuickAction>): Promise<void> {
    await executeQuickAction(this.app, this.settings, action, () => this.close());
  }
}

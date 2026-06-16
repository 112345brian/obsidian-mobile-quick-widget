import type { App, TFile } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { setIcon } from 'obsidian';

import type { DashboardWidget, PulseCard, PluginSettings, QuickAction } from './PluginSettings.ts';
import type { DashboardWidgetContext, DashboardWidgetRegistry } from './DashboardWidgetApi.ts';

import { createNote } from './createNote.ts';
import { getExternalPlugin } from './externalPlugin.ts';
import { vibrate } from './haptics.ts';
import { BUILTIN_DASHBOARD_WIDGET_TYPES, normalizeDashboardWidgets } from './PluginSettings.ts';
import { executeQuickAction } from './quickActions.ts';

// ── Date helpers ─────────────────────────────────────────────────────────────

function headerDate(): string {
  return new Date()
    .toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
    .toUpperCase();
}

// ── Plugin API shims ─────────────────────────────────────────────────────────

interface TrashApi {
  getCandidates(): TFile[];
  openTriage(): Promise<void>;
}

function getTrashApi(app: App): TrashApi | null {
  const plugin = getExternalPlugin<{ api?: TrashApi }>(app, 'trash-collection');
  const api = plugin?.api;
  if (!api || typeof api.getCandidates !== 'function') return null;
  return api;
}

/**
 * The dashboard's chrome: the date/pulse-card header (not itself a removable
 * widget) plus the toggleable widget list, overdrag-to-new-note, and
 * keyboard nav. Every actual widget — built-in or third-party — is rendered
 * generically through `widgetRegistry`; this class has no special-cased
 * knowledge of any specific widget's content. Deliberately host-agnostic:
 * it knows nothing about Modal vs sidebar ItemView, it just renders into
 * whatever HTMLElement it's given and calls the injected `close` callback
 * whenever the original UI would have dismissed a modal (tapping a note,
 * tapping a command, etc). DashboardModal and DashboardView are both thin
 * hosts around this.
 */
export class DashboardContent {
  private readonly app: App;
  private readonly settings: ReadonlyDeep<PluginSettings>;
  private readonly editSettings: (mutate: (settings: PluginSettings) => void | Promise<void>) => Promise<void>;
  private readonly closeFn: () => void;
  private readonly widgetRegistry: DashboardWidgetRegistry;
  // Cleanup functions widgets registered via ctx.onCleanup, run on dispose().
  private cleanupFns: (() => void)[] = [];
  // Set on render(); reused by focusHost() to refocus a host that stays
  // alive across opens (the sidebar), where render() itself doesn't re-run.
  private host: HTMLElement | null = null;

  public constructor(
    app: App,
    settings: ReadonlyDeep<PluginSettings>,
    editSettings: (mutate: (settings: PluginSettings) => void | Promise<void>) => Promise<void>,
    closeFn: () => void,
    widgetRegistry: DashboardWidgetRegistry,
  ) {
    this.app = app;
    this.settings = settings;
    this.editSettings = editSettings;
    this.closeFn = closeFn;
    this.widgetRegistry = widgetRegistry;
  }

  private close(): void {
    this.closeFn();
  }

  /** Runs every cleanup function widgets registered via ctx.onCleanup, then
   *  clears the list. Call this from the host's onClose — e.g. a widget that
   *  subscribed to another plugin's live store needs to unsubscribe, or a
   *  Modal-hosted dashboard would leak a new subscription on every open. */
  public dispose(): void {
    for (const fn of this.cleanupFns) {
      try { fn(); } catch (err) { console.error('ReadyBoard: widget cleanup failed', err); }
    }
    this.cleanupFns = [];
  }

  /** Context handed to every widget's render function — built-in or third-party. */
  private widgetContext(): DashboardWidgetContext {
    return {
      app: this.app,
      settings: this.settings,
      getPlugin: (id) => getExternalPlugin(this.app, id),
      close: () => this.close(),
      openFile: (file) => {
        this.close();
        void this.app.workspace.getMostRecentLeaf()?.openFile(file);
      },
      vibrate,
      editSettings: this.editSettings,
      onCleanup: (fn) => { this.cleanupFns.push(fn); },
    };
  }

  /** Renders the full dashboard into `host` and wires up overdrag + keyboard nav. */
  public async render(host: HTMLElement): Promise<void> {
    this.dispose(); // in case render() is ever called again on a live instance
    host.empty();
    this.host = host;

    const scroll = host.createEl('div', { cls: 'qw-dash-scroll' });
    const inner = scroll.createEl('div', { cls: 'qw-dash' });
    if (this.settings.handedness === 'right') inner.addClass('qw-dash--right');

    // Overdrag-to-new-note indicator (hidden above content until pulled)
    const overdrag = inner.createEl('div', { cls: 'qw-overdrag' });
    overdrag.createEl('div', { cls: 'qw-overdrag-icon', text: '+' });

    const knownIds = [...new Set([...BUILTIN_DASHBOARD_WIDGET_TYPES, ...this.widgetRegistry.ids()])];
    const widgets = normalizeDashboardWidgets((this.settings.dashboardWidgets ?? []) as readonly DashboardWidget[], knownIds);

    this.renderTodaySection(inner);

    const ctx = this.widgetContext();
    for (const widget of widgets) {
      if (!widget.enabled) continue;
      const definition = this.widgetRegistry.get(widget.type);
      if (!definition) continue;
      try {
        await definition.render(inner, ctx);
      } catch (err) {
        console.error(`ReadyBoard: widget "${widget.type}" failed to render`, err);
      }
    }

    this.attachOverdrag(host, overdrag);
    this.attachKeyNav(host);
  }

  private attachKeyNav(host: HTMLElement): void {
    let idx = -1;

    const rows = (): HTMLElement[] =>
      Array.from(host.querySelectorAll<HTMLElement>('.qw-dash-note-row, .qw-dash-task-row'));

    const focus = (next: number): void => {
      const all = rows();
      all[idx]?.removeClass('qw-dash-row--focused');
      idx = Math.max(0, Math.min(next, all.length - 1));
      const el = all[idx];
      if (!el) return;
      el.addClass('qw-dash-row--focused');
      el.scrollIntoView({ block: 'nearest' });
    };

    host.addEventListener('keydown', (e: KeyboardEvent) => {
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
          const tabs = host.querySelectorAll<HTMLElement>('.qw-dash-segment-tab');
          const active = host.querySelector<HTMLElement>('.qw-dash-segment-tab--active');
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

    // Make the host focusable so keydown fires without clicking first
    if (!host.hasAttribute('tabindex')) host.setAttribute('tabindex', '-1');
    this.focusHost();
  }

  /** Re-focuses the dashboard host so arrow-key nav responds without a
   *  manual click first. Called once after the initial render, but a host
   *  that stays alive across opens (the sidebar) doesn't re-run render() on
   *  reveal — so the sidebar host calls this again itself each time it's
   *  revealed (see Plugin.revealDashboardSidebar / DashboardView.focusHost). */
  public focusHost(): void {
    const host = this.host;
    window.setTimeout(() => host?.focus(), 50);
  }

  // ── Today section (date header + pulse cards) — fixed chrome, not a widget ──

  private renderTodaySection(root: HTMLElement): void {
    const dateRow = root.createEl('div', { cls: 'qw-dash-date-row' });
    dateRow.createEl('span', { cls: 'qw-dash-date', text: `TODAY · ${headerDate()}` });

    // Reverse hand-off to the radial menu (decoupled via command dispatch).
    if (this.settings.connectSurfaces) {
      const radialBtn = dateRow.createEl('div', { cls: 'qw-dash-radial-btn', attr: { 'aria-label': 'Open radial menu' } });
      setIcon(radialBtn, 'compass');
      radialBtn.addEventListener('click', () => {
        this.close();
        this.app.commands.executeCommandById('readyboard:open-radial-menu');
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
        vibrate(8);
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
      vibrate(30);

      await new Promise<void>((r) => setTimeout(r, 320));
      this.close();
      try {
        const file = await createNote(this.app, this.settings);
        await this.app.workspace.getMostRecentLeaf()?.openFile(file);
      } catch { /* createNote already surfaced a Notice */ }
    });

    scrollEl.addEventListener('touchcancel', reset);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private async handleQuickAction(action: ReadonlyDeep<QuickAction>): Promise<void> {
    await executeQuickAction(this.app, this.settings, action, () => this.close());
  }
}

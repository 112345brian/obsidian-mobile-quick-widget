import type { App, TFile } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Menu, setIcon } from 'obsidian';

import type { DashboardWidget, PulseCard, PluginSettings, QuickAction } from './PluginSettings.ts';
import type { DashboardWidgetContext, DashboardWidgetRegistry } from './DashboardWidgetApi.ts';

import { createNote } from './createNote.ts';
import { getExternalPlugin } from './externalPlugin.ts';
import { vibrate } from './haptics.ts';
import { BUILTIN_DASHBOARD_WIDGET_TYPES, normalizeDashboardWidgets } from './PluginSettings.ts';
import { executeQuickAction } from './quickActions.ts';
import { radialLauncherWidget } from './widgets/radialLauncher.ts';

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

interface TimerStore {
  running: boolean;
  mode: 'WORK' | 'BREAK';
  remained: { millis: number; human: string };
}

interface PomodoroTimer {
  subscribe(run: (state: TimerStore) => void): () => void;
}

function getPomodoroTimer(app: App): PomodoroTimer | null {
  const plugin = getExternalPlugin<{ timer?: PomodoroTimer }>(app, 'pomodoro-timer');
  const timer = plugin?.timer;
  if (!timer || typeof timer.subscribe !== 'function') return null;
  return timer;
}

function computeStreak(files: TFile[], today: Date): number {
  const days = new Set<string>();
  for (const file of files) {
    const d = new Date(file.stat.mtime);
    days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }
  let count = 0;
  const cursor = new Date(today);
  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!days.has(key)) break;
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

function countInboxFiles(app: App, inboxPath: string): number {
  if (!inboxPath) return 0;
  return app.vault.getMarkdownFiles().filter(
    (f) => f.path.startsWith(inboxPath + '/') || f.parent?.path === inboxPath
  ).length;
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

    const ctx = this.widgetContext();
    this.renderTodaySection(inner, ctx);

    for (const widget of widgets) {
      if (!widget.enabled) continue;
      if (widget.type === 'radial') continue; // embedded in pulse grid
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

  // ── Today section (date header + pulse grid) — fixed chrome, not a widget ──

  private renderTodaySection(root: HTMLElement, ctx: DashboardWidgetContext): void {
    const dateRow = root.createEl('div', { cls: 'qw-dash-date-row' });
    dateRow.createEl('span', { cls: 'qw-dash-date', text: `TODAY · ${headerDate()}` });

    const cards = (this.settings.pulseCards ?? []).filter((c) => c.enabled);
    const radialEnabled = (this.settings.dashboardWidgets ?? []).some((w) => w.type === 'radial' && w.enabled);

    if (cards.length === 0 && !radialEnabled) return;

    // Pre-compute shared data
    const needsTrash = cards.some((c) => c.type === 'trash');
    const trashApi = needsTrash ? getTrashApi(this.app) : null;
    const trashCount = trashApi ? trashApi.getCandidates().length : 0;
    const allFiles = this.app.vault.getMarkdownFiles();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const gitPlugin = cards.some((c) => c.type === 'git')
      ? getExternalPlugin<{ gitReady: boolean }>(this.app, 'obsidian-git')
      : null;

    const streak = cards.some((c) => c.type === 'streak') ? computeStreak(allFiles, today) : 0;
    const inboxCount = cards.some((c) => c.type === 'inbox')
      ? countInboxFiles(this.app, this.settings.inboxPath ?? '')
      : 0;
    const pomodoroTimer = cards.some((c) => c.type === 'pomodoro') ? getPomodoroTimer(this.app) : null;
    let pomodoroRunning = false;
    if (pomodoroTimer) { const unsub = pomodoroTimer.subscribe((st) => { pomodoroRunning = st.running; }); unsub(); }

    const visibleCards = cards.filter((c) => {
      if (c.type === 'trash') return trashCount > 0;
      if (c.type === 'git') return gitPlugin?.gitReady === true;
      if (c.type === 'inbox') return inboxCount > 0;
      if (c.type === 'pomodoro') return pomodoroRunning;
      return true;
    });

    const grid = root.createEl('div', { cls: 'qw-dash-pulse-grid' });
    const pctx = { allFiles, today, trashApi, trashCount, streak, inboxCount };

    // 3-column grid layout. Radial anchored at (col=2, row=2).
    // Cards fill around it; the radial slot is always skipped when placing cards.
    let row = 1;
    let col = 1;
    let leftFlankerEl: HTMLElement | null = null;
    let rightFlankerEl: HTMLElement | null = null;

    for (const card of visibleCards) {
      const span = card.size ?? 1;

      // Wrap to next row if span doesn't fit
      if (col + span - 1 > 3) { row++; col = 1; }

      // Radial row (row 2) constraints: only span-1 cards can flank; skip col 2 (radial slot)
      if (radialEnabled && row === 2) {
        if (col === 1 && span > 1) { row++; col = 1; }       // span-2/3 can't flank — push below
        else if (col === 2) {
          col = 3;
          if (span > 1) { row++; col = 1; }                  // no room at col 3 either — push below
        }
      }

      const el = grid.createEl('div', { cls: 'qw-dash-pulse-card' });
      el.style.gridColumn = span === 1 ? String(col) : `${col} / span ${span}`;
      el.style.gridRow = String(row);
      this.populatePulseCard(el, card, pctx, ctx);

      if (radialEnabled && row === 2 && col === 1) leftFlankerEl = el;
      if (radialEnabled && row === 2 && col === 3) rightFlankerEl = el;

      col += span;
      if (col > 3) { col = 1; row++; }
    }

    if (radialEnabled) {
      leftFlankerEl?.addClass('qw-dash-pulse-flanker');
      rightFlankerEl?.addClass('qw-dash-pulse-flanker');

      const slot = grid.createEl('div', { cls: 'qw-dash-radial-slot' });
      slot.style.gridColumn = '2';
      slot.style.gridRow = '2';
      radialLauncherWidget.render(slot, ctx);
    }
  }

  private populatePulseCard(
    el: HTMLElement,
    card: PulseCard,
    pctx: { allFiles: TFile[]; today: Date; trashApi: TrashApi | null; trashCount: number; streak: number; inboxCount: number },
    widgetCtx: DashboardWidgetContext,
  ): void {
    const ctx = pctx;
    switch (card.type) {
      case 'daily-note': {
        el.addClass('qw-dash-pulse-card--accent');
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
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Vault' });
        el.createEl('div', { cls: 'qw-dash-pulse-value qw-dash-pulse-value--gold', text: noteStr });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: `notes · ${linkStr} links` });
        break;
      }
      case 'trash': {
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Needs review' });
        el.createEl('div', { cls: 'qw-dash-pulse-value', text: String(ctx.trashCount) });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: 'stale notes' });
        el.addEventListener('click', () => { this.close(); void ctx.trashApi?.openTriage(); });
        break;
      }
      case 'quick-action': {
        const action = card.quickAction;
        if (!action) break;
        const iconWrap = el.createEl('div', { cls: 'qw-dash-pulse-action-icon' });
        setIcon(iconWrap, action.icon || 'zap');
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: action.label });
        el.addEventListener('click', () => { void this.handleQuickAction(action); });
        break;
      }
      case 'git': {
        const git = getExternalPlugin<{
          gitReady: boolean;
          cachedStatus?: { changed: unknown[]; staged: unknown[]; conflicted: string[] };
          updateCachedStatus(): Promise<{ changed: unknown[]; staged: unknown[]; conflicted: string[] }>;
        }>(this.app, 'obsidian-git');
        if (!git?.gitReady) break;
        const status = git.cachedStatus;
        if (!status) void git.updateCachedStatus();
        const changedCount = (status?.changed.length ?? 0) + (status?.staged.length ?? 0);
        const conflictCount = status?.conflicted.length ?? 0;
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Git' });
        if (conflictCount > 0) {
          el.createEl('div', { cls: 'qw-dash-pulse-value qw-dash-pulse-value--conflict', text: String(conflictCount) });
          el.createEl('div', { cls: 'qw-dash-pulse-sub', text: `conflict${conflictCount === 1 ? '' : 's'}` });
        } else if (changedCount > 0) {
          el.createEl('div', { cls: 'qw-dash-pulse-value qw-dash-pulse-value--gold', text: String(changedCount) });
          el.createEl('div', { cls: 'qw-dash-pulse-sub', text: `change${changedCount === 1 ? '' : 's'}` });
        } else {
          el.createEl('div', { cls: 'qw-dash-pulse-value', text: '✓' });
          el.createEl('div', { cls: 'qw-dash-pulse-sub', text: 'up to date' });
        }
        el.addEventListener('click', (e) => {
          if (this.settings.gitPulseCardAction === 'menu') {
            const menu = new Menu();
            const cmds = (this.app as unknown as { commands: { commands: Record<string, { id: string; name: string }> } }).commands.commands;
            for (const cmd of Object.values(cmds)) {
              if (cmd.id.startsWith('obsidian-git:')) {
                menu.addItem((item) => item.setTitle(cmd.name).onClick(() => { this.app.commands.executeCommandById(cmd.id); }));
              }
            }
            menu.showAtMouseEvent(e);
          } else {
            this.close();
            this.app.commands.executeCommandById('obsidian-git:push');
          }
        });
        break;
      }
      case 'streak': {
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Streak' });
        el.createEl('div', { cls: 'qw-dash-pulse-value qw-dash-pulse-value--accent', text: String(ctx.streak) });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: 'days' });
        break;
      }
      case 'inbox': {
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Inbox' });
        el.createEl('div', { cls: 'qw-dash-pulse-value', text: String(ctx.inboxCount) });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: 'to process' });
        break;
      }
      case 'pomodoro': {
        const timer = getPomodoroTimer(this.app);
        if (!timer) break;
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Pomodoro' });
        const timeEl = el.createEl('div', { cls: 'qw-dash-pulse-value' });
        const subEl = el.createEl('div', { cls: 'qw-dash-pulse-sub' });
        const unsub = timer.subscribe((state) => {
          timeEl.setText(state.remained.human);
          subEl.setText(state.mode === 'WORK' ? 'focus' : 'break');
        });
        widgetCtx.onCleanup(unsub);
        break;
      }
      case 'homepage': {
        const homePath = this.settings.homePath;
        const homeFile = homePath
          ? (this.app.vault.getFileByPath(homePath) ?? this.app.metadataCache.getFirstLinkpathDest(homePath, ''))
          : null;
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

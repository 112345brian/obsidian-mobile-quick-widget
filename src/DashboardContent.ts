import type {
  App,
  EventRef,
  TFile
} from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import {
  Menu,
  Platform,
  setIcon
} from 'obsidian';

import type {
  DashboardWidgetContext,
  DashboardWidgetRegistry
} from './DashboardWidgetApi.ts';
import type {
  DashboardViewState,
  DashboardWidget,
  PluginSettings,
  PulseCard,
  QuickAction
} from './PluginSettings.ts';

import {
  createNote,
  openCreatedNoteInEditMode
} from './createNote.ts';
import { getExternalPlugin } from './externalPlugin.ts';
import { vibrate } from './haptics.ts';
import { getModifiedTime } from './notes.ts';
import {
  BUILTIN_DASHBOARD_WIDGET_TYPES,
  normalizeDashboardWidgets
} from './PluginSettings.ts';
import { executeQuickAction } from './quickActions.ts';
import { renderQuickActionIcon } from './renderQuickActionIcon.ts';
import { radialLauncherWidget } from './widgets/radialLauncher.ts';

// ── Date helpers ─────────────────────────────────────────────────────────────

interface BripeyCitationSuiteApi {
  focusReferenceListView(): Promise<void> | void;
  getCitekeysForFile(file?: TFile): Promise<string[]>;
  version: number;
}

interface GitPlugin {
  cachedStatus?: GitStatus;
  gitReady: boolean;
  updateCachedStatus?: () => Promise<GitStatus>;
}

// ── Plugin API shims ─────────────────────────────────────────────────────────

interface GitStatus {
  changed?: undefined | unknown[];
  conflicted?: undefined | unknown[];
  staged?: undefined | unknown[];
}

interface PomodoroTimer {
  subscribe(run: (state: TimerStore) => void): () => void;
}

interface PulseRenderContext {
  activeReferences: ReferenceContext;
  allFiles: TFile[];
  git: GitPlugin | null;
  gitStatus: GitStatus | undefined;
  gitStatusFresh: boolean;
  inboxCount: number;
  modifiedTodayCount: number;
  pomodoroRunningOrRecent: boolean;
  pomodoroTimer: null | PomodoroTimer;
  streak: number;
  today: Date;
  trashApi: null | TrashApi;
  trashCount: number;
}

interface ReferenceContext {
  activeFile: null | TFile;
  citekeys: string[];
}

interface TimerStore {
  elapsed?: number;
  inSession?: boolean;
  mode: 'BREAK' | 'WORK';
  remained: { human: string; millis: number };
  running: boolean;
  startTime?: null | number;
}

interface TrashApi {
  getCandidates(): TFile[];
  openTriage(): Promise<void>;
}

interface WorkspaceEvents {
  offref(ref: EventRef): void;
  on(name: string, callback: () => void): EventRef;
}

function headerDate(): string {
  return new Date()
    .toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'short' })
    .toUpperCase();
}

const POMODORO_RECENT_MS = 60 * 60 * 1000;
let pomodoroLastRelevantAt = 0;

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
  // Cleanup functions widgets registered via ctx.onCleanup, run on dispose().
  private cleanupFns: (() => void)[] = [];
  private readonly closeFn: () => void;
  private readonly editSettings: (mutate: (settings: PluginSettings) => Promise<void> | void) => Promise<void>;
  // Set on render(); reused by focusHost() to refocus a host that stays
  // Alive across opens (the sidebar), where render() itself doesn't re-run.
  private host: HTMLElement | null = null;
  private readonly isSidebar: boolean;
  private renderGeneration = 0;
  private readonly settingsProvider: () => ReadonlyDeep<PluginSettings>;

  private viewState: DashboardViewState = {};
  private readonly widgetRegistry: DashboardWidgetRegistry;

  private get settings(): ReadonlyDeep<PluginSettings> {
    return this.settingsProvider();
  }

  public constructor(
    app: App,
    settings: (() => ReadonlyDeep<PluginSettings>) | ReadonlyDeep<PluginSettings>,
    editSettings: (mutate: (settings: PluginSettings) => Promise<void> | void) => Promise<void>,
    closeFn: () => void,
    widgetRegistry: DashboardWidgetRegistry,
    isSidebar = false
  ) {
    this.app = app;
    this.settingsProvider = typeof settings === 'function' ? settings : () => settings;
    this.editSettings = editSettings;
    this.closeFn = closeFn;
    this.widgetRegistry = widgetRegistry;
    this.isSidebar = isSidebar;
  }

  /** Runs every cleanup function widgets registered via ctx.onCleanup, then
   *  clears the list. Call this from the host's onClose — e.g. a widget that
   *  subscribed to another plugin's live store needs to unsubscribe, or a
   *  Modal-hosted dashboard would leak a new subscription on every open. */
  public dispose(): void {
    this.renderGeneration++;
    for (const fn of this.cleanupFns) {
      try {
        fn();
      } catch (err) {
        console.error('ReadyBoard: widget cleanup failed', err);
      }
    }
    this.cleanupFns = [];
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

  public async refresh(): Promise<void> {
    if (!this.host) return;
    await this.render(this.host);
  }

  /** Renders the full dashboard into `host` and wires up overdrag + keyboard nav. */
  public async render(host: HTMLElement): Promise<void> {
    this.dispose(); // In case render() is ever called again on a live instance
    const generation = this.renderGeneration;
    const isCurrentRender = (): boolean => generation === this.renderGeneration;
    host.empty();
    this.host = host;
    const settings = this.surfaceSettings();

    const scroll = host.createEl('div', { cls: 'qw-dash-scroll' });
    const inner = scroll.createEl('div', { cls: 'qw-dash' });
    if (settings.handedness === 'right') inner.addClass('qw-dash--right');

    // Overdrag-to-new-note: touch-only gesture, skip entirely on desktop.
    const overdragEnabled = Platform.isMobile && settings.enableOverdrag;

    const knownIds = [...new Set([...BUILTIN_DASHBOARD_WIDGET_TYPES, ...this.widgetRegistry.ids()])];
    const rawWidgets = (settings.dashboardWidgets ?? []) as readonly DashboardWidget[];
    const widgets = normalizeDashboardWidgets(rawWidgets, knownIds);

    const ctx = this.widgetContext(settings);
    // GetBoundingClientRect is more reliable than offsetWidth for containers
    // Inside CSS-animated modals; fall back to offsetWidth for cases where
    // The sidebar leaf isn't the active tab (both return 0 for display:none,
    // Which the ResizeObserver corrects once the element becomes visible).
    const colsFor = (el: HTMLElement): number => {
      const w = el.getBoundingClientRect().width || el.offsetWidth;
      return w >= 260 ? 3 : 2;
    };
    await this.renderTodaySection(inner, ctx, widgets, colsFor(inner));
    if (!isCurrentRender()) return;

    for (const widget of widgets) {
      if (!widget.enabled) continue;
      if (widget.type === 'radial') continue; // Embedded in pulse grid
      const definition = this.widgetRegistry.get(widget.type);
      if (!definition) continue;
      try {
        await definition.render(inner, ctx);
        if (!isCurrentRender()) return;
      } catch (err) {
        if (!isCurrentRender()) return;
        console.error(`ReadyBoard: widget "${widget.type}" failed to render`, err);
      }
    }

    if (overdragEnabled) {
      const overdrag = inner.createEl('div', { cls: 'qw-overdrag' });
      overdrag.createEl('div', { cls: 'qw-overdrag-icon', text: '+' });
      this.attachOverdrag(host, overdrag);
    }
    this.attachKeyNav(host);

    // Re-render when the sidebar is resized across the 2/3-column threshold.
    let lastCols = colsFor(inner);
    let rafId = 0;
    const ro = new ResizeObserver(() => {
      const next = colsFor(inner);
      if (next !== lastCols) {
        lastCols = next;
        cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(() => {
          void this.render(host);
        });
      }
    });
    ro.observe(inner);
    this.cleanupFns.push(() => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    });
  }

  public setViewState(state: DashboardViewState): void {
    this.viewState = state;
  }

  private attachKeyNav(host: HTMLElement): void {
    let idx = -1;

    const rows = (): HTMLElement[] => Array.from(host.querySelectorAll<HTMLElement>('.qw-dash-note-row, .qw-dash-task-row'));

    const focus = (next: number): void => {
      const all = rows();
      all[idx]?.removeClass('qw-dash-row--focused');
      idx = Math.max(0, Math.min(next, all.length - 1));
      const el = all[idx];
      if (!el) return;
      el.addClass('qw-dash-row--focused');
      el.scrollIntoView({ block: 'nearest' });
    };

    const onKeyDown = (e: KeyboardEvent): void => {
      const all = rows();
      if (all.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          focus(idx < 0 ? 0 : idx + 1);
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
        case 'ArrowUp':
          e.preventDefault();
          focus(idx < 0 ? all.length - 1 : idx - 1);
          break;
        case 'Enter':
          if (idx >= 0) {
            e.preventDefault();
            all[idx]?.click();
          }
          break;
        case 'Escape':
          this.close();
          break;
      }
    };
    host.addEventListener('keydown', onKeyDown);
    this.cleanupFns.push(() => {
      host.removeEventListener('keydown', onKeyDown);
    });

    // Make the host focusable so keydown fires without clicking first
    if (!host.hasAttribute('tabindex')) host.setAttribute('tabindex', '-1');
    // Sidebar focus is managed by revealDashboardSidebar; skip here so refresh() doesn't steal focus.
    if (!this.isSidebar) this.focusHost();
  }

  private attachOverdrag(scrollEl: HTMLElement, indicator: HTMLElement): void {
    const THRESHOLD = 72;
    const icon = indicator.querySelector<HTMLElement>('.qw-overdrag-icon');
    if (!icon) return;
    let startY = 0;
    let pulling = false;
    let peaked = false;

    const reset = (): void => {
      pulling = false;
      peaked = false;
      indicator.style.marginTop = '';
      indicator.classList.remove('qw-overdrag--ready', 'qw-overdrag--fired');
    };

    const onTouchStart = (e: TouchEvent): void => {
      if (scrollEl.scrollTop <= 0) {
        startY = e.touches[0]!.clientY;
        pulling = true;
        peaked = false;
      }
    };

    const onTouchMove = (e: TouchEvent): void => {
      if (!pulling) return;
      if (scrollEl.scrollTop > 0) {
        reset();
        return;
      }
      const delta = e.touches[0]!.clientY - startY;
      if (delta <= 0) {
        reset();
        return;
      }

      e.preventDefault();

      const clamped = Math.min(delta, THRESHOLD * 1.4);
      // Slide the indicator in from above: starts at -THRESHOLD, reaches 0 at threshold
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
    };

    const onTouchEnd = async (): Promise<void> => {
      if (!pulling) return;
      if (!peaked) {
        reset();
        return;
      }

      pulling = false;
      indicator.classList.add('qw-overdrag--fired');
      vibrate(30);

      await new Promise<void>((r) => window.setTimeout(r, 320));
      this.close();
      try {
        const file = await createNote(this.app, this.settings);
        await openCreatedNoteInEditMode(this.app, file);
      } catch { /* CreateNote already surfaced a Notice */ }
    };

    scrollEl.addEventListener('touchstart', onTouchStart, { passive: true });
    scrollEl.addEventListener('touchmove', onTouchMove, { passive: false });
    scrollEl.addEventListener('touchend', onTouchEnd);
    scrollEl.addEventListener('touchcancel', reset);
    this.cleanupFns.push(() => {
      scrollEl.removeEventListener('touchstart', onTouchStart);
      scrollEl.removeEventListener('touchmove', onTouchMove);
      scrollEl.removeEventListener('touchend', onTouchEnd);
      scrollEl.removeEventListener('touchcancel', reset);
    });
  }

  private close(): void {
    this.closeFn();
  }

  private async getActiveReferences(): Promise<ReferenceContext> {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) return { activeFile: null, citekeys: [] };

    const citationApi = getCitationSuiteApi(this.app);
    if (citationApi) {
      try {
        return { activeFile, citekeys: await citationApi.getCitekeysForFile(activeFile) };
      } catch (error) {
        console.warn('ReadyBoard: failed to read references from Bripey Citation Suite API', error);
      }
    }

    try {
      const markdown = await this.app.vault.cachedRead(activeFile);
      return { activeFile, citekeys: extractCitekeys(markdown) };
    } catch (error) {
      console.warn('ReadyBoard: failed to read active file for references pulse', error);
      return { activeFile, citekeys: [] };
    }
  }

  // ── Today section (date header + pulse grid) — fixed chrome, not a widget ──

  private async handleQuickAction(action: ReadonlyDeep<QuickAction>): Promise<void> {
    await executeQuickAction(this.app, this.settings, action, () => {
      this.close();
    });
  }

  private populatePulseCard(
    el: HTMLElement,
    card: PulseCard,
    pctx: PulseRenderContext,
    widgetCtx: DashboardWidgetContext
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
          } catch { /* Plugin not installed */ }
        });
        break;
      }
      case 'git': {
        const git = ctx.git;
        if (!git?.gitReady) break;
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Git' });
        const gitValueEl = el.createEl('div', { cls: 'qw-dash-pulse-value' });
        const gitSubEl = el.createEl('div', { cls: 'qw-dash-pulse-sub' });
        const applyGitStatus = (s: GitStatus | undefined): void => {
          const changed = gitChangeCount(s);
          const conflicts = gitConflictCount(s);
          gitValueEl.className = 'qw-dash-pulse-value';
          if (conflicts > 0) {
            gitValueEl.addClass('qw-dash-pulse-value--conflict');
            gitValueEl.setText(String(conflicts));
            gitSubEl.setText(`conflict${conflicts === 1 ? '' : 's'}`);
          } else if (changed > 0) {
            gitValueEl.addClass('qw-dash-pulse-value--gold');
            gitValueEl.setText(String(changed));
            gitSubEl.setText(`change${changed === 1 ? '' : 's'}`);
          } else {
            gitValueEl.setText('✓');
            gitSubEl.setText('up to date');
          }
        };
        let refreshFrame = 0;
        let refreshInFlight = false;
        const refreshGitStatus = (forceRefresh: boolean): void => {
          if (!el.isConnected) return;
          applyGitStatus(git.cachedStatus);
          if (!forceRefresh || typeof git.updateCachedStatus !== 'function' || refreshInFlight) return;

          refreshInFlight = true;
          void git.updateCachedStatus().then((fresh) => {
            if (el.isConnected) applyGitStatus(fresh);
          }).catch((error: unknown) => {
            console.warn('ReadyBoard: failed to refresh git pulse status', error);
          }).finally(() => {
            refreshInFlight = false;
          });
        };
        const scheduleGitStatusRefresh = (forceRefresh: boolean): void => {
          cancelAnimationFrame(refreshFrame);
          refreshFrame = window.requestAnimationFrame(() => {
            refreshFrame = 0;
            refreshGitStatus(forceRefresh);
          });
        };

        applyGitStatus(ctx.gitStatus ?? git.cachedStatus);
        scheduleGitStatusRefresh(false);

        const workspaceEvents = this.app.workspace as unknown as WorkspaceEvents;
        const gitEventRefs = [
          workspaceEvents.on('obsidian-git:status-changed', () => {
            scheduleGitStatusRefresh(false);
          }),
          workspaceEvents.on('obsidian-git:refreshed', () => {
            scheduleGitStatusRefresh(true);
          }),
          workspaceEvents.on('obsidian-git:refresh', () => {
            scheduleGitStatusRefresh(false);
          }),
          workspaceEvents.on('obsidian-git:head-change', () => {
            scheduleGitStatusRefresh(true);
          })
        ];
        widgetCtx.onCleanup(() => {
          cancelAnimationFrame(refreshFrame);
          for (const ref of gitEventRefs) workspaceEvents.offref(ref);
        });

        el.addEventListener('click', (e) => {
          if (widgetCtx.settings.gitPulseCardAction === 'menu') {
            const menu = new Menu();
            const cmds = (this.app as unknown as { commands: { commands: Record<string, { id: string; name: string }> } }).commands.commands;
            for (const cmd of Object.values(cmds)) {
              if (cmd.id.startsWith('obsidian-git:')) {
                menu.addItem((item) =>
                  item.setTitle(cmd.name).onClick(() => {
                    this.app.commands.executeCommandById(cmd.id);
                    scheduleGitStatusRefresh(true);
                  })
                );
              }
            }
            menu.showAtMouseEvent(e);
          } else {
            this.close();
            this.app.commands.executeCommandById('obsidian-git:push');
            scheduleGitStatusRefresh(true);
          }
        });
        break;
      }
      case 'homepage': {
        const homePath = widgetCtx.settings.homePath;
        const homeFile = homePath
          ? (this.app.vault.getFileByPath(homePath) ?? this.app.metadataCache.getFirstLinkpathDest(homePath, ''))
          : null;
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Home' });
        const iconEl = el.createEl('div', { cls: 'qw-dash-pulse-home-icon' });
        setIcon(iconEl, 'home');
        el.addEventListener('click', () => {
          this.close();
          if (homeFile) {
            void this.app.workspace.getMostRecentLeaf()?.openFile(homeFile);
            return;
          }
          try {
            this.app.commands.executeCommandById('homepage:open');
          } catch { /* Plugin not installed */ }
        });
        break;
      }
      case 'inbox': {
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Inbox' });
        el.createEl('div', { cls: 'qw-dash-pulse-value', text: String(ctx.inboxCount) });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: 'to process' });
        break;
      }
      case 'modified-today': {
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Modified' });
        el.createEl('div', { cls: 'qw-dash-pulse-value', text: String(ctx.modifiedTodayCount) });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: 'notes today' });
        break;
      }
      case 'pomodoro': {
        const timer = ctx.pomodoroTimer;
        if (!timer) break;
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Pomodoro' });
        const timeEl = el.createEl('div', { cls: 'qw-dash-pulse-value' });
        const subEl = el.createEl('div', { cls: 'qw-dash-pulse-sub' });
        const unsub = timer.subscribe((state) => {
          rememberPomodoroActivity(state);
          timeEl.setText(state.remained.human);
          subEl.setText(state.mode === 'WORK' ? 'focus' : 'break');
        });
        widgetCtx.onCleanup(unsub);
        break;
      }
      case 'quick-action': {
        const action = card.quickAction;
        if (!action) break;
        const iconWrap = el.createEl('div', { cls: 'qw-dash-pulse-action-icon' });
        renderQuickActionIcon(iconWrap, action);
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: action.label });
        el.addEventListener('click', () => {
          void this.handleQuickAction(action);
        });
        break;
      }
      case 'references': {
        const count = ctx.activeReferences.citekeys.length;
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'References' });
        el.createEl('div', { cls: 'qw-dash-pulse-value qw-dash-pulse-value--accent', text: String(count) });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: `citekey${count === 1 ? '' : 's'}` });
        el.addEventListener('click', () => {
          const citationApi = getCitationSuiteApi(this.app);
          if (citationApi) {
            void Promise.resolve(citationApi.focusReferenceListView()).catch((error) => {
              console.warn('ReadyBoard: failed to focus Bripey Citation Suite reference list', error);
            });
            return;
          }
          const commandId = 'bripey-citation-suite:focus-reference-list-view';
          if (this.app.commands.findCommand(commandId)) {
            this.app.commands.executeCommandById(commandId);
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
      case 'trash': {
        el.createEl('div', { cls: 'qw-dash-pulse-label', text: 'Needs review' });
        el.createEl('div', { cls: 'qw-dash-pulse-value', text: String(ctx.trashCount) });
        el.createEl('div', { cls: 'qw-dash-pulse-sub', text: 'stale notes' });
        el.addEventListener('click', () => {
          this.close();
          void ctx.trashApi?.openTriage();
        });
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
    }
  }

  private async renderTodaySection(root: HTMLElement, ctx: DashboardWidgetContext, normalizedWidgets: DashboardWidget[], cols: number): Promise<void> {
    const cards = (ctx.settings.pulseCards ?? []).filter((c) => c.enabled);
    const radialEnabled = normalizedWidgets.some((w) => w.type === 'radial' && w.enabled);

    if (cards.length === 0 && !radialEnabled) return;

    const dateRow = root.createEl('div', { cls: 'qw-dash-date-row' });
    dateRow.createEl('span', { cls: 'qw-dash-date', text: `TODAY · ${headerDate()}` });

    // Pre-compute shared data
    const needsTrash = cards.some((c) => c.type === 'trash');
    const trashApi = needsTrash ? getTrashApi(this.app) : null;
    const trashCount = trashApi ? trashApi.getCandidates().length : 0;
    const allFiles = this.app.vault.getMarkdownFiles();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const gitPlugin = cards.some((c) => c.type === 'git')
      ? (getExternalPlugin<GitPlugin>(this.app, 'obsidian-git') ?? null)
      : null;
    let gitStatus = gitPlugin?.cachedStatus;
    let gitStatusFresh = false;
    if (ctx.surface !== 'sidebar' && gitPlugin?.gitReady && typeof gitPlugin.updateCachedStatus === 'function') {
      try {
        gitStatus = await gitPlugin.updateCachedStatus();
        gitStatusFresh = true;
      } catch (error) {
        console.warn('ReadyBoard: failed to refresh git pulse status', error);
      }
    }

    const modifiedTodayCount = allFiles.filter((f) => getModifiedTime(this.app, ctx.settings, f) >= today.getTime()).length;
    const streak = cards.some((c) => c.type === 'streak') ? computeStreak(allFiles, today) : 0;
    const inboxCount = cards.some((c) => c.type === 'inbox')
      ? countInboxFiles(this.app, ctx.settings.inboxPath ?? '')
      : 0;
    const pomodoroTimer = cards.some((c) => c.type === 'pomodoro') ? getPomodoroTimer(this.app) : null;
    const pomodoroState = getImmediatePomodoroState(pomodoroTimer);
    if (pomodoroState) rememberPomodoroActivity(pomodoroState);
    const pomodoroRunningOrRecent = isPomodoroStateRelevant(pomodoroState);
    const activeReferences = cards.some((c) => c.type === 'references')
      ? await this.getActiveReferences()
      : { activeFile: null, citekeys: [] };
    const contextMode = isContextPulseMode(ctx);

    const visibleCards = cards.filter((c) => {
      if (c.type === 'trash') return trashCount > 0;
      if (c.type === 'git') {
        if (contextMode) return hasRelevantGitStatus(gitStatus);
        return gitPlugin?.gitReady === true;
      }
      if (c.type === 'inbox') return inboxCount > 0;
      if (c.type === 'pomodoro') return pomodoroRunningOrRecent;
      if (c.type === 'references') return activeReferences.citekeys.length > 0;
      if (!contextMode) return true;
      if (c.type === 'modified-today') return modifiedTodayCount > 0;
      return false;
    });

    if (visibleCards.length === 0 && !radialEnabled) return;

    const grid = root.createEl('div', { cls: 'qw-dash-pulse-grid' });
    // Grid-template-columns is set from the caller-measured cols (see render()).
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    const pctx: PulseRenderContext = {
      activeReferences,
      allFiles,
      git: gitPlugin,
      gitStatus,
      gitStatusFresh,
      inboxCount,
      modifiedTodayCount,
      pomodoroRunningOrRecent,
      pomodoroTimer,
      streak,
      today,
      trashApi,
      trashCount
    };

    // In 3-col mode the radial sits at center column (col 2), row 2.
    // In 2-col mode there's no center column, so the radial spans the full row and
    // Shifts to row 3 — letting the two cards that would have flanked it (its row-2
    // Neighbours in 3-col mode) appear above it in row 2 instead.
    const RADIAL_COL = Math.min(2, cols);
    const radialFullRow = cols === 2;
    const radialGridRow = radialFullRow ? 3 : 2;

    let row = 1;
    let col = 1;
    let leftFlankerEl: HTMLElement | null = null;
    let rightFlankerEl: HTMLElement | null = null;

    for (const card of visibleCards) {
      const span = Math.min(card.size ?? 1, cols); // Clamp span to column count

      // Wrap to next row if span doesn't fit
      if (col + span - 1 > cols) {
        row++;
        col = 1;
      }

      // Radial row constraints
      if (radialEnabled && row === radialGridRow) {
        if (radialFullRow) {
          // Entire row is the radial — push pulse cards past it
          row++;
          col = 1;
        } else {
          // 3-col: only span-1 cards can flank; skip RADIAL_COL (center)
          if (col === 1 && span > 1) {
            row++;
            col = 1;
          } else if (col === RADIAL_COL) {
            col = RADIAL_COL + 1;
            if (col > cols || span > 1) {
              row++;
              col = 1;
            }
          }
        }
      }

      const el = grid.createEl('div', { cls: 'qw-dash-pulse-card' });
      el.style.gridColumn = span === 1 ? String(col) : `${col} / span ${span}`;
      el.style.gridRow = String(row);
      this.populatePulseCard(el, card, pctx, ctx);

      // Flankers only exist in 3-col mode
      if (radialEnabled && !radialFullRow && row === radialGridRow && col === 1) leftFlankerEl = el;
      if (radialEnabled && !radialFullRow && row === radialGridRow && col === cols && RADIAL_COL < cols) rightFlankerEl = el;

      col += span;
      if (col > cols) {
        col = 1;
        row++;
      }
    }

    if (radialEnabled) {
      leftFlankerEl?.addClass('qw-dash-pulse-flanker');
      rightFlankerEl?.addClass('qw-dash-pulse-flanker');

      const slot = grid.createEl('div', { cls: 'qw-dash-radial-slot' });
      slot.style.gridColumn = radialFullRow ? '1 / -1' : String(RADIAL_COL);
      slot.style.gridRow = String(radialGridRow);
      void radialLauncherWidget.render(slot, ctx);
    }
  }

  // ── Overdrag gesture ──────────────────────────────────────────────────────

  private surfaceSettings(): ReadonlyDeep<PluginSettings> {
    const base = this.settings;
    const useSidebar = this.isSidebar && base.dashboardSeparateSettings;
    const settings = useSidebar
      ? {
        ...base,
        breadcrumbField: base.sidebarBreadcrumbField,
        cardFrontmatterFields: base.sidebarCardFrontmatterFields,
        cardShowBacklinks: base.sidebarCardShowBacklinks,
        cardShowPreview: base.sidebarCardShowPreview,
        cardShowTags: base.sidebarCardShowTags,
        dashboardRadialInteraction: base.sidebarDashboardRadialInteraction,
        dashboardRadialLastMode: base.sidebarDashboardRadialLastMode,
        dashboardRadialMode: base.sidebarDashboardRadialMode,
        dashboardWidgets: base.sidebarWidgets,
        modifiedListCount: base.sidebarModifiedListCount,
        pulseCardDesktopDisplayMode: base.sidebarPulseCardDesktopDisplayMode,
        pulseCardMobileDisplayMode: base.sidebarPulseCardMobileDisplayMode,
        pulseCards: base.sidebarPulseCards ?? [],
        recentListCount: base.sidebarRecentListCount,
        showBreadcrumbs: base.sidebarShowBreadcrumbs
      } as ReadonlyDeep<PluginSettings>
      : base;

    if (Object.keys(this.viewState).length === 0) return settings;

    return {
      ...settings,
      breadcrumbField: this.viewState.breadcrumbField ?? settings.breadcrumbField,
      cardFrontmatterFields: this.viewState.cardFrontmatterFields ?? settings.cardFrontmatterFields,
      cardShowBacklinks: this.viewState.cardShowBacklinks ?? settings.cardShowBacklinks,
      cardShowPreview: this.viewState.cardShowPreview ?? settings.cardShowPreview,
      cardShowTags: this.viewState.cardShowTags ?? settings.cardShowTags,
      dashboardRadialInteraction: this.viewState.radialInteraction ?? settings.dashboardRadialInteraction,
      dashboardRadialMode: this.viewState.radialMode ?? settings.dashboardRadialMode,
      dashboardWidgets: this.viewState.widgets ?? settings.dashboardWidgets,
      modifiedListCount: this.viewState.modifiedListCount ?? settings.modifiedListCount,
      pulseCardDesktopDisplayMode: this.viewState.pulseCardDesktopDisplayMode ?? settings.pulseCardDesktopDisplayMode,
      pulseCardMobileDisplayMode: this.viewState.pulseCardMobileDisplayMode ?? settings.pulseCardMobileDisplayMode,
      pulseCards: this.viewState.pulseCards ?? settings.pulseCards,
      recentListCount: this.viewState.recentListCount ?? settings.recentListCount,
      showBreadcrumbs: this.viewState.showBreadcrumbs ?? settings.showBreadcrumbs
    };
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Context handed to every widget's render function — built-in or third-party. */
  private widgetContext(settings: ReadonlyDeep<PluginSettings>): DashboardWidgetContext {
    return {
      app: this.app,
      close: () => {
        this.close();
      },
      editSettings: this.editSettings,
      getPlugin: (id) => getExternalPlugin(this.app, id),
      onCleanup: (fn) => {
        this.cleanupFns.push(fn);
      },
      openFile: (file) => {
        this.close();
        void this.app.workspace.getMostRecentLeaf()?.openFile(file);
      },
      settings,
      surface: this.isSidebar ? 'sidebar' : 'modal',
      vibrate
    };
  }
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
    (f) => f.path.startsWith(`${inboxPath}/`) || f.parent?.path === inboxPath
  ).length;
}

function extractCitekeys(markdown: string): string[] {
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ');
  const keys = new Set<string>();
  const regex = /(?:^|[^\w])@([A-Za-z0-9][A-Za-z0-9_:.#$%&+?<>/~'-]*)(?=[,;\]\)\s]|$)/gu;
  for (const match of withoutCode.matchAll(regex)) {
    const key = match[1]?.replace(/[.,;:]+$/u, '');
    if (key) keys.add(key);
  }
  return [...keys];
}

function getCitationSuiteApi(app: App): BripeyCitationSuiteApi | null {
  const plugin = getExternalPlugin<{ api?: BripeyCitationSuiteApi }>(app, 'bripey-citation-suite');
  const api = plugin?.api;
  if (api?.version !== 1) return null;
  if (typeof api.focusReferenceListView !== 'function') return null;
  if (typeof api.getCitekeysForFile !== 'function') return null;
  return api;
}

function getImmediatePomodoroState(timer: null | PomodoroTimer): null | TimerStore {
  if (!timer) return null;
  let current: null | TimerStore = null;
  const unsubscribe = timer.subscribe((state) => {
    current = state;
  });
  unsubscribe();
  return current;
}

function getPomodoroTimer(app: App): null | PomodoroTimer {
  const plugin = getExternalPlugin<{ timer?: PomodoroTimer }>(app, 'pomodoro-timer');
  const timer = plugin?.timer;
  if (!timer || typeof timer.subscribe !== 'function') return null;
  return timer;
}

function getTrashApi(app: App): null | TrashApi {
  const plugin = getExternalPlugin<{ api?: TrashApi }>(app, 'trash-collection');
  const api = plugin?.api;
  if (!api || typeof api.getCandidates !== 'function') return null;
  return api;
}

function gitChangeCount(status: GitStatus | undefined): number {
  return gitStatusCount(status?.changed) + gitStatusCount(status?.staged);
}

function gitConflictCount(status: GitStatus | undefined): number {
  return gitStatusCount(status?.conflicted);
}

function gitStatusCount(value: undefined | unknown[]): number {
  return Array.isArray(value) ? value.length : 0;
}

function hasRelevantGitStatus(status: GitStatus | undefined): boolean {
  return gitConflictCount(status) > 0 || gitChangeCount(status) > 0;
}

function isContextPulseMode(ctx: DashboardWidgetContext): boolean {
  const mode = Platform.isMobile
    ? (ctx.settings.pulseCardMobileDisplayMode ?? 'always')
    : (ctx.settings.pulseCardDesktopDisplayMode ?? 'contextual');
  return mode === 'contextual';
}

function isPomodoroStateRelevant(state: null | TimerStore, now = Date.now()): boolean {
  if (!state) return false;
  if (state.running) return true;
  const startTime = typeof state.startTime === 'number' ? state.startTime : null;
  if (state.inSession && startTime !== null && now - startTime <= POMODORO_RECENT_MS) return true;
  return pomodoroLastRelevantAt > 0 && now - pomodoroLastRelevantAt <= POMODORO_RECENT_MS;
}

function rememberPomodoroActivity(state: TimerStore): void {
  if (state.running || state.inSession || (state.elapsed ?? 0) > 0) {
    pomodoroLastRelevantAt = Date.now();
  }
}

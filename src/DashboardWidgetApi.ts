import type { App, TFile } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import type { DashboardViewState, PluginSettings } from './PluginSettings.ts';

/**
 * Everything a third-party widget's render function needs. Built fresh on
 * every render call by whichever surface (Modal or sidebar) is currently
 * showing the dashboard, so `close`/`openFile` always do the right thing
 * for that surface (dismiss the modal vs collapse the sidebar) without the
 * widget needing to know which one it's in.
 */
export interface DashboardWidgetContext {
  app: App;
  settings: ReadonlyDeep<PluginSettings>;
  /** Which dashboard surface is rendering this widget. Useful when a widget
   *  persists surface-specific state. */
  surface: 'modal' | 'sidebar';
  /** Looks up another installed plugin's instance by its manifest id —
   *  Obsidian's plugin registry isn't part of the public API, so this wraps
   *  the unsafe cast in one place. Returns undefined if that plugin isn't
   *  installed/enabled. You're still responsible for validating the shape
   *  of what comes back (the id is a string Obsidian gives you, not a type
   *  Obsidian guarantees) — see src/widgets/git.ts or pomodoro.ts for the
   *  pattern: cast to the surface you expect, then check the specific
   *  fields/methods you're about to use actually exist before calling them. */
  getPlugin: <T>(id: string) => T | undefined;
  /** Dismisses the dashboard (closes the modal, or collapses the sidebar). */
  close: () => void;
  /** Convenience for the common "tap a note" pattern: closes the dashboard,
   *  then opens `file` in the most recent leaf. */
  openFile: (file: TFile) => void;
  /** Short haptic pulse. No-op on platforms without vibration support. */
  vibrate: (durationMs: number) => void;
  /** Persists a settings change — mutate the live settings object, then it's
   *  written to disk. Useful for a widget that wants to remember its own
   *  bit of state (a selected filter, a last-used mode, etc) the same way
   *  ReadyBoard's own built-in widgets do. You don't need to await it
   *  unless you want to know when the save completes. */
  editSettings: (mutate: (settings: PluginSettings) => void | Promise<void>) => Promise<void>;
  /** Registers a cleanup function (e.g. to unsubscribe from another plugin's
   *  live store) that runs when this dashboard surface closes. Needed for
   *  any widget that sets up a subscription or timer in `render` — without
   *  this, a Modal-hosted widget would leak a new subscription every time
   *  the dashboard is reopened. Not needed for widgets that only attach
   *  plain DOM event listeners, since those are discarded with the DOM
   *  on close/re-render. */
  onCleanup: (fn: () => void) => void;
}

export interface DashboardWidgetDefinition {
  /** Unique id. Stored verbatim in settings.dashboardWidgets[].type, so it
   *  must be stable across your plugin's versions. Namespace it (e.g.
   *  "my-plugin-streaks") to avoid colliding with another plugin's widget
   *  or a future built-in. */
  id: string;
  /** Shown as the toggle's label in ReadyBoard's dashboard settings. */
  label: string;
  /** Render the widget's content into `root`. May be async — e.g. a widget
   *  that needs to read a file before it has anything to show. Called once
   *  per dashboard render with a fresh `root` each time; do your own
   *  cleanup (event listeners etc.) the same way the rest of the dashboard
   *  does, since `root` is discarded on the next render/close.
   *
   *  If your widget shows something that changes on its own (a countdown,
   *  another plugin's live state), prefer subscribing directly to that
   *  source's own reactive API if it has one (e.g. a Svelte store) — don't
   *  duplicate timing logic a plugin already owns. A sidebar's "collapse" is
   *  purely visual; it doesn't tear down your view or pause your
   *  subscription, so a plain subscribe-and-redraw stays accurate the whole
   *  time the dashboard is hidden. Only fall back to your own
   *  `setInterval`/`requestAnimationFrame` loop if the source has no
   *  push-based way to observe changes. Either way, tear down via
   *  `ctx.onCleanup`. */
  render: (root: HTMLElement, ctx: DashboardWidgetContext) => void | Promise<void>;
}

/**
 * Holds every dashboard widget that isn't a ReadyBoard built-in. One
 * instance is owned by the Plugin and shared by every DashboardContent
 * instance (Modal and sidebar alike), so a widget registered while a
 * dashboard is open shows up the next time that dashboard re-renders
 * without needing a reload.
 */
export class DashboardWidgetRegistry {
  private readonly widgets = new Map<string, DashboardWidgetDefinition>();

  /**
   * Registers a widget. Returns an unregister function — call it from your
   * plugin's `onunload`, or hand it to `this.register(...)` (Component's
   * own cleanup helper) so the widget disappears cleanly if your plugin is
   * disabled while a dashboard is open. Registering the same `id` again
   * replaces the previous definition (useful for hot-reload during dev).
   */
  public register(definition: DashboardWidgetDefinition): () => void {
    this.widgets.set(definition.id, definition);
    return () => {
      if (this.widgets.get(definition.id) === definition) this.widgets.delete(definition.id);
    };
  }

  public get(id: string): DashboardWidgetDefinition | undefined {
    return this.widgets.get(id);
  }

  public list(): DashboardWidgetDefinition[] {
    return [...this.widgets.values()];
  }

  public ids(): string[] {
    return [...this.widgets.keys()];
  }
}

/**
 * ReadyBoard's public surface for other plugins. Access it via:
 *
 * ```ts
 * const readyBoard = app.plugins.plugins['readyboard'] as { api?: ReadyBoardApi } | undefined;
 * const unregister = readyBoard?.api?.registerWidget({
 *   id: 'my-plugin-streaks',
 *   label: 'Writing Streak',
 *   render: (root, ctx) => {
 *     root.createEl('div', { text: `${myStreak()} day streak` });
 *   },
 * });
 * // later, e.g. in your plugin's onunload:
 * unregister?.();
 * ```
 *
 * Until you call `registerWidget`, ReadyBoard doesn't know your widget
 * exists. Once you do, it appears as a disabled-by-default toggle in
 * ReadyBoard's dashboard settings — the user opts in like any built-in.
 */
export interface ReadyBoardApi {
  openDashboardSidebar(state?: DashboardViewState): void;
  registerWidget(definition: DashboardWidgetDefinition): () => void;
}

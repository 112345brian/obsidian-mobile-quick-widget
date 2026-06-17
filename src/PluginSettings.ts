export type QuickActionType = 'new-note' | 'homepage' | 'command' | 'append-to-note';

// 'lucide' (default): icon is a Lucide icon name, rendered via setIcon.
// 'glyph': icon is literal text/unicode (e.g. ✦), rendered as-is.
export type QuickActionIconType = 'lucide' | 'glyph';

export interface QuickAction {
  label: string;
  icon: string;
  iconType?: QuickActionIconType;
  action: QuickActionType;
  commandId?: string;
  notePath?: string;
  appendTemplate?: string;
}

export const QUICK_ACTION_DEFAULTS: QuickAction[] = [
  { label: 'New note', icon: 'file-plus', action: 'new-note' },
  { label: 'Home', icon: 'home', action: 'homepage' },
];

// The radial's Commands mode: six fixed slot positions [12,2,4,6,8,10 o'clock].
export const RADIAL_COMMAND_DEFAULTS: QuickAction[] = [
  { label: 'Capture',   icon: '✦', iconType: 'glyph', action: 'new-note' },
  { label: 'New note',  icon: '⊕', iconType: 'glyph', action: 'new-note' },
  { label: 'Search',    icon: '⌕', iconType: 'glyph', action: 'command', commandId: 'global-search:open' },
  { label: 'Backlinks', icon: '⟵', iconType: 'glyph', action: 'command', commandId: 'backlink:open' },
  { label: 'Graph',     icon: '◎', iconType: 'glyph', action: 'command', commandId: 'graph:open' },
  { label: 'Daily',     icon: '◈', iconType: 'glyph', action: 'command', commandId: 'daily-notes:goto-today' },
];

// Not a closed union — third-party plugins can register their own widget
// ids via the public API (see DashboardWidgetApi.ts) and they're stored
// here the same way built-ins are.
export type DashboardWidgetType = string;

// The built-in widget ids — must mirror BUILTIN_WIDGETS in widgets/index.ts.
// (Note: vault "trash"/needs-review surfaces as a Pulse Card, not a
// dashboard widget — there's no 'trash' widget type.)
export const BUILTIN_DASHBOARD_WIDGET_TYPES: DashboardWidgetType[] = [
  'radial', 'graph', 'continue', 'tasks', 'more-actions', 'pomodoro',
];

// Renamed widget ids — old saved values are rewritten on load.
const WIDGET_ID_RENAMES: Record<string, string> = {
  'new-note': 'more-actions',
};

export interface DashboardWidget {
  type: DashboardWidgetType;
  enabled: boolean;
}

export type DashboardPreset = 'focus' | 'full' | 'triage';

export const DASHBOARD_PRESETS: Record<DashboardPreset, { label: string; widgets: DashboardWidget[] }> = {
  focus: {
    label: 'Focus',
    widgets: [
      { type: 'continue', enabled: true },
      { type: 'tasks', enabled: false },
      { type: 'new-note', enabled: true },
    ],
  },
  full: {
    label: 'Full',
    widgets: [
      { type: 'radial', enabled: true },
      { type: 'graph', enabled: false },
      { type: 'continue', enabled: true },
      { type: 'tasks', enabled: false },
      { type: 'new-note', enabled: false },
    ],
  },
  triage: {
    label: 'Triage',
    widgets: [
      { type: 'continue', enabled: true },
      { type: 'tasks', enabled: false },
      { type: 'new-note', enabled: true },
    ],
  },
};

// Inserts any widget id from `knownIds` that's missing from the user's saved
// list (e.g. a built-in added after they last saved, or a third-party widget
// that just registered) as newly-available but OFF by default. Never drops
// an existing entry, even an id outside `knownIds` — that id might belong to
// a plugin that just hasn't finished loading yet, and dropping it would look
// to the user like the plugin silently deleted their widget.
export function normalizeDashboardWidgets(
  widgets: readonly DashboardWidget[],
  knownIds: readonly string[] = BUILTIN_DASHBOARD_WIDGET_TYPES,
): DashboardWidget[] {
  // Rename pass: rewrite stale ids before anything else touches the list.
  const renamed = widgets.map((w) =>
    WIDGET_ID_RENAMES[w.type] ? { ...w, type: WIDGET_ID_RENAMES[w.type] as string } : w,
  );

  const output: DashboardWidget[] = [];
  const seen = new Set<string>();
  const hasSavedRadial = renamed.some((widget) => widget.type === 'radial');

  for (const widget of renamed) {
    if (seen.has(widget.type)) continue;
    if (widget.type === 'graph' && widget.enabled && !hasSavedRadial && knownIds.includes('radial')) {
      output.push({ type: 'radial', enabled: true });
      seen.add('radial');
      output.push({ type: 'graph', enabled: false });
      seen.add('graph');
      continue;
    }
    output.push({ type: widget.type, enabled: widget.enabled });
    seen.add(widget.type);
  }

  for (const type of knownIds) {
    if (!seen.has(type)) {
      output.push({ type, enabled: false });
      seen.add(type);
    }
  }

  return output;
}

export type NewNoteFilenameFormat = 'untitled' | 'zettelkasten' | 'custom';

export type PulseCardType = 'daily-note' | 'modified-today' | 'vault' | 'trash' | 'quick-action' | 'homepage' | 'git' | 'streak' | 'inbox' | 'pomodoro';

export interface PulseCard {
  type: PulseCardType;
  enabled: boolean;
  quickAction?: QuickAction; // only for type === 'quick-action'
  size?: 1 | 2 | 3; // column span in the 3-col pulse grid, default 1
}

export const PULSE_CARD_LABELS: Record<PulseCardType, string> = {
  'daily-note': 'Daily Note',
  'modified-today': 'Modified Today',
  'vault': 'Vault Stats',
  'trash': 'Trash (conditional)',
  'quick-action': 'Quick Action',
  'homepage': 'Homepage',
  'git': 'Git Status (conditional)',
  'streak': 'Streak',
  'inbox': 'Inbox (conditional)',
  'pomodoro': 'Pomodoro (conditional)',
};

export const DEFAULT_PULSE_CARDS: PulseCard[] = [
  { type: 'daily-note', enabled: true },
  { type: 'modified-today', enabled: true },
  { type: 'vault', enabled: true },
  { type: 'homepage', enabled: false },
];

export class PluginSettings {
  public homePath = '';
  public newNoteFolder = '';
  public newNoteTemplate = '';
  public continueExcluded: string[] = [];
  public quickActions: QuickAction[] = QUICK_ACTION_DEFAULTS.map((a) => ({ ...a }));
  public newNoteFilenameFormat: NewNoteFilenameFormat = 'untitled';
  public newNoteFilenameCustom = '';
  public pulseCards: PulseCard[] = DEFAULT_PULSE_CARDS.map((c) => ({ ...c }));
  public dashboardWidgets: DashboardWidget[] = DASHBOARD_PRESETS.full.widgets.map((w) => ({ ...w }));
  public modifiedDateField = '';
  public handedness: 'left' | 'right' = 'left';
  public recentListCount = 15;
  public modifiedListCount = 15;
  public showBreadcrumbs = false;
  public breadcrumbField = '';
  public radialDefaultMode: RadialMode = 'breadcrumbs';
  public radialRememberLast = false;
  public radialLastMode: RadialMode = 'breadcrumbs';
  public dashboardRadialMode: RadialMode = 'breadcrumbs';
  public dashboardRadialLastMode: RadialMode = 'breadcrumbs';
  public dashboardRadialInteraction: DashboardRadialInteraction = 'press-hold';
  public connectSurfaces = true;
  public radialCommands: QuickAction[] = RADIAL_COMMAND_DEFAULTS.map((c) => ({ ...c }));
  public dashboardSidebarSide: 'left' | 'right' = 'right';
  public gitPulseCardAction: 'sync' | 'menu' = 'sync';
  public enableOverdrag = true;
  public cardShowTags = false;
  public cardShowPreview = true;
  public cardShowBacklinks = true;
  public cardFrontmatterFields: string[] = [];
  public inboxPath = '';
}

export type RadialMode = 'breadcrumbs' | 'commands' | 'recents';

// 'press-hold': touch/pen press the center to reveal the ring, drag to a slot
//   and release to select, release elsewhere (or cancel) to collapse. Mouse and
//   keyboard activation open the ring as a stable expanded state for desktop.
// 'tap-toggle': tap the center to open and it stays open; tap a slot to
//   select; tap the center again to cycle modes; double-tap the center
//   (or tap outside the ring) to collapse.
export type DashboardRadialInteraction = 'press-hold' | 'tap-toggle';

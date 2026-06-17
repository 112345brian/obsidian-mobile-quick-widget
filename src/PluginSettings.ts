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
      { type: 'more-actions', enabled: true },
    ],
  },
  full: {
    label: 'Full',
    widgets: [
      { type: 'radial', enabled: true },
      { type: 'graph', enabled: false },
      { type: 'continue', enabled: true },
      { type: 'tasks', enabled: false },
      { type: 'more-actions', enabled: false },
    ],
  },
  triage: {
    label: 'Triage',
    widgets: [
      { type: 'continue', enabled: true },
      { type: 'tasks', enabled: false },
      { type: 'more-actions', enabled: true },
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
  public dashboardSeparateSettings = false;
  public sidebarPulseCards: PulseCard[] = [];
  public sidebarWidgets: DashboardWidget[] = [];
  public sidebarRecentListCount = 15;
  public sidebarModifiedListCount = 15;
  public sidebarDashboardRadialMode: RadialMode = 'breadcrumbs';
  public sidebarDashboardRadialLastMode: RadialMode = 'breadcrumbs';
  public sidebarDashboardRadialInteraction: DashboardRadialInteraction = 'press-hold';
  public sidebarShowBreadcrumbs = false;
  public sidebarBreadcrumbField = '';
  public sidebarCardShowTags = false;
  public sidebarCardShowPreview = true;
  public sidebarCardShowBacklinks = true;
  public sidebarCardFrontmatterFields: string[] = [];
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

export interface DashboardViewState {
  breadcrumbField?: string;
  cardFrontmatterFields?: string[];
  cardShowBacklinks?: boolean;
  cardShowPreview?: boolean;
  cardShowTags?: boolean;
  modifiedListCount?: number;
  pulseCards?: PulseCard[];
  radialInteraction?: DashboardRadialInteraction;
  radialMode?: RadialMode;
  recentListCount?: number;
  showBreadcrumbs?: boolean;
  widgets?: DashboardWidget[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function positiveInteger(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : undefined;
}

function stringArray(value: unknown): string[] | undefined {
  return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : undefined;
}

function radialMode(value: unknown): RadialMode | undefined {
  return value === 'breadcrumbs' || value === 'commands' || value === 'recents' ? value : undefined;
}

function dashboardRadialInteraction(value: unknown): DashboardRadialInteraction | undefined {
  return value === 'press-hold' || value === 'tap-toggle' ? value : undefined;
}

function dashboardWidgets(value: unknown): DashboardWidget[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const widgets: DashboardWidget[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item['type'] !== 'string' || typeof item['enabled'] !== 'boolean') continue;
    widgets.push({ type: item['type'], enabled: item['enabled'] });
  }
  return widgets;
}

function pulseCards(value: unknown): PulseCard[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const cards: PulseCard[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item['type'] !== 'string' || typeof item['enabled'] !== 'boolean') continue;
    if (!(item['type'] in PULSE_CARD_LABELS)) continue;
    const size = item['size'];
    const card: PulseCard = {
      type: item['type'] as PulseCardType,
      enabled: item['enabled'],
    };
    if (size === 1 || size === 2 || size === 3) card.size = size;
    const quickAction = item['quickAction'];
    if (card.type === 'quick-action' && isRecord(quickAction) && typeof quickAction['label'] === 'string' && typeof quickAction['icon'] === 'string') {
      const action: QuickAction = {
        label: quickAction['label'],
        icon: quickAction['icon'],
        iconType: quickAction['iconType'] === 'glyph' ? 'glyph' : 'lucide',
        action: quickAction['action'] === 'homepage' || quickAction['action'] === 'command' || quickAction['action'] === 'append-to-note'
          ? quickAction['action']
          : 'new-note',
      };
      if (typeof quickAction['commandId'] === 'string') action.commandId = quickAction['commandId'];
      if (typeof quickAction['notePath'] === 'string') action.notePath = quickAction['notePath'];
      if (typeof quickAction['appendTemplate'] === 'string') action.appendTemplate = quickAction['appendTemplate'];
      card.quickAction = action;
    }
    cards.push(card);
  }
  return cards;
}

export function normalizeDashboardViewState(state: unknown): DashboardViewState {
  if (!isRecord(state)) return {};

  const normalized: DashboardViewState = {};
  const recentListCount = positiveInteger(state['recentListCount']);
  const modifiedListCount = positiveInteger(state['modifiedListCount']);
  const widgets = dashboardWidgets(state['widgets']);
  const cards = pulseCards(state['pulseCards']);
  const mode = radialMode(state['radialMode'] ?? state['dashboardRadialMode']);
  const interaction = dashboardRadialInteraction(state['radialInteraction'] ?? state['dashboardRadialInteraction']);
  const fields = stringArray(state['cardFrontmatterFields']);

  if (recentListCount !== undefined) normalized.recentListCount = recentListCount;
  if (modifiedListCount !== undefined) normalized.modifiedListCount = modifiedListCount;
  if (widgets) normalized.widgets = widgets;
  if (cards) normalized.pulseCards = cards;
  if (mode) normalized.radialMode = mode;
  if (interaction) normalized.radialInteraction = interaction;
  if (fields) normalized.cardFrontmatterFields = fields;

  for (const key of ['showBreadcrumbs', 'cardShowTags', 'cardShowPreview', 'cardShowBacklinks'] as const) {
    if (typeof state[key] === 'boolean') normalized[key] = state[key];
  }

  if (typeof state['breadcrumbField'] === 'string') normalized.breadcrumbField = state['breadcrumbField'].trim();

  return normalized;
}

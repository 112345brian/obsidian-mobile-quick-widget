export interface QuickAction {
  action: QuickActionType;
  appendTemplate?: string;
  commandId?: string;
  icon: string;
  iconType?: QuickActionIconType;
  label: string;
  notePath?: string;
}

// 'lucide' (default): icon is a Lucide icon name, rendered via setIcon.
// 'glyph': icon is literal text/unicode (e.g. ✦), rendered as-is.
export type QuickActionIconType = 'glyph' | 'lucide';

export type QuickActionType = 'append-to-note' | 'command' | 'homepage' | 'new-note';

export const QUICK_ACTION_DEFAULTS: QuickAction[] = [
  { action: 'new-note', icon: 'file-plus', label: 'New note' },
  { action: 'homepage', icon: 'home', label: 'Home' }
];

// The radial's Commands mode: six fixed slot positions [12,2,4,6,8,10 o'clock].
export const RADIAL_COMMAND_DEFAULTS: QuickAction[] = [
  { action: 'new-note', icon: '✦', iconType: 'glyph', label: 'Capture' },
  { action: 'new-note', icon: '⊕', iconType: 'glyph', label: 'New note' },
  { action: 'command', commandId: 'global-search:open', icon: '⌕', iconType: 'glyph', label: 'Search' },
  { action: 'command', commandId: 'backlink:open', icon: '⟵', iconType: 'glyph', label: 'Backlinks' },
  { action: 'command', commandId: 'graph:open', icon: '◎', iconType: 'glyph', label: 'Graph' },
  { action: 'command', commandId: 'daily-notes:goto-today', icon: '◈', iconType: 'glyph', label: 'Daily' }
];

// Not a closed union — third-party plugins can register their own widget
// Ids via the public API (see DashboardWidgetApi.ts) and they're stored
// Here the same way built-ins are.
export type DashboardWidgetType = string;

// The built-in widget ids — must mirror BUILTIN_WIDGETS in widgets/index.ts.
// (Note: vault "trash"/needs-review surfaces as a Pulse Card, not a
// Dashboard widget — there's no 'trash' widget type.)
export const BUILTIN_DASHBOARD_WIDGET_TYPES: DashboardWidgetType[] = [
  'radial',
  'graph',
  'continue',
  'tasks',
  'more-actions',
  'pomodoro'
];

// Renamed widget ids — old saved values are rewritten on load.
const WIDGET_ID_RENAMES: Record<string, string> = {
  'new-note': 'more-actions'
};

export type DashboardPreset = 'focus' | 'full' | 'triage';

export interface DashboardWidget {
  enabled: boolean;
  type: DashboardWidgetType;
}

export const DASHBOARD_PRESETS: Record<DashboardPreset, { label: string; widgets: DashboardWidget[] }> = {
  focus: {
    label: 'Focus',
    widgets: [
      { enabled: true, type: 'continue' },
      { enabled: false, type: 'tasks' },
      { enabled: true, type: 'more-actions' }
    ]
  },
  full: {
    label: 'Full',
    widgets: [
      { enabled: true, type: 'radial' },
      { enabled: false, type: 'graph' },
      { enabled: true, type: 'continue' },
      { enabled: false, type: 'tasks' },
      { enabled: false, type: 'more-actions' }
    ]
  },
  triage: {
    label: 'Triage',
    widgets: [
      { enabled: true, type: 'continue' },
      { enabled: false, type: 'tasks' },
      { enabled: true, type: 'more-actions' }
    ]
  }
};

export type LegacyPulseCardDisplayMode = 'contextual-desktop' | PulseCardDisplayMode;

export type NewNoteFilenameFormat = 'custom' | 'untitled' | 'zettelkasten';

export interface PulseCard {
  enabled: boolean;
  quickAction?: QuickAction; // Only for type === 'quick-action'
  size?: 1 | 2 | 3; // Column span in the 3-col pulse grid, default 1
  type: PulseCardType;
}
export type PulseCardDisplayMode = 'always' | 'contextual';
export type PulseCardType =
  | 'daily-note'
  | 'git'
  | 'homepage'
  | 'inbox'
  | 'modified-today'
  | 'pomodoro'
  | 'quick-action'
  | 'references'
  | 'streak'
  | 'trash'
  | 'vault';

// Inserts any widget id from `knownIds` that's missing from the user's saved
// List (e.g. a built-in added after they last saved, or a third-party widget
// That just registered) as newly-available but OFF by default. Never drops
// An existing entry, even an id outside `knownIds` — that id might belong to
// A plugin that just hasn't finished loading yet, and dropping it would look
// To the user like the plugin silently deleted their widget.
export function normalizeDashboardWidgets(
  widgets: readonly DashboardWidget[],
  knownIds: readonly string[] = BUILTIN_DASHBOARD_WIDGET_TYPES
): DashboardWidget[] {
  // Rename pass: rewrite stale ids before anything else touches the list.
  const renamed = widgets.map((w) => WIDGET_ID_RENAMES[w.type] ? { ...w, type: WIDGET_ID_RENAMES[w.type]! } : w);

  const output: DashboardWidget[] = [];
  const seen = new Set<string>();
  const hasSavedRadial = renamed.some((widget) => widget.type === 'radial');

  for (const widget of renamed) {
    if (seen.has(widget.type)) { continue; }
    if (widget.type === 'graph' && widget.enabled && !hasSavedRadial && knownIds.includes('radial')) {
      output.push({ enabled: true, type: 'radial' });
      seen.add('radial');
      output.push({ enabled: false, type: 'graph' });
      seen.add('graph');
      continue;
    }
    output.push({ enabled: widget.enabled, type: widget.type });
    seen.add(widget.type);
  }

  for (const type of knownIds) {
    if (!seen.has(type)) {
      output.push({ enabled: false, type });
      seen.add(type);
    }
  }

  return output;
}

export const PULSE_CARD_LABELS: Record<PulseCardType, string> = {
  'daily-note': 'Daily Note',
  'git': 'Git Status (conditional)',
  'homepage': 'Homepage',
  'inbox': 'Inbox (conditional)',
  'modified-today': 'Modified Today',
  'pomodoro': 'Pomodoro (conditional)',
  'quick-action': 'Quick Action',
  'references': 'References (conditional)',
  'streak': 'Streak',
  'trash': 'Trash (conditional)',
  'vault': 'Vault Stats'
};

export const DEFAULT_PULSE_CARDS: PulseCard[] = [
  { enabled: true, type: 'daily-note' },
  { enabled: true, type: 'modified-today' },
  { enabled: true, type: 'vault' },
  { enabled: true, type: 'trash' },
  { enabled: true, type: 'git' },
  { enabled: true, type: 'pomodoro' },
  { enabled: true, type: 'references' },
  { enabled: false, type: 'homepage' }
];

// 'press-hold': touch/pen press the center to reveal the ring, drag to a slot
//   And release to select, release elsewhere (or cancel) to collapse. Mouse and
//   Keyboard activation open the ring as a stable expanded state for desktop.
// 'tap-toggle': tap the center to open and it stays open; tap a slot to
//   Select; tap the center again to cycle modes; double-tap the center
//   (or tap outside the ring) to collapse.
export type DashboardRadialInteraction = 'press-hold' | 'tap-toggle';

export interface DashboardViewState {
  breadcrumbField?: string;
  cardFrontmatterFields?: string[];
  cardShowBacklinks?: boolean;
  cardShowPreview?: boolean;
  cardShowTags?: boolean;
  modifiedListCount?: number;
  pulseCardDesktopDisplayMode?: PulseCardDisplayMode;
  pulseCardMobileDisplayMode?: PulseCardDisplayMode;
  pulseCards?: PulseCard[];
  radialInteraction?: DashboardRadialInteraction;
  radialMode?: RadialMode;
  recentListCount?: number;
  showBreadcrumbs?: boolean;
  widgets?: DashboardWidget[];
}

export type RadialMode = 'breadcrumbs' | 'commands' | 'recents';

export class PluginSettings {
  public breadcrumbField = '';
  public cardFrontmatterFields: string[] = [];
  public cardShowBacklinks = true;
  public cardShowPreview = true;
  public cardShowTags = false;
  public connectSurfaces = true;
  public continueExcluded: string[] = [];
  public dashboardRadialInteraction: DashboardRadialInteraction = 'press-hold';
  public dashboardRadialLastMode: RadialMode = 'breadcrumbs';
  public dashboardRadialMode: RadialMode = 'breadcrumbs';
  public dashboardSeparateSettings = false;
  public dashboardSidebarSide: 'left' | 'right' = 'right';
  public dashboardWidgets: DashboardWidget[] = DASHBOARD_PRESETS.full.widgets.map((w) => ({ ...w }));
  public enableOverdrag = true;
  public gitPulseCardAction: 'menu' | 'sync' = 'sync';
  public handedness: 'left' | 'right' = 'left';
  public homePath = '';
  public inboxPath = '';
  public modifiedDateField = '';
  public modifiedListCount = 15;
  public newNoteFilenameCustom = '';
  public newNoteFilenameFormat: NewNoteFilenameFormat = 'untitled';
  public newNoteFolder = '';
  public newNoteTemplate = '';
  public pulseCardDesktopDisplayMode: PulseCardDisplayMode = 'contextual';
  public pulseCardMobileDisplayMode: PulseCardDisplayMode = 'always';
  public pulseCards: PulseCard[] = DEFAULT_PULSE_CARDS.map((c) => ({ ...c }));
  public quickActions: QuickAction[] = QUICK_ACTION_DEFAULTS.map((a) => ({ ...a }));
  public radialCommands: QuickAction[] = RADIAL_COMMAND_DEFAULTS.map((c) => ({ ...c }));
  public radialDefaultMode: RadialMode = 'breadcrumbs';
  public radialLastMode: RadialMode = 'breadcrumbs';
  public radialRememberLast = false;
  public recentListCount = 15;
  public showBreadcrumbs = false;
  public sidebarBreadcrumbField = '';
  public sidebarCardFrontmatterFields: string[] = [];
  public sidebarCardShowBacklinks = true;
  public sidebarCardShowPreview = true;
  public sidebarCardShowTags = false;
  public sidebarDashboardRadialInteraction: DashboardRadialInteraction = 'press-hold';
  public sidebarDashboardRadialLastMode: RadialMode = 'breadcrumbs';
  public sidebarDashboardRadialMode: RadialMode = 'breadcrumbs';
  public sidebarModifiedListCount = 15;
  public sidebarPulseCardDesktopDisplayMode: PulseCardDisplayMode = 'contextual';
  public sidebarPulseCardMobileDisplayMode: PulseCardDisplayMode = 'always';
  public sidebarPulseCards: PulseCard[] = [];
  public sidebarRecentListCount = 15;
  public sidebarShowBreadcrumbs = false;
  public sidebarWidgets: DashboardWidget[] = [];
}

export function normalizeDashboardViewState(state: unknown): DashboardViewState {
  if (!isRecord(state)) { return {}; }

  const normalized: DashboardViewState = {};
  const recentListCount = positiveInteger(state['recentListCount']);
  const modifiedListCount = positiveInteger(state['modifiedListCount']);
  const widgets = dashboardWidgets(state['widgets']);
  const cards = pulseCards(state['pulseCards']);
  const legacyDisplayMode = legacyPulseCardDisplayMode(state['pulseCardDisplayMode'] ?? state['pulseDisplayMode']);
  const desktopDisplayMode = pulseCardDisplayMode(state['pulseCardDesktopDisplayMode'] ?? state['desktopPulseCardDisplayMode']);
  const mobileDisplayMode = pulseCardDisplayMode(state['pulseCardMobileDisplayMode'] ?? state['mobilePulseCardDisplayMode']);
  const mode = radialMode(state['radialMode'] ?? state['dashboardRadialMode']);
  const interaction = dashboardRadialInteraction(state['radialInteraction'] ?? state['dashboardRadialInteraction']);
  const fields = stringArray(state['cardFrontmatterFields']);

  if (recentListCount !== undefined) { normalized.recentListCount = recentListCount; }
  if (modifiedListCount !== undefined) { normalized.modifiedListCount = modifiedListCount; }
  if (widgets) { normalized.widgets = widgets; }
  if (cards) { normalized.pulseCards = cards; }
  if (legacyDisplayMode) {
    normalized.pulseCardDesktopDisplayMode = legacyDisplayMode.desktop;
    normalized.pulseCardMobileDisplayMode = legacyDisplayMode.mobile;
  }
  if (desktopDisplayMode) { normalized.pulseCardDesktopDisplayMode = desktopDisplayMode; }
  if (mobileDisplayMode) { normalized.pulseCardMobileDisplayMode = mobileDisplayMode; }
  if (mode) { normalized.radialMode = mode; }
  if (interaction) { normalized.radialInteraction = interaction; }
  if (fields) { normalized.cardFrontmatterFields = fields; }

  for (const key of ['showBreadcrumbs', 'cardShowTags', 'cardShowPreview', 'cardShowBacklinks'] as const) {
    if (typeof state[key] === 'boolean') { normalized[key] = state[key]; }
  }

  if (typeof state['breadcrumbField'] === 'string') { normalized.breadcrumbField = state['breadcrumbField'].trim(); }

  return normalized;
}

function dashboardRadialInteraction(value: unknown): DashboardRadialInteraction | undefined {
  return value === 'press-hold' || value === 'tap-toggle' ? value : undefined;
}

function dashboardWidgets(value: unknown): DashboardWidget[] | undefined {
  if (!Array.isArray(value)) { return undefined; }
  const widgets: DashboardWidget[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item['type'] !== 'string' || typeof item['enabled'] !== 'boolean') { continue; }
    widgets.push({ enabled: item['enabled'], type: item['type'] });
  }
  return widgets;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function legacyPulseCardDisplayMode(value: unknown): { desktop: PulseCardDisplayMode; mobile: PulseCardDisplayMode } | undefined {
  if (value === 'always') { return { desktop: 'always', mobile: 'always' }; }
  if (value === 'contextual') { return { desktop: 'contextual', mobile: 'contextual' }; }
  if (value === 'contextual-desktop') { return { desktop: 'contextual', mobile: 'always' }; }
  return undefined;
}

function positiveInteger(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : undefined;
}

function pulseCardDisplayMode(value: unknown): PulseCardDisplayMode | undefined {
  return value === 'always' || value === 'contextual' ? value : undefined;
}

function pulseCards(value: unknown): PulseCard[] | undefined {
  if (!Array.isArray(value)) { return undefined; }
  const cards: PulseCard[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item['type'] !== 'string' || typeof item['enabled'] !== 'boolean') { continue; }
    if (!(item['type'] in PULSE_CARD_LABELS)) { continue; }
    const size = item['size'];
    const card: PulseCard = {
      enabled: item['enabled'],
      type: item['type'] as PulseCardType
    };
    if (size === 1 || size === 2 || size === 3) { card.size = size; }
    const quickAction = item['quickAction'];
    if (card.type === 'quick-action' && isRecord(quickAction) && typeof quickAction['label'] === 'string' && typeof quickAction['icon'] === 'string') {
      const action: QuickAction = {
        action: quickAction['action'] === 'homepage' || quickAction['action'] === 'command' || quickAction['action'] === 'append-to-note'
          ? quickAction['action']
          : 'new-note',
        icon: quickAction['icon'],
        iconType: quickAction['iconType'] === 'glyph' ? 'glyph' : 'lucide',
        label: quickAction['label']
      };
      if (typeof quickAction['commandId'] === 'string') { action.commandId = quickAction['commandId']; }
      if (typeof quickAction['notePath'] === 'string') { action.notePath = quickAction['notePath']; }
      if (typeof quickAction['appendTemplate'] === 'string') { action.appendTemplate = quickAction['appendTemplate']; }
      card.quickAction = action;
    }
    cards.push(card);
  }
  return cards;
}

function radialMode(value: unknown): RadialMode | undefined {
  return value === 'breadcrumbs' || value === 'commands' || value === 'recents' ? value : undefined;
}

function stringArray(value: unknown): string[] | undefined {
  return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : undefined;
}

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

export type DashboardWidgetType = 'continue' | 'new-note' | 'trash' | 'graph' | 'tasks';

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
      { type: 'trash', enabled: false },
    ],
  },
  full: {
    label: 'Full',
    widgets: [
      { type: 'graph', enabled: true },
      { type: 'continue', enabled: true },
      { type: 'tasks', enabled: false },
      { type: 'trash', enabled: true },
      { type: 'new-note', enabled: false },
    ],
  },
  triage: {
    label: 'Triage',
    widgets: [
      { type: 'trash', enabled: true },
      { type: 'continue', enabled: true },
      { type: 'tasks', enabled: false },
      { type: 'new-note', enabled: true },
    ],
  },
};

export const WIDGET_LABELS: Record<DashboardWidgetType, string> = {
  continue: 'Recently Touched',
  graph: 'Active Cluster (graph)',
  trash: 'Needs Review',
  'new-note': 'More Actions',
  tasks: 'Open Tasks',
};

export type NewNoteFilenameFormat = 'untitled' | 'zettelkasten' | 'custom';

export type PulseCardType = 'daily-note' | 'modified-today' | 'vault' | 'trash' | 'quick-action' | 'homepage';

export interface PulseCard {
  type: PulseCardType;
  enabled: boolean;
  quickAction?: QuickAction; // only for type === 'quick-action'
}

export const PULSE_CARD_LABELS: Record<PulseCardType, string> = {
  'daily-note': 'Daily Note',
  'modified-today': 'Modified Today',
  'vault': 'Vault Stats',
  'trash': 'Trash (conditional)',
  'quick-action': 'Quick Action',
  'homepage': 'Homepage',
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
  public connectSurfaces = true;
  public radialCommands: QuickAction[] = RADIAL_COMMAND_DEFAULTS.map((c) => ({ ...c }));
}

export type RadialMode = 'breadcrumbs' | 'commands' | 'recents';

export interface SliceConfig {
  label: string;
  icon: string;
  // SVG screen coords: 0°=right, 90°=down, 180°=left, 270°=up
  // Default layout: bottom half (0→180) = cancel, top-left (180→270) = home, top-right (270→360) = new note
  startAngle: number;
  endAngle: number;
  color: string;
  action: 'cancel' | 'command' | 'dashboard' | 'homepage' | 'new-note';
  commandId?: string;
}

export type QuickActionType = 'new-note' | 'homepage' | 'command' | 'append-to-note';

export interface QuickAction {
  label: string;
  icon: string;
  action: QuickActionType;
  commandId?: string;
  notePath?: string;
  appendTemplate?: string;
}

export const QUICK_ACTION_DEFAULTS: QuickAction[] = [
  { label: 'New note', icon: 'file-plus', action: 'new-note' },
  { label: 'Home', icon: 'home', action: 'homepage' },
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

export type NewNoteFilenameFormat = 'untitled' | 'zettelkasten';

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
  public pulseCards: PulseCard[] = DEFAULT_PULSE_CARDS.map((c) => ({ ...c }));
  public slices: SliceConfig[] = [
    { label: 'Cancel', icon: '✕', action: 'cancel', color: '#666666', startAngle: 0, endAngle: 180 },
    { label: 'Home', icon: '⌂', action: 'homepage', color: '#3b82f6', startAngle: 180, endAngle: 270 },
    { label: 'New Note', icon: '+', action: 'new-note', color: '#10b981', startAngle: 270, endAngle: 360 },
  ];
  public dashboardWidgets: DashboardWidget[] = DASHBOARD_PRESETS.full.widgets.map((w) => ({ ...w }));
  public modifiedDateField = '';
  public handedness: 'left' | 'right' = 'left';
  public recentListCount = 15;
  public modifiedListCount = 15;
  public showBreadcrumbs = false;
  public breadcrumbField = '';
}

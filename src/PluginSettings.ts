export interface SliceConfig {
  label: string;
  icon: string;
  // SVG screen coords: 0°=right, 90°=down, 180°=left, 270°=up
  // Default layout: bottom half (0→180) = cancel, top-left (180→270) = home, top-right (270→360) = new note
  startAngle: number;
  endAngle: number;
  color: string;
  action: 'cancel' | 'command' | 'homepage' | 'new-note';
  commandId?: string;
}

export class PluginSettings {
  public homePath = '';
  public newNoteFolder = '';
  public slices: SliceConfig[] = [
    { label: 'Cancel', icon: '✕', action: 'cancel', color: '#666666', startAngle: 0, endAngle: 180 },
    { label: 'Home', icon: '⌂', action: 'homepage', color: '#3b82f6', startAngle: 180, endAngle: 270 },
    { label: 'New Note', icon: '+', action: 'new-note', color: '#10b981', startAngle: 270, endAngle: 360 },
  ];
}

import { setIcon } from 'obsidian';

import type { QuickActionIconType } from './PluginSettings.ts';

export function renderQuickActionIcon(
  root: HTMLElement,
  action: { icon?: string; iconType?: QuickActionIconType | undefined },
  fallbackIcon = 'zap'
): void {
  const icon = action.icon || fallbackIcon;
  if (action.iconType === 'glyph') {
    root.empty();
    root.addClass('qw-action-icon--glyph');
    root.removeClass('qw-action-icon--lucide');
    root.setText(icon);
    return;
  }

  root.empty();
  root.addClass('qw-action-icon--lucide');
  root.removeClass('qw-action-icon--glyph');
  setIcon(root, icon);
}

export function renderSlotIcon(root: HTMLElement, icon: string, iconType?: QuickActionIconType): void {
  renderQuickActionIcon(root, { icon, iconType });
}

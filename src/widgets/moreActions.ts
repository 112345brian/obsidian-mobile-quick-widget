import { setIcon } from 'obsidian';

import type { DashboardWidgetContext, DashboardWidgetDefinition } from '../DashboardWidgetApi.ts';

import { executeQuickAction } from '../quickActions.ts';

function render(root: HTMLElement, ctx: DashboardWidgetContext): void {
  const actions = ctx.settings.quickActions ?? [];
  if (actions.length === 0) return;

  root.createEl('div', { cls: 'qw-dash-section-label', text: 'MORE ACTIONS' });
  const row = root.createEl('div', { cls: 'qw-dash-actions' });

  for (const action of actions) {
    const btn = row.createEl('button', { cls: 'qw-dash-action-btn' });
    const iconEl = btn.createEl('span', { cls: 'qw-dash-action-icon' });
    setIcon(iconEl, action.icon || 'zap');
    btn.createEl('span', { text: action.label });
    btn.addEventListener('click', () => { void executeQuickAction(ctx.app, ctx.settings, action, ctx.close); });
  }
}

export const moreActionsWidget: DashboardWidgetDefinition = {
  id: 'new-note',
  label: 'More Actions',
  render,
};

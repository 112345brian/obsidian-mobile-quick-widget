import { PluginBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-base';

import type { ReadyBoardApi } from './DashboardWidgetApi.ts';
import type { PluginSettings } from './PluginSettings.ts';
import type { PluginTypes } from './PluginTypes.ts';

import { DashboardWidgetRegistry } from './DashboardWidgetApi.ts';
import { DashboardModal } from './Modals/DashboardModal.ts';
import { RadialMenuV3Modal } from './Modals/RadialMenuV3Modal.ts';
import { PluginSettingsManager } from './PluginSettingsManager.ts';
import { PluginSettingsTab } from './PluginSettingsTab.ts';
import { DashboardView, VIEW_TYPE_DASHBOARD } from './Views/DashboardView.ts';
import { BUILTIN_WIDGETS } from './widgets/index.ts';

export class Plugin extends PluginBase<PluginTypes> {
  /** Holds every dashboard widget — built-ins and third-party alike, through
   *  the exact same registration mechanism. Shared by every Dashboard
   *  surface (Modal and sidebar) so a widget registered while one is open
   *  appears the next time that surface re-renders, with no reload needed. */
  public readonly dashboardWidgetRegistry = new DashboardWidgetRegistry();

  /** Public surface for other plugins. Access via:
   *  `app.plugins.plugins['readyboard']?.api?.registerWidget(...)` */
  public readonly api: ReadyBoardApi = {
    registerWidget: (definition) => this.dashboardWidgetRegistry.register(definition),
  };

  public openRadialV3(): void {
    new RadialMenuV3Modal(this.app, this.settings, this.editSettings.bind(this), this.dashboardWidgetRegistry).open();
  }

  public openDashboard(): void {
    new DashboardModal(this.app, this.settings, this.editSettings.bind(this), this.dashboardWidgetRegistry).open();
  }

  public openDashboardSidebar(): void {
    void this.revealDashboardSidebar();
  }

  private async revealDashboardSidebar(): Promise<void> {
    const { workspace } = this.app;
    const existing = workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD)[0];
    if (existing) {
      await workspace.revealLeaf(existing);
      (existing.view as DashboardView).focusHost();
      return;
    }
    const side = this.settings.dashboardSidebarSide === 'left' ? workspace.getLeftLeaf(false) : workspace.getRightLeaf(false);
    if (!side) return;
    await side.setViewState({ type: VIEW_TYPE_DASHBOARD, active: true });
    await workspace.revealLeaf(side);
    (side.view as DashboardView).focusHost();
  }

  /** Generic settings-mutation hook handed to RadialMenuV3Modal, DashboardModal,
   *  and DashboardView alike — and from there into every dashboard widget's
   *  context as `ctx.editSettings`. */
  private async editSettings(mutate: (settings: PluginSettings) => void | Promise<void>): Promise<void> {
    try {
      await this.settingsManager.editAndSave(mutate);
    } catch (error) {
      console.error('ReadyBoard: failed to save settings', error);
    }
  }

  protected override createSettingsManager(): PluginSettingsManager {
    return new PluginSettingsManager(this);
  }

  protected override createSettingsTab(): PluginSettingsTab {
    return new PluginSettingsTab(this);
  }

  protected override async onloadImpl(): Promise<void> {
    await super.onloadImpl();

    for (const widget of BUILTIN_WIDGETS) {
      this.dashboardWidgetRegistry.register(widget);
    }

    this.registerView(
      VIEW_TYPE_DASHBOARD,
      (leaf) => new DashboardView(leaf, this.settings, this.editSettings.bind(this), this.dashboardWidgetRegistry),
    );

    this.addCommand({
      callback: () => { this.openRadialV3(); },
      id: 'open-radial-menu',
      name: 'Open radial menu'
    });

    this.addCommand({
      callback: () => { this.openDashboard(); },
      id: 'open-dashboard',
      name: 'Open dashboard'
    });

    this.addCommand({
      callback: () => { this.openDashboardSidebar(); },
      id: 'open-dashboard-sidebar',
      name: 'Open dashboard in sidebar'
    });
  }

  protected override async onunloadImpl(): Promise<void> {
    await super.onunloadImpl();
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_DASHBOARD);
  }
}

import { PluginBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-base';
import type { ExtractReadonlyPluginSettingsWrapper } from 'obsidian-dev-utils/obsidian/plugin/plugin-types-base';

import type { ReadyBoardApi } from './DashboardWidgetApi.ts';
import type { DashboardViewState, PluginSettings } from './PluginSettings.ts';
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
    openDashboardSidebar: (state) => { this.openDashboardSidebar(state); },
    registerWidget: (definition) => this.dashboardWidgetRegistry.register(definition),
  };

  public openRadialV3(): void {
    new RadialMenuV3Modal(this.app, this.settings, this.editSettings.bind(this), this.dashboardWidgetRegistry).open();
  }

  public openDashboard(): void {
    new DashboardModal(this.app, () => this.settings, this.editSettings.bind(this), this.dashboardWidgetRegistry).open();
  }

  public openDashboardSidebar(state?: DashboardViewState): void {
    void this.revealDashboardSidebar(state);
  }

  private async revealDashboardSidebar(state?: DashboardViewState): Promise<void> {
    const { workspace } = this.app;
    const existing = workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD)[0];
    if (existing) {
      if (state !== undefined) {
        await existing.setViewState({ type: VIEW_TYPE_DASHBOARD, active: true, state: { ...state } });
      } else {
        await (existing.view as DashboardView).refresh();
      }
      await workspace.revealLeaf(existing);
      (existing.view as DashboardView).focusHost();
      return;
    }
    const side = this.settings.dashboardSidebarSide === 'left'
      ? (workspace.getLeftLeaf(false) ?? workspace.getLeftLeaf(true))
      : (workspace.getRightLeaf(false) ?? workspace.getRightLeaf(true));
    if (!side) return;
    await side.setViewState({ type: VIEW_TYPE_DASHBOARD, active: true, state: state ? { ...state } : {} });
    await workspace.revealLeaf(side);
    (side.view as DashboardView).focusHost();
  }

  private async refreshDashboardSidebars(): Promise<void> {
    await Promise.all(
      this.app.workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD).map(async (leaf) => {
        if (leaf.view instanceof DashboardView) await leaf.view.refresh();
      }),
    );
  }

  /** Generic settings-mutation hook handed to RadialMenuV3Modal, DashboardModal,
   *  and DashboardView alike — and from there into every dashboard widget's
   *  context as `ctx.editSettings`. */
  private async editSettings(mutate: (settings: PluginSettings) => void | Promise<void>): Promise<void> {
    try {
      await this.settingsManager.editAndSave(mutate, { source: 'dashboard-runtime' });
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
      (leaf) => new DashboardView(leaf, () => this.settings, this.editSettings.bind(this), this.dashboardWidgetRegistry),
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

  protected override async onLoadSettings(
    _loadedSettings: ExtractReadonlyPluginSettingsWrapper<PluginTypes>,
    isInitialLoad: boolean,
  ): Promise<void> {
    if (!isInitialLoad) await this.refreshDashboardSidebars();
  }

  protected override async onSaveSettings(
    _newSettings: ExtractReadonlyPluginSettingsWrapper<PluginTypes>,
    _oldSettings: ExtractReadonlyPluginSettingsWrapper<PluginTypes>,
    context: unknown,
  ): Promise<void> {
    if (typeof context === 'object' && context !== null && (context as { source?: unknown }).source === 'dashboard-runtime') return;
    await this.refreshDashboardSidebars();
  }
}

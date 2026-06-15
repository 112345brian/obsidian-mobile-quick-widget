import { Platform } from 'obsidian';
import { PluginBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-base';

import type { PluginTypes } from './PluginTypes.ts';

import { DashboardModal } from './Modals/DashboardModal.ts';
import { RadialMenuModal } from './Modals/RadialMenuModal.ts';
import { PluginSettingsManager } from './PluginSettingsManager.ts';
import { PluginSettingsTab } from './PluginSettingsTab.ts';

export class Plugin extends PluginBase<PluginTypes> {
  protected override createSettingsManager(): PluginSettingsManager {
    return new PluginSettingsManager(this);
  }

  protected override createSettingsTab(): PluginSettingsTab {
    return new PluginSettingsTab(this);
  }

  protected override async onloadImpl(): Promise<void> {
    await super.onloadImpl();
    if (!Platform.isMobile && !document.body.hasClass('is-mobile')) return;

    this.addCommand({
      callback: () => { new RadialMenuModal(this.app, this.settings).open(); },
      id: 'open-quick-menu',
      name: 'Open Quick Menu'
    });

    this.addCommand({
      callback: () => { new DashboardModal(this.app, this.settings).open(); },
      id: 'open-dashboard',
      name: 'Open Dashboard'
    });
  }
}

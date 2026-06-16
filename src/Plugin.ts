import { PluginBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-base';

import type { RadialMode } from './PluginSettings.ts';
import type { PluginTypes } from './PluginTypes.ts';

import { DashboardModal } from './Modals/DashboardModal.ts';
import { RadialMenuV3Modal } from './Modals/RadialMenuV3Modal.ts';
import { PluginSettingsManager } from './PluginSettingsManager.ts';
import { PluginSettingsTab } from './PluginSettingsTab.ts';

export class Plugin extends PluginBase<PluginTypes> {
  public openRadialV3(): void {
    const saveLastMode = (mode: RadialMode): void => {
      this.settingsManager.editAndSave((settings) => {
        settings.radialLastMode = mode;
      }).catch((error: unknown) => {
        console.error('Failed to save radial mode', error);
      });
    };
    new RadialMenuV3Modal(this.app, this.settings, saveLastMode).open();
  }

  protected override createSettingsManager(): PluginSettingsManager {
    return new PluginSettingsManager(this);
  }

  protected override createSettingsTab(): PluginSettingsTab {
    return new PluginSettingsTab(this);
  }

  protected override async onloadImpl(): Promise<void> {
    await super.onloadImpl();

    this.addCommand({
      callback: () => { this.openRadialV3(); },
      id: 'open-radial-menu',
      name: 'Open radial menu'
    });

    this.addCommand({
      callback: () => { new DashboardModal(this.app, this.settings).open(); },
      id: 'open-dashboard',
      name: 'Open dashboard'
    });
  }
}

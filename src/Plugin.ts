import { Platform } from 'obsidian';
import { PluginBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-base';

import type { PluginTypes } from './PluginTypes.ts';
import type { RadialMode } from './PluginSettings.ts';

import { DashboardModal } from './Modals/DashboardModal.ts';
import { RadialMenuV3Modal } from './Modals/RadialMenuV3Modal.ts';
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
      callback: () => { this.openRadialV3(); },
      id: 'open-radial-menu',
      name: 'Open Radial Menu'
    });

    this.addCommand({
      callback: () => { new DashboardModal(this.app, this.settings).open(); },
      id: 'open-dashboard',
      name: 'Open Dashboard'
    });
  }

  public openRadialV3(): void {
    const saveLastMode = (mode: RadialMode): void => {
      void this.settingsManager.editAndSave((s) => { s.radialLastMode = mode; });
    };
    new RadialMenuV3Modal(this.app, this.settings, saveLastMode).open();
  }
}

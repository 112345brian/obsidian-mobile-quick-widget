import { Setting } from 'obsidian';
import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-settings-tab-base';

import type { PluginTypes } from './PluginTypes.ts';

import { ReadyBoardSettingsModal } from './SettingsModal.ts';

export class PluginSettingsTab extends PluginSettingsTabBase<PluginTypes> {
  public override display(): void {
    this.containerEl.empty();
    new Setting(this.containerEl)
      .setName('ReadyBoard Settings')
      .setDesc('Pulse cards, dashboard widgets, radial menu, quick actions, and more.')
      .addButton((btn) => {
        btn.setButtonText('Open Settings').setCta().onClick(() => {
          new ReadyBoardSettingsModal(this.plugin).open();
        });
      });
  }
}

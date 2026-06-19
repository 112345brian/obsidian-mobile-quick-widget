import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-settings-tab-base';

import type { PluginTypes } from './PluginTypes.ts';

import { ReadyBoardSettingsModal } from './SettingsModal.ts';

export class PluginSettingsTab extends PluginSettingsTabBase<PluginTypes> {
  private settingsModal: null | ReadyBoardSettingsModal = null;

  public override display(): void {
    this.containerEl.addClass('qw-settings-modal');
    if (!this.settingsModal) { this.settingsModal = new ReadyBoardSettingsModal(this.plugin); }
    this.settingsModal.renderInto(this.containerEl);
  }
}

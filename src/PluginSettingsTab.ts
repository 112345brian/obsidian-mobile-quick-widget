import type { SettingDefinitionItem } from 'obsidian';

import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-settings-tab-base';

import type { PluginTypes } from './PluginTypes.ts';

import {
  ActionsSettingsPage,
  DashboardSettingsPage,
  GeneralSettingsPage,
  PulseSettingsPage,
  RadialSettingsPage
} from './SettingsPages.ts';

export class PluginSettingsTab extends PluginSettingsTabBase<PluginTypes> {
  /** Declarative settings (Obsidian 1.13.0+). Each entry is a navigable
   *  page — the old tab bar's five tabs — backed by a `SettingPage`
   *  subclass, since this plugin's settings surface (drag-free reorder
   *  buttons, the SVG radial slot preview, mixed-layout pulse card rows,
   *  etc.) doesn't map onto the flat control/render row model. */
  public override getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      { name: 'General', page: () => new GeneralSettingsPage(this.plugin), type: 'page' },
      { name: 'Pulse Cards', page: () => new PulseSettingsPage(this.plugin), type: 'page' },
      { name: 'Dashboard', page: () => new DashboardSettingsPage(this.plugin), type: 'page' },
      { name: 'Radial', page: () => new RadialSettingsPage(this.plugin), type: 'page' },
      { name: 'Quick Actions', page: () => new ActionsSettingsPage(this.plugin), type: 'page' }
    ];
  }
}

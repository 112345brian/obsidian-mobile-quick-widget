import { PluginSettingsManagerBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-settings-manager-base';

import type { PluginTypes } from './PluginTypes.ts';

import { PluginSettings } from './PluginSettings.ts';

// Tracks every field rename so saved values survive version bumps.
// Add a new entry here whenever a setting key is renamed, never delete old entries.
const RENAMES: [oldKey: string, newKey: keyof PluginSettings][] = [
  ['parentField',  'breadcrumbField'],
  ['showParents',  'showBreadcrumbs'],
];

export class PluginSettingsManager extends PluginSettingsManagerBase<PluginTypes> {
  protected override createDefaultSettings(): PluginSettings {
    return new PluginSettings();
  }

  protected override registerLegacySettingsConverters(): void {
    for (const [oldKey, newKey] of RENAMES) {
      this.registerLegacySettingsConverter(
        class { [k: string]: unknown },
        (legacy: Record<string, unknown>) => {
          if (oldKey in legacy && !(newKey in legacy)) {
            (legacy as Record<string, unknown>)[newKey] = legacy[oldKey];
          }
        },
      );
    }
  }
}

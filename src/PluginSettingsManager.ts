import { PluginSettingsManagerBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-settings-manager-base';

import type { PluginTypes } from './PluginTypes.ts';

import { PluginSettings } from './PluginSettings.ts';

// Tracks every field rename so saved values survive version bumps.
// Add a new entry here whenever a setting key is renamed, never delete old entries.
const RENAMES: [oldKey: string, newKey: keyof PluginSettings][] = [
  ['parentField',  'breadcrumbField'],
  ['showParents',  'showBreadcrumbs'],
];

// Tracks every field that was removed outright (no replacement) so its stale
// value gets cleaned out of data.json instead of lingering forever.
// Add a new entry here whenever a setting key is deleted, never delete old entries.
const REMOVALS: string[] = [
  'slices',
];

export class PluginSettingsManager extends PluginSettingsManagerBase<PluginTypes> {
  protected override createDefaultSettings(): PluginSettings {
    return new PluginSettings();
  }

  protected override registerLegacySettingsConverters(): void {
    for (const [oldKey, newKey] of RENAMES) {
      // The legacy class must declare oldKey as an own property — the base class
      // uses Object.keys(new legacySettingsClass()) to decide which stale keys
      // to delete from the saved record after the converter runs.
      class LegacySettings { [k: string]: unknown; public [oldKey] = undefined; }

      this.registerLegacySettingsConverter(
        LegacySettings,
        (legacy: Record<string, unknown>) => {
          if (oldKey in legacy && !(newKey in legacy)) {
            (legacy as Record<string, unknown>)[newKey] = legacy[oldKey];
          }
        },
      );
    }

    for (const oldKey of REMOVALS) {
      // No replacement key, so the converter is a no-op — the base class's
      // cleanup pass deletes oldKey from the saved record simply because it's
      // declared here but no longer a property of PluginSettings.
      class LegacySettings { [k: string]: unknown; public [oldKey] = undefined; }
      this.registerLegacySettingsConverter(LegacySettings, () => { /* no-op: pure removal */ });
    }
  }
}

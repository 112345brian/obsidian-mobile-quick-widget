import { PluginSettingsManagerBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-settings-manager-base';

import type { PluginTypes } from './PluginTypes.ts';

import { PluginSettings } from './PluginSettings.ts';

// Tracks every field rename so saved values survive version bumps.
// Add a new entry here whenever a setting key is renamed, never delete old entries.
const RENAMES: [oldKey: string, newKey: keyof PluginSettings][] = [
  ['parentField', 'breadcrumbField'],
  ['showParents', 'showBreadcrumbs']
];

// Tracks every field that was removed outright (no replacement) so its stale
// Value gets cleaned out of data.json instead of lingering forever.
// Add a new entry here whenever a setting key is deleted, never delete old entries.
const REMOVALS: string[] = [
  'slices'
];

const LEGACY_PULSE_DISPLAY_MODES: [
  oldKey: string,
  desktopKey: keyof PluginSettings,
  mobileKey: keyof PluginSettings
][] = [
  ['pulseCardDisplayMode', 'pulseCardDesktopDisplayMode', 'pulseCardMobileDisplayMode'],
  ['sidebarPulseCardDisplayMode', 'sidebarPulseCardDesktopDisplayMode', 'sidebarPulseCardMobileDisplayMode']
];

export class PluginSettingsManager extends PluginSettingsManagerBase<PluginTypes> {
  protected override createDefaultSettings(): PluginSettings {
    return new PluginSettings();
  }

  protected override registerLegacySettingsConverters(): void {
    for (const [oldKey, newKey] of RENAMES) {
      // The legacy class must declare oldKey as an own property — the base class
      // Uses Object.keys(new legacySettingsClass()) to decide which stale keys
      // To delete from the saved record after the converter runs.
      class LegacySettings {
        [k: string]: unknown;
        public [oldKey] = undefined;
      }

      this.registerLegacySettingsConverter(
        LegacySettings,
        (legacy: Record<string, unknown>) => {
          if (oldKey in legacy && !(newKey in legacy)) {
            legacy[newKey] = legacy[oldKey];
          }
        }
      );
    }

    for (const oldKey of REMOVALS) {
      // No replacement key, so the converter is a no-op — the base class's
      // Cleanup pass deletes oldKey from the saved record simply because it's
      // Declared here but no longer a property of PluginSettings.
      class LegacySettings {
        [k: string]: unknown;
        public [oldKey] = undefined;
      }
      this.registerLegacySettingsConverter(LegacySettings, () => { /* No-op: pure removal */ });
    }

    for (const [oldKey, desktopKey, mobileKey] of LEGACY_PULSE_DISPLAY_MODES) {
      class LegacySettings {
        [k: string]: unknown;
        public [oldKey] = undefined;
      }
      this.registerLegacySettingsConverter(
        LegacySettings,
        (legacy: Record<string, unknown>) => {
          const modes = normalizeLegacyPulseDisplayMode(legacy[oldKey]);
          if (!modes) { return; }
          if (!(desktopKey in legacy)) { legacy[desktopKey] = modes.desktop; }
          if (!(mobileKey in legacy)) { legacy[mobileKey] = modes.mobile; }
        }
      );
    }
  }
}

function normalizeLegacyPulseDisplayMode(value: unknown): { desktop: 'always' | 'contextual'; mobile: 'always' | 'contextual' } | null {
  if (value === 'always') { return { desktop: 'always', mobile: 'always' }; }
  if (value === 'contextual') { return { desktop: 'contextual', mobile: 'contextual' }; }
  if (value === 'contextual-desktop') { return { desktop: 'contextual', mobile: 'always' }; }
  return null;
}

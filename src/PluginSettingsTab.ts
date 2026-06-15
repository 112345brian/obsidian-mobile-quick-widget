import { Setting } from 'obsidian';
import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-settings-tab-base';

import type { SliceConfig } from './PluginSettings.ts';
import type { PluginTypes } from './PluginTypes.ts';

import { PluginSettings } from './PluginSettings.ts';

export class PluginSettingsTab extends PluginSettingsTabBase<PluginTypes> {
  public override display(): void {
    this.containerEl.empty();

    const s = this.plugin.settings as PluginSettings;

    new Setting(this.containerEl)
      .setName('Homepage file path')
      .setDesc('Path to your home note, e.g. "Home.md" or "Notes/Index.md"')
      .addText((text) => {
        text
          .setPlaceholder('Home.md')
          .setValue(s.homePath)
          .onChange((val) => {
            s.homePath = val.trim();
            void this.plugin.settingsManager.saveToFile();
          });
      });

    new Setting(this.containerEl)
      .setName('New note folder')
      .setDesc('Folder for new notes. Leave blank for vault root.')
      .addText((text) => {
        text
          .setPlaceholder('Inbox')
          .setValue(s.newNoteFolder)
          .onChange((val) => {
            s.newNoteFolder = val.trim();
            void this.plugin.settingsManager.saveToFile();
          });
      });

    this.containerEl.createEl('h3', { text: 'Slices' });
    this.containerEl.createEl('p', {
      cls: 'setting-item-description',
      text: 'Angles use SVG screen coordinates: 0°=right, 90°=bottom, 180°=left, 270°=top. Default layout: bottom half (0→180) = cancel, top-left (180→270) = home, top-right (270→360) = new note.',
    });

    const slices = s.slices as SliceConfig[];
    for (let i = 0; i < slices.length; i++) {
      this.renderSlice(slices, i);
    }

    new Setting(this.containerEl)
      .addButton((btn) => {
        btn.setButtonText('Add slice').setCta().onClick(() => {
          slices.push({
            label: 'New Slice',
            icon: '★',
            action: 'cancel',
            color: '#888888',
            startAngle: 0,
            endAngle: 90,
          });
          void this.plugin.settingsManager.saveToFile();
          this.display();
        });
      })
      .addButton((btn) => {
        btn.setButtonText('Reset to defaults').onClick(() => {
          (this.plugin.settings as PluginSettings).slices = new PluginSettings().slices;
          void this.plugin.settingsManager.saveToFile();
          this.display();
        });
      });
  }

  private renderSlice(slices: SliceConfig[], i: number): void {
    const slice = slices[i];
    if (!slice) return;

    const save = (): void => { void this.plugin.settingsManager.saveToFile(); };

    this.containerEl.createEl('h4', { text: `Slice ${i + 1}: ${slice.label}` });

    new Setting(this.containerEl)
      .setName('Label')
      .addText((t) => { t.setValue(slice.label).onChange((v) => { slice.label = v; save(); }); });

    new Setting(this.containerEl)
      .setName('Icon')
      .setDesc('Emoji or single character')
      .addText((t) => { t.setValue(slice.icon).onChange((v) => { slice.icon = v; save(); }); });

    new Setting(this.containerEl)
      .setName('Action')
      .addDropdown((dd) => {
        dd
          .addOption('cancel', 'Cancel (close menu)')
          .addOption('homepage', 'Open homepage')
          .addOption('new-note', 'Create new note')
          .addOption('command', 'Run Obsidian command')
          .setValue(slice.action)
          .onChange((v) => {
            slice.action = v as SliceConfig['action'];
            save();
            this.display();
          });
      });

    if (slice.action === 'command') {
      new Setting(this.containerEl)
        .setName('Command ID')
        .setDesc('The Obsidian command ID, e.g. workspace:new-file')
        .addText((t) => {
          t
            .setPlaceholder('workspace:new-file')
            .setValue(slice.commandId ?? '')
            .onChange((v) => { slice.commandId = v.trim(); save(); });
        });
    }

    new Setting(this.containerEl)
      .setName('Angles')
      .setDesc('Start angle → end angle in degrees')
      .addText((t) => {
        t
          .setPlaceholder('Start')
          .setValue(String(slice.startAngle))
          .onChange((v) => {
            const n = Number(v);
            if (!isNaN(n)) { slice.startAngle = n; save(); }
          });
      })
      .addText((t) => {
        t
          .setPlaceholder('End')
          .setValue(String(slice.endAngle))
          .onChange((v) => {
            const n = Number(v);
            if (!isNaN(n)) { slice.endAngle = n; save(); }
          });
      });

    new Setting(this.containerEl)
      .setName('Color')
      .addColorPicker((cp) => { cp.setValue(slice.color).onChange((v) => { slice.color = v; save(); }); })
      .addButton((btn) => {
        btn.setButtonText('Remove').setWarning().onClick(() => {
          slices.splice(i, 1);
          save();
          this.display();
        });
      });

    this.containerEl.createEl('hr');
  }
}

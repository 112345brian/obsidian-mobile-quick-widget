import { Notice, Setting } from 'obsidian';
import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-settings-tab-base';

import type { DashboardWidget, NewNoteFilenameFormat, QuickAction, SliceConfig } from './PluginSettings.ts';
import type { PluginTypes } from './PluginTypes.ts';

import { CommandPickerModal } from './Modals/CommandPickerModal.ts';
import { DASHBOARD_PRESETS, QUICK_ACTION_DEFAULTS, WIDGET_LABELS, PluginSettings } from './PluginSettings.ts';

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

    new Setting(this.containerEl)
      .setName('New note template')
      .setDesc('Path to a template file. Leave blank for an empty note. If Templater is installed, its syntax will be processed.')
      .addText((text) => {
        text
          .setPlaceholder('Templates/New Note.md')
          .setValue(s.newNoteTemplate)
          .onChange((val) => {
            s.newNoteTemplate = val.trim();
            void this.plugin.settingsManager.saveToFile();
          });
      });

    new Setting(this.containerEl)
      .setName('New note filename format')
      .setDesc('Untitled uses "Untitled YYYY-MM-DD". Zettelkasten uses a 14-digit timestamp ID (YYYYMMDDHHmmss).')
      .addDropdown((dd) => {
        dd
          .addOption('untitled', 'Untitled + date')
          .addOption('zettelkasten', 'Zettelkasten ID (unique notes)')
          .setValue(s.newNoteFilenameFormat)
          .onChange((val) => {
            s.newNoteFilenameFormat = val as NewNoteFilenameFormat;
            void this.plugin.settingsManager.saveToFile();
          });
      });

    new Setting(this.containerEl)
      .setName('Continue — excluded paths')
      .setDesc('Files or folders to hide from the Continue list. One path per line. Folders should end with /.')
      .addTextArea((t) => {
        t
          .setPlaceholder('Meta/Home.md\nTemplates/')
          .setValue((s.continueExcluded ?? []).join('\n'))
          .onChange((val) => {
            s.continueExcluded = val.split('\n').map((p) => p.trim()).filter(Boolean);
            void this.plugin.settingsManager.saveToFile();
          });
        t.inputEl.rows = 4;
        t.inputEl.style.width = '100%';
      });

    this.renderDashboardSection(s);
    this.renderQuickActionsSection(s);

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

    const save = (): void => {
      this.validateAngles(slices);
      void this.plugin.settingsManager.saveToFile();
    };

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
          .addOption('dashboard', 'Open dashboard')
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
        .setName('Command')
        .setDesc(slice.commandId ? `ID: ${slice.commandId}` : 'No command selected')
        .addButton((btn) => {
          btn
            .setButtonText(slice.commandId ? 'Change…' : 'Choose command…')
            .onClick(() => {
              new CommandPickerModal(this.app, (cmd) => {
                slice.commandId = cmd.id;
                save();
                this.display();
              }).open();
            });
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
          void this.plugin.settingsManager.saveToFile();
          this.display();
        });
      });

    this.containerEl.createEl('hr');
  }

  private renderDashboardSection(s: PluginSettings): void {
    this.containerEl.createEl('h3', { text: 'Dashboard' });

    // Presets row
    const presetSetting = new Setting(this.containerEl)
      .setName('Presets')
      .setDesc('Apply a preset widget layout.');

    const presets = Object.values(DASHBOARD_PRESETS) as Array<{ label: string; widgets: DashboardWidget[] }>;
    for (const preset of presets) {
      presetSetting.addButton((btn) => {
        btn.setButtonText(preset.label).onClick(() => {
          s.dashboardWidgets = preset.widgets.map((w) => ({ type: w.type, enabled: w.enabled }));
          void this.plugin.settingsManager.saveToFile();
          this.display();
        });
      });
    }

    // Per-widget controls (ordered)
    const widgets = s.dashboardWidgets as DashboardWidget[];
    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      if (!widget) continue;

      new Setting(this.containerEl)
        .setName(WIDGET_LABELS[widget.type])
        .addToggle((t) => {
          t.setValue(widget.enabled).onChange((v) => {
            widget.enabled = v;
            void this.plugin.settingsManager.saveToFile();
          });
        })
        .addExtraButton((btn) => {
          btn.setIcon('arrow-up').setTooltip('Move up').onClick(() => {
            if (i === 0) return;
            const prev = widgets[i - 1];
          const curr = widgets[i];
          if (prev && curr) { widgets[i - 1] = curr; widgets[i] = prev; }
            void this.plugin.settingsManager.saveToFile();
            this.display();
          });
        })
        .addExtraButton((btn) => {
          btn.setIcon('arrow-down').setTooltip('Move down').onClick(() => {
            if (i === widgets.length - 1) return;
            const next = widgets[i + 1];
            const curr = widgets[i];
            if (next && curr) { widgets[i + 1] = curr; widgets[i] = next; }
            void this.plugin.settingsManager.saveToFile();
            this.display();
          });
        });
    }
  }

  private renderQuickActionsSection(s: PluginSettings): void {
    this.containerEl.createEl('h3', { text: 'Quick Actions' });
    this.containerEl.createEl('p', {
      cls: 'setting-item-description',
      text: 'Buttons shown in the dashboard Quick Actions section. "Append to note" opens a text prompt and appends the result to a specified note using a template ({{text}} is replaced with what you type).',
    });

    const actions = s.quickActions as QuickAction[];

    for (let i = 0; i < actions.length; i++) {
      this.renderQuickAction(s, actions, i);
    }

    new Setting(this.containerEl)
      .addButton((btn) => {
        btn.setButtonText('Add action').setCta().onClick(() => {
          actions.push({ label: 'New Action', icon: 'zap', action: 'command' });
          void this.plugin.settingsManager.saveToFile();
          this.display();
        });
      })
      .addButton((btn) => {
        btn.setButtonText('Reset to defaults').onClick(() => {
          s.quickActions = QUICK_ACTION_DEFAULTS.map((a) => ({ ...a }));
          void this.plugin.settingsManager.saveToFile();
          this.display();
        });
      });
  }

  private renderQuickAction(_s: PluginSettings, actions: QuickAction[], i: number): void {
    const action = actions[i];
    if (!action) return;

    const save = (): void => { void this.plugin.settingsManager.saveToFile(); };

    this.containerEl.createEl('h4', { text: `Action ${i + 1}: ${action.label}` });

    new Setting(this.containerEl)
      .setName('Label')
      .addText((t) => { t.setValue(action.label).onChange((v) => { action.label = v; save(); }); });

    new Setting(this.containerEl)
      .setName('Icon')
      .setDesc('Lucide icon name — browse at lucide.dev')
      .addText((t) => { t.setPlaceholder('zap').setValue(action.icon).onChange((v) => { action.icon = v; save(); }); });

    new Setting(this.containerEl)
      .setName('Action type')
      .addDropdown((dd) => {
        dd
          .addOption('new-note', 'Create new note')
          .addOption('homepage', 'Open homepage')
          .addOption('command', 'Run command')
          .addOption('append-to-note', 'Append to note')
          .setValue(action.action)
          .onChange((v) => {
            action.action = v as QuickAction['action'];
            save();
            this.display();
          });
      });

    if (action.action === 'command') {
      new Setting(this.containerEl)
        .setName('Command')
        .setDesc(action.commandId ? `ID: ${action.commandId}` : 'No command selected')
        .addButton((btn) => {
          btn.setButtonText(action.commandId ? 'Change…' : 'Choose command…').onClick(() => {
            new CommandPickerModal(this.app, (cmd) => {
              action.commandId = cmd.id;
              save();
              this.display();
            }).open();
          });
        });
    }

    if (action.action === 'append-to-note') {
      new Setting(this.containerEl)
        .setName('Target note')
        .setDesc('Path to the note to append to, e.g. "Inbox/Tasks.md"')
        .addText((t) => {
          t.setPlaceholder('Inbox/Tasks.md').setValue(action.notePath ?? '').onChange((v) => {
            action.notePath = v.trim();
            save();
          });
        });

      new Setting(this.containerEl)
        .setName('Append template')
        .setDesc('Text to append. {{text}} is replaced with your input. Default: {{text}}')
        .addText((t) => {
          t.setPlaceholder('- [ ] {{text}}').setValue(action.appendTemplate ?? '').onChange((v) => {
            action.appendTemplate = v.trim();
            save();
          });
        });
    }

    new Setting(this.containerEl)
      .addButton((btn) => {
        btn.setButtonText('Remove').setWarning().onClick(() => {
          actions.splice(i, 1);
          void this.plugin.settingsManager.saveToFile();
          this.display();
        });
      });

    this.containerEl.createEl('hr');
  }

  private validateAngles(slices: SliceConfig[]): void {
    for (const slice of slices) {
      if (slice.startAngle >= slice.endAngle) {
        new Notice(`Slice "${slice.label}": start angle must be less than end angle.`);
        return;
      }
    }

    for (let i = 0; i < slices.length; i++) {
      for (let j = i + 1; j < slices.length; j++) {
        const a = slices[i];
        const b = slices[j];
        if (!a || !b) continue;
        if (a.startAngle < b.endAngle && b.startAngle < a.endAngle) {
          new Notice(`Slices "${a.label}" and "${b.label}" overlap. Adjust their angles.`);
          return;
        }
      }
    }
  }
}

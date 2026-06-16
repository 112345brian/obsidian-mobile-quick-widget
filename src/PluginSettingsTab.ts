import { Setting } from 'obsidian';
import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/plugin/plugin-settings-tab-base';

import type { DashboardWidget, NewNoteFilenameFormat, PulseCard, QuickAction, QuickActionIconType, RadialMode } from './PluginSettings.ts';
import type { PluginTypes } from './PluginTypes.ts';

import { CommandPickerModal } from './Modals/CommandPickerModal.ts';
import { DASHBOARD_PRESETS, DEFAULT_PULSE_CARDS, PULSE_CARD_LABELS, QUICK_ACTION_DEFAULTS, RADIAL_COMMAND_DEFAULTS, WIDGET_LABELS, PluginSettings } from './PluginSettings.ts';

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

    let customFormatEl: HTMLElement | null = null;

    new Setting(this.containerEl)
      .setName('New note filename format')
      .setDesc('Custom lets you define the format using date/time tokens.')
      .addDropdown((dd) => {
        dd
          .addOption('untitled', 'Untitled + date')
          .addOption('zettelkasten', 'Zettelkasten (YYYYMMDDHHmmss)')
          .addOption('custom', 'Custom format')
          .setValue(s.newNoteFilenameFormat)
          .onChange((val) => {
            s.newNoteFilenameFormat = val as NewNoteFilenameFormat;
            if (customFormatEl) customFormatEl.style.display = val === 'custom' ? '' : 'none';
            void this.plugin.settingsManager.saveToFile();
          });
      });

    const customSetting = new Setting(this.containerEl)
      .setName('Custom filename format')
      .setDesc('Tokens: YYYY YY MM DD HH mm ss — e.g. YYMMDD_HHmmss')
      .addText((t) => {
        t.setPlaceholder('YYMMDD_HHmmss')
          .setValue(s.newNoteFilenameCustom ?? '')
          .onChange((val) => {
            s.newNoteFilenameCustom = val.trim();
            void this.plugin.settingsManager.saveToFile();
          });
      });
    customFormatEl = customSetting.settingEl;
    customFormatEl.style.display = s.newNoteFilenameFormat === 'custom' ? '' : 'none';

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

    new Setting(this.containerEl)
      .setName('Handedness')
      .setDesc('Right-handed mode right-aligns section headers and controls so your thumb reaches them more easily.')
      .addDropdown((d) => {
        d.addOption('left', 'Left-handed (default)')
          .addOption('right', 'Right-handed')
          .setValue(s.handedness ?? 'left')
          .onChange((val) => {
            s.handedness = val as 'left' | 'right';
            void this.plugin.settingsManager.saveToFile();
          });
      });

    this.containerEl.createEl('h3', { text: 'Radial Menu' });

    new Setting(this.containerEl)
      .setName('Default mode')
      .setDesc('Which mode the radial menu opens in.')
      .addDropdown((d) => {
        d.addOption('breadcrumbs', 'Breadcrumbs')
          .addOption('commands', 'Commands')
          .addOption('recents', 'Recents')
          .setValue(s.radialDefaultMode ?? 'breadcrumbs')
          .onChange((val) => {
            s.radialDefaultMode = val as RadialMode;
            void this.plugin.settingsManager.saveToFile();
          });
      });

    new Setting(this.containerEl)
      .setName('Remember last mode')
      .setDesc('Reopen the radial menu in whatever mode you last used, instead of the default.')
      .addToggle((t) => {
        t.setValue(s.radialRememberLast ?? false).onChange((val) => {
          s.radialRememberLast = val;
          void this.plugin.settingsManager.saveToFile();
        });
      });

    new Setting(this.containerEl)
      .setName('Connect radial & dashboard')
      .setDesc('Swipe down on the radial menu to open the dashboard, and show a button on the dashboard to return to the radial.')
      .addToggle((t) => {
        t.setValue(s.connectSurfaces ?? true).onChange((val) => {
          s.connectSurfaces = val;
          void this.plugin.settingsManager.saveToFile();
        });
      });

    new Setting(this.containerEl)
      .setName('Recently touched count')
      .setDesc('Number of files to show in the Touched list.')
      .addText((t) => {
        t.setPlaceholder('15').setValue(String(s.recentListCount ?? 15)).onChange((val) => {
          const n = parseInt(val, 10);
          if (!isNaN(n) && n > 0) { s.recentListCount = n; void this.plugin.settingsManager.saveToFile(); }
        });
      });

    new Setting(this.containerEl)
      .setName('Recently modified count')
      .setDesc('Number of files to show in the Modified list.')
      .addText((t) => {
        t.setPlaceholder('15').setValue(String(s.modifiedListCount ?? 15)).onChange((val) => {
          const n = parseInt(val, 10);
          if (!isNaN(n) && n > 0) { s.modifiedListCount = n; void this.plugin.settingsManager.saveToFile(); }
        });
      });

    new Setting(this.containerEl)
      .setName('Show breadcrumbs')
      .setDesc('Show the parent note above each note in the list. Uses the Breadcrumbs plugin if installed, otherwise reads the "up" frontmatter field (or your custom field below).')
      .addToggle((t) => {
        t.setValue(s.showBreadcrumbs ?? false).onChange((val) => {
          s.showBreadcrumbs = val;
          void this.plugin.settingsManager.saveToFile();
        });
      });

    new Setting(this.containerEl)
      .setName('Breadcrumb field override')
      .setDesc('Custom frontmatter field for the parent link. Leave blank to use "up".')
      .addText((t) => {
        t.setPlaceholder('up').setValue(s.breadcrumbField ?? '').onChange((val) => {
          s.breadcrumbField = val.trim();
          void this.plugin.settingsManager.saveToFile();
        });
      });

    new Setting(this.containerEl)
      .setName('Modified date field')
      .setDesc('Frontmatter field to use as the modified date in the "Recently Modified" view (e.g. date-modified). Leave blank to use file system mtime.')
      .addText((t) => {
        t
          .setPlaceholder('date-modified')
          .setValue(s.modifiedDateField ?? '')
          .onChange((val) => {
            s.modifiedDateField = val.trim();
            void this.plugin.settingsManager.saveToFile();
          });
      });

    this.renderDashboardSection(s);
    this.renderPulseCardsSection(s);
    this.renderQuickActionsSection(s);

    this.renderRadialCommandsSection(s);
  }

  private renderRadialCommandsSection(s: PluginSettings): void {
    this.containerEl.createEl('h3', { text: 'Radial Commands' });
    this.containerEl.createEl('p', {
      cls: 'setting-item-description',
      text: 'The six command slots shown in the radial menu\'s Commands mode, in clockwise order from the top: 12, 2, 4, 6, 8, 10 o\'clock. Icon may be a single glyph (✦) or a Lucide icon name.',
    });

    const commands = s.radialCommands as QuickAction[];
    const clock = ['12 o\'clock (top)', '2 o\'clock', '4 o\'clock', '6 o\'clock (bottom)', '8 o\'clock', '10 o\'clock'];
    for (let i = 0; i < commands.length; i++) {
      this.containerEl.createEl('h4', { text: `Slot ${clock[i] ?? i + 1}` });
      this.renderQuickAction(s, commands, i, { removable: false, showHeading: false });
    }

    new Setting(this.containerEl)
      .addButton((btn) => {
        btn.setButtonText('Reset to defaults').onClick(() => {
          s.radialCommands = RADIAL_COMMAND_DEFAULTS.map((c) => ({ ...c }));
          void this.plugin.settingsManager.saveToFile();
          this.display();
        });
      });
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

  private renderPulseCardsSection(s: PluginSettings): void {
    this.containerEl.createEl('h3', { text: 'Pulse Cards' });
    this.containerEl.createEl('p', {
      cls: 'setting-item-description',
      text: 'Cards shown below the date header. Trash only appears when there are stale notes. Quick Action cards use any action from your Quick Actions list.',
    });

    const cards = s.pulseCards as PulseCard[];

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (!card) continue;
      const save = (): void => { void this.plugin.settingsManager.saveToFile(); };

      const setting = new Setting(this.containerEl)
        .setName(card.type === 'quick-action' && card.quickAction ? card.quickAction.label : PULSE_CARD_LABELS[card.type])
        .addToggle((t) => { t.setValue(card.enabled).onChange((v) => { card.enabled = v; save(); }); })
        .addExtraButton((btn) => {
          btn.setIcon('arrow-up').setTooltip('Move up').onClick(() => {
            if (i === 0) return;
            [cards[i - 1], cards[i]] = [cards[i]!, cards[i - 1]!];
            save(); this.display();
          });
        })
        .addExtraButton((btn) => {
          btn.setIcon('arrow-down').setTooltip('Move down').onClick(() => {
            if (i === cards.length - 1) return;
            [cards[i + 1], cards[i]] = [cards[i]!, cards[i + 1]!];
            save(); this.display();
          });
        })
        .addButton((btn) => {
          btn.setButtonText('Remove').setWarning().onClick(() => {
            cards.splice(i, 1); save(); this.display();
          });
        });

      if (card.type === 'quick-action') {
        const action = card.quickAction;
        setting.setDesc(action ? `${action.action}${action.commandId ? ` · ${action.commandId}` : ''}` : 'Not configured');
      }
    }

    new Setting(this.containerEl)
      .addDropdown((dd) => {
        dd
          .addOption('daily-note', PULSE_CARD_LABELS['daily-note'])
          .addOption('modified-today', PULSE_CARD_LABELS['modified-today'])
          .addOption('vault', PULSE_CARD_LABELS['vault'])
          .addOption('trash', PULSE_CARD_LABELS['trash'])
          .addOption('homepage', PULSE_CARD_LABELS['homepage'])
          .addOption('quick-action', PULSE_CARD_LABELS['quick-action']);
        dd.onChange((val) => {
          const type = val as PulseCard['type'];
          if (type === 'quick-action') {
            cards.push({ type, enabled: true, quickAction: { label: 'Action', icon: 'zap', action: 'new-note' } });
          } else {
            cards.push({ type, enabled: true });
          }
          void this.plugin.settingsManager.saveToFile(); this.display();
        });
        dd.setValue('daily-note');
      })
      .addButton((btn) => {
        btn.setButtonText('Reset').onClick(() => {
          s.pulseCards = DEFAULT_PULSE_CARDS.map((c) => ({ ...c }));
          void this.plugin.settingsManager.saveToFile(); this.display();
        });
      });
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

  private renderQuickAction(
    _s: PluginSettings,
    actions: QuickAction[],
    i: number,
    opts: { removable?: boolean; showHeading?: boolean } = {},
  ): void {
    const { removable = true, showHeading = true } = opts;
    const action = actions[i];
    if (!action) return;

    const save = (): void => { void this.plugin.settingsManager.saveToFile(); };

    if (showHeading) this.containerEl.createEl('h4', { text: `Action ${i + 1}: ${action.label}` });

    new Setting(this.containerEl)
      .setName('Label')
      .addText((t) => { t.setValue(action.label).onChange((v) => { action.label = v; save(); }); });

    new Setting(this.containerEl)
      .setName('Icon')
      .setDesc(action.iconType === 'glyph' ? 'Literal glyph/text, e.g. ✦' : 'Lucide icon name — browse at lucide.dev')
      .addText((t) => { t.setPlaceholder('zap').setValue(action.icon).onChange((v) => { action.icon = v; save(); }); })
      .addDropdown((dd) => {
        dd
          .addOption('lucide', 'Lucide icon')
          .addOption('glyph', 'Literal glyph')
          .setValue(action.iconType ?? 'lucide')
          .onChange((v) => {
            action.iconType = v as QuickActionIconType;
            save();
            this.display();
          });
      });

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

    if (removable) {
      new Setting(this.containerEl)
        .addButton((btn) => {
          btn.setButtonText('Remove').setWarning().onClick(() => {
            actions.splice(i, 1);
            void this.plugin.settingsManager.saveToFile();
            this.display();
          });
        });
    }

    this.containerEl.createEl('hr');
  }

}

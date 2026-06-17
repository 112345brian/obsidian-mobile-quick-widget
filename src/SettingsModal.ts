import { Modal, Setting } from 'obsidian';

import { FileSuggest, FolderSuggest, renderChipList } from './PathSuggest.ts';

import type { DashboardRadialInteraction, DashboardWidget, NewNoteFilenameFormat, PulseCard, QuickAction, QuickActionIconType, RadialMode } from './PluginSettings.ts';
import type { Plugin } from './Plugin.ts';

import { CommandPickerModal } from './Modals/CommandPickerModal.ts';
import {
  BUILTIN_DASHBOARD_WIDGET_TYPES,
  DASHBOARD_PRESETS,
  DEFAULT_PULSE_CARDS,
  PULSE_CARD_LABELS,
  QUICK_ACTION_DEFAULTS,
  RADIAL_COMMAND_DEFAULTS,
  PluginSettings,
  normalizeDashboardWidgets,
} from './PluginSettings.ts';

type SettingsTab = 'general' | 'pulse' | 'dashboard' | 'radial' | 'actions';

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'general',   label: 'General' },
  { id: 'pulse',     label: 'Pulse Cards' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'radial',    label: 'Radial' },
  { id: 'actions',   label: 'Quick Actions' },
];

export class ReadyBoardSettingsModal extends Modal {
  private plugin: Plugin;
  private activeTab: SettingsTab = 'general';
  private tabBtns = new Map<SettingsTab, HTMLElement>();
  private body!: HTMLElement;

  constructor(plugin: Plugin) {
    super(plugin.app);
    this.plugin = plugin;
  }

  override onOpen(): void {
    // Normalize widget ids on open so any tab's save flushes clean data,
    // not just when the Dashboard tab is opened.
    const s = this.plugin.settings as PluginSettings;
    const knownIds = [...new Set([...BUILTIN_DASHBOARD_WIDGET_TYPES, ...this.plugin.dashboardWidgetRegistry.ids()])];
    s.dashboardWidgets = normalizeDashboardWidgets(s.dashboardWidgets as DashboardWidget[], knownIds);

    this.modalEl.addClass('qw-settings-modal');
    this.titleEl.setText('ReadyBoard Settings');

    // Tab bar
    const tabBar = this.contentEl.createDiv('qw-settings-tab-bar');
    for (const { id, label } of TABS) {
      const btn = tabBar.createEl('button', { cls: 'qw-settings-tab-btn', text: label });
      if (id === this.activeTab) btn.addClass('is-active');
      btn.onclick = () => this.switchTab(id);
      this.tabBtns.set(id, btn);
    }

    this.body = this.contentEl.createDiv('qw-settings-body');
    this.renderTab();
  }

  override onClose(): void {
    this.contentEl.empty();
  }

  private switchTab(tab: SettingsTab): void {
    this.tabBtns.get(this.activeTab)?.removeClass('is-active');
    this.activeTab = tab;
    this.tabBtns.get(tab)?.addClass('is-active');
    this.renderTab();
  }

  private renderTab(): void {
    this.body.empty();
    const s = this.plugin.settings as PluginSettings;
    const save = (): void => { void this.plugin.settingsManager.saveToFile(); };

    switch (this.activeTab) {
      case 'general':   this.renderGeneral(s, save); break;
      case 'pulse':     this.renderPulse(s, save); break;
      case 'dashboard': this.renderDashboard(s, save); break;
      case 'radial':    this.renderRadial(s, save); break;
      case 'actions':   this.renderActions(s, save); break;
    }
  }

  private redraw(): void {
    const scrollTop = this.body.scrollTop;
    this.renderTab();
    this.body.scrollTop = scrollTop;
  }

  // ── General ──────────────────────────────────────────────────────────────

  private renderGeneral(s: PluginSettings, save: () => void): void {
    const el = this.body;

    new Setting(el)
      .setName('Homepage file path')
      .setDesc('e.g. "Home.md" or "Notes/Index.md"')
      .addText((t) => {
        t.setPlaceholder('Home.md').setValue(s.homePath).onChange((v) => { s.homePath = v.trim(); save(); });
        new FileSuggest(this.app, t.inputEl);
      });

    new Setting(el).setName('Handedness').setDesc('Right-handed mode right-aligns controls.')
      .addDropdown((d) => d.addOption('left', 'Left-handed').addOption('right', 'Right-handed')
        .setValue(s.handedness ?? 'left').onChange((v) => { s.handedness = v as 'left' | 'right'; save(); }));

    el.createEl('h3', { text: 'New Note' });

    new Setting(el).setName('Folder')
      .addText((t) => {
        t.setPlaceholder('Inbox').setValue(s.newNoteFolder).onChange((v) => { s.newNoteFolder = v.trim(); save(); });
        new FolderSuggest(this.app, t.inputEl);
      });

    new Setting(el).setName('Template')
      .addText((t) => {
        t.setPlaceholder('Templates/New Note.md').setValue(s.newNoteTemplate).onChange((v) => { s.newNoteTemplate = v.trim(); save(); });
        new FileSuggest(this.app, t.inputEl);
      });

    let customEl: HTMLElement | null = null;
    new Setting(el).setName('Filename format')
      .addDropdown((dd) => dd
        .addOption('untitled', 'Untitled + date')
        .addOption('zettelkasten', 'Zettelkasten')
        .addOption('custom', 'Custom')
        .setValue(s.newNoteFilenameFormat)
        .onChange((v) => {
          s.newNoteFilenameFormat = v as NewNoteFilenameFormat;
          if (customEl) customEl.style.display = v === 'custom' ? '' : 'none';
          save();
        }));
    const cs = new Setting(el).setName('Custom format').setDesc('Tokens: YYYY YY MM DD HH mm ss')
      .addText((t) => t.setPlaceholder('YYMMDD_HHmmss').setValue(s.newNoteFilenameCustom ?? '')
        .onChange((v) => { s.newNoteFilenameCustom = v.trim(); save(); }));
    customEl = cs.settingEl;
    customEl.style.display = s.newNoteFilenameFormat === 'custom' ? '' : 'none';

    el.createEl('h3', { text: 'Note Card' });
    el.createEl('p', { cls: 'setting-item-description', text: 'Controls what each note row shows in the Touched and Modified lists.' });

    new Setting(el).setName('Show tags').addToggle((t) => t.setValue(s.cardShowTags ?? false).onChange((v) => { s.cardShowTags = v; save(); }));
    new Setting(el).setName('Show backlink count').addToggle((t) => t.setValue(s.cardShowBacklinks ?? true).onChange((v) => { s.cardShowBacklinks = v; save(); }));
    new Setting(el).setName('Show preview').setDesc('Short text excerpt from the note body.')
      .addToggle((t) => t.setValue(s.cardShowPreview ?? true).onChange((v) => { s.cardShowPreview = v; save(); }));
    new Setting(el).setName('Extra frontmatter fields').setDesc('One per line (e.g. status, type). Shows only when present.')
      .addTextArea((t) => {
        t.setPlaceholder('status\ntype').setValue((s.cardFrontmatterFields ?? []).join('\n'))
          .onChange((v) => { s.cardFrontmatterFields = v.split('\n').map((f) => f.trim()).filter(Boolean); save(); });
      });

    el.createEl('h3', { text: 'Continue List' });
    el.createEl('div', { cls: 'setting-item-name', text: 'Excluded paths' });
    el.createEl('div', { cls: 'setting-item-description', text: 'Files or folders to hide from the Touched list.' });
    renderChipList(
      el, this.app,
      () => s.continueExcluded ?? [],
      (v) => { s.continueExcluded = v; save(); },
      'Add folder or file path…',
      true,
    );
  }

  // ── Pulse Cards ───────────────────────────────────────────────────────────

  private renderPulse(s: PluginSettings, save: () => void): void {
    const el = this.body;
    const cards = s.pulseCards as PulseCard[];

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (!card) continue;
      this.renderPulseCardBlock(el, cards, i, save);
    }

    // Add card row
    const addRow = el.createDiv('qw-settings-pulse-add');
    const dd = addRow.createEl('select', { cls: 'dropdown' });
    for (const [type, label] of Object.entries(PULSE_CARD_LABELS)) {
      dd.createEl('option', { value: type, text: label as string });
    }
    const addBtn = addRow.createEl('button', { cls: 'mod-cta', text: 'Add card' });
    addBtn.onclick = () => {
      const type = dd.value as PulseCard['type'];
      if (type === 'quick-action') {
        cards.push({ type, enabled: true, quickAction: { label: 'Action', icon: 'zap', action: 'new-note' } });
      } else {
        cards.push({ type, enabled: true });
      }
      save(); this.redraw();
    };
    const resetBtn = addRow.createEl('button', { text: 'Reset' });
    resetBtn.onclick = () => { s.pulseCards = DEFAULT_PULSE_CARDS.map((c) => ({ ...c })); save(); this.redraw(); };

    // Conditional sub-settings
    if (cards.some((c) => c.type === 'inbox')) {
      el.createEl('h3', { text: 'Inbox' });
      new Setting(el).setName('Inbox folder path').setDesc('e.g. "Inbox" or "Capture/Unsorted"')
        .addText((t) => {
          t.setPlaceholder('Inbox').setValue(s.inboxPath ?? '').onChange((v) => { s.inboxPath = v.trim(); save(); });
          new FolderSuggest(this.app, t.inputEl);
        });
    }
    if (cards.some((c) => c.type === 'git')) {
      el.createEl('h3', { text: 'Git Card' });
      new Setting(el).setName('Tap action')
        .addDropdown((dd2) => dd2.addOption('sync', 'Commit and sync').addOption('menu', 'Open git menu')
          .setValue(s.gitPulseCardAction ?? 'sync')
          .onChange((v) => { s.gitPulseCardAction = v as 'sync' | 'menu'; save(); }));
    }
  }

  private renderPulseCardBlock(el: HTMLElement, cards: PulseCard[], i: number, save: () => void): void {
    const card = cards[i];
    if (!card) return;
    const label = card.type === 'quick-action' && card.quickAction ? card.quickAction.label : PULSE_CARD_LABELS[card.type];

    const block = el.createDiv('qw-settings-pulse-block');

    // Row 1: toggle + name
    const row1 = block.createDiv('qw-settings-pulse-row1');
    const toggle = row1.createEl('div', { cls: 'checkbox-container' });
    if (card.enabled) toggle.addClass('is-enabled');
    toggle.onclick = () => {
      card.enabled = !card.enabled;
      toggle.toggleClass('is-enabled', card.enabled);
      save();
    };
    row1.createEl('span', { cls: 'qw-settings-pulse-name', text: label });

    // Row 2: span selector + reorder + remove
    const row2 = block.createDiv('qw-settings-pulse-row2');
    const spanSel = row2.createEl('select', { cls: 'dropdown qw-settings-pulse-span' });
    for (const [v, t] of [['1', '1 col'], ['2', '2 col'], ['3', '3 col']] as const) {
      const opt = spanSel.createEl('option', { value: v, text: t });
      if (String(card.size ?? 1) === v) opt.selected = true;
    }
    spanSel.onchange = () => { card.size = Number(spanSel.value) as 1 | 2 | 3; save(); };

    const upBtn = row2.createEl('button', { cls: 'clickable-icon', attr: { 'aria-label': 'Move up' } });
    upBtn.innerHTML = '↑';
    upBtn.onclick = () => {
      if (i === 0) return;
      [cards[i - 1], cards[i]] = [cards[i]!, cards[i - 1]!];
      save(); this.redraw();
    };

    const downBtn = row2.createEl('button', { cls: 'clickable-icon', attr: { 'aria-label': 'Move down' } });
    downBtn.innerHTML = '↓';
    downBtn.onclick = () => {
      if (i === cards.length - 1) return;
      [cards[i + 1], cards[i]] = [cards[i]!, cards[i + 1]!];
      save(); this.redraw();
    };

    const removeBtn = row2.createEl('button', { cls: 'mod-warning', text: 'Remove' });
    removeBtn.onclick = () => { cards.splice(i, 1); save(); this.redraw(); };
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  private renderDashboard(s: PluginSettings, save: () => void): void {
    const el = this.body;

    new Setting(el).setName('Overdrag to new note').setDesc('Pull down past the top of the dashboard to instantly create a new note.')
      .addToggle((t) => t.setValue(s.enableOverdrag !== false).onChange((v) => { s.enableOverdrag = v; save(); }));

    new Setting(el).setName('Sidebar side')
      .addDropdown((d) => d.addOption('right', 'Right').addOption('left', 'Left')
        .setValue(s.dashboardSidebarSide ?? 'right')
        .onChange((v) => { s.dashboardSidebarSide = v as 'left' | 'right'; save(); }));

    new Setting(el).setName('Recently touched count')
      .addText((t) => t.setPlaceholder('15').setValue(String(s.recentListCount ?? 15))
        .onChange((v) => { const n = parseInt(v, 10); if (!isNaN(n) && n > 0) { s.recentListCount = n; save(); } }));

    new Setting(el).setName('Recently modified count')
      .addText((t) => t.setPlaceholder('15').setValue(String(s.modifiedListCount ?? 15))
        .onChange((v) => { const n = parseInt(v, 10); if (!isNaN(n) && n > 0) { s.modifiedListCount = n; save(); } }));

    new Setting(el).setName('Show breadcrumbs').setDesc('Show parent note above each item in the list.')
      .addToggle((t) => t.setValue(s.showBreadcrumbs ?? false).onChange((v) => { s.showBreadcrumbs = v; save(); }));

    new Setting(el).setName('Breadcrumb field override').setDesc('Custom frontmatter field for parent. Leave blank to use "up".')
      .addText((t) => t.setPlaceholder('up').setValue(s.breadcrumbField ?? '')
        .onChange((v) => { s.breadcrumbField = v.trim(); save(); }));

    new Setting(el).setName('Modified date field').setDesc('Frontmatter field for modified date. Leave blank to use file mtime.')
      .addText((t) => t.setPlaceholder('date-modified').setValue(s.modifiedDateField ?? '')
        .onChange((v) => { s.modifiedDateField = v.trim(); save(); }));

    el.createEl('h3', { text: 'Widgets' });
    const knownIds = [...new Set([...BUILTIN_DASHBOARD_WIDGET_TYPES, ...this.plugin.dashboardWidgetRegistry.ids()])];

    const presetSetting = new Setting(el).setName('Presets');
    for (const preset of Object.values(DASHBOARD_PRESETS) as Array<{ label: string; widgets: DashboardWidget[] }>) {
      presetSetting.addButton((btn) => btn.setButtonText(preset.label).onClick(() => {
        s.dashboardWidgets = normalizeDashboardWidgets(
          preset.widgets.map((w) => ({ type: w.type, enabled: w.enabled })),
          knownIds,
        );
        save(); this.redraw();
      }));
    }

    const widgets = normalizeDashboardWidgets(s.dashboardWidgets as DashboardWidget[], knownIds);
    // Point s.dashboardWidgets at the same array so that toggle/reorder
    // mutations in the handlers below are captured by save().
    s.dashboardWidgets = widgets;

    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      if (!widget) continue;
      const label = this.plugin.dashboardWidgetRegistry.get(widget.type)?.label ?? widget.type;
      new Setting(el).setName(label)
        .addToggle((t) => t.setValue(widget.enabled).onChange((v) => { widget.enabled = v; save(); }))
        .addExtraButton((btn) => btn.setIcon('arrow-up').setTooltip('Move up').onClick(() => {
          if (i === 0) return;
          const prev = widgets[i - 1]; const curr = widgets[i];
          if (prev && curr) { widgets[i - 1] = curr; widgets[i] = prev; }
          save(); this.redraw();
        }))
        .addExtraButton((btn) => btn.setIcon('arrow-down').setTooltip('Move down').onClick(() => {
          if (i === widgets.length - 1) return;
          const next = widgets[i + 1]; const curr = widgets[i];
          if (next && curr) { widgets[i + 1] = curr; widgets[i] = next; }
          save(); this.redraw();
        }));
    }
  }

  // ── Radial ────────────────────────────────────────────────────────────────

  private renderRadial(s: PluginSettings, save: () => void): void {
    const el = this.body;

    new Setting(el).setName('Default mode')
      .addDropdown((d) => d.addOption('breadcrumbs', 'Breadcrumbs').addOption('commands', 'Commands').addOption('recents', 'Recents')
        .setValue(s.radialDefaultMode ?? 'breadcrumbs').onChange((v) => { s.radialDefaultMode = v as RadialMode; save(); }));

    new Setting(el).setName('Remember last mode').setDesc('Reopen in whatever mode you last used.')
      .addToggle((t) => t.setValue(s.radialRememberLast ?? false).onChange((v) => { s.radialRememberLast = v; save(); }));

    new Setting(el).setName('Connect radial & dashboard').setDesc('Swipe down on the radial to open the dashboard.')
      .addToggle((t) => t.setValue(s.connectSurfaces ?? true).onChange((v) => { s.connectSurfaces = v; save(); }));

    new Setting(el).setName('Dashboard radial section')
      .addDropdown((d) => d.addOption('breadcrumbs', 'Breadcrumbs').addOption('commands', 'Commands').addOption('recents', 'Recents')
        .setValue(s.dashboardRadialMode ?? 'breadcrumbs').onChange((v) => { s.dashboardRadialMode = v as RadialMode; save(); }));

    new Setting(el).setName('Dashboard radial interaction')
      .addDropdown((d) => d.addOption('press-hold', 'Press & hold').addOption('tap-toggle', 'Tap to toggle')
        .setValue(s.dashboardRadialInteraction ?? 'press-hold')
        .onChange((v) => { s.dashboardRadialInteraction = v as DashboardRadialInteraction; save(); }));

    el.createEl('h3', { text: 'Radial Commands' });
    el.createEl('p', { cls: 'setting-item-description', text: 'Six slots in clockwise order: 12, 2, 4, 6, 8, 10 o\'clock.' });

    const commands = s.radialCommands as QuickAction[];
    const clock = ['12 o\'clock (top)', '2 o\'clock', '4 o\'clock', '6 o\'clock (bottom)', '8 o\'clock', '10 o\'clock'];
    for (let i = 0; i < commands.length; i++) {
      el.createEl('h4', { text: `Slot ${clock[i] ?? i + 1}` });
      this.renderQuickActionFields(el, commands, i, save, { removable: false });
    }

    new Setting(el).addButton((btn) => btn.setButtonText('Reset to defaults').onClick(() => {
      s.radialCommands = RADIAL_COMMAND_DEFAULTS.map((c) => ({ ...c }));
      save(); this.redraw();
    }));
  }

  // ── Quick Actions ─────────────────────────────────────────────────────────

  private renderActions(s: PluginSettings, save: () => void): void {
    const el = this.body;
    el.createEl('p', { cls: 'setting-item-description', text: 'Buttons in the dashboard Quick Actions section.' });

    const actions = s.quickActions as QuickAction[];
    for (let i = 0; i < actions.length; i++) {
      el.createEl('h4', { text: `Action ${i + 1}: ${actions[i]?.label ?? ''}` });
      this.renderQuickActionFields(el, actions, i, save, { removable: true });
    }

    new Setting(el)
      .addButton((btn) => btn.setButtonText('Add action').setCta().onClick(() => {
        actions.push({ label: 'New Action', icon: 'zap', action: 'command' });
        save(); this.redraw();
      }))
      .addButton((btn) => btn.setButtonText('Reset to defaults').onClick(() => {
        s.quickActions = QUICK_ACTION_DEFAULTS.map((a) => ({ ...a }));
        save(); this.redraw();
      }));
  }

  // ── Quick action field block (shared by Radial and Quick Actions) ─────────

  private renderQuickActionFields(
    el: HTMLElement,
    actions: QuickAction[],
    i: number,
    save: () => void,
    opts: { removable: boolean },
  ): void {
    const action = actions[i];
    if (!action) return;

    new Setting(el).setName('Label')
      .addText((t) => t.setValue(action.label).onChange((v) => { action.label = v; save(); }));

    new Setting(el).setName('Icon')
      .setDesc(action.iconType === 'glyph' ? 'Literal glyph, e.g. ✦' : 'Lucide icon name — lucide.dev')
      .addText((t) => t.setPlaceholder('zap').setValue(action.icon).onChange((v) => { action.icon = v; save(); }))
      .addDropdown((dd) => dd.addOption('lucide', 'Lucide').addOption('glyph', 'Glyph')
        .setValue(action.iconType ?? 'lucide').onChange((v) => { action.iconType = v as QuickActionIconType; save(); this.redraw(); }));

    new Setting(el).setName('Action type')
      .addDropdown((dd) => dd
        .addOption('new-note', 'Create new note').addOption('homepage', 'Open homepage')
        .addOption('command', 'Run command').addOption('append-to-note', 'Append to note')
        .setValue(action.action).onChange((v) => { action.action = v as QuickAction['action']; save(); this.redraw(); }));

    if (action.action === 'command') {
      new Setting(el).setName('Command').setDesc(action.commandId ? `ID: ${action.commandId}` : 'No command selected')
        .addButton((btn) => btn.setButtonText(action.commandId ? 'Change…' : 'Choose command…').onClick(() => {
          new CommandPickerModal(this.app, (cmd) => { action.commandId = cmd.id; save(); this.redraw(); }).open();
        }));
    }

    if (action.action === 'append-to-note') {
      new Setting(el).setName('Target note').setDesc('Path to append to, e.g. "Inbox/Tasks.md"')
        .addText((t) => t.setPlaceholder('Inbox/Tasks.md').setValue(action.notePath ?? '')
          .onChange((v) => { action.notePath = v.trim(); save(); }));
      new Setting(el).setName('Append template').setDesc('{{text}} is replaced with your input.')
        .addText((t) => t.setPlaceholder('- [ ] {{text}}').setValue(action.appendTemplate ?? '')
          .onChange((v) => { action.appendTemplate = v.trim(); save(); }));
    }

    if (opts.removable) {
      new Setting(el).addButton((btn) => btn.setButtonText('Remove').setWarning().onClick(() => {
        actions.splice(i, 1); save(); this.redraw();
      }));
    }

    el.createEl('hr');
  }
}

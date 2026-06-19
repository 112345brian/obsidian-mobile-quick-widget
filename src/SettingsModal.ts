import {
 Modal, Setting
} from 'obsidian';

import type { Plugin } from './Plugin.ts';
import type {
 DashboardRadialInteraction, DashboardWidget, NewNoteFilenameFormat, PulseCard, PulseCardDisplayMode, QuickAction, QuickActionIconType, RadialMode
} from './PluginSettings.ts';

import { CommandPickerModal } from './Modals/CommandPickerModal.ts';
import { renderSlotIcon } from './renderQuickActionIcon.ts';
import {
  GUIDE_RADIUS, SLOTS, STAGE_CENTER, STAGE_SIZE
} from './widgets/radialLauncher.ts';
import {
 FileSuggest, FolderSuggest, renderChipList
} from './PathSuggest.ts';
import {
  BUILTIN_DASHBOARD_WIDGET_TYPES,
  DASHBOARD_PRESETS,
  DEFAULT_PULSE_CARDS,
  normalizeDashboardWidgets,
  PluginSettings,
  PULSE_CARD_LABELS,
  QUICK_ACTION_DEFAULTS,
  RADIAL_COMMAND_DEFAULTS
} from './PluginSettings.ts';

type SettingsTab = 'actions' | 'dashboard' | 'general' | 'pulse' | 'radial';

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'pulse', label: 'Pulse Cards' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'radial', label: 'Radial' },
  { id: 'actions', label: 'Quick Actions' }
];

export class ReadyBoardSettingsModal extends Modal {
  private activeRadialSlot = 0;
  private activeTab: SettingsTab = 'general';
  private body!: HTMLElement;
  private readonly plugin: Plugin;
  private readonly tabBtns = new Map<SettingsTab, HTMLElement>();

  constructor(plugin: Plugin) {
    super(plugin.app);
    this.plugin = plugin;
  }

  override onClose(): void {
    this.contentEl.empty();
  }

  override onOpen(): void {
    this.modalEl.addClass('qw-settings-modal');
    this.titleEl.setText('ReadyBoard Settings');
    this.renderInto(this.contentEl);
  }

  /** Renders the full settings UI into any container — used by both the modal
   *  (via onOpen) and the native Obsidian settings tab (inline, no modal). */
  public renderInto(container: HTMLElement): void {
    container.empty();
    const s = this.plugin.settingsManager.settingsWrapper.settings as unknown as PluginSettings;
    const knownIds = [...new Set([...BUILTIN_DASHBOARD_WIDGET_TYPES, ...this.plugin.dashboardWidgetRegistry.ids()])];
    s.dashboardWidgets = normalizeDashboardWidgets(s.dashboardWidgets, knownIds);

    const tabBar = container.createDiv('qw-settings-tab-bar');
    for (const { id, label } of TABS) {
      const btn = tabBar.createEl('button', { cls: 'qw-settings-tab-btn', text: label });
      if (id === this.activeTab) { btn.addClass('is-active'); }
      btn.onclick = () => { this.switchTab(id); };
      this.tabBtns.set(id, btn);
    }

    this.body = container.createDiv('qw-settings-body');
    this.renderTab();
  }

  private clonePulseCard(card: PulseCard): PulseCard {
    const clone: PulseCard = { ...card };
    if (card.quickAction) { clone.quickAction = { ...card.quickAction }; }
    return clone;
  }

  private redraw(): void {
    const scrollTop = this.body.scrollTop;
    this.renderTab();
    this.body.scrollTop = scrollTop;
  }

  private renderActions(s: PluginSettings, save: () => void): void {
    const el = this.body;
    el.createEl('p', { cls: 'setting-item-description', text: 'Buttons in the dashboard Quick Actions section.' });

    const actions = s.quickActions;
    for (let i = 0; i < actions.length; i++) {
      el.createEl('h4', { text: `Action ${i + 1}: ${actions[i]?.label ?? ''}` });
      this.renderQuickActionFields(el, actions, i, save, { removable: true });
    }

    new Setting(el)
      .addButton((btn) => btn.setButtonText('Add action').setCta().onClick(() => {
        actions.push({ action: 'command', icon: 'zap', label: 'New Action' });
        save(); this.redraw();
      }))
      .addButton((btn) => btn.setButtonText('Reset to defaults').onClick(() => {
        s.quickActions = QUICK_ACTION_DEFAULTS.map((a) => ({ ...a }));
        save(); this.redraw();
      }));
  }

  private renderDashboard(s: PluginSettings, save: () => void): void {
    const el = this.body;
    const knownIds = [...new Set([...BUILTIN_DASHBOARD_WIDGET_TYPES, ...this.plugin.dashboardWidgetRegistry.ids()])];

    // ── Shared settings ──
    new Setting(el).setName('Overdrag to new note').setDesc('Pull down past the top of the dashboard to instantly create a new note.')
      .addToggle((t) => t.setValue(s.enableOverdrag).onChange((v) => { s.enableOverdrag = v; save(); }));

    new Setting(el).setName('Sidebar side')
      .addDropdown((d) => d.addOption('right', 'Right').addOption('left', 'Left')
        .setValue(s.dashboardSidebarSide ?? 'right')
        .onChange((v) => { s.dashboardSidebarSide = v as 'left' | 'right'; save(); }));

    new Setting(el).setName('Modified date field').setDesc('Frontmatter field for modified date. Leave blank to use file mtime.')
      .addText((t) => {
        t.setPlaceholder('date-modified').setValue(s.modifiedDateField ?? '')
          .onChange((v) => { s.modifiedDateField = v.trim(); });
        this.saveTextOnCommit(t.inputEl, save);
      });

    // ── Per-surface toggle ──
    new Setting(el)
      .setName('Separate sidebar settings')
      .setDesc('Configure widgets and list counts independently for the overlay dashboard and the sidebar panel.')
      .addToggle((t) => t.setValue(s.dashboardSeparateSettings ?? false).onChange((v) => {
        s.dashboardSeparateSettings = v;
        if (v && (s.sidebarWidgets?.length ?? 0) === 0 && (s.sidebarPulseCards?.length ?? 0) === 0) {
          this.seedSidebarDashboardSettings(s, knownIds);
        }
        save(); this.redraw();
      }));

    if (s.dashboardSeparateSettings) {
      // ── Overlay (modal) dashboard ──
      el.createEl('h3', { text: 'Overlay Dashboard' });
      new Setting(el).setName('Recently touched count')
        .addText((t) => {
          t.setPlaceholder('15').setValue(String(s.recentListCount ?? 15))
            .onChange((v) => { const n = parseInt(v, 10); if (!isNaN(n) && n > 0) { s.recentListCount = n; } });
          this.saveTextOnCommit(t.inputEl, save);
        });
      new Setting(el).setName('Recently modified count')
        .addText((t) => {
          t.setPlaceholder('15').setValue(String(s.modifiedListCount ?? 15))
            .onChange((v) => { const n = parseInt(v, 10); if (!isNaN(n) && n > 0) { s.modifiedListCount = n; } });
          this.saveTextOnCommit(t.inputEl, save);
        });
      this.renderWidgetList(el, s, 'modal', knownIds, save);
      this.renderNoteCardSettings(el, s, 'modal', save);

      // ── Sidebar dashboard ──
      el.createEl('h3', { text: 'Sidebar Dashboard' });
      new Setting(el).setName('Recently touched count')
        .addText((t) => {
          t.setPlaceholder('15').setValue(String(s.sidebarRecentListCount ?? 15))
            .onChange((v) => { const n = parseInt(v, 10); if (!isNaN(n) && n > 0) { s.sidebarRecentListCount = n; } });
          this.saveTextOnCommit(t.inputEl, save);
        });
      new Setting(el).setName('Recently modified count')
        .addText((t) => {
          t.setPlaceholder('15').setValue(String(s.sidebarModifiedListCount ?? 15))
            .onChange((v) => { const n = parseInt(v, 10); if (!isNaN(n) && n > 0) { s.sidebarModifiedListCount = n; } });
          this.saveTextOnCommit(t.inputEl, save);
        });
      this.renderWidgetList(el, s, 'sidebar', knownIds, save);
      this.renderNoteCardSettings(el, s, 'sidebar', save);
    } else {
      // ── Shared counts + widgets ──
      new Setting(el).setName('Recently touched count')
        .addText((t) => {
          t.setPlaceholder('15').setValue(String(s.recentListCount ?? 15))
            .onChange((v) => { const n = parseInt(v, 10); if (!isNaN(n) && n > 0) { s.recentListCount = n; } });
          this.saveTextOnCommit(t.inputEl, save);
        });
      new Setting(el).setName('Recently modified count')
        .addText((t) => {
          t.setPlaceholder('15').setValue(String(s.modifiedListCount ?? 15))
            .onChange((v) => { const n = parseInt(v, 10); if (!isNaN(n) && n > 0) { s.modifiedListCount = n; } });
          this.saveTextOnCommit(t.inputEl, save);
        });
      this.renderWidgetList(el, s, 'modal', knownIds, save);
      this.renderNoteCardSettings(el, s, 'modal', save);
    }
  }

  private renderDashboardRadialSettings(
    el: HTMLElement,
    s: PluginSettings,
    surface: 'modal' | 'sidebar',
    save: () => void
  ): void {
    const isSidebar = surface === 'sidebar';
    new Setting(el).setName('Dashboard radial section')
      .addDropdown((d) => d.addOption('breadcrumbs', 'Breadcrumbs').addOption('commands', 'Commands').addOption('recents', 'Recents')
        .setValue(isSidebar ? s.sidebarDashboardRadialMode : s.dashboardRadialMode)
        .onChange((v) => {
          if (isSidebar) { s.sidebarDashboardRadialMode = v as RadialMode; } else { s.dashboardRadialMode = v as RadialMode; }
          save();
        }));

    new Setting(el).setName('Dashboard radial interaction')
      .addDropdown((d) => d.addOption('press-hold', 'Press & hold').addOption('tap-toggle', 'Tap to toggle')
        .setValue(isSidebar ? s.sidebarDashboardRadialInteraction : s.dashboardRadialInteraction)
        .onChange((v) => {
          if (isSidebar) { s.sidebarDashboardRadialInteraction = v as DashboardRadialInteraction; } else { s.dashboardRadialInteraction = v as DashboardRadialInteraction; }
          save();
        }));
  }

  // ── General ──────────────────────────────────────────────────────────────

  private renderGeneral(s: PluginSettings, save: () => void): void {
    const el = this.body;

    new Setting(el)
      .setName('Homepage file path')
      .setDesc('e.g. "Home.md" or "Notes/Index.md"')
      .addText((t) => {
        t.setPlaceholder('Home.md').setValue(s.homePath).onChange((v) => { s.homePath = v.trim(); });
        this.saveTextOnCommit(t.inputEl, save);
        new FileSuggest(this.app, t.inputEl);
      });

    new Setting(el).setName('Handedness').setDesc('Right-handed mode right-aligns controls.')
      .addDropdown((d) => d.addOption('left', 'Left-handed').addOption('right', 'Right-handed')
        .setValue(s.handedness ?? 'left').onChange((v) => { s.handedness = v as 'left' | 'right'; save(); }));

    el.createEl('h3', { text: 'New Note' });

    new Setting(el).setName('Folder')
      .addText((t) => {
        t.setPlaceholder('Inbox').setValue(s.newNoteFolder).onChange((v) => { s.newNoteFolder = v.trim(); });
        this.saveTextOnCommit(t.inputEl, save);
        new FolderSuggest(this.app, t.inputEl);
      });

    new Setting(el).setName('Template')
      .addText((t) => {
        t.setPlaceholder('Templates/New Note.md').setValue(s.newNoteTemplate).onChange((v) => { s.newNoteTemplate = v.trim(); });
        this.saveTextOnCommit(t.inputEl, save);
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
          if (customEl) { customEl.style.display = v === 'custom' ? '' : 'none'; }
          save();
        }));
    const cs = new Setting(el).setName('Custom format').setDesc('Tokens: YYYY YY MM DD HH mm ss')
      .addText((t) => {
        t.setPlaceholder('YYMMDD_HHmmss').setValue(s.newNoteFilenameCustom ?? '')
          .onChange((v) => { s.newNoteFilenameCustom = v.trim(); });
        this.saveTextOnCommit(t.inputEl, save);
      });
    customEl = cs.settingEl;
    customEl.style.display = s.newNoteFilenameFormat === 'custom' ? '' : 'none';

    el.createEl('h3', { text: 'Continue List' });
    el.createEl('div', { cls: 'setting-item-name', text: 'Excluded paths' });
    el.createEl('div', { cls: 'setting-item-description', text: 'Files or folders to hide from the Touched list.' });
    renderChipList(
      el, this.app,
      () => s.continueExcluded ?? [],
      (v) => { s.continueExcluded = v; save(); },
      'Add folder or file path…',
      true
    );
  }

  // ── Pulse Cards ───────────────────────────────────────────────────────────

  private renderNoteCardSettings(
    el: HTMLElement,
    s: PluginSettings,
    surface: 'modal' | 'sidebar',
    save: () => void
  ): void {
    const isSidebar = surface === 'sidebar';
    el.createEl('h3', { text: 'Note Cards' });
    new Setting(el).setName('Show tags').addToggle((t) => t
      .setValue(isSidebar ? s.sidebarCardShowTags : s.cardShowTags)
      .onChange((v) => {
        if (isSidebar) { s.sidebarCardShowTags = v; } else { s.cardShowTags = v; }
        save();
      }));
    new Setting(el).setName('Show backlink count').addToggle((t) => t
      .setValue(isSidebar ? s.sidebarCardShowBacklinks : s.cardShowBacklinks)
      .onChange((v) => {
        if (isSidebar) { s.sidebarCardShowBacklinks = v; } else { s.cardShowBacklinks = v; }
        save();
      }));
    new Setting(el).setName('Show preview').setDesc('Short text excerpt from the note body.')
      .addToggle((t) => t
        .setValue(isSidebar ? s.sidebarCardShowPreview : s.cardShowPreview)
        .onChange((v) => {
          if (isSidebar) { s.sidebarCardShowPreview = v; } else { s.cardShowPreview = v; }
          save();
        }));
    new Setting(el).setName('Show breadcrumbs').setDesc('Show parent note above each item in the list.')
      .addToggle((t) => t
        .setValue(isSidebar ? s.sidebarShowBreadcrumbs : s.showBreadcrumbs)
        .onChange((v) => {
          if (isSidebar) { s.sidebarShowBreadcrumbs = v; } else { s.showBreadcrumbs = v; }
          save();
        }));
    new Setting(el).setName('Breadcrumb field override').setDesc('Custom frontmatter field for parent. Leave blank to use "up".')
      .addText((t) => {
        t.setPlaceholder('up')
          .setValue(isSidebar ? s.sidebarBreadcrumbField : s.breadcrumbField)
          .onChange((v) => {
            if (isSidebar) { s.sidebarBreadcrumbField = v.trim(); } else { s.breadcrumbField = v.trim(); }
          });
        this.saveTextOnCommit(t.inputEl, save);
      });
    new Setting(el).setName('Extra frontmatter fields').setDesc('One per line (e.g. status, type). Shows only when present.')
      .addTextArea((t) => {
        t.setPlaceholder('status\ntype')
          .setValue((isSidebar ? s.sidebarCardFrontmatterFields : s.cardFrontmatterFields).join('\n'))
          .onChange((v) => {
            const fields = v.split('\n').map((f) => f.trim()).filter(Boolean);
            if (isSidebar) { s.sidebarCardFrontmatterFields = fields; } else { s.cardFrontmatterFields = fields; }
          });
        this.saveTextOnCommit(t.inputEl, save, true);
      });
  }

  private renderPulse(s: PluginSettings, save: () => void): void {
    const el = this.body;
    const cardLists = s.dashboardSeparateSettings
      ? [s.pulseCards, s.sidebarPulseCards]
      : [s.pulseCards];

    if (s.dashboardSeparateSettings) {
      el.createEl('h3', { text: 'Overlay Dashboard' });
      this.renderPulseDisplayMode(el, s, 'modal', save);
      this.renderPulseCardList(el, s.pulseCards, () => {
        s.pulseCards = DEFAULT_PULSE_CARDS.map((c) => this.clonePulseCard(c));
      }, save);

      el.createEl('h3', { text: 'Sidebar Dashboard' });
      this.renderPulseDisplayMode(el, s, 'sidebar', save);
      this.renderPulseCardList(el, s.sidebarPulseCards, () => {
        s.sidebarPulseCards = DEFAULT_PULSE_CARDS.map((c) => this.clonePulseCard(c));
      }, save);
    } else {
      this.renderPulseDisplayMode(el, s, 'modal', save);
      this.renderPulseCardList(el, s.pulseCards, () => {
        s.pulseCards = DEFAULT_PULSE_CARDS.map((c) => this.clonePulseCard(c));
      }, save);
    }

    const cards = cardLists.flat();

    // Conditional sub-settings
    if (cards.some((c) => c.type === 'inbox')) {
      el.createEl('h3', { text: 'Inbox' });
      new Setting(el).setName('Inbox folder path').setDesc('e.g. "Inbox" or "Capture/Unsorted"')
        .addText((t) => {
          t.setPlaceholder('Inbox').setValue(s.inboxPath ?? '').onChange((v) => { s.inboxPath = v.trim(); });
          this.saveTextOnCommit(t.inputEl, save);
          new FolderSuggest(this.app, t.inputEl);
        });
    }
    if (cards.some((c) => c.type === 'git')) {
      el.createEl('h3', { text: 'Git Card' });
      new Setting(el).setName('Tap action')
        .addDropdown((dd2) => dd2.addOption('sync', 'Commit and sync').addOption('menu', 'Open git menu')
          .setValue(s.gitPulseCardAction ?? 'sync')
          .onChange((v) => { s.gitPulseCardAction = v as 'menu' | 'sync'; save(); }));
    }
  }

  private renderPulseCardBlock(el: HTMLElement, cards: PulseCard[], i: number, save: () => void): void {
    const card = cards[i];
    if (!card) { return; }
    const label = card.type === 'quick-action' && card.quickAction ? card.quickAction.label : PULSE_CARD_LABELS[card.type];

    const block = el.createDiv('qw-settings-pulse-block');

    // Row 1: toggle + name
    const row1 = block.createDiv('qw-settings-pulse-row1');
    const toggle = row1.createEl('div', { cls: 'checkbox-container' });
    if (card.enabled) { toggle.addClass('is-enabled'); }
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
      const opt = spanSel.createEl('option', { text: t, value: v });
      if (String(card.size ?? 1) === v) { opt.selected = true; }
    }
    spanSel.onchange = () => { card.size = Number(spanSel.value) as 1 | 2 | 3; save(); };

    const upBtn = row2.createEl('button', { attr: { 'aria-label': 'Move up' }, cls: 'clickable-icon' });
    upBtn.innerHTML = '↑';
    upBtn.onclick = () => {
      if (i === 0) { return; }
      [cards[i - 1], cards[i]] = [cards[i]!, cards[i - 1]!];
      save(); this.redraw();
    };

    const downBtn = row2.createEl('button', { attr: { 'aria-label': 'Move down' }, cls: 'clickable-icon' });
    downBtn.innerHTML = '↓';
    downBtn.onclick = () => {
      if (i === cards.length - 1) { return; }
      [cards[i + 1], cards[i]] = [cards[i]!, cards[i + 1]!];
      save(); this.redraw();
    };

    const removeBtn = row2.createEl('button', { cls: 'mod-warning', text: 'Remove' });
    removeBtn.onclick = () => { cards.splice(i, 1); save(); this.redraw(); };
  }

  private renderPulseCardList(
    el: HTMLElement,
    cards: PulseCard[],
    reset: () => void,
    save: () => void
  ): void {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (!card) { continue; }
      this.renderPulseCardBlock(el, cards, i, save);
    }

    // Add card row
    const addRow = el.createDiv('qw-settings-pulse-add');
    const dd = addRow.createEl('select', { cls: 'dropdown' });
    for (const [type, label] of Object.entries(PULSE_CARD_LABELS)) {
      dd.createEl('option', { text: label as string, value: type });
    }
    const addBtn = addRow.createEl('button', { cls: 'mod-cta', text: 'Add card' });
    addBtn.onclick = () => {
      const type = dd.value as PulseCard['type'];
      if (type === 'quick-action') {
        cards.push({ enabled: true, quickAction: { action: 'new-note', icon: 'zap', label: 'Action' }, type });
      } else {
        cards.push({ enabled: true, type });
      }
      save(); this.redraw();
    };
    const resetBtn = addRow.createEl('button', { text: 'Reset' });
    resetBtn.onclick = () => { reset(); save(); this.redraw(); };
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  private renderPulseDisplayMode(
    el: HTMLElement,
    s: PluginSettings,
    surface: 'modal' | 'sidebar',
    save: () => void
  ): void {
    const isSidebar = surface === 'sidebar';
    new Setting(el)
      .setName('Desktop pulse visibility')
      .setDesc('Context mode hides passive cards and only shows cards that have something current to report.')
      .addDropdown((d) => d
        .addOption('always', 'Always show enabled cards')
        .addOption('contextual', 'Contextual')
        .setValue(isSidebar ? s.sidebarPulseCardDesktopDisplayMode : s.pulseCardDesktopDisplayMode)
        .onChange((v) => {
          if (isSidebar) { s.sidebarPulseCardDesktopDisplayMode = v as PulseCardDisplayMode; } else { s.pulseCardDesktopDisplayMode = v as PulseCardDisplayMode; }
          save();
        }));

    new Setting(el)
      .setName('Mobile pulse visibility')
      .setDesc('Use a different pulse policy when Obsidian is running on a phone or tablet.')
      .addDropdown((d) => d
        .addOption('always', 'Always show enabled cards')
        .addOption('contextual', 'Contextual')
        .setValue(isSidebar ? s.sidebarPulseCardMobileDisplayMode : s.pulseCardMobileDisplayMode)
        .onChange((v) => {
          if (isSidebar) { s.sidebarPulseCardMobileDisplayMode = v as PulseCardDisplayMode; } else { s.pulseCardMobileDisplayMode = v as PulseCardDisplayMode; }
          save();
        }));
  }

  private renderQuickActionFields(
    el: HTMLElement,
    actions: QuickAction[],
    i: number,
    save: () => void,
    opts: { removable: boolean }
  ): void {
    const action = actions[i];
    if (!action) { return; }

    new Setting(el).setName('Label')
      .addText((t) => {
        t.setValue(action.label).onChange((v) => { action.label = v; });
        this.saveTextOnCommit(t.inputEl, save);
      });

    new Setting(el).setName('Icon')
      .setDesc(action.iconType === 'glyph' ? 'Literal glyph, e.g. ✦' : 'Lucide icon name — lucide.dev')
      .addText((t) => {
        t.setPlaceholder('zap').setValue(action.icon).onChange((v) => { action.icon = v; });
        this.saveTextOnCommit(t.inputEl, save);
      })
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
        .addText((t) => {
          t.setPlaceholder('Inbox/Tasks.md').setValue(action.notePath ?? '')
            .onChange((v) => { action.notePath = v.trim(); });
          this.saveTextOnCommit(t.inputEl, save);
        });
      new Setting(el).setName('Append template').setDesc('{{text}} is replaced with your input.')
        .addText((t) => {
          t.setPlaceholder('- [ ] {{text}}').setValue(action.appendTemplate ?? '')
            .onChange((v) => { action.appendTemplate = v.trim(); });
          this.saveTextOnCommit(t.inputEl, save);
        });
    }

    if (opts.removable) {
      new Setting(el).addButton((btn) => btn.setButtonText('Remove').setWarning().onClick(() => {
        actions.splice(i, 1); save(); this.redraw();
      }));
    }

    el.createEl('hr');
  }

  private renderRadial(s: PluginSettings, save: () => void): void {
    const el = this.body;

    new Setting(el).setName('Default mode')
      .addDropdown((d) => d.addOption('breadcrumbs', 'Breadcrumbs').addOption('commands', 'Commands').addOption('recents', 'Recents')
        .setValue(s.radialDefaultMode ?? 'breadcrumbs').onChange((v) => { s.radialDefaultMode = v as RadialMode; save(); }));

    new Setting(el).setName('Remember last mode').setDesc('Reopen in whatever mode you last used.')
      .addToggle((t) => t.setValue(s.radialRememberLast ?? false).onChange((v) => { s.radialRememberLast = v; save(); }));

    new Setting(el).setName('Connect radial & dashboard').setDesc('Swipe down on the radial to open the dashboard.')
      .addToggle((t) => t.setValue(s.connectSurfaces ?? true).onChange((v) => { s.connectSurfaces = v; save(); }));

    if (s.dashboardSeparateSettings) {
      el.createEl('h3', { text: 'Overlay Dashboard Launcher' });
      this.renderDashboardRadialSettings(el, s, 'modal', save);
      el.createEl('h3', { text: 'Sidebar Dashboard Launcher' });
      this.renderDashboardRadialSettings(el, s, 'sidebar', save);
    } else {
      this.renderDashboardRadialSettings(el, s, 'modal', save);
    }

    el.createEl('h3', { text: 'Command Slots' });

    const commands = s.radialCommands;
    const CLOCK = ['12 o\'clock', '2 o\'clock', '4 o\'clock', '6 o\'clock', '8 o\'clock', '10 o\'clock'];

    // Interactive preview — click a slot to edit it
    this.renderRadialPreview(el, commands);

    // Editor for the selected slot
    const slotLabel = el.createEl('h4', { cls: 'qw-settings-radial-slot-label' });
    slotLabel.setText(`Slot — ${CLOCK[this.activeRadialSlot] ?? ''}`);
    this.renderQuickActionFields(el, commands, this.activeRadialSlot, save, { removable: false });

    new Setting(el).addButton((btn) => btn.setButtonText('Reset slots to defaults').onClick(() => {
      s.radialCommands = RADIAL_COMMAND_DEFAULTS.map((c) => ({ ...c }));
      this.activeRadialSlot = 0;
      save(); this.redraw();
    }));
  }

  // ── Radial ────────────────────────────────────────────────────────────────

  private renderRadialPreview(el: HTMLElement, commands: QuickAction[]): void {

    const wrap = el.createDiv('qw-settings-radial-preview');
    const stage = wrap.createEl('div', { cls: 'qw-dash-radial-stage' });

    const spokeLines = SLOTS.map((pos) =>
      `<line x1="${STAGE_CENTER}" y1="${STAGE_CENTER}" x2="${pos.left}" y2="${pos.top}" stroke="#5a536a" stroke-width="1.25" stroke-dasharray="4 7" opacity="0.34"/>`
    ).join('');
    const anchors = SLOTS.map((pos) =>
      `<circle cx="${pos.left}" cy="${pos.top}" r="4" fill="#5a536a" opacity="0.42"/>`
    ).join('');
    stage.innerHTML = `<svg class="qw-dash-radial-guide" viewBox="0 0 ${STAGE_SIZE} ${STAGE_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${STAGE_CENTER}" cy="${STAGE_CENTER}" r="${GUIDE_RADIUS}" fill="none" stroke="#5a536a" stroke-width="1" stroke-dasharray="2 8" opacity="0.2"/>
      ${spokeLines}${anchors}
    </svg>`;

    // Center puck (non-interactive)
    const center = stage.createEl('div', { cls: 'qw-dash-radial-expanded-center' });
    center.style.setProperty('left', `${STAGE_CENTER}px`, 'important');
    center.style.setProperty('top', `${STAGE_CENTER}px`, 'important');
    const outer = center.createEl('span', { cls: 'qw-dash-radial-center-outer' });
    const mid = outer.createEl('span', { cls: 'qw-dash-radial-center-mid' });
    const inner = mid.createEl('span', { cls: 'qw-dash-radial-center-inner' });
    inner.createEl('span', { cls: 'qw-dash-radial-center-label', text: 'CMD' });

    // Slot buttons
    for (let i = 0; i < SLOTS.length; i++) {
      const pos = SLOTS[i]!;
      const cmd = commands[i];
      const isActive = i === this.activeRadialSlot;

      const btn = stage.createEl('button', {
        attr: { 'aria-label': cmd?.label ?? `Slot ${i + 1}`, 'type': 'button' },
        cls: `qw-dash-radial-mini-btn qw-radial-slot-cmd${isActive ? ' qw-settings-slot-active' : ''}`
      });
      btn.style.setProperty('left', `${pos.left}px`, 'important');
      btn.style.setProperty('top', `${pos.top}px`, 'important');

      if (cmd) {
        const face = btn.createEl('span', { cls: 'qw-dash-radial-mini-face' });
        if (cmd.iconType === 'glyph') {
          face.createEl('span', { cls: 'qw-dash-radial-mini-arrow', text: cmd.icon });
        } else {
          const iconEl = face.createEl('span', { cls: 'qw-dash-radial-mini-icon' });
          renderSlotIcon(iconEl, cmd.icon || 'zap', cmd.iconType);
        }
        face.createEl('span', { cls: 'qw-dash-radial-mini-title', text: (cmd.label ?? '').slice(0, 7) });
      }

      btn.addEventListener('click', () => {
        this.activeRadialSlot = i;
        this.redraw();
      });
    }
  }

  private renderTab(): void {
    this.body.empty();
    const s = this.plugin.settingsManager.settingsWrapper.settings as unknown as PluginSettings;
    const save = (): void => { void this.plugin.settingsManager.editAndSave(() => undefined, { source: 'settings-ui' }); };

    switch (this.activeTab) {
      case 'actions': this.renderActions(s, save); break;
      case 'dashboard': this.renderDashboard(s, save); break;
      case 'general': this.renderGeneral(s, save); break;
      case 'pulse': this.renderPulse(s, save); break;
      case 'radial': this.renderRadial(s, save); break;
    }
  }

  private renderWidgetList(
    el: HTMLElement,
    s: PluginSettings,
    surface: 'modal' | 'sidebar',
    knownIds: string[],
    save: () => void
  ): void {
    const isSidebar = surface === 'sidebar';
    el.createEl('h3', { text: 'Widgets' });

    const presetSetting = new Setting(el).setName('Presets');
    for (const preset of Object.values(DASHBOARD_PRESETS) as { label: string; widgets: DashboardWidget[] }[]) {
      presetSetting.addButton((btn) => btn.setButtonText(preset.label).onClick(() => {
        const normalized = normalizeDashboardWidgets(
          preset.widgets.map((w) => ({ enabled: w.enabled, type: w.type })),
          knownIds
        );
        if (isSidebar) { s.sidebarWidgets = normalized; } else { s.dashboardWidgets = normalized; }
        save(); this.redraw();
      }));
    }

    const raw = isSidebar ? (s.sidebarWidgets) : (s.dashboardWidgets);
    const widgets = normalizeDashboardWidgets(raw, knownIds);
    if (isSidebar) { s.sidebarWidgets = widgets; } else { s.dashboardWidgets = widgets; }

    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      if (!widget) { continue; }
      const label = this.plugin.dashboardWidgetRegistry.get(widget.type)?.label ?? widget.type;
      new Setting(el).setName(label)
        .addToggle((t) => t.setValue(widget.enabled).onChange((v) => { widget.enabled = v; save(); }))
        .addExtraButton((btn) => btn.setIcon('arrow-up').setTooltip('Move up').onClick(() => {
          if (i === 0) { return; }
          const prev = widgets[i - 1]; const curr = widgets[i];
          if (prev && curr) { widgets[i - 1] = curr; widgets[i] = prev; }
          save(); this.redraw();
        }))
        .addExtraButton((btn) => btn.setIcon('arrow-down').setTooltip('Move down').onClick(() => {
          if (i === widgets.length - 1) { return; }
          const next = widgets[i + 1]; const curr = widgets[i];
          if (next && curr) { widgets[i + 1] = curr; widgets[i] = next; }
          save(); this.redraw();
        }));
    }
  }

  // ── Quick Actions ─────────────────────────────────────────────────────────

  private saveTextOnCommit(inputEl: HTMLInputElement | HTMLTextAreaElement, save: () => void, multiline = false): void {
    let savedValue = inputEl.value;
    const commit = (): void => {
      if (inputEl.value === savedValue) { return; }
      savedValue = inputEl.value;
      save();
    };
    const onKeyDown = (event: Event): void => {
      if (!(event instanceof KeyboardEvent)) { return; }
      if (event.key !== 'Enter') { return; }
      if (multiline && !event.metaKey && !event.ctrlKey) { return; }
      if (!multiline) { event.preventDefault(); }
      commit();
    };

    inputEl.addEventListener('blur', commit);
    inputEl.addEventListener('keydown', onKeyDown);
  }

  private seedSidebarDashboardSettings(s: PluginSettings, knownIds: string[]): void {
    s.sidebarWidgets = normalizeDashboardWidgets(s.dashboardWidgets, knownIds).map((w) => ({ ...w }));
    s.sidebarPulseCards = (s.pulseCards ?? []).map((card) => this.clonePulseCard(card));
    s.sidebarPulseCardDesktopDisplayMode = s.pulseCardDesktopDisplayMode;
    s.sidebarPulseCardMobileDisplayMode = s.pulseCardMobileDisplayMode;
    s.sidebarRecentListCount = s.recentListCount;
    s.sidebarModifiedListCount = s.modifiedListCount;
    s.sidebarDashboardRadialMode = s.dashboardRadialMode;
    s.sidebarDashboardRadialLastMode = s.dashboardRadialLastMode;
    s.sidebarDashboardRadialInteraction = s.dashboardRadialInteraction;
    s.sidebarShowBreadcrumbs = s.showBreadcrumbs;
    s.sidebarBreadcrumbField = s.breadcrumbField;
    s.sidebarCardShowTags = s.cardShowTags;
    s.sidebarCardShowPreview = s.cardShowPreview;
    s.sidebarCardShowBacklinks = s.cardShowBacklinks;
    s.sidebarCardFrontmatterFields = [...(s.cardFrontmatterFields ?? [])];
  }

  // ── Quick action field block (shared by Radial and Quick Actions) ─────────

  private switchTab(tab: SettingsTab): void {
    this.tabBtns.get(this.activeTab)?.removeClass('is-active');
    this.activeTab = tab;
    this.tabBtns.get(tab)?.addClass('is-active');
    this.renderTab();
  }
}

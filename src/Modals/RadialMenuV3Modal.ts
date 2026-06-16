import type { App, TFile } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Modal, setIcon } from 'obsidian';

import type { PluginSettings, RadialMode } from '../PluginSettings.ts';
import type { CategorizedNeighbors } from '../breadcrumbs.ts';
import type { DashboardWidgetRegistry } from '../DashboardWidgetApi.ts';
import type { RadialSlotData } from '../radialSlots.ts';

import { getCategorizedNeighbors } from '../breadcrumbs.ts';
import { vibrate } from '../haptics.ts';
import { buildBreadcrumbSlots, buildCommandSlots, buildRecentSlots, showOverflowMenu } from '../radialSlots.ts';
import { DashboardModal } from './DashboardModal.ts';

// Six ring-button positions in the 340×340 wrap coordinate space.
// Matches the HTML mock exactly: r=110, 60° apart from 12 o'clock.
interface SlotPos { left: number; top: number; clock: string }
const SLOTS: SlotPos[] = [
  { left: 170, top: 60,  clock: '12' },
  { left: 265, top: 115, clock: '2' },
  { left: 265, top: 225, clock: '4' },
  { left: 170, top: 280, clock: '6' },
  { left: 75,  top: 225, clock: '8' },
  { left: 75,  top: 115, clock: '10' },
];

type SlotData = RadialSlotData;

const MODE_ORDER: RadialMode[] = ['breadcrumbs', 'commands', 'recents'];
const MODE_LABEL: Record<RadialMode, string> = { breadcrumbs: 'Breadcrumbs', commands: 'Commands', recents: 'Recents' };
const MODE_ABBR: Record<RadialMode, string> = { breadcrumbs: 'BC', commands: 'CMD', recents: 'RE' };

export class RadialMenuV3Modal extends Modal {
  private readonly settings: ReadonlyDeep<PluginSettings>;
  private readonly editSettings: (mutate: (settings: PluginSettings) => void | Promise<void>) => Promise<void>;
  private readonly dashboardWidgetRegistry: DashboardWidgetRegistry;
  private mode: RadialMode;

  public constructor(
    app: App,
    settings: ReadonlyDeep<PluginSettings>,
    editSettings: (mutate: (settings: PluginSettings) => void | Promise<void>) => Promise<void>,
    dashboardWidgetRegistry: DashboardWidgetRegistry,
  ) {
    super(app);
    this.settings = settings;
    this.editSettings = editSettings;
    this.dashboardWidgetRegistry = dashboardWidgetRegistry;
    let initial = settings.radialRememberLast ? settings.radialLastMode : settings.radialDefaultMode;
    // Defend against a stale/hand-edited settings value outside the known modes.
    if (!MODE_ORDER.includes(initial)) initial = 'breadcrumbs';
    // Breadcrumbs needs an active note to be useful — fall back to Commands.
    if (initial === 'breadcrumbs' && !app.workspace.getActiveFile()) initial = 'commands';
    this.mode = initial;
  }

  public override onOpen(): void {
    const { modalEl, contentEl, containerEl } = this;
    containerEl.addClass('qw-radial-container');
    modalEl.addClass('qw-radial-modal');

    contentEl.addClass('qw-radial');
    this.render();

    // Tap on the empty overlay (outside ring/center) dismisses.
    contentEl.addEventListener('click', (e) => {
      if (e.target === contentEl) this.close();
    });

    if (this.settings.connectSurfaces) this.attachSwipeToDashboard(contentEl);
  }

  /**
   * Swipe down and release → hand off to the Dashboard (the fuller, scannable
   * view). Mirrors the on-screen "SWIPE DOWN · RELEASE" hint. Stateless: the
   * dashboard always opens fresh, it does not resume where it was left.
   */
  private attachSwipeToDashboard(el: HTMLElement): void {
    const THRESHOLD = 70;
    let startY = 0;
    let tracking = false;

    el.addEventListener('touchstart', (e: TouchEvent) => {
      startY = e.touches[0]!.clientY;
      tracking = true;
    }, { passive: true });

    el.addEventListener('touchend', (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const delta = (e.changedTouches[0]?.clientY ?? startY) - startY;
      if (delta >= THRESHOLD) {
        this.close();
        new DashboardModal(this.app, this.settings, this.editSettings, this.dashboardWidgetRegistry).open();
      }
    });

    el.addEventListener('touchcancel', () => { tracking = false; });
  }

  public override onClose(): void {
    this.contentEl.empty();
  }

  private cycleMode(): void {
    vibrate(8);
    const i = MODE_ORDER.indexOf(this.mode);
    this.mode = MODE_ORDER[(i + 1) % MODE_ORDER.length]!;
    if (this.settings.radialRememberLast) void this.editSettings((s) => { s.radialLastMode = this.mode; });
    this.render();
  }

  private render(): void {
    const el = this.contentEl;
    el.empty();

    // ── Swipe hint (decorative; the trigger gesture lives outside the modal) ──
    const hint = el.createEl('div', { cls: 'qw-radial-swipe-hint' });
    hint.createEl('div', { cls: 'qw-radial-swipe-bar' });
    hint.createEl('div', { cls: 'qw-radial-swipe-label', text: 'SWIPE DOWN · RELEASE' });

    // ── Mode label ──
    el.createEl('div', { cls: 'qw-radial-mode-label', text: MODE_LABEL[this.mode] });

    // ── Radial wrap ──
    const wrap = el.createEl('div', { cls: 'qw-radial-wrap' });
    wrap.innerHTML = this.guideSvg();

    const active = this.app.workspace.getActiveFile();
    // Computed once per render and threaded through to both the slot layout
    // and the context summary, instead of scanning resolvedLinks twice.
    const neighbors = active ? getCategorizedNeighbors(this.app, active, this.settings.breadcrumbField || 'up') : null;
    const slots = this.buildSlots(neighbors);

    for (let i = 0; i < SLOTS.length; i++) {
      this.renderSlot(wrap, SLOTS[i]!, slots[i]);
    }

    // ── Center node (mode switcher) ──
    const center = wrap.createEl('div', { cls: 'qw-radial-center' });
    const outer = center.createEl('div', { cls: 'qw-radial-center-outer' });
    const mid = outer.createEl('div', { cls: 'qw-radial-center-mid' });
    const inner = mid.createEl('div', { cls: 'qw-radial-center-inner' });
    inner.createEl('div', { cls: 'qw-radial-center-label', text: MODE_ABBR[this.mode] });
    center.addEventListener('click', (e) => { e.stopPropagation(); this.cycleMode(); });

    // ── Context label ──
    const ctx = el.createEl('div', { cls: 'qw-radial-context' });
    ctx.createEl('div', { cls: 'qw-radial-context-title', text: active ? active.basename : 'No active note' });
    if (neighbors) {
      ctx.createEl('div', {
        cls: 'qw-radial-context-meta',
        text: `${neighbors.parents.length} parent · ${neighbors.children.length} children · ${neighbors.siblings.length} siblings`,
      });
    }

    // ── Mode key (three dots) ──
    const key = el.createEl('div', { cls: 'qw-radial-mode-key' });
    for (const m of MODE_ORDER) {
      const item = key.createEl('div', {
        cls: m === this.mode ? 'qw-radial-mode-key-item active' : 'qw-radial-mode-key-item',
      });
      item.createEl('div', { cls: 'qw-radial-mode-dot' });
      item.appendText(MODE_LABEL[m]);
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.mode !== m) {
          this.mode = m;
          if (this.settings.radialRememberLast) void this.editSettings((s) => { s.radialLastMode = m; });
          this.render();
        }
      });
    }
  }

  private renderSlot(wrap: HTMLElement, pos: SlotPos, data: SlotData | undefined): void {
    const btn = wrap.createEl('div', {
      cls: `qw-radial-btn qw-radial-slot-${data?.kind ?? 'empty'}`,
    });
    btn.style.left = `${pos.left}px`;
    btn.style.top = `${pos.top}px`;
    if (!data || !data.onTap) btn.addClass('qw-radial-btn--ghost');

    const face = btn.createEl('div', { cls: 'qw-radial-btn-face' });

    if (data?.kind === 'overflow') {
      const stack = face.createEl('div', { cls: 'qw-radial-bc-stack' });
      stack.createEl('span', { cls: 'qw-radial-bc-arrow qw-radial-overflow-count', text: data.label });
      stack.createEl('span', { cls: 'qw-radial-bc-title', text: 'more' });
    } else if (data?.arrow || data?.title) {
      const stack = face.createEl('div', { cls: 'qw-radial-bc-stack' });
      if (data.arrow) stack.createEl('span', { cls: 'qw-radial-bc-arrow', text: data.arrow });
      if (data.title) stack.createEl('span', { cls: 'qw-radial-bc-title', text: data.title });
    } else if (data?.icon) {
      const iconEl = face.createEl('span', { cls: 'qw-radial-btn-icon' });
      if (data.iconType === 'glyph') iconEl.setText(data.icon);
      else setIcon(iconEl, data.icon);
    }

    if (data) btn.createEl('div', { cls: 'qw-radial-btn-label', text: data.label });

    if (data?.onTap) {
      btn.addEventListener('click', (e) => { e.stopPropagation(); vibrate(8); data.onTap!(e); });
    }
  }

  // ── Slot content per mode ──────────────────────────────────────────────────

  private buildSlots(neighbors: CategorizedNeighbors | null): (SlotData | undefined)[] {
    switch (this.mode) {
      case 'breadcrumbs': return this.breadcrumbSlots(neighbors);
      case 'commands':    return this.commandSlots();
      case 'recents':     return this.recentSlots();
      default:            return new Array<SlotData | undefined>(6).fill(undefined);
    }
  }

  private openFile(file: TFile): void {
    this.close();
    void this.app.workspace.getMostRecentLeaf()?.openFile(file);
  }

  private breadcrumbSlots(nb: CategorizedNeighbors | null): (SlotData | undefined)[] {
    return buildBreadcrumbSlots(
      nb,
      (file) => this.openFile(file),
      (overflowChildren, event) => { showOverflowMenu(overflowChildren, event, (file) => this.openFile(file)); },
    );
  }

  private commandSlots(): (SlotData | undefined)[] {
    return buildCommandSlots(this.app, this.settings, this.settings.radialCommands ?? [], () => this.close());
  }

  private recentSlots(): (SlotData | undefined)[] {
    return buildRecentSlots(this.app, this.settings.continueExcluded ?? [], (file) => this.openFile(file));
  }

  // ── SVG guide layer (arc segments + spokes), static per mode ───────────────

  private guideSvg(): string {
    if (this.mode === 'breadcrumbs') {
      return `<svg class="qw-radial-svg" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
        <path d="M 92.2 92.2 A 110 110 0 0 1 247.8 92.2" fill="none" stroke="#c9a84c" stroke-width="1" stroke-dasharray="3 5" opacity="0.25"/>
        <path d="M 247.8 92.2 A 110 110 0 0 1 247.8 247.8" fill="none" stroke="#bf5c7c" stroke-width="1" stroke-dasharray="3 5" opacity="0.25"/>
        <path d="M 247.8 247.8 A 110 110 0 0 1 92.2 247.8" fill="none" stroke="#4ca8a0" stroke-width="1" stroke-dasharray="3 5" opacity="0.25"/>
        <path d="M 92.2 247.8 A 110 110 0 0 1 92.2 92.2" fill="none" stroke="#bf5c7c" stroke-width="1" stroke-dasharray="3 5" opacity="0.25"/>
        <line x1="170" y1="170" x2="170" y2="60" stroke="#c9a84c" stroke-width="1" opacity="0.2"/>
        <line x1="170" y1="170" x2="265" y2="115" stroke="#bf5c7c" stroke-width="1" opacity="0.15"/>
        <line x1="170" y1="170" x2="265" y2="225" stroke="#4ca8a0" stroke-width="1" opacity="0.15"/>
        <line x1="170" y1="170" x2="170" y2="280" stroke="#4ca8a0" stroke-width="1" opacity="0.15"/>
        <line x1="170" y1="170" x2="75" y2="115" stroke="#bf5c7c" stroke-width="1" opacity="0.15"/>
      </svg>`;
    }
    // commands & recents: uniform purple ring + spokes
    return `<svg class="qw-radial-svg" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
      <circle cx="170" cy="170" r="110" fill="none" stroke="#3d2d6b" stroke-width="1" stroke-dasharray="3 6" opacity="0.5"/>
      <line x1="170" y1="170" x2="170" y2="60" stroke="#2a2840" stroke-width="1" opacity="0.5"/>
      <line x1="170" y1="170" x2="265" y2="115" stroke="#2a2840" stroke-width="1" opacity="0.5"/>
      <line x1="170" y1="170" x2="265" y2="225" stroke="#2a2840" stroke-width="1" opacity="0.3"/>
      <line x1="170" y1="170" x2="170" y2="280" stroke="#2a2840" stroke-width="1" opacity="0.3"/>
      <line x1="170" y1="170" x2="75" y2="225" stroke="#2a2840" stroke-width="1" opacity="0.3"/>
      <line x1="170" y1="170" x2="75" y2="115" stroke="#2a2840" stroke-width="1" opacity="0.5"/>
    </svg>`;
  }
}

import type { TFile } from 'obsidian';

import { setIcon } from 'obsidian';

import type { CategorizedNeighbors } from '../breadcrumbs.ts';
import type { DashboardWidgetContext, DashboardWidgetDefinition } from '../DashboardWidgetApi.ts';
import type { RadialMode } from '../PluginSettings.ts';
import type { RadialSlotData } from '../radialSlots.ts';

import { getCategorizedNeighbors } from '../breadcrumbs.ts';
import { vibrate } from '../haptics.ts';
import { buildBreadcrumbSlots, buildCommandSlots, buildRecentSlots, showOverflowMenu } from '../radialSlots.ts';

type Slot = RadialSlotData;

interface SlotPos {
  left: number;
  top: number;
}

const SLOTS: SlotPos[] = [
  { left: 130, top: 34 },
  { left: 213, top: 82 },
  { left: 213, top: 178 },
  { left: 130, top: 226 },
  { left: 47, top: 178 },
  { left: 47, top: 82 },
];

const MODE_ABBR: Record<RadialMode, string> = { breadcrumbs: 'BC', commands: 'CMD', recents: 'RE' };
const MODE_LABEL: Record<RadialMode, string> = { breadcrumbs: 'Breadcrumbs', commands: 'Commands', recents: 'Recents' };
const MODE_ORDER: RadialMode[] = ['breadcrumbs', 'commands', 'recents'];

function guideSvg(mode: RadialMode): string {
  if (mode === 'breadcrumbs') {
    return `<svg class="qw-dash-radial-guide" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
      <path d="M 58.99 58.99 A 100 100 0 0 1 201.01 58.99" fill="none" stroke="#c9a84c" stroke-width="1" stroke-dasharray="3 5" opacity="0.25"/>
      <path d="M 201.01 58.99 A 100 100 0 0 1 201.01 201.01" fill="none" stroke="#bf5c7c" stroke-width="1" stroke-dasharray="3 5" opacity="0.25"/>
      <path d="M 201.01 201.01 A 100 100 0 0 1 58.99 201.01" fill="none" stroke="#4ca8a0" stroke-width="1" stroke-dasharray="3 5" opacity="0.25"/>
      <path d="M 58.99 201.01 A 100 100 0 0 1 58.99 58.99" fill="none" stroke="#bf5c7c" stroke-width="1" stroke-dasharray="3 5" opacity="0.25"/>
    </svg>`;
  }
  return `<svg class="qw-dash-radial-guide" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
    <circle cx="130" cy="130" r="100" fill="none" stroke="#3d2d6b" stroke-width="1" stroke-dasharray="3 6" opacity="0.5"/>
  </svg>`;
}

function renderCenter(center: HTMLElement, mode: RadialMode): void {
  const outer = center.createEl('span', { cls: 'qw-dash-radial-center-outer' });
  const mid = outer.createEl('span', { cls: 'qw-dash-radial-center-mid' });
  const inner = mid.createEl('span', { cls: 'qw-dash-radial-center-inner' });
  inner.createEl('span', { cls: 'qw-dash-radial-center-label', text: MODE_ABBR[mode] });
}

function renderSlot(stage: HTMLElement, pos: SlotPos, data: Slot | undefined, index: number): void {
  const btn = stage.createEl('button', {
    attr: { 'data-qw-dash-radial-slot': String(index), type: 'button' },
    cls: `qw-dash-radial-mini-btn qw-radial-slot-${data?.kind ?? 'empty'}`,
  });
  btn.style.setProperty('left', `${pos.left}px`, 'important');
  btn.style.setProperty('top', `${pos.top}px`, 'important');
  if (!data?.onTap) btn.addClass('qw-dash-radial-mini-btn--ghost');

  const face = btn.createEl('span', { cls: 'qw-dash-radial-mini-face' });
  if (data?.kind === 'overflow') {
    face.createEl('span', { cls: 'qw-dash-radial-mini-arrow qw-radial-overflow-count', text: data.label });
    face.createEl('span', { cls: 'qw-dash-radial-mini-title', text: 'more' });
  } else if (data?.arrow || data?.title) {
    if (data.arrow) face.createEl('span', { cls: 'qw-dash-radial-mini-arrow', text: data.arrow });
    if (data.title) face.createEl('span', { cls: 'qw-dash-radial-mini-title', text: data.title });
  } else if (data?.icon) {
    const iconEl = face.createEl('span', { cls: 'qw-dash-radial-mini-icon' });
    if (data.iconType === 'glyph') iconEl.setText(data.icon);
    else setIcon(iconEl, data.icon);
  }

  if (data) btn.createEl('span', { cls: 'qw-dash-radial-mini-label', text: data.label });
  if (data?.onTap) {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      vibrate(8);
      data.onTap!(event);
    });
  }
}

function buildSlots(mode: RadialMode, ctx: DashboardWidgetContext): (Slot | undefined)[] {
  const openFile = (file: TFile): void => ctx.openFile(file);
  switch (mode) {
    case 'breadcrumbs': {
      const active = ctx.app.workspace.getActiveFile();
      const nb: CategorizedNeighbors | null = active
        ? getCategorizedNeighbors(ctx.app, active, ctx.settings.breadcrumbField || 'up')
        : null;
      return buildBreadcrumbSlots(
        nb,
        openFile,
        (overflowChildren, event) => { showOverflowMenu(overflowChildren, event, openFile); },
      );
    }
    case 'commands':
      return buildCommandSlots(ctx.app, ctx.settings, ctx.settings.radialCommands ?? [], ctx.close);
    case 'recents':
      return buildRecentSlots(ctx.app, ctx.settings.continueExcluded ?? [], openFile);
  }
}

function render(root: HTMLElement, ctx: DashboardWidgetContext): void {
  const requestedMode = ctx.settings.radialRememberLast
    ? (ctx.settings.dashboardRadialLastMode ?? ctx.settings.dashboardRadialMode ?? 'breadcrumbs')
    : (ctx.settings.dashboardRadialMode ?? 'breadcrumbs');
  let mode: RadialMode = requestedMode === 'breadcrumbs' && !ctx.app.workspace.getActiveFile() ? 'commands' : requestedMode;
  const interaction = ctx.settings.dashboardRadialInteraction ?? 'press-hold';
  let expanded = false;
  let currentSlots: (Slot | undefined)[] = [];

  root.createEl('div', { cls: 'qw-dash-section-label', text: 'RADIAL' });
  const card = root.createEl('div', { cls: 'qw-dash-radial-card' });
  let cancelPress: (() => void) | null = null;
  let centerTapTimer: number | null = null;
  let stopScrollSync: (() => void) | null = null;

  // The dashboard's scrollable container — `.qw-dash-scroll` (root's parent)
  // is `display: contents`, so the real scroll context is whatever the host
  // (Modal or sidebar view) gave DashboardContent as its content element.
  const scrollHost = root.closest<HTMLElement>('.modal-content, .view-content');

  // Card height changes between collapsed (~112px) and expanded (~282px),
  // and both states center their content via flex, so the center anchor's
  // screen position shifts when the height changes. That height change is
  // CSS-animated (.qw-dash-radial-card--expanded has a transition), so a
  // single before/after measurement taken right after render() would race
  // the animation and only capture its very first frame. Instead, track the
  // anchor's position every frame for the duration of the transition and
  // nudge scroll to match, so the point the user is looking at never visibly
  // drifts while the card grows/shrinks.
  const centerSelector = '.qw-dash-radial-compact-center, .qw-dash-radial-expanded-center';
  const setExpanded = (next: boolean): void => {
    stopScrollSync?.();
    const before = card.querySelector<HTMLElement>(centerSelector)?.getBoundingClientRect();
    expanded = next;
    renderCard();
    if (!before) return;

    let lastTop = before.top;
    let rafId = 0;
    const tick = (): void => {
      const top = card.querySelector<HTMLElement>(centerSelector)?.getBoundingClientRect().top;
      if (scrollHost && top !== undefined && top !== lastTop) {
        scrollHost.scrollTop += top - lastTop;
        lastTop = top;
      }
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);
    const stop = (): void => {
      window.cancelAnimationFrame(rafId);
      card.removeEventListener('transitionend', stop);
      if (stopScrollSync === stop) stopScrollSync = null;
    };
    stopScrollSync = stop;
    card.addEventListener('transitionend', stop, { once: true });
    window.setTimeout(stop, 400); // safety net if transitionend never fires
  };

  // ── Press & hold: press the compact center, drag to a slot, release to
  // select (release elsewhere, or a pointercancel, collapses). The initial
  // pointerdown target is replaced by the expanded DOM before release, so
  // selection is resolved by hit-testing the release point manually rather
  // than relying on a native `click`.
  const selectAtPoint = (event: PointerEvent): void => {
    if (cancelPress) {
      window.removeEventListener('pointercancel', cancelPress);
      cancelPress = null;
    }
    const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    const slotEl = target?.closest<HTMLElement>('[data-qw-dash-radial-slot]');
    const slotIndex = slotEl ? Number(slotEl.dataset['qwDashRadialSlot']) : Number.NaN;
    const slot = Number.isInteger(slotIndex) ? currentSlots[slotIndex] : undefined;
    if (slot?.onTap) {
      vibrate(8);
      slot.onTap(event);
      return;
    }
    setExpanded(false);
  };

  const beginPress = (event: PointerEvent): void => {
    event.preventDefault();
    setExpanded(true);
    cancelPress = () => {
      cancelPress = null;
      setExpanded(false);
    };
    window.addEventListener('pointerup', selectAtPoint, { once: true });
    window.addEventListener('pointercancel', cancelPress, { once: true });
  };

  // ── Tap to toggle: tapping the center opens it and it stays open. A
  // second tap on the center cycles to the next mode; collapsing instead
  // requires two taps in quick succession (manual double-tap — the native
  // `dblclick` event fires after two `click`s have already run, which would
  // cycle the mode twice before closing).
  const DOUBLE_TAP_MS = 280;
  const onCenterTapToggle = (): void => {
    if (centerTapTimer !== null) {
      window.clearTimeout(centerTapTimer);
      centerTapTimer = null;
      setExpanded(false);
      return;
    }
    centerTapTimer = window.setTimeout(() => {
      centerTapTimer = null;
      // Guard against the dashboard having been closed while this was pending.
      if (!card.isConnected) return;
      mode = MODE_ORDER[(MODE_ORDER.indexOf(mode) + 1) % MODE_ORDER.length]!;
      if (ctx.settings.radialRememberLast) {
        void ctx.editSettings((s) => { s.dashboardRadialLastMode = mode; });
      }
      renderCard();
    }, DOUBLE_TAP_MS);
  };

  const renderCard = (): void => {
    card.empty();
    card.classList.toggle('qw-dash-radial-card--expanded', expanded);
    currentSlots = expanded ? buildSlots(mode, ctx) : [];

    if (!expanded) {
      const compact = card.createEl('button', {
        attr: { 'aria-label': `Expand ${MODE_LABEL[mode]} radial launcher`, type: 'button' },
        cls: 'qw-dash-radial-compact-center',
      });
      renderCenter(compact, mode);
      if (interaction === 'tap-toggle') compact.addEventListener('click', () => { setExpanded(true); });
      else compact.addEventListener('pointerdown', beginPress);
      compact.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        setExpanded(true);
      });
      return;
    }

    const stage = card.createEl('div', { cls: 'qw-dash-radial-stage' });
    stage.innerHTML = guideSvg(mode);

    for (let i = 0; i < SLOTS.length; i++) {
      renderSlot(stage, SLOTS[i]!, currentSlots[i], i);
    }

    const center = stage.createEl('button', {
      attr: {
        'aria-label': interaction === 'tap-toggle'
          ? 'Tap to switch radial section, double-tap to close'
          : 'Collapse radial launcher',
        type: 'button',
      },
      cls: 'qw-dash-radial-expanded-center',
    });
    renderCenter(center, mode);
    center.addEventListener('click', (event) => {
      event.stopPropagation();
      if (interaction === 'tap-toggle') onCenterTapToggle();
      else setExpanded(false);
    });

    stage.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).closest('[data-qw-dash-radial-slot], .qw-dash-radial-expanded-center')) return;
      setExpanded(false);
    });
  };

  renderCard();
}

export const radialLauncherWidget: DashboardWidgetDefinition = {
  id: 'radial',
  label: 'Radial Launcher',
  render,
};

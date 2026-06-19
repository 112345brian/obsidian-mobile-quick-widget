import type {
  App,
  TFile
} from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Menu } from 'obsidian';

import type { CategorizedNeighbors } from './breadcrumbs.ts';
import type {
  PluginSettings,
  QuickAction,
  QuickActionIconType
} from './PluginSettings.ts';

import { executeQuickAction } from './quickActions.ts';
import { getRecentFiles } from './recents.ts';
import { truncate } from './text.ts';

export interface RadialSlotData {
  arrow?: string;
  icon?: string;
  iconType?: QuickActionIconType | undefined;
  kind: RadialSlotKind;
  label: string;
  // The originating click/pointer event is threaded through so a handler
  // That needs to anchor something visually (e.g. the overflow slot's
  // Menu) can position it at the tap point. Handlers that don't need it
  // Can ignore the parameter.
  onTap?: (event: MouseEvent) => void;
  title?: string;
}

/**
 * The six-slot content model shared by every surface that renders a radial
 * menu (the full-screen RadialMenuV3Modal and the embedded dashboard
 * launcher). Pure data — no DOM, no CSS — so both surfaces can render it
 * however suits their own sizing/markup while computing identical slot
 * content from identical logic.
 */
export type RadialSlotKind = 'child' | 'cmd' | 'overflow' | 'parent' | 'recent' | 'sibling';

const SLOT_COUNT = 6;
const TITLE_MAX_LEN = 12;

/**
 * Order matches the six ring positions [12, 2, 4, 6, 8, 10 o'clock]: parent
 * on top, children on the bottom two, siblings/sequence on the upper sides,
 * with an overflow slot at 8 o'clock when there are more children than fit.
 */
export function buildBreadcrumbSlots(
  nb: CategorizedNeighbors | null,
  openFile: (file: TFile) => void,
  onOverflow: (overflowChildren: TFile[], event: MouseEvent) => void
): (RadialSlotData | undefined)[] {
  if (!nb) return new Array<RadialSlotData | undefined>(SLOT_COUNT).fill(undefined);

  // Right flank prefers the explicit "next" sequence note, left prefers "prev".
  // Remaining sibling slots are filled from a shared queue so none is dropped
  // Or shown on both sides.
  const sibQueue = [...nb.siblings];
  const rightSibling = nb.next[0] ?? sibQueue.shift();
  const leftSibling = nb.prev[0] ?? sibQueue.shift();

  const parentSlot = (f: TFile | undefined): RadialSlotData | undefined =>
    f
      ? {
        arrow: '↑',
        kind: 'parent',
        label: 'parent',
        onTap: () => {
          openFile(f);
        },
        title: truncate(f.basename, TITLE_MAX_LEN)
      }
      : undefined;
  const childSlot = (f: TFile | undefined): RadialSlotData | undefined =>
    f
      ? {
        arrow: '↓',
        kind: 'child',
        label: 'child',
        onTap: () => {
          openFile(f);
        },
        title: truncate(f.basename, TITLE_MAX_LEN)
      }
      : undefined;
  const siblingSlot = (f: TFile | undefined, arrow: string): RadialSlotData | undefined =>
    f
      ? {
        arrow,
        kind: 'sibling',
        label: 'sibling',
        onTap: () => {
          openFile(f);
        },
        title: truncate(f.basename, TITLE_MAX_LEN)
      }
      : undefined;

  // 8 o'clock: overflow if there are more children than the two child slots
  const extraChildren = nb.children.length - 2;
  const overflowSlot: RadialSlotData | undefined = extraChildren > 0
    ? {
      kind: 'overflow',
      label: `+${extraChildren}`,
      onTap: (event) => {
        onOverflow(nb.children.slice(2), event);
      }
    }
    : childSlot(nb.children[2]);

  return [
    parentSlot(nb.parents[0]),
    siblingSlot(rightSibling, '→'),
    childSlot(nb.children[0]),
    childSlot(nb.children[1]),
    overflowSlot,
    siblingSlot(leftSibling, '←')
  ];
}

export function buildCommandSlots(
  app: App,
  settings: ReadonlyDeep<PluginSettings>,
  commands: readonly ReadonlyDeep<QuickAction>[],
  close: () => void
): (RadialSlotData | undefined)[] {
  const slots: (RadialSlotData | undefined)[] = [];
  for (let i = 0; i < SLOT_COUNT; i++) {
    const action = commands[i];
    slots.push(
      action
        ? {
          icon: action.icon || '·',
          iconType: action.iconType,
          kind: 'cmd',
          label: action.label,
          onTap: () => {
            void executeQuickAction(app, settings, action, close);
          }
        }
        : undefined
    );
  }
  return slots;
}

export function buildRecentSlots(
  app: App,
  excluded: readonly string[],
  openFile: (file: TFile) => void
): (RadialSlotData | undefined)[] {
  const files = getRecentFiles(app, excluded, SLOT_COUNT);
  const slots: (RadialSlotData | undefined)[] = [];
  for (let i = 0; i < SLOT_COUNT; i++) {
    const file = files[i];
    slots.push(
      file
        ? {
          kind: 'recent',
          label: truncate(file.basename, TITLE_MAX_LEN),
          onTap: () => {
            openFile(file);
          }
        }
        : undefined
    );
  }
  return slots;
}

/**
 * Lists overflowed breadcrumb children directly at the tap point, instead
 * of redirecting to the other radial surface — both surfaces share the same
 * fixed 6-slot layout, so redirecting would just recreate the same overflow
 * slot there too (the original bug this replaced: tapping the dashboard's
 * overflow opened the full radial menu, whose own overflow slot for the
 * same note bounced back to the dashboard, forever).
 */
export function showOverflowMenu(files: readonly TFile[], event: MouseEvent, openFile: (file: TFile) => void): void {
  const menu = new Menu();
  for (const file of files) {
    menu.addItem((item) =>
      item.setTitle(file.basename).onClick(() => {
        openFile(file);
      })
    );
  }
  menu.showAtMouseEvent(event);
}

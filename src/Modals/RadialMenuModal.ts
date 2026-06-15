import type { App } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Modal, Notice } from 'obsidian';

import type { PluginSettings, SliceConfig } from '../PluginSettings.ts';

import { createNote } from '../createNote.ts';
import { DashboardModal } from './DashboardModal.ts';

const SVG_NS = 'http://www.w3.org/2000/svg';

const GAP_DEG = 2;

function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function polarXY(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
  const a = deg2rad(angleDeg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function makeArcPath(
  cx: number, cy: number,
  outerR: number, innerR: number,
  startDeg: number, endDeg: number
): string {
  const s = startDeg + GAP_DEG;
  const e = endDeg - GAP_DEG;
  const large = (e - s) > 180 ? 1 : 0;

  const o1 = polarXY(cx, cy, outerR, s);
  const o2 = polarXY(cx, cy, outerR, e);
  const i1 = polarXY(cx, cy, innerR, e);
  const i2 = polarXY(cx, cy, innerR, s);

  return [
    `M ${o1.x} ${o1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i2.x} ${i2.y}`,
    'Z',
  ].join(' ');
}

export class RadialMenuModal extends Modal {
  private readonly settings: ReadonlyDeep<PluginSettings>;

  public constructor(app: App, settings: ReadonlyDeep<PluginSettings>) {
    super(app);
    this.settings = settings;
  }

  public override onOpen(): void {
    const { modalEl, contentEl } = this;
    modalEl.addClass('qw-modal');
    contentEl.addClass('qw-content');

    const bg = this.containerEl.querySelector<HTMLElement>('.modal-bg');
    if (bg) {
      bg.style.setProperty('opacity', '1');
      bg.style.setProperty('background', 'rgba(0,0,0,0.5)');
      bg.style.setProperty('backdrop-filter', 'blur(6px)');
      bg.style.setProperty('-webkit-backdrop-filter', 'blur(6px)');
    }

    const w = activeWindow.innerWidth;
    const h = activeWindow.innerHeight;
    const size = Math.min(w, h) * 0.85;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 8;
    const innerR = outerR * 0.28;

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.addClass('qw-svg');

    this.settings.slices.forEach((slice, i) => {
      const span = slice.endAngle - slice.startAngle;
      if (span <= GAP_DEG * 2) return;
      const g = this.makeSliceGroup(cx, cy, outerR, innerR, slice, i);
      svg.appendChild(g);
    });

    const hasCancelSlice = this.settings.slices.some((s) => s.action === 'cancel');
    if (!hasCancelSlice) {
      const centerBg = document.createElementNS(SVG_NS, 'circle');
      centerBg.setAttribute('cx', String(cx));
      centerBg.setAttribute('cy', String(cy));
      centerBg.setAttribute('r', String(innerR - 4));
      centerBg.addClass('qw-center');
      svg.appendChild(centerBg);

      const centerText = document.createElementNS(SVG_NS, 'text');
      centerText.setAttribute('x', String(cx));
      centerText.setAttribute('y', String(cy));
      centerText.setAttribute('text-anchor', 'middle');
      centerText.setAttribute('dominant-baseline', 'middle');
      centerText.addClass('qw-center-icon');
      centerText.textContent = '✕';
      svg.appendChild(centerText);

      const closeCenter = (): void => { this.close(); };
      centerBg.addEventListener('click', closeCenter);
      centerText.addEventListener('click', closeCenter);
    }

    contentEl.appendChild(svg);

    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl || e.target === contentEl) this.close();
    });

    requestAnimationFrame(() => {
      svg.addClass('qw-svg--open');
    });
  }

  public override onClose(): void {
    this.contentEl.empty();
  }

  private makeSliceGroup(
    cx: number, cy: number,
    outerR: number, innerR: number,
    slice: ReadonlyDeep<SliceConfig>,
    index: number
  ): SVGGElement {
    const g = document.createElementNS(SVG_NS, 'g') as SVGGElement;
    g.addClass('qw-slice-group');
    g.style.setProperty('--i', String(index));

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', makeArcPath(cx, cy, outerR, innerR, slice.startAngle, slice.endAngle));
    path.setAttribute('fill', slice.color);
    path.addClass('qw-slice');
    g.appendChild(path);

    const mid = (slice.startAngle + slice.endAngle) / 2;
    const labelR = (outerR + innerR) / 2;
    const lp = polarXY(cx, cy, labelR, mid);

    // Scale icon/label offset to the radial depth so they don't overlap on narrow slices
    const depth = outerR - innerR;
    const offset = Math.min(12, depth * 0.2);

    const iconEl = document.createElementNS(SVG_NS, 'text');
    iconEl.setAttribute('x', String(lp.x));
    iconEl.setAttribute('y', String(lp.y - offset));
    iconEl.setAttribute('text-anchor', 'middle');
    iconEl.setAttribute('dominant-baseline', 'middle');
    iconEl.addClass('qw-icon');
    iconEl.textContent = slice.icon;
    g.appendChild(iconEl);

    // Hide label on slices narrower than 45° to avoid overflow
    const span = slice.endAngle - slice.startAngle;
    if (span >= 45) {
      const labelEl = document.createElementNS(SVG_NS, 'text');
      labelEl.setAttribute('x', String(lp.x));
      labelEl.setAttribute('y', String(lp.y + offset + 4));
      labelEl.setAttribute('text-anchor', 'middle');
      labelEl.setAttribute('dominant-baseline', 'middle');
      labelEl.addClass('qw-label');
      labelEl.textContent = slice.label;
      g.appendChild(labelEl);
    }

    g.addEventListener('click', () => { void this.handleSlice(slice); });
    return g;
  }

  private async handleSlice(slice: ReadonlyDeep<SliceConfig>): Promise<void> {
    this.close();

    switch (slice.action) {
      case 'cancel':
        break;

      case 'dashboard': {
        new DashboardModal(this.app, this.settings).open();
        break;
      }

      case 'homepage': {
        const target = this.settings.homePath;
        if (target) {
          const file = this.app.vault.getFileByPath(target);
          if (file) {
            await this.app.workspace.getMostRecentLeaf()?.openFile(file);
            return;
          }
        }
        try {
          if (this.app.commands.findCommand('homepage:open')) {
            this.app.commands.executeCommandById('homepage:open');
          } else {
            new Notice('No home note configured. Set a path in Mobile Quick Widget settings.');
          }
        } catch {
          new Notice('No home note configured. Set a path in Mobile Quick Widget settings.');
        }
        break;
      }

      case 'new-note': {
        const file = await createNote(this.app, this.settings);
        await this.app.workspace.getMostRecentLeaf()?.openFile(file);
        break;
      }

      case 'command': {
        if (slice.commandId) {
          this.app.commands.executeCommandById(slice.commandId);
        }
        break;
      }
    }
  }
}

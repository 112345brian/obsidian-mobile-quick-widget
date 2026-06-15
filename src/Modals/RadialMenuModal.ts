import type { App } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Modal, TFile } from 'obsidian';

import type { PluginSettings, SliceConfig } from '../PluginSettings.ts';

const SVG_NS = 'http://www.w3.org/2000/svg';
const GAP_DEG = 1.5;

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
    // Apply dimming to the container that wraps the modal and its bg overlay
    modalEl.parentElement?.addClass('qw-modal-container');
    contentEl.addClass('qw-content');

    const size = Math.min(window.innerWidth, window.innerHeight) * 0.85;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 8;
    const innerR = outerR * 0.32;

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.addClass('qw-svg');

    for (const slice of this.settings.slices) {
      const g = this.makeSliceGroup(cx, cy, outerR, innerR, slice);
      svg.appendChild(g);
    }

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
  }

  public override onClose(): void {
    this.contentEl.empty();
  }

  private makeSliceGroup(
    cx: number, cy: number,
    outerR: number, innerR: number,
    slice: ReadonlyDeep<SliceConfig>
  ): SVGGElement {
    const g = document.createElementNS(SVG_NS, 'g') as SVGGElement;
    g.addClass('qw-slice-group');

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', makeArcPath(cx, cy, outerR, innerR, slice.startAngle, slice.endAngle));
    path.setAttribute('fill', slice.color);
    path.addClass('qw-slice');
    g.appendChild(path);

    const mid = (slice.startAngle + slice.endAngle) / 2;
    const labelR = (outerR + innerR) / 2;
    const lp = polarXY(cx, cy, labelR, mid);

    const iconEl = document.createElementNS(SVG_NS, 'text');
    iconEl.setAttribute('x', String(lp.x));
    iconEl.setAttribute('y', String(lp.y - 12));
    iconEl.setAttribute('text-anchor', 'middle');
    iconEl.setAttribute('dominant-baseline', 'middle');
    iconEl.addClass('qw-icon');
    iconEl.textContent = slice.icon;
    g.appendChild(iconEl);

    const labelEl = document.createElementNS(SVG_NS, 'text');
    labelEl.setAttribute('x', String(lp.x));
    labelEl.setAttribute('y', String(lp.y + 14));
    labelEl.setAttribute('text-anchor', 'middle');
    labelEl.setAttribute('dominant-baseline', 'middle');
    labelEl.addClass('qw-label');
    labelEl.textContent = slice.label;
    g.appendChild(labelEl);

    g.addEventListener('click', () => { void this.handleSlice(slice); });
    return g;
  }

  private async handleSlice(slice: ReadonlyDeep<SliceConfig>): Promise<void> {
    this.close();

    switch (slice.action) {
      case 'cancel':
        break;

      case 'homepage': {
        const target = this.settings.homePath;
        if (target) {
          const file = this.app.vault.getAbstractFileByPath(target);
          if (file instanceof TFile) {
            await this.app.workspace.getMostRecentLeaf()?.openFile(file);
            return;
          }
        }
        // Fall back to the Homepage plugin command if installed
        (this.app as unknown as { commands: { executeCommandById: (id: string) => void } })
          .commands.executeCommandById('homepage:open');
        break;
      }

      case 'new-note': {
        const folder = this.settings.newNoteFolder;
        const date = new Date().toLocaleDateString('en-CA');
        let finalPath = folder ? `${folder}/Untitled ${date}.md` : `Untitled ${date}.md`;
        let n = 1;
        while (this.app.vault.getAbstractFileByPath(finalPath)) {
          finalPath = folder
            ? `${folder}/Untitled ${date} ${n}.md`
            : `Untitled ${date} ${n}.md`;
          n++;
        }
        const file = await this.app.vault.create(finalPath, '');
        await this.app.workspace.getMostRecentLeaf()?.openFile(file);
        break;
      }

      case 'command': {
        if (slice.commandId) {
          (this.app as unknown as { commands: { executeCommandById: (id: string) => void } })
            .commands.executeCommandById(slice.commandId);
        }
        break;
      }
    }
  }
}

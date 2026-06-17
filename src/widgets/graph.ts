import type { TFile } from 'obsidian';

import type { NeighborRelation } from '../breadcrumbs.ts';
import type {
 DashboardWidgetContext, DashboardWidgetDefinition
} from '../DashboardWidgetApi.ts';

import {
 REL_PALETTE, relColor, resolveBCRelations
} from '../breadcrumbs.ts';
import { getRecentFiles } from '../recents.ts';
import {
 escapeXml, truncate
} from '../text.ts';

function buildGraphSvg(
  app: DashboardWidgetContext['app'],
  center: TFile,
  neighborPaths: string[],
  expanded: boolean,
  relations: Map<string, NeighborRelation>
): string {
  const cx = 171;
  const viewH = expanded ? 356 : 178;
  const cy = viewH / 2;
  const r = expanded ? 115 : 58;
  const n = neighborPaths.length;

  const parentPaths = neighborPaths.filter((p) => relations.get(p)?.rel === 'parent');
  const childPaths = neighborPaths.filter((p) => relations.get(p)?.rel === 'child');
  const nextPaths = neighborPaths.filter((p) => relations.get(p)?.rel === 'next');
  const prevPaths = neighborPaths.filter((p) => relations.get(p)?.rel === 'prev');
  const siblingPaths = neighborPaths.filter((p) => relations.get(p)?.rel === 'sibling');
  const otherPaths = neighborPaths.filter((p) => !relations.has(p));

  const spreadArc = (paths: string[], centerAngle: number, spread: number): { angle: number; path: string }[] =>
    paths.map((path, i) => ({
      angle: centerAngle + (paths.length === 1 ? 0 : (i / (paths.length - 1) - 0.5) * spread),
      path
    }));

  interface Positioned { angle: number; path: string }
  let positioned: Positioned[];

  const hasBC = parentPaths.length > 0 || childPaths.length > 0 || nextPaths.length > 0 || prevPaths.length > 0 || siblingPaths.length > 0;
  if (hasBC) {
    // Parents → top, children → bottom, prev ← left, next → right, siblings → upper sides, others scattered
    const parentA = spreadArc(parentPaths, -Math.PI / 2, Math.PI * 0.4);
    const childA = spreadArc(childPaths, Math.PI / 2, Math.PI * 0.4);
    const prevA = spreadArc(prevPaths, Math.PI, Math.PI * 0.25);
    const nextA = spreadArc(nextPaths, 0, Math.PI * 0.25);
    const siblingA = spreadArc(siblingPaths, -Math.PI / 4, Math.PI * 0.5);
    const otherA = otherPaths.map((path, i) => ({
      angle: (i / Math.max(otherPaths.length, 1)) * 2 * Math.PI,
      path
    }));
    positioned = [...parentA, ...childA, ...prevA, ...nextA, ...siblingA, ...otherA];
  } else {
    positioned = neighborPaths.map((path, i) => ({
      angle: (i / Math.max(n, 1)) * 2 * Math.PI - Math.PI / 2,
      path
    }));
  }

  const neighbors = positioned.map(({ angle, path }) => {
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const name = app.vault.getFileByPath(path)?.basename ?? path.split('/').pop()?.replace(/\.md$/, '') ?? '';
    const info = relations.get(path) ?? null;
    return { info, name, path, x, y };
  });

  // Edge lines — sequence edges get directional arrows, others plain
  const edges = neighbors.map((nb) => {
    const rel = nb.info?.rel;
    if (rel === 'next' || rel === 'prev') {
      const dx = nb.x - cx, dy = nb.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / dist, uy = dy / dist;
      const mx = cx + dx * 0.55, my = cy + dy * 0.55;
      const px = -uy * 3, py = ux * 3;
      const tip = rel === 'next' ? `${(mx + ux * 6).toFixed(1)},${(my + uy * 6).toFixed(1)}` : `${(mx - ux * 6).toFixed(1)},${(my - uy * 6).toFixed(1)}`;
      const w1 = rel === 'next' ? `${(mx - ux * 4 + px).toFixed(1)},${(my - uy * 4 + py).toFixed(1)}` : `${(mx + ux * 4 + px).toFixed(1)},${(my + uy * 4 + py).toFixed(1)}`;
      const w2 = rel === 'next' ? `${(mx - ux * 4 - px).toFixed(1)},${(my - uy * 4 - py).toFixed(1)}` : `${(mx + ux * 4 - px).toFixed(1)},${(my + uy * 4 - py).toFixed(1)}`;
      return `<line x1="${cx}" y1="${cy}" x2="${nb.x.toFixed(1)}" y2="${nb.y.toFixed(1)}" stroke="${REL_PALETTE.rose}" stroke-width="1" opacity="0.45"/>`
             + `<polygon points="${tip} ${w1} ${w2}" fill="${REL_PALETTE.rose}" opacity="0.6"/>`;
    }
    const stroke = rel ? relColor(rel).node : '#2e2e3a';
    const op = rel ? 0.45 : 0.8;
    return `<line x1="${cx}" y1="${cy}" x2="${nb.x.toFixed(1)}" y2="${nb.y.toFixed(1)}" stroke="${stroke}" stroke-width="1" opacity="${op}"/>`;
  }).join('');

  // Labels — wrap up to 3 lines of ~12 chars each
  const CHAR_W = 5.5;
  const LINE_H = 9;
  const LABEL_PAD_Y = 3;
  const MAX_LINE = 12;
  const MAX_LINES = 3;

  const wrapLabel = (name: string, glyph: string): string[] => {
    const lines: string[] = [];
    let rem = name;
    while (rem.length > 0 && lines.length < MAX_LINES) {
      if (rem.length <= MAX_LINE) { lines.push(rem); break; }
      let cut = MAX_LINE;
      for (let k = MAX_LINE - 1; k > MAX_LINE - 5; k--) {
        if (' -_'.includes(rem[k] ?? '')) { cut = k + 1; break; }
      }
      lines.push(rem.slice(0, cut).trimEnd());
      rem = rem.slice(cut).trimStart();
    }
    if (rem.length > 0) {
      const last = lines[lines.length - 1] ?? '';
      lines[lines.length - 1] = `${last.slice(0, MAX_LINE - 1)}…`;
    }
    if (glyph) { lines[lines.length - 1] = (lines[lines.length - 1] ?? '') + glyph; }
    return lines;
  };

  interface LabelInfo { info: NeighborRelation | null; lines: string[]; nx: number; ny: number; path: string; totalH: number; w: number; x: number; y: number }
  const labels: LabelInfo[] = neighbors.map((nb) => {
    const rel = nb.info?.rel;
    const glyph = rel === 'parent' ? ' ↑' : rel === 'child' ? ' ↓' : rel === 'next' ? ' →' : rel === 'prev' ? ' ←' : rel === 'sibling' ? ' ·' : '';
    const lines = wrapLabel(nb.name, glyph);
    const w = Math.max(...lines.map((l) => l.length)) * CHAR_W;
    const totalH = lines.length * LINE_H;
    const above = nb.y < cy;
    // Y = top of the first line's baseline
    const ly = above ? nb.y - 4 - LABEL_PAD_Y - totalH + LINE_H : nb.y + 4 + LABEL_PAD_Y + LINE_H;
    return { info: nb.info, lines, nx: nb.x, ny: nb.y, path: nb.path, totalH, w, x: nb.x, y: ly };
  });

  // Collision resolution — AABB overlap, resolve on cheapest axis
  for (let pass = 0; pass < 12; pass++) {
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i]!, b = labels[j]!;
        const ho = Math.max(0, Math.min(a.x + a.w / 2, b.x + b.w / 2) - Math.max(a.x - a.w / 2, b.x - b.w / 2));
        const vo = Math.max(0, Math.min(a.y + a.totalH, b.y + b.totalH) - Math.max(a.y, b.y));
        if (ho <= 0 || vo <= 0) { continue; }
        if (ho <= vo) {
          const push = ho / 2 + 1;
          if (a.x <= b.x) { a.x -= push; b.x += push; } else { a.x += push; b.x -= push; }
        } else {
          const push = vo / 2 + 1;
          if (a.y <= b.y) { a.y -= push; b.y += push; } else { a.y += push; b.y -= push; }
        }
      }
    }
  }

  const nodes = labels.map((lb) => {
    const rel = lb.info?.rel;
    const { label: labelColor, node: nodeColor } = relColor(rel);
    const sibParent = lb.info?.siblingParent;
    const subLabel = rel === 'sibling' && sibParent
      ? `<text x="${lb.nx.toFixed(1)}" y="${(lb.ny - 8).toFixed(1)}" text-anchor="middle" fill="${REL_PALETTE.rose}" font-size="5.5" font-family="monospace" opacity="0.6">${escapeXml(sibParent.slice(0, 10))}</text>`
      : '';
    const textEls = lb.lines.map((line, li) =>
      `<text x="${lb.x.toFixed(1)}" y="${(lb.y + li * LINE_H).toFixed(1)}" text-anchor="middle" fill="${labelColor}" font-size="7" font-family="monospace" opacity="0.85">${escapeXml(line)}</text>`
    ).join('');
    const pad = 3;
    const rectX = (lb.x - lb.w / 2 - pad).toFixed(1);
    const rectY = (lb.y - LINE_H + 1 - pad).toFixed(1);
    const rectW = (lb.w + pad * 2).toFixed(1);
    const rectH = (lb.totalH + pad * 2).toFixed(1);
    return `<g data-path="${escapeXml(lb.path)}" style="cursor:pointer">
      <rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" fill="transparent"/>
      <circle cx="${lb.nx.toFixed(1)}" cy="${lb.ny.toFixed(1)}" r="8" fill="transparent"/>
      ${subLabel}
      <circle cx="${lb.nx.toFixed(1)}" cy="${lb.ny.toFixed(1)}" r="4" fill="#1e1e28" stroke="${nodeColor}" stroke-width="1"/>
      ${textEls}
    </g>`;
  }).join('');

  const centerLabel = escapeXml(truncate(center.basename, 20));

  return `<svg viewBox="0 0 343 ${viewH}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <g>${edges}</g>
    <g>${nodes}</g>
    <g data-center style="cursor:pointer">
      <circle cx="${cx}" cy="${cy}" r="22" fill="transparent"/>
      <circle cx="${cx}" cy="${cy}" r="16" fill="none" stroke="#7c5cbf" stroke-width="1" opacity="0.2"/>
      <circle cx="${cx}" cy="${cy}" r="13" fill="#1a1230" stroke="#9b7ce8" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="7" fill="#7c5cbf"/>
      <circle cx="${cx}" cy="${cy}" r="3" fill="#d4b8ff"/>
      <text x="${cx}" y="${cy + 26}" text-anchor="middle" fill="#e8e8ec" font-size="8" font-family="sans-serif" font-weight="500">${centerLabel}</text>
    </g>
  </svg>`;
}

function render(root: HTMLElement, ctx: DashboardWidgetContext): void {
  const centerFile = ctx.app.workspace.getActiveFile() ?? getRecentFiles(ctx.app, ctx.settings.continueExcluded ?? [], ctx.settings.recentListCount ?? 15)[0];
  if (!centerFile) { return; }

  const resolvedLinks = ctx.app.metadataCache.resolvedLinks;
  const outgoing = Object.keys(resolvedLinks[centerFile.path] ?? {});
  const incoming: string[] = [];
  for (const [src, links] of Object.entries(resolvedLinks)) {
    if (src !== centerFile.path && links[centerFile.path]) { incoming.push(src); }
  }
  const neighborPaths = [...new Set([...outgoing, ...incoming])];
  const totalConnections = neighborPaths.length;

  root.createEl('div', { cls: 'qw-dash-section-label', text: 'ACTIVE CLUSTER' });

  const card = root.createEl('div', { cls: 'qw-dash-graph-card' });
  const canvas = card.createEl('div', { cls: 'qw-dash-graph-canvas' });
  const relations = resolveBCRelations(ctx.app, centerFile, neighborPaths, ctx.settings.breadcrumbField || 'up');
  const attachListeners = (expanded: boolean): void => {
    canvas.innerHTML = buildGraphSvg(ctx.app, centerFile, neighborPaths.slice(0, expanded ? 20 : 10), expanded, relations);

    canvas.querySelectorAll<SVGElement>('[data-path]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const file = ctx.app.vault.getFileByPath(el.getAttribute('data-path') ?? '');
        if (file) { ctx.openFile(file); }
      });
    });

    canvas.querySelector<SVGElement>('[data-center]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      ctx.openFile(centerFile);
    });

    canvas.addEventListener('click', () => {
      const expanded2 = card.classList.toggle('qw-dash-graph-card--expanded');
      attachListeners(expanded2);
    }, { once: true });
  };

  attachListeners(false);

  const footer = card.createEl('div', { cls: 'qw-dash-graph-footer' });
  const stat = footer.createEl('div', { cls: 'qw-dash-graph-stat' });
  stat.createEl('div', { cls: 'qw-dash-graph-dot' });
  stat.createEl('span', { text: `${totalConnections} connected notes` });

  const btn = footer.createEl('button', { cls: 'qw-dash-graph-btn', text: 'FULL GRAPH →' });
  btn.addEventListener('click', () => {
    ctx.close();
    try { ctx.app.commands.executeCommandById('graph:open'); } catch { /* */ }
  });
}

export const graphWidget: DashboardWidgetDefinition = {
  id: 'graph',
  label: 'Active Cluster (graph)',
  render
};

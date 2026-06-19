import type {
  App,
  TFile
} from 'obsidian';

import { getExternalPlugin } from './externalPlugin.ts';

// ── Breadcrumbs plugin shim (for parent lookup) ──────────────────────────────

export type BCRel = 'child' | 'next' | 'parent' | 'prev' | 'sibling';

interface BCGraph {
  get_filtered_outgoing_edges(path: string): { attr: { dir?: string; direction?: string; field?: string }; target_id: string }[];
  has_node(path: string): boolean;
}

// ── Bread-trail / Breadcrumbs relation resolver ──────────────────────────────
// Reads frontmatter links directly — no plugin API dependency.
// Bread-trail uses keys: up, up.*, down, down.*, next, next.*, prev, prev.*

export function getBCGraph(app: App): BCGraph | null {
  const plugin = getExternalPlugin<{ graph?: BCGraph }>(app, 'breadcrumbs');
  return plugin?.graph ?? null;
}

/**
 * The relationship colour system, shared by every surface that visualises
 * breadcrumb relations (dashboard graph + radial menu).
 *   gold = parent ("origin"), teal = child ("forward"), rose = sibling/sequence
 *   ("lateral"). Purple is reserved for commands/chrome and never appears here.
 */
export const REL_PALETTE = {
  gold: '#c9a84c',
  goldBright: '#e3c98a',
  rose: '#bf5c7c',
  roseBright: '#e08aa6',
  teal: '#4ca8a0',
  tealBright: '#7fd0c8'
} as const;

export interface CategorizedNeighbors {
  children: TFile[];
  next: TFile[];
  parents: TFile[];
  prev: TFile[];
  siblings: TFile[];
}

export interface NeighborRelation {
  rel: BCRel;
  siblingParent?: string | undefined;
}

/**
 * Discovers a note's linked neighbors (resolved links, both directions) and
 * classifies each by breadcrumb relation. Returns the files grouped by type.
 * `parentField` matches DashboardModal's `breadcrumbField` setting (defaults
 * to 'up') so the radial and the dashboard agree on which frontmatter key
 * marks a parent link.
 */
export function getCategorizedNeighbors(app: App, center: TFile, parentField = 'up'): CategorizedNeighbors {
  const resolved = app.metadataCache.resolvedLinks;
  const outgoing = Object.keys(resolved[center.path] ?? {});
  const incoming: string[] = [];
  for (const [src, links] of Object.entries(resolved)) {
    if (src !== center.path && links[center.path]) incoming.push(src);
  }
  const neighborPaths = [...new Set([...outgoing, ...incoming])];
  const relations = resolveBCRelations(app, center, neighborPaths, parentField);

  const out: CategorizedNeighbors = { children: [], next: [], parents: [], prev: [], siblings: [] };
  for (const [path, info] of relations) {
    const file = app.vault.getFileByPath(path);
    if (!file) continue;
    switch (info.rel) {
      case 'child':
        out.children.push(file);
        break;
      case 'next':
        out.next.push(file);
        break;
      case 'parent':
        out.parents.push(file);
        break;
      case 'prev':
        out.prev.push(file);
        break;
      case 'sibling':
        out.siblings.push(file);
        break;
    }
  }
  return out;
}

export function getFrontmatterLinkTargets(app: App, file: TFile, keyPrefix: string): Set<string> {
  const links = app.metadataCache.getFileCache(file)?.frontmatterLinks ?? [];
  const result = new Set<string>();
  for (const link of links) {
    if (link.key === keyPrefix || link.key.startsWith(`${keyPrefix}.`)) {
      const target = app.metadataCache.getFirstLinkpathDest(link.link, file.path);
      if (target) result.add(target.path);
    }
  }
  return result;
}

// ── Categorized neighbor discovery (for the radial menu) ─────────────────────

export function relColor(rel: BCRel | undefined): { label: string; node: string } {
  switch (rel) {
    case 'child':
      return { label: REL_PALETTE.tealBright, node: REL_PALETTE.teal };
    case 'next':
    case 'prev':
    case 'sibling':
      return { label: REL_PALETTE.roseBright, node: REL_PALETTE.rose };
    case 'parent':
      return { label: REL_PALETTE.goldBright, node: REL_PALETTE.gold };
    default:
      return { label: '#9b7ce8', node: '#3a3a50' };
  }
}

export function resolveBCRelations(
  app: App,
  center: TFile,
  neighborPaths: string[],
  parentField = 'up'
): Map<string, NeighborRelation> {
  const result = new Map<string, NeighborRelation>();

  // Center's own up/down/next/prev targets
  const centerParents = getFrontmatterLinkTargets(app, center, parentField);
  const centerChildren = getFrontmatterLinkTargets(app, center, 'down');
  const centerNext = getFrontmatterLinkTargets(app, center, 'next');
  const centerPrev = getFrontmatterLinkTargets(app, center, 'prev');

  for (const path of neighborPaths) {
    const file = app.vault.getFileByPath(path);

    if (centerParents.has(path)) {
      result.set(path, { rel: 'parent' });
      continue;
    }
    if (centerChildren.has(path)) {
      result.set(path, { rel: 'child' });
      continue;
    }
    if (centerNext.has(path)) {
      result.set(path, { rel: 'next' });
      continue;
    }
    if (centerPrev.has(path)) {
      result.set(path, { rel: 'prev' });
      continue;
    }

    if (file) {
      // If neighbor has a parent-field link pointing to center → it's a child
      const neighborParents = getFrontmatterLinkTargets(app, file, parentField);
      if (neighborParents.has(center.path)) {
        result.set(path, { rel: 'child' });
        continue;
      }
      // If center has a parent-field link to center's parent,
      // And neighbor also links to that same parent → sibling
      if (centerParents.size > 0) {
        for (const parentPath of centerParents) {
          if (neighborParents.has(parentPath)) {
            const parentFile = app.vault.getFileByPath(parentPath);
            result.set(path, { rel: 'sibling', siblingParent: parentFile?.basename });
            break;
          }
        }
        if (result.has(path)) continue;
      }
      // If neighbor's next/prev points to center, or center's next/prev resolves from neighbor
      const neighborNext = getFrontmatterLinkTargets(app, file, 'next');
      const neighborPrev = getFrontmatterLinkTargets(app, file, 'prev');
      if (neighborNext.has(center.path)) {
        result.set(path, { rel: 'prev' });
        continue;
      }
      if (neighborPrev.has(center.path)) {
        result.set(path, { rel: 'next' });
        continue;
      }
    }
  }

  return result;
}

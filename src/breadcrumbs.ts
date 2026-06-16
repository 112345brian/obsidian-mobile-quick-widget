import type { App, TFile } from 'obsidian';

// ── Breadcrumbs plugin shim (for parent lookup) ──────────────────────────────

interface BCGraph {
  has_node(path: string): boolean;
  get_filtered_outgoing_edges(path: string): { target_id: string; attr: { field?: string; dir?: string; direction?: string } }[];
}

export function getBCGraph(app: App): BCGraph | null {
  const p = (app as unknown as { plugins: { plugins: Record<string, unknown> } })
    .plugins?.plugins?.['breadcrumbs'] as { graph?: BCGraph } | undefined;
  return p?.graph ?? null;
}

// ── Bread-trail / Breadcrumbs relation resolver ──────────────────────────────
// Reads frontmatter links directly — no plugin API dependency.
// Bread-trail uses keys: up, up.*, down, down.*, next, next.*, prev, prev.*

export type BCRel = 'parent' | 'child' | 'next' | 'prev' | 'sibling';

/**
 * The relationship colour system, shared by every surface that visualises
 * breadcrumb relations (dashboard graph + radial menu).
 *   gold = parent ("origin"), teal = child ("forward"), rose = sibling/sequence
 *   ("lateral"). Purple is reserved for commands/chrome and never appears here.
 */
export const REL_PALETTE = {
  gold: '#c9a84c', goldBright: '#e3c98a',
  teal: '#4ca8a0', tealBright: '#7fd0c8',
  rose: '#bf5c7c', roseBright: '#e08aa6',
} as const;

export function relColor(rel: BCRel | undefined): { node: string; label: string } {
  switch (rel) {
    case 'parent': return { node: REL_PALETTE.gold, label: REL_PALETTE.goldBright };
    case 'child':  return { node: REL_PALETTE.teal, label: REL_PALETTE.tealBright };
    case 'sibling':
    case 'next':
    case 'prev':   return { node: REL_PALETTE.rose, label: REL_PALETTE.roseBright };
    default:       return { node: '#3a3a50', label: '#9b7ce8' };
  }
}

export interface NeighborRelation {
  rel: BCRel;
  siblingParent?: string | undefined;
}

export function getFrontmatterLinkTargets(app: App, file: TFile, keyPrefix: string): Set<string> {
  const links = app.metadataCache.getFileCache(file)?.frontmatterLinks ?? [];
  const result = new Set<string>();
  for (const link of links) {
    if (link.key === keyPrefix || link.key.startsWith(keyPrefix + '.')) {
      const target = app.metadataCache.getFirstLinkpathDest(link.link, file.path);
      if (target) result.add(target.path);
    }
  }
  return result;
}

export function resolveBCRelations(
  app: App,
  center: TFile,
  neighborPaths: string[],
  parentField = 'up',
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
      // and neighbor also links to that same parent → sibling
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
      if (neighborNext.has(center.path)) { result.set(path, { rel: 'prev' }); continue; }
      if (neighborPrev.has(center.path)) { result.set(path, { rel: 'next' }); continue; }
    }
  }

  return result;
}

// ── Categorized neighbor discovery (for the radial menu) ─────────────────────

export interface CategorizedNeighbors {
  parents: TFile[];
  children: TFile[];
  siblings: TFile[];
  next: TFile[];
  prev: TFile[];
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

  const out: CategorizedNeighbors = { parents: [], children: [], siblings: [], next: [], prev: [] };
  for (const [path, info] of relations) {
    const file = app.vault.getFileByPath(path);
    if (!file) continue;
    switch (info.rel) {
      case 'parent':  out.parents.push(file);  break;
      case 'child':   out.children.push(file); break;
      case 'sibling': out.siblings.push(file); break;
      case 'next':    out.next.push(file);     break;
      case 'prev':    out.prev.push(file);     break;
    }
  }
  return out;
}

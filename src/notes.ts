import type {
 App, TFile
} from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import type { PluginSettings } from './PluginSettings.ts';

import {
 getBCGraph, getFrontmatterLinkTargets
} from './breadcrumbs.ts';
import { isExcluded } from './recents.ts';

/** Markdown files sorted by `getModifiedTime`, excluding the active file and
 * anything matching `settings.continueExcluded`. */
export function getModifiedFiles(app: App, settings: ReadonlyDeep<PluginSettings>): TFile[] {
  const activePath = app.workspace.getActiveFile()?.path;
  return app.vault.getMarkdownFiles()
    .filter((f) => f.path !== activePath && !isExcluded(f, settings.continueExcluded ?? []))
    .sort((a, b) => getModifiedTime(app, settings, b) - getModifiedTime(app, settings, a))
    .slice(0, settings.modifiedListCount ?? 15);
}

/** A note's effective "modified" timestamp — `settings.modifiedDateField`
 * frontmatter if configured and parseable, else the file's own mtime. */
export function getModifiedTime(app: App, settings: ReadonlyDeep<PluginSettings>, file: TFile): number {
  const field = settings.modifiedDateField;
  if (field) {
    const val = app.metadataCache.getFileCache(file)?.frontmatter?.[field] as unknown;
    if (val instanceof Date) { return val.getTime(); }
    if (typeof val === 'number' && val > 1e11) { return val; } // Looks like a ms epoch timestamp
    if (typeof val === 'string') {
      const t = Date.parse(val);
      if (!isNaN(t)) { return t; }
    }
  }
  return file.stat.mtime;
}

/** A note's parent names — tries the Breadcrumbs plugin's graph first (picks
 * up all "up" direction edges regardless of field name), then falls back to
 * reading `settings.breadcrumbField` frontmatter links directly. */
export function getParentNames(app: App, settings: ReadonlyDeep<PluginSettings>, file: TFile): string[] {
  const bcGraph = getBCGraph(app);
  if (bcGraph?.has_node(file.path)) {
    try {
      const edges = bcGraph.get_filtered_outgoing_edges(file.path);
      const names = edges
        .filter((e) => (e.attr?.field ?? '') === 'up' || (e.attr?.dir ?? e.attr?.direction ?? '') === 'up')
        .map((e) => {
          const path = e.target_id.endsWith('.md') ? e.target_id : `${e.target_id}.md`;
          return app.vault.getFileByPath(path)?.basename ?? app.vault.getFileByPath(e.target_id)?.basename ?? e.target_id.split('/').pop() ?? e.target_id;
        });
      if (names.length > 0) { return names; }
    } catch { /* Fall through */ }
  }
  const field = settings.breadcrumbField || 'up';
  const targets = getFrontmatterLinkTargets(app, file, field);
  return Array.from(targets, (path) => app.vault.getFileByPath(path)?.basename ?? path);
}

/** Up to 2 tags for a note (inline `#tags` plus frontmatter `tags:`). */
export function noteTags(file: TFile, app: App): string[] {
  const cache = app.metadataCache.getFileCache(file);
  const inline = (cache?.tags ?? []).map((t) => t.tag);
  const rawTags: unknown = cache?.frontmatter?.['tags'];
  const tagArr: string[] = Array.isArray(rawTags)
    ? (rawTags).filter((t): t is string => typeof t === 'string')
    : typeof rawTags === 'string' ? [rawTags] : [];
  const fm = tagArr.map((t) => `#${t}`);
  return [...new Set([...inline, ...fm])].slice(0, 2);
}

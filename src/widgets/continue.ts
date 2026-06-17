import type {
 DashboardWidgetContext, DashboardWidgetDefinition
} from '../DashboardWidgetApi.ts';

import {
 getModifiedFiles, getModifiedTime, getParentNames, noteTags
} from '../notes.ts';
import { getRecentFiles } from '../recents.ts';
import {
 extractTailPreview, fromNow
} from '../text.ts';

function formatFrontmatterValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(formatFrontmatterValue).filter(Boolean).join(', ');
  }

  switch (typeof value) {
    case 'boolean':
    case 'number':
    case 'string':
      return String(value);
    case 'object':
      return value === null ? '' : (JSON.stringify(value) ?? '');
    default:
      return '';
  }
}

async function render(root: HTMLElement, ctx: DashboardWidgetContext): Promise<void> {
  const touchedFiles = getRecentFiles(ctx.app, ctx.settings.continueExcluded ?? [], ctx.settings.recentListCount ?? 15);
  if (touchedFiles.length === 0) { return; }

  let showModified = false;

  const header = root.createEl('div', { cls: 'qw-dash-segment-header' });
  const tabTouched = header.createEl('span', { cls: 'qw-dash-segment-tab qw-dash-segment-tab--active', text: 'TOUCHED' });
  header.createEl('span', { cls: 'qw-dash-segment-divider', text: '|' });
  const tabModified = header.createEl('span', { cls: 'qw-dash-segment-tab', text: 'MODIFIED' });

  const listEl = root.createEl('div');

  const renderList = async (): Promise<void> => {
    listEl.empty();
    const files = showModified ? getModifiedFiles(ctx.app, ctx.settings) : touchedFiles;
    tabTouched.classList.toggle('qw-dash-segment-tab--active', !showModified);
    tabModified.classList.toggle('qw-dash-segment-tab--active', showModified);

    // Build backlink counts once per render instead of rescanning per row
    const backlinkCounts = new Map<string, number>();
    for (const links of Object.values(ctx.app.metadataCache.resolvedLinks)) {
      for (const target of Object.keys(links)) {
        backlinkCounts.set(target, (backlinkCounts.get(target) ?? 0) + 1);
      }
    }

    for (const file of files) {
      const row = listEl.createEl('div', { cls: 'qw-dash-note-row' });
      const meta = row.createEl('div', { cls: 'qw-dash-note-meta' });

      if (ctx.settings.showBreadcrumbs) {
        const parents = getParentNames(ctx.app, ctx.settings, file);
        if (parents.length > 0) {
          meta.createEl('div', { cls: 'qw-dash-note-parents', text: parents.join(' › ') });
        }
      }

      const backlinkCount = backlinkCounts.get(file.path) ?? 0;

      const titleRow = meta.createEl('div', { cls: 'qw-dash-note-title-row' });
      titleRow.createEl('span', { cls: 'qw-dash-note-title', text: file.basename });
      const titleRight = titleRow.createEl('span', { cls: 'qw-dash-note-title-right' });
      if ((ctx.settings.cardShowBacklinks ?? true) && backlinkCount > 0) {
        titleRight.createEl('span', { cls: 'qw-dash-note-links', text: `← ${backlinkCount}` });
      }
      titleRight.createEl('span', {
        cls: 'qw-dash-note-time',
        text: fromNow(showModified ? getModifiedTime(ctx.app, ctx.settings, file) : file.stat.mtime)
      });

      const showTags = ctx.settings.cardShowTags ?? false;
      const tags = showTags ? noteTags(file, ctx.app) : [];
      if (tags.length > 0) {
        const detail = meta.createEl('div', { cls: 'qw-dash-note-detail' });
        for (const tag of tags) { detail.createEl('span', { cls: 'qw-dash-note-tag', text: tag }); }
      }

      const fmFields = ctx.settings.cardFrontmatterFields ?? [];
      if (fmFields.length > 0) {
        const fm = ctx.app.metadataCache.getFileCache(file)?.frontmatter;
        if (fm) {
          for (const field of fmFields) {
            const val: unknown = fm[field];
            const formatted = formatFrontmatterValue(val);
            if (formatted) {
              meta.createEl('div', { cls: 'qw-dash-note-fm', text: `${field}: ${formatted}` });
            }
          }
        }
      }

      if (ctx.settings.cardShowPreview ?? true) {
        try {
          const preview = extractTailPreview(await ctx.app.vault.cachedRead(file));
          if (preview) { meta.createEl('div', { cls: 'qw-dash-note-preview', text: preview }); }
        } catch { /* Skip */ }
      }

      row.addEventListener('click', () => { ctx.openFile(file); });
    }
  };

  tabTouched.addEventListener('click', () => { showModified = false; void renderList(); });
  tabModified.addEventListener('click', () => { showModified = true; void renderList(); });

  await renderList();
}

export const continueWidget: DashboardWidgetDefinition = {
  id: 'continue',
  label: 'Recently Touched',
  render
};

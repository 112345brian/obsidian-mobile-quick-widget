import type { DashboardWidgetContext, DashboardWidgetDefinition } from '../DashboardWidgetApi.ts';

import { getModifiedFiles, getModifiedTime, getParentNames, noteTags } from '../notes.ts';
import { getRecentFiles } from '../recents.ts';
import { extractTailPreview, fromNow } from '../text.ts';

async function render(root: HTMLElement, ctx: DashboardWidgetContext): Promise<void> {
  const touchedFiles = getRecentFiles(ctx.app, ctx.settings.continueExcluded ?? [], ctx.settings.recentListCount ?? 15);
  if (touchedFiles.length === 0) return;

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

      const titleRow = meta.createEl('div', { cls: 'qw-dash-note-title-row' });
      titleRow.createEl('span', { cls: 'qw-dash-note-title', text: file.basename });
      titleRow.createEl('span', {
        cls: 'qw-dash-note-time',
        text: fromNow(showModified ? getModifiedTime(ctx.app, ctx.settings, file) : file.stat.mtime),
      });

      const tags = noteTags(file, ctx.app);
      const backlinkCount = backlinkCounts.get(file.path) ?? 0;
      const detail = meta.createEl('div', { cls: 'qw-dash-note-detail' });
      if (backlinkCount > 0) detail.createEl('span', { cls: 'qw-dash-note-links', text: `← ${backlinkCount}` });
      for (const tag of tags) detail.createEl('span', { cls: 'qw-dash-note-tag', text: tag });

      try {
        const preview = extractTailPreview(await ctx.app.vault.cachedRead(file));
        if (preview) meta.createEl('div', { cls: 'qw-dash-note-preview', text: preview });
      } catch { /* skip */ }

      row.addEventListener('click', () => ctx.openFile(file));
    }
  };

  tabTouched.addEventListener('click', () => { showModified = false; void renderList(); });
  tabModified.addEventListener('click', () => { showModified = true; void renderList(); });

  await renderList();
}

export const continueWidget: DashboardWidgetDefinition = {
  id: 'continue',
  label: 'Recently Touched',
  render,
};

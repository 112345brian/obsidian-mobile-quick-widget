import type { DashboardWidgetContext, DashboardWidgetDefinition } from '../DashboardWidgetApi.ts';

function render(root: HTMLElement, ctx: DashboardWidgetContext): void {
  const filesWithOpenTasks = ctx.app.vault.getMarkdownFiles().filter((file) =>
    (ctx.app.metadataCache.getFileCache(file)?.listItems ?? []).some((li) => li.task === ' '),
  );
  if (filesWithOpenTasks.length === 0) return;

  root.createEl('div', { cls: 'qw-dash-section-label', text: 'OPEN TASKS' });
  const card = root.createEl('div', { cls: 'qw-dash-task-card' });
  card.createEl('div', { cls: 'qw-dash-task-loading', text: 'Loading…' });

  void (async () => {
    card.empty();
    let count = 0;
    for (const file of filesWithOpenTasks) {
      if (count >= 10) break;
      try {
        const raw = await ctx.app.vault.cachedRead(file);
        const lines = raw.split('\n');
        for (const line of lines) {
          if (count >= 10) break;
          const m = line.match(/^(\s*[-*+]|\s*\d+\.) \[ \] (.*)/);
          if (!m) continue;
          const text = m[2]?.trim() ?? '';
          if (!text) continue;
          const row = card.createEl('div', { cls: 'qw-dash-task-row' });
          row.createEl('div', { cls: 'qw-dash-task-check' });
          row.createEl('div', { cls: 'qw-dash-task-text', text });
          row.createEl('div', { cls: 'qw-dash-task-src', text: file.basename });
          row.addEventListener('click', () => ctx.openFile(file));
          count++;
        }
      } catch { /* skip */ }
    }
    if (count === 0) card.createEl('div', { cls: 'qw-dash-task-loading', text: 'No open tasks' });
  })();
}

export const tasksWidget: DashboardWidgetDefinition = {
  id: 'tasks',
  label: 'Open Tasks',
  render,
};

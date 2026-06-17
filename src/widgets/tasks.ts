import type { TFile } from 'obsidian';

import type { DashboardWidgetContext, DashboardWidgetDefinition } from '../DashboardWidgetApi.ts';

// ── TaskNotes plugin shim ─────────────────────────────────────────────────
// Targets callumalpass/tasknotes (manifest id "tasknotes").
// Each task is stored as a separate markdown file with YAML frontmatter.
// The public API is accessed via plugin.api (TaskNotesRuntimeApiV1).

interface TaskInfo {
  path?: string;    // vault path to the task file (most likely field name)
  file?: string;    // alternative path field name
  id?: string;      // fallback stable identifier (may be the path)
  title?: string;
  status?: string;
  archived?: boolean;
  due?: string;     // ISO date string e.g. "2026-06-18"
  priority?: string;
}

interface TaskNotesEvents {
  on(event: string, handler: () => void): unknown;
  off(ref: unknown): void;
}

interface TaskNotesApi {
  apiVersion: number;
  listTasks(query?: Record<string, unknown>): Promise<TaskInfo[]>;
  events: TaskNotesEvents;
}

interface TaskNotesPlugin {
  api?: TaskNotesApi;
}

const DONE_STATUSES = new Set(['done', 'completed', 'cancelled', 'canceled']);

function getTaskNotesApi(ctx: DashboardWidgetContext): TaskNotesApi | null {
  const api = ctx.getPlugin<TaskNotesPlugin>('tasknotes')?.api;
  if (!api || typeof api.listTasks !== 'function') return null;
  if (!api.events || typeof api.events.on !== 'function') return null;
  return api;
}

function isOpen(task: TaskInfo): boolean {
  if (task.archived) return false;
  return !DONE_STATUSES.has((task.status ?? '').toLowerCase());
}

function formatDue(due: string): string {
  const d = new Date(due);
  if (isNaN(d.getTime())) return due;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  if (diff < 0) return 'overdue';
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function taskFile(task: TaskInfo, ctx: DashboardWidgetContext): TFile | null {
  // Try the most common field names for the vault path.
  const path = task.path ?? task.file ?? task.id ?? '';
  return path ? (ctx.app.vault.getFileByPath(path) ?? null) : null;
}

// ── TaskNotes-powered render ──────────────────────────────────────────────

async function fetchOpenTasks(api: TaskNotesApi): Promise<TaskInfo[]> {
  try {
    const all = await api.listTasks();
    return all.filter(isOpen).slice(0, 10);
  } catch {
    return [];
  }
}

function buildTaskRow(card: HTMLElement, task: TaskInfo, ctx: DashboardWidgetContext): void {
  const row = card.createEl('div', { cls: 'qw-dash-task-row' });
  row.createEl('div', { cls: 'qw-dash-task-check' });
  row.createEl('div', { cls: 'qw-dash-task-text', text: task.title?.trim() || '(untitled)' });
  if (task.due) {
    const label = formatDue(task.due);
    const src = row.createEl('div', { cls: 'qw-dash-task-src', text: label });
    if (label === 'overdue') src.addClass('qw-dash-task-src--overdue');
  }
  row.addEventListener('click', () => {
    const file = taskFile(task, ctx);
    if (file) ctx.openFile(file);
  });
}

// ── Checkbox-scan fallback ────────────────────────────────────────────────

async function renderCheckboxTasks(card: HTMLElement, ctx: DashboardWidgetContext): Promise<void> {
  const filesWithOpenTasks = ctx.app.vault.getMarkdownFiles().filter((file) =>
    (ctx.app.metadataCache.getFileCache(file)?.listItems ?? []).some((li) => li.task === ' '),
  );
  card.empty();
  let count = 0;
  for (const file of filesWithOpenTasks) {
    if (count >= 10) break;
    try {
      const raw = await ctx.app.vault.cachedRead(file);
      for (const line of raw.split('\n')) {
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
    } catch { /* skip unreadable file */ }
  }
  if (count === 0) card.createEl('div', { cls: 'qw-dash-task-loading', text: 'No open tasks' });
}

// ── Widget ────────────────────────────────────────────────────────────────

function render(root: HTMLElement, ctx: DashboardWidgetContext): void {
  const api = getTaskNotesApi(ctx);

  if (api) {
    // TaskNotes is installed — use its API for a richer, reactive task list.
    const section = root.createEl('div');
    section.createEl('div', { cls: 'qw-dash-section-label', text: 'OPEN TASKS' });
    const card = section.createEl('div', { cls: 'qw-dash-task-card' });
    card.createEl('div', { cls: 'qw-dash-task-loading', text: 'Loading…' });

    const draw = async (): Promise<void> => {
      const tasks = await fetchOpenTasks(api);
      card.empty();
      // If no open tasks, remove the whole section so it doesn't take up space.
      if (tasks.length === 0) { section.remove(); return; }
      for (const task of tasks) buildTaskRow(card, task, ctx);
    };

    void draw();

    // Re-draw when tasks change. Events are on api.events (not api directly);
    // names use dot notation per TaskNotes v4 internals.
    const handler = (): void => { void draw(); };
    const refs = [
      api.events.on('task.created', handler),
      api.events.on('task.updated', handler),
      api.events.on('task.deleted', handler),
    ];
    ctx.onCleanup(() => { for (const ref of refs) api.events.off(ref); });

  } else {
    // Fallback: scan markdown checkboxes in the vault.
    const hasAny = ctx.app.vault.getMarkdownFiles().some((file) =>
      (ctx.app.metadataCache.getFileCache(file)?.listItems ?? []).some((li) => li.task === ' '),
    );
    if (!hasAny) return;

    root.createEl('div', { cls: 'qw-dash-section-label', text: 'OPEN TASKS' });
    const card = root.createEl('div', { cls: 'qw-dash-task-card' });
    card.createEl('div', { cls: 'qw-dash-task-loading', text: 'Loading…' });
    void renderCheckboxTasks(card, ctx);
  }
}

export const tasksWidget: DashboardWidgetDefinition = {
  id: 'tasks',
  label: 'Open Tasks',
  render,
};

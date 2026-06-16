import type { App, TFile } from 'obsidian';

// Continue plugin exposes a navigation log richer than Obsidian's own list.
interface ContinuePlugin {
  openedLog: string[];
}

function getContinuePlugin(app: App): ContinuePlugin | null {
  const plugin = (app as unknown as { plugins: { plugins: Record<string, unknown> } })
    .plugins?.plugins?.['obsidian-continue'];
  if (!plugin || !Array.isArray((plugin as ContinuePlugin).openedLog)) return null;
  return plugin as ContinuePlugin;
}

export function isExcluded(file: TFile, excluded: readonly string[]): boolean {
  return excluded.some((rule) =>
    rule.endsWith('/') ? file.path.startsWith(rule) : file.path === rule,
  );
}

/**
 * Recently-opened notes, preferring the Continue plugin's navigation log and
 * falling back to Obsidian's own last-open list. Excludes the active note and
 * any user-excluded paths. Shared by the dashboard and the radial menu so both
 * surfaces agree on what "recent" means.
 */
export function getRecentFiles(app: App, excluded: readonly string[], max: number): TFile[] {
  const activePath = app.workspace.getActiveFile()?.path;
  const continuePlug = getContinuePlugin(app);
  const paths = continuePlug && continuePlug.openedLog.length > 0
    ? continuePlug.openedLog
    : app.workspace.getLastOpenFiles();
  return paths
    .map((p) => app.vault.getFileByPath(p))
    .filter((f): f is TFile => f !== null && f.path !== activePath && !isExcluded(f, excluded))
    .slice(0, max);
}

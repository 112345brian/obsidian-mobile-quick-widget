import type { DashboardWidgetContext, DashboardWidgetDefinition } from '../DashboardWidgetApi.ts';

// ── Obsidian Git plugin shim ──────────────────────────────────────────────
// Targets Vinzent03/obsidian-git (manifest id "obsidian-git").
// `plugin.cachedStatus` / the `obsidian-git:status-changed` workspace event
// are the plugin's own public status-tracking surface (it triggers that
// event itself whenever `updateCachedStatus()` runs), so subscribing to it
// here mirrors how its own status bar and source control view stay in sync
// — no separate polling needed. `gitManager.branchInfo()` and
// `app.commands.executeCommandById('obsidian-git:push')` (the plugin's own
// "Commit-and-sync" command) are both public surfaces already used by its
// own UI (branch status bar, command palette).

interface FileStatusResult {
  path: string;
}

interface GitStatus {
  changed: FileStatusResult[];
  staged: FileStatusResult[];
  conflicted: string[];
}

interface GitManager {
  branchInfo(): Promise<{ current?: string }>;
}

interface ObsidianGitPlugin {
  gitReady: boolean;
  cachedStatus?: GitStatus;
  gitManager: GitManager;
  updateCachedStatus(): Promise<GitStatus>;
}

function getGitPlugin(ctx: DashboardWidgetContext): ObsidianGitPlugin | null {
  const plugin = ctx.getPlugin<ObsidianGitPlugin>('obsidian-git');
  if (!plugin || typeof plugin.updateCachedStatus !== 'function' || !plugin.gitManager) return null;
  return plugin;
}

function render(root: HTMLElement, ctx: DashboardWidgetContext): void {
  const git = getGitPlugin(ctx);
  if (!git || !git.gitReady) return; // Obsidian Git not installed/enabled/ready — show nothing

  root.createEl('div', { cls: 'qw-dash-section-label', text: 'GIT' });
  const card = root.createEl('div', { cls: 'qw-dash-git-card' });
  const branchEl = card.createEl('div', { cls: 'qw-dash-git-branch' });
  const statusEl = card.createEl('div', { cls: 'qw-dash-git-status' });

  const applyStatus = (status: GitStatus | undefined): void => {
    if (!status) return;
    const changedCount = status.changed.length + status.staged.length;
    card.classList.toggle('qw-dash-git-card--conflict', status.conflicted.length > 0);
    card.classList.toggle('qw-dash-git-card--dirty', changedCount > 0 && status.conflicted.length === 0);
    if (status.conflicted.length > 0) {
      statusEl.setText(`${status.conflicted.length} conflict${status.conflicted.length === 1 ? '' : 's'}`);
    } else if (changedCount > 0) {
      statusEl.setText(`${changedCount} change${changedCount === 1 ? '' : 's'} — tap to sync`);
    } else {
      statusEl.setText('Up to date');
    }
  };

  const refreshBranch = (): void => {
    void git.gitManager.branchInfo().then((info) => {
      branchEl.setText(info.current ?? '(detached)');
    });
  };

  applyStatus(git.cachedStatus);
  refreshBranch();
  if (!git.cachedStatus) void git.updateCachedStatus().then(applyStatus);

  // The plugin re-triggers this event itself every time its own status bar
  // or source control view refreshes, so this stays current without ReadyBoard
  // running its own polling loop.
  const workspace = ctx.app.workspace as unknown as {
    on(name: string, cb: (status: GitStatus) => void): { e: unknown };
    offref(ref: { e: unknown }): void;
  };
  const ref = workspace.on('obsidian-git:status-changed', applyStatus);
  ctx.onCleanup(() => { workspace.offref(ref); });

  card.addEventListener('click', () => {
    ctx.vibrate(8);
    ctx.app.commands.executeCommandById('obsidian-git:push');
  });
}

export const gitWidget: DashboardWidgetDefinition = {
  id: 'git',
  label: 'Git Status',
  render,
};

import type {
 ViewStateResult, WorkspaceLeaf
} from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { ItemView } from 'obsidian';

import type { DashboardWidgetRegistry } from '../DashboardWidgetApi.ts';
import type {
 DashboardViewState, PluginSettings
} from '../PluginSettings.ts';

import { DashboardContent } from '../DashboardContent.ts';
import { normalizeDashboardViewState } from '../PluginSettings.ts';

export const VIEW_TYPE_DASHBOARD = 'readyboard-dashboard';

/**
 * Sidebar host for the dashboard. Stays registered/warm between opens (the
 * leaf is collapsed, not destroyed, on "close") so widget state — which
 * TOUCHED/MODIFIED tab was active, which radial mode was last cycled to —
 * survives across reveals instead of rebuilding from zero every time, unlike
 * DashboardModal which is thrown away on every close.
 */
export class DashboardView extends ItemView {
  private readonly content: DashboardContent;
  private state: DashboardViewState = {};

  public constructor(
    leaf: WorkspaceLeaf,
    settings: (() => ReadonlyDeep<PluginSettings>) | ReadonlyDeep<PluginSettings>,
    editSettings: (mutate: (settings: PluginSettings) => Promise<void> | void) => Promise<void>,
    widgetRegistry: DashboardWidgetRegistry
  ) {
    super(leaf);
    this.content = new DashboardContent(this.app, settings, editSettings, () => { this.collapse(); }, widgetRegistry, true);
  }

  /** Render() only runs once, in onOpen — collapsing/revealing the sidebar
   *  doesn't re-run it (that's the point: widget state survives). So
   *  keyboard focus, which render() normally sets up, has to be re-applied
   *  by whoever reveals this leaf. See Plugin.revealDashboardSidebar. */
  public focusHost(): void {
    this.content.focusHost();
  }

  public override getDisplayText(): string {
    return 'ReadyBoard';
  }

  public override getIcon(): string {
    return 'layout-dashboard';
  }

  public override getState(): Record<string, unknown> {
    return { ...this.state };
  }

  public override getViewType(): string {
    return VIEW_TYPE_DASHBOARD;
  }

  public override async onClose(): Promise<void> {
    this.content.dispose();
    this.contentEl.empty();
  }

  public override async onOpen(): Promise<void> {
    this.containerEl.addClass('qw-dash-host');
    this.content.setViewState(this.state);
    await this.content.render(this.contentEl);
  }

  public async refresh(): Promise<void> {
    await this.content.refresh();
  }

  public override async setState(state: unknown, result: ViewStateResult): Promise<void> {
    await super.setState(state, result);
    this.state = normalizeDashboardViewState(state);
    this.content.setViewState(this.state);
    await this.content.refresh();
  }

  /** Hides the sidebar without detaching the leaf, so the view (and its
   * DashboardContent instance) stays alive for next time. */
  private collapse(): void {
    const root = this.leaf.getRoot();
    const { leftSplit, rightSplit } = this.app.workspace;
    if (root === leftSplit) { leftSplit.collapse(); } else if (root === rightSplit) { rightSplit.collapse(); }
  }
}

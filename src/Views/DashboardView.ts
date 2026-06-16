import type { WorkspaceLeaf } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { ItemView } from 'obsidian';

import type { PluginSettings } from '../PluginSettings.ts';
import type { DashboardWidgetRegistry } from '../DashboardWidgetApi.ts';

import { DashboardContent } from '../DashboardContent.ts';

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

  public constructor(
    leaf: WorkspaceLeaf,
    settings: ReadonlyDeep<PluginSettings>,
    editSettings: (mutate: (settings: PluginSettings) => void | Promise<void>) => Promise<void>,
    widgetRegistry: DashboardWidgetRegistry,
  ) {
    super(leaf);
    this.content = new DashboardContent(this.app, settings, editSettings, () => this.collapse(), widgetRegistry);
  }

  public override getViewType(): string {
    return VIEW_TYPE_DASHBOARD;
  }

  public override getDisplayText(): string {
    return 'ReadyBoard';
  }

  public override getIcon(): string {
    return 'layout-dashboard';
  }

  public override async onOpen(): Promise<void> {
    this.containerEl.addClass('qw-dash-host');
    await this.content.render(this.contentEl);
  }

  public override async onClose(): Promise<void> {
    this.content.dispose();
    this.contentEl.empty();
  }

  /** render() only runs once, in onOpen — collapsing/revealing the sidebar
   *  doesn't re-run it (that's the point: widget state survives). So
   *  keyboard focus, which render() normally sets up, has to be re-applied
   *  by whoever reveals this leaf. See Plugin.revealDashboardSidebar. */
  public focusHost(): void {
    this.content.focusHost();
  }

  /** Hides the sidebar without detaching the leaf, so the view (and its
   * DashboardContent instance) stays alive for next time. */
  private collapse(): void {
    const root = this.leaf.getRoot();
    const { leftSplit, rightSplit } = this.app.workspace;
    if (root === leftSplit) leftSplit.collapse();
    else if (root === rightSplit) rightSplit.collapse();
  }
}

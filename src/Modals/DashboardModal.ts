import type { App } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Modal } from 'obsidian';

import type { PluginSettings } from '../PluginSettings.ts';
import type { DashboardWidgetRegistry } from '../DashboardWidgetApi.ts';

import { DashboardContent } from '../DashboardContent.ts';

/** Thin Modal host — all actual rendering lives in DashboardContent so the
 * sidebar DashboardView can share it without duplicating ~1000 lines. */
export class DashboardModal extends Modal {
  private readonly content: DashboardContent;

  public constructor(
    app: App,
    settings: ReadonlyDeep<PluginSettings>,
    editSettings: (mutate: (settings: PluginSettings) => void | Promise<void>) => Promise<void>,
    widgetRegistry: DashboardWidgetRegistry,
  ) {
    super(app);
    this.content = new DashboardContent(app, settings, editSettings, () => this.close(), widgetRegistry);
  }

  public override async onOpen(): Promise<void> {
    this.modalEl.addClass('qw-dash-modal');
    this.modalEl.addClass('qw-dash-host');
    this.containerEl.addClass('qw-dash-container');
    await this.content.render(this.contentEl);
  }

  public override onClose(): void {
    this.content.dispose();
    this.contentEl.empty();
  }
}

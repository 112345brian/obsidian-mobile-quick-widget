import type { App } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Notice } from 'obsidian';

import type { PluginSettings, QuickAction } from './PluginSettings.ts';

import { AppendPromptModal } from './Modals/AppendPromptModal.ts';
import { createNote } from './createNote.ts';

/**
 * Runs a QuickAction. Shared by the dashboard's More Actions / pulse cards and
 * the radial menu's configurable command slots. `close` dismisses the calling
 * surface before the action takes effect (where appropriate).
 */
export async function executeQuickAction(
  app: App,
  settings: ReadonlyDeep<PluginSettings>,
  action: ReadonlyDeep<QuickAction>,
  close: () => void,
): Promise<void> {
  switch (action.action) {
    case 'new-note': {
      close();
      const file = await createNote(app, settings);
      await app.workspace.getMostRecentLeaf()?.openFile(file);
      break;
    }
    case 'homepage': {
      close();
      const target = settings.homePath;
      if (target) {
        const file = app.vault.getFileByPath(target);
        if (file) { await app.workspace.getMostRecentLeaf()?.openFile(file); return; }
      }
      try {
        if (app.commands.findCommand('homepage:open')) {
          app.commands.executeCommandById('homepage:open');
        } else {
          new Notice('No home note configured.');
        }
      } catch { new Notice('No home note configured.'); }
      break;
    }
    case 'command': {
      close();
      if (action.commandId) app.commands.executeCommandById(action.commandId);
      break;
    }
    case 'append-to-note': {
      const notePath = action.notePath;
      if (!notePath) { new Notice('No note path configured for this action.'); return; }
      close();
      const template = action.appendTemplate || '{{text}}';
      new AppendPromptModal(app, action.label, async (text) => {
        const file = app.vault.getFileByPath(notePath);
        if (!file) { new Notice(`Note not found: ${notePath}`); return; }
        const line = template.replace('{{text}}', text);
        const content = await app.vault.read(file);
        const sep = content.endsWith('\n') ? '' : '\n';
        await app.vault.modify(file, content + sep + line + '\n');
        new Notice(`Added to ${file.basename}`);
      }).open();
      break;
    }
  }
}

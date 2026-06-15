import type { App, TFile } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import type { PluginSettings } from './PluginSettings.ts';

function isoDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function zettelkastenId(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0'),
    String(d.getSeconds()).padStart(2, '0'),
  ].join('');
}

function getTemplater(app: App): { overwrite_file_commands?: (f: TFile, open: boolean) => Promise<void> } | null {
  const plugin = (app as unknown as { plugins: { plugins: Record<string, unknown> } })
    .plugins?.plugins?.['templater-obsidian'];
  if (!plugin) return null;
  return ((plugin as { templater?: unknown }).templater as { overwrite_file_commands?: (f: TFile, open: boolean) => Promise<void> } | undefined) ?? null;
}

export async function createNote(app: App, settings: ReadonlyDeep<PluginSettings>): Promise<TFile> {
  const folder = settings.newNoteFolder;

  const templatePath = settings.newNoteTemplate;
  const templateFile = templatePath ? app.vault.getFileByPath(templatePath) : null;
  const content = templateFile ? await app.vault.read(templateFile) : '';

  const useZettel = settings.newNoteFilenameFormat === 'zettelkasten';
  const baseName = useZettel ? zettelkastenId() : `Untitled ${isoDate()}`;

  let finalPath = folder ? `${folder}/${baseName}.md` : `${baseName}.md`;
  let n = 1;
  while (app.vault.getFileByPath(finalPath)) {
    const alt = useZettel ? `${baseName}-${n}` : `${baseName} ${n}`;
    finalPath = folder ? `${folder}/${alt}.md` : `${alt}.md`;
    n++;
  }

  const file = await app.vault.create(finalPath, content);

  if (templateFile) {
    const templater = getTemplater(app);
    await templater?.overwrite_file_commands?.(file, false);
  }

  return file;
}

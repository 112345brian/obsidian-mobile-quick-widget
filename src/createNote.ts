import type { App, TFile } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import type { PluginSettings } from './PluginSettings.ts';

function pad(n: number, len = 2): string { return String(n).padStart(len, '0'); }

function applyFormatTokens(fmt: string, d: Date): string {
  return fmt
    .replace(/YYYY/g, String(d.getFullYear()))
    .replace(/YY/g,   String(d.getFullYear()).slice(-2))
    .replace(/MM/g,   pad(d.getMonth() + 1))
    .replace(/DD/g,   pad(d.getDate()))
    .replace(/HH/g,   pad(d.getHours()))
    .replace(/mm/g,   pad(d.getMinutes()))
    .replace(/ss/g,   pad(d.getSeconds()));
}

function isoDate(): string {
  return applyFormatTokens('YYYY-MM-DD', new Date());
}

function zettelkastenId(): string {
  return applyFormatTokens('YYYYMMDDHHmmss', new Date());
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

  const fmt = settings.newNoteFilenameFormat;
  const baseName = fmt === 'zettelkasten'
    ? zettelkastenId()
    : fmt === 'custom' && settings.newNoteFilenameCustom
      ? applyFormatTokens(settings.newNoteFilenameCustom, new Date())
      : `Untitled ${isoDate()}`;

  let finalPath = folder ? `${folder}/${baseName}.md` : `${baseName}.md`;
  let n = 1;
  while (app.vault.getFileByPath(finalPath)) {
    const alt = fmt === 'untitled' ? `${baseName} ${n}` : `${baseName}-${n}`;
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

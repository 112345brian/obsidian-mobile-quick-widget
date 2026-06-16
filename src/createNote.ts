import type { App, TFile } from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Notice } from 'obsidian';

import type { PluginSettings } from './PluginSettings.ts';

import { getExternalPlugin } from './externalPlugin.ts';

function pad(n: number, len = 2): string { return String(n).padStart(len, '0'); }

// Strips characters that are illegal in filenames on at least one major OS
// (Windows is the strictest). Custom filename formats are free-text, so a
// token-substituted result could otherwise contain these by accident.
function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
}

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
  const plugin = getExternalPlugin<{ templater?: { overwrite_file_commands?: (f: TFile, open: boolean) => Promise<void> } }>(app, 'templater-obsidian');
  return plugin?.templater ?? null;
}

export async function createNote(app: App, settings: ReadonlyDeep<PluginSettings>): Promise<TFile> {
  const folder = settings.newNoteFolder;

  const templatePath = settings.newNoteTemplate;
  const templateFile = templatePath ? app.vault.getFileByPath(templatePath) : null;
  const content = templateFile ? await app.vault.read(templateFile) : '';

  const fmt = settings.newNoteFilenameFormat;
  const baseName = sanitizeFilename(fmt === 'zettelkasten'
    ? zettelkastenId()
    : fmt === 'custom' && settings.newNoteFilenameCustom
      ? applyFormatTokens(settings.newNoteFilenameCustom, new Date())
      : `Untitled ${isoDate()}`);

  let finalPath = folder ? `${folder}/${baseName}.md` : `${baseName}.md`;
  let n = 1;
  while (app.vault.getFileByPath(finalPath)) {
    const alt = fmt === 'untitled' ? `${baseName} ${n}` : `${baseName}-${n}`;
    finalPath = folder ? `${folder}/${alt}.md` : `${alt}.md`;
    n++;
  }

  let file: TFile;
  try {
    file = await app.vault.create(finalPath, content);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Only retry if this genuinely looks like a path collision (e.g. another
    // note was created at the same path between our existence check above
    // and this call, such as a rapid double-tap on two different action
    // triggers). Any other failure (invalid path, disk/permissions, vault
    // I/O error) would just fail identically at a different path, so retry
    // would only mask the real cause.
    if (!/already exists/i.test(message)) {
      new Notice(`Couldn't create note: ${message}`);
      throw err;
    }
    try {
      const retryPath = finalPath.replace(/\.md$/, `-${Date.now()}.md`);
      file = await app.vault.create(retryPath, content);
    } catch {
      new Notice(`Couldn't create note: ${message}`);
      throw err;
    }
  }

  if (templateFile) {
    const templater = getTemplater(app);
    await templater?.overwrite_file_commands?.(file, false);
  }

  return file;
}

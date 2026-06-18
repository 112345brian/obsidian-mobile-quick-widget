import type {
 App, TFile
} from 'obsidian';
import type { ReadonlyDeep } from 'type-fest';

import { Notice } from 'obsidian';

import type { PluginSettings } from './PluginSettings.ts';

import { getExternalPlugin } from './externalPlugin.ts';

interface TemplaterPluginShape {
  settings?: {
    templates_folder?: string;
  };
  templater?: TemplaterRuntime;
}

interface TemplaterRuntime {
  create_new_note_from_template?: (
    template: string | TFile,
    folder?: null | string,
    filename?: string,
    open?: boolean
  ) => Promise<TFile | undefined>;
  overwrite_file_commands?: (file: TFile, open: boolean) => Promise<void>;
  write_template_to_file?: (template: TFile, file: TFile) => Promise<void>;
}

interface UniqueNoteOptions {
  folder?: string;
  format?: string;
  template?: string;
}

export async function createNote(app: App, settings: ReadonlyDeep<PluginSettings>): Promise<TFile> {
  const options = await resolveNewNoteOptions(app, settings);
  const folder = normalizeFolder(options.folder);
  const templaterPlugin = getTemplaterPlugin(app);

  const templatePath = options.template;
  const templateFile = templatePath ? getTemplateFile(app, templatePath, templaterPlugin?.settings?.templates_folder) : null;
  if (templatePath && !templateFile) {
    new Notice(`Template not found: ${templatePath}`);
    throw new Error(`Template not found: ${templatePath}`);
  }

  const fmt = options.filenameFormat;
  const baseName = sanitizeFilename(fmt === 'zettelkasten'
    ? zettelkastenId()
    : fmt === 'custom' && options.filenameCustom
      ? applyFormatTokens(options.filenameCustom, new Date())
      : `Untitled ${isoDate()}`);

  if (templateFile) {
    const templater = templaterPlugin?.templater ?? null;
    if (templater?.create_new_note_from_template) {
      const file = await createNoteFromTemplater(templater, templateFile, folder, baseName);
      await expandCoreTemplateTokens(app, file);
      return file;
    }

    const file = await createBlankNote(app, folder, baseName, fmt);
    if (templater?.write_template_to_file) {
      try {
        await templater.write_template_to_file(templateFile, file);
      } catch (err) {
        console.error('ReadyBoard: Templater failed to write template to note', err);
        new Notice('Templater failed to process the new note. Check the console for details.');
        throw err;
      }
      await expandCoreTemplateTokens(app, file);
      return file;
    }

    const content = await app.vault.read(templateFile);
    await app.vault.modify(file, content);
    await runTemplaterOnExistingNote(templater, file);
    await expandCoreTemplateTokens(app, file);
    return file;
  }

  return createBlankNote(app, folder, baseName, fmt);
}

function applyFormatTokens(fmt: string, d: Date): string {
  return fmt
    .replace(/YYYY/g, String(d.getFullYear()))
    .replace(/YY/g, String(d.getFullYear()).slice(-2))
    .replace(/MM/g, pad(d.getMonth() + 1))
    .replace(/DD/g, pad(d.getDate()))
    .replace(/HH/g, pad(d.getHours()))
    .replace(/mm/g, pad(d.getMinutes()))
    .replace(/ss/g, pad(d.getSeconds()));
}

async function createBlankNote(
  app: App,
  folder: string,
  baseName: string,
  fmt: PluginSettings['newNoteFilenameFormat']
): Promise<TFile> {
  let finalPath = folder ? `${folder}/${baseName}.md` : `${baseName}.md`;
  let n = 1;
  while (app.vault.getFileByPath(finalPath)) {
    const alt = fmt === 'untitled' ? `${baseName} ${n}` : `${baseName}-${n}`;
    finalPath = folder ? `${folder}/${alt}.md` : `${alt}.md`;
    n++;
  }

  let file: TFile;
  try {
    file = await app.vault.create(finalPath, '');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Only retry if this genuinely looks like a path collision (e.g. another
    // Note was created at the same path between our existence check above
    // And this call, such as a rapid double-tap on two different action
    // Triggers). Any other failure (invalid path, disk/permissions, vault
    // I/O error) would just fail identically at a different path, so retry
    // Would only mask the real cause.
    if (!/already exists/i.test(message)) {
      new Notice(`Couldn't create note: ${message}`);
      throw err;
    }
    try {
      const retryPath = finalPath.replace(/\.md$/, `-${Date.now()}.md`);
      file = await app.vault.create(retryPath, '');
    } catch {
      new Notice(`Couldn't create note: ${message}`);
      throw err;
    }
  }

  return file;
}

async function createNoteFromTemplater(
  templater: TemplaterRuntime,
  templateFile: TFile,
  folder: string,
  baseName: string
): Promise<TFile> {
  try {
    const file = await templater.create_new_note_from_template?.(templateFile, folder || undefined, baseName, false);
    if (file) { return file; }
    throw new Error('Templater did not return the created note.');
  } catch (err) {
    console.error('ReadyBoard: Templater failed to create note from template', err);
    new Notice('Templater failed to create the new note. Check the console for details.');
    throw err;
  }
}

async function expandCoreTemplateTokens(app: App, file: TFile): Promise<void> {
  const content = await app.vault.read(file);
  const expanded = replaceCoreTemplateTokens(content, file, new Date());
  if (expanded !== content) { await app.vault.modify(file, expanded); }
}

function getTemplateFile(app: App, path: string, templaterFolder?: string): null | TFile {
  const trimmed = path.trim();
  const paths = [
    trimmed,
    !trimmed.endsWith('.md') ? `${trimmed}.md` : '',
    templaterFolder ? `${normalizeFolder(templaterFolder)}/${trimmed}` : '',
    templaterFolder && !trimmed.endsWith('.md') ? `${normalizeFolder(templaterFolder)}/${trimmed}.md` : ''
  ].filter(Boolean);

  for (const candidate of paths) {
    const file = app.vault.getFileByPath(candidate);
    if (file) { return file; }
  }

  return app.metadataCache.getFirstLinkpathDest(trimmed, '');
}

function getTemplaterPlugin(app: App): null | TemplaterPluginShape {
  return getExternalPlugin<TemplaterPluginShape>(app, 'templater-obsidian') ?? null;
}

function isoDate(): string {
  return applyFormatTokens('YYYY-MM-DD', new Date());
}

function normalizeFolder(folder: string): string {
  return folder.trim().replace(/\/+$/u, '');
}

function pad(n: number, len = 2): string { return String(n).padStart(len, '0'); }

async function readUniqueNoteOptions(app: App): Promise<null | UniqueNoteOptions> {
  try {
    const raw = await app.vault.adapter.read(`${app.vault.configDir}/zk-prefixer.json`);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') { return null; }
    const record = parsed as Record<string, unknown>;
    const options: UniqueNoteOptions = {};
    if (typeof record['folder'] === 'string') { options.folder = record['folder']; }
    if (typeof record['format'] === 'string') { options.format = record['format']; }
    if (typeof record['template'] === 'string') { options.template = record['template']; }
    return options;
  } catch {
    return null;
  }
}

function replaceCoreTemplateTokens(content: string, file: TFile, now: Date): string {
  return content
    .replace(/\{\{title\}\}/giu, file.basename)
    .replace(/\{\{(date|time)(?::([^}]+))?\}\}/giu, (_match: string, ...args: unknown[]) => {
      const kind = typeof args[0] === 'string' ? args[0] : 'date';
      const format = typeof args[1] === 'string' && args[1].trim()
        ? args[1].trim()
        : kind.toLowerCase() === 'time' ? 'HH:mm' : 'YYYY-MM-DD';
      return applyFormatTokens(format, now);
    });
}

async function resolveNewNoteOptions(
  app: App,
  settings: ReadonlyDeep<PluginSettings>
): Promise<{
  filenameCustom: string;
  filenameFormat: PluginSettings['newNoteFilenameFormat'];
  folder: string;
  template: string;
}> {
  const uniqueNote = await readUniqueNoteOptions(app);
  let filenameFormat = settings.newNoteFilenameFormat;
  let filenameCustom = settings.newNoteFilenameCustom;

  if (uniqueNote?.format && (
    (filenameFormat === 'custom' && !filenameCustom)
    || (filenameFormat === 'untitled' && !settings.newNoteFolder && !settings.newNoteTemplate)
  )) {
    filenameFormat = 'custom';
    filenameCustom = uniqueNote.format;
  }

  return {
    filenameCustom,
    filenameFormat,
    folder: settings.newNoteFolder || uniqueNote?.folder || '',
    template: settings.newNoteTemplate || uniqueNote?.template || ''
  };
}

async function runTemplaterOnExistingNote(templater: null | TemplaterRuntime, file: TFile): Promise<void> {
  if (!templater?.overwrite_file_commands) { return; }
  try {
    await templater.overwrite_file_commands(file, false);
  } catch (err) {
    console.error('ReadyBoard: Templater failed to process note content', err);
    new Notice('Templater failed to process the new note. Check the console for details.');
    throw err;
  }
}

// Strips characters that are illegal in filenames on at least one major OS
// (Windows is the strictest). Custom filename formats are free-text, so a
// Token-substituted result could otherwise contain these by accident.
function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
}

function zettelkastenId(): string {
  return applyFormatTokens('YYYYMMDDHHmmss', new Date());
}

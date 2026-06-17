import { AbstractInputSuggest, App, TAbstractFile, TFile, TFolder } from 'obsidian';

function allFolders(app: App): TFolder[] {
  const folders: TFolder[] = [];
  app.vault.getAllLoadedFiles().forEach((f: TAbstractFile) => {
    if (f instanceof TFolder && f.path !== '/') folders.push(f);
  });
  return folders;
}

/** Suggests vault folder paths as you type. */
export class FolderSuggest extends AbstractInputSuggest<TFolder> {
  private el: HTMLInputElement;

  constructor(app: App, inputEl: HTMLInputElement) {
    super(app, inputEl);
    this.el = inputEl;
  }

  override getSuggestions(query: string): TFolder[] {
    const lower = query.toLowerCase();
    return allFolders(this.app)
      .filter((f) => !lower || f.path.toLowerCase().includes(lower))
      .sort((a, b) => a.path.localeCompare(b.path))
      .slice(0, 20);
  }

  override renderSuggestion(folder: TFolder, el: HTMLElement): void {
    el.setText(folder.path);
  }

  override selectSuggestion(folder: TFolder, _evt: MouseEvent | KeyboardEvent): void {
    this.setValue(folder.path);
    this.el.dispatchEvent(new Event('input'));
    this.close();
  }
}

/** Suggests vault markdown file paths as you type. */
export class FileSuggest extends AbstractInputSuggest<TFile> {
  private el: HTMLInputElement;

  constructor(app: App, inputEl: HTMLInputElement) {
    super(app, inputEl);
    this.el = inputEl;
  }

  override getSuggestions(query: string): TFile[] {
    const lower = query.toLowerCase();
    return this.app.vault.getMarkdownFiles()
      .filter((f) => !lower || f.path.toLowerCase().includes(lower))
      .sort((a, b) => a.path.localeCompare(b.path))
      .slice(0, 20);
  }

  override renderSuggestion(file: TFile, el: HTMLElement): void {
    el.setText(file.path);
  }

  override selectSuggestion(file: TFile, _evt: MouseEvent | KeyboardEvent): void {
    this.setValue(file.path);
    this.el.dispatchEvent(new Event('input'));
    this.close();
  }
}

/**
 * Renders a chip-list input for a string[] setting (e.g. excluded paths).
 */
export function renderChipList(
  container: HTMLElement,
  app: App,
  getValues: () => string[],
  setValues: (v: string[]) => void,
  placeholder = 'Add folder…',
  suggestFolders = true,
): void {
  const chipArea = container.createDiv('qw-chip-list');

  function redrawChips(): void {
    chipArea.empty();
    for (const val of getValues()) {
      const chip = chipArea.createEl('span', { cls: 'qw-chip', text: val });
      const x = chip.createEl('button', { cls: 'qw-chip-remove', text: '×', attr: { 'aria-label': 'Remove' } });
      x.onclick = (e) => {
        e.stopPropagation();
        setValues(getValues().filter((v) => v !== val));
        redrawChips();
      };
    }
  }

  redrawChips();

  const inputRow = container.createDiv('qw-chip-input-row');
  const input = inputRow.createEl('input', {
    cls: 'qw-chip-input',
    attr: { type: 'text', placeholder },
  }) as HTMLInputElement;
  const addBtn = inputRow.createEl('button', { text: 'Add', cls: 'qw-chip-add-btn' });

  const suggest = suggestFolders ? new FolderSuggest(app, input) : new FileSuggest(app, input);

  // When the user picks a suggestion, it fills the input — treat that as an add.
  input.addEventListener('input', () => {
    // Only auto-add when the value exactly matches a vault path (i.e. was set
    // by selectSuggestion), not while the user is still typing.
    const val = input.value.trim();
    const isExactFolder = suggestFolders
      ? allFolders(app).some((f) => f.path === val)
      : app.vault.getMarkdownFiles().some((f) => f.path === val);
    if (isExactFolder) {
      if (val && !getValues().includes(val)) {
        setValues([...getValues(), val]);
        redrawChips();
      }
      input.value = '';
    }
  });

  function addValue(): void {
    const val = input.value.trim();
    if (!val) return;
    if (!getValues().includes(val)) {
      setValues([...getValues(), val]);
      redrawChips();
    }
    input.value = '';
    suggest.close();
  }

  addBtn.onclick = addValue;
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addValue(); } });
}

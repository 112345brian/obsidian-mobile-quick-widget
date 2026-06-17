import { AbstractInputSuggest, App, TFile, TFolder } from 'obsidian';

/** Suggests vault folder paths as you type. */
export class FolderSuggest extends AbstractInputSuggest<TFolder> {
  constructor(app: App, inputEl: HTMLInputElement) {
    super(app, inputEl);
  }

  override getSuggestions(query: string): TFolder[] {
    const lower = query.toLowerCase();
    return this.app.vault.getAllFolders(true)
      .filter((f) => f.path !== '/' && f.path.toLowerCase().includes(lower))
      .sort((a, b) => a.path.localeCompare(b.path))
      .slice(0, 20);
  }

  override renderSuggestion(folder: TFolder, el: HTMLElement): void {
    el.setText(folder.path);
  }

  override selectSuggestion(folder: TFolder): void {
    this.setValue(folder.path);
    this.close();
  }
}

/** Suggests vault file paths (markdown only) as you type. */
export class FileSuggest extends AbstractInputSuggest<TFile> {
  constructor(app: App, inputEl: HTMLInputElement) {
    super(app, inputEl);
  }

  override getSuggestions(query: string): TFile[] {
    const lower = query.toLowerCase();
    return this.app.vault.getMarkdownFiles()
      .filter((f) => f.path.toLowerCase().includes(lower))
      .sort((a, b) => a.path.localeCompare(b.path))
      .slice(0, 20);
  }

  override renderSuggestion(file: TFile, el: HTMLElement): void {
    el.setText(file.path);
  }

  override selectSuggestion(file: TFile): void {
    this.setValue(file.path);
    this.close();
  }
}

/**
 * Renders a chip-list input for a string[] setting (e.g. excluded paths).
 * Each existing value shows as a removable chip. A text input with folder
 * suggestions lets the user add new entries without typing them manually.
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

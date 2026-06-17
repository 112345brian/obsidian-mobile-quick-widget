import {
 AbstractInputSuggest, App, TAbstractFile, TFile, TFolder
} from 'obsidian';

/** Suggests vault markdown file paths as you type. */
export class FileSuggest extends AbstractInputSuggest<TFile> {
  /** Set to true in selectSuggestion so the input listener can distinguish
   *  a picker selection from manual typing without re-scanning the vault. */
  justSelected = false;
  private readonly el: HTMLInputElement;

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

  override selectSuggestion(file: TFile, _evt: KeyboardEvent | MouseEvent): void {
    this.justSelected = true;
    this.setValue(file.path);
    this.el.dispatchEvent(new Event('input'));
    this.close();
  }
}

/** Suggests vault folder paths as you type. */
export class FolderSuggest extends AbstractInputSuggest<TFolder> {
  /** Set to true in selectSuggestion so the input listener can distinguish
   *  a picker selection from manual typing without re-scanning the vault. */
  justSelected = false;
  private readonly el: HTMLInputElement;

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

  override selectSuggestion(folder: TFolder, _evt: KeyboardEvent | MouseEvent): void {
    this.justSelected = true;
    this.setValue(folder.path);
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
  suggestFolders = true
): void {
  const chipArea = container.createDiv('qw-chip-list');

  function redrawChips(): void {
    chipArea.empty();
    for (const val of getValues()) {
      const chip = chipArea.createEl('span', { cls: 'qw-chip', text: val });
      const x = chip.createEl('button', { attr: { 'aria-label': 'Remove' }, cls: 'qw-chip-remove', text: '×' });
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
    attr: { placeholder, type: 'text' },
    cls: 'qw-chip-input'
  });
  const addBtn = inputRow.createEl('button', { cls: 'qw-chip-add-btn', text: 'Add' });

  const suggest = suggestFolders ? new FolderSuggest(app, input) : new FileSuggest(app, input);

  // When the user picks a suggestion, selectSuggestion sets justSelected=true
  // Then dispatches 'input'. We consume the flag here to auto-add the chip
  // Without re-scanning the vault (which would cause false positives for
  // Manually typed paths that happen to match a vault entry).
  input.addEventListener('input', () => {
    if (!suggest.justSelected) { return; }
    suggest.justSelected = false;
    const val = input.value.trim();
    if (val && !getValues().includes(val)) {
      setValues([...getValues(), val]);
      redrawChips();
    }
    input.value = '';
  });

  function addValue(): void {
    const val = input.value.trim();
    if (!val) { return; }
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

function allFolders(app: App): TFolder[] {
  const folders: TFolder[] = [];
  app.vault.getAllLoadedFiles().forEach((f: TAbstractFile) => {
    if (f instanceof TFolder && f.path !== '/') { folders.push(f); }
  });
  return folders;
}

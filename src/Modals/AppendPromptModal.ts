import type { App } from 'obsidian';

import { Modal } from 'obsidian';

export class AppendPromptModal extends Modal {
  private inputEl!: HTMLInputElement;

  public constructor(
    app: App,
    private readonly hint: string,
    private readonly onConfirm: (text: string) => void
  ) {
    super(app);
  }

  public override onClose(): void {
    this.contentEl.empty();
  }

  public override onOpen(): void {
    const { contentEl } = this;
    contentEl.addClass('qw-prompt');

    contentEl.createEl('p', { cls: 'qw-prompt-hint', text: this.hint });

    this.inputEl = contentEl.createEl('input', { type: 'text' });
    this.inputEl.addClass('qw-prompt-input');
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { this.confirm(); }
      if (e.key === 'Escape') { this.close(); }
    });

    const btns = contentEl.createEl('div', { cls: 'qw-prompt-btns' });
    const cancel = btns.createEl('button', { cls: 'qw-prompt-btn', text: 'Cancel' });
    cancel.addEventListener('click', () => { this.close(); });
    const confirm = btns.createEl('button', { cls: 'qw-prompt-btn qw-prompt-btn--confirm', text: 'Add' });
    confirm.addEventListener('click', () => { this.confirm(); });

    window.setTimeout(() => { this.inputEl.focus(); }, 50);
  }

  private confirm(): void {
    const text = this.inputEl.value.trim();
    if (!text) { return; }
    this.close();
    this.onConfirm(text);
  }
}

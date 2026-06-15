import type { App, Command } from 'obsidian';

import { FuzzySuggestModal } from 'obsidian';

export class CommandPickerModal extends FuzzySuggestModal<Command> {
  private readonly onChoose: (command: Command) => void;

  public constructor(app: App, onChoose: (command: Command) => void) {
    super(app);
    this.onChoose = onChoose;
    this.setPlaceholder('Search commands…');
  }

  public override getItems(): Command[] {
    return this.app.commands.listCommands().sort((a, b) => a.name.localeCompare(b.name));
  }

  public override getItemText(command: Command): string {
    return command.name;
  }

  public override onChooseItem(command: Command): void {
    this.onChoose(command);
  }
}

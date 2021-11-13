// Thank you: https://github.com/phibr0/obsidian-customizable-sidebar/blob/50099ff41b17758b20f52bfd9a80abf8319c29fb/src/ui/commandSuggester.ts
import { FuzzySuggestModal, Command } from 'obsidian';
import type TopBarButtonsPlugin from '../main';
import IconPicker from './iconPicker';

export default class CommandSuggester extends FuzzySuggestModal<Command> {
    plugin: TopBarButtonsPlugin;

    constructor(plugin: TopBarButtonsPlugin) {
        super(plugin.app);
        this.plugin = plugin;
    }

    getItems(): Command[] {
        return this.app.commands.listCommands();
    }

    getItemText(item: Command): string {
        return item.name;
    }

    async onChooseItem(
        item: Command,
        evt: MouseEvent | KeyboardEvent
    ): Promise<void> {
        const { settings } = this.plugin;
        if (item.icon) {
            settings.enabledButtons.push({
                id: item.id,
                icon: item.icon,
                name: item.name,
            });
            await this.plugin.saveSettings();
            setTimeout(() => {
                dispatchEvent(new Event('TopBar-addedCommand'));
            }, 100);
        } else {
            new IconPicker(this.plugin, item).open();
        }
    }
}

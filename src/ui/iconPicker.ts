// Thank you: https://github.com/phibr0/obsidian-customizable-sidebar/blob/50099ff41b17758b20f52bfd9a80abf8319c29fb/src/ui/iconPicker.ts

import {
    FuzzySuggestModal,
    Command,
    FuzzyMatch,
    setIcon,
    Notice,
} from 'obsidian';
import type TopBarButtonsPlugin from '../main';

export default class IconPicker extends FuzzySuggestModal<string> {
    plugin: TopBarButtonsPlugin;
    command: Command;
    index: number;

    constructor(plugin: TopBarButtonsPlugin, command: Command, index = -1) {
        super(plugin.app);
        this.plugin = plugin;
        this.command = command;
        this.index = index;
        this.setPlaceholder('Please pick an icon');
    }

    private cap(string: string): string {
        const words = string.split(' ');

        return words
            .map((word) => {
                return word[0].toUpperCase() + word.substring(1);
            })
            .join(' ');
    }

    getItems(): string[] {
        return this.plugin.iconList;
    }

    getItemText(item: string): string {
        return this.cap(item.replace('feather-', '').replace(/-/gi, ' '));
    }

    renderSuggestion(item: FuzzyMatch<string>, el: HTMLElement): void {
        el.addClass('CS-icon-container');
        const div = el.createDiv({ cls: 'CS-icon' });
        //el.appendChild(div);
        setIcon(div, item.item);
        super.renderSuggestion(item, el);
    }

    async onChooseItem(item: string): Promise<void> {
        this.command.icon = item;
        const { id, name } = this.command;
        const { settings } = this.plugin;
        const showOnPlatform = settings.enabledButtons[this.index].showButtons
        const settingsObject = { id: id, icon: item, name: name, showButtons: showOnPlatform };
        if (this.index === -1) {
            settings.enabledButtons.push(settingsObject);
        } else {
            settings.enabledButtons[this.index] = settingsObject;
			new Notice('This change will take effect for new panes only.')
        }
        await this.plugin.saveSettings();

        setTimeout(() => {
            dispatchEvent(new Event('TopBar-addedCommand'));
        }, 100);
    }
}

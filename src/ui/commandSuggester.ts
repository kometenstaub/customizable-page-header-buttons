// Thank you: https://github.com/phibr0/obsidian-customizable-sidebar/blob/50099ff41b17758b20f52bfd9a80abf8319c29fb/src/ui/commandSuggester.ts
import { FuzzySuggestModal, Command } from 'obsidian';
import IconPicker from './iconPicker';
import type {
    ButtonSettings,
    TitleOrPage,
    TopBarButtonsSettings,
} from '../interfaces';
import type TopBarButtonsPlugin from '../main';
import {
    removeCenterTitleBarButtons,
    removeLeftTitleBarButtons,
    removeRightTitleBarButtons,
    restoreCenterTitlebar,
} from '../utils';

export default class CommandSuggester extends FuzzySuggestModal<Command> {
    plugin: TopBarButtonsPlugin;
    type: TitleOrPage;

    constructor(plugin: TopBarButtonsPlugin, type: TitleOrPage) {
        super(plugin.app);
        this.plugin = plugin;
        this.type = type;
    }

    pushToSettings(
        settings: TopBarButtonsSettings,
        item: Command,
        location: ButtonSettings
    ) {
        if (
            location === 'titleRight' ||
            location === 'titleLeft' ||
            location === 'titleCenter'
        ) {
            settings[location].push({
                id: item.id,
                icon: item.icon as string,
                name: item.name,
            });
        } else {
            settings.enabledButtons.push({
                id: item.id,
                icon: item.icon as string,
                name: item.name,
                showButtons: 'both',
            });
        }
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
        let centerCounter = 0;
        if (item.icon !== undefined) {
            if (this.type === 'page') {
                this.pushToSettings(settings, item, 'enabledSettings');
            } else if (this.type === 'title-left') {
                this.pushToSettings(settings, item, 'titleLeft');
            } else if (this.type === 'title-right') {
                this.pushToSettings(settings, item, 'titleRight');
            } else {
                const length = this.plugin.settings.titleCenter.length;
                if (length !== 0) {
                    centerCounter = length;
                }
                this.pushToSettings(settings, item, 'titleCenter');
            }
            await this.plugin.saveSettings();
            if (this.type === 'title-left') {
                removeLeftTitleBarButtons();
                this.plugin.addLeftTitleBarButtons();
            } else if (this.type === 'title-right') {
                removeRightTitleBarButtons();
                this.plugin.addRightTitleBarButtons();
            } else if (this.type === 'title-center') {
                // initial button is added
                if (centerCounter === 0) {
                    this.plugin.addInitialCenterTitleBarButtons();
                    // all buttons removed
                } else if (this.plugin.settings.titleCenter.length === 0) {
                    restoreCenterTitlebar(this.plugin.titlebarText);
                    // button was there before or at least one is left
                } else {
                    removeCenterTitleBarButtons();
                    this.plugin.addCenterTitleBarButtons();
                }
            }
            setTimeout(() => {
                dispatchEvent(new Event('TopBar-addedCommand'));
            }, 100);
        } else {
            new IconPicker(this.plugin, item, this.type).open();
        }
    }
}

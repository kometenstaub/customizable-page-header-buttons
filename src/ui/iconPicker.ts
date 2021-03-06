// Thank you: https://github.com/phibr0/obsidian-customizable-sidebar/blob/50099ff41b17758b20f52bfd9a80abf8319c29fb/src/ui/iconPicker.ts

import {
    FuzzySuggestModal,
    Command,
    FuzzyMatch,
    setIcon,
    Notice,
} from 'obsidian';
import type TopBarButtonsPlugin from '../main';
import type { Buttons, TitleOrPage } from 'src/interfaces';
import {
    exchangeCenterTitleBar,
    getTitlebarText,
    removeCenterTitleBarButtons,
    removeLeftTitleBarButtons,
    removeRightTitleBarButtons,
    removeTitlebarText,
    restoreCenterTitlebar,
} from '../utils';

export default class IconPicker extends FuzzySuggestModal<string> {
    plugin: TopBarButtonsPlugin;
    command: Command;
    type: TitleOrPage;
    index: number;

    constructor(
        plugin: TopBarButtonsPlugin,
        command: Command,
        type: TitleOrPage,
        index = -1
    ) {
        super(plugin.app);
        this.plugin = plugin;
        this.command = command;
        this.type = type;
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
        return this.cap(item.replace('lucide-', '').replace(/-/gi, ' '));
    }

    renderSuggestion(item: FuzzyMatch<string>, el: HTMLElement): void {
        el.addClass('CS-icon-container');
        const div = el.createDiv({ cls: 'CS-icon' });
        //el.appendChild(div);
        setIcon(div, item.item);
        super.renderSuggestion(item, el);
    }

    async onChooseItem(item: string): Promise<void> {
        const { id, name } = this.command;
        const { settings } = this.plugin;
        let centerCounter = 0;
        // page header button
        if (this.type === 'page') {
            let showOnPlatform: Buttons = 'both';
            if (this.index === -1) {
                showOnPlatform = 'both';
            } else {
                showOnPlatform =
                    settings.enabledButtons[this.index].showButtons;
            }
            const settingsObject = {
                id: id,
                icon: item,
                name: name,
                showButtons: showOnPlatform,
            };
            if (this.index === -1) {
                settings.enabledButtons.push(settingsObject);
            } else {
                settings.enabledButtons[this.index] = settingsObject;
                new Notice('This change will take effect for new panes only.');
            }
            // title bar button
        } else {
            const settingsObject = {
                id: id,
                icon: item,
                name: name,
            };
            // a button is added at the end, `-1` is the default
            if (this.index === -1) {
                if (this.type === 'title-left') {
                    settings.titleLeft.push(settingsObject);
                } else if (this.type === 'title-right') {
                    settings.titleRight.push(settingsObject);
                } else {
                    const length = settings.titleCenter.length;
                    if (length !== 0) {
                        centerCounter = length;
                    }
                    settings.titleCenter.push(settingsObject);
                }
                // an icon is changed from within the settings
            } else {
                if (this.type === 'title-left') {
                    settings.titleLeft[this.index] = settingsObject;
                } else if (this.type === 'title-right') {
                    settings.titleRight[this.index] = settingsObject;
                } else {
                    const length = settings.titleCenter.length;
                    if (length !== 0) {
                        centerCounter = length;
                    }
                    settings.titleCenter[this.index] = settingsObject;
                }
            }
        }

        await this.plugin.saveSettings();

        if (this.type === 'title-left') {
            for (let i = 0; i < this.plugin.windows.length; i++) {
                removeLeftTitleBarButtons(this.plugin.windows[i]);
                this.plugin.addLeftTitleBarButtons(this.plugin.windows[i]);
            }
        } else if (this.type === 'title-right') {
            for (let i = 0; i < this.plugin.windows.length; i++) {
                removeRightTitleBarButtons(this.plugin.windows[i]);
                this.plugin.addRightTitleBarButtons(this.plugin.windows[i]);
            }
        } else {
            // initial button is added
            if (centerCounter === 0) {
                this.plugin.titlebarText = [];
                for (let i = 0; i < this.plugin.windows.length; i++) {
                    const doc = this.plugin.windows[i];
                    this.plugin.titlebarText.push(getTitlebarText(doc));
                    removeTitlebarText(doc);
                    // could be passed; maybe for next refactoring
                    const newActions = exchangeCenterTitleBar(doc);
                    this.plugin.addCenterTitleBarButtons(doc);
                }
            } else if (settings.titleCenter.length === 0) {
                for (let i = 0; i < this.plugin.windows.length; i++) {
                    restoreCenterTitlebar(
                        this.plugin.titlebarText[i],
                        this.plugin.windows[i]
                    );
                }
            } else {
                for (let i = 0; i < this.plugin.windows.length; i++) {
                    removeCenterTitleBarButtons(this.plugin.windows[i]);
                    this.plugin.addCenterTitleBarButtons(
                        this.plugin.windows[i]
                    );
                }
            }
        }

        setTimeout(() => {
            dispatchEvent(new Event('TopBar-addedCommand'));
        }, 100);
    }
}

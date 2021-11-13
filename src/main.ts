import { Plugin, setIcon, Platform } from 'obsidian';
import { idToNameAndIcon } from './constants';
import type { TopBarButtonsSettings } from './interfaces';
import TopBarButtonsSettingTab from './settings';

const DEFAULT_SETTINGS: TopBarButtonsSettings = {
    enabledButtons: ['switcher:open'],
};

export default class TopBarButtonsPlugin extends Plugin {
    settings!: TopBarButtonsSettings;

    addButton = (viewActions: Element, button: string) => {
        const buttonIcon = createEl('a', {
            cls: ['view-action', button],
        });
        setIcon(buttonIcon, idToNameAndIcon[button].icon);
        viewActions.prepend(buttonIcon);

        this.registerDomEvent(buttonIcon, 'click', () => {
            this.app.commands.executeCommandById(button);
        });
    };

    removeButton = (button: string) => {
        const activeLeaves = document.getElementsByClassName(
            'workspace-leaf-content'
        );
        for (let i = 0; i < activeLeaves.length; i++) {
            const leaf = activeLeaves[i];
            const element = leaf.getElementsByClassName(
                `view-action ${button}`
            );
            if (element[0]) {
                element[0].remove();
            }
        }
    };

    async onload() {
        console.log('loading Top Bar Buttons Plugin');

        await this.loadSettings();

        if (Platform.isMobile) {
            this.registerEvent(
                this.app.workspace.on('file-open', () => {
                    const activeLeaf = document.getElementsByClassName(
                        'workspace-leaf mod-active'
                    )[0];
                    const viewActions =
                        activeLeaf.getElementsByClassName('view-actions')[0];

                    const enabledButtons =
                        this.settings.enabledButtons.reverse();

                    for (let button of enabledButtons) {
                        if (
                            !viewActions.getElementsByClassName(
                                `view-action ${button}`
                            )[0]
                        ) {
                            this.addButton(viewActions, button);
                        }
                    }
                })
            );
        }

        this.addSettingTab(new TopBarButtonsSettingTab(this.app, this));
    }

    onunload() {
        console.log('unloading Top Bar Buttons Plugin');
        const enabledButtons = this.settings.enabledButtons;
        for (let button of enabledButtons) {
            this.removeButton(button);
        }
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

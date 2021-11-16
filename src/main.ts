import { Plugin, setIcon, Platform } from 'obsidian';
import type { enabledButton, TopBarButtonsSettings } from './interfaces';
import TopBarButtonsSettingTab from './settings';
import { obsiIcons } from './constants';
import { addFeatherIcons } from './ui/icons'

const DEFAULT_SETTINGS: TopBarButtonsSettings = {
    enabledButtons: [],
    desktop: false,
};

export default class TopBarButtonsPlugin extends Plugin {
    settings!: TopBarButtonsSettings;
    iconList: string[] = obsiIcons;

    addButton = (viewActions: Element, button: enabledButton) => {
        const { id, icon, name } = button;

        let iconSize = 24;
        if (Platform.isMobile) {
            iconSize = 24;
        } else if (Platform.isDesktop) {
            iconSize = 18;
        }

        let tooltip = '';
        name.includes(':')
            ? (tooltip = name.split(':')[1].trim())
            : (tooltip = name);

        const buttonIcon = createEl('a', {
            cls: ['view-action', 'page-header-button', id],
            attr: { 'aria-label-position': 'bottom', 'aria-label': tooltip },
        });
        setIcon(buttonIcon, icon, iconSize);
        viewActions.prepend(buttonIcon);

        this.registerDomEvent(buttonIcon, 'click', () => {
            this.app.commands.executeCommandById(id);
        });
    };

    removeButton = (buttonId: string) => {
        const activeLeaves = document.getElementsByClassName(
            'workspace-leaf-content'
        );
        for (let i = 0; i < activeLeaves.length; i++) {
            const leaf = activeLeaves[i];
            const element = leaf.getElementsByClassName(
                `view-action page-header-button ${buttonId}`
            );
            if (element[0]) {
                element[0].remove();
            }
        }
    };

    removeAllButtons = () => {
        const activeLeaves = document.getElementsByClassName(
            'workspace-leaf-content'
        );
        for (let i = 0; i < activeLeaves.length; i++) {
            const leaf = activeLeaves[i];
            const element = leaf.getElementsByClassName(`page-header-button`);
            if (element.length > 0) {
                for (let i = element.length; i >= 0; i--) {
                    if (element[i]) {
                        element[i].remove();
                    }
                }
            }
        }
    };

    async onload() {
        console.log('loading Customize Page Header Plugin');

        await this.loadSettings();

        // add feather icons to icon list
        addFeatherIcons(this.iconList)

        if (Platform.isMobile || this.settings.desktop) {
            this.registerEvent(
                this.app.workspace.on('file-open', () => {
                    const activeLeaf = document.getElementsByClassName(
                        'workspace-leaf mod-active'
                    )[0];
                    const viewActions =
                        activeLeaf.getElementsByClassName('view-actions')[0];

                    for (
                        let i = this.settings.enabledButtons.length - 1;
                        i >= 0;
                        i--
                    ) {
                        if (
                            (this.settings.enabledButtons[i].showButtons ===
                                'both') ||
                            (this.settings.enabledButtons[i].showButtons ===
                                'mobile' &&
                                Platform.isMobile) ||
                            (this.settings.enabledButtons[i].showButtons ===
                                'desktop' &&
                                Platform.isDesktop)
                        ) {
                            if (
                                !viewActions.getElementsByClassName(
                                    `view-action page-header-button ${this.settings.enabledButtons[i].id}`
                                )[0]
                            ) {
                                this.addButton(
                                    viewActions,
                                    this.settings.enabledButtons[i]
                                );
                            }
                        } 
                    }
                })
            );
        }

        this.addSettingTab(new TopBarButtonsSettingTab(this.app, this));
    }

    onunload() {
        console.log('unloading Customize Page Header Plugin');
        this.removeAllButtons();
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

import { Platform, Plugin } from 'obsidian';
import type {
    baseButton,
    enabledButton,
    TopBarButtonsSettings,
} from './interfaces';
import TopBarButtonsSettingTab from './settings';
import {
    obsiIcons,
    PLUGIN_CLASS_NAME, TITLEBAR_CENTER,
    TITLEBAR_CLASSES,
} from './constants';
import { addFeatherIcons } from './ui/icons';
import {
    addCenterTitleBar, exchangeCenterTitleBar,
    getButtonIcon, getCenterTitleBar,
    getIconSize,
    getLeftTitleBar,
    getRightTitleBar,
    getTitlebarText,
    removeAllPageHeaderButtons,
    removeAllTitleBarButtons,
    removeTitlebarText, restoreCenterTitlebar,
} from './utils';

const DEFAULT_SETTINGS: TopBarButtonsSettings = {
    enabledButtons: [],
    desktop: false,
    titleLeft: [],
    titleRight: [],
    titleCenter: [],
};

export default class TopBarButtonsPlugin extends Plugin {
    settings!: TopBarButtonsSettings;
    iconList: string[] = obsiIcons;
    listener!: () => void;
    titlebarText!: string;

    addPageHeaderButton(
        viewActions: Element,
        button: enabledButton | baseButton
    ) {
        const { id, icon, name } = button;
        const iconSize = getIconSize();
        const classes = ['view-action', PLUGIN_CLASS_NAME];

        const buttonIcon = getButtonIcon(name, id, icon, iconSize, classes);

        viewActions.prepend(buttonIcon);

        this.registerDomEvent(buttonIcon, 'click', () => {
            this.app.commands.executeCommandById(id);
        });
    }

    addLeftTitleBarButton(viewActions: Element, button: baseButton) {
        const { id, icon, name } = button;
        const iconSize = 15;
        const buttonIcon = getButtonIcon(
            name,
            id,
            icon,
            iconSize,
            TITLEBAR_CLASSES,
            'div'
        );
        viewActions.append(buttonIcon);

        this.registerDomEvent(buttonIcon, 'click', () => {
            this.app.commands.executeCommandById(id);
        });
    }

    addRightTitleBarButton(viewActions: Element, button: baseButton) {
        const { id, icon, name } = button;
        const iconSize = 15;
        const buttonIcon = getButtonIcon(
            name,
            id,
            icon,
            iconSize,
            TITLEBAR_CLASSES,
            'div'
        );
        viewActions.prepend(buttonIcon);

        this.registerDomEvent(buttonIcon, 'click', () => {
            this.app.commands.executeCommandById(id);
        });
    }

    addCenterTitleBarButton(viewActions: Element, button: baseButton) {
        const { id, icon, name } = button;
        const iconSize = 15;
        const buttonIcon = getButtonIcon(
            name,
            id,
            icon,
            iconSize,
            TITLEBAR_CLASSES,
            'div'
        );
        viewActions.append(buttonIcon);

        this.registerDomEvent(buttonIcon, 'click', () => {
            this.app.commands.executeCommandById(id);
        });
    }

    addLeftTitleBarButtons() {
        if (this.settings.titleLeft.length > 0) {
            const modLeft = getLeftTitleBar();
            for (const button of this.settings.titleLeft) {
                this.addLeftTitleBarButton(modLeft, button);
            }
        }
    }

    addRightTitleBarButtons() {
        if (this.settings.titleRight.length > 0) {
            const modRight = getRightTitleBar();
            for (let i = this.settings.titleRight.length - 1; i >= 0; i--) {
                this.addRightTitleBarButton(
                    modRight,
                    this.settings.titleRight[i]
                );
            }
        }
    }

    // before any button is added, the parent needs to be removed and the
    // own parent added; this requires checks in the settings modal when
    // buttons are added and removed
    addInitialCenterTitleBarButtons() {
        if (this.settings.titleCenter.length > 0) {
            const center = exchangeCenterTitleBar()
            //const center = document.getElementsByClassName(
            //    `${PLUGIN_CLASS_NAME} ${TITLEBAR_CENTER}`
            //)[0];
            for (const button of this.settings.titleCenter) {
                this.addCenterTitleBarButton(center, button);
            }
        }
    }

    addCenterTitleBarButtons() {
        if (this.settings.titleCenter.length > 0) {
            const center = getCenterTitleBar()
            //const center = document.getElementsByClassName(
            //    `${PLUGIN_CLASS_NAME} ${TITLEBAR_CENTER}`
            //)[0];
            for (const button of this.settings.titleCenter) {
                this.addCenterTitleBarButton(center, button);
            }
        }
    }
    async onload() {
        console.log('loading Customizable Page Header Plugin');

        await this.loadSettings();
        this.addSettingTab(new TopBarButtonsSettingTab(this.app, this));

        // add feather icons to icon list
        addFeatherIcons(this.iconList);

        this.app.workspace.onLayoutReady(() => {
            if (Platform.isDesktopApp) {
                this.addLeftTitleBarButtons();
                this.addRightTitleBarButtons();
                this.titlebarText = getTitlebarText();
                if (this.settings.titleCenter.length > 0) {
                    this.addInitialCenterTitleBarButtons();
                }
            }
        });

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
                            this.settings.enabledButtons[i].showButtons ===
                                'both' ||
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
                                this.addPageHeaderButton(
                                    viewActions,
                                    this.settings.enabledButtons[i]
                                );
                            }
                        }
                    }
                })
            );
        }
    }

    onunload() {
        console.log('unloading Customizable Page Header Plugin');
        removeAllPageHeaderButtons();
        removeAllTitleBarButtons();
        // always remove it, in case the settings don't match
        restoreCenterTitlebar(this.titlebarText);

        globalThis.removeEventListener('TopBar-addedCommand', this.listener);
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

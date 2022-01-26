import {Platform, Plugin, setIcon} from 'obsidian';
import type {baseButton, enabledButton, TopBarButtonsSettings} from './interfaces';
import TopBarButtonsSettingTab from './settings';
import {obsiIcons, PLUGIN_CLASS_NAME, TITLEBAR_CLASS, TITLEBAR_CLASSES} from './constants';
import {addFeatherIcons} from './ui/icons';
import {getLeftNavBar, getRightNavBar} from "./utils";

const DEFAULT_SETTINGS: TopBarButtonsSettings = {
    enabledButtons: [],
    desktop: false,
    titleLeft: [],
    titleRight: [],
};

function getTooltip(name: string) {
    if (name.includes(':')){
        return name.split(':')[1].trim()
    } else {
        return name
    }
}


function getIconSize(button: enabledButton) {
    const {id, icon, name} = button;

    let iconSize = 24;
    if (Platform.isMobile) {
        iconSize = 24;
    } else if (Platform.isDesktop) {
        iconSize = 18;
    }
    return {id, icon, name, iconSize};
}


function getButtonIcon(name: string, id: string, icon: string, iconSize: number, classes: string[]) {
    const tooltip = getTooltip(name);
    const buttonClasses = classes.concat([id])

    const buttonIcon = createEl('a', {
        cls: buttonClasses,
        attr: {'aria-label-position': 'bottom', 'aria-label': tooltip},
    });
    setIcon(buttonIcon, icon, iconSize);
    return buttonIcon;
}

function getButtonInfo(button: baseButton | enabledButton, classes: string[]) {
    const {id, icon, name} = button;
    const iconSize = 15;
    const buttonIcon = getButtonIcon(name, id, icon, iconSize, classes);
    return {id, buttonIcon};
}

function removeElements(element: HTMLCollectionOf<Element>):void {
    for (let i = element.length; i >= 0; i--) {
        if (element[i]) {
            element[i].remove();
        }
    }
}

function removeSingleButton(htmlElement: Element, buttonId: string, className: string) {
    const element = htmlElement.getElementsByClassName(
        `${className} ${PLUGIN_CLASS_NAME} ${buttonId}`
    );
    if (element[0]) {
        element[0].remove();
    }
}

export default class TopBarButtonsPlugin extends Plugin {
    settings!: TopBarButtonsSettings;
    iconList: string[] = obsiIcons;
    listener!: () => void;


    addPageHeaderButton = (viewActions: Element, button: enabledButton) => {
        let {id, icon, name, iconSize} = getIconSize(button);
        const classes = ['view-action', PLUGIN_CLASS_NAME]

        const buttonIcon = getButtonIcon(name, id, icon, iconSize, classes);

        viewActions.prepend(buttonIcon);

        this.registerDomEvent(buttonIcon, 'click', () => {
            this.app.commands.executeCommandById(id);
        });
    };


    removePageHeaderButton = (buttonId: string) => {
        const activeLeaves = document.getElementsByClassName(
            'workspace-leaf-content'
        );
        for (let i = 0; i < activeLeaves.length; i++) {
            const leaf = activeLeaves[i];
            removeSingleButton(leaf, buttonId, 'view-action');
        }
    };

    removeLeftNavHeaderButton = (buttonId: string) => {
        const leftContainer = getLeftNavBar();
        removeSingleButton(leftContainer, buttonId, TITLEBAR_CLASS)
    }

    removeRightNavHeaderButton = (buttonId: string) => {
        const rightContainer = getRightNavBar();
        removeSingleButton(rightContainer, buttonId, TITLEBAR_CLASS)
    }

    addLeftNavBarButton = (viewActions: Element, button: baseButton) => {
        const {id, buttonIcon} = getButtonInfo(button, TITLEBAR_CLASSES);
        viewActions.append(buttonIcon);

        this.registerDomEvent(buttonIcon, 'click', () => {
            this.app.commands.executeCommandById(id);
        });
    }

    addRightNavBarButton = (viewActions: Element, button: baseButton) => {
        const {id, buttonIcon} = getButtonInfo(button, TITLEBAR_CLASSES);
        viewActions.prepend(buttonIcon);

        this.registerDomEvent(buttonIcon, 'click', () => {
            this.app.commands.executeCommandById(id);
        });
    }

    removeAllPageHeaderButtons = () => {
        const activeLeaves = document.getElementsByClassName(
            'workspace-leaf-content'
        );
        for (let i = 0; i < activeLeaves.length; i++) {
            const leaf = activeLeaves[i];
            const element = leaf.getElementsByClassName(PLUGIN_CLASS_NAME);
            if (element.length > 0) {
                removeElements(element);
            }
        }
    };

    removeAllNavBarButtons = () => {
        const leftContainer = getLeftNavBar();
        const rightContainer = getRightNavBar();
        const leftElements = leftContainer.getElementsByClassName(PLUGIN_CLASS_NAME);
        if (leftElements.length > 0) {
            removeElements(leftElements)
        }
        const rightElements = rightContainer.getElementsByClassName(PLUGIN_CLASS_NAME);
        if (rightElements.length > 0) {
            removeElements(rightElements)
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
                if (this.settings.titleLeft.length > 0) {
                    const modLeft = getLeftNavBar();
                    for (const button of this.settings.titleLeft) {
                        this.addLeftNavBarButton(modLeft, button);
                    }
                }
                if (this.settings.titleRight.length > 0) {
                    const modRight = getRightNavBar();
                    for (
                        let i = this.settings.titleLeft.length - 1;
                        i >= 0;
                        i--
                    ) {
                        this.addRightNavBarButton(modRight, this.settings.enabledButtons[i])
                    }
                }
            }
        })

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
        this.removeAllPageHeaderButtons();
        this.removeAllNavBarButtons();
        globalThis.removeEventListener('TopBar-addedCommand', this.listener);
        globalThis.removeEventListener('NavBar-addedCommand', this.listener);
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

import { Platform, Plugin, Workspace, WorkspaceLeaf } from 'obsidian';
import { around } from 'monkey-around';
import type {
    baseButton,
    enabledButton,
    TopBarButtonsSettings,
} from './interfaces';
import TopBarButtonsSettingTab from './settings';
import { obsiIcons, PLUGIN_CLASS_NAME, TITLEBAR_CLASSES } from './constants';
import {
    exchangeCenterTitleBar,
    getButtonIcon,
    getCenterTitleBar,
    getIconSize,
    getLeftTitleBar,
    getRightTitleBar,
    getTitlebarText,
    removeAllPageHeaderButtons,
    removeAllTitleBarButtons,
    removeTitlebarText,
    restoreCenterTitlebar,
} from './utils';
import { lucideIcons } from './lucide';

declare module 'obsidian' {
    interface Workspace {
        onLayoutChange(): void; // tell plugins the layout changed
    }
}

const DEFAULT_SETTINGS: TopBarButtonsSettings = {
    enabledButtons: [],
    desktop: false,
    titleLeft: [],
    titleRight: [],
    titleCenter: [],
    paneRelief: false,
};

export default class TopBarButtonsPlugin extends Plugin {
    settings!: TopBarButtonsSettings;
    iconList: string[] = obsiIcons.concat(lucideIcons);
    listener!: () => void;
    titlebarText: Element[] = [];
    windows: Document[] = [];

    addPageHeaderButton(
        viewActions: Element,
        button: enabledButton | baseButton
    ) {
        const { id, icon, name } = button;
        const iconSize = getIconSize();
        const classes = ['view-action', PLUGIN_CLASS_NAME];

        const buttonIcon = getButtonIcon(name, id, icon, iconSize, classes);

        if (
            this.settings.paneRelief &&
            (id === 'app:go-forward' || id === 'app:go-back')
        ) {
            buttonIcon.addClass('pane-relief');
        }

        viewActions.prepend(buttonIcon);

        this.registerDomEvent(buttonIcon, 'click', () => {
            /* this way the pane gets activated from the click
                otherwise the action would get executed on the former active pane
                timeout of 1 was enough, but 5 is chosen for slower computers
                may need to be made its own setting in the future
                 */
            setTimeout(() => this.app.commands.executeCommandById(id), 5);
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
        // necessary for popout windows; in the main window .prepend() works,
        // but not in popout windows
        viewActions.insertBefore(buttonIcon, viewActions.children[0]);

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

    addLeftTitleBarButtons(doc: Document) {
        if (this.settings.titleLeft.length > 0) {
            const modLeft = getLeftTitleBar(doc);
            for (const button of this.settings.titleLeft) {
                this.addLeftTitleBarButton(modLeft, button);
            }
        }
    }

    addRightTitleBarButtons(doc: Document) {
        if (this.settings.titleRight.length > 0) {
            const modRight = getRightTitleBar(doc);
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
    /*
    addInitialCenterTitleBarButtons(doc: Document) {
        if (this.settings.titleCenter.length > 0) {
            const center = exchangeCenterTitleBar(doc);
            //const center = document.getElementsByClassName(
            //    `${PLUGIN_CLASS_NAME} ${TITLEBAR_CENTER}`
            //)[0];
            for (const button of this.settings.titleCenter) {
                this.addCenterTitleBarButton(center, button);
            }
        }
    }
*/

    addCenterTitleBarButtons(doc: Document) {
        if (this.settings.titleCenter.length > 0) {
            const center = getCenterTitleBar(doc);
            //const center = document.getElementsByClassName(
            //    `${PLUGIN_CLASS_NAME} ${TITLEBAR_CENTER}`
            //)[0];
            for (const button of this.settings.titleCenter) {
                this.addCenterTitleBarButton(center, button);
            }
        }
    }

    initTitleBar(doc: Document) {
        this.addLeftTitleBarButtons(doc);
        this.addRightTitleBarButtons(doc);
        // store the element so that it can be restored later on
        if (this.settings.titleCenter.length > 0) {
            this.titlebarText.push(getTitlebarText(doc));
            removeTitlebarText(doc);
            // could be passed; maybe for next refactoring
            const newActions = exchangeCenterTitleBar(doc);
            this.addCenterTitleBarButtons(doc);
        }
    }
    async onload() {
        console.log('loading Customizable Page Header Plugin');

        await this.loadSettings();
        this.addSettingTab(new TopBarButtonsSettingTab(this.app, this));

        this.app.workspace.onLayoutReady(() => {
            if (Platform.isDesktopApp) {
                this.windows.push(document);
                this.initTitleBar(document);
            }
            if (Platform.isMobile || this.settings.desktop) {
                this.addButtonsToAllLeaves();
            }
        });

        if (Platform.isMobile || this.settings.desktop) {
            const self = this;
            this.register(
                around(Workspace.prototype, {
                    changeLayout(old) {
                        return async function changeLayout(
                            this: Workspace,
                            ws: any
                        ) {
                            await old.call(this, ws);
                            self.addButtonsToAllLeaves();
                        };
                    },
                })
            );
            this.registerEvent(
                this.app.workspace.on('file-open', () => {
                    const activeLeaf = app.workspace.getMostRecentLeaf();

                    // if that is used, the buttons don't stay when navigating to a non-markdown pane (excalidraw)
                    //const view =
                    //    app.workspace.getActiveViewOfType(MarkdownView);
                    if (!activeLeaf) {
                        return;
                    }
                    //let activeLeaf = view.containerEl;
                    /*
                    const activeLeaf = document.getElementsByClassName(
                        'workspace-leaf mod-active'
                    )[0];
*/
                    this.addButtonsToLeaf(activeLeaf);
                })
            );
            this.registerEvent(
                this.app.workspace.on('window-open', (win, window) => {
                    const currentDoc = win.getContainer()?.doc;
                    if (currentDoc) {
                        this.windows.push(currentDoc);
                        this.initTitleBar(currentDoc);
                    }
                })
            );
        }
    }

    addButtonsToAllLeaves() {
        app.workspace.iterateAllLeaves((leaf) => this.addButtonsToLeaf(leaf));
        app.workspace.onLayoutChange();
    }

    addButtonsToLeaf(leaf: WorkspaceLeaf) {
        const activeLeaf = leaf?.view.containerEl;
        const viewActions =
            activeLeaf?.getElementsByClassName('view-actions')[0];

        // sidebar panes without a view-header can take focus
        if (!viewActions) {
            return;
        }

        for (let i = this.settings.enabledButtons.length - 1; i >= 0; i--) {
            // Remove the existing element first
            viewActions
                .getElementsByClassName(
                    `view-action page-header-button ${this.settings.enabledButtons[i].id}`
                )[0]
                ?.detach();
            if (
                this.settings.enabledButtons[i].showButtons === 'both' ||
                (this.settings.enabledButtons[i].showButtons === 'mobile' &&
                    Platform.isMobile) ||
                (this.settings.enabledButtons[i].showButtons === 'desktop' &&
                    Platform.isDesktop)
            ) {
                this.addPageHeaderButton(
                    viewActions,
                    this.settings.enabledButtons[i]
                );
            }
        }
    }

    onunload() {
        console.log('unloading Customizable Page Header Plugin');
        removeAllPageHeaderButtons();

        for (let i = 0; i < this.windows.length; i++) {
            removeAllTitleBarButtons(this.windows[i]);
            restoreCenterTitlebar(this.titlebarText[i], this.windows[i]);
        }

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
        app.workspace.onLayoutReady(() => this.addButtonsToAllLeaves());
    }
}

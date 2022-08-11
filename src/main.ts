import {
    Platform,
    Plugin,
    View,
    Workspace,
    WorkspaceLeaf,
    WorkspaceWindow,
} from 'obsidian';
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
        floatingSplit: {
            children: WorkspaceWindow[];
        };
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
        const classes = ['view-action', 'icon-btn', PLUGIN_CLASS_NAME];

        const buttonIcon = getButtonIcon(name, id, icon, iconSize, classes);

        if (
            this.settings.paneRelief &&
            (id === 'app:go-forward' || id === 'app:go-back')
        ) {
            buttonIcon.addClass('pane-relief');
        }

        viewActions.prepend(buttonIcon);

        this.registerDomEvent(buttonIcon, 'mousedown', (evt) => {
            /* This way the pane gets activated from the click,
             * otherwise the action would get executed on the former active pane.
             * Timeout of 1 was enough, but 5 is chosen for slower computers.
             * May need to be made its own setting in the future.
             *
             * Only execute event on primary button press. Needed for compatibility with Pane Relief.
             */
            if (evt.button === 0) {
                setTimeout(() => {
                    this.app.commands.executeCommandById(id);
                }, 5);
            }
        });
    }

    addLeftTitleBarButton(viewActions: Element, button: baseButton) {
        if (activeDocument.body.classList.contains('is-hidden-frameless')) return;
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
        if (activeDocument.body.classList.contains('is-hidden-frameless')) return;
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
        if (activeDocument.body.classList.contains('is-hidden-frameless')) return;
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
        if (activeDocument.body.classList.contains('is-hidden-frameless')) return;
        if (this.settings.titleLeft.length > 0) {
            const modLeft = getLeftTitleBar(doc);
            if (!modLeft) return;
            for (const button of this.settings.titleLeft) {
                this.addLeftTitleBarButton(modLeft, button);
            }
        }
    }

    addRightTitleBarButtons(doc: Document) {
        if (activeDocument.body.classList.contains('is-hidden-frameless')) return;
        if (this.settings.titleRight.length > 0) {
            const modRight = getRightTitleBar(doc);
            if (!modRight) return;
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
        if (activeDocument.body.classList.contains('is-hidden-frameless')) return;
        if (this.settings.titleCenter.length > 0) {
            const center = getCenterTitleBar(doc);
            if (!center) return;
            //const center = document.getElementsByClassName(
            //    `${PLUGIN_CLASS_NAME} ${TITLEBAR_CENTER}`
            //)[0];
            for (const button of this.settings.titleCenter) {
                this.addCenterTitleBarButton(center, button);
            }
        }
    }

    initTitleBar(doc: Document) {
        if (activeDocument.body.classList.contains('is-hidden-frameless')) return;

        this.addLeftTitleBarButtons(doc);
        this.addRightTitleBarButtons(doc);
        // store the element so that it can be restored later on
        if (this.settings.titleCenter.length > 0) {
            const titleBarText = getTitlebarText(doc);
            if (!titleBarText) return;
            // differentiate between enabled after start and enabled on start
            if (!this.titlebarText.contains(titleBarText)) {
                this.titlebarText.push(titleBarText);
                removeTitlebarText(doc);
                // could be passed; maybe for next refactoring
                const newActions = exchangeCenterTitleBar(doc);
                this.addCenterTitleBarButtons(doc);
            }
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
                const { children } = this.app.workspace.floatingSplit;
                // window-open onload (restart of app) gets called before
                // onLayoutReady; this covers the case that obsidian starts with
                // multiple windows, but adds the buttons to pop-out windows when
                // the plugin is newly activated
                if (children.length + 1 !== this.windows.length) {
                    for (const el of children) {
                        // should be redundant, but Licat said to check
                        if (el instanceof WorkspaceWindow) {
                            const currentDoc = el.getContainer()?.doc;
                            if (currentDoc) {
                                this.windows.push(currentDoc);
                                this.initTitleBar(currentDoc);
                            }
                        }
                    }
                }
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
                this.app.workspace.on('layout-change', () => {
                    const activeLeaf = app.workspace.getActiveViewOfType(View);
                    if (!activeLeaf) {
                        return;
                    }
                    this.addButtonsToLeaf(activeLeaf.leaf);
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

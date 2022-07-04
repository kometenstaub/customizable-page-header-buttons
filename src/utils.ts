import { Platform, setIcon } from 'obsidian';
import {
    PLUGIN_CLASS_NAME,
    TITLEBAR_CENTER,
    TITLEBAR_CLASS,
} from './constants';

// General purpose utility functions

function getTooltip(name: string) {
    if (name.includes(':')) {
        return name.split(':')[1].trim();
    } else {
        return name;
    }
}

export function getIconSize() {
    let iconSize = 24;
    if (Platform.isMobile) {
        iconSize = 24;
    } else if (Platform.isDesktop) {
        iconSize = 18;
    }
    return iconSize;
}

/**
 *
 * @param name - Full command name, needs to be cleaned up
 * @param id - Command id
 * @param icon - String of the assigned icon
 * @param iconSize - Icon size, relevant for either mobile/desktop or the titlebar
 * @param classes - The CSS classes which are assigned so that the native Obsidian styling can be applied
 * @param tag - 'a' is the HTML tag for the page header buttons, 'div' for the titlebar buttons
 */
export function getButtonIcon(
    name: string,
    id: string,
    icon: string,
    iconSize: number,
    classes: string[],
    tag: 'a' | 'div' = 'a'
) {
    const tooltip = getTooltip(name);
    const buttonClasses = classes.concat([id]);

    const buttonIcon = createEl(tag, {
        cls: buttonClasses,
        attr: { 'aria-label-position': 'bottom', 'aria-label': tooltip },
    });
    setIcon(buttonIcon, icon, iconSize);
    return buttonIcon;
}

export function removeElements(element: HTMLCollectionOf<Element>): void {
    for (let i = element.length; i >= 0; i--) {
        if (element[i]) {
            element[i].remove();
        }
    }
}

export function removeSingleButton(
    htmlElement: Element,
    buttonId: string,
    className: string
) {
    const element = htmlElement.getElementsByClassName(
        `${className} ${PLUGIN_CLASS_NAME} ${buttonId}`
    );
    if (element[0]) {
        element[0].remove();
    }
}

// Center title bar utility functions

export function getTitlebarText(doc: Document) {
    return doc.getElementsByClassName('titlebar-text')[0];
}

export function removeTitlebarText(doc: Document) {
    const titlebarText = doc.getElementsByClassName('titlebar-text')[0];
    titlebarText.detach();
}

export function restoreCenterTitlebar(titlebarText: Element, doc: Document) {
    const centerTitlebar = doc.getElementsByClassName(
        `${PLUGIN_CLASS_NAME} ${TITLEBAR_CENTER}`
    )[0];
    // needed for ununload if no center buttons are defined
    if (centerTitlebar !== undefined) {
        const inner = centerTitlebar.parentElement;
        centerTitlebar.detach();
        if (inner) {
            inner.insertBefore(titlebarText, inner.children[0]);
        }
    }
}

export function removeCenterTitleBarButtons(doc: Document) {
    const centerTitlebar = getCenterTitleBar(doc);
    const buttons = centerTitlebar.getElementsByClassName(
        `${PLUGIN_CLASS_NAME} ${TITLEBAR_CLASS}`
    );
    removeElements(buttons);
}

export function exchangeCenterTitleBar(doc: Document): Element {
    const centerTitleBar = createDiv({
        cls: [PLUGIN_CLASS_NAME, 'titlebar-center'],
    });
    const parent = doc.getElementsByClassName('titlebar-inner')[0];
    if (parent) {
        parent.insertBefore(centerTitleBar, parent.children[0]);
    }
    return centerTitleBar;
}

// Page header utility functions

export function removeAllPageHeaderButtons() {
    /*
    const activeLeaves = document.getElementsByClassName(
        'workspace-leaf-content'
    );
*/
    const activeLeaves: HTMLElement[] = [];
    app.workspace.iterateAllLeaves((leaf) => {
        activeLeaves.push(leaf.view.containerEl);
    });
    for (let i = 0; i < activeLeaves.length; i++) {
        const leaf = activeLeaves[i];
        const element = leaf.getElementsByClassName(PLUGIN_CLASS_NAME);
        if (element.length > 0) {
            removeElements(element);
        }
    }
}

export function removePageHeaderButton(buttonId: string) {
    /*
    const activeLeaves = document.getElementsByClassName(
        'workspace-leaf-content'
    );
*/
    const activeLeaves: HTMLElement[] = [];
    app.workspace.iterateAllLeaves((leaf) => {
        activeLeaves.push(leaf.view.containerEl);
    });
    for (let i = 0; i < activeLeaves.length; i++) {
        const leaf = activeLeaves[i];
        removeSingleButton(leaf, buttonId, 'view-action');
    }
}

// Left and right title bar utility functions

export function removeAllTitleBarButtons(doc: Document) {
    removeLeftTitleBarButtons(doc);
    removeRightTitleBarButtons(doc);
}

// remove all left and right title bar buttons

export function removeLeftTitleBarButtons(doc: Document) {
    const leftContainer = getLeftTitleBar(doc);
    const leftElements =
        leftContainer.getElementsByClassName(PLUGIN_CLASS_NAME);
    if (leftElements.length > 0) {
        removeElements(leftElements);
    }
}

export function removeRightTitleBarButtons(doc: Document) {
    const rightContainer = getRightTitleBar(doc);
    const rightElements =
        rightContainer.getElementsByClassName(PLUGIN_CLASS_NAME);
    if (rightElements.length > 0) {
        removeElements(rightElements);
    }
}

// remove single title bar button

export function removeLeftTitleBarButton(buttonId: string, doc: Document) {
    const leftContainer = getLeftTitleBar(doc);
    removeSingleButton(leftContainer, buttonId, TITLEBAR_CLASS);
}

export function removeRightTitleBarButton(buttonId: string, doc: Document) {
    const rightContainer = getRightTitleBar(doc);
    removeSingleButton(rightContainer, buttonId, TITLEBAR_CLASS);
}

export function removeCenterTitleBarButton(buttonId: string, doc: Document) {
    const centerContainer = getCenterTitleBar(doc);
    removeSingleButton(centerContainer, buttonId, TITLEBAR_CLASS);
}

// get HTML Elements

export function getLeftTitleBar(doc: Document): Element {
    return doc.getElementsByClassName('titlebar-button-container mod-left')[0];
}

export function getRightTitleBar(doc: Document): Element {
    return doc.getElementsByClassName('titlebar-button-container mod-right')[0];
}

export function getCenterTitleBar(doc: Document): Element {
    return doc.getElementsByClassName(
        `${PLUGIN_CLASS_NAME} ${TITLEBAR_CENTER}`
    )[0];
}

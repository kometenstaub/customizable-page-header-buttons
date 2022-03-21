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

export function getTitlebarText() {
    const titlebarText = document.getElementsByClassName('titlebar-text')[0];
    return titlebarText.getText();
}

export function removeTitlebarText() {
    const titlebarText = document.getElementsByClassName('titlebar-text');
    removeElements(titlebarText);
}

export function restoreCenterTitlebar(text: string) {
    const centerTitlebar = document.getElementsByClassName(
        `${PLUGIN_CLASS_NAME} ${TITLEBAR_CENTER}`
    )[0];
    // needed for ununload if no center buttons are defined
    if (centerTitlebar !== undefined) {
        centerTitlebar.classList.remove(
            ...[PLUGIN_CLASS_NAME, TITLEBAR_CENTER]
        );
        centerTitlebar.addClass('titlebar-text');
        centerTitlebar.innerHTML = text;
    }
}

export function removeCenterTitleBarButtons() {
    const centerTitlebar = getCenterTitleBar();
    const buttons = centerTitlebar.getElementsByClassName(
        `${PLUGIN_CLASS_NAME} ${TITLEBAR_CLASS}`
    );
    removeElements(buttons);
}

export function exchangeCenterTitleBar(): Element {
    const centerTitleBar = document.getElementsByClassName('titlebar-text')[0];
    centerTitleBar.classList.remove('titlebar-text');
    centerTitleBar.addClasses([PLUGIN_CLASS_NAME, TITLEBAR_CENTER]);
    centerTitleBar.innerHTML = '';
    return centerTitleBar;
}

// Page header utility functions

export function removeAllPageHeaderButtons() {
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
}

export function removePageHeaderButton(buttonId: string) {
    const activeLeaves = document.getElementsByClassName(
        'workspace-leaf-content'
    );
    for (let i = 0; i < activeLeaves.length; i++) {
        const leaf = activeLeaves[i];
        removeSingleButton(leaf, buttonId, 'view-action');
    }
}

// Left and right title bar utility functions

export function removeAllTitleBarButtons() {
    removeLeftTitleBarButtons();
    removeRightTitleBarButtons();
}

// remove all left and right title bar buttons

export function removeLeftTitleBarButtons() {
    const leftContainer = getLeftTitleBar();
    const leftElements =
        leftContainer.getElementsByClassName(PLUGIN_CLASS_NAME);
    if (leftElements.length > 0) {
        removeElements(leftElements);
    }
}

export function removeRightTitleBarButtons() {
    const rightContainer = getRightTitleBar();
    const rightElements =
        rightContainer.getElementsByClassName(PLUGIN_CLASS_NAME);
    if (rightElements.length > 0) {
        removeElements(rightElements);
    }
}

// remove single title bar button

export function removeLeftTitleBarButton(buttonId: string) {
    const leftContainer = getLeftTitleBar();
    removeSingleButton(leftContainer, buttonId, TITLEBAR_CLASS);
}

export function removeRightTitleBarButton(buttonId: string) {
    const rightContainer = getRightTitleBar();
    removeSingleButton(rightContainer, buttonId, TITLEBAR_CLASS);
}

export function removeCenterTitleBarButton(buttonId: string) {
    const centerContainer = getCenterTitleBar();
    removeSingleButton(centerContainer, buttonId, TITLEBAR_CLASS);
}

// get HTML Elements

export function getLeftTitleBar(): Element {
    return document.getElementsByClassName(
        'titlebar-button-container mod-left'
    )[0];
}

export function getRightTitleBar(): Element {
    return document.getElementsByClassName(
        'titlebar-button-container mod-right'
    )[0];
}

export function getCenterTitleBar(): Element {
    return document.getElementsByClassName(
        `${PLUGIN_CLASS_NAME} ${TITLEBAR_CENTER}`
    )[0];
}

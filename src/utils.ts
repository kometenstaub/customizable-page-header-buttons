import { Platform, setIcon } from 'obsidian';
import { PLUGIN_CLASS_NAME } from './constants';

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

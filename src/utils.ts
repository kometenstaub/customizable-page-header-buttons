import type {baseButton, enabledButton} from "./interfaces";
import {Platform, setIcon} from "obsidian";
import {PLUGIN_CLASS_NAME} from "./constants";

export function getLeftNavBar():Element {
	return document.getElementsByClassName('titlebar-button-container mod-left')[0]
}

export function getRightNavBar():Element {
	return document.getElementsByClassName('titlebar-button-container mod-right')[0]
}
function getTooltip(name: string) {
	if (name.includes(':')){
		return name.split(':')[1].trim()
	} else {
		return name
	}
}


export function getIconSize(button: enabledButton) {
	const {id, icon, name} = button;

	let iconSize = 24;
	if (Platform.isMobile) {
		iconSize = 24;
	} else if (Platform.isDesktop) {
		iconSize = 18;
	}
	return {id, icon, name, iconSize};
}


export function getButtonIcon(name: string, id: string, icon: string, iconSize: number, classes: string[]) {
	const tooltip = getTooltip(name);
	const buttonClasses = classes.concat([id])

	const buttonIcon = createEl('a', {
		cls: buttonClasses,
		attr: {'aria-label-position': 'bottom', 'aria-label': tooltip},
	});
	setIcon(buttonIcon, icon, iconSize);
	return buttonIcon;
}

export function getButtonInfo(button: baseButton | enabledButton, classes: string[]) {
	const {id, icon, name} = button;
	const iconSize = 15;
	const buttonIcon = getButtonIcon(name, id, icon, iconSize, classes);
	return {id, buttonIcon};
}

export function removeElements(element: HTMLCollectionOf<Element>):void {
	for (let i = element.length; i >= 0; i--) {
		if (element[i]) {
			element[i].remove();
		}
	}
}

export function removeSingleButton(htmlElement: Element, buttonId: string, className: string) {
	const element = htmlElement.getElementsByClassName(
		`${className} ${PLUGIN_CLASS_NAME} ${buttonId}`
	);
	if (element[0]) {
		element[0].remove();
	}
}


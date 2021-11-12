import { Plugin, setIcon, Platform } from 'obsidian';

export default class QuickSwitcherButtonPlugin extends Plugin {
    async onload() {
        console.log('loading Quick Switcher Button Plugin');

        this.app.workspace.onLayoutReady(() => {
            if (Platform.isMobile) {
                const quickSwitcherIcon = createEl('a', {
                    cls: ['view-action', 'quick-switcher-button'],
                });
                setIcon(quickSwitcherIcon, 'go-to-file');
                const viewActions =
                    document.getElementsByClassName('view-actions')[0];
                viewActions.prepend(quickSwitcherIcon);

                this.registerDomEvent(quickSwitcherIcon, 'click', () => {
                    this.app.commands.executeCommandById('switcher:open');
                });
            }
        });
    }

    onunload() {
        console.log('unloading Quick Switcher Button Plugin');
    }
}

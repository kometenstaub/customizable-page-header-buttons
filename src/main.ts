import { Plugin, setIcon, Platform, WorkspaceLeaf } from 'obsidian';

export default class QuickSwitcherButtonPlugin extends Plugin {
    // visited: Set<WorkspaceLeaf> = new Set();

    addButton = (activeLeaf: Element, viewActions: Element) => {
        const quickSwitcherIcon = createEl('a', {
            cls: ['view-action', 'quick-switcher-button'],
        });
        setIcon(quickSwitcherIcon, 'go-to-file');
        // const activeLeaf = document.getElementsByClassName(
        //     'workspace-leaf mod-active'
        // )[0];
        // const viewActions =
        //     activeLeaf.getElementsByClassName('view-actions')[0];
        viewActions.prepend(quickSwitcherIcon);
        // console.log(viewActions);

        this.registerDomEvent(quickSwitcherIcon, 'click', () => {
            this.app.commands.executeCommandById('switcher:open');
        });
    };

    removeButton = () => {
        const activeLeaves = document.getElementsByClassName(
            'workspace-leaf-content'
        );
        for (let i = 0; i < activeLeaves.length; i++) {
            const leaf = activeLeaves[i];
            const element = leaf.getElementsByClassName(
                'view-action quick-switcher-button'
            );
            if (element[0]) {
                element[0].remove();
            }
        }
    };

    async onload() {
        console.log('loading Quick Switcher Button Plugin');

        if (Platform.isMobile) {
            this.registerEvent(
                this.app.workspace.on('file-open', () => {
                    // console.log('file opened');
                    // const currentLeaf = this.app.workspace.getLeaf();

                    const activeLeaf = document.getElementsByClassName(
                        'workspace-leaf mod-active'
                    )[0];
                    // console.log(activeLeaf);
                    const viewActions =
                        activeLeaf.getElementsByClassName('view-actions')[0];

                    if (
                        !viewActions.getElementsByClassName(
                            'view-action quick-switcher-button'
                        )[0]
                    ) {
                        this.addButton(activeLeaf, viewActions);
                    }
                    // //@ts-expect-error
                    // if (!this.visited.has(currentLeaf.id)) {
                    //     // const activeLeaf = document.getElementsByClassName(
                    //     //     'workspace-leaf mod-active'
                    //     // )[0];
                    //     // console.log(activeLeaf);
                    //     // const viewActions =
                    //     //     activeLeaf.getElementsByClassName(
                    //     //         'view-actions'
                    //     //     )[0];

                    //     // if (
                    //     //     !viewActions.getElementsByClassName(
                    //     //         'view-action quick-switcher-button'
                    //     //     )[0]
                    //     // ) {
                    //     //     this.addButton();
                    //     // }
                    // }
                    // //@ts-expect-error
                    // this.visited.add(currentLeaf.id);
                })
            );
        }
    }

    onunload() {
        console.log('unloading Quick Switcher Button Plugin');
        this.removeButton();
    }
}

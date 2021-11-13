export interface TopBarButtonsSettings {
    enabledButtons: { id: string; icon: string; name: string }[];
    desktop: boolean;
}

declare module 'obsidian' {
    interface App {
        commands: {
            executeCommandById: any;
            // listCommands: () => {
            //     id: string;
            //     name: string;
            //     hotkeys: [key: string, modifiers: string[]];
            // }[];
            listCommands: () => Command[];
        };
        plugins: {
            plugins: any;
        };
    }
}

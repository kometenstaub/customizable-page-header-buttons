export interface TopBarButtonsSettings {
    enabledButtons: enabledButton[];
    desktop: boolean;
}

export type Buttons = 'both' | 'mobile' | 'desktop';

export interface enabledButton {
    id: string;
    icon: string;
    name: string;
    showButtons: Buttons;
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

import type { Command } from 'obsidian';

export interface TopBarButtonsSettings {
    enabledButtons: enabledButton[];
    desktop: boolean;
    titleLeft: baseButton[];
    titleRight: baseButton[];
}

export type Buttons = 'both' | 'mobile' | 'desktop';

export interface baseButton {
    id: string;
    icon: string;
    name: string;
}

export interface enabledButton extends baseButton {
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

export type TitleOrPage = 'title-left' | 'title-right' | 'page';

export type TitleSettings = 'titleLeft' | 'titleRight';

export type ButtonSettings = TitleSettings | 'enabledSettings';

import type { Command } from 'obsidian';

export interface TopBarButtonsSettings {
    enabledButtons: enabledButton[];
    desktop: boolean;
    titleLeft: baseButton[];
    titleRight: baseButton[];
    titleCenter: baseButton[];
    paneRelief: boolean;
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
            plugins: Record<string, any>;
        };
        setting: {
            openTabById(id: string): void;
            pluginTabs: Array<{
                id: string;
                name: string;
                plugin: { [key: string]: manifest };
                instance?: {
                    description: string;
                    id: string;
                    name: string;
                };
            }>;
            activeTab: any;
            open(): void;
        };
    }
}

export type TitleOrPage =
    | 'title-left'
    | 'title-right'
    | 'title-center'
    | 'page';

export type TitleSettings = 'titleLeft' | 'titleRight' | 'titleCenter';

export type ButtonSettings = TitleSettings | 'enabledSettings';

interface manifest {
    author: string;
    authorUrl: string;
    description: string;
    dir: string;
    id: string;
    isDesktopOnly: boolean;
    minAppVersion: string;
    name: string;
    version: string;
}

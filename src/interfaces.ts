export interface TopBarButtonsSettings {
    enabledButtons: string[];
}

declare module 'obsidian' {
    interface App {
        commands: {
            executeCommandById: any;
        };
        plugins: {
            plugins: any;
        };
    }
}

export interface InternalCommands {
    [id: string]: { name: string; icon: string };
}

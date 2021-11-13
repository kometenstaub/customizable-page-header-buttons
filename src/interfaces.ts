export interface TopBarButtonsSettings {}

declare module 'obsidian' {
    interface App {
        commands: {
            executeCommandById: any;
        };
    }
}

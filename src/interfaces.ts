export interface QuickSwitcherSettings {}

declare module 'obsidian' {
    interface App {
        commands: {
            executeCommandById: any;
        };
    }
}

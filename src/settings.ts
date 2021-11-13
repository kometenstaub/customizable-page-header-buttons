import { PluginSettingTab, App } from "obsidian";
import type TopBarButtonsPlugin from './main'

export default class TopBarButtonsSettingTab extends PluginSettingTab {
	plugin: TopBarButtonsPlugin;

	    constructor(app: App, plugin: TopBarButtonsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

	display(): void {
        const { containerEl } = this;
        const { settings } = this.plugin;

        containerEl.empty();

        containerEl.createEl('h2', {
            text: 'Top Bar Buttons Settings',
        });

}
}
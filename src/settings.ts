import { PluginSettingTab, App, Setting } from 'obsidian';
import type TopBarButtonsPlugin from './main';
import { idToNameAndIcon } from './constants';

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

        for (const [id, obj] of Object.entries(idToNameAndIcon)) {
            new Setting(containerEl)
				.setName(obj.name)
				.addToggle((toggle) => {
                let buttonEnabled = false
				if (settings.enabledButtons.includes(id)) {
					buttonEnabled = true
				}
                if (buttonEnabled) {
                    toggle
						.setValue(true)
						.onChange(async (state) => {
                        if (state) {
                            settings.enabledButtons.push(id);
                        } else {
                            settings.enabledButtons.remove(id);
                        }
						await this.plugin.saveSettings()
						// console.log(this.plugin.settings.enabledButtons)
                    });
                } else {
                    toggle
						.setValue(false)
						.onChange(async (state) => {
                        if (state) {
                            settings.enabledButtons.push(id);
                        } else {
                            settings.enabledButtons.remove(id);
                        }
						await this.plugin.saveSettings()
						// console.log(this.plugin.settings.enabledButtons)
                    });
                }
            });
        }

        // new Setting(containerEl)
        //     .setName('Enable Quick Switcher')
        //     .setDesc(
        //         'This will increase performance when opening the modal, but will load the data into memory on startup.'
        //     )
        //     .addToggle((toggle) => {
        //         toggle
        //             .setValue(this.plugin.settings.loadLcsh)
        //             .onChange((state) => {
        //                 this.plugin.settings.loadLcsh = state;
        //                 this.plugin.saveSettings();
        //             });
        //     });
    }
}

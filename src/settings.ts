import { App, Platform, PluginSettingTab, setIcon, Setting } from 'obsidian';
import type TopBarButtonsPlugin from './main';
import CommandSuggester from './ui/commandSuggester';
import IconPicker from './ui/iconPicker';
import type { Buttons } from './interfaces';
import {
    removeAllTitleBarButtons,
    removeCenterTitleBarButton,
    removeCenterTitleBarButtons,
    removeLeftTitleBarButton,
    removeLeftTitleBarButtons,
    removePageHeaderButton,
    removeRightTitleBarButton,
    removeRightTitleBarButtons,
    restoreCenterTitlebar,
} from './utils';

export default class TopBarButtonsSettingTab extends PluginSettingTab {
    plugin: TopBarButtonsPlugin;

    constructor(app: App, plugin: TopBarButtonsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.plugin.listener = () => {
            this.display();
        };
        this.containerEl.addClass('page-header-button');
        addEventListener('TopBar-addedCommand', this.plugin.listener);
    }

    display(): void {
        const { containerEl } = this;
        const { settings } = this.plugin;

        containerEl.empty();

        containerEl.createEl('h3', {
            text: 'Page Header Buttons',
        });

        containerEl.createEl('p', {
            text: 'The buttons are added in the order in which they are shown here.',
        });

        new Setting(containerEl)
            .setName('Show buttons on desktop')
            .setDesc(
                'By default, the buttons will only be shown in Obsidian Mobile.'
            )
            .addToggle((toggle) => {
                toggle.setValue(settings.desktop).onChange(async (state) => {
                    settings.desktop = state;
                    await this.plugin.saveSettings();
                    this.display();
                    if (!state) {
                        for (let button of settings.enabledButtons) {
                            button.showButtons = 'mobile';
                        }
                        await this.plugin.saveSettings();
                    }
                });
            });

        // Thank you: https://github.com/phibr0/obsidian-customizable-sidebar/blob/50099ff41b17758b20f52bfd9a80abf8319c29fb/src/ui/settingsTab.ts
        new Setting(containerEl)
            .setName('Add Button')
            .setDesc(
                'Add a new button left to the switch edit/preview mode toggle.'
            )
            .addButton((button) => {
                button.setButtonText('Add Command').onClick(() => {
                    new CommandSuggester(this.plugin, 'page').open();
                });
            });

        if (this.app.plugins.plugins['pane-relief']) {
            new Setting(containerEl)
                .setName('Pane Relief count')
                .setDesc(
                    'Enable to show the pane relief history count next to back/forward buttons.'
                )
                .addToggle((toggle) => {
                    toggle
                        .setValue(settings.paneRelief)
                        .onChange(async (state) => {
                            settings.paneRelief = state;
                            await this.plugin.saveSettings();
                        });
                });
        }

        new Setting(containerEl)
            .setName(`Button spacing`)
            .setDesc('Set the spacing for Page Header buttons.')
            .addButton((b) => {
                b.setButtonText(
                    'Click to go to the Style settings. Requires the Style settings plugin.'
                );
                b.onClick((e) =>
                    this.app.setting.openTabById('obsidian-style-settings')
                );
            });

        for (let i = 0; i < settings.enabledButtons.length; i++) {
            let command = settings.enabledButtons[i];
            const iconDiv = createDiv({ cls: 'CS-settings-icon' });
            setIcon(iconDiv, command.icon, 24);
            let setting = new Setting(containerEl).setName(command.name);
            if (settings.desktop) {
                setting.addDropdown((dropdown) => {
                    dropdown
                        .addOption(
                            'both',
                            'Add button for both mobile and desktop.'
                        )
                        .addOption('mobile', 'Add button only for mobile.')
                        .addOption('desktop', 'Add button only for desktop.')
                        .setValue(command.showButtons)
                        .onChange(
                            //@ts-ignore
                            async (newValue: Buttons) => {
                                command.showButtons = newValue;
                                settings.enabledButtons[i] = command;
                                await this.plugin.saveSettings();
                                if (
                                    newValue === 'desktop' &&
                                    Platform.isMobile
                                ) {
                                    removePageHeaderButton(command.id);
                                } else if (
                                    newValue === 'mobile' &&
                                    Platform.isDesktop
                                ) {
                                    removePageHeaderButton(command.id);
                                }
                            }
                        );
                });
            }
            if (i > 0) {
                setting.addExtraButton((button) => {
                    button
                        .setIcon('up-arrow-with-tail')
                        .setTooltip('Move button to the left')
                        .onClick(async () => {
                            settings.enabledButtons[i] =
                                settings.enabledButtons[i - 1];
                            settings.enabledButtons[i - 1] = command;
                            await this.plugin.saveSettings();
                            this.display();
                        });
                });
            }
            if (i < settings.enabledButtons.length - 1) {
                setting.addExtraButton((button) => {
                    button
                        .setIcon('down-arrow-with-tail')
                        .setTooltip('Move button to the right')
                        .onClick(async () => {
                            settings.enabledButtons[i] =
                                settings.enabledButtons[i + 1];
                            settings.enabledButtons[i + 1] = command;
                            await this.plugin.saveSettings();
                            this.display();
                        });
                });
            }
            setting
                .addExtraButton((button) => {
                    button
                        .setIcon('trash')
                        .setTooltip('Remove Command')
                        .onClick(async () => {
                            settings.enabledButtons.remove(command);
                            removePageHeaderButton(command.id);
                            await this.plugin.saveSettings();
                            this.display();
                        });
                })
                .addExtraButton((button) => {
                    button
                        .setIcon('gear')
                        .setTooltip('Edit Icon')
                        .onClick(() => {
                            const index = settings.enabledButtons.findIndex(
                                (el) => el === command
                            );
                            new IconPicker(
                                this.plugin,
                                command,
                                'page',
                                index
                            ).open();
                        });
                });
            setting.nameEl.prepend(iconDiv);
            setting.nameEl.addClass('CS-flex');
        }

        if (Platform.isDesktopApp) {
            containerEl.createEl('br');
            containerEl.createEl('h3', {
                text: 'Titlebar buttons',
            });

            containerEl.createEl('h4', {
                text: 'Left titlebar',
            });

            new Setting(containerEl)
                .setName('Add Button')
                .setDesc('Add a new button right to the back/forward buttons.')
                .addButton((button) => {
                    button.setButtonText('Add Command').onClick(() => {
                        new CommandSuggester(this.plugin, 'title-left').open();
                    });
                });

            for (let i = 0; i < settings.titleLeft.length; i++) {
                let command = settings.titleLeft[i];
                const iconDiv = createDiv({ cls: 'CS-settings-icon' });
                setIcon(iconDiv, command.icon, 24);
                let setting = new Setting(containerEl).setName(command.name);
                if (i > 0) {
                    setting.addExtraButton((button) => {
                        button
                            .setIcon('up-arrow-with-tail')
                            .setTooltip('Move button to the left')
                            .onClick(async () => {
                                settings.titleLeft[i] =
                                    settings.titleLeft[i - 1];
                                settings.titleLeft[i - 1] = command;
                                await this.plugin.saveSettings();
                                for (let j = 0; j < this.plugin.windows.length; j++) {
                                    removeLeftTitleBarButtons(this.plugin.windows[j]);
                                    this.plugin.addLeftTitleBarButtons(this.plugin.windows[j])
                                }
                                this.display();
                            });
                    });
                }
                if (i < settings.titleLeft.length - 1) {
                    setting.addExtraButton((button) => {
                        button
                            .setIcon('down-arrow-with-tail')
                            .setTooltip('Move button to the right')
                            .onClick(async () => {
                                settings.titleLeft[i] =
                                    settings.titleLeft[i + 1];
                                settings.titleLeft[i + 1] = command;
                                await this.plugin.saveSettings();
                                for (let j = 0; j < this.plugin.windows.length; j++) {
                                    removeLeftTitleBarButtons(this.plugin.windows[j]);
                                    this.plugin.addLeftTitleBarButtons(this.plugin.windows[j])
                                }
                                this.display();
                            });
                    });
                }
                setting
                    .addExtraButton((button) => {
                        button
                            .setIcon('trash')
                            .setTooltip('Remove Command')
                            .onClick(async () => {
                                settings.titleLeft.remove(command);
                                await this.plugin.saveSettings();
                                for (let j = 0; j < this.plugin.windows.length; j++) {
                                    removeLeftTitleBarButton(command.id, this.plugin.windows[j]);
                                }
                                this.display();
                            });
                    })
                    .addExtraButton((button) => {
                        button
                            .setIcon('gear')
                            .setTooltip('Edit Icon')
                            .onClick(() => {
                                const index = settings.titleLeft.findIndex(
                                    (el) => el === command
                                );
                                new IconPicker(
                                    this.plugin,
                                    command,
                                    'title-left',
                                    index
                                ).open();
                                for (let j = 0; j < this.plugin.windows.length; j++) {
                                    removeLeftTitleBarButtons(this.plugin.windows[j]);
                                    this.plugin.addLeftTitleBarButtons(this.plugin.windows[j])
                                }
                            });
                    });
                setting.nameEl.prepend(iconDiv);
                setting.nameEl.addClass('CS-flex');
            }

            containerEl.createEl('h4', {
                text: 'Right titlebar',
            });

            new Setting(containerEl)
                .setName('Add Button')
                .setDesc(
                    'Add a new button left to the minimize/maximize/close buttons.'
                )
                .addButton((button) => {
                    button.setButtonText('Add Command').onClick(() => {
                        new CommandSuggester(this.plugin, 'title-right').open();
                    });
                });

            for (let i = 0; i < settings.titleRight.length; i++) {
                let command = settings.titleRight[i];
                const iconDiv = createDiv({ cls: 'CS-settings-icon' });
                setIcon(iconDiv, command.icon, 24);
                let setting = new Setting(containerEl).setName(command.name);
                if (i > 0) {
                    setting.addExtraButton((button) => {
                        button
                            .setIcon('up-arrow-with-tail')
                            .setTooltip('Move button to the left')
                            .onClick(async () => {
                                settings.titleRight[i] =
                                    settings.titleRight[i - 1];
                                settings.titleRight[i - 1] = command;
                                await this.plugin.saveSettings();
                                for (let j = 0; j < this.plugin.windows.length; j++) {
                                    removeRightTitleBarButtons(this.plugin.windows[j]);
                                    this.plugin.addRightTitleBarButtons(this.plugin.windows[j])
                                }
                                this.display();
                            });
                    });
                }
                if (i < settings.titleRight.length - 1) {
                    setting.addExtraButton((button) => {
                        button
                            .setIcon('down-arrow-with-tail')
                            .setTooltip('Move button to the right')
                            .onClick(async () => {
                                settings.titleRight[i] =
                                    settings.titleRight[i + 1];
                                settings.titleRight[i + 1] = command;
                                await this.plugin.saveSettings();
                                for (let j = 0; j < this.plugin.windows.length; j++) {
                                    removeRightTitleBarButtons(this.plugin.windows[j]);
                                    this.plugin.addRightTitleBarButtons(this.plugin.windows[j])
                                }
                                this.display();
                            });
                    });
                }
                setting
                    .addExtraButton((button) => {
                        button
                            .setIcon('trash')
                            .setTooltip('Remove Command')
                            .onClick(async () => {
                                settings.titleRight.remove(command);
                                await this.plugin.saveSettings();
                                for (let j = 0; j < this.plugin.windows.length; j++) {
                                    removeRightTitleBarButton(command.id, this.plugin.windows[j]);
                                }
                                this.display();
                            });
                    })
                    .addExtraButton((button) => {
                        button
                            .setIcon('gear')
                            .setTooltip('Edit Icon')
                            .onClick(() => {
                                const index = settings.titleRight.findIndex(
                                    (el) => el === command
                                );
                                new IconPicker(
                                    this.plugin,
                                    command,
                                    'title-right',
                                    index
                                ).open();
                                for (let j = 0; j < this.plugin.windows.length; j++) {
                                    removeRightTitleBarButtons(this.plugin.windows[j]);
                                    this.plugin.addRightTitleBarButtons(this.plugin.windows[j])
                                }
                            });
                    });
                setting.nameEl.prepend(iconDiv);
                setting.nameEl.addClass('CS-flex');
            }

            containerEl.createEl('h4', {
                text: 'Center titlebar',
            });

            new Setting(containerEl)
                .setName('Add Button')
                .setDesc('Add a new button to the center titlebar.')
                .addButton((button) => {
                    button.setButtonText('Add Command').onClick(() => {
                        new CommandSuggester(
                            this.plugin,
                            'title-center'
                        ).open();
                    });
                });

            for (let i = 0; i < settings.titleCenter.length; i++) {
                let command = settings.titleCenter[i];
                const iconDiv = createDiv({ cls: 'CS-settings-icon' });
                setIcon(iconDiv, command.icon, 24);
                let setting = new Setting(containerEl).setName(command.name);
                if (i > 0) {
                    setting.addExtraButton((button) => {
                        button
                            .setIcon('up-arrow-with-tail')
                            .setTooltip('Move button to the left')
                            .onClick(async () => {
                                settings.titleCenter[i] =
                                    settings.titleCenter[i - 1];
                                settings.titleCenter[i - 1] = command;
                                await this.plugin.saveSettings();
                                for (let j = 0; j < this.plugin.windows.length; j++) {
                                    removeCenterTitleBarButtons(this.plugin.windows[j]);
                                    this.plugin.addCenterTitleBarButtons(this.plugin.windows[j])
                                }
                                this.display();
                            });
                    });
                }
                if (i < settings.titleCenter.length - 1) {
                    setting.addExtraButton((button) => {
                        button
                            .setIcon('down-arrow-with-tail')
                            .setTooltip('Move button to the right')
                            .onClick(async () => {
                                settings.titleCenter[i] =
                                    settings.titleCenter[i + 1];
                                settings.titleCenter[i + 1] = command;
                                await this.plugin.saveSettings();
                                for (let j = 0; j < this.plugin.windows.length; j++) {
                                    removeCenterTitleBarButtons(this.plugin.windows[j]);
                                    this.plugin.addCenterTitleBarButtons(this.plugin.windows[j])
                                }
                                this.display();
                            });
                    });
                }
                setting
                    .addExtraButton((button) => {
                        button
                            .setIcon('trash')
                            .setTooltip('Remove Command')
                            .onClick(async () => {
                                settings.titleCenter.remove(command);
                                await this.plugin.saveSettings();
                                if (
                                    this.plugin.settings.titleCenter.length ===
                                    0
                                ) {
                                    for (let i = 0; i < this.plugin.windows.length; i++) {
                                        restoreCenterTitlebar(this.plugin.titlebarText[i], this.plugin.windows[i])
                                    }
                                } else {
                                    for (let j = 0; j < this.plugin.windows.length; j++) {
                                        removeCenterTitleBarButton(command.id, this.plugin.windows[j]);
                                    }
                                }
                                this.display();
                            });
                    })
                    .addExtraButton((button) => {
                        button
                            .setIcon('gear')
                            .setTooltip('Edit Icon')
                            .onClick(() => {
                                const index = settings.titleCenter.findIndex(
                                    (el) => el === command
                                );
                                new IconPicker(
                                    this.plugin,
                                    command,
                                    'title-center',
                                    index
                                ).open();
                            });
                    });
                setting.nameEl.prepend(iconDiv);
                setting.nameEl.addClass('CS-flex');
            }
        }
    }
}

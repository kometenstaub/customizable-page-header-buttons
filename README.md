# ~~Customizable Page Header and Title Bar Obsidian Plugin~~ Discontinued, please use the Commander plugin

This plugin lets you add buttons that execute commands to page header in the mobile (and desktop, off by default) app.

It lets you choose from all commands and configure their icons. You can set icons from the core and lucide icons.

If you enable desktop compatibility, it will also let you configure buttons to be shown on both mobile and desktop, only desktop or only mobile.

On desktop, you can also add buttons to the title bar. You can add them to the left or right side and even exchange the center version text with buttons.

If you use **Pane Relief**, you can toggle whether to show the forward/backwards history count when you're adding back/forward buttons.

![pane-relief-history-count](https://raw.githubusercontent.com/kometenstaub/customizable-page-header-buttons/main/resources/pane-relief.png)

![back-forward-settings](https://raw.githubusercontent.com/kometenstaub/customizable-page-header-buttons/main/resources/back-forward-settings.png)

Thank you to @pjeby for supporting this in Pane Relief.

## Known limitations

This plugin uses an internal API for showing the commands. That means for example that if some commands only work in edit mode, the last active pane before entering settings has to be in edit mode, otherwise you will not be able to select that command.


## Example configuration

![Example configuration](https://raw.githubusercontent.com/kometenstaub/customizable-page-header-buttons/main/resources/customizable-page-header.jpg)

## Example settings

![Settings picture](https://raw.githubusercontent.com/kometenstaub/top-bar-buttons/main/resources/settings.png)

## Credits

Shoutout to [@phibr0](https://github.com/phibr0) for his awesome work on the [Customizable Sidebar Plugin](https://github.com/phibr0/obsidian-customizable-sidebar). The code that powers this plugins' settings (adding/removing commands/changing icons) is powered by an adapted version of his code.

Thanks to @pjeby the buttons auto-refresh on setting change and at startup. It will also tell Pane Relief when buttons changed so that title tooltips for the back/forward history count can, if needed, be updated and all the leaves will be populated when the workspace is changed (using monkey-around, which ISC-licensed).


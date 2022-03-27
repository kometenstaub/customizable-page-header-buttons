# Customizable Page Header and Title Bar Obsidian Plugin

This plugin lets you add buttons that execute commands to page header in the mobile (and desktop, off by default) app.

It lets you choose from all commands and configure their icons. You can set icons from the core and lucide icons.

If you enable desktop compatibility, it will also let you configure buttons to be shown on both mobile and desktop, only desktop or only mobile.

As of v4.0.0, you can also add buttons to the title bar. You can add them to the left or right side and even exchange the center version text with buttons.


## CSS snippet for Pane Relief count

If you use pane relief and add back/forward buttons to the page header, you can add the count like this:

```css
/* Pane relief count */

:not(.is-mobile) .view-action.page-header-button.app\:go-back::before {
    content: var(--pane-relief-backward-count);
    padding-right: 0.4em;
    font-size: 0.95em;
    vertical-align: text-top;
    line-height: 1;
}

:not(.is-mobile) .view-action.page-header-button.app\:go-forward::after {
    content: var(--pane-relief-forward-count);
    padding-left: 0.4em;
    font-size: 0.95em;
    vertical-align: text-top;
    line-height: 1;
}

:not(.is-mobile) body:not(.no-svg-replace) svg.left-arrow-with-tail {
    vertical-align: top;
}
:not(.is-mobile) body:not(.no-svg-replace) svg.right-arrow-with-tail {
    vertical-align: top;
}

:not(.is-mobile) .view-actions {
    align-items: center;
}

```

Depending on your theme, it may need some adjustment.

## Known limitations

This plugin uses an internal API for showing the commands. That means for example that if some commands only work in edit mode, the last active pane before entering settings has to be in edit mode, otherwise you will not be able to select that command.


## Example configuration

![Example configuration](https://raw.githubusercontent.com/kometenstaub/customizable-page-header-buttons/main/resources/customizable-page-header.jpg)

## Example settings

![Settings picture](https://raw.githubusercontent.com/kometenstaub/top-bar-buttons/main/resources/settings.png)

## Credits

Shoutout to [@phibr0](https://github.com/phibr0) for his awesome work on the [Customizable Sidebar Plugin](https://github.com/phibr0/obsidian-customizable-sidebar). The code that powers this plugins' settings (adding/removing commands/changing icons) is powered by an adapted version of his code.

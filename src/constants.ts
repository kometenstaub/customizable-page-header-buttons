import type { InternalCommands } from './interfaces';

export const idToNameAndIcon: InternalCommands = {
    'audio-recorder:start': {
        name: 'Audio recorder: Start recording audio',
        icon: 'play-audio-glyph',
    },
    'audio-recorder:stop': {
        name: 'Audio recorder: Stop recording audio',
        icon: 'stop-audio-glyph',
    },
    'backlink:open': {
        name: 'Backlinks: Show backlinks pane',
        icon: 'link-glyph',
    },
    'backlink:open-backlinks': {
        name: 'Backlinks: Open backlinks for the current file',
        icon: 'link-glyph',
    },
    'backlink:toggle-backlinks-in-document': {
        name: 'Backlinks: Toggle backlinks in document',
        icon: 'link-glyph',
    },
    'command-palette:open': {
        name: 'Command palette: Open command palette',
        icon: 'command-glyph',
    },
    'daily-notes': {
        name: "Daily notes: Open today's daily note",
        icon: 'calendar-glyph',
    },
    'daily-notes:goto-prev': {
        name: 'Daily notes: Open previous daily note',
        icon: 'yesterday-glyph',
    },
    'daily-notes:goto-next': {
        name: 'Daily notes: Open next daily note',
        icon: 'tomorrow-glyph',
    },
    'file-explorer:open': {
        name: 'File explorer: Show file explorer',
        icon: 'file-explorer-glyph',
    },
    'file-explorer:reveal-active-file': {
        name: 'File explorer: Reveal active file in navigation',
        icon: 'navigate-glyph',
    },
    'file-explorer:move-file': {
        name: 'File explorer: Move file to another folder',
        icon: 'paper-plane-glyph',
    },
    'file-recovery:open': {
        name: 'File recovery: Open saved snapshots',
        icon: 'restore-file-glyph',
    },
    'global-search:open': {
        name: 'Search: Search in all files',
        icon: 'search-glyph',
    },
    'graph:open': { name: 'Graph view: Open graph view', icon: 'graph-glyph' },
    'graph:open-local': {
        name: 'Graph view: Open local graph',
        icon: 'graph-glyph',
    },
    'graph:animate': {
        name: 'Graph view: Start graph timelapse animation',
        icon: 'wand-glyph',
    },
    'markdown-importer:open': {
        name: 'Markdown format importer: Open Markdown importer',
        icon: 'import-glyph',
    },
    'note-composer:merge-file': {
        name: 'Note composer: Merge current file with another file...',
        icon: 'merge-files-glyph',
    },
    'note-composer:split-file': {
        name: 'Note composer: Extract current selection...',
        icon: 'scissors-glyph',
    },
    'note-composer:extract-heading': {
        name: 'Note composer: Extract this heading...',
        icon: 'split',
    },
    'open-with-default-app:open': {
        name: 'Open in default app: Open in default app',
        icon: 'open-elsewhere-glyph',
    },
    'open-with-default-app:show': {
        name: 'Open in default app: Show in system explorer',
        icon: 'file-explorer-glyph',
    },
    'outgoing-links:open': {
        name: 'Outgoing Links: Show outgoing links pane',
        icon: 'link-glyph',
    },
    'outgoing-links:open-for-current': {
        name: 'Outgoing Links: Open outgoing links for the current file',
        icon: 'link-glyph',
    },
    'outline:open': {
        name: 'Outline: Show outline pane',
        icon: 'bullet-list-glyph',
    },
    'outline:open-for-current': {
        name: 'Outline: Open outline of the current file',
        icon: 'bullet-list-glyph',
    },
    'publish:view-changes': {
        name: 'Publish: Publish changes',
        icon: 'paper-plane-glyph',
    },
    'random-note': {
        name: 'Random note: Open random note',
        icon: 'dice-glyph',
    },
    'slides:start': {
        name: 'Slides: Start presentation',
        icon: 'presentation-glyph',
    },
    'starred:open': { name: 'Starred: Show starred pane', icon: 'star-glyph' },
    'starred:star-current-file': {
        name: 'Starred: Star/unstar current file',
        icon: 'star-glyph',
    },
    'switcher:open': {
        name: 'Quick switcher: Open quick switcher',
        icon: 'navigate-glyph',
    },
    'tag-pane:open': {
        name: 'Tag pane: Show tag pane',
        icon: 'price-tag-glyph',
    },
    'insert-template': {
        name: 'Templates: Insert template',
        icon: 'duplicate-glyph',
    },
    'insert-current-date': {
        name: 'Templates: Insert current date',
        icon: 'calendar-glyph',
    },
    'insert-current-time': {
        name: 'Templates: Insert current time',
        icon: 'clock-glyph',
    },
    'workspaces:load': {
        name: 'Workspaces: Load workspace',
        icon: 'workspace-glyph',
    },
    'workspaces:save-and-load': {
        name: 'Workspaces: Save and load another workspace',
        icon: 'workspace-glyph',
    },
    'workspaces:open-modal': {
        name: 'Workspaces: Manage workspaces',
        icon: 'workspace-glyph',
    },
    'zk-prefixer': {
        name: 'Zettelkasten prefixer: Create new Zettelkasten note',
        icon: 'box-glyph',
    },
};

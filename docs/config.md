# configuration json

Configuration read errors are logged to the console, unknown values
are ignored (use it to "comment out" keys), merging with builtin config is **shallow**.

```jsonc
{
  // themes:
  // - default: a dark theme with lime colored highlights
  // - ambiance: ubuntu-like dark brown and orange colors
  "theme": "default",

  // main window width
  "winWidth": 800,

  // fluxbox menu file location, you can disable parsing with an explicit `false`
  "fluxboxMenuFile": "~/.fluxbox/menu",

  // you can explicitly disable the path parsing with `true`, mostly for debugging
  // but this will render the exec input field useless
  "skipPathParsing": false,

  // start with a borderless window?
  "borderlessWindow": false,

  // show the main window on startup?
  "showOnStartup": false,

  // auto center window position on show?
  "centerOnShow": true,

  // window show timeout in msec, to avoid the initial blink caused by the unpainted white bg
  "paintDelay": 0,

  // do not center by default, use fixed coords (in case auto centering/resizing fails)
  // examples: `[]`, `[100, 50]`, `null` or `undefined`
  "fixPosition": [200, 100],

  // change the resize values, width and height (in case auto resizing fails)
  // examples: `[]`, `[0, -3]` (subtracts 3 pixels from the new height), `null` or `undefined`
  "modifyResize": [0, -3],

  // auto select text in the search field after a successful launch and reopen?
  "autoSelectAll": true,

  // tray icon size; `small` = 16x16, `large` = 64x64 (will use the selected png from assets)
  "trayIconSize": "large",

  // window toggle key, see electron launcher keys at https://www.electronjs.org/docs/api/accelerator
  "toggleKey": ["Super+`", "CmdOrCtrl+Alt+Shift+`"],

  // all words separated by this string are used in an AND relation for searching
  "logicalAndSeparator": " ",

  // gnome .desktop files' location, this is only used for a basic "is desktop executable" detection
  // (while checking executables on the path), this is NOT for launching .desktop files
  "desktopFilesLocation": "/usr/share/applications/",

  // files included in the search, array of regex strings
  "includeFiles": ["\\.(txt|md|html|docx|pdf|jpe?g|png|avi|mkv|mp4)$"],

  // files excluded from the search
  "excludeFiles": ["^\\._"],

  // directories excluded from the search
  "excludedDirs": ["^node_modules$", "^\\."],

  // exclude hidden and system files (Windows), NOT YET SUPPORTED
  "excludeHidSys": true,

  // terminal command for the "launchInTerminal" shortcut
  "terminalCommand": "gnome-terminal -- %CMD%",

  // words that can be used in the "app" input field
  "appShortcuts": {
    "showItemInFolder": "F",
    "launchInTerminal": "T"
  },

  // override system default applications, executables must have a full path or be on the path
  "openWith": {
    "\\.(txt|md)$": "code"
  },

  // directories to index, home "~" marker is supported
  "directories": ["~/Downloads", "~/Pictures", "~/Videos"]
}
```

## examples

### linux mint cinnamon

```json
{
  "theme": "aquamint",
  "showOnStartup": true,
  "borderlessWindow": true,
  "trayIconSize": "large",
  "toggleKey": ["Super+Shift+space"],
  "openWith": {
    "\\.(txt|md)$": "xed"
  },
  "centerOnShow": false,
  "fixPosition": [275, 350],
  "modifyResize": [0, -3],
  "paintDelay": 300,
  "fluxboxMenuFile": false,
  "directories": ["~/Downloads", "~/Videos", "~/Nextcloud/Documents"]
}
```

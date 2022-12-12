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

  // fluxbox menu file location
  "fluxboxMenuFile": "~/.fluxbox/menu",

  // start with a borderless window?
  "borderlessWindow": false,

  // show the main window on startup?
  "showOnStartup": false,

  // auto center window position on show?
  "centerOnShow": true,

  // do not center by default, use fixed coords (in case auto centering/resizing fails)
  // examples: `[]`, `[100, 50]`, `null` or `undefined`
  "fixPosition": [200, 100],

  // auto select text in the search field after a successful launch and reopen?
  "autoSelectAll": true,

  // tray icon size; `small` = 16x16, `large` = 64x64 (will use the selected png from assets)
  "trayIconSize": "large",

  // window toggle key, see electron launcher keys at https://www.electronjs.org/docs/api/accelerator
  "toggleKey": ["Super+`", "CmdOrCtrl+Alt+Shift+`"],

  // all words separated by this string are used in an AND relation for searching
  "logicalAndSeparator": " ",

  // gnome .desktop files' location, can be a string or string[], disable it with null or undefined
  // examples: `["/usr/share/applications/", "~/.local/share/applications"]`, `[]`, `null`
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

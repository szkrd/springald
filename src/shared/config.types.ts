// Configuration read errors are logged to the console, unknown values
// are ignored (use it to "comment out" keys), merging with builtin config is **shallow**.

export interface IAppConfig {
  /**
   * Themes:
   * - `default`: a dark theme with lime colored highlights
   * - `ambiance`: ubuntu-like dark brown and orange colors
   */
  theme: 'default' | 'ambiance' | 'aquamint';

  /**
   * Main window width
   * Default is **800** pixels.
   */
  winWidth: number;

  /**
   * Fluxbox menu file location, you can disable parsing with an explicit `false`.
   * Default is **"~/.fluxbox/menu"**.
   */
  fluxboxMenuFile: string | false;

  /**
   * Start with a borderless window? `false` may cause height problems on Windows.
   * Default is **true**.
   */
  borderlessWindow: boolean;

  /**
   * Do not center by default, use fixed coords (in case auto centering/resizing fails).
   *
   * Examples: `[]`, `[100, 50]`, `null` or `undefined`
   */
  fixPosition: [number, number];

  /**
   * change the resize values, width and height (in case auto resizing fails)
   * examples: `[]`, `[0, -3]`
   * (subtracts 3 pixels from the new height), `null` or `undefined`
   */
  modifyResize: [number, number];

  /**
   * Window show timeout in msec, to avoid the initial blink caused by the unpainted white bg.
   * Default is **0**.
   */
  paintDelay: number;

  /**
   * Show the main window on startup?
   * Default is **false**.
   */
  showOnStartup: boolean;

  /**
   * Auto center window position on show.
   * Default is **true**.
   */
  centerOnShow: boolean;

  /**
   * auto select text in the search field after a successful launch and reopen?
   */
  autoSelectAll: boolean;

  /**
   * tray icon size; `small` = 16x16, `large` = 64x64 (will use the selected png from assets)
   */
  trayIconSize: 'small' | 'large';

  /**
   * Window toggle key, see electron launcher keys at https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts#accelerators
   * Modifiers are: `Cmd`, `Ctrl`, `CmdOrCtrl`, `Alt`, `Option`, `AltGr`, `Shift`, `Super`.
   *
   * Example: `["Super+x", "CmdOrCtrl+Alt+Shift+x"]`
   */
  toggleKey: string[];

  /**
   * All words separated by this string are used in an AND relation for searching.
   * Default is **" "** (space).
   */
  logicalAndSeparator: string;

  /**
   * gnome .desktop files' location, this is only used for a basic "is desktop executable"
   * detection (while checking executables on the path), this is NOT for launching .desktop files
   */
  desktopFilesLocation: string;

  /**
   * files included in the search, array of regex strings
   *
   * Example: `["\\.(txt|md|html|docx|pdf|jpe?g|png|avi|mkv|mp4)$"]`
   */
  includeFiles: string[];

  /**
   * files excluded from the search
   *
   * Example: `["^\\._"]`
   */
  excludeFiles: string[];

  /**
   * Directories excluded from the search.
   *
   * Example: `["^node_modules$", "^\\."]`
   */
  excludedDirs: string[];

  /**
   * Exclude hidden and system files (Windows),
   * **NOT YET IMPLEMENTED**
   */
  excludeHidSys: boolean;

  /**
   * You can explicitly disable the path parsing (for executables) with `true`, this is mostly for debugging;
   * note that this will render the exec input field useless
   */
  skipPathParsing: boolean;

  /**
   * Terminal command template, you have to escape it yourself if it has spaces in the path.
   * This is the command for the "launchInTerminal" appShortcut.
   *
   * Exmaple: `"gnome-terminal -- %CMD%"`
   */
  terminalCommand: string;

  /**
   * Words that can be used in the "app" input field.
   */
  appShortcuts: {
    /** Default: **"F"**, shell open in file manager. */
    showItemInFolder: string;
    /** Default: **"T"**, see: `terminalCommand`. */
    launchInTerminal: string;
  };

  /**
   * Override system default applications, executables must have a full path or be on the path.
   *
   * Example: `{ "\\.(txt|md)$": "code" }`
   */
  openWith: Record<string, string>;

  /**
   * Override the launched executable's parameters (by default it's the filename with its full path)
   * (path + name = command); valid replacables: %PATH%, %NAME%, %COMMAND%, %TYPE%, %ID%
   *
   * Example: `{ "gtk-launch": "%NAME%" }`
   */
  openWithParams: Record<string, string>;

  /**
   * Directories to index, home "~" marker is supported.
   */
  directories: string[];

  /**
   * Dumb feature flag switch for development.
   */
  betaFeatures: boolean;

  // INTERNAL CONFIG VALUES
  // ----------------------

  /** **Internal**: set from argv using `--development` or `-d` */
  development: boolean;

  /** **Internal**: same as in nwjs (~/.config/appName) */
  dataPath: string;
}

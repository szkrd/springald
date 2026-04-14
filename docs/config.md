## config examples

### linux mint cinnamon

```json
{
  "theme": "aquamint",
  "showOnStartup": true,
  "borderlessWindow": true,
  "trayIconSize": "large",
  "toggleKey": ["Super+Shift+space"],
  "openWith": {
    "\\.(txt|md)$": "xed",
    "\\.(desktop)$": "gtk-launch"
  },
  "openWithParams": {
    "gtk-launch": "%NAME%"
  },
  "centerOnShow": false,
  "fixPosition": [275, 350],
  "modifyResize": [0, -3],
  "paintDelay": 300,
  "fluxboxMenuFile": false,
  "includeFiles": ["\\.(txt|md|html|docx|pdf|jpe?g|png|desktop)$"],
  "directories": [
    "~/Downloads",
    "~/Videos",
    "~/Nextcloud/Documents",
    "/usr/share/applications/",
    "~/.local/share/applications/"
  ]
}
```

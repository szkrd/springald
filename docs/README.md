# Notes

## Debugging, development

- use nw **sdk build**
- web context logs: **f12** to open dev toolbar
- node context logs: in app, context menu, **"Inspect background page"**  
  (visible in stderr too, but stack trace is in the chromium debugger above)
- in dev mode the application window will be shown right after startup
- do **not** press reload in the debugger console, do **not** use reload page, do **not** use simulate restart
- use **ctrl+R** to do a proper teardown and then a "page" reload
- you may want to assign **socket reload** to a hotkey in your desktop environment
- in dev mode the unix socket will be deleted on startup (since nwjs has no reliable exit hook,
  ctrl+C (in the terminal) SIGINT may kill the app before the teardown can finish)

### context

Only main.js has proper access to the dom, so the `context` (in _context.js_) is an in memory shared object to access window, document, gui, app etc. from outside the "main gui area".

# Notes

## Debugging, development

- use nw **sdk build**
- web context logs: **f12** to open dev toolbar
- node context logs: in app, context menu, **"Inspect background page"**  
  (visible in stderr too, but stack trace is in the chromium debugger above)
- use `showOnStartup` in the config, which makes "reload app" (in the context menu) pretty helpful
- do not press reload in the debugger console
- in dev mode the unix socket will be deleted on startup (since nwjs has no reliable exit hook, ctrl+c SIGINT may kill the app before the proper teardown can finish)

### context

Only main.js has proper access to the dom, so the `context` (in _context.js_) is an in memory shared object to access window, document, gui, app etc. from outside the "main gui area".

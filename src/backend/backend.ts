// BACKEND
// =======
//
// - This is the electron main thread.
// - Entry point is defined in _package.json_
// - Initial config parsing is here for convenience.
// - Window and tray handling **must be** here though
// - You access backend functionality through electron ipc sync messages
//   (electron ipc is just a wrapper around a node EventEmitter).
// - Some messages handled by the backend: `getConfig`, `resizeWindow`, `centerWindow` etc.
//
import { app } from 'electron';
import { log } from '../shared/log';
import { initBackend } from './initBackend';

app
  .whenReady()
  .then(initBackend)
  .catch((error) => {
    log.error(error);
    if (error.alreadyRunning) {
      app.quit();
    }
  });

// BACKEND
// =======
//
// - This is the electron main thread.
// - Here node works, `require` works.
// - Initial config parsing is here for convenience.
// - Window and tray handling **must be** here though; you access them through electron ipc sync messages
//   (electron ipc is just a wrapper around a node EventEmitter).
//
const { app } = require('electron');
const log = require('../interim/log');
const initBackend = require('./initBackend');

app
  .whenReady()
  .then(initBackend)
  .catch((error) => {
    log.error(error);
    if (error.alreadyRunning) app.quit();
  });

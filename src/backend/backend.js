// electron main process
const { app } = require('electron')
const log = require('../interim/log')
const initBackend = require('./initBackend')

app
  .whenReady()
  .then(initBackend)
  .catch((error) => {
    log.error(error)
    if (error.alreadyRunning) app.quit()
  })

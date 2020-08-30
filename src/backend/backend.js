// electron main process
const { app } = require('electron')
const initBackend = require('./initBackend')

app
  .whenReady()
  .then(initBackend)
  .catch((error) => {
    console.error(error)
    if (error.alreadyRunning) app.quit()
  })

const { app, ipcMain } = require('electron')
const getConfig = require('./getConfig')
const initTray = require('./initTray')
const messages = require('./messages')

let initialized = false
let backend // tray, config

function setupMessageListener() {
  ipcMain.on(messages.MSG_GET_CONFIG, (event, arg) => {
    console.log('msg', arg) // DELME
    event.returnValue = backend.config
  })
}

async function initBackend() {
  if (initialized) return backend
  const config = await getConfig(app.getPath('userData'))
  const tray = initTray()
  setupMessageListener()
  initialized = true
  backend = { config, tray }
  return backend
}

module.exports = initBackend

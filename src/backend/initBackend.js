const { app, ipcMain } = require('electron')
const getConfig = require('./getConfig')
const initTray = require('./initTray')
const parseAll = require('./parsing/parseAll')
const messages = require('./messages')

let initialized = false
let backend // tray, config

function setupMessageListener() {
  ipcMain.on(messages.MSG_GET_CONFIG, (event, arg) => {
    event.returnValue = backend.config
  })
}

async function initBackend() {
  if (initialized) return backend
  const config = await getConfig(app.getPath('userData'))
  const tray = initTray()
  const store = parseAll()
  setupMessageListener()
  initialized = true
  backend = { config, tray, store }
  return backend
}

module.exports = initBackend

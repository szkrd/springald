const { app } = require('electron')
const getConfig = require('./getConfig')
const initTray = require('./initTray')
const initWindow = require('./initWindow')
const parseAll = require('./parsing/parseAll')
const handleMessage = require('./utils/handleMesssage')
const messages = require('./messages')

let initialized = false
let backend // win, tray, config

function setupMessageListener() {
  handleMessage('MSG_GET_CONFIG', () => backend.config)

  handleMessage('MSG_RESIZE_WINDOW', (payload) => {
    backend.win.setSize(payload.width, payload.height)
  })
}

async function initBackend() {
  if (initialized) return backend
  const config = await getConfig(app.getPath('userData'))
  const tray = initTray()
  const store = parseAll()
  const win = initWindow()
  setupMessageListener()
  initialized = true
  backend = { config, tray, store, win }
  return backend
}

module.exports = initBackend

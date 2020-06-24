const { app } = require('electron')
const getConfig = require('./getConfig')
const initTray = require('./initTray')
const initWindow = require('./initWindow')
const initGlobalShortcuts = require('./initGlobalShortcuts')
const handleMessage = require('./modules/messages/handleMesssage')

let initialized = false
let backend // win, tray, config

function setupMessageListener() {
  handleMessage('MSG_GET_CONFIG', () => backend.config)

  handleMessage('MSG_RESIZE_WINDOW', (payload) => {
    backend.win.setSize(payload.width, payload.height)
  })

  handleMessage('MSG_TOGGLE_WINDOW', () => {
    backend.win.toggle()
  })

  handleMessage('MSG_OPEN_DEV_TOOLS', () => {
    backend.win.openDevTools()
  })
}

async function initBackend() {
  if (initialized) return backend
  const config = await getConfig(app.getPath('userData'))
  const tray = initTray()
  const store = {}
  const globalShortcuts = await initGlobalShortcuts()
  const win = await initWindow()
  backend = { config, tray, store, win, globalShortcuts }
  setupMessageListener()
  initialized = true
  return backend
}

module.exports = initBackend

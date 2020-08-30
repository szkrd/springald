const { app } = require('electron')
const getConfig = require('../interim/getConfig')
const initTray = require('./initTray')
const initWindow = require('./initWindow')
const initGlobalShortcuts = require('./initGlobalShortcuts')
const handleMessage = require('./modules/messages/handleMesssage')

let initialized = false
let backend // win, tray, config

function setupMessageListener() {
  handleMessage('MSG_QUIT', () => app.quit())
  handleMessage('MSG_GET_CONFIG', () => backend.config)
  handleMessage('MSG_REFRESH_CONFIG', getConfig.inject)

  handleMessage('MSG_RESIZE_WINDOW', (payload) => {
    backend.win.setSize(payload.width, payload.height)
  })

  handleMessage('MSG_TOGGLE_WINDOW', () => {
    backend.win.toggle()
  })

  handleMessage('MSG_CENTER_WINDOW', () => {
    backend.win.center()
  })

  handleMessage('MSG_TOGGLE_DEV_TOOLS', () => {
    backend.win.toggleDevTools()
  })
}

async function initBackend() {
  if (!app.requestSingleInstanceLock()) {
    throw Object.assign(new Error('Already running! This is a single instance app.'), {
      alreadyRunning: true,
    })
  }
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

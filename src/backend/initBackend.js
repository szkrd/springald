const { app } = require('electron')
const log = require('../interim/log')
const getConfig = require('../interim/getConfig')
const initTray = require('./initTray')
const initWindow = require('./initWindow')
const initGlobalShortcuts = require('./initGlobalShortcuts')
const handleMessage = require('./modules/messages/handleMesssage')

let initialized = false
let backend // win, tray, config

// fuck this shit, really; get position and set position fails before/after
// a resize, so the window slowly moves towards 0 0, maybe because
// of the non 1:1 desktop size I have, but I'm not sure (it doesn't
// happen in a vm, only on the "real" hardware (a thinkpad t480s)
function fixPosition() {
  const cfg = backend.config
  if (Array.isArray(cfg.fixPosition) && cfg.fixPosition.length === 2) {
    log.info(cfg.fixPosition)
    backend.win.setPosition(...cfg.fixPosition)
  }
}

// do NOT forget to set these message is messages.js
// along with a helpful comment about what it does
function setupMessageListener() {
  handleMessage('MSG_QUIT', () => app.quit())
  handleMessage('MSG_GET_CONFIG', () => backend.config)
  handleMessage('MSG_GET_LOG_BUFFER', () => log.getBuffer())
  handleMessage('MSG_REFRESH_CONFIG', getConfig.inject)

  handleMessage('MSG_RESIZE_WINDOW', (payload) => {
    backend.win.setSize(payload.width, payload.height)
    fixPosition()
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
  const tray = await initTray()
  const store = {}
  const globalShortcuts = await initGlobalShortcuts()
  const win = await initWindow()
  backend = { config, tray, store, win, globalShortcuts }
  setupMessageListener()
  initialized = true
  return backend
}

module.exports = initBackend

const { app } = require('electron')
const log = require('../interim/log')
const getConfig = require('../interim/getConfig')
const initTray = require('./initTray')
const initWindow = require('./initWindow')
const initGlobalShortcuts = require('./initGlobalShortcuts')
const handleMessage = require('./modules/messages/handleMesssage')
const isCoord = require('./utils/isCoord')

let initialized = false
let backend // win, tray, config

// fuck this shit, really; get position and set position fails before/after
// a resize, so the window slowly moves towards 0 0, maybe because
// of the non 1:1 desktop size I have, but I'm not sure (it doesn't
// happen in a vm, only on the "real" hardware (a thinkpad t480s)
function fixPosition() {
  const cfg = backend.config
  if (isCoord(cfg.fixPosition)) backend.win.setPosition(...cfg.fixPosition)
}

// just like fix position, "sometimes" on linux the height calculation
// is off by a couple of pixels and of course this doesn't happen in a vm
function fixSizing(obj) {
  const cfg = backend.config
  if (isCoord(cfg.modifyResize)) {
    obj.width += cfg.modifyResize[0]
    obj.height += cfg.modifyResize[1]
  }
  return obj
}

// do NOT forget to set these message is messages.js
// along with a helpful comment about what it does
function setupMessageListener() {
  handleMessage('MSG_QUIT', () => app.quit())
  handleMessage('MSG_GET_CONFIG', () => backend.config)
  handleMessage('MSG_GET_LOG_BUFFER', () => log.getBuffer())
  handleMessage('MSG_REFRESH_CONFIG', getConfig.inject)

  handleMessage('MSG_RESIZE_WINDOW', (payload) => {
    const { width, height } = fixSizing(payload)
    backend.win.setSize(width, height)
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

const { BrowserWindow } = require('electron')
const log = require('../interim/log')
const getConfig = require('../interim/getConfig')
const isCoord = require('./utils/isCoord')

class Window extends BrowserWindow {
  constructor(options) {
    super(options)
    this.hidden = !options.show
    if (this.hidden) {
      this.hide()
    }
  }

  hide() {
    super.hide()
    this.hidden = true
  }

  show() {
    super.show()
    this.hidden = false
  }

  toggle() {
    if (this.hidden) {
      this.show()
    } else {
      this.hide()
    }
  }

  openDevTools() {
    super.webContents.openDevTools({ mode: 'undocked' })
  }
}

async function initWindow() {
  const config = await getConfig()
  const isDev = config.development
  let position = {}
  const useFixedCoords = isCoord(config.fixPosition)
  if (useFixedCoords) {
    position = { x: config.fixPosition[0], y: config.fixPosition[1] }
  }
  let size = { width: config.winWidth, height: 40 }
  if (isCoord(config.modifyResize)) {
    size.width += config.modifyResize[0]
    size.height += config.modifyResize[1]
  }
  const win = new Window({
    ...size,
    ...position,
    show: false,
    frame: !config.borderlessWindow,
    resizable: true, // if you set to false, then resizing will be buggy!
    webPreferences: {
      // yes, new electron is new, probably this whole app will need some HUGE changes
      // see: https://github.com/electron/electron/blob/main/docs/tutorial/context-isolation.md
      contextIsolation: false,
      // another problem is that now we have no "require" (node module access) in the renderer
      // thread (changed around electron 5-ish), because that's a security risk (obviously),
      // but since this is pretty much a personal project with zero dependencies, I will ignore that...
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  })
  win.loadFile('index.html')
  win.setMenuBarVisibility(false)
  if (!useFixedCoords) win.center(config.centerOnShow)
  // TODO indicate problems without popping open the devtool?
  if (isDev || log.getWarningAndErrorCount() > 0) {
    win.openDevTools()
  }
  if (config.showOnStartup || isDev) {
    // the ready-to-show event did not really help
    if (config.paintDelay) setTimeout(() => win.show(), config.paintDelay)
    else win.show()
  }
  return win
}

module.exports = initWindow

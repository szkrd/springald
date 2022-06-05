const { BrowserWindow } = require('electron')
const log = require('../interim/log')
const getConfig = require('../interim/getConfig')

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
  const win = new Window({
    width: config.winWidth,
    height: 40,
    show: config.showOnStartup || isDev,
    frame: !config.borderlessWindow,
    resizable: true, // if you set to false, then resizing will be buggy!
    webPreferences: {
      nodeIntegration: true,
    },
  })
  win.loadFile('index.html')
  win.setMenuBarVisibility(false)
  win.center(config.centerOnShow)
  // TODO indicate problems without popping open the devtool?
  if (isDev || log.getWarningAndErrorCount() > 0) {
    win.openDevTools()
  }
  return win
}

module.exports = initWindow

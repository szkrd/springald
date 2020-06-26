const { BrowserWindow } = require('electron')
const getConfig = require('./getConfig')

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
    resizable: true, // if you set to false, then resizing will be buggy!
    webPreferences: {
      nodeIntegration: true,
    },
  })
  win.loadFile('index.html')
  win.setMenuBarVisibility(false)
  win.center(config.centerOnShow)
  if (isDev) {
    win.openDevTools()
  }
  return win
}

module.exports = initWindow

const { BrowserWindow } = require('electron')
const getConfig = require('./getConfig')

class Window extends BrowserWindow {
  constructor(options) {
    super(options)
    this.hidden = !options.show
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
    show: isDev,
    // resizable: true, will gnome let us programmatically resize?
    webPreferences: {
      nodeIntegration: true,
    },
  })
  win.loadFile('index.html')
  win.setMenuBarVisibility(false)
  if (isDev) {
    win.openDevTools()
  }
  return win
}

module.exports = initWindow

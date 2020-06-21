const { BrowserWindow } = require('electron')

function initWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 100,
    show: false,
    // resizable: true, will gnome let us programmatically resize?
    webPreferences: {
      nodeIntegration: true,
    },
  })
  win.setMenuBarVisibility(false)
  win.loadFile('index.html')
  win.webContents.openDevTools({ mode: 'undocked' })
  return win
}

module.exports = initWindow

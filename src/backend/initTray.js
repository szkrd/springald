const { Tray } = require('electron')

// TODO add menu items
//  see also: https://www.electronjs.org/docs/api/tray

let initialized = false
let tray

function initTray() {
  if (initialized) return tray
  tray = new Tray('assets/icon-16x16.png')
  tray.setToolTip('Springald')
  return tray
}

module.exports = initTray

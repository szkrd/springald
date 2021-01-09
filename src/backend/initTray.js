const { Menu, Tray } = require('electron')
const sendMessage = require('./modules/messages/sendMessage')

let initialized = false
let tray

function initTray() {
  if (initialized) return tray
  tray = new Tray('assets/icon-16x16.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'toggle window', type: 'normal', click: () => sendMessage('MSG_TOGGLE_WINDOW') },
    { label: 'quit', type: 'normal', click: () => sendMessage('MSG_QUIT') },
  ])
  tray.addListener('click', () => sendMessage('MSG_TOGGLE_WINDOW'))
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Springald')
  return tray
}

module.exports = initTray

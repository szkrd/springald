const { Menu, Tray } = require('electron')
const getConfig = require('../interim/getConfig')
const sendMessage = require('./modules/messages/sendMessage')

let initialized = false
let tray

async function initTray() {
  if (initialized) return tray
  const config = await getConfig()
  let iconFileName = 'icon-16x16.png'
  if (config.trayIconSize === 'large') iconFileName = 'icon-64x64.png'
  tray = new Tray('assets/' + iconFileName)
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

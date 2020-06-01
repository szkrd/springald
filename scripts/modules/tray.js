const tray = {}
let nwTray = null
let trayMenu = null
const trayMenuItems = []

/**
 * tray icon and right click menu
 * (the right click menu may not work though, see https://github.com/nwjs/nw.js/issues/6715)
 *
 * @public
 * @param toggle {function}  window toggle
 * @param gui                nw.gui
 */
tray.create = ({ toggle, gui }) => {
  nwTray = new nw.Tray({
    title: 'Tray',
    icon: 'assets/icon-16x16.png',
  })
  trayMenu = new nw.Menu()

  // quit
  const win = gui.Window.get()
  let item = new nw.MenuItem({
    type: 'normal',
    label: 'quit',
    click: () => {
      win.close()
    },
  })
  trayMenuItems.push(item)
  trayMenu.append(item)

  // toggle visibility
  item = new nw.MenuItem({
    type: 'normal',
    label: 'toggle',
    click: () => {
      toggle()
    },
  })
  trayMenuItems.push(item)
  trayMenu.append(item)

  nwTray.menu = trayMenu
  nwTray.on('click', toggle)
}

/**
 * tray teardown
 * @public
 */
tray.destroy = () => {
  nwTray.remove()
  nwTray = null
  trayMenuItems.forEach((item) => {
    trayMenu.remove(item)
  })
  trayMenu = null
}

module.exports = tray

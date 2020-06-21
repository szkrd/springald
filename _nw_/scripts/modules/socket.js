const os = require('os')
const net = require('net')

const socket = {}
let unixServer = null

const CMD_SHOW = 'show'
const CMD_HIDE = 'hide'
const CMD_TOGGLE = 'toggle'
const CMD_RELOAD = 'reload'
const CMD_QUIT = ['quit', 'close']

function isCommand(input = '', cmd = []) {
  if (typeof cmd === 'string') {
    cmd = [cmd]
  }
  return cmd.includes((input.toString() || '').trim())
}

/**
 * ipc interface setup; use `socat` to send simple messages to the application,
 * for example `echo toggle | socat UNIX:/tmp/springald.sock -`
 *
 * @public
 * @param show {function}    app show
 * @param hide {function}    app hide
 * @param toggle {function}  app toggle
 * @param reload {function}  app reload
 * @param config {Object}    config object
 * @param gui                nw.gui
 */
socket.create = ({ show, hide, toggle, reload, config, gui }) => {
  if (os.platform() !== 'linux') {
    return
  }
  unixServer = net.createServer((client) => {
    client.on('data', (data) => {
      if (isCommand(data, CMD_SHOW)) {
        show()
      } else if (isCommand(data, CMD_HIDE)) {
        hide()
      } else if (isCommand(data, CMD_TOGGLE)) {
        toggle()
      } else if (isCommand(data, CMD_RELOAD)) {
        reload()
      } else if (isCommand(data, CMD_QUIT)) {
        const win = gui.Window.get()
        win.close()
      }
    })
  })
  unixServer.listen(config.unixSocket)
}

/**
 * @public
 * @param callback {function}  on close function
 */
socket.destroy = (callback) => {
  if (!unixServer) {
    callback()
    return
  }
  unixServer.close(callback)
}

module.exports = socket

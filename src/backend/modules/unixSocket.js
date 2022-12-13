const os = require('os')
const net = require('net')

const unixSocket = {}
let unixServer = null

const SOCKET_NAME = '/tmp/springald.sock'
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
 */
unixSocket.create = ({ toggleWindow, refreshConfig, quit }) => {
  if (os.platform() !== 'linux') {
    return
  }
  unixServer = net.createServer((client) => {
    client.on('data', (data) => {
      if (isCommand(data, CMD_TOGGLE)) {
        toggleWindow()
      } else if (isCommand(data, CMD_RELOAD)) {
        refreshConfig()
      } else if (isCommand(data, CMD_QUIT)) {
        quit()
      }
    })
  })
  unixServer.listen(SOCKET_NAME)
}

unixSocket.destroy = (callback) => {
  if (!unixServer) {
    callback()
    return
  }
  unixServer.close(callback)
}

module.exports = unixSocket

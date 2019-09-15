const os = require('os')
const fs = require('fs')

// ctrl+c SIGINT sometimes aborts the app with the socket still in place
const socketFile = '/tmp/springald.sock'
if (os.platform() === 'linux') {
  try {
    if (fs.existsSync(socketFile)) {
      console.log('cleaning up socket file')
      fs.unlinkSync('/tmp/springald.sock')
    }
  } catch (e) {}
}

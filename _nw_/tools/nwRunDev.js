const os = require('os')
const fs = require('fs')
const { execFile } = require('child_process')
const printPrettyLogLine = require('./printPrettyLogLine')

// ctrl+c SIGINT sometimes aborts the app with the socket still in place
// so let's check if it exists and clean it up manually
const socketFile = '/tmp/springald.sock'
if (os.platform() === 'linux') {
  try {
    if (fs.existsSync(socketFile)) {
      console.log('cleaning up socket file')
      fs.unlinkSync('/tmp/springald.sock')
    }
  } catch (e) {}
}

// since we already have a launcher script, we might as well fix nwjs' "everything's grey"
// coloring (along with some annoyances); we output to stderr and then print that out to stdout
const nwBin = process.env.NW_BIN || 'nw'
const child = execFile(nwBin, ['--enable-logging=stderr', '.'], {
  env: {
    ...process.env,
    NODE_ENV: 'development',
  },
})
child.stderr.on('data', (data) => {
  printPrettyLogLine(data.toString())
})

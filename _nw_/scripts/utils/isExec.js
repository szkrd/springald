const os = require('os')
const isWin = /^win/.test(os.platform())

function isExec(extension, mode) {
  const ox = !!(((mode << 6) >> 6) & 1)
  const gx = !!(((mode << 3) >> 6) & 1)
  const ux = !!((mode >> 6) & 1)
  const exe = /\.(exe|bat|cmd)$/.test(extension)
  return isWin ? exe : ux || gx || ox
}

module.exports = isExec

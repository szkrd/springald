const os = require('os');
const isWin = /^win/.test(os.platform());

function isExec (extension, mode) {
  let ox = !!((mode << 6) >> 6 & 1);
  let gx = !!((mode << 3) >> 6 & 1);
  let ux = !!(mode >> 6 & 1);
  let exe = /\.(exe|bat|cmd)$/.test(extension);
  return isWin ? exe : (ux || gx || ox);
}

module.exports = isExec;

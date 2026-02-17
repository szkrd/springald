const os = require('os');
const isWin = /^win/.test(os.platform());

/**
 * Determines if a file has executable bit set on Linux,
 * or is an executable by extension (exe, bat, cmd) on Windows.
 */
function isExecutable(fileExtension, fsStatsMode) {
  const ox = !!(((fsStatsMode << 6) >> 6) & 1);
  const gx = !!(((fsStatsMode << 3) >> 6) & 1);
  const ux = !!((fsStatsMode >> 6) & 1);
  const exe = /\.(exe|bat|cmd)$/.test(fileExtension);
  return isWin ? exe : ux || gx || ox;
}

module.exports = isExecutable;

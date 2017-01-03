let superchild;
try { // win32 not supported
  superchild = require('superchild');
} catch (err) {
  superchild = require('./utils/superchildFallback');
}
const os = require('os');
const context = require('./context');

// TODO support for withApp parameter
// see for example: https://github.com/sindresorhus/opn
function openItem (item, withApp) {
  const gui = context.gui;
  const isWin = /^win/.test(os.platform());

  // WIP
  if (isWin) {
    gui.Shell.openItem(item.command);
    return;
  }
  // xdg open will not launch shellscripts for instance
  if (item.executable) {
    superchild(item.command);
  } else {
    gui.Shell.openItem(item.command);
  }
}

module.exports = openItem;

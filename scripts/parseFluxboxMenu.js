const osenv = require('osenv');
const path = require('path');
const fs = require('fs');

// TODO proper escaping
function parse (s) {
  s = s.replace(/\r\n/g, '\n');
  let itemPath = [];
  let ret = [];
  let lines = s.split(/\n/);
  for (let i = 0, l = lines.length; i < l; i++) {
    let line = lines[i].trim();
    let name = line.replace(/[^(]*\(/, '').replace(/([^\\])\).*/, '$1');
    if (/^\[submenu\]/.test(line)) {
      itemPath.push(name)
    }
    if (/^\[end\]/.test(line)) {
      itemPath.pop();
    }
    if (/^\[exec\]/.test(line)) {
      let command = line.replace(/[^{]*\{/, '').replace(/([^\\])}.*/, '$1');
      ret.push({
        executable: true,
        type: 'FB_MENUITEM',
        path: '/' + itemPath.join('/'),
        name,
        command
      });
    }
  }
  return ret;
}

// TODO [include] support
function parseFluxboxMenu (fileName) {
  let homeDir = osenv.home();
  let menuFile = fileName || path.join(homeDir, '.fluxbox', 'menu');
  return new Promise((resolve, reject) => {
    fs.readFile(menuFile, 'utf8', (err, contents) => {
      if (err) {
        return reject(err);
      }
      resolve(parse(contents));
    });
  });
}

module.exports = parseFluxboxMenu;

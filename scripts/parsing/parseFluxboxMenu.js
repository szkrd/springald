const osenv = require('osenv');
const path = require('path');
const fs = require('fs');

let counter = 0;
let homeDir = osenv.home();

function parse (s, depth = []) {
  return new Promise((resolve, reject) => {
    s = s.replace(/\r\n/g, '\n');
    let itemPath = depth;
    let ret = [];
    let lines = s.split(/\n/);
    for (let i = 0, l = lines.length; i < l; i++) {
      let line = lines[i].trim();
      let name = line.replace(/[^(]*\(/, '').replace(/([^\\])\).*/, '$1');

      // submenu
      if (/^\[submenu\]/.test(line)) {
        // we ignore the {title} part of the submenu `[submenu] (foo) {foo title}`
        name = name.replace(/\\\)/g, ')'); // unescape "\)" to ")"
        itemPath.push(name);
      }

      // end of submenu
      if (/^\[end\]/.test(line)) {
        itemPath.pop();
      }

      // executable
      if (/^\[exec\]/.test(line)) {
        name = name.replace(/\\\)/g, ')'); // unescape "\)" to ")"
        let command = line.replace(/[^{]*\{/, '').replace(/([^\\])}.*/, '$1');
        ret.push({
          id: `f${counter++}`,
          executable: true,
          type: 'FB_MENUITEM',
          path: '/' + itemPath.join('/'),
          name,
          command
        });
      }

      // included menu
      if (/^\[include\]/.test(line)) {
        parseFluxboxMenu(name, itemPath).then(results => ret.push(...results));
      }
    }
    resolve(ret);
  });
}

function parseFluxboxMenu (fileName, depth = []) {
  depth = Array.from(depth);
  fileName = (fileName || '').replace(/~/, homeDir);
  let menuFile = fileName || path.join(homeDir, '.fluxbox', 'menu');
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(menuFile)) {
      return [];
    }
    fs.readFile(menuFile, 'utf8', (err, contents) => {
      if (err) {
        return reject(err);
      }
      parse(contents, depth).then(result => resolve(result));
    });
  });
}

module.exports = parseFluxboxMenu;

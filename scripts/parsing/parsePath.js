const path = require('path');
const fs = require('fs');
const consts = require('../consts');
const isExec = require('../utils/isExec');

let counter = 0;

// linux only: get global .desktop files
function getDesktopFriendlies () {
  let location = consts.DESKTOP_FILES_LOCATION;
  return new Promise((resolve, reject) => {
    fs.readdir(location, (err, files) => {
      if (err) {
        return resolve([]);
      }
      return resolve(files.filter(fn => /\.desktop$/.test(fn)).map(fn => fn.replace(/\.desktop$/, '')));
    });
  });
}

// node injects the project's local bin directory to the path
function isLocalNodeBin (s) {
  return /springald[/\\]node_modules/.test(s);
}

function readDir (location) {
  return new Promise((resolve, reject) => {
    let results = [];
    fs.readdir(location, (err, files) => {
      if (err) {
        return reject(err);
      }
      let itemCount = files.length;
      let processCount = 0;
      if (!files.length) {
        resolve([]);
      }
      files.forEach(file => {
        file = path.resolve(location, file);
        fs.stat(file, (err, stats) => {
          if (err) {
            return reject(err);
          }
          processCount++;
          if (stats.isFile()) {
            let parsed = path.parse(file);
            // on the path non executables are not interesting
            if (isExec(parsed.ext, stats.mode) && !(isLocalNodeBin(file))) {
              results.push({
                id: `p${counter++}`,
                executable: true,
                type: 'PATHITEM',
                path: parsed.dir,
                name: parsed.base,
                desktop: false,
                command: file // full path
              });
            }
          }
          if (processCount === itemCount) {
            resolve(results);
          }
        }); // end stat
      }); // end forEach
    }); // end readdir
  }); // end Promise
}

function parsePath () {
  let result = [];
  let pathItems = process.env.PATH.split(path.delimiter);
  let dirs = [ ...new Set(pathItems) ];
  if (pathItems.length !== dirs.length) {
    console.warn('You have duplicate items in your PATH!');
  }
  dirs = dirs.filter(dir => fs.existsSync(dir));
  let all = [getDesktopFriendlies(), ...dirs.map(dir => readDir(dir))];
  return Promise.all(all)
    .then((packs) => {
      let desktops = packs.shift();
      packs.forEach(pack => result.push.apply(result, pack));
      if (desktops.length) {
        result.forEach(fn => {
          if (desktops.includes(fn.name)) {
            fn.desktop = true;
          }
        });
      }
      return Promise.resolve(result);
    }, (err) => {
      return Promise.reject(err);
    });
}

module.exports = parsePath;

const path = require('path');
const fs = require('fs');
const isExec = require('../utils/isExec');

let counter = 0;

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
  return Promise.all(dirs.map(dir => readDir(dir)))
    .then((packs) => {
      packs.forEach(pack => result.push.apply(result, pack));
      return Promise.resolve(result);
    }, (err) => {
      return Promise.reject(err);
    });
}

module.exports = parsePath;

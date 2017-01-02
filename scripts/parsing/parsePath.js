const path = require('path');
const fs = require('fs');
const os = require('os');
const isWin = /^win/.test(os.platform);

function isExec (extension, mode) {
  let ox = !!((mode << 6) >> 6 & 1);
  let gx = !!((mode << 3) >> 6 & 1);
  let ux = !!(mode >> 6 & 1);
  let exe = /^\.(exe|bat|cmd)$/.test(extension);
  return isWin ? exe : (ux || gx || ox);
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
            if (isExec(parsed.ext, stats.mode)) {
              results.push({
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

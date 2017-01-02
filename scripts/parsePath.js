const path = require('path');
const fs = require('fs');

function readDir (location) {
  return new Promise((resolve, reject) => {
    let results = [];
    fs.readdir(location, (err, files) => {
      if (err) {
        return reject(err);
      }
      let itemCount = files.length;
      let processCount = 0;
      files.forEach(file => {
        file = path.resolve(location, file);
        fs.stat(file, (err, stats) => {
          if (err) {
            return reject(err);
          }
          processCount++;
          if (stats.isFile()) {
            let parsed = path.parse(file);
            let ux = stats.mode & 1;
            let gx = stats.mode & 10;
            let ox = stats.mode & 100;
            let exe = /^\.exe$/.test(parsed.ext);
            console.log(ux, gx, ox, exe);
            results.push({
              executable: !!(ux || gx || ox || exe), // FIXME broken
              type: 'PATHITEM',
              path: parsed.dir,
              name: parsed.base,
              command: file
            });
          }
          if (processCount === itemCount) {
            resolve(results);
          }
        });
      });
    });
  });
}


function parsePath () {
  let dirs = process.env.PATH.split(path.delimiter);
  dirs = [dirs[0]];
  Promise.all(dirs.map(dir => readDir(dir)));//.then((res) => console.log(res));
  //return Promise.all(dirs.map(dir => readDir(dir)));
}

parsePath();
module.exports = parsePath;

const fs = require('fs');
const path = require('path');
const osenv = require('osenv');
const getConfig = require('../getConfig');

function isAllowedFile (name) {
  let config = getConfig();
  let rules = config.includeFiles;
  return rules.every(rule => (new RegExp(rule)).test(name));
}

function isAllowedDir (name) {
  let config = getConfig();
  let rules = config.excludedDirs;
  name = name.split('/').pop();
  return !rules.some(rule => (new RegExp(rule)).test(name));
}

// as seen on the interwebz
function walk (dir, done) {
  let results = [];

  fs.readdir(dir, (err, list) => {
    if (err) {
      return done(err);
    }
    let pending = list.length;
    let mayEnd = () => {
      if (!--pending) {
        done(null, results);
      }
    };
    if (!pending) {
      return done(null, results);
    }
    list.forEach((file) => {
      let name = file;
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          if (isAllowedDir(name)) {
            walk(file, (err, res) => {
              results = results.concat(res);
              mayEnd();
            });
          } else {
            mayEnd();
          }
        } else {
          if (isAllowedFile(file)) {
            results.push(file); // TODO structure!
          }
          mayEnd();
        }
      }); // end stat
    }); // end list forEach
  }); // end readdir
}

function parseDirs () {
  return new Promise((resolve, reject) => {
    let homeDir = osenv.home();
    let config = getConfig();
    let dirs = [ ...new Set(config.directories || [])];
    dirs = dirs.map(dir => dir.replace(/~/, homeDir).replace(/\\/g, '/')); // TODO normalize for path.sep
    dirs = dirs.filter(dir => fs.existsSync(dir));
    let processedCount = 0;
    let results = [];
    let errors = [];

    let cb = (err, res) => {
      processedCount++;
      if (err) {
        console.error('Directory walker error'); // nw console error is a bit simple
        console.error(err);
        // not sure if I want to do anything w this, the ui has no error reporting by design
        // maybe prmisify the walker and do a Promise.all...
        return errors.push(err);
      }
      results.push.apply(results, res);
      if (processedCount === dirs.length) {
        resolve(results);
      }
    };
    dirs.forEach(dir => walk(dir, cb));
  });
}

module.exports = parseDirs;

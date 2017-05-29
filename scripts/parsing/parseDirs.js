const fs = require('fs');
const path = require('path');
const osenv = require('osenv');
const getConfig = require('../getConfig');

let counter = 0;

function isAllowedFile (name) {
  let regTest = (r, n) => (new RegExp(r)).test(n);
  let config = getConfig();
  let incRules = config.includeFiles;
  let excRules = config.excludeFiles;
  return incRules.every(rule => regTest(rule, name)) && excRules.every(rule => !regTest(rule, name));
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

  // TODO investigate {encoding: 'buffer'} further
  fs.readdir(dir, (err, list) => {
    if (err) {
      err.file = dir;
      return done(err); // pretty much this is the only hard error that may stop the walking
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
        if (err) {
          console.error(`Could not stat file "${file}".`, err);
          mayEnd();
          return; // skip current loop, but not the whole walking
        }
        if (stat && stat.isDirectory()) {
          if (isAllowedDir(name)) {
            walk(file, (err, res) => {
              if (err) {
                console.error(`Could not read subdirectory "${file}"`);
              } else {
                results = results.concat(res);
              }
              mayEnd();
            });
          } else {
            mayEnd();
          }
        } else {
          let fileNameOnly = path.basename(file);
          if (isAllowedFile(fileNameOnly)) {
            let parsed = path.parse(file);
            results.push({
              id: `d${counter++}`,
              executable: false, // isExec(parsed.ext, stats.mode), <-- shouldn't be, isn't it annoying w samba?
              type: 'DIRITEM',
              path: parsed.dir,
              name: parsed.base,
              command: file // full path
            });
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
    let dirs = [...new Set(config.directories || [])];
    dirs = dirs.map(dir => dir.replace(/~/, homeDir).replace(/\\/g, '/')); // TODO normalize for path.sep
    dirs = dirs.filter(dir => fs.existsSync(dir));
    let processedCount = 0;
    let results = [];
    let errors = [];

    let cb = (err, res) => {
      processedCount++;
      if (err) {
        console.error(`Directory walker error: could not read directory "${err.file}"`); // nw console error is a bit simple
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

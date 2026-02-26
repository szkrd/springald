import fs from 'fs';
import os from 'os';
import path from 'path';
import { log } from '../../../shared/log';
import { sharedConfig } from '../../shared/sharedConfig';
import { ISearchItem } from '../parseAll';

export interface IDirWalkError extends NodeJS.ErrnoException {
  /** Location where the parser failed. Directory parsing error is not a show-stopper, that will never reject. */
  file: string;
}

let counter = 0;
const getConfig = () => sharedConfig;

function isAllowedFile(name) {
  const regTest = (r, n) => new RegExp(r).test(n);
  const config = getConfig();
  const incRules = config.includeFiles;
  const excRules = config.excludeFiles;
  return incRules.every((rule) => regTest(rule, name)) && excRules.every((rule) => !regTest(rule, name));
}

function isAllowedDir(name) {
  const config = getConfig();
  const rules = config.excludedDirs;
  name = name.split('/').pop();
  return !rules.some((rule) => new RegExp(rule).test(name));
}

// as seen on the interwebz
function walk(dir: string, done: (err: IDirWalkError | null, results?: ISearchItem[]) => void) {
  let results: ISearchItem[] = [];

  // TODO investigate {encoding: 'buffer'} further
  fs.readdir(dir, (err, list) => {
    if (err) {
      return done(Object.assign(err, { file: dir })); // pretty much this is the only hard error that may stop the walking
    }
    let pending = list.length;
    const mayEnd = () => {
      if (!--pending) {
        done(null, results);
      }
    };
    if (!pending) {
      return done(null, results);
    }
    list.forEach((file) => {
      const name = file;
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (err) {
          log.error(`Could not stat file "${file}".`, err);
          mayEnd();
          return; // skip current loop, but not the whole walking
        }
        if (stat && stat.isDirectory()) {
          if (isAllowedDir(name)) {
            walk(file, (err, res) => {
              if (err) {
                log.error(`Could not read subdirectory "${file}"`);
              } else if (res) {
                results = results.concat(res);
              }
              mayEnd();
            });
          } else {
            mayEnd();
          }
        } else {
          const fileNameOnly = path.basename(file);
          if (isAllowedFile(fileNameOnly)) {
            const parsed = path.parse(file);
            results.push({
              id: `d${counter++}`,
              executable: false, // isExec(parsed.ext, stats.mode), <-- shouldn't be, isn't it annoying w samba?
              type: 'DIRITEM',
              path: parsed.dir,
              name: parsed.base,
              command: file, // full path
            });
          }
          mayEnd();
        }
      }); // end stat
    }); // end list forEach
  }); // end readdir
}

// parse the "directories" (section from the config)
export function parseDirs(): Promise<ISearchItem[]> {
  return new Promise((resolve, _reject) => {
    // first we replace the ~ with the proper home path
    const homeDir = os.homedir();
    const config = getConfig();
    let dirs = [...new Set(config.directories || [])];
    dirs = dirs.map((dir) => dir.replace(/~/, homeDir).replace(/\\/g, '/')); // TODO normalize for path.sep

    // then check if all the directories exist
    dirs = dirs.filter((dir) => fs.existsSync(dir));
    let processedCount = 0;
    const results: ISearchItem[] = [];

    // recursively process all the files in thes directories
    const walkDirCallback = (err: IDirWalkError | null, res) => {
      processedCount++;
      if (err) {
        log.error(`☠️ Directory walker error: could not read directory "${err.file}"!`); // nw console error is a bit simple
        return;
      }
      results.push(...res);
      if (processedCount === dirs.length) {
        // we will never reject here, since not being able to
        // parse a directory is not a showstopper
        resolve(results);
      }
    };
    dirs.forEach((dir) => walk(dir, walkDirCallback));
  });
}

import fs from 'fs';
import { homedir } from 'os';
import path from 'path';
import { log } from '../../../shared/log';
import { IParseModuleError, ISearchItem } from '../parseAll';
import { resolveHomeDir } from '../../utils/file';

let counter = 0;
const homeDir = homedir();

function parse(text: string, depth: string[] = []): Promise<ISearchItem[]> {
  return new Promise((resolve, _reject) => {
    text = text.replace(/\r\n/g, '\n');
    const itemPath: string[] = depth; // name of the current fluxbox menu node; ex. `[submenu] (System)` => `"System"`
    const ret: ISearchItem[] = [];
    const lines = text.split(/\n/);
    for (let i = 0, l = lines.length; i < l; i++) {
      const line = lines[i].trim();
      let name = line.replace(/[^(]*\(/, '').replace(/([^\\])\).*/, '$1');

      // submenu
      if (/^\[submenu]/.test(line)) {
        // we ignore the {title} part of the submenu `[submenu] (foo) {foo title}`
        name = name.replace(/\\\)/g, ')'); // unescape "\)" to ")"
        itemPath.push(name);
      }

      // end of submenu
      if (/^\[end]/.test(line)) {
        itemPath.pop();
      }

      // executable
      if (/^\[exec]/.test(line)) {
        name = name.replace(/\\\)/g, ')'); // unescape "\)" to ")"
        const command = line.replace(/[^{]*\{/, '').replace(/([^\\])}.*/, '$1');
        const item: ISearchItem = {
          id: `f${counter++}`,
          executable: true,
          type: 'FB_MENUITEM',
          path: '/' + itemPath.join('/'),
          name,
          command,
        };
        ret.push(item);
      }

      // included menu
      if (/^\[include]/.test(line)) {
        parseFluxboxMenu(name, itemPath).then((results) => ret.push(...results));
      }
    }
    resolve(ret);
  });
}

/**
 * Recursively parse a fluxbox menu file.
 *
 * @param fileName Name of the menu file, config default is `"fluxboxMenuFile": "~/.fluxbox/menu"`
 * @param depth    String array of the menu names (when recursing the tree)
 * @returns        Search item object
 */
export function parseFluxboxMenu(fileName: string, depth: string[] = []): Promise<ISearchItem[]> {
  depth = Array.from(depth);
  fileName = resolveHomeDir(fileName);
  const menuFile = fileName || path.join(homeDir, '.fluxbox', 'menu');
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(menuFile)) {
      log.info('No fluxbox menu file found.');
      resolve([]);
      return;
    }
    fs.readFile(menuFile, 'utf8', (err, contents) => {
      if (err) {
        reject(Object.assign(err, { module: 'parseFluxboxMenu' }) as IParseModuleError);
      } else {
        parse(contents, depth).then((result) => resolve(result));
      }
    });
  });
}

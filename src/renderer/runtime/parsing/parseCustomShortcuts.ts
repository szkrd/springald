import { SpawnOptionsWithoutStdio } from 'child_process';
import { stat as fsStat } from 'fs/promises';
import { ISearchItem } from '../parseAll';
import { getConfig } from '../../../shared/config';
import { isExecutable, resolveHomeDir } from '../../utils/file';
import path from 'path';
import { Stats } from 'fs';
import { log } from '../../../shared/log';

export interface ICustomShortcut extends SpawnOptionsWithoutStdio {
  title: string;
  command: string;
  args: string | string[];
}

export async function parseCustomShortcuts(): Promise<ISearchItem[]> {
  const config = await getConfig();
  const cfgShortcuts: ICustomShortcut[] = config.customShortcuts ?? [];
  const searchItems: ISearchItem[] = [];
  let counter = 0;
  for (const cfgShortcut of cfgShortcuts) {
    const command = resolveHomeDir(cfgShortcut.command);
    let stats: Stats | null = null;
    // stat is fast; libuv thread pool default size is 4, so 100 files will finish in like 5ms
    try {
      stats = await fsStat(command);
    } catch (err) {
      log.error(`Could not stat customShortcut "${command}" from config, skipping!`, err); // skipping, not a hard error
    }
    if (!stats) continue;
    const parsed = path.parse(command);
    const item: ISearchItem = {
      id: `c${counter++}`,
      type: 'CFGITEM',
      executable: isExecutable(parsed.ext, stats.mode),
      path: cfgShortcut.title, // title will be used on the UI as a fake path
      name: parsed.base, // will be ignored
      desktop: false,

      // these will be used as is, passed on to spawn (command + args + opts)
      command,
      args: cfgShortcut.args ? (Array.isArray(cfgShortcut.args) ? cfgShortcut.args : [cfgShortcut.args]) : undefined,
      spawnOpts: Object.assign({}, cfgShortcut, { title: undefined, command: undefined, args: undefined }),
    };
    searchItems.push(item);
  }
  return searchItems;
}

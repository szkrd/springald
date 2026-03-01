import { homedir } from 'os';
import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { shell } from 'electron';
import { log } from '../../shared/log';
import { ISearchItem } from './parseAll';
import { IAppConfig } from '../../shared/config';
import { quoteSpaces } from '../utils/string';

/** Replaces string chunks like %COMMAND% with values from the given object. */
function subst(textWithMarkers: string, keyValObj: Record<string, any>): string {
  let text: string = textWithMarkers;
  Object.keys(keyValObj).forEach((key) => {
    const froms: string[] = [key.toUpperCase()];
    if (key === 'command') froms.push('CMD'); // %COMMAND% or %CMD% is the full path + fileName combo
    if (key === 'name') froms.push('FILENAME'); // %NAME% or %FILENAME% is the fileName with the extension
    const to = quoteSpaces(keyValObj[key]);
    for (const from of froms) {
      text = text.replaceAll(`%${from}%`, to); // replace %FOO% with `item.foo`
    }
  });
  return text;
}

/** Spawns a process, `commandLine` is both the executable AND the file parameter. */
function spawnProcess(commandLine: string, options: Partial<SpawnOptionsWithoutStdio> = {}) {
  if (!commandLine) return;
  const spawnOpt = Object.assign(
    {
      shell: true,
      cwd: homedir(),
      detached: true,
    },
    options,
  );
  log.info('Spawning: ' + commandLine);
  return spawn(commandLine, spawnOpt);
}

export function openWithApp(item: ISearchItem, withApp: string | ISearchItem, config: IAppConfig) {
  const withAppIsObj = typeof withApp === 'object' && withApp !== null;

  // shortcut for open with default file manager (default is "F", as in file manager)
  if (withApp === config.appShortcuts.showItemInFolder) {
    log.info('Shell command (show in folder): ' + item.command);
    return shell.showItemInFolder(item.command); // this is NOT a Promise, quoting is not needed
  }

  // open in terminal (preferred terminal emulator can be set in config.terminalCommand; default app command is "T")
  // (support parameter substitution, like %CMD% or %FILENAME%)
  if (withApp === config.appShortcuts.launchInTerminal) {
    return spawnProcess(subst(config.terminalCommand, item));
  }

  // hackish way to allow a command to be launched with a filename param,
  // and not the full path+filename combo (honestly, only gtk-launch was this shitty so far,
  // and if I implemented a simple .desktop parser, then I wouldn't really need it...
  // Arch AUR has "dex" (not the editor) which is a .desktop launcher, but that's buggy too)
  const paramOverride = (config.openWithParams || {})[withAppIsObj ? withApp.name : withApp]; // for example '-a -b -x -y %NAME%'
  let param = item.command; // default is the proper command (which is: path + name = command)
  if (paramOverride) {
    param = subst(paramOverride, item); // replace with keys (like "%COMMAND%" with `item.command`)
  }

  // this is the simple scenario, where the user defined the app name in the config json
  // or the app name is an executable on the path (like "notepad", "mspaint")
  // TODO: would it be useful to have an array of executables?
  // OR define a custom list of executables, like { node: '/usr/bin/node', chrome: '...' }
  if (typeof withApp === 'string' && withApp) {
    return spawnProcess(quoteSpaces(withApp, param));
  }

  // desktops, pathexecs or fluxbox commands (the latter is kinda weird I guess)
  // this of course can create interesting scenarios (like opening a fluxbox
  // command with a mediaplayer, but let's assume the user knows what he or she does)
  if (withAppIsObj && withApp.command) {
    return spawnProcess(quoteSpaces(withApp.command, param));
  }

  // Launch the filename as is (if executable, then spawn, if not, then pass it to the shell)
  if (item.executable) {
    // xdg open will not launch shellscripts for instance
    return spawnProcess(quoteSpaces(item.command));
  } else {
    log.info('Shell command (open path): ' + item.command);
    return shell.openPath(item.command); // this is a Promise
  }
}

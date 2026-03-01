import { join } from 'path';
import { log } from './log';
import appConfig from '../../config.json';
import { readJsonFile } from './utils/readJsonFile';

export interface IAppConfig {
  theme: 'default' | 'ambiance' | 'aquamint';
  winWidth: number;
  fluxboxMenuFile: string | false;
  borderlessWindow: boolean;
  fixPosition: [number, number];
  modifyResize: [number, number];
  paintDelay: number;
  showOnStartup: boolean;
  centerOnShow: boolean;
  autoSelectAll: boolean;
  trayIconSize: 'small' | 'large';
  toggleKey: string[];
  logicalAndSeparator: string;
  desktopFilesLocation: string;
  includeFiles: string[];
  excludeFiles: string[];
  excludedDirs: string[];
  excludeHidSys: boolean;
  skipPathParsing: boolean;
  /** Terminal command template, you have to escape it yourself if it has spaces in the path. */
  terminalCommand: string;
  appShortcuts: {
    showItemInFolder: string;
    launchInTerminal: string;
  };
  openWith: Record<string, string>;
  openWithParams: Record<string, string>;
  directories: string[];
  betaFeatures: boolean;
  /** Internal: set from argv using `--development` or `-d` */
  development: boolean;
  /** Internal: same as in nwjs (~/.config/appName) */
  dataPath: string;
}

let localAppConfig: Partial<IAppConfig> = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  localAppConfig = require('../../config.local.json'); // TODO use read json?
} catch {
  /* noop */
}

let initialized = false;
let config = getDefaultConfig();

/**
 * Returns the default config the app has been shipped with.
 * This is mostly for type safety and in time shall be replaced
 * with the proper merged configuration.
 */
export function getDefaultConfig(): IAppConfig {
  return {
    ...(appConfig as unknown as Omit<IAppConfig, 'development' | 'dataPath'>),
    development: false,
    dataPath: '',
  };
}

/**
 * Returns a merged config from app dir and user data dir; callable from
 * both backend and renderer (but the in memory versions will differ!).
 *
 * The only time this is called by the **renderer** is during a _request for reparse everything_
 * and then the config will be sent back to the server (to keep things in sync).
 */
export async function getConfig(dataPath = '', flush = false): Promise<IAppConfig> {
  if (initialized && !flush) {
    return config;
  }
  const localLoaded = Object.keys(localAppConfig).length > 0;
  const localPath = join(__dirname, '../../config.local.json');
  log.info(`Local config ${localLoaded ? 'loaded from' : 'failed to load from'} "${localPath}".`);
  const configPath = join(dataPath, 'config.json');
  const userConfig = await readJsonFile(configPath, true); // has catch
  log.info(`User config ${userConfig ? 'loaded from' : 'failed to load from'} "${configPath}".`);
  Object.assign(config, appConfig, localAppConfig, userConfig || {});
  log.debug('Merged config contains:', config);
  config.dataPath = config.dataPath || dataPath;
  config.development = process.argv.includes('--development') || process.argv.includes('-d');
  initialized = true;
  return config;
}

/**
 * When the renderer reparses the config,
 * it can push it back here for the backend.
 */
export function setConfig(newConfig: IAppConfig) {
  log.info('Config refreshed via renderer.');
  config = newConfig;
}

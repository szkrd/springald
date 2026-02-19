import { join } from 'path';
import { log } from './log';
import appConfig from '../../config.json';
import { readJsonFile } from './utils/readJsonFile';

export interface IAppConfig {
  theme: 'default' | 'ambiance' | 'aquamint';
  winWidth: number;
  fluxboxMenuFile: string;
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
  terminalCommand: string;
  appShortcuts: {
    showItemInFolder: string;
    launchInTerminal: string;
  };
  openWith: Record<string, string>;
  directories: string[];
  betaFeatures: boolean;
  /** Internal: set from argv using `--development` or `-d` */
  development: boolean;
  /** Internal: same as in nwjs (~/.config/appName) */
  dataPath: string;
}

let localAppConfig: Partial<IAppConfig> = {};
try {
  localAppConfig = require('../../config.local.json'); // TODO use read json?
} catch {
  /* noop */
}

let initialized = false;
let config: IAppConfig = {
  ...(appConfig as any as Omit<IAppConfig, 'development' | 'dataPath'>),
  development: false,
  dataPath: '',
};

/**
 * returns a merged config from app dir and user data dir; callable from
 * both backend and renderer (but the in memory versions will differ!)
 */
export async function getConfig(dataPath = '', flush = false): Promise<IAppConfig> {
  if (initialized && !flush) {
    return config;
  }
  const localLoaded = Object.keys(localAppConfig).length > 0;
  const localPath = join(__dirname, '../../config.local.json');
  log.info(`Local config ${localLoaded ? 'loaded from' : 'failed to load from'} "${localPath}".`);
  const configPath = join(dataPath, 'config.json');
  const userConfig = await readJsonFile(configPath); // has catch
  log.info(`User config ${userConfig ? 'loaded from' : 'failed to load from'} "${configPath}".`);
  Object.assign(config, appConfig, localAppConfig, userConfig || {});
  log.debug('Merged config contains:', config);
  config.dataPath = config.dataPath || dataPath;
  config.development = process.argv.includes('--development') || process.argv.includes('-d');
  initialized = true;
  return config;
}

// if the renderer reparses the config,
// it can push it back here for the backend
getConfig.inject = (newConfig) => {
  log.info('Config refreshed via renderer.');
  config = newConfig;
};

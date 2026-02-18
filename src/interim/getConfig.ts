import { join } from 'path';
import { log } from './log';
import appConfig from '../../config.json';
import { readJsonFile } from './utils/readJsonFile';

console.log(appConfig);

let localAppConfig = {};
try {
  localAppConfig = require('../../config.local.json'); // TODO use read json?
} catch {
  /* noop */
}

let initialized = false;
let config = {
  ...appConfig,
  // set from argv using `--development` or `-d`
  development: false,
  // same as in nwjs (~/.config/appName)
  dataPath: '',
};

/**
 * returns a merged config from app dir and user data dir; callable from
 * both backend and renderer (but the in memory versions will differ!)
 * @param dataPath
 * @param flush
 */
export async function getConfig(dataPath = '', flush = false) {
  if (initialized && !flush) return config;
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

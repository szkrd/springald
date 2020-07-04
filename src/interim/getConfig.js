const path = require('path')
const appConfig = require('../../config.json')
const readJsonFile = require('../interim/readJsonFile')

let initialized = false
let config = {
  ...appConfig,
  // set from NODE_ENV
  development: false,
  // same as in nwjs (~/.config/appName)
  dataPath: '',
}

/**
 * returns a merged config from app dir and user data dir; callable from
 * both backend and renderer (but the in memory versions will differ!)
 * @param dataPath
 * @param flush
 */
async function getConfig(dataPath = '', flush = false) {
  if (initialized && !flush) return config
  const userConfig = await readJsonFile(path.join(dataPath, 'config.json'))
  Object.assign(config, appConfig, userConfig || {})
  config.dataPath = config.dataPath || dataPath
  config.development = process.env.NODE_ENV === 'development'
  initialized = true
  return config
}

// if the renderer reparses the config,
// it can push it back here for the backend
getConfig.inject = (newConfig) => {
  console.info('Config refreshed via renderer.')
  config = newConfig
}

module.exports = getConfig

const path = require('path')
const appConfig = require('../../config.json')
const readJsonFile = require('../interim/readJsonFile')

let initialized = false
const config = {
  ...appConfig,
  // set from NODE_ENV
  development: false,
  // same as in nwjs (~/.config/appName)
  dataPath: '',
}

/**
 * returns a merged config from app dir and user data dir
 * @param dataPath
 */
async function getConfig(dataPath = '') {
  if (initialized) return config
  const userConfig = await readJsonFile(path.join(dataPath, 'config.json'))
  Object.assign(config, appConfig, userConfig || {})
  config.dataPath = dataPath
  config.development = process.env.NODE_ENV === 'development'
  initialized = true
  return config
}

module.exports = getConfig

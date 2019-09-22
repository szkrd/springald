import context from './context'
import readJsonFile from './utils/readJsonFile'
import defaultConfig from '../defaultConfig'
const path = require('path')

const config = defaultConfig()
let parsed = false

function getConfig() {
  if (!parsed) {
    Object.assign(config, readJsonFile(path.join(context.dataPath, 'config.json')) || {})
    config.development = process.env.NODE_ENV === 'development'
    parsed = true
  }
  return config
}

export default getConfig

// interim.js is included in the browser window that's why we need the weird paths
// (the require hack is only useful for the IDE)
const _require = require
require = (s) => _require(`./src/interim/${s}`)

const log = require('./log')
const getConfig = require('./getConfig')
const sendMessage = require('./sendMessage')
const parseAll = require('./parseAll')
const openWithApp = require('./openWithApp')
require = _require

window.app.interim = {
  log,
  getConfig,
  sendMessage,
  parseAll,
  openWithApp,
}

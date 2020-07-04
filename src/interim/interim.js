// interim.js is included in the browser window that's why we need the weird paths
// (the require hack is only useful for the IDE)
const _require = require
require = (s) => _require(`./src/interim/${s}`)

const getConfig = require('./getConfig')
const sendMessage = require('./sendMessage')
const parseAll = require('./parseAll')
const openWithApp = require('./openWithApp')
require = _require

window.app.interim = {
  getConfig,
  sendMessage,
  parseAll,
  openWithApp,
}

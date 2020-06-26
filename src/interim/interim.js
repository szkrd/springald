const sendMessage = require('./src/interim/sendMessage')
const parseAll = require('./src/interim/parseAll')
const openWithApp = require('./src/interim/openWithApp')

window.app.interim = {
  sendMessage,
  parseAll,
  openWithApp,
}

const sendMessage = require('./src/interim/sendMessage')
const parseAll = require('./src/interim/parseAll')

window.app.interim = {
  sendMessage,
  parseAll,
}

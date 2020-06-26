const { ipcRenderer } = require('electron')
const messages = require('../backend/messages')

function sendMessage(messageId, payload) {
  if (!messages[messageId]) throw new Error('Unknown message id!')
  return ipcRenderer.sendSync(messageId, payload)
}

module.exports = sendMessage

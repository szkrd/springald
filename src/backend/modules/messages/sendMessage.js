const messages = require('../../messages')
const eventBus = require('./eventBus')

function sendMessage(messageId, payload) {
  if (!messages[messageId]) throw new Error('Unknown message id!')
  return eventBus.emit(messageId, payload)
}

module.exports = sendMessage

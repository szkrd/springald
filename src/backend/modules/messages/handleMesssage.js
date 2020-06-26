const { ipcMain } = require('electron')
const messages = require('../../messages')
const eventBus = require('./eventBus')

const registered = []

function handleMessage(messageId, callback) {
  if (!messages[messageId]) throw new Error('Unknown message id')
  if (registered.includes(messageId)) throw new Error('Message handler already registered')

  // client / renderer
  ipcMain.on(messageId, (event, payload) => {
    const ret = callback(payload)
    // it seems to me that I _must_ return something...
    // https://github.com/electron/electron/issues/23080
    event.returnValue = ret === undefined ? null : ret
  })

  // backend
  eventBus.on(messageId, callback)
}

module.exports = handleMessage

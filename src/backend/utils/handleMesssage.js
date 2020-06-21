const { ipcMain } = require('electron')
const messages = require('../messages')

function handleMessage(messageId, callback) {
  if (!messages[messageId]) throw new Error('Unknown message id')
  ipcMain.on(messageId, (event, payload) => {
    const ret = callback(payload)
    // it seems to me that I _must_ return something...
    // https://github.com/electron/electron/issues/23080
    event.returnValue = ret === undefined ? null : ret
  })
}

module.exports = handleMessage

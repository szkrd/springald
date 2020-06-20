;(function () {
  // hopefully this will be the only place where I use
  // the fucked up require of electron
  const { ipcRenderer } = require('electron')
  const messages = require('./src/backend/messages')

  function sendMessage(messageId, payload) {
    if (!messages[messageId]) throw new Error('Unknown message id!')
    return ipcRenderer.sendSync(messageId, payload)
  }

  window.app.runtime.sendMessage = sendMessage
})()

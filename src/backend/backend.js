// electron main process
const { app } = require('electron')
const initBackend = require('./initBackend')

app.whenReady().then(initBackend).catch(console.error)

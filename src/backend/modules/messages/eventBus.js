const EventEmitter = require('events')
const eventBus = new EventEmitter()

// for backend messages (ipcMain too is an event emitter,
// but let's use that only as intended: between renderer and main process)
module.exports = eventBus

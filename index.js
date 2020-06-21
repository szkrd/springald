// electron main process
const { app } = require('electron')
const initBackend = require('./src/backend/initBackend')

async function main() {
  await app.whenReady()
  const backend = await initBackend()
  backend.win.show()
}

main()

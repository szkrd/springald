// electron main process
const { app } = require('electron')
const initBackend = require('./src/backend/initBackend')

async function main() {
  await app.whenReady()
  await initBackend()
}

main()

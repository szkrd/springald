// electron main process
const { app, BrowserWindow } = require('electron')
const initBackend = require('./src/backend/initBackend')
let backend

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 100,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  win.setMenuBarVisibility(false)
  win.loadFile('index.html')
  win.webContents.openDevTools({ mode: 'undocked' })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  console.log('quit')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

async function main() {
  await app.whenReady()
  const backend = await initBackend()
  await createWindow()
}

main()

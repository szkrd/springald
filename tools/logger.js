const chalk = require('chalk')
const http = require('http')

const noJSON = !!process.argv.find((s) => s === '--no-json')
const doFormatJSON = !!process.argv.find((s) => s === '--format-json')
const noObjects = !!process.argv.find((s) => s === '--no-objects')

const port = process.env.DEBUG_LISTENER_PORT || 7070
const px = 'R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=' // a black pixel
const getDate = () => {
  return new Date()
    .toJSON()
    .slice(0, 19)
    .replace('T', ' ')
}

// logs to the console anything after the ?p= param,
// if it's a json string, then optionally reformats it;
const server = http.createServer('*', (req, res) => {
  let jsobj
  const favIcon = req.url === '/favicon.ico'
  let param = req.url.replace(/^.*?\?p=/, '')
  let logType = 'i'
  if (/^[iew]:/.test(param)) {
    logType = param.substr(0, 1) // i = info, w = warning, e = error
    param = param.substr(2) // params in url: /?p=i:this-is-info
  }
  try {
    param = decodeURIComponent(param)
  } catch (e) {}
  try {
    jsobj = JSON.parse(param)
  } catch (e) {}
  if (noObjects && !noJSON && jsobj) {
    jsobj = jsobj.filter((val) => typeof val !== 'object' || val === null)
  }
  const prefix = `[${getDate()}]:`
  let valueToLog = jsobj ? JSON.stringify(jsobj, null, doFormatJSON ? 2 : 0) : param
  valueToLog = noJSON ? param : valueToLog

  const colorChars = ['i', 'w', 'e']
  const colorNames = ['green', 'yellow', 'red']
  if (!favIcon) {
    console.log(prefix, chalk[colorNames[colorChars.indexOf(logType)]](valueToLog))
  }

  const img = Buffer.from(px, 'base64')
  res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': img.length })
  res.end(img)
})

server.listen(port, () => {
  console.log(
    `Listening on port ${port}!\n` + '--------------------------------------------------------------------------------'
  )
})

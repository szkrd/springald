const http = require('http')
const isDev = process.env.NODE_ENV === 'development'

// we can't get the config during app bootup, hence the hardcoded value
const REMOTE_PORT = 7070
const MAX_GET_REQUEST_SIZE = 80000

const stringify = (v) => {
  const cache = new WeakSet()
  return JSON.stringify(v, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return
      }
      cache.add(value)
    }
    return value
  })
}

function _log(prefix, args) {
  if (!isDev) {
    return
  }
  let payload = encodeURIComponent(stringify(args))
  if (payload.length > MAX_GET_REQUEST_SIZE) {
    payload = encodeURIComponent(
      stringify(args.map((val) => (typeof val === 'object' && val !== null ? { skipped: 'object too large' } : val)))
    )
  }
  http.get(`http://localhost:${REMOTE_PORT}?p=${prefix}:${payload}`)
}

function log() {
  return _log('i', Array.from(arguments))
}

log.info = function() {
  return _log('i', Array.from(arguments))
}

log.warn = function() {
  return _log('w', Array.from(arguments))
}

log.error = function() {
  return _log('e', Array.from(arguments))
}

export default log

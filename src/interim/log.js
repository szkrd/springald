// the logger is an interim module, may be called
// from both background and renderer

const buffer = {
  debug: [],
  info: [],
  log: [],
  warn: [],
  error: [],
}

const _rawLog = (action = 'log', ...args) => {
  // TODO: add proper isDev or isDebug check? though debug DOES go to the buffer
  if (action === 'debug') return
  // TODO: add proper prefix? like '[APP]', but with zero libs all messages are indeed mine
  console[action](...args)
}

const _log = (action = 'log', ...args) => {
  if (!Object.keys(buffer).includes(action)) throw new Error('Invalid log action!')
  buffer[action].push({ at: Date.now(), args })
  _rawLog(action, ...args)
}

const log = {
  debug: (...args) => _log('debug', ...args),
  info: (...args) => _log('info', ...args),
  log: (...args) => _log('log', ...args),
  warn: (...args) => _log('warn', ...args),
  error: (...args) => _log('error', ...args),
  // ---
  noBufferDebug: (...args) => _rawLog('debug', ...args),
  noBufferInfo: (...args) => _rawLog('info', ...args),
  noBufferLog: (...args) => _rawLog('log', ...args),
  noBufferWarn: (...args) => _rawLog('warn', ...args),
  noBufferError: (...args) => _rawLog('error', ...args),
  // ---
  getBuffer: () => buffer, // be careful, this is NOT a clone
  getErrorCount: (inputBuffer) => (inputBuffer || buffer).error.length,
  getWarningAndErrorCount: (inputBuffer) => (inputBuffer || buffer).error.length + (inputBuffer || buffer).warn.length,
}

module.exports = log

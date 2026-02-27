// the logger is an interim module, may be called
// from both background and renderer

interface IBufferedLogEvent {
  at: number;
  args: any[];
}

type ILogAction = 'debug' | 'info' | 'log' | 'warn' | 'error';

type ILogBuffer = Record<ILogAction, IBufferedLogEvent[]>;

const buffer: ILogBuffer = {
  debug: [],
  info: [],
  log: [],
  warn: [],
  error: [],
};

const _rawLog = (action: ILogAction = 'log', ...args: any[]) => {
  // TODO: add proper isDev or isDebug check? though debug DOES go to the buffer
  if (action === 'debug') return;
  // TODO: add proper prefix? like '[APP]', but with zero libs all messages are indeed mine
  console[action](...args);
};

const _log = (action: ILogAction = 'log', ...args: any[]) => {
  if (!Object.keys(buffer).includes(action)) throw new Error('Invalid log action!');
  buffer[action].push({ at: Date.now(), args });
  _rawLog(action, ...args);
};

export const log = {
  debug: (...args: any[]) => _log('debug', ...args),
  info: (...args: any[]) => _log('info', ...args),
  log: (...args: any[]) => _log('log', ...args),
  warn: (...args: any[]) => _log('warn', ...args),
  error: (...args: any[]) => _log('error', ...args),
  // ---
  noBufferDebug: (...args: any[]) => _rawLog('debug', ...args),
  noBufferInfo: (...args: any[]) => _rawLog('info', ...args),
  noBufferLog: (...args: any[]) => _rawLog('log', ...args),
  noBufferWarn: (...args: any[]) => _rawLog('warn', ...args),
  noBufferError: (...args: any[]) => _rawLog('error', ...args),
  // ---
  getBuffer: () => buffer, // be careful, this is NOT a clone
  getErrorCount: (inputBuffer: ILogBuffer) => (inputBuffer || buffer).error.length,
  getWarningAndErrorCount: (inputBuffer?: ILogBuffer): number =>
    (inputBuffer || buffer).error.length + (inputBuffer || buffer).warn.length,
};

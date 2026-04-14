// the logger is an interim module, may be called
// from both background and renderer

interface IBufferedLogEvent {
  at: number;
  args: any[];
}

type ILogAction = 'debug' | 'info' | 'log' | 'warn' | 'error';

export type ILogBuffer = Record<ILogAction, IBufferedLogEvent[]>;

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

const prettyPrintBuffers = (logs: Record<string, ILogBuffer>): void => {
  // do NOT use the log wrapper here, we don't want this end up in the buffer
  for (const section of Object.keys(logs)) {
    _rawLog('log', '%c' + section.toUpperCase(), 'font-weight:bold;color:purple');
    for (const group of Object.keys(logs[section])) {
      const bufferKey = group as ILogAction;
      const buffers: ILogBuffer = logs[section];
      const buffer = buffers[bufferKey];
      if (buffer.length === 0) {
        continue;
      }
      for (const logEvent of buffer) {
        const restArgs = logEvent.args.slice(1);
        const at = new Date(logEvent.at).toLocaleString('sv-SE', { hour12: false });
        const text = bufferKey.padEnd(6, ' ') + '| ' + at + ' | ' + logEvent.args[0];
        if (restArgs.length > 0) {
          _rawLog('log', text, restArgs);
        } else {
          _rawLog('log', text);
        }
      }
    }
  }
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
  prettyPrint: prettyPrintBuffers,
  // ---
  getBuffer: () => buffer, // be careful, this is NOT a clone
  getErrorCount: (inputBuffer: ILogBuffer) => (inputBuffer || buffer).error.length,
  getWarningAndErrorCount: (inputBuffer?: ILogBuffer): number =>
    (inputBuffer || buffer).error.length + (inputBuffer || buffer).warn.length,
};

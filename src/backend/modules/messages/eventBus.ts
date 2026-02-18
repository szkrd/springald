import { EventEmitter } from 'events';

// for backend messages (ipcMain too is an event emitter,
// but let's use that only as intended: between renderer and main process)
export const eventBus = new EventEmitter();

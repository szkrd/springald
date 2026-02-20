import { platform } from 'os';
import { createServer, Server } from 'net';

let unixServer: Server;

const SOCKET_NAME = '/tmp/springald.sock';
const CMD_TOGGLE = 'toggle';
const CMD_RELOAD = 'reload';
const CMD_QUIT = ['quit', 'close'];

/** Checks if input is a valid command. */
function isCommand(input: any = '', cmd: string | string[] = []) {
  if (typeof cmd === 'string') {
    cmd = [cmd];
  }
  return cmd.includes((input.toString() || '').trim());
}

export const unixSocket = {
  /**
   * ipc interface setup; use `socat` to send simple messages to the application,
   * for example `echo toggle | socat UNIX:/tmp/springald.sock -`
   */
  create: ({ toggleWindow, refreshConfig, quit }) => {
    if (platform() !== 'linux') {
      return;
    }
    unixServer = createServer((client) => {
      client.on('data', (data) => {
        if (isCommand(data, CMD_TOGGLE)) {
          toggleWindow();
        } else if (isCommand(data, CMD_RELOAD)) {
          refreshConfig();
        } else if (isCommand(data, CMD_QUIT)) {
          quit();
        }
      });
    });
    unixServer.listen(SOCKET_NAME);
  },

  destroy: (callback?: () => any) => {
    if (!unixServer) {
      if (typeof callback === 'function') callback();
      return;
    }
    unixServer.close(callback);
  },
};

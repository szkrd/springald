import { platform } from 'os';
import { createServer, Server, Socket } from 'net';
import { IMessageHandlers } from './handleMesssage';

let unixServer: Server;

const SOCKET_NAME = '/tmp/springald.sock';
const CMD_TOGGLE = 'toggle';
const CMD_QUIT = ['quit', 'close'];

/** Checks if input is a valid command. */
function isCommand(input: Buffer | string = '', cmd: string | string[] = []) {
  if (typeof cmd === 'string') {
    cmd = [cmd];
  }
  return cmd.includes((input.toString() || '').trim());
}

export const unixSocket = {
  /**
   * ipc interface setup; use `socat` to send simple messages to the application,
   * for example `echo toggle | socat UNIX:/tmp/springald.sock -`
   *
   * If I need, I'll add more messages, so far only `TOGGLE` and `QUIT` are handled.
   */
  create: ({ toggleWindow, quit }: IMessageHandlers) => {
    if (platform() !== 'linux') {
      return;
    }
    unixServer = createServer((client: Socket) => {
      client.on('data', (data: Buffer) => {
        if (isCommand(data, CMD_TOGGLE)) {
          toggleWindow();
        } else if (isCommand(data, CMD_QUIT)) {
          quit();
        }
      });
    });
    unixServer.listen(SOCKET_NAME);
  },

  destroy: (callback?: () => void) => {
    if (!unixServer) {
      if (typeof callback === 'function') callback();
      return;
    }
    unixServer.close(callback);
  },
};

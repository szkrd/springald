import { $ } from '../utils/dom';
import { log } from '../../shared/log';
import { sendMessage } from './sendMessage';

export function handleError(...args: unknown[]) {
  sendMessage('MSG_TOGGLE_DEV_TOOLS');
  log.error(...args);
  const el = $.getById('error-line')!;
  el.style.opacity = '1';
  setTimeout(() => {
    el.style.opacity = '0';
  }, 1000);
}

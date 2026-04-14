import { $ } from '../utils/dom';
import { log } from '../../shared/log';
import { sendMessage_toggleDevTools } from './sendMessage';

export function handleError(...args: unknown[]) {
  sendMessage_toggleDevTools();
  log.error(...args);
  const el = $.getById('error-line')!;
  el.style.opacity = '1';
  setTimeout(() => {
    el.style.opacity = '0';
  }, 1000);
}

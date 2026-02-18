import { $ } from '../utils/dom';
import { log } from '../../interim/log';
import { sendMessage } from '../../interim/sendMessage';

export function handleError() {
  sendMessage('MSG_TOGGLE_DEV_TOOLS');
  log.error(...arguments);
  const el = $('#error-line');
  el.style.opacity = 1;
  setTimeout(() => {
    el.style.opacity = 0;
  }, 1000);
}

import { constants } from '../constants';
import { sharedConfig } from '../shared/sharedConfig';
import { sharedStore } from '../shared/sharedStore';
import { $ } from '../utils/dom';
import { sendMessage, sendMessage_resizeWindow } from './sendMessage';

/**
 * Sends a `MSG_RESIZE_WINDOW` message to the backend
 * with the width and height (based on the list of found items).
 */
export function setWindowSize() {
  const { MAX_VISIBLE_ITEM_COUNT, FALLBACK_WIN_WIDTH } = constants;
  const foundItems = sharedStore.found || [];
  const foundItemCount = foundItems.length;

  const itemHeight = $.getComputedHeightById('current');
  const itemMax = Math.min(foundItemCount, MAX_VISIBLE_ITEM_COUNT);
  let height = itemHeight + itemHeight * itemMax;
  height += foundItemCount ? itemHeight : 0;
  const width = sharedConfig.winWidth || FALLBACK_WIN_WIDTH;
  sendMessage_resizeWindow({ width, height });
}

import { ISearchItem } from '../../parseAll';
import { processXdgDesktopFile } from './processXdgDesktopFile';

const BATCH_COUNT = 20;

/**
 * Runs post processing on search items.
 * This will (intenitonally) mutate the item iteself.
 */
export async function processPostParseHooks(items: ISearchItem[]): Promise<void> {
  const promises: Promise<ISearchItem>[] = [];
  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    if (typeof item.name === 'string') {
      if (item.name.endsWith('.desktop')) {
        promises.push(processXdgDesktopFile(item));
      }
    }
  }
  // it would be better to run in a pool (where a slot becomes
  // empty, a new promise steps in), this is for batches
  while (promises.length) {
    await Promise.all(promises.splice(0, BATCH_COUNT));
  }
}

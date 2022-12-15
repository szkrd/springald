const processXdgDesktopFile = require('./processXdgDesktopFile')

const BATCH_COUNT = 20

async function processPostParseHooks(items) {
  let promises = []
  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx]
    if (typeof item.name === 'string') {
      if (item.name.endsWith('.desktop')) {
        promises.push(processXdgDesktopFile(item))
      }
    }
  }
  // it would be better to run in a pool (where a slot becomes
  // empty, a new promise steps in), this is for batches
  while (promises.length) {
    await Promise.all(promises.splice(0, BATCH_COUNT))
  }
}

module.exports = processPostParseHooks

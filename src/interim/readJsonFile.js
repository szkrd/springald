let fs = require('fs').promises
const log = require('./log')

async function readJsonFile(fileName) {
  try {
    await fs.access(fileName)
  } catch (err) {
    return null
  }
  let contents = null
  try {
    contents = await fs.readFile(fileName, 'utf8')
  } catch (err) {
    log.error(`Could not read file "${fileName}"`)
    return null
  }
  try {
    contents = JSON.parse(contents)
  } catch (err) {
    log.error(`Could not parse json "${fileName}"`, err)
    return null
  }
  return contents
}

module.exports = readJsonFile

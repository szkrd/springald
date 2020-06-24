let fs = require('fs').promises

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
    console.error(`Could not read file "${fileName}"`)
    return null
  }
  try {
    contents = JSON.parse(contents)
  } catch (err) {
    console.error(`Could not parse json "${fileName}"`)
    return null
  }
  return contents
}

module.exports = readJsonFile

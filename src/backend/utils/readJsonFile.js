let fs = require('fs')
const { promisify } = require('util')

fs = ['exists', 'readFile'].reduce((acc, name) => ({ ...acc, [name]: promisify(fs[name]) }), {})

async function readJsonFile(fileName) {
  const fileExists = await fs.exists(fileName)
  if (!fileExists) {
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

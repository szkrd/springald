const fs = require('fs')

module.exports = (fileName) => {
  if (!fs.existsSync(fileName)) {
    return null
  }
  let contents = fs.readFileSync(fileName, 'utf8')
  try {
    contents = JSON.parse(contents)
  } catch (err) {
    console.error(`Could not parse json "${fileName}"`)
    return null
  }
  return contents
}

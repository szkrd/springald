const $ = require('./getElementById')

// useful for swallowing down and up arrow press on the input itself
// (so that we can disable jumping to the beginning or the end of the input value)
function disableKeyDownForElement(elementId = '', keyNames = []) {
  const eventName = 'keydown'
  $(elementId).addEventListener(eventName, (event) => {
    if (keyNames.includes(event.key)) {
      event.preventDefault()
    }
  })
}

module.exports = disableKeyDownForElement

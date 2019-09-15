const $ = require('./getElementById')

// when an input is focused the body will get a marker class
function inputFocusClassToBody(elementId = '') {
  const className = `${elementId}-focused`
  $(elementId).addEventListener('focus', () => $('body').classList.add(className))
  $(elementId).addEventListener('blur', () => $('body').classList.remove(className))
}

module.exports = inputFocusClassToBody

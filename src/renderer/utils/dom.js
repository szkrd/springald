;(function () {
  // useful for swallowing down and up arrow press on the input itself
  // (so that we can disable jumping to the beginning or the end of the input value)
  function disableKeyDownForElement(selector = '', keyNames = []) {
    $(selector).on('keydown', (event) => {
      if (keyNames.includes(event.key)) {
        event.preventDefault()
      }
    })
  }

  // when an input is focused the body will get a marker class
  function inputFocusClassToBody(selector = '') {
    const elementId = selector.replace(/[^a-z-_0-9]/g, '')
    const className = `${elementId}-focused`
    $(selector).on('focus', () => $('body').classList.add(className))
    $(selector).on('blur', () => $('body').classList.remove(className))
  }

  // poor man's jQuery
  // (the only thing I like this for is that it's pretty easy to
  // spot a selector in the code, plus of course lazyness)

  function on(eventName, action) {
    return this.addEventListener(eventName, action)
  }

  function $(selector) {
    if (typeof selector === 'function' && arguments.length === 1) {
      return $('document').on('DOMContentLoaded', selector) // onDomReady
    }
    let el
    if (selector === 'window' || selector === window) {
      el = window
    } else if (selector === 'document' || selector === document) {
      el = document
    } else if (selector === 'body') {
      el = document.body
    } else if (selector.startsWith('#')) {
      el = document.getElementById(selector.replace(/^#/, ''))
    } else {
      el = document.querySelector(selector)
    }
    if (el) {
      el.on = el.on || on.bind(el)
    }
    return el
  }

  function $$(selector) {
    return Array.from(document.querySelectorAll(selector))
  }

  window.app.utils.dom = {
    $,
    $$,
    disableKeyDownForElement,
    inputFocusClassToBody,
  }
})()

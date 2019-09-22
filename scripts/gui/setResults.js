import escapeHtml from '../utils/escapeHtml'
import underline from './multiHtmlUnderline'
import multiSplitSearch from '../utils/multiSplitSearch'
import store from '../store'
import context from '../context'

function createName(item, needles) {
  let text = item.searchableText
  if (multiSplitSearch(text, needles)) {
    text = underline(text, needles)
  }
  return text
}

function setResults(needles) {
  const items = store.found
  const els = context.document.querySelectorAll('.result')
  els.forEach((el) => {
    el.style.display = 'none'
  })

  for (let i = 0, l = items.length; i < l; i++) {
    const item = items[i]
    const el = context.document.getElementById(`result-${i}`)
    if (!el) {
      return
    }
    el.style.display = 'block'
    // this will mark elements by their type (in case I want to colorize them):
    // type-UNSET, type-FB_MENUITEM, type-PATHITEM, type-DIRITEM
    el.className = el.className.replace(/type-[A-Z]+/, `type-${item.type}`)
    el.innerHTML = escapeHtml(createName(item, needles))
    el.dataset.id = item.id
  }
}

export default setResults

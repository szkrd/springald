import escapeRex from './escapeRex'
import uniq from './uniq'

// we do not care for recursive matches
function multiSplitSearch(text, needles) {
  needles = Array.isArray(needles) ? uniq(needles) : [needles]
  let score = 0
  let strictMatch = 0
  needles.forEach((needle) => {
    const lowNeedle = needle.toLocaleLowerCase()
    let varText = text
    // all lowercase
    if (needle === lowNeedle) {
      varText = varText.toLocaleLowerCase()
      needle = lowNeedle
    }
    score += (varText.match(escapeRex(needle), 'g') || []).length
    strictMatch += (varText.indexOf(needle) > -1) * 1
  })
  // when all words are present, boost the score
  if (strictMatch === needles.length) {
    score = score + 100
  }

  return score
}

export default multiSplitSearch

import escapeRex from '../utils/escapeRex'
import consts from '../consts'
import uniq from '../utils/uniq'

function multiHtmlUnderline(text, needles) {
  const prefix = consts.U_PREFIX
  const postfix = consts.U_POSTFIX
  needles = Array.isArray(needles) ? uniq(needles) : [needles]
  needles.forEach((needle) => {
    text = text.replace(new RegExp(escapeRex(needle), 'gi'), (match) => prefix + match + postfix)
  })
  return text
}

export default multiHtmlUnderline

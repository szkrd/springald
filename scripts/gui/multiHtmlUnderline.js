const PREFIX = '<u>';
const POSTFIX = '</u>';

function multiHtmlUnderlineUnique (text, needles, step = 0) {
  let needle = needles[step];
  if (text.indexOf(needle) > -1) {
    let split = text.split(needle);
    if (needles[step + 1]) {
      split = split.map(sub => multiHtmlUnderlineUnique(sub, needles, step + 1));
    }
    return split.join(PREFIX + needle + POSTFIX);
  } else {
    return text;
  }
}

function multiHtmlUnderline (text, needles) {
  needles = Array.isArray(needles) ? [...new Set(needles)] : [needles];
  return multiHtmlUnderlineUnique(text, needles);
}

module.exports = multiHtmlUnderline;

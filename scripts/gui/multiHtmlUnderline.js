const PREFIX = '<u>';
const POSTFIX = '</u>';

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function multiHtmlUnderlineUnique (text, needles, step = 0) {
  // this incorrectly nests tags, plus ehm, it is not so good
  // maybe some weird utf marker would be fine... like an nbspish thing
  needles.forEach(needle => {
    text = text.replace(new RegExp(escapeRegExp(needle), 'g'), PREFIX + needle + POSTFIX);
  });
  return text;
  /*
  // this is really broken
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
  */
}

function multiHtmlUnderline (text, needles) {
  needles = Array.isArray(needles) ? [...new Set(needles)] : [needles];
  return multiHtmlUnderlineUnique(text, needles);
}

module.exports = multiHtmlUnderline;

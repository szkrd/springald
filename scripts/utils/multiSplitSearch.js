// FIXME this is serious overengineering :(
// probably a simple count with match count sum would be fine
// where all needles found would have a heavily boosted score
function multiSplitSearchUnique (text, needles, step = 0, sum = 0) {
  let needle = needles[step];
  if (text.indexOf(needle) > -1) {
    let split = text.split(needle);
    sum += split.length - 1;
    if (needles[step + 1]) {
      split.forEach(sub => {
        for (let i = 0, l = needles.length; i < l; i++) {
          if (i !== step) {
            sum += multiSplitSearchUnique(sub, needles, i, 0);
          }
        }
      });
    }
  } else {
    return 0;
  }
  return sum; // how about sum * (step + 10)?
}

function multiSplitSearch (text, needles) {
  needles = Array.isArray(needles) ? [...new Set(needles)] : [needles];
  return multiSplitSearchUnique(text, needles);
}

module.exports = multiSplitSearch;

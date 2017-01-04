function multiSplitSearchUnique (text, needles, step = 0, sum = 0) {
  let needle = needles[step];
  if (text.indexOf(needle) > -1) {
    let split = text.split(needle);
    sum += split.length - 1;
    if (needles[step + 1]) {
      split.forEach(sub => {
        sum += multiSplitSearchUnique(sub, needles, step + 1, 0);
      });
    }
  } else {
    return 0;
  }
  return sum;
}

function multiSplitSearch (text, needles) {
  needles = Array.isArray(needles) ? [...new Set(needles)] : [needles];
  return multiSplitSearchUnique(text, needles);
}

module.exports = multiSplitSearch;

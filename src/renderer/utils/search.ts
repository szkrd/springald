import { escapeRegExp } from './string';

/**
 * Get the score for a search.
 *
 * We search in `text` (haystack) with multiple strings (needles);
 * multiple matches result in a higher score.
 *
 * (We do not care for recursive matches.)
 */
export function getScore(text: string, needles: string[]): number {
  needles = Array.isArray(needles) ? [...new Set(needles)] : [needles];
  let score = 0;
  let strictMatch = 0;
  needles.forEach((needle) => {
    const lowNeedle = needle.toLocaleLowerCase();
    let varText: string = text;
    // all lowercase
    if (needle === lowNeedle) {
      varText = varText.toLocaleLowerCase();
      needle = lowNeedle;
    }
    score += (varText.match(new RegExp(escapeRegExp(needle), 'g')) || []).length;
    strictMatch += +(varText.indexOf(needle) > -1); // every match increases by one
  });
  // when all words are present, boost the score
  if (strictMatch === needles.length) {
    score = score + 100;
  }

  return score;
}

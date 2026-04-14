import { getScore } from '../utils/search';
import { ISearchItem } from './parseAll';

function compareByScore(a: ISearchItem, b: ISearchItem) {
  const aScore = a.score!; // here score will always exist, we filtered out non scorables
  const bScore = b.score!;
  if (aScore > bScore) {
    return -1;
  } else if (aScore < bScore) {
    return 1;
  }
  return 0;
}

/**
 * Filters and orders the listed search items according to their score.
 *
 * @param items   searchitems, that are the basis of the filtering; `score` will be attached to the item
 * @param needles strings from the search input (`aaa bbb` will be `["aaa", "bbb"]` since the default AND separator is space)
 * @returns
 */
export function filterSearchItems(items: ISearchItem[], needles: string[]) {
  const THROW_AWAY_LESS_USEFUL = true;
  const getScoreForNeedles = (text: string) => getScore(text, needles);
  if (!needles || !needles.length) {
    return [];
  }
  let filtered = items.filter((item) => {
    const score = getScoreForNeedles(item.searchableText ?? '');
    if (score) {
      item.score = score; // yay, a mutant kitten died here (but this is fast and efficient)
      return true;
    }
  });
  filtered = filtered.sort(compareByScore);
  // try to throw away less useful items
  if (needles.length > 1 && THROW_AWAY_LESS_USEFUL) {
    const highest = (filtered[0] || {}).score || 0;
    filtered = filtered.filter((item) => item.score === highest);
  }
  return filtered;
}

import { getPreferredOpenWith } from './getPreferredOpenWith';
import { filterSearchItems } from './filterSearchItems';
import { handleError } from './handleError';
import { highlightSelectedResult } from './highlightSelectedResult';
import { renderPage } from './renderPage';
import { renderResults } from './renderResults';
import { setAppLoading } from './setAppLoading';
import { setWindowSize } from './setWindowSize';

export const runtime = {
  getPreferredOpenWith,
  filterSearchItems,
  handleError,
  highlightSelectedResult,
  renderPage,
  renderResults,
  setAppLoading,
  setWindowSize,
};

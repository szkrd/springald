const getPreferredOpenWith = require('./getPreferredOpenWith');
const filterSearchItems = require('./filterSearchItems');
const handleError = require('./handleError');
const highlightSelectedResult = require('./highlightSelectedResult');
const renderPage = require('./renderPage');
const renderResults = require('./renderResults');
const setAppLoading = require('./setAppLoading');
const setWindowSize = require('./setWindowSize');

const runtime = {
  getPreferredOpenWith,
  filterSearchItems,
  handleError,
  highlightSelectedResult,
  renderPage,
  renderResults,
  setAppLoading,
  setWindowSize,
};

module.exports = runtime;

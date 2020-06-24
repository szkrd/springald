window.app.constants = {
  // in case you are searching for <u>, which is pretty much zero
  U_PREFIX: '[\u00a0u\u00a0]',
  U_POSTFIX: '[/\u00a0u\u00a0]',
  // on the ui
  MAX_RESULT_ITEMS: 30,
  // used for the window resize
  MAX_VISIBLE_ITEM_COUNT: 6,
  // only if the user config has a falsy override
  FALLBACK_WIN_WIDTH: 600,
}

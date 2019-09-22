const consts = Object.freeze({
  // in case you are searching for <u>, which is pretty much zero
  U_PREFIX: '[\u00a0u\u00a0]',
  U_POSTFIX: '[/\u00a0u\u00a0]',
  // on the ui
  MAX_RESULT_ITEMS: 30,
  DESKTOP_FILES_LOCATION: '/usr/share/applications/' // TODO [ ..., '~/.local/share/applications']
})

export default consts

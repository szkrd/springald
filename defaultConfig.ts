const defaultConfig = () => ({
  theme: 'default',
  winWidth: 800,
  unixSocket: '/tmp/springald.sock',
  fluxboxMenuFile: '~/.fluxbox/menu',
  showOnStartup: true,
  centerOnShow: true,
  toggleKey: 'Command+Q',
  refreshKey: 'F5',
  logicalAndSeparator: ' ',
  includeFiles: ['\\.(txt|md|html|docx|pdf|jpe?g|png|avi|mkv|mp4)$'],
  excludeFiles: ['^\\._'],
  excludedDirs: ['^node_modules$', '^\\.'],
  excludeHidSys: true,
  terminalCommand: 'gnome-terminal -e %CMD%',
  appShortcuts: {
    showItemInFolder: 'F',
    launchInTerminal: 'T'
  },
  directories: ['~/Downloads', '~/Pictures', '~/Videos']
})
export default defaultConfig

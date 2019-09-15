// based on the osenv package
const env = process.env;
const user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME || '';
let home = env.HOME || '';

if (process.platform === 'win32') {
  home = env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || '';
}

if (process.platform === 'darwin') {
  home = home || (user ? '/Users/' + user : '');
}

if (process.platform === 'linux') {
  const isRoot = process.getuid() === 0;
  const rootHome = '/root';
  const nonRootHome = user ? `/home/${user}` : '';
  home = home || (isRoot ? rootHome : nonRootHome);
}

// returns home path or empty string
function getHomeDir () {
  return home;
}

module.exports = getHomeDir;

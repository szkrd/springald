const chalk = require('chalk')

const getColor = (type = 'INFO') => {
  return (
    {
      WARN: 'yellow',
      WARNING: 'yellow',
      INFO: 'green',
      ERROR: 'red',
    }[type.toUpperCase()] || 'cyan'
  )
}

// internal nwjs messages that I couldn't care less for
const blacklist = [
  "process type 'renderer' should be created through the zygote",
  'PushMessagingService could not be built',
  'Desktop Identity Consistency cannot be enabled',
  'Pref observer for media_router.cast_allow_all_ips found at shutdown',
]

/**
 * prints an nwjs log line colored and cleaned up
 */
module.exports = function printPrettyLogLine(s = '') {
  // skip blacklisted messages
  for (let i = 0; i < blacklist.length; i++) {
    if (s.toLowerCase().includes(blacklist[i].toLowerCase())) {
      return
    }
  }
  // nwjs log line (internal):
  // `[18255:18255:0531/184934.133512:ERROR:viz_main_impl.cc(152)] Exiting GPU process due to errors during initialization`
  // our log line:
  // `[18229:18229:0531/184934.243494:INFO:CONSOLE(37)] "[WARN] test warn", source: /home/szabi/Projects/personal/springald/scripts/utils/log.js (37)`
  // `[19434:19434:0531/192626.494511:INFO:CONSOLE(38)] "[ERROR] test error,{"foobar":true}", source: /home/szabi/Projects/personal/springald/scripts/utils/log.js (38)`
  let match = s.match(/^\[([^\]]*)] "\[(WARN|INFO|ERROR)] (.*?)", source: (.*)/)
  let msg = null
  if (match && match.length === 5) {
    // our line matched
    msg = {
      from: 'app',
      nw: match[1],
      type: match[2],
      items: match[3],
      location: match[4],
    }
  } else {
    match = s.match(/^\[([^\]]*)] (.*)/)
    if (match && match.length === 3) {
      // nwjs line matched
      msg = {
        from: 'nwjs',
        nw: match[1],
        items: match[2],
      }
      const details = msg.nw.match(/:(WARNING|INFO|ERROR):(.*\(\d+\))$/)
      if (details && details.length === 3) {
        msg.type = details[1]
        msg.location = details[2]
      }
    }
  }
  // unknown message type
  if (!msg) {
    console.log(chalk.white(s))
    return
  }
  // sometimes we loose messages in stderr for some unfathomable reason, which is unsettling
  // (it's not our error per se, they're just not printed by nwjs, since the remote logger catches it fine)
  const color = chalk[getColor(msg.type)]
  if (msg.items.includes('", source: ')) {
    msg.location = String(msg.items.match(/", source:(.*)/)[1]).trim()
    msg.items = msg.items.replace(/", source:.*$/, '')
  }
  console.log(color(`[${msg.type}]: ${msg.items.replace(/ \|\| /g, '\n')}`))
  // line number from log.js itself is irrelevant
  if (!/\/log\.js \(\d+\)/.test(msg.location)) {
    console.log(chalk.gray(msg.location))
  }
}

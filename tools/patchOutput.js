const fs = require('fs')
const chalk = require('chalk')
const tsConfig = require('../tsconfig.json')

function patchOutput() {
  const target = tsConfig.compilerOptions.outFile
  let source = fs.readFileSync(target, 'utf-8')
  source = source.replace(/equire/g, 'exuire').replace(/exuire\(/g, 'equire(')
  fs.writeFileSync(target, source)
  console.log(chalk.cyan(`Patched ${target}`))
}

// if used from the cli (called directly)
if (require.main === module) {
  patchOutput()
}

module.exports = patchOutput

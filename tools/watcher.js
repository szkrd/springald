// pretty much taken from
// https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
//
// this file starts the tsc watcher programmatically and implements
// an on compile finished hook, where it patches the AMD "require"
// function usage, rendering all "require" calls to go through node
// (the renamed "rexuire" can be used by almond.js and is still
// needed to bootstrap the app)
const chalk = require('chalk')
const ts = require('typescript')
const patchOutput = require('./patchOutput')

const formatHost = {
  getCanonicalFileName: (path) => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => '' // ts.sys.newLine
}

function watchMain() {
  const configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json')
  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.")
  }

  // ts.createEmitAndSemanticDiagnosticsBuilderProgram,
  // ts.createSemanticDiagnosticsBuilderProgram
  // ts.createAbstractBuilder
  const createProgram = ts.createSemanticDiagnosticsBuilderProgram

  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatusChanged
  )

  // on compilation finished "hook" via monkey patching
  // (for before compilation we could use `host.createProgram`)
  const origPostProgramCreate = host.afterProgramCreate
  host.afterProgramCreate = (program) => {
    origPostProgramCreate(program)
    patchOutput()
  }

  ts.createWatchProgram(host)
}

function reportDiagnostic(diagnostic) {
  console.error(
    'Error',
    diagnostic.code,
    ':',
    ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())
  )
}

// Prints a diagnostic every time the watch status changes.
// This is mainly for messages like "Starting compilation" or "Compilation completed".
function reportWatchStatusChanged(diagnostic) {
  console.info(chalk.grey(ts.formatDiagnostic(diagnostic, formatHost)))
}

watchMain()

import testDep, { foobar } from './testDep'
const chalk = require('chalk')

console.log(chalk.red('hello world'), 42, testDep, foobar)
console.log(chalk.yellow('weird test 2 3 4 5 6 8'))

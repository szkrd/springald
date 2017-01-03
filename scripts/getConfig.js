const path = require('path');
const config = require('../config.json');
const context = require('./context');
const readJsonFile = require('./utils/readJsonFile');

let parsed = false;

function getConfig () {
  if (!parsed) {
    Object.assign(config, readJsonFile(path.join(context.app.dataPath, 'config.json')) || {});
    parsed = true;
  }
  return config;
}

module.exports = getConfig;

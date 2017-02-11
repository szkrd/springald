const fs = require('fs');
const path = require('path');
const context = require('../context');
const consts = require('../consts');

function resultItems () {
  let ret = '';
  for (let i = 0; i < consts.MAX_RESULT_ITEMS; i++) {
    ret += `<div class="result" id="result-${i}" style="display:none">${i}</div>`;
  }
  return ret;
}

function overrideCss () {
  let fileName = path.join(context.dataPath, 'override.css');
  if (!fs.existsSync(fileName)) {
    return '';
  }
  let contents = fs.readFileSync(fileName, 'utf-8');
  if (contents.indexOf('</') > -1) {
    console.error('Please refrain from using html-ish tags in the override css.');
    return '';
  }
  return contents;
}

function renderTemplate () {
  return `
    <style type="text/css">${overrideCss()}</style>
    <input type="text" class="search" id="search" />
    <input type="text" class="app" id="app" />
    <div class="current" id="current"></div>
    <div class="results">${resultItems()}</div>
  `.replace(/\s+/g, ' ').replace(/> </g, '><');
}

module.exports = renderTemplate;

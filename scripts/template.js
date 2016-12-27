const MAX_RESULT_ITEMS = 30;

function resultItems () {
  let ret = '';
  for (let i = 0; i < MAX_RESULT_ITEMS; i++) {
    ret += `<div class="result" id="result-${i}" style="display:none">${i}</div>`
  }
  return ret;
}

module.exports = `
  <input type="text" class="search" id="search" />
  <input type="text" class="app" id="app" />
  <div class="current" id="current"></div>
  <div class="results">${resultItems()}</div>
`.replace(/\s+/g, ' ').replace(/> </g, '><');

#!/bin/bash
cd "$(dirname "${BASH_SOURCE[0]}")"
# non-interactive (no nvm function, but we have a sourceable nvm script)
if [ -z "$(type -t nvm)" ] && [ -f "${HOME}/.nvm/nvm.sh" ]; then source "${HOME}/.nvm/nvm.sh"; fi
# interactive (nvm is a function and .nvm exists)
if [ "$(type -t nvm)" = 'function' ] && [ -d "${HOME}/.nvm" ]; then nvm use; fi
# do you have node now?
if [[ $(command -v node | wc -l) -eq 0 ]]; then
  echo "node command not found, exiting"
  exit 1
fi
# is this node new enough?
if [ "$(node --version | cut -d . -f 1 | cut -c 2-)" -lt 12 ]; then
  echo "node too old, use v12+"
  exit 2
fi
if [ ! -f "./node_modules/.bin/electron" ]; then npm install; fi
node ./node_modules/.bin/electron . > output.log

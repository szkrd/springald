#!/bin/bash
if [ "$(type -t nvm)" = 'function' ] && [ -d "${HOME}/.nvm" ]; then nvm use; fi
if [ ! -f "./node_modules/.bin/electron" ]; then npm install; fi
node ./node_modules/.bin/electron . > output.log

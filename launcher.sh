#!/bin/bash
# if socat is installed and we have a running instance's socket, then just toggle that instance
if [[ $(command -v socat | wc -l) -eq 1 && -S "/tmp/springald.sock" ]]; then
  echo "socket /tmp/springald.sock exists, toggling instance"
  echo toggle | socat UNIX:/tmp/springald.sock -
  exit 0
fi
# check if we symlinked the launcher
SRC="${BASH_SOURCE[0]}"
SYMLNKSRC="$(readlink -f $SRC)"
if [ ! -z "${SYMLNKSRC}" ]; then SRC=$SYMLNKSRC; fi
cd "$(dirname "${SRC}")"
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
# no electron, install it
if [ ! -f "./node_modules/.bin/electron" ]; then npm install; fi
# finally, run the app
node ./node_modules/.bin/electron . > output.log

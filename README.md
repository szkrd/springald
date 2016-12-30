# springald

Springald is a simple launcher, similar to Launchy. It is written in vanilla-js(tm) and
uses the nwjs framework.

## Launching

* git clone
* cd springald && npm i
* nwjs .

See `config.json` for settings.

_Esc_ hides, _ctrl + q_ quits, _mod4 + q_ toggles.

## TODO

- [X] parse simple fluxbox menu, spawn process
- [ ] handle includes in fluxbox menu file
- [ ] allow css overriding
- [ ] allow configuration overriding
- [ ] break up main.js (refactor)
- [ ] walk path, collect executables and whitelsited filenames
- [ ] walk directories
- [ ] second input field should let you choose an executable
- [ ] shell open for non executable files
- [ ] recursive search / multiple needles
- [ ] save/reuse search and selection association (aka. learning)

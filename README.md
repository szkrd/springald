# springald

Springald is a simple launcher, similar to Launchy. It is written in vanilla-js(tm) and
uses the nwjs framework.

## Launching

* git clone
* cd springald && npm i
* nwjs .

See `config.json` for settings.

_Esc_ hides, _ctrl + q_ quits, _mod4 + q_ toggles.

## Overrides

* config: create a `~/.config/springald/config.json` file. ([options](./config.json))
* styles: create a `~/.config/springald/override.css` file. ([variables](./styles/variables.css), [more](./styles/springald.css))

On OSX and Windows this is [elsewhere](http://docs.nwjs.io/en/latest/References/App/#appdatapath).

## TODO

- [X] parse simple fluxbox menu, spawn process
- [ ] handle includes in fluxbox menu file
- [X] allow css overriding
- [X] allow configuration overriding
- [ ] break up main.js (refactor)
- [X] walk path, collect executables
- [ ] walk directories recursively
- [ ] dir walker: use whitelist (ext) and blacklist (dir)
- [ ] second input field should let you choose an executable
- [ ] shell open for non executable files
- [ ] folder open (with 'folder' as openWith)
- [X] recursive search / multiple needles
- [X] case insensitive search (when there are no uppercase chars in the search string)
- [ ] save/reuse search and selection association (aka. learning)
- [ ] save all results, load on startup

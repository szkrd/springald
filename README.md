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

- [x] parse simple fluxbox menu, spawn process
- [x] handle includes in fluxbox menu file
- [x] allow css overriding
- [x] allow configuration overriding
- [x] walk path, collect executables
- [x] walk directories recursively
- [x] dir walker: use whitelist (ext) and blacklist (dir)
- [x] use .desktop files for autocomplete in app field
- [x] folder open (with 'folder' or 'F' as openWith)
- [x] recursive search / multiple needles
- [x] case insensitive search (when there are no uppercase chars in the search string)
- [ ] dir walker: skip hidden and system on windows (both files and dirs)
- [ ] second input field should let you choose an executable [WIP]
- [ ] shell open for non executable files
- [ ] save/reuse search and selection association (aka. learning)
- [ ] save all results, load on startup
- [ ] break up main.js (refactor)

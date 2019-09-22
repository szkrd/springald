var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define("scripts/models/ILaunchable", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
});
define("scripts/context", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
    var context = {
        dataPath: '',
        window: null,
        document: null,
        gui: null,
        app: null
    };
    exports["default"] = context;
});
define("scripts/consts", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
    var consts = Object.freeze({
        // in case you are searching for <u>, which is pretty much zero
        U_PREFIX: '[\u00a0u\u00a0]',
        U_POSTFIX: '[/\u00a0u\u00a0]',
        // on the ui
        MAX_RESULT_ITEMS: 30,
        DESKTOP_FILES_LOCATION: '/usr/share/applications/' // TODO [ ..., '~/.local/share/applications']
    });
    exports["default"] = consts;
});
define("scripts/gui/renderTemplate", ["rexuire", "exports", "scripts/context", "scripts/consts"], function (rexuire, exports, context_1, consts_1) {
    "use strict";
    exports.__esModule = true;
    var fs = require('fs');
    var path = require('path');
    function resultItems() {
        var ret = '';
        for (var i = 0; i < consts_1["default"].MAX_RESULT_ITEMS; i++) {
            ret += "<div class=\"result type-UNSET\" id=\"result-" + i + "\" style=\"display:none\">" + i + "</div>";
        }
        return ret;
    }
    function overrideCss() {
        var fileName = path.join(context_1["default"].dataPath, 'override.css');
        if (!fs.existsSync(fileName)) {
            return '';
        }
        var contents = fs.readFileSync(fileName, 'utf-8');
        if (contents.indexOf('</') > -1) {
            console.error('Please refrain from using html-ish tags in the override css.');
            return '';
        }
        return contents;
    }
    function renderTemplate() {
        return ("\n    <style type=\"text/css\">" + overrideCss() + "</style>\n    <input type=\"text\" class=\"search\" id=\"search\" autocomplete=\"off\"/>\n    <input type=\"text\" class=\"app\" id=\"app\" autocomplete=\"off\" />\n    <span class=\"ghost\" id=\"ghost\"></span>\n    <div class=\"input-focus-indicator\"></div>\n    <div class=\"current\" id=\"current\"></div>\n    <div class=\"results\">" + resultItems() + "</div>\n  ")
            .replace(/\s+/g, ' ')
            .replace(/> </g, '><');
    }
    exports["default"] = renderTemplate;
});
define("scripts/utils/readJsonFile", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
    var fs = require('fs');
    exports["default"] = (function (fileName) {
        if (!fs.existsSync(fileName)) {
            return null;
        }
        var contents = fs.readFileSync(fileName, 'utf8');
        try {
            contents = JSON.parse(contents);
        }
        catch (err) {
            console.error("Could not parse json \"" + fileName + "\"");
            return null;
        }
        return contents;
    });
});
define("defaultConfig", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
    var defaultConfig = function () { return ({
        theme: 'default',
        winWidth: 800,
        unixSocket: '/tmp/springald.sock',
        fluxboxMenuFile: '~/.fluxbox/menu',
        showOnStartup: true,
        centerOnShow: true,
        toggleKey: 'Command+Q',
        refreshKey: 'F5',
        logicalAndSeparator: ' ',
        includeFiles: ['\\.(txt|md|html|docx|pdf|jpe?g|png|avi|mkv|mp4)$'],
        excludeFiles: ['^\\._'],
        excludedDirs: ['^node_modules$', '^\\.'],
        excludeHidSys: true,
        terminalCommand: 'gnome-terminal -e %CMD%',
        appShortcuts: {
            showItemInFolder: 'F',
            launchInTerminal: 'T'
        },
        directories: ['~/Downloads', '~/Pictures', '~/Videos']
    }); };
    exports["default"] = defaultConfig;
});
define("scripts/getConfig", ["rexuire", "exports", "scripts/context", "scripts/utils/readJsonFile", "defaultConfig"], function (rexuire, exports, context_2, readJsonFile_1, defaultConfig_1) {
    "use strict";
    exports.__esModule = true;
    var path = require('path');
    var config = defaultConfig_1["default"]();
    var parsed = false;
    function getConfig() {
        if (!parsed) {
            Object.assign(config, readJsonFile_1["default"](path.join(context_2["default"].dataPath, 'config.json')) || {});
            config.development = process.env.NODE_ENV === 'development';
            parsed = true;
        }
        return config;
    }
    exports["default"] = getConfig;
});
define("scripts/utils/uniq", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
    // returns unique items, creates new array
    function default_1(arr) {
        return arr.filter(function (val, i, self) { return self.indexOf(val) === i; });
    }
    exports["default"] = default_1;
});
define("scripts/parsing/parseDirs", ["rexuire", "exports", "scripts/getConfig", "scripts/utils/uniq"], function (rexuire, exports, getConfig_1, uniq_1) {
    "use strict";
    exports.__esModule = true;
    var fs = require('fs');
    var path = require('path');
    var os = require('os');
    var counter = 0;
    function isAllowedFile(name) {
        var regTest = function (r, n) { return new RegExp(r).test(n); };
        var config = getConfig_1["default"]();
        var incRules = config.includeFiles;
        var excRules = config.excludeFiles;
        return incRules.every(function (rule) { return regTest(rule, name); }) && excRules.every(function (rule) { return !regTest(rule, name); });
    }
    function isAllowedDir(name) {
        var config = getConfig_1["default"]();
        var rules = config.excludedDirs;
        name = name.split('/').pop();
        return !rules.some(function (rule) { return new RegExp(rule).test(name); });
    }
    // as seen on the interwebz
    function walk(dir, done) {
        var results = [];
        // TODO investigate {encoding: 'buffer'} further
        fs.readdir(dir, function (err, list) {
            if (err) {
                err.file = dir;
                return done(err); // pretty much this is the only hard error that may stop the walking
            }
            var pending = list.length;
            var mayEnd = function () {
                if (!--pending) {
                    done(null, results);
                }
            };
            if (!pending) {
                return done(null, results);
            }
            list.forEach(function (file) {
                var name = file;
                file = path.resolve(dir, file);
                fs.stat(file, function (err, stat) {
                    if (err) {
                        console.error("Could not stat file \"" + file + "\".", err);
                        mayEnd();
                        return; // skip current loop, but not the whole walking
                    }
                    if (stat && stat.isDirectory()) {
                        if (isAllowedDir(name)) {
                            walk(file, function (err, res) {
                                if (err) {
                                    console.error("Could not read subdirectory \"" + file + "\"");
                                }
                                else {
                                    results = results.concat(res);
                                }
                                mayEnd();
                            });
                        }
                        else {
                            mayEnd();
                        }
                    }
                    else {
                        var fileNameOnly = path.basename(file);
                        if (isAllowedFile(fileNameOnly)) {
                            var parsed = path.parse(file);
                            results.push({
                                id: "d" + counter++,
                                executable: false,
                                type: 'DIRITEM',
                                path: parsed.dir,
                                name: parsed.base,
                                command: file // full path
                            });
                        }
                        mayEnd();
                    }
                }); // end stat
            }); // end list forEach
        }); // end readdir
    }
    // parse the "directories" (section from the config)
    function parseDirs() {
        return new Promise(function (resolve, reject) {
            // first we replace the ~ with the proper home path
            var homeDir = os.homedir();
            var config = getConfig_1["default"]();
            var dirs = uniq_1["default"](config.directories || []);
            dirs = dirs.map(function (dir) { return dir.replace(/~/, homeDir).replace(/\\/g, '/'); }); // TODO normalize for path.sep
            // then check if all the directories exist
            dirs = dirs.filter(function (dir) { return fs.existsSync(dir); });
            var processedCount = 0;
            var results = [];
            // recursively process all the files in thes directories
            var walkDirCallback = function (err, res) {
                processedCount++;
                if (err) {
                    console.error("\u2620\uFE0F Directory walker error: could not read directory \"" + err.file + "\"!"); // nw console error is a bit simple
                    return;
                }
                results.push.apply(results, res);
                if (processedCount === dirs.length) {
                    // we will never reject here, since not being able to
                    // parse a directory is not a showstopper
                    resolve(results);
                }
            };
            dirs.forEach(function (dir) { return walk(dir, walkDirCallback); });
        });
    }
    exports["default"] = parseDirs;
});
define("scripts/utils/isExec", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
    var os = require('os');
    var isWin = /^win/.test(os.platform());
    function isExec(extension, mode) {
        var ox = !!(((mode << 6) >> 6) & 1);
        var gx = !!(((mode << 3) >> 6) & 1);
        var ux = !!((mode >> 6) & 1);
        var exe = /\.(exe|bat|cmd)$/.test(extension);
        return isWin ? exe : ux || gx || ox;
    }
    exports["default"] = isExec;
});
define("scripts/parsing/parsePath", ["rexuire", "exports", "scripts/consts", "scripts/utils/isExec", "scripts/utils/uniq"], function (rexuire, exports, consts_2, isExec_1, uniq_2) {
    "use strict";
    exports.__esModule = true;
    var path = require('path');
    var fs = require('fs');
    var promisify = require('util').promisify;
    var fsReaddir = promisify(fs.readdir);
    var counter = 0;
    // linux only: get global .desktop files, strip the "extensions"
    // and return only the basename part (no path either)
    function getDesktopFriendlies() {
        return __awaiter(this, void 0, void 0, function () {
            var location, files, err_1, onlyDesktopExtensions, baseNameOnly;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        location = consts_2["default"].DESKTOP_FILES_LOCATION;
                        files = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fsReaddir(location)];
                    case 2:
                        files = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        files = [];
                        return [3 /*break*/, 4];
                    case 4:
                        onlyDesktopExtensions = function (fn) { return /\.desktop$/.test(fn); };
                        baseNameOnly = function (fn) { return fn.replace(/\.desktop$/, ''); };
                        return [2 /*return*/, files.filter(onlyDesktopExtensions).map(baseNameOnly)];
                }
            });
        });
    }
    // node injects the project's local bin directory to the path
    function isLocalNodeBin(s) {
        return /springald[/\\]node_modules/.test(s);
    }
    function readDir(location) {
        return new Promise(function (resolve, reject) {
            var results = [];
            fs.readdir(location, function (err, files) {
                // not a show stopper, but still annoying
                if (err) {
                    console.error("\u2620\uFE0F Could not read location \"${location}\", skipping.");
                    resolve([]);
                    return;
                }
                var itemCount = files.length;
                var processCount = 0;
                if (!files.length) {
                    resolve([]);
                }
                files.forEach(function (file) {
                    file = path.resolve(location, file);
                    fs.stat(file, function (err, stats) {
                        if (err) {
                            // on Ubuntu some packages may leave broken symlinks behind, so
                            // getting a file not found error is not that uncommon
                            // in that case go and delete that file yourself...
                            console.error("\u2620\uFE0F Could not stat path \"" + file + "\", skipping!");
                            resolve([]);
                            return;
                        }
                        processCount++;
                        if (stats.isFile()) {
                            var parsed = path.parse(file);
                            // on the path non executables are not interesting
                            if (isExec_1["default"](parsed.ext, stats.mode) && !isLocalNodeBin(file)) {
                                results.push({
                                    id: "p" + counter++,
                                    executable: true,
                                    type: 'PATHITEM',
                                    path: parsed.dir,
                                    name: parsed.base,
                                    desktop: false,
                                    command: file // full path
                                });
                            }
                        }
                        if (processCount === itemCount) {
                            resolve(results);
                        }
                    }); // end stat
                }); // end forEach
            }); // end readdir
        }); // end Promise
    }
    function parsePath() {
        var result = [];
        var pathItems = process.env.PATH.split(path.delimiter);
        var dirs = uniq_2["default"](pathItems);
        if (pathItems.length !== dirs.length) {
            console.warn('You have duplicate items in your PATH!');
        }
        dirs = dirs.filter(function (dir) { return fs.existsSync(dir); });
        var all = __spreadArrays([getDesktopFriendlies()], dirs.map(function (dir) { return readDir(dir); }));
        return Promise.all(all).then(function (packs) {
            // first item is an array of desktop files, let's remove that
            // (in this list `/usr/share/applications/foobar.desktop` is just `foobar`)
            var desktops = packs.shift();
            // then rest are individual executables found in path dirs
            packs.forEach(function (pack) { return result.push.apply(result, pack); });
            // if an executable file name has a ".desktop" version then it
            // has a desktop file, so we would like to add it to the "with app"
            // list of openers (since it's meant to be used on the gui for sure)
            //
            // (that was the original scope, but I'm beginning to miss shortcuts
            // that are available in gnome's default search, but not in springald's)
            //
            // (unfortunately .desktop "shortcuts" can have different contents
            // and this method will not deal with those, for example
            // `gnome-keyboard-panel.desktop` launches `gnome-control-center keyboard`
            // which is an executable AND a parameter)
            if (desktops.length) {
                result.forEach(function (fn) {
                    var idxInDesktopsArray = desktops.indexOf(fn.name);
                    if (idxInDesktopsArray > -1) {
                        fn.desktop = true;
                        desktops[idxInDesktopsArray] = null;
                    }
                });
            }
            return Promise.resolve(result);
        }, function (err) {
            err.module = 'parsePath';
            return Promise.reject(err);
        });
    }
    exports["default"] = parsePath;
});
define("scripts/parsing/parseFluxboxMenu", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
    var os = require('os');
    var path = require('path');
    var fs = require('fs');
    var counter = 0;
    var homeDir = os.homedir();
    function parse(s, depth) {
        if (depth === void 0) { depth = []; }
        return new Promise(function (resolve, reject) {
            s = s.replace(/\r\n/g, '\n');
            var itemPath = depth;
            var ret = [];
            var lines = s.split(/\n/);
            for (var i = 0, l = lines.length; i < l; i++) {
                var line = lines[i].trim();
                var name_1 = line.replace(/[^(]*\(/, '').replace(/([^\\])\).*/, '$1');
                // submenu
                if (/^\[submenu]/.test(line)) {
                    // we ignore the {title} part of the submenu `[submenu] (foo) {foo title}`
                    name_1 = name_1.replace(/\\\)/g, ')'); // unescape "\)" to ")"
                    itemPath.push(name_1);
                }
                // end of submenu
                if (/^\[end]/.test(line)) {
                    itemPath.pop();
                }
                // executable
                if (/^\[exec]/.test(line)) {
                    name_1 = name_1.replace(/\\\)/g, ')'); // unescape "\)" to ")"
                    var command = line.replace(/[^{]*\{/, '').replace(/([^\\])}.*/, '$1');
                    ret.push({
                        id: "f" + counter++,
                        executable: true,
                        type: 'FB_MENUITEM',
                        path: '/' + itemPath.join('/'),
                        name: name_1,
                        command: command
                    });
                }
                // included menu
                if (/^\[include]/.test(line)) {
                    parseFluxboxMenu(name_1, itemPath).then(function (results) { return ret.push.apply(ret, results); });
                }
            }
            resolve(ret);
        });
    }
    function parseFluxboxMenu(fileName, depth) {
        if (depth === void 0) { depth = []; }
        depth = Array.from(depth);
        fileName = (fileName || '').replace(/~/, homeDir);
        var menuFile = fileName || path.join(homeDir, '.fluxbox', 'menu');
        return new Promise(function (resolve, reject) {
            if (!fs.existsSync(menuFile)) {
                console.info('No fluxbox menu file found.');
                resolve([]);
                return;
            }
            fs.readFile(menuFile, 'utf8', function (err, contents) {
                if (err) {
                    err.module = 'parseFluxboxMenu';
                    reject(err);
                }
                else {
                    parse(contents, depth).then(function (result) { return resolve(result); });
                }
            });
        });
    }
    exports["default"] = parseFluxboxMenu;
});
define("scripts/parsing/getSearchableText", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
    var path = require('path');
    var os = require('os');
    var homeDir = os.homedir();
    // this will be the text we can search against
    function getSearchableText(item) {
        var prefix = '';
        var separator = path.sep;
        var itemPath = item.path;
        if (item.type === 'FB_MENUITEM') {
            // an item found in the fluxbox menu file
            prefix = 'fb:';
            separator = '/';
        }
        else if (item.type === 'PATHITEM') {
            // an item on the path
            prefix = 'p:';
        }
        else if (item.type === 'DIRITEM') {
            // an item found in the list of extra directories (config)
            prefix = 'd:';
        }
        if (item.type === 'PATHITEM' || item.type === 'DIRITEM') {
            itemPath = itemPath.replace(homeDir, '~');
        }
        return (prefix + itemPath + separator + item.name).replace(/\/+/g, '/'); // fb root level and extra separator
    }
    exports["default"] = getSearchableText;
});
define("scripts/gui/appLoading", ["rexuire", "exports", "scripts/context"], function (rexuire, exports, context_3) {
    "use strict";
    exports.__esModule = true;
    function appLoading(state) {
        context_3["default"].document.body.classList[state ? 'add' : 'remove']('loading');
    }
    exports["default"] = appLoading;
});
define("scripts/store", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
    var store = {
        withApp: '',
        visible: true,
        current: 0,
        ghost: null,
        searchItems: [],
        found: []
    };
    exports["default"] = store;
});
define("scripts/parsing/parseAll", ["rexuire", "exports", "scripts/parsing/parseDirs", "scripts/parsing/parsePath", "scripts/parsing/parseFluxboxMenu", "scripts/parsing/getSearchableText", "scripts/gui/appLoading", "scripts/getConfig", "scripts/store"], function (rexuire, exports, parseDirs_1, parsePath_1, parseFluxboxMenu_1, getSearchableText_1, appLoading_1, getConfig_2, store_1) {
    "use strict";
    exports.__esModule = true;
    function parseAll() {
        appLoading_1["default"](true);
        var startedAt = Date.now();
        var config = getConfig_2["default"]();
        var fbMenuFile = config.fluxboxMenuFile;
        store_1["default"].searchItems.length = 0;
        return Promise.all([parseFluxboxMenu_1["default"](fbMenuFile), parsePath_1["default"](), parseDirs_1["default"]()]).then(function (itemPacks) {
            itemPacks.forEach(function (items) { return store_1["default"].searchItems.push.apply(store_1["default"].searchItems, items); });
            // add the searchable text, which shall be unified for all item types
            // (and it must be available for the search AND the gui)
            store_1["default"].searchItems.forEach(function (item) {
                item.searchableText = getSearchableText_1["default"](item);
            });
            var endedAt = Date.now();
            console.info("Parsed " + store_1["default"].searchItems.length + " items in " + (endedAt - startedAt) + " ms.");
            appLoading_1["default"](false);
        }, function (err) {
            console.error("\u2620\uFE0F Parse error in parser module \"" + (err.module || 'unknown') + "\"!\n", err);
        });
    }
    exports["default"] = parseAll;
});
define("scripts/utils/escapeRex", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
    var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
    function escapeRegExp(str) {
        return str.replace(matchOperatorsRe, '\\$&');
    }
    exports["default"] = escapeRegExp;
});
define("scripts/utils/escapeHtml", ["rexuire", "exports", "scripts/utils/escapeRex", "scripts/consts"], function (rexuire, exports, escapeRex_1, consts_3) {
    "use strict";
    exports.__esModule = true;
    // escape html, but allow underlines
    function escapeHtml(unsafe) {
        var prefix = consts_3["default"].U_PREFIX;
        var postfix = consts_3["default"].U_POSTFIX;
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(new RegExp(escapeRex_1["default"](prefix), 'g'), '<u>')
            .replace(new RegExp(escapeRex_1["default"](postfix), 'g'), '</u>');
    }
    exports["default"] = escapeHtml;
});
define("scripts/gui/multiHtmlUnderline", ["rexuire", "exports", "scripts/utils/escapeRex", "scripts/consts", "scripts/utils/uniq"], function (rexuire, exports, escapeRex_2, consts_4, uniq_3) {
    "use strict";
    exports.__esModule = true;
    function multiHtmlUnderline(text, needles) {
        var prefix = consts_4["default"].U_PREFIX;
        var postfix = consts_4["default"].U_POSTFIX;
        needles = Array.isArray(needles) ? uniq_3["default"](needles) : [needles];
        needles.forEach(function (needle) {
            text = text.replace(new RegExp(escapeRex_2["default"](needle), 'gi'), function (match) { return prefix + match + postfix; });
        });
        return text;
    }
    exports["default"] = multiHtmlUnderline;
});
define("scripts/utils/multiSplitSearch", ["rexuire", "exports", "scripts/utils/escapeRex", "scripts/utils/uniq"], function (rexuire, exports, escapeRex_3, uniq_4) {
    "use strict";
    exports.__esModule = true;
    // we do not care for recursive matches
    function multiSplitSearch(text, needles) {
        needles = Array.isArray(needles) ? uniq_4["default"](needles) : [needles];
        var score = 0;
        var strictMatch = 0;
        needles.forEach(function (needle) {
            var lowNeedle = needle.toLocaleLowerCase();
            var varText = text;
            // all lowercase
            if (needle === lowNeedle) {
                varText = varText.toLocaleLowerCase();
                needle = lowNeedle;
            }
            score += (varText.match(escapeRex_3["default"](needle), 'g') || []).length;
            strictMatch += (varText.indexOf(needle) > -1) * 1;
        });
        // when all words are present, boost the score
        if (strictMatch === needles.length) {
            score = score + 100;
        }
        return score;
    }
    exports["default"] = multiSplitSearch;
});
define("scripts/gui/setResults", ["rexuire", "exports", "scripts/utils/escapeHtml", "scripts/gui/multiHtmlUnderline", "scripts/utils/multiSplitSearch", "scripts/store", "scripts/context"], function (rexuire, exports, escapeHtml_1, multiHtmlUnderline_1, multiSplitSearch_1, store_2, context_4) {
    "use strict";
    exports.__esModule = true;
    function createName(item, needles) {
        var text = item.searchableText;
        if (multiSplitSearch_1["default"](text, needles)) {
            text = multiHtmlUnderline_1["default"](text, needles);
        }
        return text;
    }
    function setResults(needles) {
        var items = store_2["default"].found;
        var els = context_4["default"].document.querySelectorAll('.result');
        els.forEach(function (el) {
            el.style.display = 'none';
        });
        for (var i = 0, l = items.length; i < l; i++) {
            var item = items[i];
            var el = context_4["default"].document.getElementById("result-" + i);
            if (!el) {
                return;
            }
            el.style.display = 'block';
            // this will mark elements by their type (in case I want to colorize them):
            // type-UNSET, type-FB_MENUITEM, type-PATHITEM, type-DIRITEM
            el.className = el.className.replace(/type-[A-Z]+/, "type-" + item.type);
            el.innerHTML = escapeHtml_1["default"](createName(item, needles));
            el.dataset.id = item.id;
        }
    }
    exports["default"] = setResults;
});
define("scripts/utils/getElementById", ["rexuire", "exports", "scripts/context"], function (rexuire, exports, context_5) {
    "use strict";
    exports.__esModule = true;
    function getElementById(elementId) {
        return context_5["default"].document.getElementById(elementId);
    }
    exports["default"] = getElementById;
});
define("scripts/utils/inputFocusClassToBody", ["rexuire", "exports", "scripts/utils/getElementById"], function (rexuire, exports, getElementById_1) {
    "use strict";
    exports.__esModule = true;
    // when an input is focused the body will get a marker class
    function inputFocusClassToBody(elementId) {
        if (elementId === void 0) { elementId = ''; }
        var className = elementId + "-focused";
        getElementById_1["default"](elementId).addEventListener('focus', function () { return getElementById_1["default"]('body').classList.add(className); });
        getElementById_1["default"](elementId).addEventListener('blur', function () { return getElementById_1["default"]('body').classList.remove(className); });
    }
    exports["default"] = inputFocusClassToBody;
});
define("scripts/utils/disableKeyDownForElement", ["rexuire", "exports", "scripts/utils/getElementById"], function (rexuire, exports, getElementById_2) {
    "use strict";
    exports.__esModule = true;
    // useful for swallowing down and up arrow press on the input itself
    // (so that we can disable jumping to the beginning or the end of the input value)
    function disableKeyDownForElement(elementId, keyNames) {
        if (elementId === void 0) { elementId = ''; }
        if (keyNames === void 0) { keyNames = []; }
        var eventName = 'keydown';
        getElementById_2["default"](elementId).addEventListener(eventName, function (event) {
            if (keyNames.includes(event.key)) {
                event.preventDefault();
            }
        });
    }
    exports["default"] = disableKeyDownForElement;
});
define("scripts/filterSearchItems", ["rexuire", "exports", "scripts/utils/multiSplitSearch"], function (rexuire, exports, multiSplitSearch_2) {
    "use strict";
    exports.__esModule = true;
    var throwAwayLessUseful = true;
    // higher score first
    function compare(a, b) {
        if (a.score > b.score) {
            return -1;
        }
        else if (a.score < b.score) {
            return 1;
        }
        return 0;
    }
    function filterSearchItems(items, needles) {
        var getScore = function (text) { return multiSplitSearch_2["default"](text, needles); };
        if (!needles || !needles.length) {
            return [];
        }
        var filtered = items.filter(function (item) {
            var score = getScore(item.searchableText);
            if (score) {
                item.score = score; // yay, a mutant kitten died here
                return true;
            }
        });
        filtered = filtered.sort(compare);
        // try to throw away less useful items
        if (needles.length > 1 && throwAwayLessUseful) {
            var highest_1 = (filtered[0] || {}).score || 0;
            filtered = filtered.filter(function (item) { return item.score === highest_1; });
        }
        return filtered;
    }
    exports["default"] = filterSearchItems;
});
define("scripts/openItem", ["rexuire", "exports", "scripts/context", "scripts/getConfig"], function (rexuire, exports, context_6, getConfig_3) {
    "use strict";
    exports.__esModule = true;
    var os = require('os');
    var superchild = require('superchild');
    // TODO support for withApp parameter
    // see for example: https://github.com/sindresorhus/opn
    // TODO return false on error
    function openItem(item, withApp) {
        var config = getConfig_3["default"]();
        var gui = context_6["default"].gui;
        var isWin = /^win/.test(os.platform());
        var defaultParamsForProcesses = { cwd: os.homedir() };
        // WIP: on windows we just launch the command, sorry
        if (isWin) {
            gui.Shell.openItem(item.command);
            return true;
        }
        // shortcut for open with default file manager
        if (withApp === config.appShortcuts.showItemInFolder) {
            gui.Shell.showItemInFolder(item.command);
            return true;
        }
        // open in terminal (preferred terminal emulator can be set in config.terminalCommand)
        if (withApp === config.appShortcuts.launchInTerminal) {
            var command = config.terminalCommand.replace(/%CMD%/, item.command);
            superchild(command, defaultParamsForProcesses);
            return true;
        }
        // desktops, pathexecs or fluxbox commands (the latter is kinda weird I guess)
        // this of course can create interesting scenarios (like opening a fluxbox
        // command with a mediaplayer, but let's assume the user knows what he or she does)
        if (typeof withApp === 'object' && withApp !== null && withApp.command) {
            superchild(withApp.command + " \"" + item.command + "\"");
            return true;
        }
        // xdg open will not launch shellscripts for instance
        if (item.executable) {
            superchild(item.command, defaultParamsForProcesses);
            return true;
        }
        else {
            gui.Shell.openItem(item.command);
            return true;
        }
    }
    exports["default"] = openItem;
});
define("springald", ["rexuire", "exports", "scripts/gui/renderTemplate", "scripts/parsing/parseAll", "scripts/gui/setResults", "scripts/utils/escapeHtml", "scripts/utils/inputFocusClassToBody", "scripts/utils/disableKeyDownForElement", "scripts/getConfig", "scripts/filterSearchItems", "scripts/openItem", "scripts/store", "scripts/context"], function (rexuire, exports, renderTemplate_1, parseAll_1, setResults_1, escapeHtml_2, inputFocusClassToBody_1, disableKeyDownForElement_1, getConfig_4, filterSearchItems_1, openItem_1, store_3, context_7) {
    "use strict";
    exports.__esModule = true;
    var os = require('os');
    var net = require('net');
    var gui = require('nw.gui');
    var win = gui.Window.get();
    // const log = require('./scripts/utils/log')
    var MAX_VISIBLE_ITEM_COUNT = 6;
    var unixServer = null;
    var config = null;
    var tray = null;
    var trayMenu = null;
    var trayMenuItems = [];
    var globalToggleShortcut = null;
    var $ = function (id) { return document.getElementById(id); };
    context_7["default"].window = window;
    context_7["default"].document = document;
    context_7["default"].gui = gui;
    context_7["default"].app = nw.App;
    context_7["default"].dataPath = nw.App.dataPath.replace(/[/\\]Default[/\\]?$/, '');
    function hide() {
        win.hide();
        store_3["default"].visible = false;
    }
    function show() {
        if (config.centerOnShow) {
            win.setPosition('center');
        }
        win.show();
        win.restore(); // this is kinda erratic with gnome desktop
        store_3["default"].visible = true;
        var searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.focus();
        }
    }
    function toggle() {
        if (store_3["default"].visible) {
            hide();
        }
        else {
            show();
        }
    }
    // tray icon and right click menu
    // (the right click menu may not work though,
    // see https://github.com/nwjs/nw.js/issues/6715)
    function setupTray() {
        tray = new nw.Tray({
            title: 'Tray',
            icon: 'assets/icon-16x16.png'
        });
        trayMenu = new nw.Menu();
        // quit
        var item = new nw.MenuItem({
            type: 'normal',
            label: 'quit',
            click: function () {
                win.close();
            }
        });
        trayMenuItems.push(item);
        trayMenu.append(item);
        // toggle visibility
        item = new nw.MenuItem({
            type: 'normal',
            label: 'toggle',
            click: function () {
                toggle();
            }
        });
        trayMenuItems.push(item);
        trayMenu.append(item);
        tray.menu = trayMenu;
        tray.on('click', toggle);
    }
    function setCurrent() {
        if (!store_3["default"].found.length || !store_3["default"].found[store_3["default"].current]) {
            return;
        }
        $('current').textContent = store_3["default"].found[store_3["default"].current].command;
    }
    function markCurrentResult() {
        var all = document.querySelectorAll('.result');
        if (store_3["default"].current < 0) {
            store_3["default"].current = 0;
        }
        if (store_3["default"].current > all.length - 1) {
            store_3["default"].current = all.length - 1;
        }
        var el = $("result-" + store_3["default"].current);
        if (el) {
            all.forEach(function (current) {
                current.classList.remove('selected');
            });
            el.classList.add('selected');
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    // resizable must be true in pcakge.json for gnome, otherwise
    // the window manager will ignore resize requests
    function setWindowSize() {
        var style = window.getComputedStyle($('current'), null);
        var itemHeight = parseInt(style.height.replace(/px/, ''), 10);
        var itemMax = Math.min(store_3["default"].found.length, MAX_VISIBLE_ITEM_COUNT);
        var height = itemHeight + itemHeight * itemMax;
        height += store_3["default"].found.length ? itemHeight : 0;
        win.resizeTo(config.winWidth || 600, height);
    }
    function onSearchChange(e) {
        var val = (e.target.value || '').trim();
        var needles = val ? val.split(config.logicalAndSeparator) : [];
        store_3["default"].found = filterSearchItems_1["default"](store_3["default"].searchItems, needles);
        store_3["default"].current = 0;
        setCurrent();
        setResults_1["default"](needles);
        markCurrentResult();
        setWindowSize();
    }
    function onAppChange(e) {
        var val = (e.target.value || '').trim();
        var matchingApp;
        store_3["default"].withApp = val;
        // do not trigger for one letter
        if (val.length > 1) {
            var desktopItems = store_3["default"].searchItems.filter(function (item) { return item.desktop; });
            // if we can't find it in the desktop friendly list, then try harder
            matchingApp =
                desktopItems.find(function (item) { return item.name.startsWith(val); }) ||
                    store_3["default"].searchItems.find(function (item) { return item.name.startsWith(val) && item.executable; });
        }
        $('ghost').innerHTML = matchingApp ? escapeHtml_2["default"](matchingApp.name) : '';
        store_3["default"].ghost = matchingApp || null;
    }
    function onDocumentKey(e) {
        if (e.key === 'Enter') {
            launch();
            hide();
        }
        if (e.key === config.refreshKey) {
            parseAll_1["default"]();
        }
        if (e.key === 'c' && e.ctrlKey) {
            win.setPosition('center');
        }
        if (e.key === 'Escape') {
            hide();
        }
        if (e.key === 'q' && e.ctrlKey) {
            win.close();
        }
        if (config.development && e.key === 'r' && e.ctrlKey) {
            reloadApp();
        }
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.key)) {
            e.stopPropagation();
            if (e.key === 'ArrowUp') {
                store_3["default"].current = (store_3["default"].current - 1) % store_3["default"].found.length;
            }
            else if (e.key === 'ArrowDown') {
                store_3["default"].current = (store_3["default"].current + 1) % store_3["default"].found.length;
            }
            else if (e.key === 'PageUp') {
                store_3["default"].current = Math.max(store_3["default"].current - MAX_VISIBLE_ITEM_COUNT, 0);
            }
            else if (e.key === 'PageDown') {
                store_3["default"].current = Math.min(store_3["default"].current + MAX_VISIBLE_ITEM_COUNT, store_3["default"].found.length - 1);
            }
            markCurrentResult();
            setCurrent();
        }
    }
    function removeTray() {
        tray.remove();
        tray = null;
        trayMenuItems.forEach(function (item) {
            trayMenu.remove(item);
        });
        trayMenu = null;
    }
    function onWinMinimize() {
        hide();
    }
    function onDomReady() {
        console.log(4, 'READY');
        document.body.className = "theme-" + config.theme;
        document.body.innerHTML = renderTemplate_1["default"]();
        setWindowSize();
        // add a helper class to the body, so that we can move the focus
        // indicator line below the focused input with css animation
        inputFocusClassToBody_1["default"]('search');
        inputFocusClassToBody_1["default"]('app');
        // disable jumping to start / end of input.value
        disableKeyDownForElement_1["default"]('search', ['ArrowUp', 'ArrowDown']);
        disableKeyDownForElement_1["default"]('app', ['ArrowUp', 'ArrowDown']);
        $('search').focus();
        $('search').addEventListener('input', onSearchChange);
        $('app').addEventListener('input', onAppChange);
        parseAll_1["default"]();
    }
    function launch() {
        if (!store_3["default"].found.length) {
            return false;
        }
        var item = store_3["default"].found[store_3["default"].current];
        if (!item) {
            return false;
        }
        openItem_1["default"](item, store_3["default"].ghost || store_3["default"].withApp);
        $('app').value = store_3["default"].withApp = $('ghost').innerHTML = '';
        store_3["default"].ghost = null;
        hide();
    }
    function setGlobalShortcut() {
        var option = {
            key: config.toggleKey,
            active: toggle,
            failed: function (msg) {
                console.error("Failed to register hotkey \"" + config.toggleKey + "\"");
            }
        };
        globalToggleShortcut = new nw.Shortcut(option);
        nw.App.registerGlobalHotKey(globalToggleShortcut);
    }
    function removeGlobalShortcut() {
        nw.App.unregisterGlobalHotKey(globalToggleShortcut);
        globalToggleShortcut = null;
    }
    // ipc interface
    function createUnixSocket() {
        if (os.platform() !== 'linux') {
            return;
        }
        unixServer = net.createServer(function (client) {
            client.on('data', function (data) {
                data = (data.toString() || '').trim();
                if (data === 'show') {
                    show();
                }
                else if (data === 'hide') {
                    hide();
                }
                else if (data === 'toggle') {
                    toggle();
                }
                else if (data === 'reload') {
                    reloadApp();
                }
                else if (data === 'quit' || data === 'close') {
                    win.close();
                }
            });
        });
        unixServer.listen(config.unixSocket);
    }
    function removeUnixSocket(callback) {
        if (!unixServer) {
            callback();
            return;
        }
        unixServer.close(callback);
    }
    // tear down
    function onWinClose() {
        var _this = this;
        var close = function () { return _this.close(true); };
        this.hide();
        if (unixServer) {
            unixServer.close(close);
        }
        else {
            close();
        }
    }
    function reloadApp() {
        // tray and global shortcuts are "outside" the rloadable window
        removeTray();
        removeGlobalShortcut();
        // not sure if these are needed, but better be safe than leak memory
        win.removeListener('minimize', onWinMinimize);
        win.removeListener('close', onWinClose);
        document.removeEventListener('keyup', onDocumentKey);
        document.removeEventListener('DOMContentLoaded', onDomReady);
        document.body.className = '';
        document.body.innerHTML = '';
        // flush node's rexuire cache
        for (var cacheItem in rexuire.cache) {
            delete rexuire.cache[cacheItem];
        }
        removeUnixSocket(function () {
            config = null;
            unixServer = null;
            win.reload(); // finally kaboom
        });
    }
    function run() {
        config = getConfig_4["default"]();
        createUnixSocket();
        setupTray();
        setGlobalShortcut();
        win.on('minimize', onWinMinimize);
        win.on('close', onWinClose);
        document.addEventListener('keyup', onDocumentKey);
        onDomReady();
        // we could disable the context menu for config.development
        // but the proper way is to have "chromium-args": "--disable-devtools"
        // in package.json (for a prod build, plus removing the copy-paste menu is not nice)
        hide();
        if (config.showOnStartup || config.development) {
            setTimeout(show, 0); // rendered size determines the screen position
        }
    }
    // ----
    run();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ByaW5nYWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NyaXB0cy9tb2RlbHMvSUxhdW5jaGFibGUudHMiLCJzY3JpcHRzL2NvbnRleHQuanMiLCJzY3JpcHRzL2NvbnN0cy5qcyIsInNjcmlwdHMvZ3VpL3JlbmRlclRlbXBsYXRlLmpzIiwic2NyaXB0cy91dGlscy9yZWFkSnNvbkZpbGUuanMiLCJkZWZhdWx0Q29uZmlnLnRzIiwic2NyaXB0cy9nZXRDb25maWcuanMiLCJzY3JpcHRzL3V0aWxzL3VuaXEudHMiLCJzY3JpcHRzL3BhcnNpbmcvcGFyc2VEaXJzLmpzIiwic2NyaXB0cy91dGlscy9pc0V4ZWMuanMiLCJzY3JpcHRzL3BhcnNpbmcvcGFyc2VQYXRoLmpzIiwic2NyaXB0cy9wYXJzaW5nL3BhcnNlRmx1eGJveE1lbnUuanMiLCJzY3JpcHRzL3BhcnNpbmcvZ2V0U2VhcmNoYWJsZVRleHQuanMiLCJzY3JpcHRzL2d1aS9hcHBMb2FkaW5nLmpzIiwic2NyaXB0cy9zdG9yZS5qcyIsInNjcmlwdHMvcGFyc2luZy9wYXJzZUFsbC5qcyIsInNjcmlwdHMvdXRpbHMvZXNjYXBlUmV4LmpzIiwic2NyaXB0cy91dGlscy9lc2NhcGVIdG1sLmpzIiwic2NyaXB0cy9ndWkvbXVsdGlIdG1sVW5kZXJsaW5lLmpzIiwic2NyaXB0cy91dGlscy9tdWx0aVNwbGl0U2VhcmNoLmpzIiwic2NyaXB0cy9ndWkvc2V0UmVzdWx0cy5qcyIsInNjcmlwdHMvdXRpbHMvZ2V0RWxlbWVudEJ5SWQuanMiLCJzY3JpcHRzL3V0aWxzL2lucHV0Rm9jdXNDbGFzc1RvQm9keS5qcyIsInNjcmlwdHMvdXRpbHMvZGlzYWJsZUtleURvd25Gb3JFbGVtZW50LmpzIiwic2NyaXB0cy9maWx0ZXJTZWFyY2hJdGVtcy5qcyIsInNjcmlwdHMvb3Blbkl0ZW0uanMiLCJzcHJpbmdhbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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LENBQUEsQ0FBQyxpQkFBaUI7UUFDaEMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsU0FBUyxHQUFHO1FBQ1YsTUFBTSxHQUFHLHNCQUFTLEVBQUUsQ0FBQTtRQUNwQixnQkFBZ0IsRUFBRSxDQUFBO1FBQ2xCLFNBQVMsRUFBRSxDQUFBO1FBQ1gsaUJBQWlCLEVBQUUsQ0FBQTtRQUNuQixHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQTtRQUNqQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQTtRQUMzQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFBO1FBQ2pELFVBQVUsRUFBRSxDQUFBO1FBQ1osMkRBQTJEO1FBQzNELHNFQUFzRTtRQUN0RSxvRkFBb0Y7UUFDcEYsSUFBSSxFQUFFLENBQUE7UUFDTixJQUFJLE1BQU0sQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtZQUM5QyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBLENBQUMsK0NBQStDO1NBQ3BFO0lBQ0gsQ0FBQztJQUVELE9BQU87SUFFUCxHQUFHLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBJTGF1bmNoYWJsZSB7XG4gIGlkOiBzdHJpbmdcbiAgZXhlY3V0YWJsZTogYm9vbGVhblxuICB0eXBlOiBzdHJpbmdcbiAgcGF0aDogc3RyaW5nXG4gIG5hbWU6IHN0cmluZ1xuICBjb21tYW5kOiBzdHJpbmdcbiAgZGVza3RvcDogYm9vbGVhblxufVxuIiwiY29uc3QgY29udGV4dCA9IHtcbiAgZGF0YVBhdGg6ICcnLFxuICB3aW5kb3c6IG51bGwsXG4gIGRvY3VtZW50OiBudWxsLFxuICBndWk6IG51bGwsXG4gIGFwcDogbnVsbFxufVxuZXhwb3J0IGRlZmF1bHQgY29udGV4dFxuIiwiY29uc3QgY29uc3RzID0gT2JqZWN0LmZyZWV6ZSh7XG4gIC8vIGluIGNhc2UgeW91IGFyZSBzZWFyY2hpbmcgZm9yIDx1Piwgd2hpY2ggaXMgcHJldHR5IG11Y2ggemVyb1xuICBVX1BSRUZJWDogJ1tcXHUwMGEwdVxcdTAwYTBdJyxcbiAgVV9QT1NURklYOiAnWy9cXHUwMGEwdVxcdTAwYTBdJyxcbiAgLy8gb24gdGhlIHVpXG4gIE1BWF9SRVNVTFRfSVRFTVM6IDMwLFxuICBERVNLVE9QX0ZJTEVTX0xPQ0FUSU9OOiAnL3Vzci9zaGFyZS9hcHBsaWNhdGlvbnMvJyAvLyBUT0RPIFsgLi4uLCAnfi8ubG9jYWwvc2hhcmUvYXBwbGljYXRpb25zJ11cbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGNvbnN0c1xuIiwiaW1wb3J0IGNvbnRleHQgZnJvbSAnLi4vY29udGV4dCdcbmltcG9ydCBjb25zdHMgZnJvbSAnLi4vY29uc3RzJ1xuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbmZ1bmN0aW9uIHJlc3VsdEl0ZW1zKCkge1xuICBsZXQgcmV0ID0gJydcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb25zdHMuTUFYX1JFU1VMVF9JVEVNUzsgaSsrKSB7XG4gICAgcmV0ICs9IGA8ZGl2IGNsYXNzPVwicmVzdWx0IHR5cGUtVU5TRVRcIiBpZD1cInJlc3VsdC0ke2l9XCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj4ke2l9PC9kaXY+YFxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gb3ZlcnJpZGVDc3MoKSB7XG4gIGNvbnN0IGZpbGVOYW1lID0gcGF0aC5qb2luKGNvbnRleHQuZGF0YVBhdGgsICdvdmVycmlkZS5jc3MnKVxuICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZU5hbWUpKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cbiAgY29uc3QgY29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZU5hbWUsICd1dGYtOCcpXG4gIGlmIChjb250ZW50cy5pbmRleE9mKCc8LycpID4gLTEpIHtcbiAgICBjb25zb2xlLmVycm9yKCdQbGVhc2UgcmVmcmFpbiBmcm9tIHVzaW5nIGh0bWwtaXNoIHRhZ3MgaW4gdGhlIG92ZXJyaWRlIGNzcy4nKVxuICAgIHJldHVybiAnJ1xuICB9XG4gIHJldHVybiBjb250ZW50c1xufVxuXG5mdW5jdGlvbiByZW5kZXJUZW1wbGF0ZSgpIHtcbiAgcmV0dXJuIGBcbiAgICA8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+JHtvdmVycmlkZUNzcygpfTwvc3R5bGU+XG4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJzZWFyY2hcIiBpZD1cInNlYXJjaFwiIGF1dG9jb21wbGV0ZT1cIm9mZlwiLz5cbiAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImFwcFwiIGlkPVwiYXBwXCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgLz5cbiAgICA8c3BhbiBjbGFzcz1cImdob3N0XCIgaWQ9XCJnaG9zdFwiPjwvc3Bhbj5cbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZm9jdXMtaW5kaWNhdG9yXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImN1cnJlbnRcIiBpZD1cImN1cnJlbnRcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicmVzdWx0c1wiPiR7cmVzdWx0SXRlbXMoKX08L2Rpdj5cbiAgYFxuICAgIC5yZXBsYWNlKC9cXHMrL2csICcgJylcbiAgICAucmVwbGFjZSgvPiA8L2csICc+PCcpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlbmRlclRlbXBsYXRlXG4iLCJjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcblxuZXhwb3J0IGRlZmF1bHQgKGZpbGVOYW1lKSA9PiB7XG4gIGlmICghZnMuZXhpc3RzU3luYyhmaWxlTmFtZSkpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIGxldCBjb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhmaWxlTmFtZSwgJ3V0ZjgnKVxuICB0cnkge1xuICAgIGNvbnRlbnRzID0gSlNPTi5wYXJzZShjb250ZW50cylcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihgQ291bGQgbm90IHBhcnNlIGpzb24gXCIke2ZpbGVOYW1lfVwiYClcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIHJldHVybiBjb250ZW50c1xufVxuIiwiY29uc3QgZGVmYXVsdENvbmZpZyA9ICgpID0+ICh7XG4gIHRoZW1lOiAnZGVmYXVsdCcsXG4gIHdpbldpZHRoOiA4MDAsXG4gIHVuaXhTb2NrZXQ6ICcvdG1wL3NwcmluZ2FsZC5zb2NrJyxcbiAgZmx1eGJveE1lbnVGaWxlOiAnfi8uZmx1eGJveC9tZW51JyxcbiAgc2hvd09uU3RhcnR1cDogdHJ1ZSxcbiAgY2VudGVyT25TaG93OiB0cnVlLFxuICB0b2dnbGVLZXk6ICdDb21tYW5kK1EnLFxuICByZWZyZXNoS2V5OiAnRjUnLFxuICBsb2dpY2FsQW5kU2VwYXJhdG9yOiAnICcsXG4gIGluY2x1ZGVGaWxlczogWydcXFxcLih0eHR8bWR8aHRtbHxkb2N4fHBkZnxqcGU/Z3xwbmd8YXZpfG1rdnxtcDQpJCddLFxuICBleGNsdWRlRmlsZXM6IFsnXlxcXFwuXyddLFxuICBleGNsdWRlZERpcnM6IFsnXm5vZGVfbW9kdWxlcyQnLCAnXlxcXFwuJ10sXG4gIGV4Y2x1ZGVIaWRTeXM6IHRydWUsXG4gIHRlcm1pbmFsQ29tbWFuZDogJ2dub21lLXRlcm1pbmFsIC1lICVDTUQlJyxcbiAgYXBwU2hvcnRjdXRzOiB7XG4gICAgc2hvd0l0ZW1JbkZvbGRlcjogJ0YnLFxuICAgIGxhdW5jaEluVGVybWluYWw6ICdUJ1xuICB9LFxuICBkaXJlY3RvcmllczogWyd+L0Rvd25sb2FkcycsICd+L1BpY3R1cmVzJywgJ34vVmlkZW9zJ11cbn0pXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0Q29uZmlnXG4iLCJpbXBvcnQgY29udGV4dCBmcm9tICcuL2NvbnRleHQnXG5pbXBvcnQgcmVhZEpzb25GaWxlIGZyb20gJy4vdXRpbHMvcmVhZEpzb25GaWxlJ1xuaW1wb3J0IGRlZmF1bHRDb25maWcgZnJvbSAnLi4vZGVmYXVsdENvbmZpZydcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuY29uc3QgY29uZmlnID0gZGVmYXVsdENvbmZpZygpXG5sZXQgcGFyc2VkID0gZmFsc2VcblxuZnVuY3Rpb24gZ2V0Q29uZmlnKCkge1xuICBpZiAoIXBhcnNlZCkge1xuICAgIE9iamVjdC5hc3NpZ24oY29uZmlnLCByZWFkSnNvbkZpbGUocGF0aC5qb2luKGNvbnRleHQuZGF0YVBhdGgsICdjb25maWcuanNvbicpKSB8fCB7fSlcbiAgICBjb25maWcuZGV2ZWxvcG1lbnQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50J1xuICAgIHBhcnNlZCA9IHRydWVcbiAgfVxuICByZXR1cm4gY29uZmlnXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldENvbmZpZ1xuIiwiLy8gcmV0dXJucyB1bmlxdWUgaXRlbXMsIGNyZWF0ZXMgbmV3IGFycmF5XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbjxUPihhcnI6IFRbXSk6IFRbXSB7XG4gIHJldHVybiBhcnIuZmlsdGVyKCh2YWwsIGksIHNlbGYpID0+IHNlbGYuaW5kZXhPZih2YWwpID09PSBpKVxufVxuIiwiaW1wb3J0IGdldENvbmZpZyBmcm9tICcuLi9nZXRDb25maWcnXG5pbXBvcnQgdW5pcSBmcm9tICcuLi91dGlscy91bmlxJ1xuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJylcblxubGV0IGNvdW50ZXIgPSAwXG5cbmZ1bmN0aW9uIGlzQWxsb3dlZEZpbGUobmFtZSkge1xuICBjb25zdCByZWdUZXN0ID0gKHIsIG4pID0+IG5ldyBSZWdFeHAocikudGVzdChuKVxuICBjb25zdCBjb25maWcgPSBnZXRDb25maWcoKVxuICBjb25zdCBpbmNSdWxlcyA9IGNvbmZpZy5pbmNsdWRlRmlsZXNcbiAgY29uc3QgZXhjUnVsZXMgPSBjb25maWcuZXhjbHVkZUZpbGVzXG4gIHJldHVybiBpbmNSdWxlcy5ldmVyeSgocnVsZSkgPT4gcmVnVGVzdChydWxlLCBuYW1lKSkgJiYgZXhjUnVsZXMuZXZlcnkoKHJ1bGUpID0+ICFyZWdUZXN0KHJ1bGUsIG5hbWUpKVxufVxuXG5mdW5jdGlvbiBpc0FsbG93ZWREaXIobmFtZSkge1xuICBjb25zdCBjb25maWcgPSBnZXRDb25maWcoKVxuICBjb25zdCBydWxlcyA9IGNvbmZpZy5leGNsdWRlZERpcnNcbiAgbmFtZSA9IG5hbWUuc3BsaXQoJy8nKS5wb3AoKVxuICByZXR1cm4gIXJ1bGVzLnNvbWUoKHJ1bGUpID0+IG5ldyBSZWdFeHAocnVsZSkudGVzdChuYW1lKSlcbn1cblxuLy8gYXMgc2VlbiBvbiB0aGUgaW50ZXJ3ZWJ6XG5mdW5jdGlvbiB3YWxrKGRpciwgZG9uZSkge1xuICBsZXQgcmVzdWx0cyA9IFtdXG5cbiAgLy8gVE9ETyBpbnZlc3RpZ2F0ZSB7ZW5jb2Rpbmc6ICdidWZmZXInfSBmdXJ0aGVyXG4gIGZzLnJlYWRkaXIoZGlyLCAoZXJyLCBsaXN0KSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgZXJyLmZpbGUgPSBkaXJcbiAgICAgIHJldHVybiBkb25lKGVycikgLy8gcHJldHR5IG11Y2ggdGhpcyBpcyB0aGUgb25seSBoYXJkIGVycm9yIHRoYXQgbWF5IHN0b3AgdGhlIHdhbGtpbmdcbiAgICB9XG4gICAgbGV0IHBlbmRpbmcgPSBsaXN0Lmxlbmd0aFxuICAgIGNvbnN0IG1heUVuZCA9ICgpID0+IHtcbiAgICAgIGlmICghLS1wZW5kaW5nKSB7XG4gICAgICAgIGRvbmUobnVsbCwgcmVzdWx0cylcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFwZW5kaW5nKSB7XG4gICAgICByZXR1cm4gZG9uZShudWxsLCByZXN1bHRzKVxuICAgIH1cbiAgICBsaXN0LmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBmaWxlXG4gICAgICBmaWxlID0gcGF0aC5yZXNvbHZlKGRpciwgZmlsZSlcbiAgICAgIGZzLnN0YXQoZmlsZSwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihgQ291bGQgbm90IHN0YXQgZmlsZSBcIiR7ZmlsZX1cIi5gLCBlcnIpXG4gICAgICAgICAgbWF5RW5kKClcbiAgICAgICAgICByZXR1cm4gLy8gc2tpcCBjdXJyZW50IGxvb3AsIGJ1dCBub3QgdGhlIHdob2xlIHdhbGtpbmdcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhdCAmJiBzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICBpZiAoaXNBbGxvd2VkRGlyKG5hbWUpKSB7XG4gICAgICAgICAgICB3YWxrKGZpbGUsIChlcnIsIHJlcykgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgQ291bGQgbm90IHJlYWQgc3ViZGlyZWN0b3J5IFwiJHtmaWxlfVwiYClcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQocmVzKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG1heUVuZCgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXlFbmQoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBmaWxlTmFtZU9ubHkgPSBwYXRoLmJhc2VuYW1lKGZpbGUpXG4gICAgICAgICAgaWYgKGlzQWxsb3dlZEZpbGUoZmlsZU5hbWVPbmx5KSkge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gcGF0aC5wYXJzZShmaWxlKVxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgaWQ6IGBkJHtjb3VudGVyKyt9YCxcbiAgICAgICAgICAgICAgZXhlY3V0YWJsZTogZmFsc2UsIC8vIGlzRXhlYyhwYXJzZWQuZXh0LCBzdGF0cy5tb2RlKSwgPC0tIHNob3VsZG4ndCBiZSwgaXNuJ3QgaXQgYW5ub3lpbmcgdyBzYW1iYT9cbiAgICAgICAgICAgICAgdHlwZTogJ0RJUklURU0nLFxuICAgICAgICAgICAgICBwYXRoOiBwYXJzZWQuZGlyLFxuICAgICAgICAgICAgICBuYW1lOiBwYXJzZWQuYmFzZSxcbiAgICAgICAgICAgICAgY29tbWFuZDogZmlsZSAvLyBmdWxsIHBhdGhcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIG1heUVuZCgpXG4gICAgICAgIH1cbiAgICAgIH0pIC8vIGVuZCBzdGF0XG4gICAgfSkgLy8gZW5kIGxpc3QgZm9yRWFjaFxuICB9KSAvLyBlbmQgcmVhZGRpclxufVxuXG4vLyBwYXJzZSB0aGUgXCJkaXJlY3Rvcmllc1wiIChzZWN0aW9uIGZyb20gdGhlIGNvbmZpZylcbmZ1bmN0aW9uIHBhcnNlRGlycygpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyBmaXJzdCB3ZSByZXBsYWNlIHRoZSB+IHdpdGggdGhlIHByb3BlciBob21lIHBhdGhcbiAgICBjb25zdCBob21lRGlyID0gb3MuaG9tZWRpcigpXG4gICAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKClcbiAgICBsZXQgZGlycyA9IHVuaXEoY29uZmlnLmRpcmVjdG9yaWVzIHx8IFtdKVxuICAgIGRpcnMgPSBkaXJzLm1hcCgoZGlyKSA9PiBkaXIucmVwbGFjZSgvfi8sIGhvbWVEaXIpLnJlcGxhY2UoL1xcXFwvZywgJy8nKSkgLy8gVE9ETyBub3JtYWxpemUgZm9yIHBhdGguc2VwXG5cbiAgICAvLyB0aGVuIGNoZWNrIGlmIGFsbCB0aGUgZGlyZWN0b3JpZXMgZXhpc3RcbiAgICBkaXJzID0gZGlycy5maWx0ZXIoKGRpcikgPT4gZnMuZXhpc3RzU3luYyhkaXIpKVxuICAgIGxldCBwcm9jZXNzZWRDb3VudCA9IDBcbiAgICBjb25zdCByZXN1bHRzID0gW11cblxuICAgIC8vIHJlY3Vyc2l2ZWx5IHByb2Nlc3MgYWxsIHRoZSBmaWxlcyBpbiB0aGVzIGRpcmVjdG9yaWVzXG4gICAgY29uc3Qgd2Fsa0RpckNhbGxiYWNrID0gKGVyciwgcmVzKSA9PiB7XG4gICAgICBwcm9jZXNzZWRDb3VudCsrXG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYOKYoO+4jyBEaXJlY3Rvcnkgd2Fsa2VyIGVycm9yOiBjb3VsZCBub3QgcmVhZCBkaXJlY3RvcnkgXCIke2Vyci5maWxlfVwiIWApIC8vIG53IGNvbnNvbGUgZXJyb3IgaXMgYSBiaXQgc2ltcGxlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgcmVzdWx0cy5wdXNoLmFwcGx5KHJlc3VsdHMsIHJlcylcbiAgICAgIGlmIChwcm9jZXNzZWRDb3VudCA9PT0gZGlycy5sZW5ndGgpIHtcbiAgICAgICAgLy8gd2Ugd2lsbCBuZXZlciByZWplY3QgaGVyZSwgc2luY2Ugbm90IGJlaW5nIGFibGUgdG9cbiAgICAgICAgLy8gcGFyc2UgYSBkaXJlY3RvcnkgaXMgbm90IGEgc2hvd3N0b3BwZXJcbiAgICAgICAgcmVzb2x2ZShyZXN1bHRzKVxuICAgICAgfVxuICAgIH1cbiAgICBkaXJzLmZvckVhY2goKGRpcikgPT4gd2FsayhkaXIsIHdhbGtEaXJDYWxsYmFjaykpXG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcnNlRGlyc1xuIiwiY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpXG5jb25zdCBpc1dpbiA9IC9ed2luLy50ZXN0KG9zLnBsYXRmb3JtKCkpXG5cbmZ1bmN0aW9uIGlzRXhlYyhleHRlbnNpb24sIG1vZGUpIHtcbiAgY29uc3Qgb3ggPSAhISgoKG1vZGUgPDwgNikgPj4gNikgJiAxKVxuICBjb25zdCBneCA9ICEhKCgobW9kZSA8PCAzKSA+PiA2KSAmIDEpXG4gIGNvbnN0IHV4ID0gISEoKG1vZGUgPj4gNikgJiAxKVxuICBjb25zdCBleGUgPSAvXFwuKGV4ZXxiYXR8Y21kKSQvLnRlc3QoZXh0ZW5zaW9uKVxuICByZXR1cm4gaXNXaW4gPyBleGUgOiB1eCB8fCBneCB8fCBveFxufVxuXG5leHBvcnQgZGVmYXVsdCBpc0V4ZWNcbiIsImltcG9ydCBjb25zdHMgZnJvbSAnLi4vY29uc3RzJ1xuaW1wb3J0IGlzRXhlYyBmcm9tICcuLi91dGlscy9pc0V4ZWMnXG5pbXBvcnQgdW5pcSBmcm9tICcuLi91dGlscy91bmlxJ1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCB7IHByb21pc2lmeSB9ID0gcmVxdWlyZSgndXRpbCcpXG5jb25zdCBmc1JlYWRkaXIgPSBwcm9taXNpZnkoZnMucmVhZGRpcilcblxubGV0IGNvdW50ZXIgPSAwXG5cbi8vIGxpbnV4IG9ubHk6IGdldCBnbG9iYWwgLmRlc2t0b3AgZmlsZXMsIHN0cmlwIHRoZSBcImV4dGVuc2lvbnNcIlxuLy8gYW5kIHJldHVybiBvbmx5IHRoZSBiYXNlbmFtZSBwYXJ0IChubyBwYXRoIGVpdGhlcilcbmFzeW5jIGZ1bmN0aW9uIGdldERlc2t0b3BGcmllbmRsaWVzKCkge1xuICBjb25zdCBsb2NhdGlvbiA9IGNvbnN0cy5ERVNLVE9QX0ZJTEVTX0xPQ0FUSU9OXG4gIGxldCBmaWxlcyA9IFtdXG4gIHRyeSB7XG4gICAgZmlsZXMgPSBhd2FpdCBmc1JlYWRkaXIobG9jYXRpb24pXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGZpbGVzID0gW11cbiAgfVxuICBjb25zdCBvbmx5RGVza3RvcEV4dGVuc2lvbnMgPSAoZm4pID0+IC9cXC5kZXNrdG9wJC8udGVzdChmbilcbiAgY29uc3QgYmFzZU5hbWVPbmx5ID0gKGZuKSA9PiBmbi5yZXBsYWNlKC9cXC5kZXNrdG9wJC8sICcnKVxuICByZXR1cm4gZmlsZXMuZmlsdGVyKG9ubHlEZXNrdG9wRXh0ZW5zaW9ucykubWFwKGJhc2VOYW1lT25seSlcbn1cblxuLy8gbm9kZSBpbmplY3RzIHRoZSBwcm9qZWN0J3MgbG9jYWwgYmluIGRpcmVjdG9yeSB0byB0aGUgcGF0aFxuZnVuY3Rpb24gaXNMb2NhbE5vZGVCaW4ocykge1xuICByZXR1cm4gL3NwcmluZ2FsZFsvXFxcXF1ub2RlX21vZHVsZXMvLnRlc3Qocylcbn1cblxuZnVuY3Rpb24gcmVhZERpcihsb2NhdGlvbikge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBbXVxuICAgIGZzLnJlYWRkaXIobG9jYXRpb24sIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAvLyBub3QgYSBzaG93IHN0b3BwZXIsIGJ1dCBzdGlsbCBhbm5veWluZ1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGDimKDvuI8gQ291bGQgbm90IHJlYWQgbG9jYXRpb24gXCIkXFx7bG9jYXRpb259XCIsIHNraXBwaW5nLmApXG4gICAgICAgIHJlc29sdmUoW10pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBpdGVtQ291bnQgPSBmaWxlcy5sZW5ndGhcbiAgICAgIGxldCBwcm9jZXNzQ291bnQgPSAwXG4gICAgICBpZiAoIWZpbGVzLmxlbmd0aCkge1xuICAgICAgICByZXNvbHZlKFtdKVxuICAgICAgfVxuICAgICAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICBmaWxlID0gcGF0aC5yZXNvbHZlKGxvY2F0aW9uLCBmaWxlKVxuICAgICAgICBmcy5zdGF0KGZpbGUsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgLy8gb24gVWJ1bnR1IHNvbWUgcGFja2FnZXMgbWF5IGxlYXZlIGJyb2tlbiBzeW1saW5rcyBiZWhpbmQsIHNvXG4gICAgICAgICAgICAvLyBnZXR0aW5nIGEgZmlsZSBub3QgZm91bmQgZXJyb3IgaXMgbm90IHRoYXQgdW5jb21tb25cbiAgICAgICAgICAgIC8vIGluIHRoYXQgY2FzZSBnbyBhbmQgZGVsZXRlIHRoYXQgZmlsZSB5b3Vyc2VsZi4uLlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihg4pig77iPIENvdWxkIG5vdCBzdGF0IHBhdGggXCIke2ZpbGV9XCIsIHNraXBwaW5nIWApXG4gICAgICAgICAgICByZXNvbHZlKFtdKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIHByb2Nlc3NDb3VudCsrXG4gICAgICAgICAgaWYgKHN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXRoLnBhcnNlKGZpbGUpXG4gICAgICAgICAgICAvLyBvbiB0aGUgcGF0aCBub24gZXhlY3V0YWJsZXMgYXJlIG5vdCBpbnRlcmVzdGluZ1xuICAgICAgICAgICAgaWYgKGlzRXhlYyhwYXJzZWQuZXh0LCBzdGF0cy5tb2RlKSAmJiAhaXNMb2NhbE5vZGVCaW4oZmlsZSkpIHtcbiAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogYHAke2NvdW50ZXIrK31gLFxuICAgICAgICAgICAgICAgIGV4ZWN1dGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BBVEhJVEVNJyxcbiAgICAgICAgICAgICAgICBwYXRoOiBwYXJzZWQuZGlyLFxuICAgICAgICAgICAgICAgIG5hbWU6IHBhcnNlZC5iYXNlLFxuICAgICAgICAgICAgICAgIGRlc2t0b3A6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IGZpbGUgLy8gZnVsbCBwYXRoXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwcm9jZXNzQ291bnQgPT09IGl0ZW1Db3VudCkge1xuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSkgLy8gZW5kIHN0YXRcbiAgICAgIH0pIC8vIGVuZCBmb3JFYWNoXG4gICAgfSkgLy8gZW5kIHJlYWRkaXJcbiAgfSkgLy8gZW5kIFByb21pc2Vcbn1cblxuZnVuY3Rpb24gcGFyc2VQYXRoKCkge1xuICBjb25zdCByZXN1bHQgPSBbXVxuICBjb25zdCBwYXRoSXRlbXMgPSBwcm9jZXNzLmVudi5QQVRILnNwbGl0KHBhdGguZGVsaW1pdGVyKVxuICBsZXQgZGlycyA9IHVuaXEocGF0aEl0ZW1zKVxuICBpZiAocGF0aEl0ZW1zLmxlbmd0aCAhPT0gZGlycy5sZW5ndGgpIHtcbiAgICBjb25zb2xlLndhcm4oJ1lvdSBoYXZlIGR1cGxpY2F0ZSBpdGVtcyBpbiB5b3VyIFBBVEghJylcbiAgfVxuICBkaXJzID0gZGlycy5maWx0ZXIoKGRpcikgPT4gZnMuZXhpc3RzU3luYyhkaXIpKVxuICBjb25zdCBhbGwgPSBbZ2V0RGVza3RvcEZyaWVuZGxpZXMoKSwgLi4uZGlycy5tYXAoKGRpcikgPT4gcmVhZERpcihkaXIpKV1cbiAgcmV0dXJuIFByb21pc2UuYWxsKGFsbCkudGhlbihcbiAgICAocGFja3MpID0+IHtcbiAgICAgIC8vIGZpcnN0IGl0ZW0gaXMgYW4gYXJyYXkgb2YgZGVza3RvcCBmaWxlcywgbGV0J3MgcmVtb3ZlIHRoYXRcbiAgICAgIC8vIChpbiB0aGlzIGxpc3QgYC91c3Ivc2hhcmUvYXBwbGljYXRpb25zL2Zvb2Jhci5kZXNrdG9wYCBpcyBqdXN0IGBmb29iYXJgKVxuICAgICAgY29uc3QgZGVza3RvcHMgPSBwYWNrcy5zaGlmdCgpXG5cbiAgICAgIC8vIHRoZW4gcmVzdCBhcmUgaW5kaXZpZHVhbCBleGVjdXRhYmxlcyBmb3VuZCBpbiBwYXRoIGRpcnNcbiAgICAgIHBhY2tzLmZvckVhY2goKHBhY2spID0+IHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgcGFjaykpXG5cbiAgICAgIC8vIGlmIGFuIGV4ZWN1dGFibGUgZmlsZSBuYW1lIGhhcyBhIFwiLmRlc2t0b3BcIiB2ZXJzaW9uIHRoZW4gaXRcbiAgICAgIC8vIGhhcyBhIGRlc2t0b3AgZmlsZSwgc28gd2Ugd291bGQgbGlrZSB0byBhZGQgaXQgdG8gdGhlIFwid2l0aCBhcHBcIlxuICAgICAgLy8gbGlzdCBvZiBvcGVuZXJzIChzaW5jZSBpdCdzIG1lYW50IHRvIGJlIHVzZWQgb24gdGhlIGd1aSBmb3Igc3VyZSlcbiAgICAgIC8vXG4gICAgICAvLyAodGhhdCB3YXMgdGhlIG9yaWdpbmFsIHNjb3BlLCBidXQgSSdtIGJlZ2lubmluZyB0byBtaXNzIHNob3J0Y3V0c1xuICAgICAgLy8gdGhhdCBhcmUgYXZhaWxhYmxlIGluIGdub21lJ3MgZGVmYXVsdCBzZWFyY2gsIGJ1dCBub3QgaW4gc3ByaW5nYWxkJ3MpXG4gICAgICAvL1xuICAgICAgLy8gKHVuZm9ydHVuYXRlbHkgLmRlc2t0b3AgXCJzaG9ydGN1dHNcIiBjYW4gaGF2ZSBkaWZmZXJlbnQgY29udGVudHNcbiAgICAgIC8vIGFuZCB0aGlzIG1ldGhvZCB3aWxsIG5vdCBkZWFsIHdpdGggdGhvc2UsIGZvciBleGFtcGxlXG4gICAgICAvLyBgZ25vbWUta2V5Ym9hcmQtcGFuZWwuZGVza3RvcGAgbGF1bmNoZXMgYGdub21lLWNvbnRyb2wtY2VudGVyIGtleWJvYXJkYFxuICAgICAgLy8gd2hpY2ggaXMgYW4gZXhlY3V0YWJsZSBBTkQgYSBwYXJhbWV0ZXIpXG4gICAgICBpZiAoZGVza3RvcHMubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdC5mb3JFYWNoKChmbikgPT4ge1xuICAgICAgICAgIGNvbnN0IGlkeEluRGVza3RvcHNBcnJheSA9IGRlc2t0b3BzLmluZGV4T2YoZm4ubmFtZSlcbiAgICAgICAgICBpZiAoaWR4SW5EZXNrdG9wc0FycmF5ID4gLTEpIHtcbiAgICAgICAgICAgIGZuLmRlc2t0b3AgPSB0cnVlXG4gICAgICAgICAgICBkZXNrdG9wc1tpZHhJbkRlc2t0b3BzQXJyYXldID0gbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KVxuICAgIH0sXG4gICAgKGVycikgPT4ge1xuICAgICAgZXJyLm1vZHVsZSA9ICdwYXJzZVBhdGgnXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKVxuICAgIH1cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJzZVBhdGhcbiIsImNvbnN0IG9zID0gcmVxdWlyZSgnb3MnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5cbmxldCBjb3VudGVyID0gMFxuY29uc3QgaG9tZURpciA9IG9zLmhvbWVkaXIoKVxuXG5mdW5jdGlvbiBwYXJzZShzLCBkZXB0aCA9IFtdKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgcyA9IHMucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKVxuICAgIGNvbnN0IGl0ZW1QYXRoID0gZGVwdGhcbiAgICBjb25zdCByZXQgPSBbXVxuICAgIGNvbnN0IGxpbmVzID0gcy5zcGxpdCgvXFxuLylcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgbGluZSA9IGxpbmVzW2ldLnRyaW0oKVxuICAgICAgbGV0IG5hbWUgPSBsaW5lLnJlcGxhY2UoL1teKF0qXFwoLywgJycpLnJlcGxhY2UoLyhbXlxcXFxdKVxcKS4qLywgJyQxJylcblxuICAgICAgLy8gc3VibWVudVxuICAgICAgaWYgKC9eXFxbc3VibWVudV0vLnRlc3QobGluZSkpIHtcbiAgICAgICAgLy8gd2UgaWdub3JlIHRoZSB7dGl0bGV9IHBhcnQgb2YgdGhlIHN1Ym1lbnUgYFtzdWJtZW51XSAoZm9vKSB7Zm9vIHRpdGxlfWBcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvXFxcXFxcKS9nLCAnKScpIC8vIHVuZXNjYXBlIFwiXFwpXCIgdG8gXCIpXCJcbiAgICAgICAgaXRlbVBhdGgucHVzaChuYW1lKVxuICAgICAgfVxuXG4gICAgICAvLyBlbmQgb2Ygc3VibWVudVxuICAgICAgaWYgKC9eXFxbZW5kXS8udGVzdChsaW5lKSkge1xuICAgICAgICBpdGVtUGF0aC5wb3AoKVxuICAgICAgfVxuXG4gICAgICAvLyBleGVjdXRhYmxlXG4gICAgICBpZiAoL15cXFtleGVjXS8udGVzdChsaW5lKSkge1xuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9cXFxcXFwpL2csICcpJykgLy8gdW5lc2NhcGUgXCJcXClcIiB0byBcIilcIlxuICAgICAgICBjb25zdCBjb21tYW5kID0gbGluZS5yZXBsYWNlKC9bXntdKlxcey8sICcnKS5yZXBsYWNlKC8oW15cXFxcXSl9LiovLCAnJDEnKVxuICAgICAgICByZXQucHVzaCh7XG4gICAgICAgICAgaWQ6IGBmJHtjb3VudGVyKyt9YCxcbiAgICAgICAgICBleGVjdXRhYmxlOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdGQl9NRU5VSVRFTScsXG4gICAgICAgICAgcGF0aDogJy8nICsgaXRlbVBhdGguam9pbignLycpLFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgY29tbWFuZFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyBpbmNsdWRlZCBtZW51XG4gICAgICBpZiAoL15cXFtpbmNsdWRlXS8udGVzdChsaW5lKSkge1xuICAgICAgICBwYXJzZUZsdXhib3hNZW51KG5hbWUsIGl0ZW1QYXRoKS50aGVuKChyZXN1bHRzKSA9PiByZXQucHVzaCguLi5yZXN1bHRzKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzb2x2ZShyZXQpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHBhcnNlRmx1eGJveE1lbnUoZmlsZU5hbWUsIGRlcHRoID0gW10pIHtcbiAgZGVwdGggPSBBcnJheS5mcm9tKGRlcHRoKVxuICBmaWxlTmFtZSA9IChmaWxlTmFtZSB8fCAnJykucmVwbGFjZSgvfi8sIGhvbWVEaXIpXG4gIGNvbnN0IG1lbnVGaWxlID0gZmlsZU5hbWUgfHwgcGF0aC5qb2luKGhvbWVEaXIsICcuZmx1eGJveCcsICdtZW51JylcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMobWVudUZpbGUpKSB7XG4gICAgICBjb25zb2xlLmluZm8oJ05vIGZsdXhib3ggbWVudSBmaWxlIGZvdW5kLicpXG4gICAgICByZXNvbHZlKFtdKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGZzLnJlYWRGaWxlKG1lbnVGaWxlLCAndXRmOCcsIChlcnIsIGNvbnRlbnRzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGVyci5tb2R1bGUgPSAncGFyc2VGbHV4Ym94TWVudSdcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlKGNvbnRlbnRzLCBkZXB0aCkudGhlbigocmVzdWx0KSA9PiByZXNvbHZlKHJlc3VsdCkpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGFyc2VGbHV4Ym94TWVudVxuIiwiY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpXG5jb25zdCBob21lRGlyID0gb3MuaG9tZWRpcigpXG5cbi8vIHRoaXMgd2lsbCBiZSB0aGUgdGV4dCB3ZSBjYW4gc2VhcmNoIGFnYWluc3RcbmZ1bmN0aW9uIGdldFNlYXJjaGFibGVUZXh0KGl0ZW0pIHtcbiAgbGV0IHByZWZpeCA9ICcnXG4gIGxldCBzZXBhcmF0b3IgPSBwYXRoLnNlcFxuICBsZXQgaXRlbVBhdGggPSBpdGVtLnBhdGhcbiAgaWYgKGl0ZW0udHlwZSA9PT0gJ0ZCX01FTlVJVEVNJykge1xuICAgIC8vIGFuIGl0ZW0gZm91bmQgaW4gdGhlIGZsdXhib3ggbWVudSBmaWxlXG4gICAgcHJlZml4ID0gJ2ZiOidcbiAgICBzZXBhcmF0b3IgPSAnLydcbiAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09ICdQQVRISVRFTScpIHtcbiAgICAvLyBhbiBpdGVtIG9uIHRoZSBwYXRoXG4gICAgcHJlZml4ID0gJ3A6J1xuICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gJ0RJUklURU0nKSB7XG4gICAgLy8gYW4gaXRlbSBmb3VuZCBpbiB0aGUgbGlzdCBvZiBleHRyYSBkaXJlY3RvcmllcyAoY29uZmlnKVxuICAgIHByZWZpeCA9ICdkOidcbiAgfVxuICBpZiAoaXRlbS50eXBlID09PSAnUEFUSElURU0nIHx8IGl0ZW0udHlwZSA9PT0gJ0RJUklURU0nKSB7XG4gICAgaXRlbVBhdGggPSBpdGVtUGF0aC5yZXBsYWNlKGhvbWVEaXIsICd+JylcbiAgfVxuICByZXR1cm4gKHByZWZpeCArIGl0ZW1QYXRoICsgc2VwYXJhdG9yICsgaXRlbS5uYW1lKS5yZXBsYWNlKC9cXC8rL2csICcvJykgLy8gZmIgcm9vdCBsZXZlbCBhbmQgZXh0cmEgc2VwYXJhdG9yXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFNlYXJjaGFibGVUZXh0XG4iLCJpbXBvcnQgY29udGV4dCBmcm9tICcuLi9jb250ZXh0J1xuXG5mdW5jdGlvbiBhcHBMb2FkaW5nKHN0YXRlKSB7XG4gIGNvbnRleHQuZG9jdW1lbnQuYm9keS5jbGFzc0xpc3Rbc3RhdGUgPyAnYWRkJyA6ICdyZW1vdmUnXSgnbG9hZGluZycpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFwcExvYWRpbmdcbiIsImNvbnN0IHN0b3JlID0ge1xuICB3aXRoQXBwOiAnJyxcbiAgdmlzaWJsZTogdHJ1ZSxcbiAgY3VycmVudDogMCxcbiAgZ2hvc3Q6IG51bGwsXG4gIHNlYXJjaEl0ZW1zOiBbXSxcbiAgZm91bmQ6IFtdXG59XG5leHBvcnQgZGVmYXVsdCBzdG9yZVxuIiwiaW1wb3J0IHBhcnNlRGlycyBmcm9tICcuL3BhcnNlRGlycydcbmltcG9ydCBwYXJzZVBhdGggZnJvbSAnLi9wYXJzZVBhdGgnXG5pbXBvcnQgcGFyc2VGbHV4Ym94TWVudSBmcm9tICcuL3BhcnNlRmx1eGJveE1lbnUnXG5pbXBvcnQgZ2V0U2VhcmNoYWJsZVRleHQgZnJvbSAnLi9nZXRTZWFyY2hhYmxlVGV4dCdcbmltcG9ydCBhcHBMb2FkaW5nIGZyb20gJy4uL2d1aS9hcHBMb2FkaW5nJ1xuaW1wb3J0IGdldENvbmZpZyBmcm9tICcuLi9nZXRDb25maWcnXG5pbXBvcnQgc3RvcmUgZnJvbSAnLi4vc3RvcmUnXG5cbmZ1bmN0aW9uIHBhcnNlQWxsKCkge1xuICBhcHBMb2FkaW5nKHRydWUpXG4gIGNvbnN0IHN0YXJ0ZWRBdCA9IERhdGUubm93KClcbiAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKClcbiAgY29uc3QgZmJNZW51RmlsZSA9IGNvbmZpZy5mbHV4Ym94TWVudUZpbGVcbiAgc3RvcmUuc2VhcmNoSXRlbXMubGVuZ3RoID0gMFxuICByZXR1cm4gUHJvbWlzZS5hbGwoW3BhcnNlRmx1eGJveE1lbnUoZmJNZW51RmlsZSksIHBhcnNlUGF0aCgpLCBwYXJzZURpcnMoKV0pLnRoZW4oXG4gICAgKGl0ZW1QYWNrcykgPT4ge1xuICAgICAgaXRlbVBhY2tzLmZvckVhY2goKGl0ZW1zKSA9PiBzdG9yZS5zZWFyY2hJdGVtcy5wdXNoLmFwcGx5KHN0b3JlLnNlYXJjaEl0ZW1zLCBpdGVtcykpXG5cbiAgICAgIC8vIGFkZCB0aGUgc2VhcmNoYWJsZSB0ZXh0LCB3aGljaCBzaGFsbCBiZSB1bmlmaWVkIGZvciBhbGwgaXRlbSB0eXBlc1xuICAgICAgLy8gKGFuZCBpdCBtdXN0IGJlIGF2YWlsYWJsZSBmb3IgdGhlIHNlYXJjaCBBTkQgdGhlIGd1aSlcbiAgICAgIHN0b3JlLnNlYXJjaEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaXRlbS5zZWFyY2hhYmxlVGV4dCA9IGdldFNlYXJjaGFibGVUZXh0KGl0ZW0pXG4gICAgICB9KVxuICAgICAgY29uc3QgZW5kZWRBdCA9IERhdGUubm93KClcbiAgICAgIGNvbnNvbGUuaW5mbyhgUGFyc2VkICR7c3RvcmUuc2VhcmNoSXRlbXMubGVuZ3RofSBpdGVtcyBpbiAke2VuZGVkQXQgLSBzdGFydGVkQXR9IG1zLmApXG4gICAgICBhcHBMb2FkaW5nKGZhbHNlKVxuICAgIH0sXG4gICAgKGVycikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihg4pig77iPIFBhcnNlIGVycm9yIGluIHBhcnNlciBtb2R1bGUgXCIke2Vyci5tb2R1bGUgfHwgJ3Vua25vd24nfVwiIVxcbmAsIGVycilcbiAgICB9XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGFyc2VBbGxcbiIsImNvbnN0IG1hdGNoT3BlcmF0b3JzUmUgPSAvW3xcXFxce30oKVtcXF1eJCsqPy5dL2dcblxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UobWF0Y2hPcGVyYXRvcnNSZSwgJ1xcXFwkJicpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGVzY2FwZVJlZ0V4cFxuIiwiaW1wb3J0IGVzY2FwZVJleCBmcm9tICcuL2VzY2FwZVJleCdcbmltcG9ydCBjb25zdHMgZnJvbSAnLi4vY29uc3RzJ1xuXG4vLyBlc2NhcGUgaHRtbCwgYnV0IGFsbG93IHVuZGVybGluZXNcbmZ1bmN0aW9uIGVzY2FwZUh0bWwodW5zYWZlKSB7XG4gIGNvbnN0IHByZWZpeCA9IGNvbnN0cy5VX1BSRUZJWFxuICBjb25zdCBwb3N0Zml4ID0gY29uc3RzLlVfUE9TVEZJWFxuICByZXR1cm4gdW5zYWZlXG4gICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JylcbiAgICAucmVwbGFjZSgvJy9nLCAnJiMwMzk7JylcbiAgICAucmVwbGFjZShuZXcgUmVnRXhwKGVzY2FwZVJleChwcmVmaXgpLCAnZycpLCAnPHU+JylcbiAgICAucmVwbGFjZShuZXcgUmVnRXhwKGVzY2FwZVJleChwb3N0Zml4KSwgJ2cnKSwgJzwvdT4nKVxufVxuXG5leHBvcnQgZGVmYXVsdCBlc2NhcGVIdG1sXG4iLCJpbXBvcnQgZXNjYXBlUmV4IGZyb20gJy4uL3V0aWxzL2VzY2FwZVJleCdcbmltcG9ydCBjb25zdHMgZnJvbSAnLi4vY29uc3RzJ1xuaW1wb3J0IHVuaXEgZnJvbSAnLi4vdXRpbHMvdW5pcSdcblxuZnVuY3Rpb24gbXVsdGlIdG1sVW5kZXJsaW5lKHRleHQsIG5lZWRsZXMpIHtcbiAgY29uc3QgcHJlZml4ID0gY29uc3RzLlVfUFJFRklYXG4gIGNvbnN0IHBvc3RmaXggPSBjb25zdHMuVV9QT1NURklYXG4gIG5lZWRsZXMgPSBBcnJheS5pc0FycmF5KG5lZWRsZXMpID8gdW5pcShuZWVkbGVzKSA6IFtuZWVkbGVzXVxuICBuZWVkbGVzLmZvckVhY2goKG5lZWRsZSkgPT4ge1xuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChlc2NhcGVSZXgobmVlZGxlKSwgJ2dpJyksIChtYXRjaCkgPT4gcHJlZml4ICsgbWF0Y2ggKyBwb3N0Zml4KVxuICB9KVxuICByZXR1cm4gdGV4dFxufVxuXG5leHBvcnQgZGVmYXVsdCBtdWx0aUh0bWxVbmRlcmxpbmVcbiIsImltcG9ydCBlc2NhcGVSZXggZnJvbSAnLi9lc2NhcGVSZXgnXG5pbXBvcnQgdW5pcSBmcm9tICcuL3VuaXEnXG5cbi8vIHdlIGRvIG5vdCBjYXJlIGZvciByZWN1cnNpdmUgbWF0Y2hlc1xuZnVuY3Rpb24gbXVsdGlTcGxpdFNlYXJjaCh0ZXh0LCBuZWVkbGVzKSB7XG4gIG5lZWRsZXMgPSBBcnJheS5pc0FycmF5KG5lZWRsZXMpID8gdW5pcShuZWVkbGVzKSA6IFtuZWVkbGVzXVxuICBsZXQgc2NvcmUgPSAwXG4gIGxldCBzdHJpY3RNYXRjaCA9IDBcbiAgbmVlZGxlcy5mb3JFYWNoKChuZWVkbGUpID0+IHtcbiAgICBjb25zdCBsb3dOZWVkbGUgPSBuZWVkbGUudG9Mb2NhbGVMb3dlckNhc2UoKVxuICAgIGxldCB2YXJUZXh0ID0gdGV4dFxuICAgIC8vIGFsbCBsb3dlcmNhc2VcbiAgICBpZiAobmVlZGxlID09PSBsb3dOZWVkbGUpIHtcbiAgICAgIHZhclRleHQgPSB2YXJUZXh0LnRvTG9jYWxlTG93ZXJDYXNlKClcbiAgICAgIG5lZWRsZSA9IGxvd05lZWRsZVxuICAgIH1cbiAgICBzY29yZSArPSAodmFyVGV4dC5tYXRjaChlc2NhcGVSZXgobmVlZGxlKSwgJ2cnKSB8fCBbXSkubGVuZ3RoXG4gICAgc3RyaWN0TWF0Y2ggKz0gKHZhclRleHQuaW5kZXhPZihuZWVkbGUpID4gLTEpICogMVxuICB9KVxuICAvLyB3aGVuIGFsbCB3b3JkcyBhcmUgcHJlc2VudCwgYm9vc3QgdGhlIHNjb3JlXG4gIGlmIChzdHJpY3RNYXRjaCA9PT0gbmVlZGxlcy5sZW5ndGgpIHtcbiAgICBzY29yZSA9IHNjb3JlICsgMTAwXG4gIH1cblxuICByZXR1cm4gc2NvcmVcbn1cblxuZXhwb3J0IGRlZmF1bHQgbXVsdGlTcGxpdFNlYXJjaFxuIiwiaW1wb3J0IGVzY2FwZUh0bWwgZnJvbSAnLi4vdXRpbHMvZXNjYXBlSHRtbCdcbmltcG9ydCB1bmRlcmxpbmUgZnJvbSAnLi9tdWx0aUh0bWxVbmRlcmxpbmUnXG5pbXBvcnQgbXVsdGlTcGxpdFNlYXJjaCBmcm9tICcuLi91dGlscy9tdWx0aVNwbGl0U2VhcmNoJ1xuaW1wb3J0IHN0b3JlIGZyb20gJy4uL3N0b3JlJ1xuaW1wb3J0IGNvbnRleHQgZnJvbSAnLi4vY29udGV4dCdcblxuZnVuY3Rpb24gY3JlYXRlTmFtZShpdGVtLCBuZWVkbGVzKSB7XG4gIGxldCB0ZXh0ID0gaXRlbS5zZWFyY2hhYmxlVGV4dFxuICBpZiAobXVsdGlTcGxpdFNlYXJjaCh0ZXh0LCBuZWVkbGVzKSkge1xuICAgIHRleHQgPSB1bmRlcmxpbmUodGV4dCwgbmVlZGxlcylcbiAgfVxuICByZXR1cm4gdGV4dFxufVxuXG5mdW5jdGlvbiBzZXRSZXN1bHRzKG5lZWRsZXMpIHtcbiAgY29uc3QgaXRlbXMgPSBzdG9yZS5mb3VuZFxuICBjb25zdCBlbHMgPSBjb250ZXh0LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXN1bHQnKVxuICBlbHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gIH0pXG5cbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBpdGVtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBpdGVtID0gaXRlbXNbaV1cbiAgICBjb25zdCBlbCA9IGNvbnRleHQuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHJlc3VsdC0ke2l9YClcbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAvLyB0aGlzIHdpbGwgbWFyayBlbGVtZW50cyBieSB0aGVpciB0eXBlIChpbiBjYXNlIEkgd2FudCB0byBjb2xvcml6ZSB0aGVtKTpcbiAgICAvLyB0eXBlLVVOU0VULCB0eXBlLUZCX01FTlVJVEVNLCB0eXBlLVBBVEhJVEVNLCB0eXBlLURJUklURU1cbiAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZSgvdHlwZS1bQS1aXSsvLCBgdHlwZS0ke2l0ZW0udHlwZX1gKVxuICAgIGVsLmlubmVySFRNTCA9IGVzY2FwZUh0bWwoY3JlYXRlTmFtZShpdGVtLCBuZWVkbGVzKSlcbiAgICBlbC5kYXRhc2V0LmlkID0gaXRlbS5pZFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNldFJlc3VsdHNcbiIsImltcG9ydCBjb250ZXh0IGZyb20gJy4uL2NvbnRleHQnXG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCkge1xuICByZXR1cm4gY29udGV4dC5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldEVsZW1lbnRCeUlkXG4iLCJpbXBvcnQgJCBmcm9tICcuL2dldEVsZW1lbnRCeUlkJ1xuXG4vLyB3aGVuIGFuIGlucHV0IGlzIGZvY3VzZWQgdGhlIGJvZHkgd2lsbCBnZXQgYSBtYXJrZXIgY2xhc3NcbmZ1bmN0aW9uIGlucHV0Rm9jdXNDbGFzc1RvQm9keShlbGVtZW50SWQgPSAnJykge1xuICBjb25zdCBjbGFzc05hbWUgPSBgJHtlbGVtZW50SWR9LWZvY3VzZWRgXG4gICQoZWxlbWVudElkKS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+ICQoJ2JvZHknKS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkpXG4gICQoZWxlbWVudElkKS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4gJCgnYm9keScpLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5wdXRGb2N1c0NsYXNzVG9Cb2R5XG4iLCJpbXBvcnQgJCBmcm9tICcuL2dldEVsZW1lbnRCeUlkJ1xuXG4vLyB1c2VmdWwgZm9yIHN3YWxsb3dpbmcgZG93biBhbmQgdXAgYXJyb3cgcHJlc3Mgb24gdGhlIGlucHV0IGl0c2VsZlxuLy8gKHNvIHRoYXQgd2UgY2FuIGRpc2FibGUganVtcGluZyB0byB0aGUgYmVnaW5uaW5nIG9yIHRoZSBlbmQgb2YgdGhlIGlucHV0IHZhbHVlKVxuZnVuY3Rpb24gZGlzYWJsZUtleURvd25Gb3JFbGVtZW50KGVsZW1lbnRJZCA9ICcnLCBrZXlOYW1lcyA9IFtdKSB7XG4gIGNvbnN0IGV2ZW50TmFtZSA9ICdrZXlkb3duJ1xuICAkKGVsZW1lbnRJZCkuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChldmVudCkgPT4ge1xuICAgIGlmIChrZXlOYW1lcy5pbmNsdWRlcyhldmVudC5rZXkpKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNhYmxlS2V5RG93bkZvckVsZW1lbnRcbiIsImltcG9ydCBtdWx0aVNwbGl0U2VhcmNoIGZyb20gJy4vdXRpbHMvbXVsdGlTcGxpdFNlYXJjaCdcblxuY29uc3QgdGhyb3dBd2F5TGVzc1VzZWZ1bCA9IHRydWVcblxuLy8gaGlnaGVyIHNjb3JlIGZpcnN0XG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgaWYgKGEuc2NvcmUgPiBiLnNjb3JlKSB7XG4gICAgcmV0dXJuIC0xXG4gIH0gZWxzZSBpZiAoYS5zY29yZSA8IGIuc2NvcmUpIHtcbiAgICByZXR1cm4gMVxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGZpbHRlclNlYXJjaEl0ZW1zKGl0ZW1zLCBuZWVkbGVzKSB7XG4gIGNvbnN0IGdldFNjb3JlID0gKHRleHQpID0+IG11bHRpU3BsaXRTZWFyY2godGV4dCwgbmVlZGxlcylcbiAgaWYgKCFuZWVkbGVzIHx8ICFuZWVkbGVzLmxlbmd0aCkge1xuICAgIHJldHVybiBbXVxuICB9XG4gIGxldCBmaWx0ZXJlZCA9IGl0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgIGNvbnN0IHNjb3JlID0gZ2V0U2NvcmUoaXRlbS5zZWFyY2hhYmxlVGV4dClcbiAgICBpZiAoc2NvcmUpIHtcbiAgICAgIGl0ZW0uc2NvcmUgPSBzY29yZSAvLyB5YXksIGEgbXV0YW50IGtpdHRlbiBkaWVkIGhlcmVcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9KVxuICBmaWx0ZXJlZCA9IGZpbHRlcmVkLnNvcnQoY29tcGFyZSlcbiAgLy8gdHJ5IHRvIHRocm93IGF3YXkgbGVzcyB1c2VmdWwgaXRlbXNcbiAgaWYgKG5lZWRsZXMubGVuZ3RoID4gMSAmJiB0aHJvd0F3YXlMZXNzVXNlZnVsKSB7XG4gICAgY29uc3QgaGlnaGVzdCA9IChmaWx0ZXJlZFswXSB8fCB7fSkuc2NvcmUgfHwgMFxuICAgIGZpbHRlcmVkID0gZmlsdGVyZWQuZmlsdGVyKChpdGVtKSA9PiBpdGVtLnNjb3JlID09PSBoaWdoZXN0KVxuICB9XG4gIHJldHVybiBmaWx0ZXJlZFxufVxuXG5leHBvcnQgZGVmYXVsdCBmaWx0ZXJTZWFyY2hJdGVtc1xuIiwiLy8gVE9ETyB3aW4zMiBub3Qgc3VwcG9ydGVkXG5pbXBvcnQgY29udGV4dCBmcm9tICcuL2NvbnRleHQnXG5pbXBvcnQgZ2V0Q29uZmlnIGZyb20gJy4vZ2V0Q29uZmlnJ1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpXG5jb25zdCBzdXBlcmNoaWxkID0gcmVxdWlyZSgnc3VwZXJjaGlsZCcpXG5cbi8vIFRPRE8gc3VwcG9ydCBmb3Igd2l0aEFwcCBwYXJhbWV0ZXJcbi8vIHNlZSBmb3IgZXhhbXBsZTogaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9vcG5cbi8vIFRPRE8gcmV0dXJuIGZhbHNlIG9uIGVycm9yXG5mdW5jdGlvbiBvcGVuSXRlbShpdGVtLCB3aXRoQXBwKSB7XG4gIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZygpXG4gIGNvbnN0IGd1aSA9IGNvbnRleHQuZ3VpXG4gIGNvbnN0IGlzV2luID0gL153aW4vLnRlc3Qob3MucGxhdGZvcm0oKSlcbiAgY29uc3QgZGVmYXVsdFBhcmFtc0ZvclByb2Nlc3NlcyA9IHsgY3dkOiBvcy5ob21lZGlyKCkgfVxuXG4gIC8vIFdJUDogb24gd2luZG93cyB3ZSBqdXN0IGxhdW5jaCB0aGUgY29tbWFuZCwgc29ycnlcbiAgaWYgKGlzV2luKSB7XG4gICAgZ3VpLlNoZWxsLm9wZW5JdGVtKGl0ZW0uY29tbWFuZClcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLy8gc2hvcnRjdXQgZm9yIG9wZW4gd2l0aCBkZWZhdWx0IGZpbGUgbWFuYWdlclxuICBpZiAod2l0aEFwcCA9PT0gY29uZmlnLmFwcFNob3J0Y3V0cy5zaG93SXRlbUluRm9sZGVyKSB7XG4gICAgZ3VpLlNoZWxsLnNob3dJdGVtSW5Gb2xkZXIoaXRlbS5jb21tYW5kKVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvLyBvcGVuIGluIHRlcm1pbmFsIChwcmVmZXJyZWQgdGVybWluYWwgZW11bGF0b3IgY2FuIGJlIHNldCBpbiBjb25maWcudGVybWluYWxDb21tYW5kKVxuICBpZiAod2l0aEFwcCA9PT0gY29uZmlnLmFwcFNob3J0Y3V0cy5sYXVuY2hJblRlcm1pbmFsKSB7XG4gICAgY29uc3QgY29tbWFuZCA9IGNvbmZpZy50ZXJtaW5hbENvbW1hbmQucmVwbGFjZSgvJUNNRCUvLCBpdGVtLmNvbW1hbmQpXG4gICAgc3VwZXJjaGlsZChjb21tYW5kLCBkZWZhdWx0UGFyYW1zRm9yUHJvY2Vzc2VzKVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvLyBkZXNrdG9wcywgcGF0aGV4ZWNzIG9yIGZsdXhib3ggY29tbWFuZHMgKHRoZSBsYXR0ZXIgaXMga2luZGEgd2VpcmQgSSBndWVzcylcbiAgLy8gdGhpcyBvZiBjb3Vyc2UgY2FuIGNyZWF0ZSBpbnRlcmVzdGluZyBzY2VuYXJpb3MgKGxpa2Ugb3BlbmluZyBhIGZsdXhib3hcbiAgLy8gY29tbWFuZCB3aXRoIGEgbWVkaWFwbGF5ZXIsIGJ1dCBsZXQncyBhc3N1bWUgdGhlIHVzZXIga25vd3Mgd2hhdCBoZSBvciBzaGUgZG9lcylcbiAgaWYgKHR5cGVvZiB3aXRoQXBwID09PSAnb2JqZWN0JyAmJiB3aXRoQXBwICE9PSBudWxsICYmIHdpdGhBcHAuY29tbWFuZCkge1xuICAgIHN1cGVyY2hpbGQoYCR7d2l0aEFwcC5jb21tYW5kfSBcIiR7aXRlbS5jb21tYW5kfVwiYClcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLy8geGRnIG9wZW4gd2lsbCBub3QgbGF1bmNoIHNoZWxsc2NyaXB0cyBmb3IgaW5zdGFuY2VcbiAgaWYgKGl0ZW0uZXhlY3V0YWJsZSkge1xuICAgIHN1cGVyY2hpbGQoaXRlbS5jb21tYW5kLCBkZWZhdWx0UGFyYW1zRm9yUHJvY2Vzc2VzKVxuICAgIHJldHVybiB0cnVlXG4gIH0gZWxzZSB7XG4gICAgZ3VpLlNoZWxsLm9wZW5JdGVtKGl0ZW0uY29tbWFuZClcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wZW5JdGVtXG4iLCIvKiBnbG9iYWwgbnc6ZmFsc2UgKi9cbmltcG9ydCBJTGF1bmNoYWJsZSBmcm9tICcuL3NjcmlwdHMvbW9kZWxzL0lMYXVuY2hhYmxlJ1xuXG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJylcbmNvbnN0IG5ldCA9IHJlcXVpcmUoJ25ldCcpXG5jb25zdCBndWkgPSByZXF1aXJlKCdudy5ndWknKVxuY29uc3Qgd2luID0gZ3VpLldpbmRvdy5nZXQoKVxuaW1wb3J0IHJlbmRlclRlbXBsYXRlIGZyb20gJy4vc2NyaXB0cy9ndWkvcmVuZGVyVGVtcGxhdGUnXG5pbXBvcnQgcGFyc2VBbGwgZnJvbSAnLi9zY3JpcHRzL3BhcnNpbmcvcGFyc2VBbGwnXG5pbXBvcnQgc2V0UmVzdWx0cyBmcm9tICcuL3NjcmlwdHMvZ3VpL3NldFJlc3VsdHMnXG5pbXBvcnQgZXNjYXBlSHRtbCBmcm9tICcuL3NjcmlwdHMvdXRpbHMvZXNjYXBlSHRtbCdcbmltcG9ydCBpbnB1dEZvY3VzQ2xhc3NUb0JvZHkgZnJvbSAnLi9zY3JpcHRzL3V0aWxzL2lucHV0Rm9jdXNDbGFzc1RvQm9keSdcbmltcG9ydCBkaXNhYmxlS2V5RG93bkZvckVsZW1lbnQgZnJvbSAnLi9zY3JpcHRzL3V0aWxzL2Rpc2FibGVLZXlEb3duRm9yRWxlbWVudCdcbmltcG9ydCBnZXRDb25maWcgZnJvbSAnLi9zY3JpcHRzL2dldENvbmZpZydcbmltcG9ydCBmaWx0ZXJTZWFyY2hJdGVtcyBmcm9tICcuL3NjcmlwdHMvZmlsdGVyU2VhcmNoSXRlbXMnXG5pbXBvcnQgb3Blbkl0ZW0gZnJvbSAnLi9zY3JpcHRzL29wZW5JdGVtJ1xuaW1wb3J0IHN0b3JlIGZyb20gJy4vc2NyaXB0cy9zdG9yZSdcbmltcG9ydCBjb250ZXh0IGZyb20gJy4vc2NyaXB0cy9jb250ZXh0J1xuLy8gY29uc3QgbG9nID0gcmVxdWlyZSgnLi9zY3JpcHRzL3V0aWxzL2xvZycpXG5cbmNvbnN0IE1BWF9WSVNJQkxFX0lURU1fQ09VTlQgPSA2XG5sZXQgdW5peFNlcnZlciA9IG51bGxcbmxldCBjb25maWcgPSBudWxsXG5sZXQgdHJheSA9IG51bGxcbmxldCB0cmF5TWVudSA9IG51bGxcbmNvbnN0IHRyYXlNZW51SXRlbXMgPSBbXVxubGV0IGdsb2JhbFRvZ2dsZVNob3J0Y3V0ID0gbnVsbFxuY29uc3QgJCA9IChpZCk6IEhUTUxFbGVtZW50IHwgbnVsbCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbmNvbnRleHQud2luZG93ID0gd2luZG93XG5jb250ZXh0LmRvY3VtZW50ID0gZG9jdW1lbnRcbmNvbnRleHQuZ3VpID0gZ3VpXG5jb250ZXh0LmFwcCA9IG53LkFwcFxuY29udGV4dC5kYXRhUGF0aCA9IG53LkFwcC5kYXRhUGF0aC5yZXBsYWNlKC9bL1xcXFxdRGVmYXVsdFsvXFxcXF0/JC8sICcnKVxuXG5mdW5jdGlvbiBoaWRlKCkge1xuICB3aW4uaGlkZSgpXG4gIHN0b3JlLnZpc2libGUgPSBmYWxzZVxufVxuXG5mdW5jdGlvbiBzaG93KCkge1xuICBpZiAoY29uZmlnLmNlbnRlck9uU2hvdykge1xuICAgIHdpbi5zZXRQb3NpdGlvbignY2VudGVyJylcbiAgfVxuICB3aW4uc2hvdygpXG4gIHdpbi5yZXN0b3JlKCkgLy8gdGhpcyBpcyBraW5kYSBlcnJhdGljIHdpdGggZ25vbWUgZGVza3RvcFxuICBzdG9yZS52aXNpYmxlID0gdHJ1ZVxuICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gnKVxuICBpZiAoc2VhcmNoSW5wdXQpIHtcbiAgICBzZWFyY2hJbnB1dC5mb2N1cygpXG4gIH1cbn1cblxuZnVuY3Rpb24gdG9nZ2xlKCkge1xuICBpZiAoc3RvcmUudmlzaWJsZSkge1xuICAgIGhpZGUoKVxuICB9IGVsc2Uge1xuICAgIHNob3coKVxuICB9XG59XG5cbi8vIHRyYXkgaWNvbiBhbmQgcmlnaHQgY2xpY2sgbWVudVxuLy8gKHRoZSByaWdodCBjbGljayBtZW51IG1heSBub3Qgd29yayB0aG91Z2gsXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL253anMvbncuanMvaXNzdWVzLzY3MTUpXG5mdW5jdGlvbiBzZXR1cFRyYXkoKSB7XG4gIHRyYXkgPSBuZXcgbncuVHJheSh7XG4gICAgdGl0bGU6ICdUcmF5JyxcbiAgICBpY29uOiAnYXNzZXRzL2ljb24tMTZ4MTYucG5nJ1xuICB9KVxuICB0cmF5TWVudSA9IG5ldyBudy5NZW51KClcblxuICAvLyBxdWl0XG4gIGxldCBpdGVtID0gbmV3IG53Lk1lbnVJdGVtKHtcbiAgICB0eXBlOiAnbm9ybWFsJyxcbiAgICBsYWJlbDogJ3F1aXQnLFxuICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICB3aW4uY2xvc2UoKVxuICAgIH1cbiAgfSlcbiAgdHJheU1lbnVJdGVtcy5wdXNoKGl0ZW0pXG4gIHRyYXlNZW51LmFwcGVuZChpdGVtKVxuXG4gIC8vIHRvZ2dsZSB2aXNpYmlsaXR5XG4gIGl0ZW0gPSBuZXcgbncuTWVudUl0ZW0oe1xuICAgIHR5cGU6ICdub3JtYWwnLFxuICAgIGxhYmVsOiAndG9nZ2xlJyxcbiAgICBjbGljazogKCkgPT4ge1xuICAgICAgdG9nZ2xlKClcbiAgICB9XG4gIH0pXG4gIHRyYXlNZW51SXRlbXMucHVzaChpdGVtKVxuICB0cmF5TWVudS5hcHBlbmQoaXRlbSlcblxuICB0cmF5Lm1lbnUgPSB0cmF5TWVudVxuICB0cmF5Lm9uKCdjbGljaycsIHRvZ2dsZSlcbn1cblxuZnVuY3Rpb24gc2V0Q3VycmVudCgpIHtcbiAgaWYgKCFzdG9yZS5mb3VuZC5sZW5ndGggfHwgIXN0b3JlLmZvdW5kW3N0b3JlLmN1cnJlbnRdKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgJCgnY3VycmVudCcpLnRleHRDb250ZW50ID0gc3RvcmUuZm91bmRbc3RvcmUuY3VycmVudF0uY29tbWFuZFxufVxuXG5mdW5jdGlvbiBtYXJrQ3VycmVudFJlc3VsdCgpIHtcbiAgY29uc3QgYWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJlc3VsdCcpXG4gIGlmIChzdG9yZS5jdXJyZW50IDwgMCkge1xuICAgIHN0b3JlLmN1cnJlbnQgPSAwXG4gIH1cbiAgaWYgKHN0b3JlLmN1cnJlbnQgPiBhbGwubGVuZ3RoIC0gMSkge1xuICAgIHN0b3JlLmN1cnJlbnQgPSBhbGwubGVuZ3RoIC0gMVxuICB9XG4gIGNvbnN0IGVsID0gJChgcmVzdWx0LSR7c3RvcmUuY3VycmVudH1gKVxuICBpZiAoZWwpIHtcbiAgICBhbGwuZm9yRWFjaCgoY3VycmVudCkgPT4ge1xuICAgICAgY3VycmVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgfSlcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgZWwuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnbmVhcmVzdCcgfSlcbiAgfVxufVxuXG4vLyByZXNpemFibGUgbXVzdCBiZSB0cnVlIGluIHBjYWtnZS5qc29uIGZvciBnbm9tZSwgb3RoZXJ3aXNlXG4vLyB0aGUgd2luZG93IG1hbmFnZXIgd2lsbCBpZ25vcmUgcmVzaXplIHJlcXVlc3RzXG5mdW5jdGlvbiBzZXRXaW5kb3dTaXplKCkge1xuICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCQoJ2N1cnJlbnQnKSwgbnVsbClcbiAgY29uc3QgaXRlbUhlaWdodCA9IHBhcnNlSW50KHN0eWxlLmhlaWdodC5yZXBsYWNlKC9weC8sICcnKSwgMTApXG4gIGNvbnN0IGl0ZW1NYXggPSBNYXRoLm1pbihzdG9yZS5mb3VuZC5sZW5ndGgsIE1BWF9WSVNJQkxFX0lURU1fQ09VTlQpXG4gIGxldCBoZWlnaHQgPSBpdGVtSGVpZ2h0ICsgaXRlbUhlaWdodCAqIGl0ZW1NYXhcbiAgaGVpZ2h0ICs9IHN0b3JlLmZvdW5kLmxlbmd0aCA/IGl0ZW1IZWlnaHQgOiAwXG4gIHdpbi5yZXNpemVUbyhjb25maWcud2luV2lkdGggfHwgNjAwLCBoZWlnaHQpXG59XG5cbmZ1bmN0aW9uIG9uU2VhcmNoQ2hhbmdlKGUpIHtcbiAgY29uc3QgdmFsID0gKGUudGFyZ2V0LnZhbHVlIHx8ICcnKS50cmltKClcbiAgY29uc3QgbmVlZGxlcyA9IHZhbCA/IHZhbC5zcGxpdChjb25maWcubG9naWNhbEFuZFNlcGFyYXRvcikgOiBbXVxuICBzdG9yZS5mb3VuZCA9IGZpbHRlclNlYXJjaEl0ZW1zKHN0b3JlLnNlYXJjaEl0ZW1zLCBuZWVkbGVzKVxuICBzdG9yZS5jdXJyZW50ID0gMFxuICBzZXRDdXJyZW50KClcbiAgc2V0UmVzdWx0cyhuZWVkbGVzKVxuICBtYXJrQ3VycmVudFJlc3VsdCgpXG4gIHNldFdpbmRvd1NpemUoKVxufVxuXG5mdW5jdGlvbiBvbkFwcENoYW5nZShlKSB7XG4gIGNvbnN0IHZhbCA9IChlLnRhcmdldC52YWx1ZSB8fCAnJykudHJpbSgpXG4gIGxldCBtYXRjaGluZ0FwcFxuICBzdG9yZS53aXRoQXBwID0gdmFsXG5cbiAgLy8gZG8gbm90IHRyaWdnZXIgZm9yIG9uZSBsZXR0ZXJcbiAgaWYgKHZhbC5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgZGVza3RvcEl0ZW1zID0gc3RvcmUuc2VhcmNoSXRlbXMuZmlsdGVyKChpdGVtOiBJTGF1bmNoYWJsZSkgPT4gaXRlbS5kZXNrdG9wKVxuICAgIC8vIGlmIHdlIGNhbid0IGZpbmQgaXQgaW4gdGhlIGRlc2t0b3AgZnJpZW5kbHkgbGlzdCwgdGhlbiB0cnkgaGFyZGVyXG4gICAgbWF0Y2hpbmdBcHAgPVxuICAgICAgZGVza3RvcEl0ZW1zLmZpbmQoKGl0ZW06IElMYXVuY2hhYmxlKSA9PiBpdGVtLm5hbWUuc3RhcnRzV2l0aCh2YWwpKSB8fFxuICAgICAgc3RvcmUuc2VhcmNoSXRlbXMuZmluZCgoaXRlbSkgPT4gaXRlbS5uYW1lLnN0YXJ0c1dpdGgodmFsKSAmJiBpdGVtLmV4ZWN1dGFibGUpXG4gIH1cblxuICAkKCdnaG9zdCcpLmlubmVySFRNTCA9IG1hdGNoaW5nQXBwID8gZXNjYXBlSHRtbChtYXRjaGluZ0FwcC5uYW1lKSA6ICcnXG4gIHN0b3JlLmdob3N0ID0gbWF0Y2hpbmdBcHAgfHwgbnVsbFxufVxuXG5mdW5jdGlvbiBvbkRvY3VtZW50S2V5KGUpIHtcbiAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgbGF1bmNoKClcbiAgICBoaWRlKClcbiAgfVxuICBpZiAoZS5rZXkgPT09IGNvbmZpZy5yZWZyZXNoS2V5KSB7XG4gICAgcGFyc2VBbGwoKVxuICB9XG4gIGlmIChlLmtleSA9PT0gJ2MnICYmIGUuY3RybEtleSkge1xuICAgIHdpbi5zZXRQb3NpdGlvbignY2VudGVyJylcbiAgfVxuICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgaGlkZSgpXG4gIH1cbiAgaWYgKGUua2V5ID09PSAncScgJiYgZS5jdHJsS2V5KSB7XG4gICAgd2luLmNsb3NlKClcbiAgfVxuICBpZiAoY29uZmlnLmRldmVsb3BtZW50ICYmIGUua2V5ID09PSAncicgJiYgZS5jdHJsS2V5KSB7XG4gICAgcmVsb2FkQXBwKClcbiAgfVxuICBpZiAoWydBcnJvd1VwJywgJ0Fycm93RG93bicsICdQYWdlVXAnLCAnUGFnZURvd24nXS5pbmNsdWRlcyhlLmtleSkpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgaWYgKGUua2V5ID09PSAnQXJyb3dVcCcpIHtcbiAgICAgIHN0b3JlLmN1cnJlbnQgPSAoc3RvcmUuY3VycmVudCAtIDEpICUgc3RvcmUuZm91bmQubGVuZ3RoXG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgIHN0b3JlLmN1cnJlbnQgPSAoc3RvcmUuY3VycmVudCArIDEpICUgc3RvcmUuZm91bmQubGVuZ3RoXG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ1BhZ2VVcCcpIHtcbiAgICAgIHN0b3JlLmN1cnJlbnQgPSBNYXRoLm1heChzdG9yZS5jdXJyZW50IC0gTUFYX1ZJU0lCTEVfSVRFTV9DT1VOVCwgMClcbiAgICB9IGVsc2UgaWYgKGUua2V5ID09PSAnUGFnZURvd24nKSB7XG4gICAgICBzdG9yZS5jdXJyZW50ID0gTWF0aC5taW4oc3RvcmUuY3VycmVudCArIE1BWF9WSVNJQkxFX0lURU1fQ09VTlQsIHN0b3JlLmZvdW5kLmxlbmd0aCAtIDEpXG4gICAgfVxuICAgIG1hcmtDdXJyZW50UmVzdWx0KClcbiAgICBzZXRDdXJyZW50KClcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVUcmF5KCkge1xuICB0cmF5LnJlbW92ZSgpXG4gIHRyYXkgPSBudWxsXG4gIHRyYXlNZW51SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIHRyYXlNZW51LnJlbW92ZShpdGVtKVxuICB9KVxuICB0cmF5TWVudSA9IG51bGxcbn1cblxuZnVuY3Rpb24gb25XaW5NaW5pbWl6ZSgpIHtcbiAgaGlkZSgpXG59XG5cbmZ1bmN0aW9uIG9uRG9tUmVhZHkoKSB7XG4gIGNvbnNvbGUubG9nKDQsICdSRUFEWScpXG4gIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gYHRoZW1lLSR7Y29uZmlnLnRoZW1lfWBcbiAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSByZW5kZXJUZW1wbGF0ZSgpXG4gIHNldFdpbmRvd1NpemUoKVxuXG4gIC8vIGFkZCBhIGhlbHBlciBjbGFzcyB0byB0aGUgYm9keSwgc28gdGhhdCB3ZSBjYW4gbW92ZSB0aGUgZm9jdXNcbiAgLy8gaW5kaWNhdG9yIGxpbmUgYmVsb3cgdGhlIGZvY3VzZWQgaW5wdXQgd2l0aCBjc3MgYW5pbWF0aW9uXG4gIGlucHV0Rm9jdXNDbGFzc1RvQm9keSgnc2VhcmNoJylcbiAgaW5wdXRGb2N1c0NsYXNzVG9Cb2R5KCdhcHAnKVxuXG4gIC8vIGRpc2FibGUganVtcGluZyB0byBzdGFydCAvIGVuZCBvZiBpbnB1dC52YWx1ZVxuICBkaXNhYmxlS2V5RG93bkZvckVsZW1lbnQoJ3NlYXJjaCcsIFsnQXJyb3dVcCcsICdBcnJvd0Rvd24nXSlcbiAgZGlzYWJsZUtleURvd25Gb3JFbGVtZW50KCdhcHAnLCBbJ0Fycm93VXAnLCAnQXJyb3dEb3duJ10pXG5cbiAgJCgnc2VhcmNoJykuZm9jdXMoKVxuICAkKCdzZWFyY2gnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIG9uU2VhcmNoQ2hhbmdlKVxuICAkKCdhcHAnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIG9uQXBwQ2hhbmdlKVxuICBwYXJzZUFsbCgpXG59XG5cbmZ1bmN0aW9uIGxhdW5jaCgpIHtcbiAgaWYgKCFzdG9yZS5mb3VuZC5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBjb25zdCBpdGVtID0gc3RvcmUuZm91bmRbc3RvcmUuY3VycmVudF1cbiAgaWYgKCFpdGVtKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgb3Blbkl0ZW0oaXRlbSwgc3RvcmUuZ2hvc3QgfHwgc3RvcmUud2l0aEFwcClcbiAgOygkKCdhcHAnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IHN0b3JlLndpdGhBcHAgPSAkKCdnaG9zdCcpLmlubmVySFRNTCA9ICcnXG4gIHN0b3JlLmdob3N0ID0gbnVsbFxuICBoaWRlKClcbn1cblxuZnVuY3Rpb24gc2V0R2xvYmFsU2hvcnRjdXQoKSB7XG4gIGNvbnN0IG9wdGlvbiA9IHtcbiAgICBrZXk6IGNvbmZpZy50b2dnbGVLZXksXG4gICAgYWN0aXZlOiB0b2dnbGUsXG4gICAgZmFpbGVkOiAobXNnKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gcmVnaXN0ZXIgaG90a2V5IFwiJHtjb25maWcudG9nZ2xlS2V5fVwiYClcbiAgICB9XG4gIH1cbiAgZ2xvYmFsVG9nZ2xlU2hvcnRjdXQgPSBuZXcgbncuU2hvcnRjdXQob3B0aW9uKVxuICBudy5BcHAucmVnaXN0ZXJHbG9iYWxIb3RLZXkoZ2xvYmFsVG9nZ2xlU2hvcnRjdXQpXG59XG5cbmZ1bmN0aW9uIHJlbW92ZUdsb2JhbFNob3J0Y3V0KCkge1xuICBudy5BcHAudW5yZWdpc3Rlckdsb2JhbEhvdEtleShnbG9iYWxUb2dnbGVTaG9ydGN1dClcbiAgZ2xvYmFsVG9nZ2xlU2hvcnRjdXQgPSBudWxsXG59XG5cbi8vIGlwYyBpbnRlcmZhY2VcbmZ1bmN0aW9uIGNyZWF0ZVVuaXhTb2NrZXQoKSB7XG4gIGlmIChvcy5wbGF0Zm9ybSgpICE9PSAnbGludXgnKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdW5peFNlcnZlciA9IG5ldC5jcmVhdGVTZXJ2ZXIoKGNsaWVudCkgPT4ge1xuICAgIGNsaWVudC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICBkYXRhID0gKGRhdGEudG9TdHJpbmcoKSB8fCAnJykudHJpbSgpXG4gICAgICBpZiAoZGF0YSA9PT0gJ3Nob3cnKSB7XG4gICAgICAgIHNob3coKVxuICAgICAgfSBlbHNlIGlmIChkYXRhID09PSAnaGlkZScpIHtcbiAgICAgICAgaGlkZSgpXG4gICAgICB9IGVsc2UgaWYgKGRhdGEgPT09ICd0b2dnbGUnKSB7XG4gICAgICAgIHRvZ2dsZSgpXG4gICAgICB9IGVsc2UgaWYgKGRhdGEgPT09ICdyZWxvYWQnKSB7XG4gICAgICAgIHJlbG9hZEFwcCgpXG4gICAgICB9IGVsc2UgaWYgKGRhdGEgPT09ICdxdWl0JyB8fCBkYXRhID09PSAnY2xvc2UnKSB7XG4gICAgICAgIHdpbi5jbG9zZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbiAgdW5peFNlcnZlci5saXN0ZW4oY29uZmlnLnVuaXhTb2NrZXQpXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVVuaXhTb2NrZXQoY2FsbGJhY2spIHtcbiAgaWYgKCF1bml4U2VydmVyKSB7XG4gICAgY2FsbGJhY2soKVxuICAgIHJldHVyblxuICB9XG4gIHVuaXhTZXJ2ZXIuY2xvc2UoY2FsbGJhY2spXG59XG5cbi8vIHRlYXIgZG93blxuZnVuY3Rpb24gb25XaW5DbG9zZSgpIHtcbiAgY29uc3QgY2xvc2UgPSAoKSA9PiB0aGlzLmNsb3NlKHRydWUpXG4gIHRoaXMuaGlkZSgpXG4gIGlmICh1bml4U2VydmVyKSB7XG4gICAgdW5peFNlcnZlci5jbG9zZShjbG9zZSlcbiAgfSBlbHNlIHtcbiAgICBjbG9zZSgpXG4gIH1cbn1cblxuZnVuY3Rpb24gcmVsb2FkQXBwKCkge1xuICAvLyB0cmF5IGFuZCBnbG9iYWwgc2hvcnRjdXRzIGFyZSBcIm91dHNpZGVcIiB0aGUgcmxvYWRhYmxlIHdpbmRvd1xuICByZW1vdmVUcmF5KClcbiAgcmVtb3ZlR2xvYmFsU2hvcnRjdXQoKVxuICAvLyBub3Qgc3VyZSBpZiB0aGVzZSBhcmUgbmVlZGVkLCBidXQgYmV0dGVyIGJlIHNhZmUgdGhhbiBsZWFrIG1lbW9yeVxuICB3aW4ucmVtb3ZlTGlzdGVuZXIoJ21pbmltaXplJywgb25XaW5NaW5pbWl6ZSlcbiAgd2luLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uV2luQ2xvc2UpXG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25Eb2N1bWVudEtleSlcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIG9uRG9tUmVhZHkpXG4gIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gJydcbiAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnJ1xuICAvLyBmbHVzaCBub2RlJ3MgcmVxdWlyZSBjYWNoZVxuICBmb3IgKGNvbnN0IGNhY2hlSXRlbSBpbiByZXF1aXJlLmNhY2hlKSB7XG4gICAgZGVsZXRlIHJlcXVpcmUuY2FjaGVbY2FjaGVJdGVtXVxuICB9XG4gIHJlbW92ZVVuaXhTb2NrZXQoKCkgPT4ge1xuICAgIGNvbmZpZyA9IG51bGxcbiAgICB1bml4U2VydmVyID0gbnVsbFxuICAgIHdpbi5yZWxvYWQoKSAvLyBmaW5hbGx5IGthYm9vbVxuICB9KVxufVxuXG5mdW5jdGlvbiBydW4oKSB7XG4gIGNvbmZpZyA9IGdldENvbmZpZygpXG4gIGNyZWF0ZVVuaXhTb2NrZXQoKVxuICBzZXR1cFRyYXkoKVxuICBzZXRHbG9iYWxTaG9ydGN1dCgpXG4gIHdpbi5vbignbWluaW1pemUnLCBvbldpbk1pbmltaXplKVxuICB3aW4ub24oJ2Nsb3NlJywgb25XaW5DbG9zZSlcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbkRvY3VtZW50S2V5KVxuICBvbkRvbVJlYWR5KClcbiAgLy8gd2UgY291bGQgZGlzYWJsZSB0aGUgY29udGV4dCBtZW51IGZvciBjb25maWcuZGV2ZWxvcG1lbnRcbiAgLy8gYnV0IHRoZSBwcm9wZXIgd2F5IGlzIHRvIGhhdmUgXCJjaHJvbWl1bS1hcmdzXCI6IFwiLS1kaXNhYmxlLWRldnRvb2xzXCJcbiAgLy8gaW4gcGFja2FnZS5qc29uIChmb3IgYSBwcm9kIGJ1aWxkLCBwbHVzIHJlbW92aW5nIHRoZSBjb3B5LXBhc3RlIG1lbnUgaXMgbm90IG5pY2UpXG4gIGhpZGUoKVxuICBpZiAoY29uZmlnLnNob3dPblN0YXJ0dXAgfHwgY29uZmlnLmRldmVsb3BtZW50KSB7XG4gICAgc2V0VGltZW91dChzaG93LCAwKSAvLyByZW5kZXJlZCBzaXplIGRldGVybWluZXMgdGhlIHNjcmVlbiBwb3NpdGlvblxuICB9XG59XG5cbi8vIC0tLS1cblxucnVuKClcbiJdfQ==
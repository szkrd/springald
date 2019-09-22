define("testDep", ["rexuire", "exports"], function (rexuire, exports) {
    "use strict";
    exports.__esModule = true;
    var testDep = 42;
    exports.foobar = 39;
    exports["default"] = testDep;
});
define("test", ["rexuire", "exports", "testDep"], function (rexuire, exports, testDep_1) {
    "use strict";
    exports.__esModule = true;
    var chalk = require('chalk');
    console.log(chalk.red('hello world'), 42, testDep_1["default"], testDep_1.foobar);
    console.log(chalk.yellow('weird test 2 3 4 5 6 8'));
});
//# sourceMappingURL=test.js.map
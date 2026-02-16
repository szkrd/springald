const eslintJs = require('@eslint/js'); // eslint recommended js rules ended up here lately
const globals = require('globals'); // sindre's global definitions
const prettierConfig = require('eslint-config-prettier'); // turns off all rules that may conflict with prettier

// I'm not using the import plugin, because currently it's not working with eslint 10.0.0
// see https://github.com/import-js/eslint-plugin-import/issues/3227 for details.
// The `import/no-unresolved` rule would be nice, but the `import/order` is usually
// something I handle inside vscode (if I handle it at all).
// ```
// const importPlugin = require('eslint-plugin-import');
// ```

// The prettier plugin (that uses eslint fix for formatting) currently has conflicts
// between prettierrc settings and prettierConfig (trailing comma was very visible),
// so I'd rather keep prettier to do the formatting and force eslint to ignore that.
// ```
// const prettierPlugin = require('eslint-plugin-prettier');
// ```

module.exports = [
  eslintJs.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      'no-var': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-global-assign': 'off', // because of the tampering I do with require
      'no-useless-assignment': 'off', // `let foo = ''` helps the type system underneath a bit and I want to keep that
    },
  },
  prettierConfig,
];

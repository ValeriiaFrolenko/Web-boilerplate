const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,

  {
    ignores: ['node_modules/**', 'build/**', '*.config.js', 'express.js'],
  },

  {
    files: ['src/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'object-shorthand': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'no-console': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
    },
  },
];
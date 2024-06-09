const tsEslint = require('typescript-eslint');

module.exports = tsEslint.config({
  plugins: {
    '@typescript-eslint': tsEslint.plugin,
  },
  languageOptions: {
    parser: tsEslint.parser,
    parserOptions: {
      project: true,
      sourceType: 'module',
    },
  },
  files: ['**/*.ts', '**/*.tsx'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
  },
});

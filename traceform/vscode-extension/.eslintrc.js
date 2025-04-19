// SPDX-License-Identifier: BUSL-1.1
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier' // Make sure this is last to override other configs
  ],
  env: {
    node: true, // VS Code extensions run in a Node.js environment
    es2020: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow inferred types for now
    '@typescript-eslint/no-explicit-any': 'warn'
  }
};

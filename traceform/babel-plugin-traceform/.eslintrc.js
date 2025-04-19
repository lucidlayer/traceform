// SPDX-License-Identifier: MIT
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
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },
  rules: {
    'prettier/prettier': 'error', // Report Prettier rule violations as ESLint errors
    // Add any project-specific rules here
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }], // Warn about unused vars, allow underscore prefix
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow inferred return types for now
    '@typescript-eslint/no-explicit-any': 'warn' // Warn about explicit 'any'
  }
};

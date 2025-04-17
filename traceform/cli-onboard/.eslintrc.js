module.exports = {
  root: true, // Prevent ESLint from looking further up the directory tree
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json', // Point to the tsconfig for type-aware linting
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base', // Use base Airbnb config for Node.js projects
    'plugin:import/typescript',
    'prettier', // Add prettier last to override formatting rules
  ],
  rules: {
    // Add any project-specific rule overrides here
    'import/prefer-default-export': 'off', // Allow named exports
    'no-console': 'off', // Allow console logs in CLI tools
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  settings: {
    'import/resolver': {
      typescript: {}, // Use typescript resolver
    },
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js'], // Ignore build output, node_modules, and JS files
};

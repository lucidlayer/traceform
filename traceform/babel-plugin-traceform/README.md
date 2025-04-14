# @lucidlayer/babel-plugin-traceform

Injects a `data-traceform-id="ComponentName"` attribute into React components for live UI mapping with Traceform.

This plugin is part of the [Traceform](../../README.md) monorepo. Use it together with the Traceform VS Code extension and browser extension for full code-to-UI mapping functionality.

## Installation

```bash
npm install --save-dev @lucidlayer/babel-plugin-traceform
# or
yarn add --dev @lucidlayer/babel-plugin-traceform
```

## Usage

1. Add `@lucidlayer/babel-plugin-traceform` to your Babel config (e.g., `.babelrc`, `babel.config.js`), only in development mode.
2. For Vite, add it to the `babel.plugins` array in your `vite.config.ts` (see below).

**Example (babel.config.js):**
```js
module.exports = function (api) {
  const isDevelopment = api.env('development');
  return {
    plugins: [
      ...(isDevelopment ? ['@lucidlayer/babel-plugin-traceform'] : [])
    ],
    presets: [/* your presets */],
  };
};
```

**Example (Vite):**

Make sure to only include the plugin during development.

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => { // Use function form to access command
  const isDevelopment = command === 'serve'; // 'serve' is Vite's dev command

  return {
    plugins: [
      react({
        babel: {
          plugins: [
            // Only include the plugin in development mode
            ...(isDevelopment ? ['@lucidlayer/babel-plugin-traceform'] : []),
          ],
        },
      }),
    ],
    // ... other Vite config
  };
});
```

## Example App

To test the plugin, use the example React app in [`../../traceform-test-app/`](../../traceform-test-app/README.md), which is preconfigured for Traceform.

## Notes

- Only injects on the root JSX element of each component.
- Intended for development only.
- Requires standard React component naming (uppercase).

For more info, see the [Traceform root README](../../README.md).

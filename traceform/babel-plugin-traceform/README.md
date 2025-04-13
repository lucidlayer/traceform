# @lucidlayer/babel-plugin-traceform

Injects a `data-traceform-id="ComponentName"` attribute into React components for live UI mapping with Traceform.

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
```js
import react from '@vitejs/plugin-react';
export default {
  plugins: [
    react({
      babel: {
        plugins: ['@lucidlayer/babel-plugin-traceform'],
      },
    }),
  ],
};
```

## Notes

- Only injects on the root JSX element of each component.
- Intended for development only.
- Requires standard React component naming (uppercase).

For more info, see the [Traceform root README](../README.md).

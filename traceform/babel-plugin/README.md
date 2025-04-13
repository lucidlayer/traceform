# @traceform/babel-plugin

Injects a `data-traceform-id="ComponentName"` attribute into React components for live UI mapping with Traceform.

## Installation

```bash
npm install --save-dev @traceform/babel-plugin
# or
yarn add --dev @traceform/babel-plugin
```

## Usage

1. Add `@traceform/babel-plugin` to your Babel config (e.g., `.babelrc`, `babel.config.js`), only in development mode.
2. For Vite, add it to the `babel.plugins` array in your `vite.config.ts` (see below).

**Example (babel.config.js):**
```js
module.exports = function (api) {
  const isDevelopment = api.env('development');
  return {
    plugins: [
      ...(isDevelopment ? ['@traceform/babel-plugin'] : [])
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
        plugins: ['@traceform/babel-plugin'],
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

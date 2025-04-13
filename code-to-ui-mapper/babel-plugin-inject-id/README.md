# babel-plugin-inject-id

Babel plugin that injects a `data-component="ComponentName"` attribute into the root JSX element of React components during development builds. This helps map UI elements back to source code.

## Purpose

- Enables mapping between React component definitions and their rendered DOM nodes.
- Used by the Code-to-UI Mapper toolchain for live component highlighting.
- Identifies the component based on its function/class name (must follow React naming conventions, e.g., start with an uppercase letter).

## Installation

```bash
npm install --save-dev babel-plugin-inject-id
# or
yarn add --dev babel-plugin-inject-id
```

## Usage

Add the plugin to your Babel configuration (e.g., `babel.config.js` or `.babelrc`). It should only run in development mode.

**Example (`babel.config.js`)**

```javascript
module.exports = function (api) {
  const isDevelopment = api.env('development');

  const plugins = [
    // Other plugins...
  ];

  if (isDevelopment) {
    plugins.push('babel-plugin-inject-id'); // Add the plugin for development
  }

  return {
    presets: [
      // Your presets... (e.g., @babel/preset-env, @babel/preset-react, @babel/preset-typescript)
    ],
    plugins,
  };
};
```

**Example (Vite with `@vitejs/plugin-react`)**

Vite's React plugin uses Babel internally. You can configure Babel plugins within the Vite config:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: [
          // Add the plugin only in development mode
          ...(mode === 'development' ? ['babel-plugin-inject-id'] : []),
        ],
      },
    }),
  ],
}));
```

## Limitations

- **Component Naming:** Relies on standard React component naming conventions (starting with an uppercase letter). Anonymous functions/classes used as components might not be correctly identified.
- **Root Element:** Only injects the attribute into the single root element returned directly by the component function or `render` method.
- **Fragments:** Components returning a React Fragment (`<>...</>`) as the root will not have the attribute injected (as fragments don't render to the DOM).
- **HOCs:** Higher-Order Components might interfere with name detection or result in the HOC's name being injected instead of the wrapped component's name, depending on the HOC's implementation.
- **Conditional Rendering:** Basic conditional (ternary) expressions returning JSX are handled, but only the direct JSX elements in the consequent/alternate paths are tagged. More complex conditional logic might not be fully covered.
- **Development Only:** This plugin is intended for development builds to aid mapping. It should not be included in production builds.

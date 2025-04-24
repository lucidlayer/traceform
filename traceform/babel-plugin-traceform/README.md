<h1 align="center">Traceform Babel Plugin</h1>
<p align="center">Connect Your React Code to the Browser</p>

<!-- Optional: Placeholder for relevant diagram or visual -->

---

## Why Traceform Babel Plugin?

This Babel plugin is the engine that powers Traceform's core capability: instantly mapping React components from your code to their rendered instances in the browser. It seamlessly integrates into your development build process.

- **Enables Core Functionality:** Automatically injects necessary identifiers (`data-traceform-id`) into your components' JSX.
- **Universal Compatibility:** Works with modern React setups including Vite, Next.js, Create React App, and custom Babel configurations.
- **Development Only:** Designed exclusively for development builds, adding zero overhead to your production bundles.
- **Effortless Integration:** Part of the simple Traceform setup process.

---

## How It Works

1. The plugin hooks into your project's Babel compilation step during development builds.
2. It traverses the Abstract Syntax Tree (AST) to identify React component definitions.
3. For each component, it injects a unique `data-traceform-id` attribute onto the root JSX element returned by the component.
4. These IDs are then used by the Traceform VS Code and Browser extensions to create the live link between your editor and the running application.

---

## Quickstart

1. **Install the Plugin:**
   ```bash
   npm install --save-dev @lucidlayer/babel-plugin-traceform
   # or
   yarn add --dev @lucidlayer/babel-plugin-traceform
   ```
2. **Configure Babel:** Add the plugin to your Babel configuration (e.g., `babel.config.js`, `.babelrc`, or Vite config) **for development environments only**.
   
   *Example (`babel.config.js`):*
   ```javascript
   module.exports = {
     plugins: [
       // ... other plugins
       process.env.NODE_ENV === 'development' && '@lucidlayer/babel-plugin-traceform',
     ].filter(Boolean),
     // ... presets
   };
   ```
   *For specific framework setup (Vite, Next.js), refer to the main Traceform documentation or the onboarding CLI.*

3. **Install Companions:** Ensure you have the [Traceform VS Code Extension](https://marketplace.visualstudio.com/items?itemName=Traceform.traceform) and the [Traceform Browser Extension](https://github.com/lucidlayer/traceform/tree/main/traceform/browser-extension#quickstart) installed.
4. **Run Your App:** Start your React development server.
5. **Trace:** Use "Traceform: Find in UI" from VS Code to see components highlighted in the browser.

*Note: Using the Traceform onboarding tool (`npx @lucidlayer/traceform-onboard check`) is the recommended way to ensure correct setup.*

---

## Status

- **Development Tool:** This plugin should only be active during development.
- **Stable:** Core functionality is stable and tested across various frameworks.

---

## License

This plugin is licensed under the MIT License. See the `LICENSE` file in this directory for details.

---

*This plugin is part of the Traceform developer toolset. For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform)*
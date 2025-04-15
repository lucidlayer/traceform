# Traceform: Code-to-UI Mapping Toolset

Traceform is a developer toolchain that lets you select a React component in VS Code and instantly highlight its rendered instances in your browser. It works via a Babel plugin, a browser extension, and a VS Code extension.
---

## Setting Up Traceform in Your Project

To integrate Traceform into your own React development workflow, follow these steps:

1.  **Install the VS Code Extension:**
    *   Install the "Traceform" extension from the VS Code Marketplace https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode

2.  **Add the Babel Plugin:**
    *   Install the plugin as a development dependency in your project:
        ```bash
        npm install --save-dev @lucidlayer/babel-plugin-traceform
        # or
        yarn add --dev @lucidlayer/babel-plugin-traceform
        ```
    *   Configure your `babel.config.js` (or equivalent) to use the plugin, typically only for development builds:
        ```javascript
        // Example babel.config.js
        module.exports = {
          presets: [/* your presets */],
          plugins: [
            // Add Traceform plugin only in development
            process.env.NODE_ENV === 'development' && '@lucidlayer/babel-plugin-traceform',
            // Filter out the boolean false value in production
          ].filter(Boolean),
        };
        ```
    *   See the [Babel Plugin README](./traceform/babel-plugin-traceform/README.md) for detailed configuration options.

3.  **Install the Browser Extension:**
    *   Build the extension:
        ```bash
        cd traceform/browser-extension
        npm install
        npm run build # Or the appropriate build script
        cd ../.. 
        ```
    *   Load the unpacked extension into your Chromium-based browser (Chrome, Edge):
        *   Go to `chrome://extensions` or `edge://extensions`.
        *   Enable "Developer mode".
        *   Click "Load unpacked".
        *   Select the `traceform/browser-extension/dist` directory (or the correct build output directory).
    *   Refer to the [Browser Extension README](./traceform/browser-extension/README.md) for more details.

4.  **Usage:**
    *   Run your React application's development server.
    *   Open your project in VS Code.
    *   Open your application in the browser where the Traceform extension is installed.
    *   In VS Code, open a React component file.
    *   Right-click within the component's code or on its definition.
    *   Select "Traceform: Find Component in UI".
    *   The corresponding rendered elements in the browser should be highlighted.

---

## Running the Demos

This repository includes demo applications to test Traceform:

### 1. Simple Test App (`traceform-test-app--`)

This is a minimal React + TypeScript + Vite project preconfigured with the Babel plugin.

```bash
# Navigate to the test app directory
cd traceform-test-app--

# Install dependencies
npm install

# Run the development server
npm run dev 
```
Open the provided localhost URL in your browser (with the Traceform extension installed) and use the VS Code extension to test highlighting. See its [README](./traceform-test-app--/README.md) for more details.

### 2. Complex Demo App (`complex`)

This demo showcases Traceform in a slightly more complex setup.

```bash
# Navigate to the complex demo directory
cd complex

# Install dependencies
npm install

# Run the development server
npm run dev 
```
Open the provided localhost URL in your browser (with the Traceform extension installed) and use the VS Code extension to test highlighting. See its [README](./complex/README.md) for more details.

---

## Documentation

- [Developer and contributor docs](./traceform/docs/README.md)
- [Test plan and deployment](./traceform/docs/test_plan_and_deployment.md)
- [Privacy policy](./traceform/docs/PRIVACY_POLICY.md)

---

## About

Traceform is designed to bridge your React code to the live UI—instantly find where your components render in the browser. For more information, see the subproject READMEs.

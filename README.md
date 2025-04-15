# Traceform: Code-to-UI Mapping Toolset

**Website:** [**https://traceform.framer.website/**](https://traceform.framer.website/)

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
    *   Configure your build tool to use the plugin, typically only for development builds. Here are examples for common setups:

        **For projects using Babel directly (`babel.config.js` or `.babelrc`), including Next.js:**
        *   Create or modify your `babel.config.js` or `.babelrc` file in the project root.
        ```javascript
        // Example babel.config.js (Generic or other frameworks)
        module.exports = {
          presets: [/* your presets */],
          plugins: [
            // Add Traceform plugin only in development
            process.env.NODE_ENV === 'development' && '@lucidlayer/babel-plugin-traceform',
            // Filter out the boolean false value in production
          ].filter(Boolean),
        };

        // Example .babelrc (Specifically for Next.js)
        // {
        //   "presets": ["next/babel"],
        //   "plugins": [
        //     process.env.NODE_ENV === 'development' && "@lucidlayer/babel-plugin-traceform"
        //   ].filter(Boolean)
        // }
        ```
        *Note: For Next.js, ensure you include the `next/babel` preset.*

        **For projects using Vite (`vite.config.ts` or `vite.config.js`):**
        ```typescript
        // Example vite.config.ts
        import { defineConfig } from 'vite'
        import react from '@vitejs/plugin-react'

        export default defineConfig({
          plugins: [
            react({
              // Add Traceform plugin only in development
              babel: process.env.NODE_ENV === 'development' 
                ? { plugins: ['@lucidlayer/babel-plugin-traceform'] } 
                : {},
            }),
          ],
        })
        ```
        *Note: Ensure you have `@vitejs/plugin-react` installed and configured.*

        **For Create React App (CRA) projects (using `craco`):**
        *   Update the `scripts` in your `package.json` to use `craco` instead of `react-scripts`.
        *   Create a `craco.config.js` file in your project root:
        ```javascript
        // Example craco.config.js
        module.exports = {
          babel: {
            plugins: [
              // Add Traceform plugin only in development
              process.env.NODE_ENV === 'development' && '@lucidlayer/babel-plugin-traceform',
            ].filter(Boolean),
          },
        };
        ```
        *Refer to the [craco documentation](https://craco.js.org/) for more details.*

    *   See the [Babel Plugin README](./traceform/babel-plugin-traceform/README.md) for detailed configuration options if needed.

3.  **Install the Browser Extension:**
    *   Download the latest `traceform-browser-extension.zip` file from the [Traceform GitHub Releases page](https://github.com/lucidlayer/traceform/releases).
    *   Unzip the downloaded file (e.g., into a folder named `traceform-browser-extension`).
    *   Load the unpacked extension into your Chromium-based browser (Chrome, Edge, etc.):
        *   Navigate to your browser's extensions page (e.g., `chrome://extensions` or `edge://extensions`).
        *   Enable "Developer mode" (usually a toggle in the top-right corner).
        *   Click the "Load unpacked" button.
        *   Select the directory where you unzipped the extension (the `traceform-browser-extension` folder created in the previous step).
    *   The Traceform extension is now active.

4.  **Usage:**
    *   Run your React application's development server.
    *   Open your project in VS Code.
    *   Open your application in the browser where the Traceform extension is installed.
    *   In VS Code, open a React component file.
    *   Right-click within the component's code or on its definition. For example, if you have a styled component like:
        ```javascript
        const StyledButton = styled.button<ButtonProps>`...`; 
        ```
        You could highlight, then right-click on `StyledButton`.
    *   Select "Traceform: Find Component in UI" from the context menu.
    *   The corresponding rendered elements in the browser should now be highlighted.

---

## Running the Demos

This repository includes demo applications to test Traceform toolset:

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

**go to traceform-test-app--\src\components\Button.tsx**

highlight "Button"

**go to traceform-test-app--\src\components\Card.tsx**

highlight "Card"

**go to traceform-test-app--\src\components\Footer.tsx**

highlight "Footer"

**go to traceform-test-app--\src\components\Header.tsx**

highlight "Header"

Open the provided localhost URL in your browser (with the Traceform extension installed) and use the VS Code extension to test highlighting.

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
**go to complex\src\components\AlertBanner.tsx**

highlight "AlertBanner"

**go to complex\src\components\Navbar.tsx**

highlight "Navbar"

**go to complex\src\App.tsx**

highlight "Layout" "App"

Open the provided localhost URL in your browser (with the Traceform extension installed) and use the VS Code extension to test highlighting. 

---

## Documentation

- [Developer and contributor docs]
- [Test plan and deployment]
- [Privacy policy](./traceform/docs/PRIVACY_POLICY.md)

---

## About

Traceform is designed to bridge your React code to the live UI—instantly find where your components render in the browser. 

**Learn more at [traceform.framer.website](https://traceform.framer.website/)** or see the subproject READMEs for technical details.

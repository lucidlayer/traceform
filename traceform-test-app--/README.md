# Traceform Example App

This is a minimal React + TypeScript + Vite project preconfigured for use with the Traceform toolchain.

## Purpose

This app serves as the example and testbed for Traceform, allowing you to verify code-to-UI mapping functionality with the Traceform Babel plugin, VS Code extension, and browser extension.

## Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173/` (or similar).

3. **Integrate with Traceform:**
   - Ensure the [@lucidlayer/babel-plugin-traceform](../traceform/babel-plugin-traceform/README.md) is enabled in development mode (see Vite config).
   - Use the [Traceform VS Code Extension](../traceform/vscode-extension/README.md) to select and highlight components.
   - Load the [Traceform Browser Extension](../traceform/browser-extension/README.md) in Chrome/Edge to see UI highlights.

4. **Test code-to-UI mapping:**
   - Open a component file (e.g., `src/components/Card.tsx`) in VS Code.
   - Select the component name, right-click, and choose "Traceform: Find Component in UI".
   - The corresponding UI element in the running app should be highlighted in your browser.

## For More Information

See the [Traceform root README](../README.md) for a full overview and setup instructions.

---

## Original Template Info

This project was bootstrapped with the official Vite React + TypeScript template. See below for original template notes.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})

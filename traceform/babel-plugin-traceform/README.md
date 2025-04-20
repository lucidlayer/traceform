<h1 align="center">Traceform Babel Plugin: Code-to-UI Mapping for React</h1>
<p align="center">Injects traceable IDs into your React components for instant UI mapping.</p>

<p align="center">
  <a href="https://mariadb.com/bsl11/">
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="License: MIT">
  </a>
</p>

---

<details>
<summary><strong>Table&nbsp;of&nbsp;Contents</strong></summary>

- [Installation](#installation)
- [Quickstart](#quickstart)
- [Use Cases](#use-cases)
- [Why Traceform Babel Plugin?](#why-traceform-babel-plugin)
- [How It Works](#how-it-works)
  - [Technical Details](#technical-details)
- [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

</details>

---

## Installation

Add the plugin to your project:
```bash
npm install --save-dev @lucidlayer/babel-plugin-traceform
```

Enable it in your Babel config (development only!):
```js
// babel.config.js
module.exports = {
  plugins: [
    process.env.NODE_ENV === 'development' && '@lucidlayer/babel-plugin-traceform'
  ].filter(Boolean)
}
```

For Vite projects:
```js
// vite.config.js
export default {
  plugins: [
    react({
      babel: {
        plugins: [
          process.env.NODE_ENV === 'development' && '@lucidlayer/babel-plugin-traceform'
        ].filter(Boolean)
      }
    })
  ]
}
```

---

## Quickstart

1. Install the plugin as above.
2. Add it to your Babel or Vite config (development only).
3. Start your React development server.
4. Use the [Traceform VS Code extension](https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode) and [browser extension](https://github.com/lucidlayer/traceform/releases) for instant code-to-UI mapping.

---

## Use Cases
- **Large Codebases:** Instantly find which code renders which UI.
- **Team Onboarding:** Help new devs map UI elements to code.
- **Complex UIs:** Debug nested or dynamically rendered components.

---

## Why Traceform Babel Plugin?

React development often means guessing which part of your code creates which UI elements. This plugin eliminates that guesswork by injecting unique, traceable IDs into your components during development builds. When paired with the Traceform VS Code and browser extensions, you can jump from code to UI with a single click.

---

## How It Works

The plugin does one thing really well: it adds ID markers to your components during build.

1. **AST Traversal:** Hooks into Babel's compilation process.
2. **Component Detection:** Finds React components using naming conventions.
3. **ID Generation:** Creates a unique ID (`relativePath:ComponentName:InstanceIndex`).
4. **DOM Injection:** Adds this as a `data-traceform-id` attribute to your root JSX element.

### Technical Details

- **Smart Component Detection:**
  - Detects function components, arrow functions, and HOCs like `React.memo` and `React.forwardRef`.
  - Finds the root JSX element returned from each component.
- **Consistent Path Resolution:**
  - Automatically detects your project root (including monorepos).
  - Normalizes paths for cross-platform compatibility.
  - Creates relative paths that match how VS Code identifies files.
- **Example Transformation:**

```jsx
function Button(props) {
  return <button className="btn">{props.children}</button>
}
```
Becomes:
```jsx
function Button(props) {
  return <button className="btn" data-traceform-id="src/components/Button.jsx:Button:0">{props.children}</button>
}
```

---

## Frequently Asked Questions (FAQ)

**Q: Will this slow down my application?**  
A: No. The plugin is for development only and adds minimal overhead. Do not include it in production builds.

**Q: What React versions are supported?**  
A: React 16.8 through 18.x are officially supported. Newer versions may work but are not yet fully tested.

**Q: Does this work with monorepos?**  
A: Yes. The plugin auto-detects your project root for consistent ID generation.

**Q: How does this integrate with the rest of Traceform?**  
A: The Babel plugin injects IDs, the VS Code extension lets you select components, and the browser extension highlights them in the UI.

---

## Changelog

---

## Contributing

We welcome contributions! If you find a bug or have a feature request, open an issue on our [GitHub Issues](https://github.com/lucidlayer/traceform/issues).

---

## License

This plugin is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

*This plugin is part of the Traceform developer toolset. For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform)*
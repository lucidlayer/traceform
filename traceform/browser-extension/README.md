<h1 align="center">Traceform Browser Extension: Instant UI Mapping in Chrome/Edge</h1>
<p align="center">Highlights React components in your browser, instantly, from VS Code.</p>

<p align="center">
  <a href="https://mariadb.com/bsl11/">
    <img src="https://img.shields.io/badge/license-BUSL--1.1-blue" alt="License: BUSL-1.1">
  </a>
</p>

---

<details>
<summary><strong>Table&nbsp;of&nbsp;Contents</strong></summary>

- [What is the Traceform Browser Extension?](#what-is-the-traceform-browser-extension)
- [Installation](#installation)
- [Quickstart](#quickstart)
- [How It Works](#how-it-works)
- [Key Features](#key-features)
- [FAQ](#faq)
- [Changelog](#changelog)
- [License](#license)
- [Status](#status)
</details>

---

## What is the Traceform Browser Extension?

The Traceform Browser Extension is the critical bridge between your code editor and your running React app. When paired with the Traceform VS Code extension and Babel plugin, it lets you instantly highlight any React component in your browser by selecting it in your editor.

- **No more guessing which code renders which UI.**
- **No more manual DOM inspection.**
- **No more context switching.**

## Installation

**Chrome Web Store:**  
We are currently awaiting approval from the Chrome Web Store for our extension listing.

**Manual Installation:**  
Until then, you can install the extension manually:
1. Download the latest release from [GitHub Releases](https://github.com/lucidlayer/traceform/releases).
2. Extract the `.zip` file.
3. Go to `chrome://extensions` (or `edge://extensions`).
4. Enable Developer Mode.
5. Click "Load unpacked" and select the extracted folder.

## Quickstart

1. Install the [Traceform VS Code extension](https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode).
2. Configure the [Traceform Babel plugin](https://www.npmjs.com/package/@lucidlayer/babel-plugin-traceform) in your React project.
3. Start your development server.
4. Open your app in Chrome or Edge with the extension enabled.
5. Select a component in VS Code and trigger "Find in UI"—the corresponding element will be highlighted in your browser.

## How It Works

- The VS Code extension sends a component ID to a local bridge server.
- The browser extension receives the ID and highlights all matching DOM elements using a non-intrusive overlay.
- Works instantly, with pixel-perfect accuracy, and does not interfere with your app's behavior.

## Key Features

- **Instant UI Highlighting:** See exactly which DOM elements correspond to your selected code.
- **Multi-Tab Support:** Works across multiple tabs and environments.
- **Configurable Target URL:** Easily set which local server to monitor.
- **Privacy-First:** No data leaves your machine. No analytics, no tracking, no remote code.

## FAQ

**Q: Is this extension available in the Chrome Web Store?**  
A: Not yet! We are currently awaiting approval. In the meantime, use the manual installation steps above.

**Q: Does this extension collect any data?**  
A: No. All communication is local and under your control. See our [Privacy Policy](./docs/PRIVACY_POLICY.md).

**Q: Which browsers are supported?**  
A: Google Chrome and Microsoft Edge.

**Q: Is this for production use?**  
A: No, Traceform is a development tool only.

## Changelog

## License

This extension is licensed under the Business Source License 1.1 (BUSL-1.1).  
See the [LICENSE](LICENSE) file for details.

## Status

- **Current version:** v0.2.3
- **Latest update:** Licensing headers and compliance updates.
- **Chrome Web Store:** Submission pending approval.

---

For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform).

---

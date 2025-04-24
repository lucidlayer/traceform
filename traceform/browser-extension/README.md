<h1 align="center">Traceform Browser Extension</h1>
<p align="center">Instantly See Where Your React Code Renders</p>

<!-- Placeholder for Demo GIF, can reuse root one if applicable -->
<!-- ![Traceform demo](path/to/demo.gif) -->

---

## Why Traceform Browser Extension?

The Traceform Browser Extension is the critical visual link between your VS Code editor and your running React app. It works with the Traceform toolchain to eliminate guesswork and speed up development.

- **Efficient Debugging:** Instantly see which DOM elements correspond to your selected code, right in your browser.
- **Legacy Code Navigation:** Stop DOM spelunking. Map code to UI in large, complex, or unfamiliar React applications with a single click.
- **Fast Onboarding:** Help new team members visually grasp component placement and structure immediately.
- **Seamless Integration:** Works automatically with the Traceform VS Code extension and Babel plugin.

---

## How It Works

1. The Traceform VS Code extension sends a component identifier when you trigger "Traceform: Find in UI".
2. The Traceform Babel plugin ensures components have unique `data-traceform-id` attributes in the DOM.
3. This browser extension listens for the identifier and instantly highlights all matching DOM elements with a non-intrusive overlay.
4. Highlights are pixel-perfect and don't interfere with your app's functionality.

---

## Quickstart

1. **Install the Extension:**
   - **Chrome/Edge Web Store:** *Pending approval.*
   - **Manual Install:**
     - Download the latest release `.zip` from [GitHub Releases](https://github.com/lucidlayer/traceform/releases).
     - Extract the `.zip` file.
     - Go to `chrome://extensions` (or `edge://extensions`).
     - Enable "Developer Mode".
     - Click "Load unpacked" and select the extracted folder.
2. **Install Companions:** Ensure you have the [Traceform VS Code Extension](https://marketplace.visualstudio.com/items?itemName=Traceform.traceform) and the [@lucidlayer/babel-plugin-traceform](https://www.npmjs.com/package/@lucidlayer/babel-plugin-traceform) installed in your project (using `npx @lucidlayer/traceform-onboard check` is recommended).
3. **Run Your App:** Start your React development server.
4. **Trace:** Open your app in the browser, select a component in VS Code, right-click, and choose "Traceform: Find in UI". Corresponding elements will be highlighted.

---

## Status

- **Current version:** v0.2.3
- **Web Store:** Submission pending approval.
- **Development Tool:** Traceform is intended for development environments only.
- **Privacy:** All communication is local. No data leaves your machine. See our [Privacy Policy](./docs/PRIVACY_POLICY.md).

---

## License

This extension is licensed under the Business Source License 1.1 (BUSL-1.1). See the `LICENSE` file in this directory for details.

---

*This extension is part of the Traceform developer toolset. For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform)*

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

## Status

- **Current version:** v0.2.3
- **Latest update:** Licensing headers and compliance updates.
- **Chrome Web Store:** Submission pending approval.

---

For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform).

---

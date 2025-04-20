<h1 align="center">Traceform VS Code Extension: Instantly Map React Components to UI</h1>
<p align="center">Select a component in VS Code and see it highlighted in your browser.</p>

<p align="center">
  <a href="https://mariadb.com/bsl11/">
    <img src="https://img.shields.io/badge/license-BUSL--1.1-blue" alt="License: BUSL-1.1">
  </a>
</p>

---

<details>
<summary><strong>Table&nbsp;of&nbsp;Contents</strong></summary>

- [Installation](#installation)
- [Quickstart](#quickstart)
- [See Traceform in Action](#see-traceform-in-action)
- [Use Cases](#use-cases)
- [Why Traceform VS Code Extension?](#why-traceform-vs-code-extension)
- [How It Works](#how-it-works)
  - [Technical Details](#technical-details)
- [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
- [Roadmap](#roadmap)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

</details>

---

## Installation

Install the Traceform VS Code Extension from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode).

For the full Traceform workflow, also install:
- The [Traceform Babel Plugin](https://www.npmjs.com/package/@lucidlayer/babel-plugin-traceform) in your React project
- The [Traceform Browser Extension](https://github.com/lucidlayer/traceform/releases) (Chrome/Edge)

---

## Quickstart

1. Install the VS Code extension from the Marketplace.
2. Install the Babel plugin and browser extension as above.
3. Open your React project in VS Code.
4. Start your development server and open your app in the browser.
5. Select a component in VS Code and trigger "Traceform: Find in UI" (right-click or Command Palette).
6. The corresponding element will be highlighted in your browser.

---

## See Traceform in Action

Want to try Traceform immediately? Use our demo apps:

1. Clone the demo repository:
   ```bash
   git clone https://github.com/lucidlayer/demo.git
   cd demo/demo-01 # Or choose another demo (01-04)
   npm install
   ```
2. Run the onboarding tool and start the demo app:
   ```bash
   npx @lucidlayer/traceform-onboard check
   npm run dev
   ```
3. Open the demo in your browser and VS Code, and try "Find in UI".

---

## Use Cases
- **Large Codebases:** Instantly find which code renders which UI.
- **Team Onboarding:** Help new devs map UI elements to code.
- **Complex UIs:** Debug nested or dynamically rendered components.

---

## Why Traceform VS Code Extension?

Stop guessing which code renders which UI. This extension lets you select a component in your editor and see it highlighted in your browser, eliminating context switching and guesswork.

---

## How It Works

- The extension starts a local WebSocket bridge server (port 9901) when you open a React project.
- When you trigger "Find in UI", it generates a unique `traceformId` for the selected component and sends it to the browser extension.
- The browser extension highlights the corresponding DOM element(s) in real time.

### Technical Details

- **Component Identification:**
  - Detects common declaration patterns (`class X`, `function X`, `const X =`).
  - Calculates relative paths for consistent IDs.
  - Generates a unique `traceformId` in the format `path:ComponentName:InstanceIndex`.
- **Bridge Server:**
  - Auto-starts on extension activation.
  - Handles port conflicts gracefully.
  - Can be manually controlled via the sidebar.
- **Connection Status:**
  - Status bar and sidebar show connection state and logs.
  - Automatic reconnection with exponential backoff.

---

## Frequently Asked Questions (FAQ)

**Q: Do I need the Babel plugin and browser extension?**  
A: Yes, for full functionality. The VS Code extension generates IDs, the Babel plugin injects them, and the browser extension highlights the UI.

**Q: What frameworks are supported?**  
A: Traceform is designed for React, but support for other frameworks is planned.

**Q: What if port 9901 is in use?**  
A: The extension will check if the port is used by another Traceform server and use it if compatible, otherwise it will report the conflict.

**Q: Does this work with monorepos?**  
A: Yes. The extension calculates relative paths for consistent IDs.

**Q: Is this for production use?**  
A: No, Traceform is a development tool only.

---

## Roadmap

- **Source Map Integration:** More accurate mapping between source code and compiled output.
- **Shared ID Generation:** Consistent `traceformId` generation across all tools.
- **Enhanced Component Inference:** Better detection of component definitions.

---

## Changelog

---

## Contributing

We welcome contributions! If you find a bug or have a feature request, open an issue on our [GitHub Issues](https://github.com/lucidlayer/traceform/issues).

---

## License

This extension is licensed under the Business Source License 1.1 (BUSL-1.1).
- Production use for ≤ 3 dev seats is free.
- All BUSL-licensed code will convert to Apache-2.0 on 2028-04-15.
- See [LICENSE](./LICENSE) and [LICENSE-STACK.md](../LICENSE-STACK.md) for details.

---

*This extension is part of the Traceform developer toolset. For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform)*
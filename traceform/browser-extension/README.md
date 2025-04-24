# Traceform Browser Extension: For Teams Onboarding & Debugging React Codebases

> The Traceform browser extension is designed for onboarding, debugging, and navigating unfamiliar or legacy React codebases—where existing tools break down. It is not for every developer, every day, but for teams and leads who need to accelerate onboarding and reduce debugging friction in real, production-scale projects.
>
> **All claims are based on real, production-scale pilots.** If time savings is <50%, Traceform is positioned as 'best-in-class for onboarding and legacy debugging.'

---

## Why This Extension?
- **For team leads and managers:** Help your team instantly see where code is rendered, reducing onboarding and debugging time.
- No more DOM spelunking or context switching—just click and see, even in large, complex, or legacy apps.
- Works seamlessly with the Traceform toolchain for instant, live feedback.

## How It Works
1. The VS Code extension sends a component ID to a local bridge server.
2. The browser extension receives the ID and highlights all matching DOM elements using a non-intrusive overlay.
3. Works instantly, with pixel-perfect accuracy, and does not interfere with your app's behavior.

---

## Quickstart
1. Install the Traceform browser extension (Chrome/Edge).
2. Install the VS Code extension and Babel plugin.
3. Start your React dev server and open your app in the browser.
4. Select a component in VS Code and trigger "Traceform: Find in UI."
5. Instantly see every instance highlighted in your browser.

---

## Note on Claims & Updates
- All claims are based on real, production-scale pilots and team feedback.
- If time savings is <50%, fallback messaging is: 'Best-in-class for onboarding and legacy debugging.'
- This README is reviewed and updated quarterly based on pilot data and buyer feedback.

## License
This extension is licensed under the Business Source License 1.1 (BUSL-1.1). See the LICENSE file for details.

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

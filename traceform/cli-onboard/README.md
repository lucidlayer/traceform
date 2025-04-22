<h1 align="center">Traceform Onboarding CLI</h1>
<!-- Badges: npm version, downloads, build status, etc. -->

[![npm version](https://img.shields.io/npm/v/@lucidlayer/traceform-onboard.svg)](https://www.npmjs.com/package/@lucidlayer/traceform-onboard)
[![npm downloads](https://img.shields.io/npm/dw/@lucidlayer/traceform-onboard.svg)](https://www.npmjs.com/package/@lucidlayer/traceform-onboard)
[![License](https://img.shields.io/npm/l/@lucidlayer/traceform-onboard.svg)](./LICENSE)

<p align="center">
  <code>npx @lucidlayer/traceform-onboard check</code><br/> 
</p>

<p align="center">Interactive Cli wizard to install and validate the Traceform toolchain in your React 
projects.</p>



![Traceform CLI onboarding demo](.github/onboarding.gif)

<p align="center"><em>Traceform CLI onboarding demo, full process from setup to validation</em></p>

Watch here: https://www.youtube.com/watch?v=0ZnyWkS2g44

<details>
<summary><strong>Video Chapters</strong></summary>

00:00 – Introduction  
00:02 – Cloning the Demo Project Repository  
00:15 – Creating a Local Playground Directory  
00:18 – Opening the Project in Visual Studio Code  
00:20 – Reviewing Prerequisites & Setup Steps  
00:30 – Navigating to the Project Directory  
00:37 – Installing Project Dependencies  
00:43 – Running the Traceform Onboarding CLI  
00:48 – Traceform Onboarding Wizard Overview  
00:48 – Prerequisite Checks (Node.js, Package Manager)  
00:51 – Installing Babel Plugin & Dependencies  
00:59 – Updating Vite Configuration  
01:24 – Installing the Traceform VS Code Extension  
01:36 – Installing the Traceform Chrome Extension  
01:51 – Final Validation of Setup  
01:57 – Starting the React Dev Server  
02:27 – Opening the Application in the Browser  
02:33 – Using Traceform to Find Components in the UI  
02:40 – Browsing and Highlighting Components

</details>

---

<details>
<summary><strong>Table&nbsp;of&nbsp;Contents</strong></summary>

- [Installation](#installation)
- [Quickstart](#quickstart)
- [Use Cases](#use-cases)
- [Why Traceform Onboarding CLI?](#why-traceform-onboarding-cli)
- [How It Works](#how-it-works)
  - [Step-by-Step Wizard Flow](#step-by-step-wizard-flow)
  - [Technical Details](#technical-details)
- [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

</details>

---

## Installation

Run with `npx` in your project root:

```bash
npx @lucidlayer/traceform-onboard check
```

---

## Quickstart

1. In your React project directory, run:
   ```bash
   npx @lucidlayer/traceform-onboard check
   ```
2. Follow the interactive wizard in your terminal.

---

## Use Cases
- **First-Time Setup:** Get Traceform working in minutes, even in complex monorepos.
- **Team Onboarding:** Standardize setup for new developers.
- **Troubleshooting:** Quickly verify and debug your Traceform installation.

---

## Why Traceform Onboarding CLI?

Setting up a multi-part toolchain can be error prone. The Onboarding CLI removes the guesswork, automates checks, and provides clear, contextual instructions for every step. It ensures your Traceform workflow is ready to go.

---

## How It Works

### Step-by-Step Wizard Flow

The CLI guides you through the following steps:

1. **Prerequisites**
   - Checks for Node.js (minimum version: **18.17.0**) and a supported package manager:
     - npm (>= 8.0.0)
     - yarn (>= 1.22.0)
     - pnpm (>= 7.0.0)
   - Prompts you to fix any missing prerequisites before continuing.
2. **Babel Plugin Setup**
   - Checks for `@lucidlayer/babel-plugin-traceform` in your `package.json`.
   - If missing, provides the correct install command for your package manager.
   - Detects your project type (Vite, Create React App, Next.js, or custom Babel) and offers a tailored config snippet.
   - Does **not** modify your files automatically—copy/paste the snippet as needed.
3. **VS Code Extension**
   - Prompts you to install the [Traceform VS Code extension](https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode).
   - Press Enter to confirm once installed.
4. **Browser Extension**
   - Prompts you to install the [Traceform Chrome extension](https://chromewebstore.google.com/detail/giidcepndnnabhfkopmgcnpnnilkaefa?utm_source=item-share-cb).
   - Press Enter to confirm once installed.
5. **Final Validation**
   - Provides a checklist to validate your setup:
     - Start your React dev server (e.g., `npm run dev`).
     - Check the Traceform VS Code extension sidebar for "client connected".
     - Open your app in the browser.
     - Use "Traceform: Find Component in UI" in VS Code.
     - Look for highlighted components in the browser.
   - If validation fails, troubleshooting tips are provided.

- **Progress Indicator:** Each step shows "Step X of Y" at the top.


### Technical Details

- Built with Node.js and [Ink](https://github.com/vadimdemedes/ink) for a modern TUI experience.
- Uses `fs-extra`, `execa`, `clipboardy`, and other utilities for project inspection and user guidance.
- No subcommands or arguments, just run the CLI and follow the wizard.
- **Does not modify your files automatically.** All configuration changes are manual (copy/paste from the wizard).
- Works in monorepos and detects common project setups.

---

## Frequently Asked Questions (FAQ)

**Q: Do I need to install this globally?**  
A: No, just use `npx` for the latest version every time.

**Q: Does this modify my project files?**  
A: No. The CLI only provides config snippets and install commands. You must copy/paste them yourself.

**Q: Can I use this in a monorepo?**  
A: Yes, the CLI detects monorepo roots and works with common setups.

**Q: What if something fails validation?**  
A: The wizard provides troubleshooting tips and links to documentation for each step.

**Q: What are the minimum requirements?**  
A: Node.js >= 18.17.0 and one of npm >= 8, yarn >= 1.22, or pnpm >= 7.

**Q: How do I opt out of telemetry?**  
A: Set the environment variable `TRACEFORM_TELEMETRY=off` before running the CLI.

---
**A modern npm CLI tool and interactive onboarding wizard for React projects. Automate project setup, configuration, validation, and developer onboarding for Traceform, React, TypeScript, and monorepos. Perfect for initializing, validating, and managing your project toolchain from the command line.**


## Features

- Interactive CLI wizard for React project onboarding and setup
- Automates configuration and validation of Traceform toolchain
- Supports TypeScript, monorepos, and modern React workflows
- Developer-friendly terminal UI (TUI) built with Ink
- No project file modifications—manual, safe, and transparent
- Works with npm, yarn, and pnpm
- Ideal for team onboarding, troubleshooting, and project bootstrapping
- Fast, reliable, and easy to use for all experience levels
---

## Changelog

---

## Contributing

We welcome contributions! If you find a bug or have a feature request, open an issue on our [GitHub Issues](https://github.com/lucidlayer/traceform/issues).

---

## License

This CLI tool is licensed under the Apache-2.0 License. See the [LICENSE](./LICENSE) file for details.

---

*This CLI tool is part of the Traceform developer toolset. For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform)*


<h1 align="center">Traceform Onboarding CLI: Effortless Setup for Code-to-UI Mapping</h1>
<p align="center">Interactive wizard to install and validate the Traceform toolchain in your React projects.</p>

---

## 🚀 See the Onboarding CLI in Action

![Traceform CLI onboarding demo](.github/onboarding.gif)

<p align="center"><em>Traceform CLI onboarding demo – full process from setup to validation</em></p>

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
  - [Technical Details](#technical-details)
- [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

</details>

---

## Installation

You don't need to install globally. Just run it with `npx` in your project root:

```bash
npx @lucidlayer/traceform-onboard check
```

---

## Quickstart

1. In your React project directory, run:
   ```bash
   npx @lucidlayer/traceform-onboard check
   ```
2. Follow the interactive wizard. The onboarding flow is now:
   - Minimal, step-by-step, and easy to follow
   - Each step shows a simple progress indicator (e.g., "Step 2 of 5")
   - Clear, actionable instructions for:
     - Checking your environment (Node.js, package manager)
     - Installing and verifying the Traceform VS Code extension
     - Installing and configuring the Traceform Babel plugin
     - Installing the Traceform browser extension
     - Validating the full toolchain with "Find Component in UI"
   - No advanced UI, splash screens, or automation—just clear guidance
   - Telemetry is opt-out (see below)
   - For CI/headless use, run with `--no-ui` (if supported)

---

## Use Cases
- **First-Time Setup:** Get Traceform working in minutes, even in complex monorepos.
- **Team Onboarding:** Standardize setup for new developers.
- **Troubleshooting:** Quickly verify and debug your Traceform installation.

---

## Why Traceform Onboarding CLI?

Setting up a multi-part toolchain can be error-prone. The Onboarding CLI removes the guesswork, automates checks, and provides clear, contextual instructions for every step. It ensures your Traceform workflow is ready to go.

---

## How It Works

- **Environment Check:** Verifies Node.js and package manager versions.
- **Component Guidance:**
  - Checks for the VS Code extension and provides install instructions.
  - Scans for the Babel plugin in your `package.json` and config files, offering a minimal setup snippet if needed.
  - Guides you through manual installation of the browser extension.
- **Validation:** Offers a final checklist to confirm the entire toolchain is working, using "Find Component in UI".
- **Progress Indicator:** Each step shows "Step X of Y" at the top.
- **Telemetry:** Anonymous usage telemetry is enabled by default. To opt out, set the environment variable `TRACEFORM_TELEMETRY=off` before running the CLI.

### Technical Details

- Built with Node.js
- Uses `commander`, `inquirer`, `chalk`, `fs-extra`, and `execa` for a smooth CLI experience
- Scans project files and provides tailored setup instructions for Babel, Vite, and more

---

## Frequently Asked Questions (FAQ)

**Q: Do I need to install this globally?**  
A: No, just use `npx` for the latest version every time.

**Q: Does this modify my project files?**  
A: Only if you choose to copy/paste the provided config snippets. The CLI itself does not write to your files automatically.

**Q: Can I use this in a monorepo?**  
A: Yes, the CLI detects monorepo roots and works with common setups.

**Q: What if something fails validation?**  
A: The wizard provides troubleshooting tips and links to documentation for each step.

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

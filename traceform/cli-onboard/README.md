<h1 align="center">Traceform Onboarding CLI: Effortless Setup for Code-to-UI Mapping</h1>
<p align="center">Interactive wizard to install and validate the Traceform toolchain in your React projects.</p>

<p align="center">
  <a href="https://www.apache.org/licenses/LICENSE-2.0">
    <img src="https://img.shields.io/badge/license-Apache--2.0-blue" alt="License: Apache-2.0">
  </a>
</p>

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
2. Follow the interactive wizard to:
   - Check your environment (Node.js, package manager)
   - Install and verify the Traceform VS Code extension
   - Install and configure the Traceform Babel plugin
   - Install the Traceform browser extension
   - Validate the full toolchain with "Find Component in UI"

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
  - Checks for the VS Code extension and provides install links.
  - Scans for the Babel plugin in your `package.json` and config files, offering setup snippets if needed.
  - Guides you through manual installation of the browser extension.
- **Validation:** Offers a final check to confirm the entire toolchain is working, using "Find Component in UI".

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

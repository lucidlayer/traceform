# Traceform Onboarding CLI (`@lucidlayer/traceform-onboard`)

This package provides a command-line wizard to help developers set up and validate the Traceform toolset in their projects.

## Purpose

Traceform involves multiple components (VS Code extension, Babel plugin, Browser extension). This CLI tool aims to simplify the setup process by:

- Checking prerequisites (Node.js, package manager).
- Guiding the installation and configuration of each Traceform component.
- Providing contextual help based on the project setup.
- Offering a final validation step to ensure everything works together.

## Usage

It's recommended to run this tool using `npx` within your project's root directory:

```bash
npx @lucidlayer/traceform-onboard check
```

The `check` command will walk you through the necessary steps.

## Functionality

The wizard performs the following checks and provides guidance:

1.  **Prerequisites:** Verifies compatible Node.js and package manager (npm/yarn/pnpm) versions.
2.  **VS Code Extension:** Instructs on finding and installing the "Traceform" extension from the Marketplace.
3.  **Babel Plugin:** Checks `package.json` for the `@lucidlayer/babel-plugin-traceform` dependency and scans common config files (`babel.config.js`, `vite.config.ts`, etc.) for its usage, offering setup snippets.
4.  **Browser Extension:** Guides the manual installation process using the `.zip` file from GitHub Releases.
5.  **Validation:** Provides steps to manually test the complete setup by using the "Find Component in UI" feature and checking for highlights in the browser.

## Contributing

This package is part of the [Traceform monorepo](https://github.com/lucidlayer/traceform). See the main project README for contribution guidelines.

---

*This CLI tool is part of the Traceform developer toolset.*

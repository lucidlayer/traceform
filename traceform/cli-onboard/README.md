# Traceform Onboarding CLI (`@lucidlayer/traceform-onboard`)

## What It Is

The Traceform Onboarding CLI is a command-line wizard designed to streamline the setup and validation of the Traceform toolset within your React projects. It acts as your guide, ensuring all components (VS Code extension, Babel plugin, Browser extension) are correctly installed and configured.

Think of it as your setup assistant, removing the guesswork and ensuring a smooth start with Traceform.

## How It Works

The CLI tool simplifies the Traceform setup process by automating checks and providing clear instructions:

1.  **Environment Check:** Verifies you have compatible versions of Node.js and a supported package manager (npm, yarn, or pnpm).
2.  **Component Guidance:** Walks you through the installation and verification of each Traceform piece:
    *   **VS Code Extension:** Checks if it's installed and provides marketplace links.
    *   **Babel Plugin:** Scans your `package.json` and common config files (`babel.config.js`, `vite.config.ts`, etc.) to ensure the plugin is installed and configured correctly, offering setup snippets if needed.
    *   **Browser Extension:** Guides the manual installation process using the `.zip` file from GitHub Releases.
3.  **Validation:** Offers a final check to confirm the entire toolchain is working end-to-end, typically by using the "Find Component in UI" feature.

## Setup & Usage

Running the onboarding wizard is straightforward. Use `npx` to execute it directly within your project's root directory:

```bash
npx @lucidlayer/traceform-onboard check
```

The `check` command initiates the interactive wizard, guiding you through each setup step.

## Key Features

*   **Interactive Wizard:** Step-by-step guidance simplifies the setup process.
*   **Prerequisite Checks:** Ensures your development environment meets Traceform's requirements.
*   **Automated Detection:** Scans project files to verify installation and configuration of the Babel plugin.
*   **Contextual Instructions:** Provides tailored guidance based on your project setup (e.g., Vite vs. Babel config).
*   **Clear Validation Steps:** Helps you confirm that Traceform is functioning correctly after setup.

## Technical Implementation

This CLI tool is built with Node.js and utilizes libraries such as:

*   `commander`: For parsing command-line arguments.
*   `inquirer`: For creating the interactive prompt experience.
*   `chalk`: For styling terminal output.
*   `fs-extra`: For file system interactions (reading `package.json`, config files).
*   `execa`: For running checks like Node.js/npm versions.

## Integration with Traceform

The Onboarding CLI is the recommended starting point for integrating Traceform into your project. It ensures that the other core components – the VS Code Extension, Babel Plugin, and Browser Extension – are correctly installed and configured to work together seamlessly.

## About Traceform

Traceform aims to seamlessly connect your code to its rendered UI, eliminating the mental overhead of context switching and making front-end development more intuitive.

---

*This CLI tool is part of the Traceform developer toolset. For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform)*

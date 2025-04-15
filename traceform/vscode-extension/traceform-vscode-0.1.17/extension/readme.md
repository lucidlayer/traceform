# Traceform for VS Code 

This VS Code extension is part of the [Traceform](https://traceform.framer.website/) toolset, allowing you to instantly highlight React components from your editor in your running browser application.

## Features

*   **Find Component in UI:** Right-click on a React component's definition or usage in your code and select "Traceform: Find Component in UI" to highlight all its rendered instances in the browser.
*   **Automatic Bridge Server:** The necessary local server starts automatically when the extension activates.

## Prerequisites

Traceform requires a complete setup involving three parts:

1.  **This VS Code Extension:** Provides the editor integration.
2.  **Traceform Babel Plugin:** Needs to be installed and configured in your React project's build process.
3.  **Traceform Browser Extension:** Needs to be installed in your Chromium-based browser (Chrome, Edge).

## Installation & Setup

1.  **Install this VS Code Extension:**
    *   Install "Traceform" from the VS Code Marketplace (Search for `LucidLayer.traceform-vscode`).

2.  **Configure Babel Plugin & Browser Extension:**
    *   Detailed instructions for setting up the `@lucidlayer/babel-plugin-traceform` package in your specific project (Vite, Next.js, CRA, etc.) and installing the browser extension can be found in the main project repository:
    *   ➡️ **[View Full Setup Instructions on GitHub](https://github.com/lucidlayer/traceform#setting-up-traceform-in-your-project)**

## Usage

1.  Ensure the Babel plugin and browser extension are correctly set up as per the main GitHub instructions linked above.
2.  Run your React application's development server.
3.  Open your project in VS Code (this extension should activate automatically).
4.  Open your application in the browser where the Traceform browser extension is installed.
5.  In VS Code, open a React component file.
6.  Right-click within the component's code (e.g., on the component name like `MyButton`).
7.  Select "Traceform: Find Component in UI" from the context menu.
8.  The corresponding rendered elements in the browser should now be highlighted.

---

For more information, bug reports, or contributions, please visit the [Traceform Website](https://traceform.framer.website/) or the main [Traceform GitHub repository](https://github.com/lucidlayer/traceform).

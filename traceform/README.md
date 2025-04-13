# Traceform

Bridge your React code to the live UI—instantly find where your components render in the browser.

## What is Traceform?

Traceform is a developer toolchain that lets you select a React component in VS Code and instantly highlight its rendered instances in your browser. It works via a Babel plugin, a browser extension, and a VS Code extension.

## Quick Start

1. Install the [Traceform VS Code Extension](./vscode-extension/README.md).
2. Add the [@traceform/babel-plugin](./babel-plugin/README.md) to your React app's development build.
3. Build and load the [Traceform Browser Extension](./browser-extension/README.md) in Chrome/Edge.
4. Open your React app, select a component in VS Code, right-click, and choose "Traceform: Find Component in UI".

## Monorepo Structure

- `babel-plugin/` – Babel plugin to inject `data-traceform-id` attributes
- `browser-extension/` – Browser extension for DOM highlighting
- `vscode-extension/` – VS Code extension for "Find in UI" (with integrated bridge server)
- `local-bridge-server/` – (Deprecated) Standalone bridge server (now integrated)
- `example-react-app/` – Example React app for testing
- `docs/` – Developer documentation

For detailed setup and troubleshooting, see the README in each subproject.

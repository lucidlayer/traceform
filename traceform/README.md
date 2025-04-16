# Traceform

Bridge your React code to the live UI—instantly find where your components render in the browser.

## What is Traceform?

Traceform is a developer toolchain that lets you select a React component in VS Code and instantly highlight its rendered instances in your browser. It works via a Babel plugin, a browser extension, and a VS Code extension.

## Monorepo Structure

- `babel-plugin-traceform/` – Babel plugin to inject `data-traceform-id` attributes
- `browser-extension/` – Browser extension for DOM highlighting
- `vscode-extension/` – VS Code extension for "Find in UI" (with integrated bridge server)
- `../traceform-test-app/` – Example React app for testing Traceform
- `docs/` – Developer and contributor documentation
- `blog/` - Developer blog articles

## Developer Blog

Read technical deep dives, updates, and insights about Traceform:

- [**Blog Index**](./blog/README.md)

## Quick Start

1. Install the [Traceform VS Code Extension](./vscode-extension/README.md).
2. Add the [@lucidlayer/babel-plugin-traceform](./babel-plugin-traceform/README.md) to your React app's development build.
3. Build and load the [Traceform Browser Extension](./browser-extension/README.md) in Chrome/Edge.
4. Run the example app in [`../traceform-test-app/`](../traceform-test-app/README.md) for local testing.
5. Open your React app, select a component in VS Code, right-click, and choose "Traceform: Find Component in UI".

For detailed setup and troubleshooting, see the README in each subproject.

## Example App

The [`../traceform-test-app/`](../traceform-test-app/README.md) directory contains a minimal React + TypeScript + Vite project preconfigured for Traceform testing.

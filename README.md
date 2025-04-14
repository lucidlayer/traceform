# Traceform: Code-to-UI Mapping Toolset

Traceform is a developer toolchain that lets you select a React component in VS Code and instantly highlight its rendered instances in your browser. It works via a Babel plugin, a browser extension, and a VS Code extension.

---

## Monorepo Structure

- `traceform/babel-plugin-traceform/` – Babel plugin to inject `data-traceform-id` attributes
- `traceform/browser-extension/` – Browser extension for DOM highlighting
- `traceform/vscode-extension/` – VS Code extension for "Find in UI" (with integrated bridge server)
- `traceform-test-app/` – Example React app for testing Traceform
- `traceform/docs/` – Developer and contributor documentation

---

## Quick Start

1. **Install the [Traceform VS Code Extension](./traceform/vscode-extension/README.md).**
2. **Add the [@lucidlayer/babel-plugin-traceform](./traceform/babel-plugin-traceform/README.md) to your React app's development build.**
3. **Build and load the [Traceform Browser Extension](./traceform/browser-extension/README.md) in Chrome/Edge.**
4. **Run the example app in `traceform-test-app/` for local testing.**
5. **Open your React app, select a component in VS Code, right-click, and choose "Traceform: Find Component in UI".**

For detailed setup and troubleshooting, see the README in each subproject.

---

## Example App

The `traceform-test-app/` directory contains a minimal React + TypeScript + Vite project preconfigured for Traceform testing. See its [README](./traceform-test-app/README.md) for usage instructions.

---

## Documentation

- [Developer and contributor docs](./traceform/docs/README.md)
- [Test plan and deployment](./traceform/docs/test_plan_and_deployment.md)
- [Privacy policy](./traceform/docs/PRIVACY_POLICY.md)

---

## About

Traceform is designed to bridge your React code to the live UI—instantly find where your components render in the browser. For more information, see the subproject READMEs.

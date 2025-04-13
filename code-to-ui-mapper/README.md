# Code-to-UI Mapper

A developer tool that bridges React component definitions in code with their live rendered instances in the browser.

## Monorepo Structure

- `babel-plugin-inject-id/` – Babel plugin to inject `data-component` attributes
- `browser-extension/` – Browser extension for DOM highlighting
- `vscode-extension/` – VS Code extension for "Find in UI"
- `local-bridge-server/` – Local WebSocket bridge between VS Code and browser
- `example-react-app/` – Testbed React app
- `docs/` – Developer documentation (includes Test Plan & Deployment Guide)

## Status (as of 2025-04-12)

- **MVP Complete:** All core components (Babel plugin, browser extension, VS Code extension, bridge server, example app) have been implemented.
- **End-to-End Testing:** The core "Find in UI" flow has been successfully tested locally using the `test_plan_and_deployment.md` guide.
- **Next Steps:** Address minor bugs/refinements, package extensions, or define post-MVP features.

## MVP Goal (Achieved)

Let a developer select a React component in VS Code and instantly highlight where it's rendered in the browser.

# Code-to-UI Mapper

A developer tool that bridges React component definitions in code with their live rendered instances in the browser.

## Monorepo Structure

- `babel-plugin-inject-id/` – Babel plugin to inject `data-component` attributes
- `browser-extension/` – Browser extension for DOM highlighting
- `vscode-extension/` – VS Code extension for "Find in UI"
- `local-bridge-server/` – Local WebSocket bridge between VS Code and browser
- `example-react-app/` – Testbed React app
- `docs/` – Developer documentation

## MVP Goal

Let a developer select a React component in VS Code and instantly highlight where it's rendered in the browser.

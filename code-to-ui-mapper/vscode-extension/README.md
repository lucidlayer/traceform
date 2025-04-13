# vscode-extension

VS Code extension for the Code-to-UI Mapper tool.

## Purpose

- Lets the user right-click a React component definition and trigger "Find in UI".
- Sends the selected component name to the local bridge server (WebSocket or HTTP).
- Enables live highlighting of rendered component instances in the browser.

## Key Files

- `package.json` – Extension manifest and metadata
- `extension.js` – Main extension logic and command registration
- `client.js` – Handles communication with the local bridge server

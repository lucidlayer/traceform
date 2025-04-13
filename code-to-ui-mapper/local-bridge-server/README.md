# local-bridge-server

Local bridge server for the Code-to-UI Mapper tool.

## Purpose

- Acts as a bridge between the VS Code extension and the browser extension.
- Receives component highlight requests from VS Code and broadcasts them to all connected browser tabs via WebSocket.

## Key Files

- `index.js` – Minimal WebSocket server implementation

## Usage

Run locally during development to enable live code-to-UI mapping.

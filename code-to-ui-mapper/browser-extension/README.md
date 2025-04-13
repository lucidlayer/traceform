# browser-extension

Browser extension for the Code-to-UI Mapper tool.

## Purpose

- Injects a content script into the page to find all DOM nodes with `data-component="ComponentName"`.
- Draws a visual overlay (highlight box) on matching elements.
- Communicates with the local bridge server (WebSocket or REST) to receive highlight commands from VS Code.

## Key Files

- `manifest.json` – Extension manifest (v3)
- `content.js` – Injected script for DOM scanning and overlay
- `overlay.js` – Overlay rendering logic
- `background.js` – Handles long-lived logic and messaging
- `styles.css` – Overlay and extension styles

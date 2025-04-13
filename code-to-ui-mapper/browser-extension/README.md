# Code-to-UI Mapper - Browser Extension

This browser extension (Chrome/Edge compatible, Manifest V3) works in conjunction with the VS Code Extension and Local Bridge Server to highlight UI elements corresponding to selected source code.

## Features

- Listens for commands from the integrated bridge server (managed by the VS Code Extension) via WebSocket.
- Injects a content script into web pages.
- Finds DOM elements matching a specific `data-component` attribute (injected by the Babel plugin).
- Draws visual overlays on matched elements.

## Installation (Development)

1.  **Build:** Compile the TypeScript code into the `dist/` directory.
    ```bash
    # From within the browser-extension directory
    npm run build
    ```
2.  **Load Unpacked Extension:**
    *   Open Chrome/Edge Extension Management page (`chrome://extensions` or `edge://extensions`).
    *   Enable "Developer mode".
    *   Click "Load unpacked".
    *   Select the `code-to-ui-mapper/browser-extension/dist` directory (the one created by the build step).

## How it Works

1.  The **Background Script** (`src/background.ts`) establishes a WebSocket connection to the integrated Bridge Server managed by the VS Code extension (`ws://localhost:9901` by default).
2.  When a message (e.g., `{ type: 'HIGHLIGHT_COMPONENT', componentName: 'MyButton' }`) is received from the server, the background script relays it to the content script in the currently active tab.
3.  The **Content Script** (`src/content.ts`) receives the message.
4.  It calls the **Overlay Logic** (`src/overlay.ts`) to find all elements with the matching `data-component` attribute (e.g., `[data-component="MyButton"]`).
5.  The overlay logic creates `<div>` elements styled via `src/styles.css` and positions them exactly over the found DOM elements.
6.  Overlays are cleared when a `CLEAR_HIGHLIGHT` message is received or potentially on user interaction (currently commented out).

## Troubleshooting

- Ensure the VS Code Extension (`LucidLayer.code-to-ui-mapper-vscode-extension`) is installed and enabled in VS Code. The integrated bridge server starts with it.
- Check the VS Code Output panel (channel: "Code-to-UI Mapper") for server status and connection logs.
- Check the browser's console (both the page and the extension's background service worker) for connection or message processing errors.
- Verify the target application has been built with the `@lucidlayer/babel-plugin-traceform` active to ensure `data-component` attributes are present.

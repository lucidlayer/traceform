# Code-to-UI Mapper - Browser Extension

This browser extension (Chrome/Edge compatible, Manifest V3) works in conjunction with the VS Code Extension and Local Bridge Server to highlight UI elements corresponding to selected source code.

## Features

- Listens for commands from the Local Bridge Server via WebSocket.
- Injects a content script into web pages.
- Finds DOM elements matching a specific `data-component` attribute (injected by the Babel plugin).
- Draws visual overlays on matched elements.

## Installation (Development)

1.  **Build:** You need a build step to compile TypeScript to JavaScript and potentially bundle the files into the `dist/` directory (e.g., using Webpack, esbuild, or Rollup). *Note: A build script is not yet configured in `package.json`.*
    ```bash
    # Example (assuming a build script exists)
    npm run build
    ```
2.  **Load Unpacked Extension:**
    *   Open Chrome/Edge Extension Management page (`chrome://extensions` or `edge://extensions`).
    *   Enable "Developer mode".
    *   Click "Load unpacked".
    *   Select the `code-to-ui-mapper/browser-extension` directory (the one containing `manifest.json`).

## How it Works

1.  The **Background Script** (`src/background.ts`) establishes a WebSocket connection to the Local Bridge Server (`ws://localhost:8765` by default).
2.  When a message (e.g., `{ type: 'HIGHLIGHT_COMPONENT', componentName: 'MyButton' }`) is received from the server, the background script relays it to the content script in the currently active tab.
3.  The **Content Script** (`src/content.ts`) receives the message.
4.  It calls the **Overlay Logic** (`src/overlay.ts`) to find all elements with the matching `data-component` attribute (e.g., `[data-component="MyButton"]`).
5.  The overlay logic creates `<div>` elements styled via `src/styles.css` and positions them exactly over the found DOM elements.
6.  Overlays are cleared when a `CLEAR_HIGHLIGHT` message is received or potentially on user interaction (currently commented out).

## Troubleshooting

- Ensure the Local Bridge Server is running.
- Check the browser's console (both the page and the extension's background service worker) for errors.
- Verify the target application has been built with the `babel-plugin-inject-id` active to ensure `data-component` attributes are present.

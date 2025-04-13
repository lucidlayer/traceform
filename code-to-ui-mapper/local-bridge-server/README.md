# Code-to-UI Mapper - Local Bridge Server

This Node.js application acts as a simple WebSocket server, bridging communication between the VS Code extension and the browser extension components of the Code-to-UI Mapper toolchain.

## Features

- Listens for WebSocket connections on a specified port (default: 8765).
- Accepts connections from the VS Code extension and multiple browser extensions simultaneously.
- Receives `HIGHLIGHT_COMPONENT` messages from the VS Code extension.
- Validates incoming messages.
- Broadcasts valid highlight commands to all connected browser extension clients.

## Installation

1.  Navigate to this directory: `cd code-to-ui-mapper/local-bridge-server`
2.  Install dependencies: `npm install`

## Usage

1.  **Build (Optional but Recommended):** Compile the TypeScript code.
    ```bash
    npm run build
    ```
2.  **Run the Server:**
    ```bash
    npm start
    # OR (if not built)
    # npx ts-node src/index.ts
    # OR (for development with auto-rebuild)
    # npm run dev (in a separate terminal)
    # npm start (in another terminal once built)
    ```
3.  The server will log messages to the console, indicating when it's listening and when clients connect/disconnect or send messages.

## How it Works

1.  The server starts and listens for WebSocket connections on `ws://localhost:8765`.
2.  The VS Code extension connects to this server.
3.  Multiple instances of the browser extension (in different browser tabs/windows) connect to this server.
4.  When the VS Code extension sends a `HIGHLIGHT_COMPONENT` message (containing the component name), the server receives it.
5.  The server validates the message format.
6.  If valid, the server broadcasts the message to *all* connected browser extension clients.
7.  Each browser extension's background script receives the message and relays it to its content script for highlighting.

## Troubleshooting

- **`Error: Port 8765 is already in use`**: Make sure no other instance of the bridge server (or another application using port 8765) is running. Stop the other process or choose a different port (requires updating client configurations as well).
- **Clients not connecting:** Verify the WebSocket URL (`ws://localhost:8765`) is correct in both the VS Code extension (`src/client.ts`) and the browser extension (`src/background.ts`). Check for firewall issues.
- **Messages not being relayed:** Check the server console logs for errors related to message parsing or broadcasting. Ensure clients are actually connected (check connection logs).

# Code-to-UI Mapper - VS Code Extension

This VS Code extension allows developers to select a React component name in their code and trigger a command to highlight corresponding elements in the browser UI, via the Code-to-UI Mapper toolchain.

## Features

- Adds a "Code-to-UI: Find Component in UI" command to the editor context menu for JavaScript/TypeScript/JSX/TSX files.
- Extracts the selected text as the component name.
- Connects to the Local Bridge Server (`ws://localhost:8765` by default) via WebSocket.
- Sends the component name to the bridge server to initiate highlighting in the browser extension.
- Provides status bar feedback on the connection status to the bridge server.

## Installation (Development)

1.  **Build:** Compile the TypeScript code.
    ```bash
    npm run compile
    # or for continuous watching
    npm run watch
    ```
2.  **Run Extension:**
    *   Open this `code-to-ui-mapper/vscode-extension` directory in VS Code.
    *   Press `F5` to open a new Extension Development Host window with the extension running.

## Usage

1.  Ensure the Local Bridge Server and the Browser Extension are running.
2.  Ensure the target web application was built with the `babel-plugin-inject-id` active.
3.  Open a React component file (`.js`, `.jsx`, `.ts`, `.tsx`) in VS Code.
4.  Select the name of the component you want to find (e.g., select `MyButton` in `const MyButton = ...`).
5.  Right-click on the selection.
6.  Choose "Code-to-UI: Find Component in UI" from the context menu.
7.  The extension will send the component name (`MyButton`) to the bridge server, which relays it to the browser extension to perform the highlighting.
8.  Check the VS Code status bar for connection status (`$(plug) CodeUI: Connected/Disconnected/Error`).

## Troubleshooting

- **No Command in Menu:** Ensure you are right-clicking within a file type specified in `package.json` (`javascript`, `typescript`, `javascriptreact`, `typescriptreact`).
- **"No active editor found"**: Make sure you have a relevant file open and active in the editor pane.
- **"Please select a component name"**: The command currently requires you to select the component name text before right-clicking.
- **"Doesn't look like a valid component name"**: Ensure your selection is a valid JavaScript identifier starting with an uppercase letter.
- **"Code-to-UI Mapper bridge not connected"**: Verify the Local Bridge Server is running on `ws://localhost:8765`. Check the extension host's developer console (`Help > Toggle Developer Tools`) for connection errors.
- **No Highlighting in Browser:** Check the troubleshooting steps for the Browser Extension and ensure the Babel plugin is correctly injecting `data-component` attributes.

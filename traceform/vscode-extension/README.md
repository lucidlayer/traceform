# Traceform for VS Code

This VS Code extension allows developers to select a React component name in their code and trigger a command to highlight corresponding elements in the browser UI, via the Traceform toolchain.

## Features

- Adds a "Traceform: Find Component in UI" command to the editor context menu for JavaScript/TypeScript/JSX/TSX files.
- Extracts the selected text as the component name.
- Automatically starts and manages an integrated WebSocket bridge server.
- Connects the Browser Extension to the integrated bridge server.
- Sends the component name to the bridge server to initiate highlighting in the browser extension.
- Provides status bar feedback on the connection status.

## Installation

1.  Open VS Code.
2.  Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X).
3.  Search for `LucidLayer.traceform-vscode`.
4.  Click "Install".
5.  The extension and its integrated bridge server will activate automatically.

## Usage

1.  Ensure the Traceform: UI Mapping Browser Extension is installed and enabled in your browser (see Browser Extension README for setup).
2.  Ensure your target web application uses the `@traceform/babel-plugin` Babel plugin in its development build.
3.  Open your project in VS Code (with this extension installed).
4.  Open a React component file (`.js`, `.jsx`, `.ts`, `.tsx`).
4.  Select the name of the component you want to find (e.g., select `MyButton` in `const MyButton = ...`).
5.  Right-click on the selection.
6.  Choose "Traceform: Find Component in UI" from the context menu.
7.  The extension will send the component name (`MyButton`) to the bridge server, which relays it to the browser extension to perform the highlighting.
8.  Check the VS Code status bar for connection status (`$(plug) Traceform: Connected/Disconnected/Error`).

## Troubleshooting

- **No Command in Menu:** Ensure you are right-clicking within a file type specified in `package.json` (`javascript`, `typescript`, `javascriptreact`, `typescriptreact`).
- **"No active editor found"**: Make sure you have a relevant file open and active in the editor pane.
- **"Please select a component name"**: The command currently requires you to select the component name text before right-clicking.
- **"Doesn't look like a valid component name"**: Ensure your selection is a valid JavaScript identifier starting with an uppercase letter.
- **"Traceform bridge not connected" / Connection Issues**: The integrated bridge server should start automatically. Check the VS Code Output panel (select "Traceform" from the dropdown) for logs related to server startup and client connections. Ensure no other process is blocking port 9901. Restarting VS Code will restart the extension and server.
- **No Highlighting in Browser:** Check the troubleshooting steps for the Browser Extension and ensure the Babel plugin is correctly configured and injecting `data-traceform-id` attributes.

# Traceform VSCode Extension

## What It Is

The Traceform VSCode extension is a bridge between your code and your running web application. It's simple but powerful, select a component in your source code, trigger "Find in UI", and watch as that component gets highlighted in your browser. 

No more context switching between code and UI. No more guessing which component renders what.

## How It Works

At its core, Traceform uses a local WebSocket bridge server to connect your editor to your browser. Here's the architecture:

1. **Bridge Server** (Port 9901) - The communication hub
2. **VS Code Client** - Connects your editor actions to the bridge
3. **Browser Extension** - Receives highlight commands and visually marks components
4. **Sidebar UI** - Monitors connection status and controls the bridge

When you trigger the "Find in UI" command, we generate a unique ID for your component and broadcast it to any connected browser extensions, which then highlight the corresponding rendered element.

## Setup & Installation

1. Install the Traceform VSCode Extension from the [marketplace](https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode)
2. Install the Traceform Browser [Extension](https://github.com/lucidlayer/traceform/releases) (Chrome/Firefox/Edge)
3. That's it - when you open a React/Vue/Angular project, the bridge server starts automatically

## Key Features

### Find in UI

```
1. Position cursor near a component definition or select component name
2. Right-click and select "Traceform: Find in UI" (or use Command Palette)
3. The component will highlight in your browser
```

The extension intelligently identifies components by:
- Looking for common declaration patterns (`class X`, `function X`, `const X =`)
- Calculating relative paths for consistent IDs
- Generating a unique `traceformId` in the format `path:ComponentName:InstanceIndex`

### Bridge Server Management

The extension maintains a WebSocket server on port 9901 that:
- Auto-starts when you open the extension
- Handles port conflicts gracefully
- Can be manually controlled via the sidebar

### Connection Status

- VS Code Status Bar shows connection state (`Connected`, `Disconnected`, `Connecting`)
- Sidebar view provides detailed logs and server controls
- Automatic reconnection with exponential backoff if the connection drops

## Technical Implementation

### Core Components

- **extension.ts**: Main activation script, command registration, component identification
- **bridgeServer.ts**: WebSocket server implementation, client management, message broadcasting
- **client.ts**: Internal WebSocket client, connection handling, status bar integration
- **sidebarProvider.ts**: UI implementation using VS Code's WebView API

### Communication Flow

```
┌─────────┐           ┌─────────────┐         ┌───────────────┐         ┌──────────────┐
│ VS Code │ ──────►   │ Internal    │ ──────► │ Bridge Server │ ──────► │ Browser      │
│ Editor  │           │ WS Client   │         │ (Port 9901)   │         │ Extension    │
└─────────┘           └─────────────┘         └───────────────┘         └──────────────┘
     │                      ▲                        │                         │
     │                      │                        │                         │
     │                      │                        ▼                         ▼
     │                 ┌─────────────┐         ┌───────────────┐         ┌──────────────┐
     └────────────────┤   VS Code   │         │ Status/Logs   │         │ UI Component │
                      │ Status Bar  │         │ (Sidebar)     │         │ Highlighting │
                      └─────────────┘         └───────────────┘         └──────────────┘
```

### WebSocket Message Format

For "Find in UI" commands:
```json
{
  "type": "HIGHLIGHT_COMPONENT",
  "traceformId": "src/components/Button.tsx:Button:0"
}
```

## Advanced Usage

### Custom Commands

All extension commands are accessible via VS Code's Command Palette:
- `traceform.findInUI` - Highlight component in browser
- `traceform.startServer` - Manually start bridge server
- `traceform.stopServer` - Stop bridge server
- `traceform.restartServer` - Restart bridge server

### Troubleshooting

1. **Port Conflicts**: If port 9901 is already in use, the extension will attempt to:
   - Check if the existing process is another Traceform server
   - Use it if compatible, otherwise report the conflict

2. **Connection Issues**: Check the sidebar for logs. The client implements automatic reconnection with exponential backoff (5-60 seconds).

3. **Component Not Highlighting**: Ensure your component naming in source matches what's expected in the browser. The extension uses simple inference patterns that may not catch all definition styles.

## Roadmap

Our team is actively working on:

1. **Source Map Integration** - For more accurate mapping between source code and compiled output
2. **Shared ID Generation** - Consistent traceformId generation across tools
3. **Enhanced Component Inference** - Better detection of component definitions

## About Traceform

Traceform aims to seamlessly connect your code to its rendered UI, eliminating the mental overhead of context switching and making front-end development more intuitive.

---

*This extension is part of the Traceform developer toolset. For more information, visit [traceform github](https://github.com/lucidlayer/traceform)*

## License & Legal Notice

This extension is licensed under the Business Source License 1.1 (BUSL-1.1).
- Production use for ≤ 3 dev seats is free.
- All BUSL-licensed code will convert to Apache-2.0 on 2028-04-15.
- See [LICENSE](./LICENSE) and [LICENSE-STACK.md](../LICENSE-STACK.md) for details.

For more, see the [Traceform Licensing FAQ](../docs/licensing.md).
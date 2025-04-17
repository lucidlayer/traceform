# Traceform Browser Extension

## What It Is

The Traceform Browser Extension is the critical counterpart to our VSCode extension. Together, they eliminate the most frustrating part of frontend development, the constant context switching between code and rendered UI.

This extension receives commands from VSCode via our bridge server and highlights components directly in your browser. Simple concept, massive productivity impact.

## How It Works

The architecture is deliberately minimal:

1. **WebSocket Client** - Connects to the Bridge Server (port 9901)
2. **Content Script** - Injected into your web pages
3. **Overlay System** - Creates precise visual highlights
4. **DevTools Panel** - Monitors connections and controls targeting

When you trigger "Find in UI" in VSCode, the browser extension receives the component ID and instantly highlights the corresponding element in your running application.

## Key Features

### Component Highlighting

```
1. VS Code sends a component ID via the bridge
2. Browser extension finds all DOM elements with matching data-traceform-id
3. Visual overlay instantly appears on the target elements
```

The highlighting system:
- Creates non intrusive overlays that don't affect your app's behavior
- Positions overlays with pixel perfect accuracy using getBoundingClientRect()
- Automatically adjusts to scrolling and page changes

### Target URL Management

- Configure which localhost URL to monitor (defaults to http://localhost:5173/)
- Extension periodically checks if your dev server is running (every 5 seconds)
- Supports automatic tab detection and targeting

## Technical Implementation

### Core Components

- **background.ts**: WebSocket client, tab management, status broadcasting
- **content.ts**: Injected into web pages, receives highlight commands
- **overlay.ts**: DOM manipulation, visual highlighting implementation

### Communication Flow

```
┌───────────────┐         ┌──────────────┐         ┌──────────────┐         ┌─────────────┐
│ Bridge Server │ ──────► │ background.ts│ ──────► │  content.ts  │ ──────► │  overlay.ts │
│ (Port 9901)   │         │ (Service W.) │         │ (In page)    │         │ (DOM manip) │
└───────────────┘         └──────────────┘         └──────────────┘         └─────────────┘
      ▲                                                                             │
      │                                                                             │
      │                                                                             ▼
┌─────────────┐                                                             ┌─────────────┐
│ VS Code     │                                                             │ Highlighted │
│ Extension   │                                                             │ Components  │
└─────────────┘                                                             └─────────────┘
```

### WebSocket Message Format

For component highlighting:
```json
{
  "type": "HIGHLIGHT_COMPONENT",
  "traceformId": "src/components/Button.tsx:Button:0"
}
```

## Installation & Setup

1. Install from our [GitHub releases](https://github.com/lucidlayer/traceform/releases) (Chrome/Firefox/Edge)
2. Install the Traceform [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode)
3. Configure the [npm babel plugin](https://www.npmjs.com/package/@lucidlayer/babel-plugin-traceform)

[Detailed setup instructions](https://github.com/lucidlayer/traceform/blob/main/traceform/README.md)

That's it. No complex configuration, no build process changes, no performance impact.


### Troubleshooting

1. **Connection Issues**: Check your [extension's page](chrome://extensions/), the extension implements automatic reconnection with exponential backoff, so you may need to reload it, you can tell you need to reload it if it says "Inspect views: service worker(inactive)" 

2. **Components Not Highlighting**: Ensure the elements have the correct data-traceform-id attributes. These should match what's sent from VSCode.

3. **Multiple Instances**: The extension will work across multiple tabs, but will prioritize the configured target URL which is the localhost urls

## Roadmap

We're focused on:

1. **Performance Optimization** - Zero impact on application rendering
2. **Enhanced Visual Controls** - More customization of highlight appearance
3. **Two-way Communication** - Click in browser to jump to source code

## About Traceform

Traceform eliminates the mental overhead of frontend development. We're obsessed with making the connection between code and UI as seamless as possible.

---

*This extension is part of the Traceform developer toolset. For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform)*

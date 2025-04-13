# System Patterns
timestamp: 2025-04-12T17:01:10Z

## Architecture
- **Monorepo**: All subprojects (Babel plugin, browser extension, VS Code extension, bridge server, example app) are managed in a single npm workspace for consistency and shared tooling.
- **WebSocket Communication**: Real-time, cross-process messaging between VS Code, bridge server, and browser extension.
- **Attribute Injection**: Babel plugin injects `data-component="ComponentName"` into JSX roots for runtime DOM mapping.
- **Strict TypeScript**: All code is TypeScript with strict mode, shared base config, and enforced lint/format.

## Design Patterns
- **Visitor Pattern**: Used in Babel plugin for AST traversal and JSX transformation.
- **Observer Pattern**: Browser extension uses MutationObserver to handle dynamic DOM changes.
- **Command Pattern**: VS Code extension registers and handles "Find in UI" command.
- **Relay Pattern**: Bridge server relays messages between editor and browser clients.
- **Overlay Pattern**: Browser extension overlays highlight boxes on DOM nodes.

## Technical Decisions
- **TypeScript everywhere** for type safety and shared types.
- **Airbnb + Prettier** for linting/formatting.
- **Node.js v18.17+** for native fetch, WebSocket, and cross-platform support.
- **Chrome/Edge (MV3)** as primary browser targets for extension.
- **No OS-specific dependencies**; all scripts use relative paths and cross-env.
- **Manual and automated validation** at every integration point.

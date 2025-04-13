# Decision Journal
timestamp: 2025-04-12T23:20:55Z # Updated timestamp

## Active Decisions

- [2025-04-12] #ARCH_001 "Monorepo and TypeScript Everywhere" [Confidence: HIGH]
  - **Context**: Need for maintainability, type safety, and shared tooling across all subprojects.
  - **Options**: Separate repos, JavaScript, or monorepo with TypeScript.
  - **Decision**: Use a single npm monorepo, all code in strict TypeScript, shared configs.
  - **Components**: All (#BABEL_PLUGIN, #EXT_CONTENT, #EXT_OVERLAY, #EXT_BG, #VSC_EXT, #VSC_CLIENT, #BRIDGE_SERVER, #EX_BTN, #EX_AVATAR, #EX_CARD, #EX_HEADER, #EX_FOOTER, #EX_HOME, #EX_PROFILE)
  - **Status**: Active
  - **Source**: MVP Planning

- [2025-04-12] #TECH_002 "WebSocket Protocol for Communication" [Confidence: HIGH]
  - **Context**: Need for real-time, cross-process messaging between VS Code, bridge server, and browser extension.
  - **Options**: HTTP polling, REST, or WebSocket.
  - **Decision**: Use WebSocket for all inter-process communication.
  - **Components**: #VSC_CLIENT, #BRIDGE_SERVER, #EXT_BG
  - **Status**: Active
  - **Source**: MVP Planning

- [2025-04-12] #SEC_003 "Chrome/Edge as Primary Browser Targets" [Confidence: HIGH]
  - **Context**: Need for reliable extension APIs and devtools support.
  - **Options**: Chrome/Edge only, or include Firefox in MVP.
  - **Decision**: Target Chrome/Edge (MV3) for MVP; Firefox is out of scope for now.
  - **Components**: #EXT_CONTENT, #EXT_OVERLAY, #EXT_BG
  - **Status**: Active
  - **Source**: MVP Planning

- [2025-04-12] #IMPL_004 "Strict Lint/Format Enforcement" [Confidence: HIGH]
  - **Context**: Need for code consistency and cross-platform reliability.
  - **Options**: No lint, basic lint, or strict Airbnb + Prettier everywhere.
  - **Decision**: Enforce Airbnb + Prettier lint/format in all subprojects.
  - **Components**: All
  - **Status**: Active
  - **Source**: MVP Planning

- [2025-04-12] #DX_001 "Integrate Bridge Server into VS Code Extension" [Confidence: MEDIUM]
  - **Context**: Need to simplify the setup process for developers by reducing the number of manually managed processes.
  - **Options**: Keep server separate, Integrate server into VS Code extension, Integrate server into Browser extension.
  - **Decision**: Integrate Bridge Server logic directly into VS Code extension activation/deactivation lifecycle. The extension will manage starting/stopping the server.
  - **Rationale**: Eliminates a key manual step for the user. VS Code extension lifecycle is a natural fit for managing a related background process. Port conflict detection will be added.
  - **Components**: #VSC_EXT, #BRIDGE_SERVER
  - **Status**: Active
  - **Source**: TASK_008

- [2025-04-12] #DX_002 "Publish Key Components for Standard Installation" [Confidence: HIGH]
  - **Context**: Need to make installation easier for developers integrating the toolset into their projects.
  - **Options**: Require local linking/paths, Publish components to registries.
  - **Decision**: Publish the Babel Plugin (#BABEL_PLUGIN) to npm and the VS Code Extension (#VSC_EXT) to the VS Code Marketplace.
  - **Rationale**: Aligns with standard developer workflows for installing tools and extensions. Significantly lowers the barrier to entry. Browser extension publishing is deferred for now due to potential review complexities.
  - **Components**: #BABEL_PLUGIN, #VSC_EXT
  - **Status**: Active
  - **Source**: TASK_008

- [2025-04-12] #NAME_001 "Project Naming and Scope" [Confidence: HIGH]
  - **Context**: Need consistent and descriptive naming for the project and its publishable packages.
  - **Options**: Code-to-UI Mapper, Reflex, Traceform, XRay, etc.
  - **Decision**: Adopt "Traceform" as the conceptual project name. Use `@lucidlayer` scope for packages. Publishable packages will be named `@lucidlayer/babel-plugin-traceform` and `@lucidlayer/vscode-traceform`. Author set to "lucidlayer".
  - **Rationale**: "Traceform" clearly reflects the core functionality. `@lucidlayer` scope provides clear ownership. Standard naming conventions used for packages.
  - **Components**: All
  - **Status**: Active
  - **Source**: User Decision

## Historical Decisions
<!-- List historical decisions here as the project evolves -->

# Decision Journal
timestamp: 2025-04-12T17:06:26Z

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

## Historical Decisions
<!-- List historical decisions here as the project evolves -->

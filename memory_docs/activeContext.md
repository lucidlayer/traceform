# Active Context
timestamp: 2025-04-12T22:55:53Z # Updated timestamp

## Current Focus
- Planning Developer Experience (DX) improvements for Code-to-UI Mapper [TASK_008].
- Key goals: Integrate bridge server into VS Code extension and publish Babel plugin & VS Code extension for easier setup.

## Recent Changes
- Completed implementation tasks TASK_001 through TASK_007.
- Successfully executed end-to-end tests for the core highlighting feature.
- Resolved various build and configuration issues encountered during testing setup (port conflicts, build scripts, linking, launch config).
- Updated all relevant memory docs (`codeMap_root.md`, `progress.md`, `task_registry.md`, project README) to reflect MVP completion and testing setup verification.
- Created TASK_008 for DX improvements.

## Active Decisions
- [#DX_001] Integrate Bridge Server logic directly into VS Code extension activation/deactivation lifecycle. (From TASK_008)
- [#DX_002] Publish Babel Plugin to npm and VS Code Extension to Marketplace for standard installation. (Browser Extension publishing deferred). (From TASK_008)
- All code in TypeScript, strict mode.
- Monorepo with npm workspaces, shared config.
- Chrome/Edge as primary browser extension targets.
- WebSocket protocol for all inter-process communication.
- Airbnb + Prettier lint/format enforced everywhere.

## Immediate Priorities
1. Execute subtasks for TASK_008:
    - SUBTASK_008.1: Integrate Bridge Server into VS Code Extension.
    - SUBTASK_008.2: Prepare & Publish Babel Plugin.
    - SUBTASK_008.3: Prepare & Publish VS Code Extension.
    - SUBTASK_008.4: Update Documentation for New Setup.

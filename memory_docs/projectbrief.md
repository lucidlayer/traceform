# Project Brief
timestamp: 2025-04-13T13:31:00Z # Updated for rebranding

## Overview
Traceform is a developer tool that creates a two-way bridge between React component source code and their live rendered instances in the browser. It enables developers to select a component in VS Code and instantly highlight all its rendered DOM nodes in the browser, streamlining the workflow for UI verification, debugging, and onboarding.

## Goals
- Enable code-to-UI mapping for React (MVP: Chrome/Edge, TypeScript, Node 18.17+).
- Provide a seamless workflow: VS Code extension → local bridge server → browser extension → instrumented React app.
- Ensure the system is foolproof, cross-platform, and easy to extend.
- Deliver exhaustive documentation and validation at every step.

## Scope
- Monorepo with five subprojects: Babel plugin, browser extension, VS Code extension, local bridge server, and example React app.
- All code in TypeScript, strict lint/format, and cross-platform support.
- WebSocket-based communication for real-time highlighting.
- MVP targets Chrome/Edge; Firefox and other frameworks are out of scope for MVP.
- End-to-end validation, error handling, and documentation included.

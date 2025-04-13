# Product Context
timestamp: 2025-04-12T16:59:12Z

## Problem Space
Frontend codebases are often sprawling, making it difficult for developers to connect code (React components) to their visual representation in the UI. Traditional browser devtools allow UI-to-code inspection, but the reverse—starting from code and finding all live UI instances—is missing. This gap leads to tedious workflows, missed edge cases, and onboarding friction for new developers.

## User Journey
- Developer opens a React project in VS Code.
- Right-clicks a component definition and selects "Find in UI".
- The VS Code extension sends the component name to the local bridge server.
- The browser extension receives the command and highlights all DOM nodes rendered from that component in the running app.
- Developer instantly sees where the component appears, even if used in multiple places or with dynamic props.
- This workflow accelerates debugging, UI verification, and onboarding.

## Business Context
- Target users: React developers, UI engineers, onboarding team members, and QA.
- Value proposition: Reduces time to trace code-to-UI, prevents missed UI breakages, and improves developer productivity.
- MVP focuses on React, Chrome/Edge, and VS Code for maximum impact and ease of adoption.
- The architecture is extensible for future support of other frameworks (Vue, Svelte) and browsers (Firefox).

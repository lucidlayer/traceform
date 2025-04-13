# Product Context
timestamp: 2025-04-13T02:10:00Z

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

## Competitor Analysis [Confidence: MEDIUM]
- **Primary Competitor:** The standard 'React Developer Tools' browser extension. It allows inspection of component hierarchy, state, and props, and uses source maps to link back to source code. However, it lacks the direct 'click UI element -> jump to IDE source code line' functionality.
- **Alternative Workflow Tools:** Tools like 'Microsoft Edge DevTools for VS Code' integrate inspection capabilities directly within the IDE, offering a different debugging approach compared to the browser-centric interaction of `Traceform`.
- **Unique Value Proposition:** `Traceform`'s core mechanism—using injected IDs via a build tool (Babel plugin) combined with a browser extension and VSCode extension bridge for direct code navigation—appears to be a unique approach based on initial research. Source maps can be fragile, whereas injected IDs offer a potentially more robust link.

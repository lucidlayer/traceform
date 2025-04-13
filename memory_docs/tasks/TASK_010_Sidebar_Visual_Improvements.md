# TASK_010: VSCode Sidebar Visual Improvements
timestamp: 2025-04-13T12:43:00Z
status: In Progress # Changed from Planning
components: [#VSC_EXT] # Specifically sidebarProvider.ts
implements_decisions: []
generated_decisions: [#UI_001] # Formalizing decision
confidence: HIGH # Increased confidence after implementation

## Task Definition
Improve the visual presentation, consistency, and usability of the VSCode extension's sidebar webview panel. This involves migrating from basic HTML elements to the official VS Code Webview UI Toolkit and adding contextual information.

## Subtasks
1. ✅ SUBTASK_010.1: "Integrate VS Code Webview UI Toolkit"
   - Goal: Replace existing HTML elements (buttons, textarea, divs, spans) in `sidebarProvider.ts`'s `_getHtmlForWebview` method with corresponding components from `@vscode/webview-ui-toolkit`. Ensure proper script inclusion and initialization.
   - Required contexts: `code-to-ui-mapper/vscode-extension/src/sidebarProvider.ts`, VS Code Webview UI Toolkit Documentation (external).
   - Output: Updated `sidebarProvider.ts` using toolkit components, maintaining existing functionality.
   - Dependencies: None.
   - Completed: 2025-04-13
   - Summary: Successfully replaced standard HTML elements with `<vscode-button>`, `<vscode-text-area>`, `<vscode-collapsible>`, and `<vscode-link>`. Included toolkit script and updated CSP.

2. ✅ SUBTASK_010.2: "Enhance Status Display (Add Port)"
   - Goal: Modify the status display in the sidebar to show the port number when the bridge server is running (e.g., "Status: Running on port 8080").
   - Required contexts: `code-to-ui-mapper/vscode-extension/src/sidebarProvider.ts`, `code-to-ui-mapper/vscode-extension/src/bridgeServer.ts` (to ensure status updates include port).
   - Output: Updated `sidebarProvider.ts` and `bridgeServer.ts` to display the port.
   - Dependencies: SUBTASK_010.1 (assumes toolkit components are used).
   - Completed: 2025-04-13
   - Summary: Modified `bridgeServer.ts` to emit `StatusUpdatePayload` including the port. Updated `sidebarProvider.ts` listener and webview script to handle the payload and display the port.

3. ✅ SUBTASK_010.3: "Add Documentation Link"
   - Goal: Add a small, non-intrusive link (e.g., using `<vscode-link>` or an icon button) in the sidebar that opens the extension's main README file or documentation page.
   - Required contexts: `code-to-ui-mapper/vscode-extension/src/sidebarProvider.ts`.
   - Output: Updated `sidebarProvider.ts` with the added link.
   - Dependencies: SUBTASK_010.1.
   - Completed: 2025-04-13
   - Summary: Added a `<vscode-link href="#">View Documentation</vscode-link>` below the button group. Functionality to open the actual link requires a separate command implementation (future task).

4. ⏱️ SUBTASK_010.4: "(Future) Enhance Log Viewer"
   - Goal: Improve the log viewing experience (optional, lower priority for now). Ideas include timestamps, color-coding, filtering/search.
   - Required contexts: `code-to-ui-mapper/vscode-extension/src/sidebarProvider.ts`, `code-to-ui-mapper/vscode-extension/src/bridgeServer.ts` (if structured logs are needed).
   - Output: Enhanced log display functionality.
   - Dependencies: SUBTASK_010.1.

## Generated Decisions
- Potentially #UI_001: "Adopt VSCode Webview UI Toolkit for Sidebar" - To be formalized during implementation.

## Integration Notes
- Subtasks 1, 2, and 3 are the primary focus for initial visual improvement.
- Subtask 4 is marked as future/optional and depends on the complexity and value assessment after the initial improvements.
- Ensure message passing between the webview and extension continues to function correctly after UI toolkit integration.
- Verify theme adaptability after migrating to the toolkit.

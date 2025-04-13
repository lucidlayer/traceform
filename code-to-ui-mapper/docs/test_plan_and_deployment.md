# Test Plan & Deployment Guide

timestamp: 2025-04-12T20:55:58Z # Updated timestamp

---

## Test Plan

### Overview
This test plan covers all major MVP components: Babel plugin, browser extension, VS Code extension, bridge server, and example React app. It includes unit, integration, and manual test protocols. The goal is to ensure each component functions correctly in isolation and that the end-to-end "highlight" flow works reliably.

### Test Cases (Detailed)

#### 1. Babel Plugin (#BABEL_PLUGIN)
*   **Unit Tests (Jest):** `babel-plugin-inject-id/__tests__/index.test.ts`
    *   **Case 1.1:** Injects `data-component` attribute into simple functional components.
    *   **Case 1.2:** Injects `data-component` attribute into simple class components.
    *   **Case 1.3:** Correctly uses the component's display name for the attribute value.
    *   **Case 1.4:** Handles components wrapped in Fragments (`<>...</>`).
    *   **Case 1.5:** Handles components wrapped in HOCs (Higher-Order Components).
    *   **Case 1.6:** Skips injection for intrinsic HTML elements (div, span, etc.).
    *   **Case 1.7:** Handles components with existing `data-component` attributes (should overwrite or skip based on implementation choice - *verify chosen behavior*).
    *   **Case 1.8:** Handles components with no explicit return (e.g., `() => <div />`).
*   **Manual Build Check:**
    *   **Case 1.9:** Build the `example-react-app` and inspect the output bundle or running app DOM to confirm `data-component` attributes are present on expected components (#EX_BTN, #EX_AVATAR, etc.).

#### 2. Bridge Server (#BRIDGE_SERVER)
*   **Unit/Integration Tests (Potentially Jest or manual):**
    *   **Case 2.1:** Server starts without errors on the specified port (9901).
    *   **Case 2.2:** Accepts WebSocket connections from multiple clients (VS Code, Browser Extension).
    *   **Case 2.3:** Correctly receives a valid `HIGHLIGHT_COMPONENT` message from one client.
    *   **Case 2.4:** Broadcasts the received valid message to *all other* connected clients.
    *   **Case 2.5:** Ignores messages that do not match the `HIGHLIGHT_COMPONENT` schema (e.g., wrong `type`, missing `component`).
    *   **Case 2.6:** Handles client disconnects gracefully (removes from broadcast list).
    *   **Case 2.7:** Logs connection/disconnection events and message processing errors.

#### 3. Browser Extension (#EXT_BG, #EXT_CONTENT, #EXT_OVERLAY)
*   **Background Script (#EXT_BG):**
    *   **Case 3.1:** Establishes WebSocket connection to the Bridge Server (ws://localhost:9901) on startup.
    *   **Case 3.2:** Attempts reconnection if the connection fails or drops.
    *   **Case 3.3:** Correctly receives `HIGHLIGHT_COMPONENT` messages from the Bridge Server.
    *   **Case 3.4:** Accurately relays the message content to the Content Script (#EXT_CONTENT) via `chrome.tabs.sendMessage`.
    *   **Case 3.5:** Handles errors during message relay.
*   **Content Script (#EXT_CONTENT):**
    *   **Case 3.6:** Listens for messages from the Background Script.
    *   **Case 3.7:** On receiving a `HIGHLIGHT_COMPONENT` message, queries the DOM for elements matching `[data-component="ComponentName"]`.
    *   **Case 3.8:** Correctly finds single or multiple matching elements.
    *   **Case 3.9:** Calls the Overlay script (#EXT_OVERLAY) with the found elements.
    *   **Case 3.10:** Handles cases where no matching elements are found.
    *   **Case 3.11 (Dynamic Content):** If a MutationObserver is used, verify it detects newly added components with `data-component` attributes.
*   **Overlay Script (#EXT_OVERLAY):**
    *   **Case 3.12:** Creates and displays visual overlays accurately positioned over the target DOM element(s).
    *   **Case 3.13:** Handles overlaying multiple elements for the same component ID.
    *   **Case 3.14:** Applies correct styling (border, background) to overlays.
    *   **Case 3.15:** Removes previous overlays when a new highlight command is received or when highlighting is cleared.
    *   **Case 3.16:** Overlays work correctly with different CSS positioning (static, relative, absolute, fixed).

#### 4. VS Code Extension (#VSC_EXT, #VSC_CLIENT)
*   **Extension Logic (#VSC_EXT):**
    *   **Case 4.1:** "Find in UI" command appears in the editor context menu.
    *   **Case 4.2:** Command correctly extracts the component name based on text selection or cursor position within a likely component definition (e.g., `<Button`, `function Button`).
    *   **Case 4.3:** Handles cases where no component name can be reasonably inferred (shows error/warning).
    *   **Case 4.4:** Calls the WebSocket client (#VSC_CLIENT) with the extracted component name.
*   **WebSocket Client (#VSC_CLIENT):**
    *   **Case 4.5:** Establishes WebSocket connection to the Bridge Server (ws://localhost:9901) on activation.
    *   **Case 4.6:** Attempts reconnection if the connection fails or drops.
    *   **Case 4.7:** Sends a correctly formatted `HIGHLIGHT_COMPONENT` message to the Bridge Server when triggered by the extension logic.
    *   **Case 4.8:** Handles errors during message sending (e.g., server unavailable).

#### 5. Example React App (#EX_ components)
*   **Manual Verification:**
    *   **Case 5.1:** App builds and runs without errors using `vite`.
    *   **Case 5.2:** All custom components (#EX_BTN, #EX_AVATAR, etc.) rendered in the browser have the `data-component` attribute with the correct component name value (verified via browser dev tools).
    *   **Case 5.3:** App functions normally (buttons clickable, navigation works).

#### 6. End-to-End Integration (Highlight Flow)
*   **Manual Test Protocol:**
    *   **Step 6.1:** Start the Bridge Server.
    *   **Step 6.2:** Build and load the Browser Extension (unpacked).
    *   **Step 6.3:** Build and run the VS Code Extension (debugging mode).
    *   **Step 6.4:** Build and run the Example React App.
    *   **Step 6.5:** Open the Example React App in the browser (ensure the extension is active).
    *   **Step 6.6:** In VS Code, open a component file (e.g., `Button.tsx`). Right-click on the component name or within its definition and select "Find in UI".
    *   **Expected 6.6:** The corresponding Button component(s) in the browser should be highlighted by the overlay. Verify console logs in Bridge Server, Browser Extension background/content scripts, and VS Code debug console for correct message flow.
    *   **Step 6.7:** Repeat step 6.6 for other components (#EX_AVATAR, #EX_CARD, etc.).
    *   **Step 6.8:** Test highlighting a component that appears multiple times (e.g., Button).
    *   **Expected 6.8:** All instances should be highlighted.
    *   **Step 6.9:** Test highlighting a component that isn't currently rendered in the UI.
    *   **Expected 6.9:** No highlight should appear, no errors should occur.
    *   **Step 6.10:** Test rapidly triggering highlights for different components.
    *   **Expected 6.10:** Overlays should update correctly without visual glitches or errors.
    *   **Step 6.11:** Test disconnecting/reconnecting the Bridge Server while extensions are running.
    *   **Expected 6.11:** Extensions should attempt to reconnect and function correctly once the server is back online.

---

## Validation Protocols

### Validation Checkpoints
- **After Component Build:** Verify unit tests pass and manual build checks confirm expected output (e.g., Babel plugin injecting attributes).
- **After Server Start:** Confirm the Bridge Server starts, listens on the correct port, and logs successful initialization.
- **After Extension Load:** Ensure Browser and VS Code extensions connect to the Bridge Server without errors. Check for console logs confirming connection.
- **During End-to-End Test:** Validate message flow at each step (VS Code -> Bridge -> Browser -> UI Highlight). Check logs in all components.
- **Before Deployment:** Run the full suite of unit, integration, and end-to-end tests.

### Acceptance Criteria
- **Babel Plugin:** Correctly injects `data-component` attributes into all applicable React components in the example app build. Unit tests pass.
- **Bridge Server:** Successfully relays `HIGHLIGHT_COMPONENT` messages between connected clients without loss or corruption. Handles connections/disconnections robustly.
- **Browser Extension:** Accurately identifies and overlays the correct DOM elements based on messages received from the Bridge Server. Works across different page structures and component instances.
- **VS Code Extension:** Reliably extracts component names and sends correct `HIGHLIGHT_COMPONENT` messages to the Bridge Server via the context menu command.
- **End-to-End Flow:** Triggering "Find in UI" in VS Code consistently results in the correct component being highlighted in the browser within a reasonable time frame (< 2 seconds). The system remains stable during repeated use.

### Edge Case Handling
- **No Matching Component:** If "Find in UI" is triggered for a component not present in the DOM, no highlight should appear, and no errors should be thrown. Log appropriate messages (e.g., "Component X not found in current view").
- **Multiple Matching Components:** All instances of a component in the DOM should be highlighted simultaneously.
- **Rapid Highlighting:** Triggering highlights for different components in quick succession should update the UI correctly without race conditions or visual artifacts.
- **Server Disconnection:** Extensions should detect server disconnection and attempt reconnection periodically. Highlighting should resume automatically upon successful reconnection.
- **Invalid Messages:** The Bridge Server and extensions should gracefully handle malformed or unexpected messages, logging errors without crashing.
- **Dynamic Content:** If the target application loads components dynamically, the browser extension (if using MutationObserver) should detect and be able to highlight newly added components.

---

## Deployment & Integration Guide (Local Development Setup)

This guide details how to set up and run all components of the Code-to-UI Mapper system locally for development and testing purposes.

### Prerequisites
- **Node.js:** Version 18 or higher (Verify with `node -v`).
- **npm:** Usually included with Node.js (Verify with `npm -v`).
- **Supported Browser:** Google Chrome or Microsoft Edge (for loading the unpacked extension).
- **VS Code:** The code editor itself.
- **Git:** For cloning the repository if you haven't already.
- **vsce (Optional):** `npm install -g @vscode/vsce` if you intend to package the VS Code extension locally. Not required for standard use.

### Step-by-Step Setup & Execution

1.  **Clone Repository (if needed):**
    ```bash
    git clone <repository_url>
    cd code-to-ui-mapper # Navigate into the main project directory
    ```

2.  **Install Dependencies for All Subprojects:**
    Install dependencies for the components you need to interact with directly (Browser Extension for loading, Example App for testing). The Babel Plugin and VS Code Extension will be installed from their respective registries.
    ```bash
    # In terminal 1: Browser Extension (for loading unpacked)
    cd browser-extension
    npm install
    cd ..

    # In terminal 2: Example React App (for testing the setup)
    cd example-react-app
    # Install the published Babel plugin
    npm install --save-dev @lucidlayer/babel-plugin-traceform@0.1.1
    # Install other dependencies
    npm install
    cd ..

    # Note: No separate install needed for vscode-extension (install from Marketplace)
    # Note: No separate install needed for local-bridge-server (integrated into vscode-extension)
    # Note: No separate install needed for babel-plugin-inject-id (installed into example-react-app from npm)
    ```

3.  **Build Required Packages:**
    Build the Browser Extension to prepare its `dist` directory for loading.
    ```bash
    # In terminal 1: Browser Extension
    cd browser-extension && npm run build && cd ..

    # Note: No build needed for Example React App (using dev server)
    # Note: No build needed for VS Code Extension (installed from Marketplace)
    # Note: Babel Plugin build is only needed if developing the plugin itself.
    ```

4.  **(Removed) Start the Bridge Server:**
    *This step is no longer necessary. The Bridge Server is now automatically managed by the VS Code extension.*

5.  **Load the Browser Extension:**
    *   Open Chrome/Edge.
    *   Navigate to `chrome://extensions` or `edge://extensions`.
    *   Enable "Developer mode" (usually a toggle in the top-right corner).
    *   Click "Load unpacked".
    *   Select the `code-to-ui-mapper/browser-extension/dist` directory (ensure you ran the build step first).
    *   The extension icon should appear in your browser toolbar.

6.  **Install and Run the VS Code Extension:**
    *   Open VS Code.
    *   Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X).
    *   Search for `LucidLayer.code-to-ui-mapper-vscode-extension` in the Marketplace.
    *   Click "Install".
    *   The extension will activate automatically. The integrated Bridge Server will start in the background (check VS Code Output panel for "Code-to-UI Mapper" logs if needed).
    *   Use your regular VS Code window for testing the "Find in UI" command.

7.  **Run the Example React App (Development Server):**
    Keep this running in its own terminal.
    ```bash
    # In a dedicated terminal:
    cd example-react-app
    npm run dev
    # Expected output: Server running at http://localhost:5173 (or similar)
    ```
    *   Open the provided URL (e.g., `http://localhost:5173`) in the browser where you loaded the unpacked Browser Extension (Step 5).

### End-to-End Testing & Validation (Updated Setup)

With the VS Code extension installed from the Marketplace and the Browser Extension loaded unpacked:
1.  Ensure the Example React App is running (`npm run dev` in `example-react-app`).
2.  Open the Example React App URL in your browser.
3.  Open the `code-to-ui-mapper/example-react-app` folder in VS Code (ensure the `LucidLayer.code-to-ui-mapper-vscode-extension` is installed and active).
4.  Perform the end-to-end tests outlined in **Section 6: End-to-End Integration (Highlight Flow)** of the Test Plan above, using your main VS Code window (not an Extension Development Host).

**Key Validation Points (Updated):**
-   Triggering "Find in UI" from your main VS Code window highlights the correct component in the browser.
-   Check the **VS Code Output Panel** for the "Code-to-UI Mapper" channel. You should see logs indicating the Bridge Server started, client connections (from the browser extension), and `HIGHLIGHT_COMPONENT` messages being processed.
-   Check the **Browser's Developer Console** (F12) on the Example React App page for Content Script logs. Check Background Script logs via the `chrome://extensions` page.
-   *(No separate Bridge Server terminal to check)*.

### Troubleshooting Tips (Updated)
-   **No Highlight:**
    *   Verify the VS Code extension is active and the integrated Bridge Server started correctly (check VS Code Output Panel for "Code-to-UI Mapper").
    *   Verify the Browser Extension successfully connected to the Bridge Server (check VS Code Output Panel logs and Browser Extension background script logs).
    *   Ensure the `@lucidlayer/babel-plugin-traceform` is correctly configured in the `example-react-app`'s Babel/Vite config and that `data-component` attributes exist in the DOM.
    *   Check for errors in the Browser Console and VS Code Output Panel.
    *   Ensure you are using your main VS Code window.
-   **Connection Issues:**
    *   Confirm the integrated Bridge Server started on the expected port (9901) by checking the VS Code Output Panel. If another process is using the port, the extension should log an error.
    *   Check firewall settings if the browser extension cannot connect.
    *   Try restarting VS Code (which restarts the extension and server) and reloading the unpacked browser extension.
-   **Build Errors:**
    *   Ensure `npm install` completed successfully in the `browser-extension` and `example-react-app` directories.
    *   Check for TypeScript or ESLint errors in the specific subproject's terminal output during the build.

---

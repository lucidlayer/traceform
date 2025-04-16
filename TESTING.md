# Testing Request: Traceform Code-to-UI Mapping Toolset

## Overview

This document outlines the testing plan for the Traceform toolset, which provides seamless mapping between source code components and their rendered UI elements in the browser during development.

### Components

The toolset consists of three main parts:

1. **Traceform VS Code Extension**: Provides the "Find in UI" command, server management, and status display within VS Code.
2. **@lucidlayer/babel-plugin-traceform**: Injects unique identifiers (data-traceform-id) into React components during the development build.
3. **Traceform Browser Extension**: Listens for commands from the VS Code extension and highlights the corresponding UI elements in the browser.

### Goal

To ensure the end to end functionality works correctly across different application structures, the components integrate smoothly, and error handling is robust.

## Prerequisites & Setup

1. **Clone Repository**: 
   - Ensure you have cloned the test projects after youve followed the [tool setup instructions]([text](https://github.com/lucidlayer/traceform/blob/ff604317cbe111402f14f8def9ecf27eaf0236f7/traceform/README.md))

2. **Install Dependencies**:
   ```bash
   cd ../../traceform-test-app-- && npm install
   cd ../complex && npm install
   ```

3. **Install VS Code Extension**:
   ```bash
   [vscode extensiojn](https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode)
   ```

4. 

5. **Browser Extension**:
   - Install the Traceform browser extension from zip in [releases](https://github.com/lucidlayer/traceform/releases)

6. **Run Demo Projects, dont run both at same time**:
   ```bash
   # In traceform-test-app--/:
   npm install
   npm run dev

   # In demo-proejcts/complex/:
   npm install
   npm run dev
   ```
   - Note the ports each app is running on.

## Testing Procedures

### A. Core "Find in UI" Functionality (End-to-End)

1. Make sure VS Code is open and says connected
2. Open files

3. **Test traceform-test-app-- Components**:
   - In VS Code, navigate to files within `traceform-test-app--/src/`.
   - Test triggering "Find in UI" on the component names/definitions in, by highlighting the targets:
     - `src/components/Button.tsx` (target: Button)
     - `src/components/Card.tsx` (target: Card)
     - `src/components/Footer.tsx` (target: Footer)
     - `src/components/Header.tsx` (target: Header)
   - Verify if the corresponding element gets visually highlighted.

4. **Test demo-proejcts/complex/ Components**:
   - In VS Code, navigate to files within `demo-proejcts/complex/src/`.
   - Test triggering "Find in UI" on the component names/definitions in:
     - `src/components/AlertBanner.tsx` (target: AlertBanner)
     - `src/components/Navbar.tsx` (target: Navbar)
     - `src/App.tsx` (try targeting Layout and App)
   - Verify if the corresponding element gets visually highlighted.

5. **Test Edge Cases**:
   - Trigger the command when browser tabs are closed
   - Trigger the command when the bridge server is stopped
   - Try triggering on non-component code

### B. Bridge Server Management (VS Code Extension)

1. **Sidebar UI**:
   - Open the "Traceform Bridge Status" view in the VS Code sidebar
   - Test "Start", "Stop", and "Restart" buttons
   - Verify server status updates (icon, text, port 9901)
   - Check that buttons enable/disable appropriately
   - Verify logs appear in real-time
   - Test the "Clear Logs" button

2. **VS Code Commands**:
   - Use Command Palette (Ctrl+Shift+P) for:
     - Traceform: Start Server
     - Traceform: Stop Server
     - Traceform: Restart Server
   - Verify status updates in sidebar and status bar

3. **Port Conflict**:
   - Stop the Traceform server
   - Occupy port 9901 (e.g., `npx http-server -p 9901`)
   - Try to start the Traceform server
   - Verify "Port Conflict" status and error message
   - Stop the conflicting process and retry

### C. VS Code Client Status (Status Bar)

- Observe the `$(plug) Traceform: ...` item in the status bar
- Verify it shows appropriate status: "Connected", "Disconnected", "Error", "Connecting..."
- Check tooltip details

### D. Babel Plugin Verification

1. Run each demo app in development mode
2. Open browser developer tools (F12)
3. Use element inspector to examine HTML DOM structure
4. Locate root elements rendered by components from steps A.3 and A.4
5. **Verify Attribute**: Confirm elements have `data-traceform-id` attribute
6. **Verify ID Format**: Check if attribute value matches format: `relativePath:ComponentName:0`
7. **Production Build** (Optional): Create production build (`npm run build`) and verify attributes are not present

## What to Look For

- **Setup Experience**: Clear and working setup steps
- **Accuracy**: Correct element highlighting in the correct demo app
- **Reliability**: Consistent functionality across different components
- **Responsiveness**: Fast highlighting
- **Clear Feedback**: Accurate status updates and error messages
- **Stability**: No crashes in extension or server
- **Correct Injection**: Proper ID injection by Babel plugin

## Reporting Feedback

Please report any issues including:
- Which demo app(s) the issue occurred in
- Steps to reproduce
- Expected vs. actual behavior
- Relevant logs from VS Code
- Screenshots or recordings if helpful
# Test Plan & Deployment Guide

timestamp: 2025-04-12T17:44:36Z

---

## Test Plan

### Overview
This test plan covers all major MVP components: Babel plugin, browser extension, VS Code extension, bridge server, and example React app. It includes unit, integration, and manual test protocols.

### Test Cases

#### 1. Babel Plugin
- **Test:** Injects unique data-component-id into JSX
  - **Steps:** Run plugin on sample React code
  - **Expected:** All components have unique IDs
  - **Edge:** Duplicate IDs are replaced, non-JSX nodes ignored

#### 2. Bridge Server
- **Test:** Receives and broadcasts highlight commands
  - **Steps:** Send valid/invalid WebSocket messages
  - **Expected:** Valid messages broadcast, malformed ignored
  - **Edge:** Handles multiple clients, logs errors

#### 3. Browser Extension
- **Test:** Relays highlight commands to content script
  - **Steps:** Trigger command from bridge server
  - **Expected:** Content script highlights correct component
  - **Edge:** Handles missing/invalid component IDs

#### 4. VS Code Extension
- **Test:** Sends highlight command to bridge server
  - **Steps:** Trigger command from VS Code
  - **Expected:** Correct message sent, UI highlights in browser
  - **Edge:** Handles server disconnects gracefully

#### 5. Example React App
- **Test:** Renders with injected IDs, responds to highlight
  - **Steps:** Load app, trigger highlight
  - **Expected:** Correct component is visually highlighted
  - **Edge:** No highlight if ID missing

### Manual/Integration Protocols
- Start all services (bridge, extensions, app)
- Use VS Code to trigger highlight, verify in browser
- Use browser extension to trigger highlight, verify in app
- Test with multiple browser tabs/VS Code windows

---

## Deployment & Integration Guide

### Prerequisites
- Node.js (v18+), npm
- Chrome/Edge browser
- VS Code

### Step-by-Step

1. **Install dependencies**
   - `npm install` in each subproject

2. **Build all packages**
   - `npm run build` in each subproject

3. **Start Bridge Server**
   - `npm start` in local-bridge-server

4. **Load Browser Extension**
   - Load unpacked extension from browser-extension/dist

5. **Install VS Code Extension**
   - Package and install from vscode-extension/dist

6. **Run Example React App**
   - `npm start` in example-react-app

7. **Test End-to-End**
   - Trigger highlight from VS Code and browser, verify UI response

### Validation
- All highlight commands propagate correctly
- No errors in console/logs
- All components respond as expected

---

# Traceform

A developer tool that bridges React component definitions in code with their live rendered instances in the browser.

## Getting Started (Like Magic!) ✨

Imagine your computer code is like building blocks, and your website is the cool castle you built! This tool helps you point at a block in your code and *POOF* see exactly where it is in your castle!

Here's how to set it up (it's easy peasy!):

**Step 1: Tell Your Code to Wear Name Tags (Babel Plugin)**

This little helper gives each building block (your React components) a special name tag (`data-traceform-id` tag) so our tools can find them later.

1.  **Get the helper:** Open your project's command line (like a magic spell book!) and type:
    ```bash
    npm install --save-dev @traceform/babel-plugin
    # or
    yarn add --dev @traceform/babel-plugin
    ```
2.  **Tell Babel to use it:** Find your Babel configuration file (it might be called `.babelrc`, `babel.config.js`, or inside your `package.json`). Add our helper to the `plugins` list:
    ```json
    // Example for .babelrc or babel.config.js
    {
      "plugins": [
        // ... other plugins
        "@traceform/babel-plugin"
      ]
    }
    ```
    *(If you're using Vite, you might need to configure it in `vite.config.ts` using `@vitejs/plugin-react`'s babel options. See the [Babel Plugin README](babel-plugin/README.md) for details.)*

**Step 2: Get Your Magic Wand (VS Code Extension)**

This is the wand you'll use in your code editor (VS Code) to point at the building blocks.

1.  **Open VS Code.**
2.  Go to the **Extensions** view (click the square blocks icon on the side).
3.  Search for `Traceform for VS Code` (Publisher: `LucidLayer`).
4.  Click **Install**. *(You might need to restart VS Code)*
    *(Alternatively, you can install the `.vsix` file from the `traceform/vscode-extension/` folder using the "Install from VSIX..." command in the Extensions view menu.)*

**Step 3: Get Your Magic Glasses (Traceform: UI Mapping Browser Extension)**

These glasses let you see the magic happen in your web browser (like Chrome or Edge).

1.  **Build the extension:** Navigate to `traceform/browser-extension` and run `npm run build`. This creates a `dist` folder.
2.  **Open your browser's extensions page:**
    *   In Chrome/Edge, type `chrome://extensions` in the address bar and press Enter.
3.  **Turn on "Developer mode":** Look for a switch, usually in the top-right corner, and turn it on.
4.  **Load the glasses:** Click "Load unpacked" and select the `traceform/browser-extension/dist` folder created in step 1.
5.  You should see the "Traceform: UI Mapping" extension appear!

**Step 4: Let's Do Magic! (Using the Tool)**

1.  **Start your React project** like you normally do (e.g., `npm run dev` or `yarn dev`). Make sure the `@traceform/babel-plugin` is active!
2.  **Open your project in VS Code.** Make sure the Traceform extension is running (you might see a "$(plug) Traceform: Connected" message in the status bar).
3.  **Open your website** in the browser where you installed the magic glasses.
4.  **In VS Code:**
    *   Find a React component file (like `Button.tsx`).
    *   Right-click inside the component code (specifically on the component's name or within its JSX return).
    *   Choose **"Traceform: Find Component in UI"**.
5.  **Look at your website:** *Abracadabra!* The matching part(s) of your website should light up with a blue box! ✨

Now you can easily see where your code lives in your running website!

## Monorepo Structure

- `babel-plugin/` – Babel plugin to inject `data-traceform-id` attributes
- `browser-extension/` – Browser extension ("Traceform: UI Mapping") for DOM highlighting
- `vscode-extension/` – VS Code extension ("Traceform for VS Code") for "Find in UI" (includes integrated bridge server)
- `local-bridge-server/` – (Deprecated) Original standalone WebSocket bridge server logic (now integrated into `vscode-extension`)
- `example-react-app/` – Testbed React app
- `docs/` – Developer documentation (includes Test Plan & Deployment Guide)

## Status (as of 2025-04-13 - Post Rebranding)

- **MVP Complete & Rebranded:** All core components (Babel plugin, browser extension, VS Code extension, bridge server, example app) have been implemented and rebranded to "Traceform".
- **End-to-End Testing:** The core "Find in UI" flow has been successfully tested locally using the `test_plan_and_deployment.md` guide (needs update for new names).
- **Next Steps:** Update documentation (`docs/`, `memory_docs/`), test plan, potentially publish packages under new names.

## MVP Goal (Achieved)

Let a developer select a React component in VS Code and instantly highlight where it's rendered in the browser using Traceform.

# Traceform - Example React App

This is a sample React application built with Vite and TypeScript, designed to demonstrate and test the functionality of the Traceform toolchain.

## Purpose

- Provides a target application where the `@traceform/babel-plugin` can inject `data-traceform-id` attributes.
- Includes various reusable components (Button, Card, Avatar, etc.) and pages (Home, Profile) to test highlighting different elements.
- Serves as the UI endpoint for the Traceform: UI Mapping Browser Extension to display highlights triggered from the Traceform VS Code Extension via the integrated Bridge Server.

## Setup & Running

1.  **Install Dependencies:**
    ```bash
    cd traceform/example-react-app
    # Install the Babel plugin (if not using relative path/workspaces)
    # npm install --save-dev @traceform/babel-plugin
    # Install other dependencies
    npm install
    ```
2.  **Configure Babel Plugin:** Ensure your `vite.config.ts` (or relevant Babel config) includes `@traceform/babel-plugin` (or the relative path `../babel-plugin/dist/index.js`) in the development environment plugins, as shown in the [Babel Plugin README](../babel-plugin/README.md).
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically on `http://localhost:5173`. The `@traceform/babel-plugin` should now be active.

## Testing the Toolchain

1.  Ensure the Traceform VS Code Extension (`LucidLayer.traceform-vscode`) is installed and enabled in VS Code.
2.  Ensure the Traceform: UI Mapping Browser Extension is built and loaded unpacked in your browser (see [Browser Extension README](../browser-extension/README.md)).
3.  Run this `example-react-app` using `npm run dev`.
4.  Open the app in your browser (e.g., `http://localhost:5173`).
6.  In VS Code, open a component file from this project (e.g., `src/components/Button.tsx`).
7.  Select the component name (e.g., `Button`).
8.  Right-click and choose "Traceform: Find Component in UI".
9.  Observe the browser window - all instances of the Button component should be highlighted by the browser extension's overlay.

## Project Structure

- `src/components/`: Reusable UI components.
- `src/pages/`: Page-level components (HomePage, ProfilePage).
- `src/App.tsx`: Main application layout and routing setup.
- `src/main.tsx`: Application entry point, renders the React app.
- `vite.config.ts`: Vite configuration, including Babel plugin integration for development.
- `index.html`: Main HTML entry point.

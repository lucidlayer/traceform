# Code-to-UI Mapper - Example React App

This is a sample React application built with Vite and TypeScript, designed to demonstrate and test the functionality of the Code-to-UI Mapper toolchain.

## Purpose

- Provides a target application where the `babel-plugin-inject-id` can inject `data-component` attributes.
- Includes various reusable components (Button, Card, Avatar, etc.) and pages (Home, Profile) to test highlighting different elements.
- Serves as the UI endpoint for the Browser Extension to display highlights triggered from the VS Code Extension via the Local Bridge Server.

## Setup & Running

1.  **Install Dependencies:**
    ```bash
    cd code-to-ui-mapper/example-react-app
    # Install the published Babel plugin
    npm install --save-dev @lucidlayer/babel-plugin-traceform@0.1.1
    # Install other dependencies
    npm install
    ```
2.  **Configure Babel Plugin:** Ensure your `vite.config.ts` (or relevant Babel config) includes `@lucidlayer/babel-plugin-traceform` in the development environment plugins, as shown in the [Babel Plugin README](../babel-plugin-inject-id/README.md).
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically on `http://localhost:5173`. The `@lucidlayer/babel-plugin-traceform` should now be active.

## Testing the Toolchain

1.  Ensure the VS Code Extension (`LucidLayer.code-to-ui-mapper-vscode-extension`) is installed and enabled in VS Code.
2.  Ensure the Browser Extension is built and loaded unpacked in your browser (see [Browser Extension README](../browser-extension/README.md)).
3.  Run this `example-react-app` using `npm run dev`.
4.  Open the app in your browser (e.g., `http://localhost:5173`).
6.  In VS Code, open a component file from this project (e.g., `src/components/Button.tsx`).
7.  Select the component name (e.g., `Button`).
8.  Right-click and choose "Code-to-UI: Find Component in UI".
9.  Observe the browser window - all instances of the Button component should be highlighted by the browser extension's overlay.

## Project Structure

- `src/components/`: Reusable UI components.
- `src/pages/`: Page-level components (HomePage, ProfilePage).
- `src/App.tsx`: Main application layout and routing setup.
- `src/main.tsx`: Application entry point, renders the React app.
- `vite.config.ts`: Vite configuration, including Babel plugin integration for development.
- `index.html`: Main HTML entry point.

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
    npm install
    ```
2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically on `http://localhost:5173`. The `babel-plugin-inject-id` (configured in `vite.config.ts`) should be active in this mode, injecting `data-component` attributes into the rendered HTML.

## Testing the Toolchain

1.  Ensure the `local-bridge-server` is running (`npm start` in its directory).
2.  Ensure the `browser-extension` is built and loaded unpacked in your browser.
3.  Ensure the `vscode-extension` is running (e.g., by pressing `F5` in its directory).
4.  Run this `example-react-app` using `npm run dev`.
5.  Open the app in your browser (e.g., `http://localhost:5173`).
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

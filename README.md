# Traceform: Code-to-UI Mapping Toolset Setup Guide

This guide provides step-by-step instructions on how to set up and use the Traceform toolset to map code components directly to their UI representations in a web application.

## Required Tools

Traceform consists of three main components that work together:

1.  **Babel Plugin (`@lucidlayer/babel-plugin-traceform`):** Injects necessary metadata into your code during the build process.
2.  **VS Code Extension (`traceform-vscode`):** Detects highlighted code elements in your editor and communicates with the browser extension.
3.  **Browser Extension:** Receives information from the VS Code extension and highlights the corresponding UI elements in your running application.

## Setup Instructions

Follow these steps to integrate Traceform into the example project.

### Step 1: Set Up the Example Project

This example uses a React + TypeScript project built with Vite.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/lucidlayer/example-react-project example-project-test
    ```

2.  **Navigate into the project directory:**
    ```bash
    cd example-project-test
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    You should see the application running at `http://localhost:5173/` (or a similar address).

5.  **Stop the development server:** Press `Ctrl + C` in the terminal where the server is running.

### Step 2: Install and Configure the Babel Plugin

1.  **Install the Babel plugin as a dev dependency:**
    ```bash
    npm install --save-dev @lucidlayer/babel-plugin-traceform
    ```

2.  **Configure Vite to use the plugin:**
    Open the `vite.config.ts` file in the `example-project-test` directory. Modify the `react` plugin options to include the Traceform Babel plugin.

    
    *   **If using the installed npm package:**
        Change the `babel` configuration to reference the package name:
        ```typescript
        import { defineConfig } from 'vite'
        import react from '@vitejs/plugin-react'

        // https://vite.dev/config/
        export default defineConfig({
          plugins: [
            react({
              // Add the Traceform Babel plugin from node_modules
              babel: {
                plugins: ['@lucidlayer/babel-plugin-traceform'],
              },
            }),
          ],
          build: {
            sourcemap: true, // Enable source maps for build
          },
        })
        ```

### Step 3: Install the VS Code Extension

1.  Go to the Visual Studio Code Marketplace: [Traceform VS Code Extension](https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode)
2.  Click **Install**.
3.  Reload VS Code if prompted, or restart the extension host (You can usually do this via the Command Palette: `Developer: Restart Extension Host`).
4.  The Traceform bridge server should start automatically.

### Step 4: Install the Browser Extension

1.  **Download the extension:** Obtain the latest browser extension `.zip` file. (As per the user's instructions, this might be found on a GitHub releases page - provide the specific link here if available). For now, you can use the locally built version located in `traceform/browser-extension/dist/`.
2.  **Unzip the file:** Extract the contents of the downloaded `.zip` file into a dedicated folder (e.g., `traceform-browser-ext`). If using the local build, the `traceform/browser-extension/dist/` folder is already unzipped.
3.  **Open Chrome Extensions:**
    *   Navigate to `chrome://extensions` in your Chrome browser.
    *   Alternatively, click the three-dot menu > Extensions > Manage Extensions.
4.  **Enable Developer Mode:** Toggle the "Developer mode" switch in the top-right corner.
5.  **Load Unpacked Extension:**
    *   Click the "Load unpacked" button that appears.
    *   Navigate to and select the folder where you unzipped the extension files (e.g., `traceform-browser-ext` or the `traceform/browser-extension/dist` folder).
6.  The Traceform browser extension should now be installed and active.

## Usage Demonstration

1.  **Start the development server** for the example project if it's not already running:
    ```bash
    cd example-project-test
    npm run dev
    ```
2.  **Open the application** in your Chrome browser (usually `http://localhost:5173/`).
3.  **Open VS Code** to the `example-project-test` directory.
4.  **Navigate to a component file:** For example, open `src/components/Product/ProductCard.tsx`.
5.  **Highlight the component name:** Select the text `ProductCard` in the line:
    ```typescript
    const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    ```
6.  **Observe the browser:** The corresponding Product Card UI elements in the running application should now be highlighted, demonstrating the code-to-UI mapping.
7.  **Try another component:** Navigate to `src/components/Layout/Footer.tsx` and highlight `Footer` in the line:
    ```typescript
    const Footer: React.FC = () => {
    ```
    The footer section in the browser should now be highlighted.

You have now successfully set up and verified the Traceform toolset!

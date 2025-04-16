# Traceform: Bridging the Gap Between Code and UI


I'm excited to share Traceform with you, a developer toolchain we've built to solve a persistent challenge in React development. With Traceform, you can select any React component in VS Code and instantly see all its rendered instances highlighted in your browser. It's the kind of tool I wish I'd had years ago.

---

## Getting Started with Traceform

Setting up Traceform in your project is straightforward. We've put significant effort into making the integration process as frictionless as possible:

1.  **Install the VS Code Extension**
    * Get the "Traceform" extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode).

2.  **Add the Babel Plugin**
    * Install it as a dev dependency:
      ```bash
      npm install --save-dev @lucidlayer/babel-plugin-traceform
      # or
      yarn add --dev @lucidlayer/babel-plugin-traceform
      ```
    * Configure your build tool to use the plugin (development mode only):

      **For Babel config files (including Next.js):**
      ```javascript
      // Example babel.config.js
      module.exports = {
        presets: [/* your presets */],
        plugins: [
          // Add Traceform plugin only in development
          process.env.NODE_ENV === 'development' && '@lucidlayer/babel-plugin-traceform',
        ].filter(Boolean),
      };

      // For Next.js (.babelrc)
      // {
      //   "presets": ["next/babel"],
      //   "plugins": [
      //     process.env.NODE_ENV === 'development' && "@lucidlayer/babel-plugin-traceform"
      //   ].filter(Boolean)
      // }
      ```

      **For Vite projects:**
      ```typescript
      // Example vite.config.ts
      import { defineConfig } from 'vite'
      import react from '@vitejs/plugin-react'

      export default defineConfig({
        plugins: [
          react({
            babel: process.env.NODE_ENV === 'development' 
              ? { plugins: ['@lucidlayer/babel-plugin-traceform'] } 
              : {},
          }),
        ],
      })
      ```

      **For Create React App (using craco):**
      ```javascript
      // craco.config.js
      module.exports = {
        babel: {
          plugins: [
            process.env.NODE_ENV === 'development' && '@lucidlayer/babel-plugin-traceform',
          ].filter(Boolean),
        },
      };
      ```

3.  **Install the Browser Extension**
    * Download `traceform-browser-extension.zip` from the [GitHub Releases page](https://github.com/lucidlayer/traceform/releases)
    * Unzip the file
    * Load as an unpacked extension in Chrome/Edge:
      * Go to `chrome://extensions` or `edge://extensions`
      * Enable "Developer mode"
      * Click "Load unpacked" and select the unzipped folder

4.  **Using Traceform**
    * Run your React app's dev server
    * Open your project in VS Code
    * Open your app in the browser with the Traceform extension installed
    * In VS Code, right-click on a React component name or definition
    * Select "Traceform: Find Component in UI"
    * Watch as the component instances light up in your browser

I've found that this setup process pays dividends almost immediately. Once configured, the time you save during development compounds with every debugging session.

---

## Try the Demo Apps

We've included two demo applications that demonstrate Traceform in action:

### Simple Test App

A minimal setup to get you familiar with the basics:

```bash
cd traceform-test-app--
npm install
npm run dev
```

Try highlighting components like `Button`, `Card`, `Footer`, or `Header` in their respective files in the `src/components/` directory.

### Complex Demo

A more representative example of real-world usage:

```bash
cd complex
npm install
npm run dev
```

Highlight components like `AlertBanner`, `Navbar`, or `Layout` to see Traceform in action within a more complex codebase.

Both demos are pre-configured with the Babel plugin, so you can focus on experiencing the core functionality without additional setup.

---

## Documentation & Resources

For those who want to dig deeper:

- [Developer and contributor docs](./traceform/docs/README.md)
- [Test plan and deployment](./traceform/docs/test_plan_and_deployment.md)
- [Privacy policy](./traceform/docs/PRIVACY_POLICY.md)

## Developer Blog

We're documenting our journey building Traceform, including technical decisions and lessons learned:

- [**Blog Index**](./blog/README.md)

## Final Thoughts

Creating tools like Traceform reminds me why I'm passionate about developer experience. The right tools don't just save time, they fundamentally change how we approach problems. When the gap between writing code and seeing its impact narrows, creativity flourishes.

I hope Traceform helps you build better React applications with less friction. We're continuing to evolve this toolset based on real-world feedback, so please share your experiences with us.

**Learn more at [traceform.framer.website](https://traceform.framer.website/)** or explore the subproject READMEs for technical details.

<h1 align="center">Traceform: Real-Time React Component Highlighting & Debugging</h1>
<p align="center">Traceform is a React developer toolchain that instantly highlights any React component from your VS Code editor directly in your browser, streamlining debugging and component visualization.</p>

<p align="center"><code>npx @lucidlayer/traceform-onboard check</code></p>

![Traceform demonstrating real-time React component highlighting from VS Code selection to browser visualization](./.github/demo.gif)

---

<details>
<summary><strong>Table&nbsp;of&nbsp;Contents</strong></summary>

- [Why Traceform? The Challenge of Visualizing React Components](#why-traceform-the-challenge-of-visualizing-react-components)
- [Core Functionality: Linking VS Code to Browser Highlights](#core-functionality-linking-vs-code-to-browser-highlights)
- [Quick Setup Guide with Traceform Onboard CLI](#quick-setup-guide-with-traceform-onboard-cli)
- [See Traceform in Action: Demo Applications](#see-traceform-in-action-demo-applications)
- [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
- [Roadmap & Future Enhancements](#roadmap--future-enhancements)

</details>

---

## Why Traceform? The Challenge of Visualizing React Components

Have you ever stared at a complex React application wondering which specific component renders a particular part of the UI? Tired of searching your codebase to find where a UI element is rendered? Traceform eliminates this frustration by creating a direct visual connection between your code and the running application in your browser.

It's ideal for React developers working on large codebases, onboarding new team members, or needing to rapidly debug complex UI interactions. Boost your developer productivity by instantly seeing the code-to-UI link.

## Core Functionality: Linking VS Code to Browser Highlights

Select any React component in VS Code → See it highlighted in your browser instantly.

Traceform achieves this seamless connection using three key parts working together:

| Component           | Description                                      | Installation Method        |
|---------------------|--------------------------------------------------|----------------------------|
| Babel Plugin        | Injects traceable IDs into React components during build. | Handled by `traceform-onboard` CLI |
| VS Code Extension   | Allows selecting components directly in your editor. | Install from Marketplace / CLI |
| Browser Extension | Listens for selections and highlights components in the browser. | Install for Chrome/Edge / CLI |

This developer toolchain provides a powerful component visualization and debugging tool right within your existing workflow.

## Quick Setup Guide with Traceform Onboard CLI

We've created a simple Command Line Interface (CLI) onboarding tool that handles the entire setup process for you, configuring the Babel plugin and installing the necessary extensions.

1.  Ensure you have Node.js installed. In your React project directory, open a terminal and run:
    ```bash
    # Install Node types if you haven't already (recommended)
    npm install --save-dev @types/node 
    # Run the onboarding check
    npx @lucidlayer/traceform-onboard check
    ```

2.  The CLI will guide you through installing and configuring all three required components:
    *   VS Code extension (from the Marketplace)
    *   Babel plugin configuration (modifies your `babel.config.js` or similar)
    *   Browser extension (links to Chrome Web Store / Edge Add-ons)

## See Traceform in Action: Demo Applications

Want to try Traceform immediately without setting it up in your own project? We've prepared ready-to-use demo applications:

1.  Clone the demo repository:
    ```bash
    git clone https://github.com/lucidlayer/demo.git
    cd demo/demo-01 # Or choose another demo (01-04)
    npm install
    ```

2.  Run the onboarding tool within the chosen demo app directory:
    ```bash
    # Install Node types if needed for the demo
    npm install --save-dev @types/node
    # Run the onboarding check
    npx @lucidlayer/traceform-onboard check
    # Start the demo application
    npm run dev
    ```
    Now you can open the demo app in your browser and test Traceform's highlighting features.

## Frequently Asked Questions (FAQ)

**Q: How does Traceform improve React debugging?**
A: Traceform saves significant time by instantly showing you which component in your code corresponds to an element you see in the browser, eliminating the need to manually search or add temporary logs/styles.

**Q: What versions of React does Traceform support?**
A: Traceform is designed to work with modern React versions (16.8+ recommended, leveraging Hooks internally). Compatibility relies primarily on the Babel transformation process. *(Note: Verify specific version constraints if known)*

**Q: Is Traceform meant for production use?**
A: No, Traceform is strictly a **development tool**. The Babel plugin adds data attributes that should not be included in production builds for performance and security reasons. Ensure the plugin runs only in your development environment configuration.

**Q: Which browsers are currently supported?**
A: The Traceform browser extension is currently available for Google Chrome and Microsoft Edge.

**Q: How does the `traceform-onboard` CLI simplify setup?**
A: The CLI automates checking prerequisites, installing the VS Code and browser extensions, and correctly configuring the Babel plugin in your project's configuration file, reducing manual setup errors.

## Roadmap & Future Enhancements

We're continuously working to improve Traceform. Here's what's planned:

-   **Browser-to-code navigation:** Select an element in the browser devtools to highlight the corresponding component in VS Code.
-   **Expanded browser support:** Adding support for Firefox and other popular browsers.
-   **Framework extensions:** Creating similar tools for Vue and Svelte developers.
-   **Simplified architecture:** Exploring ways to reduce the number of components needed for setup.

---

Check out our [blog](./blog/README.md) for technical deep dives and announcements!

— The Traceform Team

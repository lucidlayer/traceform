<h1 align="center">Traceform: Real-Time React Component Visualization for VS Code</h1>
<p align="center">Traceform is a React developer toolchain that instantly highlights any React component from your VS Code editor directly in your browser, streamlining debugging and component visualization.</p>

<p align="center"><code>npx @lucidlayer/traceform-onboard check</code></p>

![Traceform demonstrating real-time React component highlighting from VS Code selection to browser visualization](./.github/demo.gif)

---

<details>
<summary><strong>Table&nbsp;of&nbsp;Contents</strong></summary>

- [Why Traceform? Instant Code-to-UI Mapping for React Development](#why-traceform-instant-code-to-ui-mapping-for-react-development)
- [Core Functionality: Visual Debugging Workflow Integration](#core-functionality-visual-debugging-workflow-integration)
- [Quick Setup Guide with Traceform Onboard CLI](#quick-setup-guide-with-traceform-onboard-cli)
- [See Traceform in Action: Demo Applications](#see-traceform-in-action-demo-applications)
- [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
- [System Requirements](#system-requirements)
- [Roadmap & Future Enhancements](#roadmap--future-enhancements)
- [Contributing](#contributing)
- [License](#license)

</details>

---

## Why Traceform? Instant Code-to-UI Mapping for React Development

React development often involves a persistent disconnect: you write code in one place (your editor) and see results somewhere else (your browser). This cognitive gap costs developers significant time and focus, especially when trying to map complex UI elements back to their source code. Have you ever stared at a UI wondering which component renders it?

Traceform eliminates this friction. By creating a direct visual connection between your code and the UI, Traceform increases React development velocity by eliminating guesswork. It provides real-time visual component tracking directly within your existing VS Code and Chrome/Edge workflow. Developers debugging complex UIs benefit from instant visual feedback when selecting components in their codebase, reducing context-switching and boosting productivity. 

It's ideal for large codebases or onboarding new team members.

## Core Functionality: Visual Debugging Workflow Integration

Select any React component in VS Code → See it highlighted in your browser instantly.

Traceform achieves this seamless connection using three key parts working together:

| Component           | Description                                      | Installation Method        |
|---------------------|--------------------------------------------------|----------------------------|
| Babel Plugin        | Injects traceable IDs into React components during build. | Handled by `traceform-onboard` CLI |
| VS Code Extension   | Allows selecting components directly in your editor. | Install from Marketplace / CLI |
| Browser Extension | Listens for selections and highlights components in the browser. | Install for Chrome/Edge / CLI |

These pieces communicate to create a seamless bridge between your code editor and the browser interface. This developer toolchain provides a powerful component visualization and debugging tool right within your existing workflow.

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
    *   Babel plugin configuration (modify your `babel.config.js` or `vite.config.ts` or similar)
    *   Browser extension (links to Chrome Web Store / Edge Add-ons)

## See Traceform in Action: Demo Applications

Want to try Traceform immediately without setting it up in your own project? We've prepared ready to use demo applications:

1.  Clone the demo repository:
    ```bash
    git clone https://github.com/lucidlayer/demo.git
    cd demo/demo-01 # Or choose another demo (01-04)
    npm install
    ```

2.  Run the onboarding tool within the chosen demo app directory:
    ```bash
    # Install Node types 
    npm install --save-dev @types/node
    # Run the onboarding check
    npx @lucidlayer/traceform-onboard check
    # Start the demo application
    npm run dev
    ```
    Now you can open the demo app in your browser and test Traceform's highlighting features.

## Frequently Asked Questions (FAQ)

**Q: Will this slow down my application?**
A: No. Traceform is a development-only tool. The Babel plugin adds minimal overhead during development builds and should **never** be included in production builds.

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

**Q: Does Traceform work with dynamically generated components or conditional rendering?**
A: Yes, Traceform works with components regardless of how they are rendered. As long as the component exists in the React tree when you select it in VS Code, and the Babel plugin has processed its source code to add the necessary ID, the browser extension should be able to highlight the corresponding DOM element(s).

## System Requirements

| Requirement       | Details                                     |
|-------------------|---------------------------------------------|
| Node.js           | v16 or newer recommended                    |
| Supported OS      | macOS, Windows, Linux (where VS Code runs)  |
| Supported Browsers| Google Chrome, Microsoft Edge               |
| VS Code           | Latest version recommended                  |

## Roadmap & Future Enhancements

We're continuously working to improve Traceform. Here's what's planned:

-   **Browser-to-code navigation:** Select an element in the browser devtools to highlight the corresponding component in VS Code.
-   **Expanded browser support:** Adding support for Firefox and other popular browsers.
-   **Framework extensions:** Creating similar tools for Vue and Svelte developers.
-   **Simplified architecture:** Exploring ways to reduce the number of components needed for setup.

---

## Contributing

This is just the beginning, and we welcome contributions! If you encounter a bug or have a feature request, please open an issue on our [GitHub Issues](https://github.com/lucidlayer/traceform/issues) or [Discord Bug-Reports](https://discord.gg/dsrFUNGjCB). We appreciate your help in making Traceform better.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Check out our [blog](./blog/README.md) for technical deep dives and announcements!

— The Traceform Team

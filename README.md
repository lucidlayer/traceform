# Traceform: Bridging the Gap Between Code and UI

We've been thinking deeply about developer experience, and today we're excited to share Traceform, a toolchain we built to solve a persistent challenge in React development. With Traceform, you can select any React component in VS Code and instantly see all its rendered instances highlighted in your browser.

## What Traceform Solves

Frontend development complexity continues to grow. When you're navigating a large React codebase, connecting what you're seeing in the browser with the component you're editing becomes a friction point. This is the kind of problem that doesn't sound important until you've wasted hours of your development time on it.

The best developer tools don't just solve problems, they make entire categories of problems disappear.

## Beta Launch

Today (April 15, 2025) marks our beta release of Traceform. We believe in shipping early to gather valuable feedback from developers in real world scenarios. By getting the tool into your hands now, we can:

- Identify pain points in the setup process
- Understand which features provide the most value
- Discover edge cases in different React project configurations
- Build a community of early adopters

Your feedback during this beta period will directly shape what Traceform becomes.

## Technical Implementation

Traceform creates a direct link between your code editor and browser through an elegant architecture:

1. We instrument your React components during build with unique IDs (using a Babel plugin)
2. Our VS Code extension lets you select a component and find all its instances
3. A WebSocket connection relays this information to a browser extension
4. The browser extension highlights the corresponding elements in your running localhost

We've structured Traceform as a monorepo with three core components:

- A Babel npm plugin (`@lucidlayer/babel-plugin-traceform`) that injects traceable IDs
- A VS Code extension **[Traceform for VS Code]** that provides the UI interaction and hosts the bridge server
- A browser extension in the github releases, for Chrome/Edge that handles the visual highlighting


## Getting Started

Setting up Traceform in your project is straightforward:

1. Install the VS Code extension from the marketplace
2. Add our Babel plugin to your build (dev mode only)
3. Install the browser extension

For detailed setup instructions and configuration examples, check our [Detailed Setup Instructiosn](./traceform/README.md).

## What's Next

Our immediate roadmap includes:

- Implementing browser-to-code navigation (the reverse direction)
- Adding support for Firefox and other browsers
- Extending to other frameworks like Vue and Svelte
- Further enhancements based on real-world usage

For V2, we're focused on reducing setup friction, ideally getting from three separate tools to just two or one.

## Learn More

We're documenting our journey building Traceform in our [Developer Blog Index](./blog/README.md), including technical decisions and lessons learned. 

Our latest post, ["Traceform: A Technical Deep Dive"](./blog/2025-04-15-traceform-technical-deep-dive.md), explores the architecture and key decisions that shaped the project.

## Try the Demo Apps

We've included two demo applications that demonstrate Traceform in action:

- **Simple Test App**: A minimal setup to get familiar with the basics
- **Complex Demo**: A more representative example of real world usage

Both demos are pre-configured with the Babel plugin, so you can focus on experiencing the core functionality without additional setup.

## Final Thoughts

The tools we build shape how we think about problems. When the gap between writing code and seeing its impact narrows, creativity flourishes. We hope Traceform helps you build better React applications with less friction.

Remember: the tools we build shape what we can build. Let's make them great.

— The Traceform Team
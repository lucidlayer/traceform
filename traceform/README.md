# Traceform

Bridge your React code to the live UI, instantly find where your components render in the browser.

## What is Traceform?

I've always been frustrated by how disconnected our code is from what users actually see. That's why we built Traceform, a developer toolchain that lets you select any React component in VS Code and instantly see where it renders in your browser. 

The magic happens through three integrated tools: a Babel plugin that instruments your components, a VS Code extension that handles the UI interaction, and a browser extension that highlights the rendered elements. It's a simple idea that solves a daily pain point for React developers.

## Monorepo Structure

We've structured Traceform as a monorepo to keep everything organized and interconnected:

- `babel-plugin-traceform/` – Babel plugin that injects `data-traceform-id` attributes
- `browser-extension/` – Browser extension for DOM highlighting
- `vscode-extension/` – VS Code extension for "Find in UI" (with integrated bridge server)
- `../traceform-test-app/` – Example React app for testing Traceform
- `docs/` – Developer and contributor documentation
- `blog/` - Developer blog articles

This structure allows us to maintain a single source of truth while keeping the components modular. Each piece serves a specific purpose but works in concert with the others.

## Developer Blog

We're documenting our journey building Traceform, including technical decisions and lessons learned:

- [**Blog Index**](./blog/README.md)

I've always believed that sharing knowledge accelerates progress. Our developer blog explores the challenges we've encountered and solutions we've discovered along the way.

## Quick Start

Getting started with Traceform takes just a few steps:

1. Install the [Traceform VS Code Extension](./vscode-extension/README.md).
2. Add the [@lucidlayer/babel-plugin-traceform](./babel-plugin-traceform/README.md) to your React app's development build.
3. Build and load the [Traceform Browser Extension](./browser-extension/README.md) in Chrome/Edge.
4. Run the example app in [`../traceform-test-app/`](../traceform-test-app/README.md) for local testing.
5. Open your React app, select a component in VS Code, right-click, and choose "Traceform: Find Component in UI".

For detailed setup and troubleshooting, see the README in each subproject.

The investment in setting up Traceform pays off immediately in development speed and reduced frustration. I've found that tools like this fundamentally change how I approach debugging and component verification.

## Example App

The [`../traceform-test-app/`](../traceform-test-app/README.md) directory contains a minimal React + TypeScript + Vite project preconfigured for Traceform testing.

I'm a big believer in learning by doing. This example app gives you a sandbox to experience Traceform without having to configure it in your own project first. It's the fastest way to see the value proposition in action.

---

Great developer tools don't just solve problems, they make entire categories of problems disappear. My hope is that Traceform simplifies your React development workflow and sparks ideas for other tools that might bridge similar gaps in our development experience.

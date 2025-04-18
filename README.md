# Traceform: See Your React Components in Real-Time

**Traceform instantly highlights any React component from your code editor directly in your browser.** No more guessing which code creates which UI element.

## The Problem We Solve

Have you ever stared at a complex React application wondering which component renders what? Traceform eliminates this frustration by creating a direct visual connection between your code and UI.

## How It Works

Select any component in VS Code → See it highlighted in your browser instantly.

Traceform consists of three parts working together:
- A Babel plugin that adds traceable IDs to your components
- A VS Code extension for selecting components
- A browser extension that highlights components in your running app (Currently chrome or edge)

## Getting Started

We've created a simple CLI onboarding tool that handles the entire setup process for you:

1. In your project directory, open a terminal and run:
   ```
   npm install --save-dev @types/node
   npx @lucidlayer/traceform-onboard check
   ```

2. The CLI will guide you through installing all three required components:
   - VS Code extension
   - Babel plugin configuration
   - rowser extension

## Try with Demo Apps

Want to see Traceform in action immediately? We've created ready-to-use demo applications:

1. Clone the demo repository:
   ```
   git clone https://github.com/lucidlayer/demo.git
   cd demo-01
   npm install
   ```

2. Run the onboarding tool in any of the four demo apps:
   ```
   npm install --save-dev @types/node
   npx @lucidlayer/traceform-onboard check
   npm run dev
   ```

## What's Next

- Browser-to-code navigation (the reverse direction)
- Support for Firefox and other browsers
- Extensions for Vue and Svelte
- Simplified setup with fewer components

— The Traceform Team

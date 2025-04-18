#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import App from './app.js'; // Import the main Ink application component

// TODO: Add command-line argument parsing if needed (e.g., for verbose mode)
// using something like `meow` or `yargs` as `commander` might conflict with Ink's focus management.
// For now, we just render the app directly.

// Render the Ink application with additional options to prevent unexpected exit
render(React.createElement(App), { exitOnCtrlC: false });

// Keep the process alive until Ink exits
// (Ink handles exit automatically on unmount or Ctrl+C)

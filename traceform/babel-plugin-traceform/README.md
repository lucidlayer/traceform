# Traceform Babel Plugin: The Magic Behind Instant Code-to-UI Mapping

> Traceform's instant, live mapping is powered by this Babel plugin. It injects unique IDs into your React components, making it possible to see every instance, live, in your UI.

---

## Why This Plugin?
- Enables Traceform's "just click and see" experience.
- Works with all modern React setups (Vite, Next.js, Create React App, etc.).
- Development-only, zero production overhead.

## How It Works
1. Hooks into Babel's compilation process.
2. Finds React components and injects a unique `data-traceform-id` into the root JSX element.
3. IDs are used by the Traceform toolchain to instantly map code to UI.

---

## Quickstart
1. Install the plugin:
   ```bash
   npm install --save-dev @lucidlayer/babel-plugin-traceform
   ```
2. Add it to your Babel or Vite config (development only).
3. Use the Traceform VS Code and browser extensions for instant code-to-UI mapping.

---

## License
This plugin is licensed under the MIT License. See the LICENSE file for details.

---

*This plugin is part of the Traceform developer toolset. For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform)*
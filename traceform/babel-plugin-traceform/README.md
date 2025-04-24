# Traceform Babel Plugin: For Teams Onboarding & Debugging React Codebases

> The Traceform Babel plugin is designed for onboarding, debugging, and navigating unfamiliar or legacy React codebases—where existing tools break down. It is not for every developer, every day, but for teams and leads who need to accelerate onboarding and reduce debugging friction in real, production-scale projects.
>
> **All claims are based on real, production-scale pilots.** If time savings is <50%, Traceform is positioned as 'best-in-class for onboarding and legacy debugging.'

---

## Why This Plugin?
- **For team leads and managers:** Enable your team to instantly map code to UI, reducing onboarding and debugging time.
- Powers Traceform's instant, live code-to-UI mapping experience.
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

## Note on Claims & Updates
- All claims are based on real, production-scale pilots and team feedback.
- If time savings is <50%, fallback messaging is: 'Best-in-class for onboarding and legacy debugging.'
- This README is reviewed and updated quarterly based on pilot data and buyer feedback.

## License
This plugin is licensed under the MIT License. See the LICENSE file for details.

---

*This plugin is part of the Traceform developer toolset. For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform)*
# Traceform: Instant Code-to-UI Mapping for React Teams

![Traceform demo: Instantly highlight every instance of a component from VS Code to browser](../.github/demo.gif)

> **Traceform** bridges your code editor and your running React app, instantly highlighting every rendered instance of a component—right in your browser. Purpose-built for onboarding, debugging, and navigating unfamiliar or legacy React codebases, Traceform is designed for teams and leads who need to accelerate onboarding and reduce debugging friction.


---

## Why Traceform?
- **Accelerate Onboarding:** Instantly visualize where code renders in the UI—no more DOM spelunking or guesswork.
- **Debug Faster:** Click a component in VS Code and see every instance light up in your app.
- **Legacy Code Navigation:** Map code to UI in large, complex, or unfamiliar React projects with zero manual DOM inspection.
- **Team Enablement:** Perfect for new hires, contractors, or anyone dropped into a big project.
- **Seamless Workflow:** Complements your IDE and DevTools—no context switching required.

---

## How Traceform Works
1. **Select code in VS Code.**
2. **Right-click and choose "Traceform: Find in UI."**
3. **See every instance, live, in your browser.**

---

## Quickstart

![Traceform CLI onboarding walkthrough](../.github/onboarding.gif)

*Get set up in minutes with the Traceform CLI—the fastest way to go from zero to "aha!"*

1. Install Node.js if you haven't already.
2. In your React project directory, run:
   ```bash
   npx @lucidlayer/traceform-onboard check
   ```
3. Follow the CLI wizard to install the VS Code extension, Babel plugin, and browser extension.
4. Start your dev server, open your app in the browser, and try Traceform!

---

## Status & Claims
- **Beta:** Traceform is currently in closed Beta. All claims are based on real, production-scale pilots and team feedback.
- **Validation:** If validated time savings is <50%, fallback messaging is: 'Best-in-class for onboarding and legacy debugging.'
- This README is reviewed and updated quarterly based on pilot data and buyer feedback.

## License
See LICENSE-STACK.md for details. Most code is under BUSL-1.1, with per-directory overrides (MIT/Apache-2.0 for some tools).

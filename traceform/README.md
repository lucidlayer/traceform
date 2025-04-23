# Traceform: Instantly See Where Your Code Renders—Live

![Traceform demo: Instantly highlight every instance of a component from VS Code to browser](../.github/demo.gif)

> Ever spent too long hunting through the DOM, trying to figure out where a React component is actually rendered?  
> Your IDE shows you where it's used. DevTools shows you the component tree. But neither shows you every live instance on the screen—right now.
>
> **Traceform bridges that gap.**  
> Click a component in VS Code, and every instance highlights in your running app. No more guessing. No more DOM spelunking. Just click and see.

---

## Why Traceform?
- **See it. Don't hunt for it.**
- Instantly find every rendered instance—even in huge, complex apps.
- Debug faster: see what's really on the screen, not just what could be.
- Perfect for onboarding, debugging, and exploring new codebases.
- **Complement, don't replace:** Traceform works alongside your IDE and DevTools, getting you to the right place faster.

## Real-World Use Cases
- **Dropped into a big project?** Click a component in VS Code, see every instance light up in your browser. No DOM digging. Immediate orientation.
- **Debugging a weird UI bug?** Click the code, see exactly which button is which—no more guessing.
- **Onboarding or teaching?** Show new devs what their code actually renders, live.

---

## Quickstart

![Traceform CLI onboarding walkthrough](../.github/onboarding.gif)

*Get set up in minutes with the Traceform CLI. The fastest way to go from zero to 'aha'—see your code, live, in the UI.*

1. Install Node.js if you haven't already.
2. In your React project directory, run:
   ```bash
   npx @lucidlayer/traceform-onboard check
   ```
3. Follow the CLI wizard to install the VS Code extension, Babel plugin, and browser extension.
4. Start your dev server, open your app in the browser, and try Traceform!

---

## How Traceform Works
1. **Select code in VS Code.**
2. **See every instance, live, in your browser.**
3. **No more mental mapping, no more context switching.**

---

## License
See LICENSE-STACK.md for details. Most code is under BUSL-1.1, with per-directory overrides (MIT/Apache-2.0 for some tools).

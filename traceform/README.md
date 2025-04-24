# Traceform: Instant code-to-UI mapping for React teams

![Traceform demo: Instantly highlight every instance of a component from VS Code to browser](../.github/demo.gif)

> Traceform is purpose-built for **hypothesized** high-friction scenarios like onboarding, debugging, and navigating unfamiliar or legacy React codebases—where existing tools may break down. It is not for every developer, every day, but **designed for** teams and leads who need to accelerate onboarding and reduce debugging friction.
>
> **Our core hypothesis, currently undergoing validation via pilot programs, is that Traceform significantly saves time.** If validated time savings is <50%, Traceform will be positioned as 'best-in-class for onboarding and legacy debugging.'

---

## Why Traceform? (Our Hypothesis)
- **For team leads and managers:** We aim to reduce onboarding time and debugging friction for your team.
- **Goal:** Instantly find every rendered instance—even in huge, complex, or legacy apps.
- **Hypothesis:** Debug faster by seeing what's really on the screen, not just what could be.
- **Intended Use:** Perfect for onboarding, debugging, and exploring new codebases—especially for new hires or contractors.
- **Complement, don't replace:** Traceform is designed to work alongside your IDE and DevTools, getting you to the right place faster.

## Potential Real-World Use Cases
- **Dropped into a big project?** Our goal is for you to click a component in VS Code and see every instance light up in your browser. No DOM digging. Immediate orientation for new team members.
- **Debugging a weird UI bug?** We aim for you to click the code and see exactly which button is which—no more guessing.
- **Onboarding or teaching?** The goal is to show new devs what their code actually renders, live, reducing onboarding time.

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
3. **Designed to eliminate mental mapping and context switching.**

---

## Note on Claims & Updates
- **Claims are currently hypotheses undergoing validation via pilot programs.**
- If validated time savings is <50%, fallback messaging is: 'Best-in-class for onboarding and legacy debugging.'
- This README is reviewed and updated quarterly based on pilot data and buyer feedback.

## License
See LICENSE-STACK.md for details. Most code is under BUSL-1.1, with per-directory overrides (MIT/Apache-2.0 for some tools).

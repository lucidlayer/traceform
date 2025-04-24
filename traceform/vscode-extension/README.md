# Traceform VS Code Extension: For Teams Onboarding & Debugging React Codebases

> The Traceform VS Code extension is designed for **hypothesized** high-friction scenarios like onboarding, debugging, and navigating unfamiliar or legacy React codebases. It is **intended for** teams and leads who need tools to potentially accelerate onboarding and reduce debugging friction.
>
> **Our core hypothesis, currently undergoing validation via pilot programs, is that Traceform significantly saves time.** If validated time savings is <50%, Traceform will be positioned as 'best-in-class for onboarding and legacy debugging.'

---

## Why This Extension? (Intended Benefits)
- **For team leads and managers:** Designed to help your team instantly see where code is rendered, potentially reducing onboarding and debugging time.
- **Goal:** Instantly answer "Where is this actually rendered?"—even in large, complex, or legacy apps.
- **Designed to** work with the Traceform toolchain for a seamless, live experience.

## How It Works
1. Select a component in VS Code.
2. Right-click and choose "Traceform: Find in UI."
3. Instantly see every instance highlighted in your running app.

---

## Quickstart
1. Install the Traceform VS Code Extension from the Marketplace.
2. Install the Babel plugin and browser extension (using the CLI tool is recommended: `npx @lucidlayer/traceform-onboard check`).
3. Open your React project in VS Code.
4. Start your development server and open your app in the browser.
5. Select a component in VS Code and trigger "Traceform: Find in UI" (right-click or Command Palette).
6. The corresponding element should be highlighted in your browser.

---

## Note on Claims & Updates
- **Claims are currently hypotheses undergoing validation via pilot programs.**
- If validated time savings is <50%, fallback messaging is: 'Best-in-class for onboarding and legacy debugging.'
- This README is reviewed and updated quarterly based on pilot data and buyer feedback.

## License
This extension is licensed under the Business Source License 1.1 (BUSL-1.1). See the LICENSE file for details.

---

*This extension is part of the Traceform developer toolset. For more information, visit [github.com/lucidlayer/traceform](https://github.com/lucidlayer/traceform)*
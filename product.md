# Traceform: What We're Building

![Traceform demo: Instantly highlight every instance of a component from VS Code to browser](./.github/demo.gif)

Mapping code to the live UI, especially in complex React projects, is surprisingly inefficient. It slows down onboarding and makes debugging painful. Existing tools don't nail this specific code-to-UI workflow.

Traceform fixes this. It's a focused toolchain requiring three parts:

1.  [**Babel Plugin:**](https://www.npmjs.com/package/@lucidlayer/babel-plugin-traceform) Instruments your code (dev only).
2.  [**VS Code Extension:**](https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode) Lets you select a component.
3.  [**Browser Extension:**](https://chromewebstore.google.com/detail/traceform-ui-mapping/giidcepndnnabhfkopmgcnpnnilkaefa) Instantly highlights *all* live instances in your browser.

Select code -> See it live. Getting the integration seamless is the hard part.

To make setup trivial, we built an onboarding CLI. Run this in your project:

```bash
npx @lucidlayer/traceform-onboard check
```

It walks you through installing *all three* required tools and, critically, helps configure the Babel plugin *correctly for your specific project setup* (Vite, Next.js, CRA, etc.).

Want to try the setup process safely first? Use our demo projects: [github.com/lucidlayer/demo](https://github.com/lucidlayer/demo).

Our hypothesis is this saves teams significant time during onboarding and debugging, the next step is proving it quantitatively in pilot programs.

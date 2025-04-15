# Traceform Test App

This directory contains a React + Vite demo application configured to work with the [Traceform](https://traceform.framer.website/) toolset. This app is used for primary testing and demonstration.

See the [main project README](../../README.md) for instructions on setting up and using Traceform.

## Testing Notes

When running `npm run dev`, the number of "[Traceform Babel Plugin]" logs output corresponds to the number of separate elements instrumented for code-to-UI highlighting.

**Components to test highlighting with:**

*   Go to `traceform-test-app--/src/components/Button.tsx` -> highlight `"Button"`
*   Go to `traceform-test-app--/src/components/Card.tsx` -> highlight `"Card"`
*   Go to `traceform-test-app--/src/components/Footer.tsx` -> highlight `"Footer"`
*   Go to `traceform-test-app--/src/components/Header.tsx` -> highlight `"Header"`

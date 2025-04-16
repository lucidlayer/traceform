# Traceform Vite Test App

This directory contains a basic React + Vite demo application configured to work with the [Traceform](https://traceform.framer.website/) toolset.

See the [main project README](../../README.md) for instructions on setting up and using Traceform.

## Testing Notes

When running `npm run dev`, the number of "[Traceform Babel Plugin]" logs output corresponds to the number of separate elements instrumented for code-to-UI highlighting.

**Components/Elements to test highlighting with:**

*   Go to `my-vite-test/src/App.tsx` -> highlight `"viteLogo"` or `"reactLogo"` (Note: These might be variable names or parts of JSX, ensure you select the relevant code for Traceform).

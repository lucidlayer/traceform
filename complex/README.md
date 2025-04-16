# Traceform Complex Demo App

This directory contains a more complex React + Vite demo application configured to work with the [Traceform](https://traceform.framer.website/) toolset.

See the [main project README](../../README.md) for instructions on setting up and using Traceform.

## Testing Notes

When running `npm run dev`, the number of "[Traceform Babel Plugin]" logs output corresponds to the number of separate elements instrumented for code-to-UI highlighting.

**Components to test highlighting with:**

*   Go to `complex/src/components/AlertBanner.tsx` -> highlight "AlertBanner"
*   Go to `complex/src/components/Navbar.tsx` -> highlight "Navbar"
*   Go to `complex/src/App.tsx` -> highlight "Layout" or "App"

# Tech Context
timestamp: 2025-04-12T17:04:10Z

## Technologies
- **Language:** TypeScript (strict mode, all subprojects)
- **Node.js:** v18.17.0 LTS minimum
- **Frontend:** React (Vite, React Router)
- **Tooling:** npm workspaces, ESLint (Airbnb + Prettier), Prettier, cross-env
- **Browser Extension:** Chrome/Edge (Manifest V3, TypeScript, webextension-polyfill)
- **VS Code Extension:** TypeScript, VS Code API, WebSocket client
- **Bridge Server:** Node.js, ws (WebSocket server)
- **Testing:** Jest or Vitest for unit tests, Playwright/Puppeteer for browser automation (optional)

## Setup
- Clone monorepo and run `npm install` (or `pnpm install` if preferred).
- Use `npm run lint` and `npm run format` to enforce code style.
- Each subproject has its own build/dev scripts.
- Use `cross-env` for environment variables in scripts.
- All scripts use relative paths for cross-platform compatibility.

## Constraints
- MVP targets only Chrome/Edge (Chromium) for browser extension.
- No OS-specific dependencies; must run on Windows, macOS (Intel/M1), and Linux.
- All communication is local (no cloud dependencies).
- No shell-specific commands in npm scripts.

## Dependencies
- `@babel/core`, `@babel/types`, `@babel/plugin-syntax-jsx` (Babel plugin)
- `react`, `react-dom`, `react-router-dom` (example app)
- `ws` (bridge server)
- `@types/*` for all TypeScript type safety
- `eslint`, `prettier`, `eslint-config-airbnb-typescript`, `@typescript-eslint/*`
- `webextension-polyfill`, `@types/chrome` (browser extension)
- `@types/vscode`, `vscode-test` (VS Code extension)

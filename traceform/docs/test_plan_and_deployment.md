# Traceform MVP Manual Test Plan

## Objective
Validate the Traceform system across a diverse set of real-world React projects to ensure all core features work as intended, and to identify bugs, edge cases, and performance issues before finalizing the MVP.

## Test Environments
- [ ] Monorepo (e.g., Yarn/NPM workspaces, Lerna, Nx, Turborepo)
- [ ] Next.js project (SSR/SSG, app/pages directory)
- [ ] Create React App (CRA) project
- [ ] Vite-based React project
- [ ] Large codebase (100+ components, deep nesting)
- [ ] TypeScript and JavaScript mixed codebases

## Core Features to Validate
- [ ] Babel plugin injects data-traceform-id correctly in all JSX components
- [ ] Path normalization produces correct, workspace-relative IDs
- [ ] Shared ID utility (createTraceformId) generates consistent IDs across plugin and other consumers
- [ ] DOM scanner (browser extension) overlays and highlights components as expected
- [ ] Communication between browser extension background, content, and panel scripts is reliable
- [ ] VSCode extension (if applicable) maps IDs and integrates with the rest of the system
- [ ] No duplicate or missing IDs in complex component trees
- [ ] Handles HOCs, memo, forwardRef, and export patterns robustly
- [ ] Works with both .js and .tsx/.jsx files

## Edge Cases & Stress Tests
- [ ] Components with dynamic names or anonymous exports
- [ ] Nested monorepo structures (multiple package roots)
- [ ] Projects with custom Babel/webpack configs
- [ ] Large files and deeply nested components
- [ ] Hot reload and incremental build scenarios

## Performance Checks
- [ ] No significant build slowdowns in large projects
- [ ] Browser extension does not cause UI lag or memory leaks

## Documentation
- [ ] Record all issues, bugs, and edge cases found
- [ ] Note environment, steps to reproduce, and expected vs. actual behavior
- [ ] Prioritize issues for resolution before MVP release

---

**Instructions:**  
- For each environment, clone or set up the project, integrate Traceform, and run through the checklist.
- Document findings in this file or a linked issue tracker.
- Use this as the basis for final MVP readiness assessment.

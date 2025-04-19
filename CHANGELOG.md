# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial structure for CHANGELOG.md.

## [0.1.0] - YYYY-MM-DD 
### Added
- Initial release of Traceform including Babel plugin, VS Code extension, and Browser extension (Chrome/Edge).
- `traceform-onboard` CLI for guided setup.
- Demo applications available in `lucidlayer/demo` repository.

*(Note: Replace YYYY-MM-DD with the actual initial release date if known, otherwise estimate or leave as placeholder)*

## [1.1.0] - 2025-04-19
### Changed
- Major licensing overhaul: Adopted Business Source License 1.1 (BUSL-1.1) for core packages, with per-directory overrides (MIT for Babel plugin, Apache-2.0 for CLI Onboard).
- Added SPDX license headers to all source files.
- Added/updated LICENSE and NOTICE files in all packages.
- Created LICENSE-STACK.md and docs/licensing.md for legal clarity and FAQ.
- Updated all package.json license fields to match new structure.
- Bumped versions for all packages:
  - traceform-workspace: 1.1.0
  - traceform-browser-extension: 0.2.0
  - traceform-vscode-extension: 0.2.0
  - traceform-shared: 0.2.0
  - traceform-cli-onboard: 0.3.0
  - babel-plugin-traceform: 0.2.13
- All BUSL-licensed code will convert to Apache-2.0 on 2028-04-15.
- Improved legal hygiene: CLA, trademark, CI guardrails, and badges.

# LICENSE-STACK.md

## Traceform Monorepo License Structure

This repository uses a layered licensing approach to balance open collaboration with responsible use:

### Root License
- **Business Source License 1.1 (BUSL-1.1)**
  - Licensor: LucidLayer Inc.
  - Licensed Work: traceform
  - Additional Use Grant: Production use for ≤ 3 dev seats is free
  - Change Date: 2028-04-15
  - Change License: Apache License 2.0
  - See [BUSL 1.1 text](https://mariadb.com/bsl11/) for full terms.

### Per-Directory Overrides
- **traceform/babel-plugin-traceform/**: MIT License
- **traceform/cli-onboard/**: Apache License 2.0
- **traceform/browser-extension/**, **traceform/vscode-extension/**, **traceform/shared/**: BUSL-1.1 (inherits from root or explicit)

### Rationale
- **BUSL-1.1** is used for core and most packages to protect commercial value while allowing open access and small-team use.
- **MIT** is used for the Babel plugin to maximize adoption and compatibility.
- **Apache-2.0** is used for CLI onboarding to encourage integration and contributions.

### Change Date
- All BUSL-licensed code will convert to Apache-2.0 on **2028-04-15**.

### Additional Notes
- Each directory contains its own LICENSE file where required.
- All source files include SPDX license headers matching their package's license.
- For questions, see [docs/licensing.md](docs/licensing.md) or contact LucidLayer Inc.

### SPDX Header Automation
- All source files are required to include an SPDX license header matching their package's license.
- Enforcement is automated via a pre-commit hook (Husky) and a GitHub Actions workflow.
- To support new file types, update the shell script at `traceform/scripts/check_spdx.sh`. 
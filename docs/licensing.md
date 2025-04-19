## Automated SPDX Header Enforcement

- All source files must include an SPDX license header at the top, matching the package's license.
- This is enforced automatically:
  - Pre-commit: Husky runs a shell script to block commits missing headers.
  - CI: GitHub Actions runs the same script on every push and pull request.
- To add new file types, update the file pattern list in `traceform/scripts/check_spdx.sh`. 
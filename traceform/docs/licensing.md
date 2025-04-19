# Licensing FAQ & Rationale

## What licenses does Traceform use?

Traceform uses a mix of licenses:
- **BUSL-1.1** (Business Source License 1.1) for most core packages
- **MIT** for the Babel plugin
- **Apache-2.0** for the CLI onboarding tool

See [../LICENSE-STACK.md](../LICENSE-STACK.md) for a directory-by-directory breakdown.

## Why BUSL-1.1?

BUSL-1.1 allows us to share our work openly while protecting against large-scale commercial exploitation. It grants free use for individuals and small teams (≤ 3 dev seats in production), but restricts broader production use until the change date.

## When does the license change?

All BUSL-licensed code will automatically convert to Apache-2.0 on **2028-04-15**.

## What is the "Additional Use Grant"?

Production use for up to 3 developer seats is always free, even under BUSL-1.1. This is specified in every BUSL LICENSE file.

## Where can I read the full BUSL 1.1 text?

- [Official BUSL 1.1 text](https://mariadb.com/bsl11/)

## What about third-party dependencies?

We aggregate and honor all third-party NOTICE requirements. See NOTICE files in each package for details.

## Where can I ask questions?

Contact LucidLayer Inc. at lucidlayerhq@gmail.com or open an issue on GitHub.

---

For more on the rationale behind this licensing approach, see [HashiCorp's FAQ](https://www.hashicorp.com/bsl-faq) and our [LICENSE-STACK.md](../LICENSE-STACK.md). 
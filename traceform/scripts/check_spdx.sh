#!/bin/bash
fail=0
for file in $(git ls-files '*.js' '*.ts' '*.tsx' '*.jsx' '*.sh' '*.py'); do
  if ! grep -q 'SPDX-License-Identifier:' "$file"; then
    echo "Missing SPDX header: $file"
    fail=1
  fi
done
exit $fail 
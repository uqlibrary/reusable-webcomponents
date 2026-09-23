#!/bin/bash
# Merge the jest (unit) and Playwright (e2e) istanbul coverage into one report (include/exclude come
# from the `nyc` block in package.json). Report-only for now: the 100% gate is deferred, so this does
# not fail the build. Runs in the same build step as the tests.
#
#   jest   -> coverage/jest/coverage-final.json           (jest --coverage, json reporter)
#   e2e    -> coverage/playwright/partials/*.json          (one per test, from collectCoverageAsync)
#          -> coverage/playwright/coverage-final.json       (merged here)
#   merged -> coverage/combined/ (both files) -> nyc report
set -e

# 1. Merge the Playwright per-test partials into a single coverage file.
if [ -d coverage/playwright/partials ] && [ -n "$(ls -A coverage/playwright/partials 2>/dev/null)" ]; then
    npx nyc merge coverage/playwright/partials coverage/playwright/coverage-final.json
else
    echo "code-coverage: no Playwright partials found (coverage/playwright/partials). Was e2e run under NODE_ENV=cc?"
fi

# 2. Gather both reports into one directory for nyc to merge at report time.
rm -rf coverage/combined
mkdir -p coverage/combined
if [ -f coverage/jest/coverage-final.json ]; then
    cp coverage/jest/coverage-final.json coverage/combined/jest.json
else
    echo "code-coverage: jest coverage not found (coverage/jest/coverage-final.json)."
fi
if [ -f coverage/playwright/coverage-final.json ]; then
    cp coverage/playwright/coverage-final.json coverage/combined/playwright.json
else
    echo "code-coverage: Playwright coverage not found (coverage/playwright/coverage-final.json)."
fi

# 3. Report the merged coverage (include/exclude come from the `nyc` block in package.json).
#    Report-only for now: the 100% coverage gate is deferred (tracked on the
#    chore-e2e-test-hardening-AD-1314-coverage-wip branch), so this step never fails the build.
#    To re-enable enforcement, restore: npx nyc check-coverage --temp-dir coverage/combined
npx nyc report --temp-dir coverage/combined --reporter text-summary --reporter text --reporter html --report-dir coverage/combined-html

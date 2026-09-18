#!/bin/bash

export CI_NAME=CodeBuild
export COMMIT_INFO_AUTHOR=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%an")
export COMMIT_INFO_EMAIL=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%ae")
export COMMIT_INFO_MESSAGE=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%B")
export CI_BUILD_URL="https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/reusable-webcomponents-${CI_BRANCH}/executions/${CI_BUILD_NUMBER}"

echo
echo "Commit Info:"
git show ${CI_COMMIT_ID} --no-patch
echo
echo

echo "COMMIT_INFO vars:"
set | grep COMMIT_INFO
echo

if [[ -z $CI_BUILD_NUMBER ]]; then
    printf "(CI_BUILD_NUMBER is not defined. Build stopped.)\n"
    exit 1
fi

if [[ -z $CI_BRANCH ]]; then
    CI_BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi
printf "CI_BRANCH = \"$CI_BRANCH\"\n"

export TZ='Australia/Brisbane'

# From here on, any failing command aborts the script with its non-zero exit code so a failed
# test fails the CodeBuild build (and the pipeline). The merged coverage step is report-only for
# now (the 100% gate is deferred; see scripts/code-coverage.sh), so it does not fail the build.
# homepage-react does the same with `set -e`; this suite runs linearly (no sharding), so one
# `set -e` covers the whole run and no per-line `|| exit 1` is needed.
set -e

printf "\n--- \e[1mRUNNING CODE STYLE CHECKS\e[0m ---\n"
STYLE_DIFF=$(npm run codestyles:files -s) || true
if [[ -n "$STYLE_DIFF" ]]; then
    printf "\n\e[91mThese files should pass code style checks but do not:\e[0m\n"
    printf '%s\n' "$STYLE_DIFF"
    printf "\n* Fix with '\e[1mnpm run codestyles:fix:all\e[0m', then re-commit."
    printf "\n* '\e[1mnpm run eslint\e[0m' shows ESLint code-quality issues, if any.\n\n"
    exit 1
fi
printf "\e[92mCode styles OK.\e[0m\n"

printf "\n--- \e[1mTYPECHECK (tsc --noEmit)\e[0m ---\n"
npm run typecheck
printf "\e[92mTypecheck OK.\e[0m\n"

printf "\n--- \e[1mRUNNING UNIT (JEST) TESTS + coverage\e[0m ---\n"
npm run test:unit:cc
printf "\n--- \e[1mENDED RUNNING UNIT (JEST) TESTS\e[0m ---\n"

printf "\n--- \e[1mRUNNING E2E TESTS + coverage (NODE_ENV=cc)\e[0m ---\n"
npm run test:e2e:cc
printf "\n--- \e[1mENDED RUNNING E2E TESTS\e[0m ---\n"

printf "\n--- \e[1mMERGING JEST + E2E COVERAGE (report-only; 100% gate deferred)\e[0m ---\n"
npm run cc:report
printf "\n--- \e[1mENDED COVERAGE REPORT\e[0m ---\n"

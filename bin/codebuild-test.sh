#!/bin/bash

#export CI_BRANCH="$CODEBUILD_SOURCE_VERSION"
#export CI_COMMIT_ID="$CODEBUILD_RESOLVED_SOURCE_VERSION"
#export CI_BUILD_NUMBER="$CODEBUILD_BUILD_ID"
export CI_NAME=CodeBuild
export COMMIT_INFO_AUTHOR=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%an")
export COMMIT_INFO_EMAIL=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%ae")
export COMMIT_INFO_MESSAGE=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%B")
export CI_BUILD_URL="https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/fez-frontend/executions/${CI_BUILD_NUMBER}"

echo
echo "Commit Info:"
git show ${CI_COMMIT_ID} --no-patch
echo
echo

echo "COMMIT_INFO vars:"
set |grep COMMIT_INFO
echo

if [[ -z $CI_BUILD_NUMBER ]]; then
  printf "(CI_BUILD_NUMBER is not defined. Build stopped.)\n"
  exit 1
fi

if [[ -z $CI_BRANCH ]]; then
  CI_BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

# Not running code coverage check for feature branches.
BRANCH_INCLUDES_CC=false
#if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production" || $CI_BRANCH == "codebuild") ]]; then
#    Skipping coverage for initial development/prototyping
#    BRANCH_INCLUDES_CC=true
#  BRANCH_INCLUDES_CC=false
#fi

export TZ='Australia/Brisbane'

# Run e2e tests if in master branch, or if the branch name includes 'cypress'
# Putting * around the test-string gives a test for inclusion of the substring rather than exact match
BRANCH_RUNS_E2E=false
printf "Does the commit message contain cypress?"
printf $CI_COMMIT_MESSAGE == *"cypress"*
if [[ $CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "codebuild" || $CI_COMMIT_MESSAGE == *"cypress"* ]]; then
    BRANCH_RUNS_E2E=true
fi

set -e

if [[ $BRANCH_RUNS_E2E == true ]]; then
    printf "\n--- \e[1mRUNNING E2E TESTS\e[0m ---\n"
    npm run test
fi
esac

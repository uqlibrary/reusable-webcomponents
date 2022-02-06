#!/bin/bash

#export CI_BRANCH="$CODEBUILD_SOURCE_VERSION"
#export CI_COMMIT_ID="$CODEBUILD_RESOLVED_SOURCE_VERSION"
#export CI_BUILD_NUMBER="$CODEBUILD_BUILD_ID"
##export CI_NAME=CodeBuild
##export COMMIT_INFO_AUTHOR=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%an")
##export COMMIT_INFO_MESSAGE=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%B")
export COMMIT_INFO_EMAIL=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%ae")
export CI_BUILD_URL="https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/reusable-webcomponents-${CI_BRANCH}/executions/${CI_BUILD_NUMBER}"

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

export TZ='Australia/Brisbane'
printf "\n--- \e[1mRUNNING E2E TESTS\e[0m ---\n"
npm run test:e2e:dashboard

ls -la ./
ls -la dist/
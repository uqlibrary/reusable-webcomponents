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

if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production" || $CI_BRANCH == *"coverage"*) ]]; then
     # four instances of `<span class="strong">100% </span>` indicates 100% code coverage
     ls -la coverage/index.html

     grep -c class=\"strong\"\>100\% coverage/index.html

     echo "AFTER GREP"

     NUM_FULL_COVERAGE=$(grep -c class=\"strong\"\>100\% coverage/index.html)
     echo "full coverage count = ${NUM_FULL_COVERAGE} (wanted: 4)"
     if [[ $NUM_FULL_COVERAGE == 4 ]]; then
         echo "Coverage 100%";
         echo ""
         echo '            ,-""-.'
         echo "           :======:"
         echo "           :======:"
         echo "            '-..-"
         echo "              ||"
         echo "            _,  --.    _____"
         echo "           \(/ __   '._|"
         echo "          ((_/_)\     |"
         echo "           (____)'.___|"
         echo "            (___)____.|_____"
         echo "Human, your code coverage was found to be satisfactory. Great job!"
     else
         echo "                     ____________________"
         echo "                    /                    \ "
         echo "                    |      Coverage       | "
         echo "                    |      NOT 100%       | "
         echo "                    \____________________/ "
         echo "                             !  !"
         echo "                             !  !"
         echo "                             L_ !"
         echo "                            / _)!"
         echo "                           / /__L"
         echo "                     _____/ (____)"
         echo "                            (____)"
         echo "                     _____  (____)"
         echo "                          \_(____)"
         echo "                             !  !"
         echo "                             !  !"
         echo "                             \__/"
         echo ""
         echo "            Human, your code coverage was found to be lacking... Do not commit again until it is fixed."
         # show actual coverage numbers
         grep -A 2 class=\"strong\"\> coverage/index.html
         echo "Run your tests locally with npm run cy:run then load coverage/index.html to determine where the coverage gaps are"
         exit 1;
     fi;
fi;

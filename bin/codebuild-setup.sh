 #!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "Node "; node -v;
printf "(Codeship default) npm v"; npm -v

printf "\n\n--- SET VERSION OF NPM ---\n"
echo "$ npm i -g npm@11"
npm i -g npm@11

printf "\nNow running npm v"; npm -v

printf "\n$ npm cache clear\n"
# npm cache verify
npm cache clear -f

printf "\n\n--- INSTALL DEPENDENCIES ---\n"
echo "$ npm ci"
npm ci

printf "\n\n--- INSTALL JEST ---\n"
echo "$ npm install -g jest"
npm install -g jest

# NOTE: no `playwright install` / `install-deps` here. CI runs on the official
# Playwright image (mcr.microsoft.com/playwright:v<ver>-noble, set as the
# CodeBuild project's environment image), which ships Chromium and all its
# system libraries preinstalled. Keep the image tag in sync with
# @playwright/test in package.json.

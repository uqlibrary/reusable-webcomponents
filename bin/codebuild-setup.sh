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

# NOTE: jest is a pinned devDependency (installed by `npm ci` above) and is run
# via the `test:unit:ci` npm script, which resolves the local node_modules/.bin
# copy. No global `npm install -g jest` (unpinned latest) is needed.

# NOTE: no `playwright install` / `install-deps` here. CI runs on the official
# Playwright image (mcr.microsoft.com/playwright:v<ver>-noble, set as the
# CodeBuild project's environment image), which ships Chromium and all its
# system libraries preinstalled. Keep the image tag in sync with
# @playwright/test in package.json.

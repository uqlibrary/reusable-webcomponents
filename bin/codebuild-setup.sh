 #!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "Node "; node -v;
printf "(Codeship default) npm v"; npm -v

printf "\n\n--- SET VERSION OF NPM ---\n"
echo "$ npm install -g npm@11.13.0"
npm install -g npm@11.13.0

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

printf "\n\n--- PLAYWRIGHT SETUP ---\n"
echo "$ npx playwright install chromium-headless-shell"
npx playwright install chromium-headless-shell
echo "$ npx playwright install-deps chromium-headless-shell"
npx playwright install-deps chromium-headless-shell

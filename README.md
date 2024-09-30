# UQ Library Reusable Web Components

These reusable webcomponents provides header and footer to multiple systems.

The 'applications/' folder allows us to version control changes to the scripts we use to insert code into 3rd party systems - see [the applications readme](applications/readme.md) for a summary.

## Installation

1. Clone from github

```sh
git clone git@github.com:uqlibrary/reusable-webcomponents.git
```

2. install npm (but first confirm in package.json that this is the latest installed version - doco gets out of date):

```sh
nvm use 18.19.0 && npm i -g npm@10 webpack-dev-server
```

3. Create git hooks to manage branches to project standard. 

  3.1. Prevent direct commits to the staging branch. and run `prettier-eslint` automatically before every local commit:

  ```sh
  ln -sf "../../scripts/pre-commit" ".git/hooks/pre-commit"
  ```
  3.2. Run the following in the project root directory to prevent accidental merges from the staging branch:

  ```sh
    ln -sf "../../scripts/prepare-commit-msg" ".git/hooks/prepare-commit-msg"
  ```

4. In the root folder of fez-frontend install the required npm modules:

```sh
npm install
```

## Branches / Environments

| env                  | view at                                                                                                                                                                                         | bucket                                                    |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| prod                 | <https://www.library.uq.edu.au/> <br/>or <https://assets.library.uq.edu.au/reusable-webcomponents/>                                                                                             | s3://uql-reusable-webcomponents-production/               |
| staging              | <https://assets.library.uq.edu.au/reusable-webcomponents-staging/> <br/>or <https://homepage-staging.library.uq.edu.au/> - it is the only branch that will call reusable staging                | s3://uql-reusable-webcomponents-staging/                  |
| general dev          | master branch viewable at https://assets.library.uq.edu.au/reusable-webcomponents-development/master/ <br/>or swap "master" for the name of your branch which has had a pipeline created on AWS | s3://uql-reusable-webcomponents-development/ + subfolder  |
| Fryer                | staging uses branch `atom-staging` at <https://sandbox-fryer.library.uq.edu.au/><br/>production: <https://manuscripts.library.uq.edu.au/>                                                       | s3://uql-reusable-webcomponents-development/atom-staging/ |
| Drupal V7 (pre 2024) | staging uses branch `feature-drupal` at eg <https://library.stage.drupal.uq.edu.au/contact-us><br/>production: <https://web.library.uq.edu.au/>                                                 | s3://uql-reusable-webcomponents-development/feature-drupal/ |
| Drupal V10           | staging uses branch `drupal-staging` at <https://live-library-uq.pantheonsite.io/> (login first)<br/>production: <https://web.library.uq.edu.au/>                                               | s3://uql-reusable-webcomponents-development/drupal-staging/ |
| Chatbot              | 3 envs: prod, staging & test. ITS chatbot people use Test env, with branch `chatbot-testenv` at <https://homepage-development.library.uq.edu.au/chatbot-testenv/> (matching homepage branch)    | s3://uql-reusable-webcomponents-development/chatbot-test/ |
| Primo                | Many environments. See repo `exlibris-primo` for details                                                                                                                                          |  |

## Development

- run `npm ci` to install packages.
- run `npm run start` to run the project locally while developing with a listener (calls api on staging for data)
- run `npm run start:mock` to run the project locally with mock data
  - While this is running, you can run `npm run cypress:open` to manually run cypress tests
- run `npm run build` to run a `local` test build in the `dist` folder (this also replaces `gulp styles` in the old reusable for building css locally for pasting into live pages for test)
- run `npm run build:staging` to run a `staging` test build in the `dist` folder
- run `npm run build:production` to run a `production` test build in the `dist` folder
- run `npm run test:local` to run a test build in the `dist` folder and run all cypress tests
- run `npm run prettier:test` to check all files for codestyles, and
- run `npm run prettier:fix` to fix all codestyle issues
- run `npm run cypress:run:record` to run all cypress tests at the command line

localhost will run on port 8080: `http://localhost:8080/`

The following commands are available to fix any misformatting easily:

- `npm run codestyles:fix:all` - fix all files
- `npm run codestyles:fix:staged` - fix all staged files

If you are working on Training and want to see the index-training.html file on a live url eg https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-training.html then you will have to manually copy the index-training.html file into the bucket - the build process doesnt cover it.

## Use

Add the following line at the end of your HTML document to initialise the components. Example below is obviously for production - substitute for development or staging.

Note that the _defer_ is important.

```html
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v15/fonts/Roboto/roboto.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css" />
<script
  type="text/javascript"
  src="https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js"
  defer
></script>
```

eg. UQ Header:

```html
<uq-header
  hidelibrarymenuitem="true"
  searchlabel="library.uq.edu.au"
  searchurl="library.uq.edu.au"
  skipnavid="skiptohere"
></uq-header>
```

You will also need to add an anchor with the landing id after all the header imports etc to tell the skip nav where to skip to, eg:

```html
<a id="skiptohere"></a>
```

This must be an ANCHOR, not any other html element.

### Mock user access

- masquerade, web admin (alerts, spotlights) - uqstaff
- espace - uqstaff, s1111111

## Testing

This repo uses [Cypress.io](https://cypress.io/) tests. To run tests:

- locally: `npm run test:local` - select the preferred browser from the dropdown in the top right of the cypress interface, then click on the 'run integration tests'

NOTE: CI testing uses environment variables stored on AWS to run cypress successfully and reporting to the cypress dashboard.

- data-testid attributes are used to identify elements for tests
- data-analyticsid attributes are used for GTM/GA tagging and are supplied by the customer (although we often advise).

## Branches

In addition to the usual branches, the following are in use and should not be deleted from github or AWS Pipelines:

- `feature-drupal` (drupal sandbox calls .js files from this folder cf [drupal readme](src/applications/drupal/readme.md))
- `primo-prod-dev` (maps to primo env prod-dev. Needed to support uqsvangr cf [primo readme](src/applications/primo/readme.md]))
- `primo-sandbox` (maps to primo env sandbox-dev. Needed to support uqsvangr)
- `primo-sandbox-dev` (maps to primo env sandbox-dev. Needed to support uqsvangr)
- `user-admin-manage` (used by eg uqjtilse to make changes to the megamenu ready for us to merge to master cf [admin user doc](docs/admin-howto.md))

## Reference Material

- How slots work: <https://javascript.info/slots-composition>
- Apply styles within the shadow dom from outside: <https://developer.mozilla.org/en-US/docs/Web/CSS/::part>

  - Undocumented caveat: You can only style the item with the "part attribute" you can't style its descendants like:

    ```css
    askus-button::part(askus) div#askus-label { /* doesnt work!! */
      font-weight: bold;
    }
    ```

    You have to put the `part="x"` on the label element.

- [Lifecycle hooks in web components](https://ultimatecourses.com/blog/lifecycle-hooks-in-web-components)

## Setting up from the ITS Design System private packages

### Current contents

- UQ Header (Last update 28 Feb 2021) - [ITS DS](https://design-system.uq.edu.au/?path=/docs/components-header--header)
- UQ Footer (Last update 28 Feb 2021) - [ITS DS](https://design-system.uq.edu.au/?path=/docs/components-footer--footer)
- Training (Last update June 2021) - [ITS DS](https://design-system.uq.edu.au/?path=/docs/components-accordion--using-divs)

#### _Using UQ Header package as an example_

- Follow the export procedure from [ITS Design System github](https://github.com/uq-its-ss/design-system/blob/master/packages/private-design-output/README.md).
  (Note in June 2022 this required Node v12.12.0 (so do a `nvm use v12.12.0`) - ITS are hoping to update this soon)
  (`nvm install v12.12.0 && npm cache clear -f && npm ci && npx lerna clean && npx lerna bootstrap && node --version` was a useful string of commands)
- Copy the exported package to a new folder (eg UQHeader) - or over existing files in the case of an update.
- Create the Web Component file (eg. UQHeader.js in that folder)
  - Update the reference to the CSS in the css/\*.css
- Edit the js/uqds.js file to replace any reference to `document.query...` to a shadow dom reference by replacing it with `document.querySelector('uq-header').shadowRoot.query...`
- Register the new web component in `src/index.js` and insert the dom element in `/index.html'
- Add a line to the webpack config to copy the ~usds.js file from the ITS DS package to the dist root and rename it.
- Replace all `rem` units in css to `em` to stop old vendor apps from breaking our components.

```html
new CopyPlugin({ patterns: [ { from: "src/UQHeader/js/uqds.js", to: "header.js" }, ], }),
```

- Add a line to webpack config to add the full path for various builds under:

```js
process.env.NODE_ENV !== 'local' &&
  new ReplaceInFileWebpackPlugin([
    {
      dir: 'dist',
      files: ['uq-lib-reusable.min.js.min.js'],
      rules: [
        {
          search: /uq-header\.js/gm,
          replace: componentJsPath[process.env.NODE_ENV] + 'uq-header.js',
        },
      ],
    },
    /* ... */
  ]);
```

- Make sure to update the dynamic load reference in the web component file.
- Run `npm run build` to pack the file into the `dist` folder - and open index.html there in a browser to test - or - run `npm run start` to have a listening system run in your local browser.

## Known issues

if you are developing and you suddenly start getting

`Error: ENOENT: no such file or directory, scandir '/Users/uqldegro/github/reusable-webcomponents/node_modules/node-sass/vendor'`

issuing the command `npm rebuild node-sass` will usually fix it.

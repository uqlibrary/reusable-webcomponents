# UQ Library Reusable Web Components

These reusable webcomponents provides header and footer to multiple systems.

The 'applications/' folder allows us to version control changes to the scripts we use to insert code into 3rd party systems

(tl;dr we add the header-footer to many third party systems, usually by creating a load.js file which is inserted in the backend of that system, and that load script pulls in the .min.js reusable file and creates the header-footer elements. Read each application's readme file to get full details on each system)

- Library homepage
  - code in repo homepage-react
  - live at https://www.library.uq.edu.au/
- Auth
  - library authentication & authorization check for SSO login
  - code at /src/applications/shared and called from repo `auth`
  - live at https://auth.library.uq.edu.au
  - staging at https://auth-staging.library.uq.edu.au/
- Drupal 
  - the Library public CMS
  - code at /src/applications/drupal
  - live at eg https://web.library.uq.edu.au/contact-us
  - drupal staging at eg https://library.stage.drupal.uq.edu.au/library-services/services-students is tied to the feature-drupal branch in this repo
- Libcal
  - used for various booking pages
  - code at /src/applications/libcal
  - live at eg https://calendar.library.uq.edu.au/reserve/spaces/reading-room
- Libguides
  - guides on many subjects to help students
  - code at /src/applications/libguides
  - live at https://guides.library.uq.edu.au/
- Omeka
  - Library Exhibitions
  - code at /src/applications/omeka
  - live - homepage at https://uqlibraryonlineexhibitions.omeka.net/
  - example exhibition at https://uqlibraryonlineexhibitions.omeka.net/exhibits/show/jd-fryer-student-and-soldier
- Primo
  - the Library catalogue (but note we NEVER use that 'c' word)
  - *styling* at /src/applications/primo
  - code is in separate repo as it is not deployed via AWS
  - live at https://search.library.uq.edu.au/primo-explore/search?vid=61UQ&sortby=rank
  - see full description in readme
  - has multiple branches assigned to it
- Rightnow
  - the UQ CRM
  - code at /src/applications/rightnow
  - see readme for many live pages
- Shared
  - a bunch of scripts runnng on the enki servers
  - managed by Dan
  - code at /src/applications/shared
- Studenthub
  - a small group of pages that displays staff-training to logged in staff
  - code at /src/applications/studenhub
  - live at https://www.studenthub.uq.edu.au/workgroups/library-staff-development
- UQLAPP
  - legacy angular system offering 4 products. Only membership is current for development
  - code at /src/applications/uqlapp
  - live at https://app.library.uq.edu.au/
  
### Development
- run `npm ci` to install packages.
- run `npm run start` to run the project locally while developing with a listener (calls api on staging for data)
- run `npm run start:mock` to run the project locally with mock data
  - While this is running, you can run `cypress open` to manually run cypress tests
- run `npm run build` to run a `local` test build in the `dist` folder
- run `npm run build:staging` to run a `staging` test build in the `dist` folder
- run `npm run build:production` to run a `production` test build in the `dist` folder
- run `npm run test:local` to run a test build in the `dist` folder and run all cypress tests
- run `npm run prettier:test` to check all files for codestyles and `npm run prettier:fix` to fix them all

#### Git safety checks

- Run the following in the project root directory to install the pre-commit hook:

  ```sh
  ln -sf "../../scripts/pre-commit" ".git/hooks/pre-commit"
  ```

  It does two things:

  - Prevent direct commits to the staging branch.
  - Run `prettier-eslint` automatically before every local commit

- Run the following in the project root directory to prevent accidental merges from the staging branch:

  ```sh
    ln -sf "../../scripts/prepare-commit-msg" ".git/hooks/prepare-commit-msg"
  ```

When you commit your changes, the above script will require you to have correctly formatted code.

The following commands are available to fix any misformatting easily:

- `npm run codestyles:fix:all` - fix all files
- `npm run codestyles:fix:staged` - fix all staged files

### Use

Add the following line at the end of your HTML document to initialise the components. Example below is obviously for production - substitute for development or staging. 

Note that the _defer_ is important.
```html
  <link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v6/fonts/Roboto/roboto.css" />
  <link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v9/fonts/Merriweather/merriweather.css" />
  <link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v13/fonts/Montserrat/montserrat.css">
  <script type="text/javascript" src="https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js" defer></script>
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

### Testing

This repo uses Cypress tests. To run tests:
- locally: `npm run test:local` - select the preferred browser from the dropdown in the top right of the cypress interface, then click on the 'run integration tests'

NOTE: CI testing uses environment variables stored on AWS to run cypress successfully and reporting to the cypress dashboard.

### AWS Buckets

Code is deployed to 3 buckets:

- uql-reusable-webcomponents-production
- uql-reusable-webcomponents-staging
- uql-reusable-webcomponents-development

uql-reusable-webcomponents-development has subfolders that map to feature branches

There is a cloudfront behaviour on assets.library.uq.edu.au that maps these buckets to assets address for use in deployment
- https://assets.library.uq.edu.au/reusable-webcomponents-development/  ==> s3://uql-reusable-webcomponents-development/
- https://assets.library.uq.edu.au/reusable-webcomponents-staging/      ==> s3://uql-reusable-webcomponents-staging/
- https://assets.library.uq.edu.au/reusable-webcomponents/              ==> s3://uql-reusable-webcomponents-production/

### Reference Material

- How slots work: https://javascript.info/slots-composition
- Apply styles within the shadow dom from outside: https://developer.mozilla.org/en-US/docs/Web/CSS/::part (undocumented caveat: you can only style the item with the "part attribute" you cant style its descendants ie this doesn't work: `askus-button::part(askus) div#askus-label` you have to put the part="x" on the label element)
- [Lifecycle hooks in web components](https://ultimatecourses.com/blog/lifecycle-hooks-in-web-components)

### Setting up from the ITS Design System private packages

#### Current contents
- UQ Header (28 Feb 2021) - [ITS DS](https://design-system.uq.edu.au/?path=/docs/components-header--header)
- UQ Footer (28 Feb 2021) - [ITS DS](https://design-system.uq.edu.au/?path=/docs/components-footer--footer)

###### _Using UQ Header package as an example_

- Follow the export procedure from [ITS Design System github](https://github.com/uq-its-ss/design-system/blob/master/packages/private-design-output/README.md).
- Copy the exported package to a new folder (eg UQHeader) - or over existing files in the case of an update.
- Create the Web Component file (eg. UQHeader.js in that folder)
  - Update the reference to the CSS in the css/*.css
- Edit the js/uqds.js file to replace any reference to `document.query...` to a shadow dom reference by replacing it with `document.querySelector('uq-header').shadowRoot.query...`
- Register the new web component in `src/index.js` and insert the dom element in `/index.html'
- Add a line to the webpack config to copy the ~usds.js file from the ITS DS package to the dist root and rename it.
- Replace all `rem` units in css to `em` to stop old vendor apps from breaking our components.
```html
  new CopyPlugin({
      patterns: [
        { from: "src/UQHeader/js/uqds.js", to: "header.js" },
      ],
    }),
```
- Add a line to webpack config to add the full path for various builds under:
```html
  (process.env.NODE_ENV !== 'local') && new ReplaceInFileWebpackPlugin([{
                dir: 'dist',
                files: ['uq-lib-reusable.min.js.min.js'],
                rules: [{
                    search: /uq-header\.js/gm,
                    replace: componentJsPath[process.env.NODE_ENV] + 'uq-header.js',
                },{...
```
- Make sure to update the dynamic load reference in the web component file.
- Run `npm run build` to pack the file into the `dist` folder - and open index.html there in a browser to test - or - run `npm run start` to have a listening system run in your local browser.

### Known issues

if you are developing and you suddenly start getting

`Error: ENOENT: no such file or directory, scandir '/Users/uqldegro/github/reusable-webcomponents/node_modules/node-sass/vendor'`

issuing the command `npm rebuild node-sass` will usually fix it

# UQ Library Reusable Web Components
### Current contents
- UQ Header (28 Feb 2021) - [ITS DS](https://design-system.uq.edu.au/?path=/docs/components-header--header)
- UQ Footer (28 Feb 2021) - [ITS DS](https://design-system.uq.edu.au/?path=/docs/components-footer--footer)

### Development
- run `npm ci` to install packages.
- run `npm run start` to run the project locally while developing with a listener (calls api on staging for data)
- run `npm run start:mock` to run the project locally with mock data
  - While this is running, you can run `cypress open` to manually run cypress tests
- run `npm run build` to run a `local` test build in the `dist` folder
- run `npm run build:staging` to run a `staging` test build in the `dist` folder
- run `npm run build:production` to run a `production` test build in the `dist` folder
- run `npm run test` to run a test build in the `dist` folder and run all cypress tests
- run `npm run prettier:test` to check all files for codestyles and `npm run prettier:fix` to fix them all

### Use

Add the following line at the end of your HTML document to initialise the components.
(NOTE: This is TBA in terms of final location etc)
```html
<script type="text/javascript" src="https://library.uq.edu.au/resuable/uq-lib-reusable.min.js"></script>
```

eg. UQ Header:
```html
<uq-header
        hideLibraryMenuItem="true"
        searchLabel="google.com.au"
        searchURL="www.google.com"
></uq-header>
```
You will also need to add a named anchor after all the header imports etc to tell the skip nav where to skip to:
```html
<a name="content"></a>
```

### Setting up from the ITS Design System private packages
###### _Using UQ Header package as an example_

- Follow the export procedure from [ITS Design System github](https://github.com/uq-its-ss/design-system/blob/master/packages/private-design-output/README.md).
- Copy the exported package to a new folder (eg UQHeader) - or over existing files in the case of an update.
- Create the Web Component file (eg. UQHeader.js in that folder)
  - Update the reference to the CSS in the css/*.css
- Edit the js/uqds.js file to replace any reference to `document.query...` to a shadow dom reference by replacing it with `document.querySelector('uq-header').shadowRoot.query...`
- Register the new web component in `src/index.js` and insert the dom element in `/index.html'
- Add a line to the webpack config to copy the ~usds.js file from the ITS DS package to the dist root and rename it.
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

### Known issues

if you are developing and you suddenly start getting

`Error: ENOENT: no such file or directory, scandir '/Users/uqldegro/github/reusable-webcomponents/node_modules/node-sass/vendor'`

issuing the command `npm rebuild node-sass` will usually fix it

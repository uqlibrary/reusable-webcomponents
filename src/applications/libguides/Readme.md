# Libguides documentation

## Kitchen sink

- Production : <https://assets.library.uq.edu.au/reusable-webcomponents/>
- Staging : <https://assets.library.uq.edu.au/reusable-webcomponents-staging/>
- Master : <https://assets.library.uq.edu.au/reusable-webcomponents-development/master/>

## Installation

### Imports

To install the reusable web components, enter the libguides "look and feel" page admin section (eg. <https://uq.libapps.com/libguides/lookfeel.php?action=1> ). Click on the "Custom JS/CSS" tab at the top, and paste the following code into the required pane:

```html
<script
  type="text/javascript"
  src="//assets.library.uq.edu.au/reusable-webcomponents/applications/libguides/load.js"
></script>
<script type="text/javascript" src="//assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js"></script>
<link
  rel="stylesheet"
  type="text/css"
  href="//assets.library.uq.edu.au/reusable-webcomponents/applications/libguides/custom-styles.css"
/>
```

- NOTE: The `load.js` will check if the current page is on the \*.uq.edu.au domain and hide the login/askus/mylibrary utility buttons if not due to API CORS not being allowed outside UQ.
- NOTE: `custom-styles.css` has a bunch of css overrides for the default libguides skin to make it work.

When complete, click save.

### Things to note

#### Admin edit pages

Admin edit pages (ie. <https://uq.libapps.com/libguides/lookfeel.php?action=1>) aer not on the \*.uq.edu.au domain as as such, will fail CORS checks for any calls to API. Because of that, we hide the utility buttons which require api data to display correctly (chat status/hours etc).

Previous to this rollout - the libGuides had override CSS in multiple places. It is all now in this folder -> custom-styles.scss. Please dont go adding it into the libguides backend, and we cannot manage it from there.

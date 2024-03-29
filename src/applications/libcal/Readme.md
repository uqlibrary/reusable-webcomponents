# LibCal documentation

Live at: <https://calendar.library.uq.edu.au/>

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
  src="//assets.library.uq.edu.au/reusable-webcomponents/applications/libcal/load.js"
></script>
<script
  type="text/javascript"
  src="//assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js"
  defer
></script>
<link
  rel="stylesheet"
  type="text/css"
  href="//assets.library.uq.edu.au/reusable-webcomponents/applications/libcal/custom-styles.css"
/>
```

- NOTE: The `load.js` will check if the current page is on the \*.uq.edu.au domain and hide the login/account/askus utility buttons if not due to API CORS not being allowed outside UQ.
- NOTE: `custom-styles.css` has a bunch of css overrides for the default libguides skin to make it work.

When complete, click save.

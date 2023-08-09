# Libguides documentation

"libGuides" is published at <https://guides.library.uq.edu.au/>.

It's an off site 3rd party tool used by the library to provide study guides to students. The librarians directly manage the content, we have very little to do with it, occasionally adjusting css.

The supplier is called Springshare and the admin can be logged in here: https://uq.libapps.com/libguides/

You should log in using your @library.uq.edu.au email and a password that is specifically for LibApps, not your UQ password.

If you don't have an account yet, Jake, Rob Bowen, Dan, and some others can create an admin account for you if you need one. If in doubt, begin your access request with WSS via teams LTS-WSS channel or ithelp@library.uq.edu.au.

The load.js has special code detecting whether the user is in the admin page because the Librarians asked not to have the proactive chat popup there.

## Installation

### Imports

To install the reusable web components, enter the libguides "look and feel" page admin section (eg. <https://uq.libapps.com/libguides/lookfeel.php?action=1> ). Click on the "Custom JS/CSS" tab at the top, and paste the following code into the required pane:

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700" rel="stylesheet">
<link type="image/x-icon" rel="shortcut icon" href="http://assets.library.uq.edu.au/reusable-webcomponents/favicon.ico">
<script type="text/javascript" src="//assets.library.uq.edu.au/reusable-webcomponents/applications/libguides/load.js"></script>
<script type="text/javascript" src="//assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js"></script>
<link rel="stylesheet" type="text/css" href="//assets.library.uq.edu.au/reusable-webcomponents/applications/libguides/custom-styles.css">
```

When complete, click save.

- NOTE: The `load.js` will check if the current page is on the \*.uq.edu.au domain and hide the login/askus/account utility buttons if not due to API CORS not being allowed outside UQ.
- NOTE: `custom-styles.css` has a bunch of css overrides for the default libguides skin to make it work.


### Things to note

#### Admin edit pages

Admin edit pages (ie. <https://uq.libapps.com/libguides/lookfeel.php?action=1>) are not on the \*.uq.edu.au domain as as such, will fail CORS checks for any calls to API. Because of that, we hide the utility buttons which require api data to display correctly (chat status/hours etc).

Previous to this rollout - the libGuides had override CSS in multiple places. It is all now in this folder -> custom-styles.scss. Please dont go adding it into the libguides backend, as we cannot manage it from there.

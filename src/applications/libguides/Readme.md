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
(we are also adding some early styles to minimise the flashing as there is a short delay while our js is applied)

```html
<style>
  html body#s-lib-admin-main .dataTables_paginate > ul.pagination > li.paginate_button:not(.disabled):not(.active) > a,
  html body#s-lib-public-main .dataTables_paginate > ul.pagination > li.paginate_button:not(.disabled):not(.active) > a,
  html body .s-lg-link-contrast,
  html body .ui-widget-content a,
  html body a {
    color: #51247a;
  } /* override base springshare link blue as early as posssible to try to stop the flash of blue default links */
  #s-lib-bc {
    display: none;
  } /* hide the breadcrumbs early so they dont flash */
</style>
<script
  type="text/javascript"
  src="https://assets.library.uq.edu.au/reusable-webcomponents/applications/libguides/load.js"
></script>
```

When complete, click save.

- NOTE: The `load.js` will check if the current page is on the \*.uq.edu.au domain and hide the login/askus/account utility buttons if not due to API CORS not being allowed outside UQ.
- NOTE: `custom-styles.css` has a bunch of css overrides for the default libguides skin to make it work.

### Things to note

#### Admin edit pages

Admin edit pages (ie. <https://uq.libapps.com/libguides/lookfeel.php?action=1>) are not on the \*.uq.edu.au domain as as such, will fail CORS checks for any calls to API. Because of that, we hide the utility buttons which require api data to display correctly (chat status/hours etc).

Previous to this rollout - the libGuides had override CSS in multiple places. It is all now in this folder -> custom-styles.scss. Please dont go adding it into the libguides backend, as we cannot manage it from there.

- the image in /images is used for the guides hero shot. It is sourced from L:\Governance\CorporateIdentity\Pictures\11-WEBSITE\Library-photoshoot-2024\Optimised-for-web\hero-biological-sciences-library-group-study-anatomical-models.jpg

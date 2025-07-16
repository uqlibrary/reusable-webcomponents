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

While there are pretty urls (in most cases - sometimes they seem to forget to set them), there are direct paths to access them, eg:
live page:
https://guides.library.uq.edu.au/c.php?g=210305&p=2207786
edit page for same content
https://uq.libapps.com/libguides/admin_c.php?g=210305&p=2207786
if you need to see the live page without UQ styling & code:
https://guides.library.uq.edu.au/c.php?g=210305&p=2207786&override=on&skipScript=on

#### Admin edit pages

Admin edit pages (ie. <https://uq.libapps.com/libguides/lookfeel.php?action=1>) are not on the \*.uq.edu.au domain as as such, will fail CORS checks for any calls to API. Because of that, we hide the utility buttons which require api data to display correctly (chat status/hours etc).

Previous to this rollout - the libGuides had override CSS in multiple places. It is all now in this folder -> custom-styles.scss. Please dont go adding it into the libguides backend, as we cannot manage it from there.

- the image in /images is used for the guides hero shot. It is sourced from L:\Governance\CorporateIdentity\Pictures\11-WEBSITE\Library-photoshoot-2024\Optimised-for-web\hero-biological-sciences-library-group-study-anatomical-models.jpg

The guides admin is really complicated!

Firstly, guides consists of a homepage, 6(ish) landing pages and a lot of guide pages.

There are two main areas to access the content:
- menu: Content > Guides https://uq.libapps.com/libguides/guides.php
- menu: Admin > Groups https://uq.libapps.com/libguides/groups.php

The guides management method is to make a series of "boxes" of html that each get an id (like `22982530`) and then there are html templates that pull in the 'box' like `<div>{{content_box_22982530}}</div>`.

##### Templates

- On https://uq.libapps.com/libguides/guides.php use the drop down under "Group" and find the entry that relates to the page of interest
- "home pages content" is a good one to choose, as we end up on a sort of general page, landing here https://uq.libapps.com/libguides/admin_c.php?g=920678
- use the edit icon at the far right
- if you chose "Home pages content" you have landed on a sort of instructional page
- note the sidebar shows all the landing pages
- the "Group landing pages" entry will walk the new editor through how to create a nnew group page, which is also a guide to how to reach the template 

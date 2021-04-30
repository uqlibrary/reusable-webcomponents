# Library CMS

The Library's CMS is found on the subpages of <https://web.library.uq.edu.au/> and is accessed via the megamenu on the homepage.

This is run by a Drupal install which is managed by ITS.

- Any html components to be used in UQ Drupal require registration within UQ Drupal.
- A Change Request is required for work requests on ITS: <https://staff.uq.edu.au/information-and-services/information-technology/it-support>
- Your previous/current change requests are at: <https://support.staff.uq.edu.au/app/account/questions/list>
- <https://web.library.uq.edu.au> itself diverts to www, so visit www and select a page on the megamenu.

Production Drupal includes this code chunk to include the Library header and footer on to Drupal:

```html
<script async src="https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js"></script>
<script async src="https://assets.library.uq.edu.au/reusable-webcomponents/applications/drupal/load.js"></script>
<link
  rel="stylesheet"
  href="https://assets.library.uq.edu.au/reusable-webcomponents/applications/drupal/custom-styles.css"
/>
```

Changes on drupal can be tested on branch `feature-drupal` before going live on the staging environment at eg <https://library.stage.drupal.uq.edu.au/library-services/services-students>

```html
<script
  defer
  src="http://homepage-staging.library.uq.edu.au/reusable-web-components-development/feature-drupal/uq-lib-reusable.min.js"
></script>
<script
  async
  src="http://homepage-staging.library.uq.edu.au/reusable-web-components-development/feature-drupal/applications/drupal/load.js"
></script>
<link
  rel="stylesheet"
  href="http://homepage-staging.library.uq.edu.au/reusable-web-components-development/feature-drupal/applications/drupal/custom-styles.css"
/>
```

(I believe ITS have to give individual access to make library.staging visible to a developer - make a Change Request, above)

Drupal staging has the following code

```html
<script
  type="text/javascript"
  src="https://homepage-staging.library.uq.edu.au/test-web-components/uq-lib-reusable.min.js"
></script>
<script
  type="text/javascript"
  src="https://assets.library.uq.edu.au/feature-drupal/reusable-components/libwww/load.js"
></script>
<link
  rel="stylesheet"
  href="https://assets.library.uq.edu.au/feature-drupal/reusable-components/libwww/custom-styles.css"
/>
```

2021: while some of the polymer tags are being redeveloped, these pages have both the old polymer headers and the new reusable headers.

- uqlibrary-training on https://web.library.uq.edu.au/library-services/training
- uqlibrary-search on https://web.library.uq.edu.au/research-tools-techniques/library-search
- uql-ezproxy on https://web.library.uq.edu.au/research-tools-techniques/off-campus-access and https://web.library.uq.edu.au/library-services/teaching-staff/linking-resources-courses

This is so the old polymer tags will work.
ITS are detecting that the tag is on the page, so as we migrate away from the polymer and replace the tag, the old headers will automatically stop being included.
When this is complete, it would make sense to let ITS know so they can cleanup their code.

(Note that ITS blew the implementation, so if you try to view the above pages on staging, the menu will point to live)

When the above migration is complete our drupal/load.js can also be cleanedup, to delete the 'remove' functions at the top of the file

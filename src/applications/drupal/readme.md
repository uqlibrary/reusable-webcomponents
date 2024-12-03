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

Changes on drupal can be tested on branch `drupal-staging` before going live on the staging environment at (update this url) eg <https://library.stage.drupal.uq.edu.au/library-services/services-students>

```html
<script
  async
  src="http://homepage-staging.library.uq.edu.au/reusable-web-components-development/drupal-staging/applications/drupal/load.js"
></script>
```

(I believe ITS have to give individual access to make drupal staging visible to a developer - make a Change Request, above)

Drupal staging has the following code

```html
<script
  type="text/javascript"
  src="https://assets.library.uq.edu.au/drupal-staging/reusable-components/drupal/load.js"
></script>
```

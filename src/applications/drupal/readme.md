# Library CMS

The Library's CMS is found on the subpages of <https://web.library.uq.edu.au/> and is accessed via the megamenu on the homepage.

This is run by a Drupal install which is managed by ITS.

* Any html components to be used in UQ Drupal require registration within UQ Drupal.
* A change request is required for work requests on ITS: <https://staff.uq.edu.au/information-and-services/information-technology/it-support>
* Your previous/current change requests are at: <https://support.staff.uq.edu.au/app/account/questions/list>
* <https://web.library.uq.edu.au> itself diverts to www, so visit www and select a page on the megamenu.

Production Drupal includes this code chunk to include the Library header and footer on to Drupal:
```html
<script async src="https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js"></script>
<script async src="https://assets.library.uq.edu.au/reusable-webcomponents/applications/drupal/load.js"></script>
<link rel="stylesheet" href="https://assets.library.uq.edu.au/reusable-webcomponents/applications/drupal/custom-styles.css" />
```

Changes on drupal can be tested on branch `feature-drupal` before going live.

Staging environment at eg <https://library.stage.drupal.uq.edu.au/library-services/training>

```html
<script async src="http://homepage-staging.library.uq.edu.au/reusable-web-components-development/feature-drupal/uq-lib-reusable.min.js"></script>
<script async src="http://homepage-staging.library.uq.edu.au/reusable-web-components-development/feature-drupal/applications/drupal/load.js"></script>
<link rel="stylesheet" href="http://homepage-staging.library.uq.edu.au/reusable-web-components-development/feature-drupal/applications/drupal/custom-styles.css" />
```

(I beleive ITS have to give individual access to make library.staging visible to a developer - I've been dealing with David Pollitt, October 2017)

March-2021 - during development, ITS have been given this code chunk for staging:
```html
<script type="text/javascript" src="https://homepage-staging.library.uq.edu.au/test-web-components/uq-lib-reusable.min.js"></script>
<script type="text/javascript" src="https://assets.library.uq.edu.au/feature-drupal/reusable-components/libwww/load.js"></script>
<link rel="stylesheet" href="https://assets.library.uq.edu.au/feature-drupal/reusable-components/libwww/custom-styles.css" />
```

# Shared (ezproxy, static pages on enki)

The following HTML is included to provide reusable headers to various pages.

It provides uq-header, uq-site-header and uq-footer.
(connect-footer is excluded & uq-site-header has no utility area buttons and no mega menu)

During development (2021):

```html
<link type="image/x-icon" rel="shortcut icon" href="https://www.library.uq.edu.au/favicon.ico" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v6/fonts/Roboto/roboto.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v9/fonts/Merriweather/merriweather.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v13/fonts/Montserrat/montserrat.css" />
<link
  rel="stylesheet"
  type="text/css"
  href="https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-shared/applications/shared/custom-styles.css"
/>
<script
  async
  src="https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-shared/uq-lib-reusable.min.js"
  defer
></script>
<script
  async
  src="https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-shared/applications/shared/load.js"
></script>
```

Production:

```html
<link type="image/x-icon" rel="shortcut icon" href="https://www.library.uq.edu.au/favicon.ico" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v6/fonts/Roboto/roboto.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v9/fonts/Merriweather/merriweather.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v13/fonts/Montserrat/montserrat.css" />
<link
  rel="stylesheet"
  type="text/css"
  href="https://assets.library.uq.edu.au/reusable-webcomponents/applications/shared/custom-styles.css"
/>
<script async src="https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js" defer></script>
<script async src="https://assets.library.uq.edu.au/reusable-webcomponents/applications/shared/load.js"></script>
```

Example pages this is used on:

- Ezproxy (2 url patterns)
  - eg <https://www.library.uq.edu.au/ezproxy-docs/needhost-submit.php?url=just-testing> (generates a "just testing" email to Ops on load)
  - eg <http://ezproxy.library.uq.edu.au/loggedin/UQ/resources/thomson_classic_legal.html>
- the media player eg <https://streaming.library.uq.edu.au/media/player.php?id=UQL_LAWS5216_Video2>
- endnote <https://www.library.uq.edu.au/endnote-download/> (single page)

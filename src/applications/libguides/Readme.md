# Libguides documentation
## Kitchen sink
- Production : https://assets.library.uq.edu.au/reusable-webcomponents/
- Staging : https://assets.library.uq.edu.au/reusable-webcomponents-staging/
- Master : https://assets.library.uq.edu.au/reusable-webcomponents-development/master/
## Installation
### Imports
To install the reusable web components, enter the libguides "look and feel" page admin section (eg. https://uq.libapps.com/libguides/lookfeel.php?action=1 ). Click on the "Custom JS/CSS" tab at the top, and paste the following code into the required pane:

```html
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v6/fonts/Roboto/roboto.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v9/fonts/Merriweather/merriweather.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v13/fonts/Montserrat/montserrat.css">
<link rel="stylesheet" type="text/css" href="http://assets.library.uq.edu.au/reusable-webcomponents-XXXXX/YYYYY/applications/libguides/custom-styles.css">
<script type="text/javascript" src="https://assets.library.uq.edu.au/reusable-webcomponents-XXXXX/YYYYY/uq-lib-reusable.min.js" defer></script>
```
* Where XXXXX is the branch you expect to use (ie. staging, development or production will be blank and no `-`).
* Where YYYYY is the branch name and XXXXX is `development` if a development build. Omit if not.
* NOTE: `custom-styles.css` has a bunch of css overrides for the default libguides skin to make it work. 

When complete, click save.

### Header
To install the reusable header web components, click on the "Header / Footer / Tabs / Boxes" tab at the top, and paste the following code (for production) into the *header* pane:

```html
<uq-gtm gtm="GTM-XXXXXX"></uq-gtm>
<uq-header hidelibrarymenuitem skipnavid="YYYYYY"></uq-header>
<uq-site-header>
    <span slot="site-utilities">
        <auth-button />
    </span>
</uq-site-header>
<alert-list></alert-list>
```
* Where XXXX is the Google Tag Manager container code you require.
* Where YYYY is the html element `id` of the container for the page content that will take focus when skipping navigation. 

You may add additional utility items in the site header by adding a `<slot>`:

````html
<uq-site-header>
    <span slot="site-utilities">
        <askus-button />
    </span>
    <span slot="site-utilities">
        <div id="mylibrarystub"></div>
    </span>
    <span slot="site-utilities">
        <auth-button />
    </span>
</uq-site-header>
````
When complete - click save.

### Footer
To install the reusable footer components, click on the "Header / Footer / Tabs / Boxes" tab and paste the following code into the *footer* pane:
```html
<connect-footer></connect-footer>
<uq-footer></uq-footer>
```
When complete, click save.

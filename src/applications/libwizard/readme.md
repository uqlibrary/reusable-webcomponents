# Libwizard

Admin is at <https://uq.libwizard.com/admin/settings>

Example live page: <https://uq.libwizard.com/f/metrics> (but I think it is run as an iframe)

Note that we arent running GTM on this page.

## Page header tab

Select 'display this html' and insert the following html:

```html
<uq-header hidelibrarymenuitem skipnavid="skiptohere"></uq-header> <uq-site-header> </uq-site-header>
```

## Custom CSS/JS Tab

Custom CSS Code: blank

External CSS Files:

<https://assets.library.uq.edu.au/reusable-webcomponents/applications/libwizard/custom-styles.css>

Custom JS Code: blank

External JS Code:

<https://assets.library.uq.edu.au/reusable-webcomponents/applications/libwizard/load.js>

The contents of the LibWizard admin panel before the 2021 changes were made are recorded at <readme.old.me>

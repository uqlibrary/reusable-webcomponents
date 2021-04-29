This inclusion is used to supply header and footer to UQLapp:

- production URL: <https://app.library.uq.edu.au/#/> (parent page to 4 separate apps)
- repo <https://github.com/uqlibrary/uqlapp-frontend/>
- development environment: <https://app-testing.library.uq.edu.au/#/> linked to uqlapp-frontend branch `testing`

Include the following:

```html
<link type="image/x-icon" rel="shortcut icon" href="https://www.library.uq.edu.au/favicon.ico" />
<script async src="https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js"></script>
<script async src="https://assets.library.uq.edu.au/reusable-webcomponents/applications/uqlapp/load.js"></script>
```

(note: assets.library.uq.edu.au/reusable-webcomponents maps to s3 bucket uql-reusable-webcomponents-production/reusable-webcomponents)

Historically, this also supplied components for:

- FBS: public/lib/Template.class.php (deprecated, replaced by bookit)
- Librarian Contacts System: contacts/librarians/index.html (deprecated, replaced by drupal: https://web.library.uq.edu.au/library-services/liaison-librarians
- ACDB (https://www.library.uq.edu.au/acdba.html) (retired))
- Exams <https://www.library.uq.edu.au/exams/> (now uses 'shared')

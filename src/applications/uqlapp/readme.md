This inclusion is used to supply header and footer to:

- UQLapp (<https://app.library.uq.edu.au/>)
- Exams (eg <https://www.library.uq.edu.au/exams/papers.php?stub=phil>)

# UQLAPP

- UQLAPP URL: <https://app.library.uq.edu.au/#/>
- repo <https://github.com/uqlibrary/uqlapp-frontend/>
- development environment: <https://app-testing.library.uq.edu.au/#/> linked to branch testing in

# Exams
- https://www.library.uq.edu.au/exams/
- code: managed by Dan
- development env: https://enki-dr.library.uq.edu.au/exams/

Include the following:

[Yesterday 16:20] Lea de Groot
but the script lines below it could be replaced with

```html
<link type="image/x-icon" rel="shortcut icon" href="https://www.library.uq.edu.au/favicon.ico">
<script async src="https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js"></script>
<script async src="https://assets.library.uq.edu.au/reusable-webcomponents/applications/uqlapp/load.js"></script>
```

(note: assets.library.uq.edu.au/reusable-webcomponents maps to s3 bucket uql-reusable-webcomponents-production/reusable-webcomponents)

Historically, this also supplied components for:

- FBS: public/lib/Template.class.php (deprecated, replaced by bookit)
- Librarian Contacts System: contacts/librarians/index.html (deprecated, replaced by drupal: https://web.library.uq.edu.au/library-services/liaison-librarians
- ACDB (https://www.library.uq.edu.au/acdba.html) (retired))

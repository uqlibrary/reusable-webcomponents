# Studenthub (aka Careerhub) Customisation

A third party product that we are theming to match the general library theme.

Current area is the [Library Staff Development workgroup portal](https://studenthub.uq.edu.au/workgroups/library-staff-development/events/). We are theming this by putting our polymer reusable elements in the top of the body of the page via a GUI editor.

Method to edit the theme:

- Decide what changes are needed and update below
- Visit the theme edit page [current link](https://www.studenthub.uq.edu.au/Admin/SubSites/Layout.aspx?id=14) or check "Locating the Theme Edit page" below
- Click on the word '(text)' in the header of the example-layout (if this isnt available, drag the 'text' item from
  the layout options into the header field, then click)
- Click on the angle bracket icon ('<>') - a very short area will load with white markup on a black background. This is the editing area
- Select the current markup and delete (the GUI does not return everything we provide them)
- Paste in the markup from below
- Click OK
- Reload the workgroup portal page to confirm (the change should be instant)

**Editing in the studenthub GUI interface does not return all the html lines that were saved**, so start with the code block below - dont try to edit in place in the GUI.

Code to include in the GUI editor (keep this up to date as it can't be reviewed reliably in the GUI):

```html
<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v6/fonts/Roboto/roboto.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v9/fonts/Merriweather/merriweather.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v13/fonts/Montserrat/montserrat.css" />
<link
  rel="stylesheet"
  type="text/css"
  href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap"
/>
<link
  rel="stylesheet"
  href="https://assets.library.uq.edu.au/reusable-webcomponents/applications/studenthub/custom-styles.css"
/>
<script
  type="text/javascript"
  src="https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js"
  defer
></script>
<script src="https://assets.library.uq.edu.au/reusable-webcomponents/applications/studenthub/load.js" async></script>
```

2021 development:

```html
<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v6/fonts/Roboto/roboto.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v9/fonts/Merriweather/merriweather.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v13/fonts/Montserrat/montserrat.css" />
<link
  rel="stylesheet"
  href="https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-studenthub/applications/studenthub/custom-styles.css"
/>
<script
  type="text/javascript"
  src="https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js"
  defer
></script>
<script
  src="https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-studenthub/applications/studenthub/load.js"
  async
></script>
```

Notes:

- Careerhub have said they will put the meta viewport line in the template. It hasnt appeared yet - if it does, this line can be removed here
- Material design icons are being used, so the font family is included

## Locating the Theme Edit page

The theme edit page is here [current link](https://www.studenthub.uq.edu.au/Admin/SubSites/Layout.aspx?id=14) or follow these steps:

- login
- left hand menu, click on Work Groups, click on list
- centre block, click on name of Work Group
- right hand menu, click on Settings
- open Legacy Settings, click on Layout

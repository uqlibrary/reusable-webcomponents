# Applications

The 'applications/' folder allows us to version control changes to the scripts we use to insert code into 3rd party systems.

A load.js file and custom-styles.css is available for most applications. `npm run build` will build them into the `dist` folder.

(Note: where in old reusable we did a `gulp styles` to get access to the .css file generated from the .scss file during dev, here we do a `npm run bulld` and then find the file of interest in the dist folder)

The custom-styles.css is moved into the correct location in aws during the build via the `compilesass` command in package.json

Each application has a specific readme file - cf.

We add the header-footer to many third party systems, usually by creating a load.js file which is inserted in the backend of that system, and that load script pulls in the .min.js reusable file and creates the header-footer elements. Read each application's readme file to get full details on each system

- Library homepage
  - code in repo homepage-react 
  - no load.js file
  - make changes in components/App.js
  - live at <https://www.library.uq.edu.au/>
  - staging at <https://homepage-development.library.uq.edu.au/reusable-staging/#/> (merge reusable into branch reusable-staging; match homepage branch will call that reusable branch. It's the only homepage branch that cals a non-prod reusable.)
- Auth
  - library authentication & authorization check for SSO login
  - code at /src/applications/auth and called from src/resources/views/layout/default.blade.php in repo `auth`
  - live at <https://auth.library.uq.edu.au>
  - staging at <https://auth-staging.library.uq.edu.au/>
- Drupal
  - the Library public CMS
  - code at /src/applications/drupal
  - live at eg <https://web.library.uq.edu.au/contact-us>
  - drupal staging at eg <https://library.stage.drupal.uq.edu.au/library-services/services-students> is tied to the feature-drupal branch in this repo
- Libcal
  - used for various booking pages
  - code at /src/applications/libcal
  - live at eg <https://calendar.library.uq.edu.au/reserve/spaces/reading-room>
- Libguides
  - guides on many subjects to help students
  - code at /src/applications/libguides
  - live at <https://guides.library.uq.edu.au/>
  - staging at the time by arrangement with Springshare
- Libwizard
  - used for training forms
  - code at /src/applications/libwizard
  - live at eg <https://uq.libwizard.com/f/metrics>
  - Springshare cant do a library subdomain, we asked
- Primo
  - the Library catalogue (but note we NEVER use that 'c' word)
  - _styling_ at /src/applications/primo
  - no load.js file - code is in [separate repo](https://github.com/uqlibrary/exlibris-primo) as it is not deployed via AWS
  - live at <https://search.library.uq.edu.au/primo-explore/search?vid=61UQ&sortby=rank>
  - see full description in readme
  - has multiple branches assigned to it
- Rightnow
  - the UQ CRM
  - code at /src/applications/rightnow
  - see readme for many live pages
- Shared
  - a bunch of scripts runnng on the enki servers
  - managed by Dan
  - code at /src/applications/shared
- Studenthub
  - a small group of pages that displays staff-training to logged in staff
  - code at /src/applications/studenthub
  - live at <https://www.studenthub.uq.edu.au/workgroups/library-staff-development>
- UQLAPP
  - legacy system in Angular V1 offering 4 products. Only membership is current for development
  - code at /src/applications/uqlapp
  - live at <https://app.library.uq.edu.au/>

# Applications

The 'applications/' folder allows us to version control changes to the scripts we use to insert code into 3rd party systems.

A load.js file and custom-styles.css is available for most applications. `npm run build` will build them into the `dist` folder.

(Note: where in old reusable we did a `gulp styles` to get access to the .css file generated from the .scss file during dev, here we do a `npm run bulld` and then find the file of interest in the dist folder)

The custom-styles.css is moved into the correct location in aws during the build via the `compilesass` command in package.json

Each application has a specific readme file - cf.

We add the header-footer to many third party systems, usually by creating a load.js file which is inserted in the backend of that system, and that load script pulls in the .min.js reusable file and creates the header-footer elements. Read each application's readme file to get full details on each system

- Library homepage
  - no load.js file, make changes in components/App.js in repo [homepage-react](https://github.com/uqlibrary/homepage-react)
  - live at <https://www.library.uq.edu.au/>
  - staging at <https://homepage-staging.library.uq.edu.au/> (Staging is the only homepage branch that calls a non-prod reusable, but you can use non-prod locally by changing the value in .env)
- Auth
  - library authentication & authorization check for SSO login
  - load.js at /src/applications/auth and called from src/resources/views/layout/default.blade.php in repo [auth](https://github.com/uqlibrary/auth)
  - live at <https://auth.library.uq.edu.au>
  - staging at <https://auth-staging.library.uq.edu.au/>
- Drupal
  - the Library public CMS
  - load.js at /src/applications/drupal
  - live at eg <https://web.library.uq.edu.au/contact-us>
  - -- needs update to new drupal10 location!
  - drupal staging at eg <https://library.stage.drupal.uq.edu.au/library-services/services-students> is tied to the `drupal-staging` branch in this repo
- Libcal
  - used for various booking pages
  - load.js at /src/applications/libcal
  - live at eg <https://calendar.library.uq.edu.au/reserve/spaces/reading-room>
- Libguides
  - guides on many subjects to help students
  - load.js at /src/applications/libguides, inserted into page at <https://uq.libapps.com/libguides/lookfeel.php?action=1>
  - live at <https://guides.library.uq.edu.au/>
  - staging at the time by arrangement with Springshare
- Libwizard
  - used for training forms
  - load.js at /src/applications/libwizard
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
  - load.js at /src/applications/rightnow
  - see readme for many live pages
- Shared
  - a bunch of scripts running on the enki servers
  - managed by Dan
  - load.js at /src/applications/shared
- Studenthub
  - a small group of pages that displays staff-training to logged in staff
  - load.js at /src/applications/studenthub
  - live at <https://www.studenthub.uq.edu.au/workgroups/library-staff-development>
- UQLAPP
  - legacy system in Angular V1 offering a number of subsites. Only membership is current for development
  - load.js at /src/applications/uqlapp
  - live at <https://app.library.uq.edu.au/>
  - staging at <https://app-testing.library.uq.edu.au/> is tied to the staging branch of this repo - vpn required
  - (repo is [uqlapp-frontend](https://github.com/uqlibrary/uqlapp-frontend))
- Secure Collection
  - Secure collections are files that appear at eg <https://files.library.uq.edu.au/collection/?collection=documents&file=Tincture_Journal_Issue_Thirteen_(Autumn_2016).pdf> 
- Atom/Fryer
  - system used for Fryer library
  - load.js at /src/applications/atom
  - live at <https://manuscripts.library.uq.edu.au/>
  - see readme for access details

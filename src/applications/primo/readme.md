# PRIMO2 Customisations

UQ Library is a Hosted Multi-Tenant Customer of Ex Libris (the alternative is to be an On-Premises Customer).

Primo is managed by the Library's "Discovery and Access Coordinator", referred to below as DAC. This is currently Stacey van Groll.

There are 6 basic environments:

| Primo Environment Name | Primo Url                                                                                                                                                                | Git&nbsp;Branch&nbsp;Name | Notes                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| prod                   | [search.library.uq.edu.au](https://search.library.uq.edu.au/primo-explore/search?vid=61UQ&sortby=rank) (ie vid=61UQ)                                                     | `production`              | live, public primo                                                                                          |
| prod-dev               | [search.library.uq.edu.au](https://search.library.uq.edu.au/primo-explore/search?sortby=rank&vid=61UQ_DEV) (ie vid=61UQ_DEV)                                             | `primo-prod-dev`          | development on the live server                                                                              |
| prod-dac               | [search.library.uq.edu.au](https://search.library.uq.edu.au/primo-explore/search?sortby=rank&vid=61UQ_DAC) (ie vid=61UQ_DAC)                                             | (uses prod)               | DAC's personal area. Keep it up to date with the others - deploy prod-dev changes here                      |
| prod-otb               | [search.library.uq.edu.au](https://search.library.uq.edu.au/primo-explore/search?sortby=rank&vid=61UQ_DEV_LOGIN) (ie vid=61UQ_DEV_LOGIN)                                 | -                         | Blue out of the box primo in the prod environment - it would be very unusual for us to make changes to this |
| sandbox                | [uq-edu-primo-sb.hosted.exlibrisgroup.com](https://uq-edu-primo-sb.hosted.exlibrisgroup.com/primo-explore/search?vid=61UQ&sortby=rank) (ie vid=61UQ)                     | `primo-sand-box`          | sandbox area                                                                                                |
| sandbox-dev            | [uq-edu-primo-sb.hosted.exlibrisgroup.com](https://uq-edu-primo-sb.hosted.exlibrisgroup.com/primo-explore/search?vid=61UQ_DEV&sortby=rank) (ie vid=61UQ_DEV)             | `primo-sandbox-dev`       | sandbox dev area                                                                                            |
| sandbox-dac            | [uq-edu-primo-sb.hosted.exlibrisgroup.com](https://uq-edu-primo-sb.hosted.exlibrisgroup.com/primo-explore/search?vid=61UQ_DAC&sortby=rank) (ie vid=61UQ_DAC)             | (uses primo-sand-box)     | DAC's personal area. Keep it up to date with the others - deploy sandbox-dev changes here                   |
| sandbox-otb            | [uq-edu-primo-sb.hosted.exlibrisgroup.com](https://uq-edu-primo-sb.hosted.exlibrisgroup.com/primo-explore/search?vid=61UQ_DEV_LOGIN&sortby=rank) (ie vid=61UQ_DEV_LOGIN) | -                         | sandbox out of the box - it would be very unusual for us to make changes to this                            |

(and of course there is the `master` branch, but this does not map to any of the live environments)

The branch is set in the view package - see [github repo exlibris-primo](https://github.com/uqlibrary/exlibris-primo)

Primo UI is in active development. All releases are scheduled by ExLibris and are available in Primo Sand Box a couple of weeks before going to production.

## Theming for new Primo UI

Styling of primo pages is done by editing `/applications/primo/custom-styles.scss`. While you _can_ dig deeper into the scss files, its not recommended (it makes maintenance harder, not easier).

- `load.js` - Any custom scripts
- `custom.scss` - Compiles styles from `/www/*` (Primo's SCSS package) and customisations in `/styles-imports/*`

There is also the GET IT iframe, which is styled via the alma mashup - see repo exlibris-primo

## Styling guidelines

- All global overrides (eg fonts, colours, etc found in uqlibrary-styles) to be updated in Primo's SASS package
  - `/www/styles/main.scss` - Contains a list of SCSS imports
  - Any global overrides of a partial to be copied to `styles-imports/www` (variables example below):
    - Global variables(colours) override is imported from `@import "../../styles-imports/www/variables";`
    - Original variables import is kept in the `main.scss` for reference `//@import "partials/variables";`
  - Keep overrides to a minimum
- All local customisations/fixes to be done in `applications/primo/custom-styles.scss`
- SASS package can be downloaded from <https://search.library.uq.edu.au/primo-explore/lib/scsss.tar.gz>
- SASS package for SandBox (pre-release) can be downloaded from [here](https://uq-edu-primo-sb.hosted.exlibrisgroup.com/primo-explore/lib/scsss.tar.gz)
- When ExLibris deploys a new release to Primo Sand Box (2-3 weeks before going to production):
  - In primo-sandbox branch: update SASS package to use latest from Primo Sand Box, might require a merge of overrides
  - Test/verify customisations are not broken
- New SASS package to be merged with any styling customisations

[Primo SandBox Back Office](https://uq-edu-primo-sb.hosted.exlibrisgroup.com:1443/primo_publishing/admin/acegilogin.jsp)

## Primo release notes/dev notes

- [ExLibris Primo release notes](https://knowledge.exlibrisgroup.com/Primo/Release_Notes)
- [Community Primo dev notes](https://docs.google.com/document/d/1pfhN1LZSuV6ZOZ7REldKYH7TR1Cc4BUzTMdNHwH5Bkc/edit#)
- [Community Primo cookbook notes](https://docs.google.com/document/d/1z1D5II6rhRd2Q01Uqpb_1v6OEFv_OksujEZ-htNJ0rw/edit#heading=h.ti1szv6s9yu0)

## Development Workflow

DAC sometimes asks for different changes in different environments (see table, above) so WAG (Web Advisory Group) can compare the differences. For example she may want Change A in primo-sandbox-dev and Change B in primo-prod-dev.

Angular changes are done in repo exlibris-primo and css changes are done here (all javascript is run from the angular View Package in repo exlibris-primo).

When your work is complete, don't just merge up to production, make sure all the primo branches contain the changes.

One useful technique to avoid lots of commits and codeship builds is to edit the css in the browser by Inspecting and editing the source file at assets.library.uq.edu.au > reusable-webcomponents > applications/primo > custom-styles.css, then paste your changes into the custom_styles.css file in this repo. (Alchemy is a useful Chrome extension for unpacking vulcanized css)

The command `npm run build:development` will create a dist folder containing the required .css file from the .scss for a final check prior to commit. (Paste it back into the browser)

## Miscellaneous

1. To make a link that forces login, prepend the link with:

   <https://search.library.uq.edu.au/primo-explore/login?vid=61UQ&targetURL=...>

   e.g.: [Link to Saved Items](https://search.library.uq.edu.au/primo-explore/login?vid=61UQ&targetURL=https%3A%2F%2Fsearch.library.uq.edu.au%2Fprimo-explore%2Ffavorites%3Fvid%3D61UQ%26lang%3Den_US%C2%A7ion%3Ditems)

2. [This repo](https://github.com/mehmetc/primo-extract) may be useful if we ever have to get into the depths of Primo Angular - it gives access to the sourcemaps of Primo Angular code.


# PRIMO2 Customisations

UQ Library is a Hosted Multi-Tenant Customer of Ex Libris (the alternative is to be an On-Premises Customer).

Primo is managed by the Library's "Discovery and Access Coordinator", referred to below as DAC. This is currently Stacey van Groll.

For security reasons, a description of our environments has been moved [here](https://uq.sharepoint.com/:w:/r/teams/lbf4g4a1/LTSDevelopers%20Documents/Applications/Ex%20Libris%20-%20Primo%20-%20Alma/Environments.docx?d=w9ada68747c4d4752963bdff4b5b8236a&csf=1&web=1&e=BJX8hs)

Primo UI is in active development. All releases are scheduled by ExLibris and are available in Primo Sand Box a couple of weeks before going to production.

## Theming for new Primo UI

Styling of primo pages is done by editing `/applications/primo/custom-styles.scss`. While you _can_ dig deeper into the scss files, its not recommended (it makes maintenance harder, not easier).

- `load.js` - Any custom scripts
- `custom.scss` - Compiles styles from `/www/*` (Primo's SCSS package) and customisations in `/styles-imports/*`

There is also the GET IT iframe, which is styled via the alma mashup - see repo exlibris-primo

## Styling guidelines

- as much as possible, work in the low level .scss files (initially supplied by ex-libris)
  (if having trouble finding the right file, search for the angular parent tag, eg prm-brief-result and find the "file with a similar name", in this example \_briefResultContainer.scss)
- where there isn't a file, the css should go in the top level custom-styles.scss
- use the defined variables for colours wherever possible, to make future styling change easier (every few years they change which Purple we use, etc)

[Primo SandBox Back Office](https://uq-edu-primo-sb.hosted.exlibrisgroup.com:1443/primo_publishing/admin/acegilogin.jsp)

## Primo release notes/dev notes

- [ExLibris Primo release notes](https://knowledge.exlibrisgroup.com/Primo/Release_Notes)
- [Community Primo dev notes](https://docs.google.com/document/d/1pfhN1LZSuV6ZOZ7REldKYH7TR1Cc4BUzTMdNHwH5Bkc/edit#)
- [Community Primo cookbook notes](https://docs.google.com/document/d/1z1D5II6rhRd2Q01Uqpb_1v6OEFv_OksujEZ-htNJ0rw/edit#heading=h.ti1szv6s9yu0)

## Development Workflow

DAC sometimes asks for different changes in different environments (see table, above) so AGDA (Action Group on Discovery and Access) can compare the differences. For example, she may want Change A in primo-sandbox-dev and Change B in primo-prod-dev.

Angular changes are done in repo exlibris-primo and css changes are done here (all javascript is run from the angular View Package in repo exlibris-primo).

When your work is complete, don't just merge up to production, make sure all the primo branches contain the changes.

One useful technique to avoid lots of commits and codeship builds is to edit the css _in the browser_ by Inspecting and changing the source file at assets.library.uq.edu.au > reusable-webcomponents > applications/primo > custom-styles.css, then paste your changes into the custom_styles.css file in this repo. ([Alchemy](https://alchemizeapp.com/app/) is useful for unpacking minimised CSS)

The command `npm run build:development` will create a dist folder containing the required .css file from the .scss for a final check prior to commit. (Paste it back into the browser)

## Miscellaneous

1. To make a link that forces login, prepend the link with:

   <https://search.library.uq.edu.au/discovery/login?vid=61UQ_INST:61UQ&targetURL=...>

   e.g.: [Link to Saved Searches](https://search.library.uq.edu.au/discovery/login?vid=61UQ_INST:61UQ&targetURL=https%3A%2F%2Fsearch.library.uq.edu.au%2Fdiscovery%2Ffavorites%3Fvid%3D61UQ_INST:61UQ%26lang%3Den_US%C2%A7ion%3Dqueries)

2. [This repo](https://github.com/mehmetc/primo-extract) may be useful if we ever have to get into the depths of Primo Angular - it gives access to the sourcemaps of Primo Angular code.

# RightNow

RightNow is an Oracle CRM system that the Library is using to be in line with central UQ usage.

These are the pages we currently have:

- Feedback form <https://support.my.uq.edu.au/app/library/feedback>
- FAQ pages <https://support.my.uq.edu.au/app/library/faqs> and eg <https://support.my.uq.edu.au/app/library/faqs/st/3/kw/database/page/1>
- FAQ answer pages eg <https://support.my.uq.edu.au/app/library/answers/detail/a_id/1091> (replacing the old answers.library.uq.edu.au tool.)
- Contact form <https://support.my.uq.edu.au/app/library/contact>
- Report a problem page (from Primo) eg <https://support.my.uq.edu.au/app/library/contact/report_problem/true/incidents.subject/Frogs%20%2F/incidents.c$summary/61UQ_ALMA21107302790003131> ([Primo page that has the button launching to this page](https://search.library.uq.edu.au/primo-explore/fulldisplay?docid=61UQ_ALMA21102980340003131&context=L&vid=61UQ_INST:61UQ&lang=en_US&search_scope=61UQ_All&adaptor=Local%20Search%20Engine&isFrbr=true&tab=61uq_all&query=any,contains,Frogs))

The RightNow pages features:

- Library styling on the page,
- Mega-menu to give users maximum possible information to answer questions
- The Library login button is hidden, because users might be logged into RightNow, and because CRM is a non-library domain, so Reusable login wont work!!
- The Ask Us button is shown because it links to the chat popup and other contact items.
- The LibCal 'chat opening hours' element is included throughout - RightNow does have an opening hours element, which can be seen at <https://support.my.uq.edu.au/app/library/showHours> (provided to let the WCT team check what RightNow is actually doing) but it isnt used publically as the formatting options are not to WCT's requirements. A Chat entry has been added to LibCal and the LibCal responsive layout has been adapted (duplicated) to give a sidebar Opening Hours display in RightNow. (LibCal is a Springshare product that lets our users manage our Opening Hours themselves)
- The default Rightnow Chat button has been removed from the sidebar because it cant be made to be on or offline to match library hours, as student services hours are longer. Should it ever be used again, the following applies: the chat button can be implemented in two ways: as a "[Syndicated Widget](https://support.my.uq.edu.au/ci/tags/syndicated_widgets)" which is written in javascript and unfortunately conflicts with other RightNow code on the page (it is intended to be used on third party pages) and as a "[Standard Widget](https://support.my.uq.edu.au/ci/admin/docs/widgets/standard)" which uses RightNow tag-based language. The Standard Widget is the correct version to use on RightNow pages; the Syndicated Widget could be used on other library pages, but we are using our chat-status button instead.

Header block found on Rightnow pages:

```html
<link type="image/x-icon" rel="shortcut icon" href="https://www.library.uq.edu.au/favicon.ico" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v15/fonts/Roboto/roboto.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css" />
<link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css" />
<link
  rel="stylesheet"
  href="https://assets.library.uq.edu.au/reusable-webcomponents/applications/rightnow/custom-styles.css"
/>
<script
  type="text/javascript"
  src="https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js"
  defer
></script>
<script src="https://assets.library.uq.edu.au/reusable-webcomponents/applications/rightnow/load.js" async></script>
```

Production is at <https://support.my.uq.edu.au/app/library/> eg [contact form](https://support.my.uq.edu.au/app/library/contact) and Staging is at <https://uqcurrent.crm.test.uq.edu.au/app/library/> eg [contact form](https://uqcurrent.crm.test.uq.edu.au/app/library/contact)

## Archived

The github repo at [oracle-rightnow](https://github.com/uqlibrary/oracle-rightnow) is a repository of templates and views _backing up_ code on the CRM servers for our pages at [https://support.my.uq.edu.au/](https://support.my.uq.edu.au/app/library/faqs) - changes are NOT made by updating github and pushing! Visit the oracle-rightnow repo for more details.

(This repo is probably so out of date by now as not to be useful - but possibly the readme could give insight if there are questions)

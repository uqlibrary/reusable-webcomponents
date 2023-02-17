const studentHubHomePageUrl = 'https://' + window.location.hostname + '/workgroups/library-staff-development';
// note: function isHomePage also hard codes this path

function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function createSlotForButtonInUtilityArea(button, id = null) {
    const slot = document.createElement('span');
    !!slot && slot.setAttribute('slot', 'site-utilities');
    !!slot && !!id && slot.setAttribute('id', id);
    !!button && !!slot && slot.appendChild(button);
    return slot;
}

function createAskusButton() {
    if (!!document.querySelector('askus-button')) {
        return false;
    }

    const askusButton = document.createElement('askus-button');
    const slot = !!askusButton && createSlotForButtonInUtilityArea(askusButton, 'askus');

    return slot;
}

function loadReusableComponentsStudenthub() {
    loadUQFavicon();
    // addAppleTouchIcon();

    addBreadcrumbs('#head');

    updateEventsLinkText();

    reformatSidebarDates();

    addSkipNavLandingPoint();

    //first element of the original document
    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    if (!document.querySelector('uq-gtm')) {
        const gtm = document.createElement('uq-gtm');
        !!gtm && gtm.setAttribute('gtm', 'GTM-PX9H7R');
        !!gtm && document.body.insertBefore(gtm, firstElement);
    }

    if (!document.querySelector('uq-header')) {
        const header = document.createElement('uq-header');
        header.setAttribute('hideLibraryMenuItem', '');
        header.setAttribute('skipnavid', 'sitenameanchor');
        !!header && document.body.insertBefore(header, firstElement);
    }

    if (!document.querySelector('uq-site-header')) {
        const siteHeader = document.createElement('uq-site-header');

        const askusButton = createAskusButton();
        !!askusButton && siteHeader.appendChild(askusButton);

        !!siteHeader && document.body.insertBefore(siteHeader, firstElement);
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && document.body.insertBefore(alerts, firstElement);
    }

    if (!document.querySelector('connect-footer')) {
        const connectFooter = document.createElement('connect-footer');
        document.body.appendChild(connectFooter);
    }

    if (!document.querySelector('uq-footer')) {
        const subFooter = document.createElement('uq-footer');
        !!subFooter && document.body.appendChild(subFooter);
    }
    // Proactive Chat button
    // if (!document.querySelector('proactive-chat')) {
    //     const proactiveChat = document.createElement('proactive-chat');
    //     !!proactiveChat && document.body.appendChild(proactiveChat);
    // }
}

function addSkipNavLandingPoint() {
    const pageHeading = document.querySelector('#sitename a');
    if (!pageHeading) {
        return;
    }
    const sitenameAnchor = document.createElement('a');
    if (!sitenameAnchor) {
        return;
    }
    sitenameAnchor.id = 'sitenameanchor';
    sitenameAnchor.href = '#';
    pageHeading.parentElement.insertBefore(sitenameAnchor, pageHeading);
}

function loadUQFavicon() {
    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '//www.library.uq.edu.au/favicon.ico';

    document.getElementsByTagName('head')[0].appendChild(link);

    //for IE
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
}

/**
 * Reformat date from DD-MMM-YYYY to styled elements
 */
function reformatSidebarDates() {
    const upcomingEvents = document.querySelectorAll('.upcomingEvents .body li');

    if (!upcomingEvents.length) {
        return;
    }

    upcomingEvents.forEach((event) => {
        const originalDate = event.querySelector('span.caption').innerHTML.replace(/(\s|\n)+/g, '-'); // this replace may not be needed now - they used to have some junk char in there
        if (originalDate) {
            const dateBits = originalDate.split('-');
            if (dateBits.length > 2) {
                //hide original date display
                event.querySelector('span.caption').className += ' hide';

                //create day element
                const dayElement = document.createElement('div');
                dayElement.className = 'day';
                dayElement.appendChild(document.createTextNode(dateBits[0]));

                //create month element
                const monthElement = document.createElement('div');
                monthElement.className = 'month';
                monthElement.appendChild(document.createTextNode(dateBits[1]));

                //add to event list item
                dateElement = document.createElement('div');
                dateElement.className = 'formatted-date';
                dateElement.appendChild(dayElement);
                dateElement.appendChild(monthElement);

                const eventLink = event.querySelector('a');
                event.insertBefore(dateElement, eventLink);
            }
        }
    });
}

/**
 * sadly, the Studenthub homepage runs from multiple urls, so a little function to check for it
 * @returns {boolean}
 */
function isHomePage() {
    const regexp = /https?:\/\/((www\.)?(careerhub|studenthub)\.uq\.edu\.au)\/workgroups\/library-staff-development\/?$/;
    return regexp.test(window.location.href);
}

/**
 * add breadcrumbs to the top of a Studenthub page
 * example usage: addBreadcrumbs('#head');
 *
 * @param parentElementIdentifier
 * @returns {boolean}
 */
function addBreadcrumbs(parentElementIdentifier) {
    const parentBlock = document.querySelector(parentElementIdentifier);
    if (parentBlock === null) {
        return false;
    }

    // create ol
    const breadcrumbList = document.createElement('ol');
    breadcrumbList.className = 'breadcrumbList';

    // create first breadcrumb entry: home page
    const hometext = document.createTextNode('Home');

    const anAnchor = document.createElement('a');
    anAnchor.href = 'https://www.library.uq.edu.au/';
    anAnchor.appendChild(hometext);

    let anLI = document.createElement('li');
    anLI.appendChild(anAnchor);
    breadcrumbList.appendChild(anLI);

    // create second breadcrumb entry: Studenthub workgroup homepage
    const linktext1 = 'Library ';
    const linktext2 = 'staff development';

    let childElement;
    let displayNode;

    anLI = document.createElement('li');
    anLI.className = 'staffdevhomepage';

    if (isHomePage()) {
        // spans required for css
        childElement = document.createElement('span');
    } else {
        childElement = document.createElement('a');
        childElement.href = studentHubHomePageUrl;
    }
    const displayNode1 = document.createTextNode(linktext1);
    const childElement1 = document.createElement('span');
    childElement1.appendChild(displayNode1);
    childElement.appendChild(childElement1);

    displayNode = document.createTextNode(linktext2);
    childElement.appendChild(displayNode);

    anLI.appendChild(childElement);
    breadcrumbList.appendChild(anLI);

    // On the Studenthub event page, event titles have a class of 'event_title'
    const testElement = document.querySelector('.event_title');

    // third breadcrumb
    const theLabel = 'Event list';
    displayNode = document.createTextNode(theLabel);
    if (testElement !== null) {
        // we are on an event page - make this a link
        childElement = document.createElement('a');
        childElement.href = studentHubHomePageUrl + '/events';
        childElement.appendChild(displayNode);

        anLI = document.createElement('li');
        anLI.appendChild(childElement);
        breadcrumbList.appendChild(anLI);
    } else {
        if (!isHomePage()) {
            childElement = document.createElement('span');
            childElement.appendChild(displayNode);

            anLI = document.createElement('li');
            anLI.appendChild(childElement);
            breadcrumbList.appendChild(anLI);

            // add class to body so we know its the list page
            newclassName = ' listpage';
            document.body.className += newclassName;
        }
    }

    // fourth breadcrumb
    if (testElement !== null) {
        // an event class means we are on a detail page

        // for desktop, display the event's title as an unlinked breadcrumb
        // for mobile, display 'event details' - some of the titles are long
        anLI = document.createElement('li');

        const mobileLabel = 'Event details';
        displayNode = document.createTextNode(mobileLabel);
        childElement = document.createElement('span');
        childElement.className = 'mobileOnly';
        childElement.appendChild(displayNode);
        anLI.appendChild(childElement);

        const textProperty = 'textContent' in document ? 'textContent' : 'innerText';
        const nonMobileLabel = testElement[textProperty];
        displayNode = document.createTextNode(nonMobileLabel);
        childElement = document.createElement('span');
        childElement.className = 'nonMobile';
        childElement.appendChild(displayNode);
        anLI.appendChild(childElement);

        breadcrumbList.appendChild(anLI);
    }

    parentBlock.insertBefore(breadcrumbList, parentBlock.firstChild);

    return true;
}

/**
 * find the specific link on the page and relabel it
 */
function updateEventsLinkText() {
    //select a link to more events from the sidebar (upcoming events)
    const moreEventsLink = document.querySelector('.sidebar .body a[href$="/events"]');
    if (moreEventsLink !== null) {
        // this has to be in all caps to make the nightwatch tests pass - Edge browser doesnt recognise a css transform
        moreEventsLink.innerHTML = 'MORE EVENTS';
    }
}

ready(loadReusableComponentsStudenthub);

const studentHubHomePageUrl = "https://" + window.location.hostname + "/workgroups/library-staff-development";
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

function loadReusableComponentsRightnow() {
    loadUQFavicon();
    // addAppleTouchIcon();

    const siteNameId = 'sitenameanchor';
    addSkipNavLandingPoint(siteNameId);

    //first element of the original document
    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    if (!document.querySelector('uq-gtm')) {
        const gtm = document.createElement('uq-gtm');
        !!gtm && document.body.insertBefore(gtm, firstElement);
    }

    if (!document.querySelector('uq-header')) {
        const header = document.createElement('uq-header');
        header.setAttribute("hideLibraryMenuItem", "");
        header.setAttribute("skipnavid", siteNameId);
        !!header && document.body.insertBefore(header, firstElement);
    }

    if (!document.querySelector('uq-site-header')) {
        const siteHeader = document.createElement('uq-site-header');
        !!siteHeader && siteHeader.setAttribute("showmenu", "");

        const askusButton = createAskusButton();
        !!askusButton && !!siteHeader && siteHeader.appendChild(askusButton);

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
}

function addSkipNavLandingPoint(siteNameId) {
    const pageHeading = document.querySelector('.page__title');
    if (!pageHeading) {
        return;
    }
    const sitenameAnchor = document.createElement('a');
    if (!sitenameAnchor) {
        return;
    }
    sitenameAnchor.id = siteNameId;
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
 * sadly, the Studenthub homepage runs from multiple urls, so a little function to check for it
 * @returns {boolean}
 */
function isHomePage() {
    const regexp = /https?:\/\/((www\.)?(careerhub|studenthub)\.uq\.edu\.au)\/workgroups\/library-staff-development\/?$/;
    return regexp.test(window.location.href);
}

ready(loadReusableComponentsRightnow);

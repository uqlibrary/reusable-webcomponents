function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function addSkipNavLandingPoint(skipnavid) {
    const firstContentElement = document.querySelector('#rn_ErrorLocation');

    const skiptohere = document.createElement('a');
    !!skiptohere && (skiptohere.id = skipnavid);
    !!skiptohere && skiptohere.setAttribute('data-analytics', 'skiptohere');
    !!skiptohere && (skiptohere.href = '#');

    !!firstContentElement &&
        !!skiptohere &&
        firstContentElement.parentElement.insertBefore(skiptohere, firstContentElement);
}

function createSlotForButtonInUtilityArea(button, id = null) {
    const slot = document.createElement('span');
    !!slot && slot.setAttribute('slot', 'site-utilities');
    !!slot && !!id && slot.setAttribute('id', id);
    !!button && !!slot && slot.appendChild(button);

    return slot;
}

function createAuthButton() {
    if (!!document.querySelector('auth-button')) {
        return false;
    }

    const authButton = document.createElement('auth-button');
    return !!authButton && createSlotForButtonInUtilityArea(authButton, 'auth');
}

function fontLoader(font) {
    var headID = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    headID.appendChild(link);
    link.href = font;
}

function loadReusableComponents() {
    fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    const skipnavid = 'skiptohere';
    addSkipNavLandingPoint(skipnavid);

    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    const gtm = document.createElement('uq-gtm');
    gtm.setAttribute('gtm', 'ABC123');
    document.body.insertBefore(gtm, firstElement);

    if (!document.querySelector('uq-header')) {
        const header = document.createElement('uq-header');
        !!header && header.setAttribute('hideLibraryMenuItem', '');
        !!header && header.setAttribute('skipnavid', skipnavid);
        !!header && document.body.insertBefore(header, firstElement);
    }

    if (!document.querySelector('uq-site-header')) {
        const siteHeader = document.createElement('uq-site-header');

        const authButton = createAuthButton();
        !!siteHeader && !!authButton && siteHeader.appendChild(authButton);

        !!siteHeader && document.body.insertBefore(siteHeader, firstElement);
    }
    // Proactive Chat button
    if (!document.querySelector('proactive-chat:not([display="inline"])')) {
        const proactiveChat = document.createElement('proactive-chat');
        !!proactiveChat && document.body.insertBefore(proactiveChat, firstElement);
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && document.body.insertBefore(alerts, firstElement);
    }

    // if (!document.querySelector('connect-footer')) {
    //     const connectFooter = document.createElement('connect-footer');
    //     !!connectFooter && document.body.appendChild(connectFooter);
    // }

    if (!document.querySelector('uq-footer')) {
        const subFooter = document.createElement('uq-footer');
        !!subFooter && document.body.appendChild(subFooter);
    }
}
function insertScript(url) {
    var script = document.querySelector("script[src*='" + url + "']");
    if (!script) {
        var heads = document.getElementsByTagName('head');
        if (heads && heads.length) {
            var head = heads[0];
            if (head) {
                script = document.createElement('script');
                script.setAttribute('src', url);
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('defer', '');
                head.appendChild(script);
            }
        }
    }
}
insertScript('http://localhost:8080/uq-lib-reusable.min.js');

ready(loadReusableComponents);

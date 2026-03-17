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
    !!skiptohere && skiptohere.setAttribute('data-analyticsid', 'skiptohere');
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

// example usage: insertFontFile('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
function insertFontFile(fontUrl) {
    const link = document.createElement('link');
    !!link && (link.type = 'text/css');
    !!link && (link.rel = 'stylesheet');
    !!link && (link.href = fontUrl);

    const headElement = document.querySelector('head');
    !!headElement && !!link && headElement.appendChild(link);
}

function loadReusableComponents() {
    insertFontFile('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    insertFontFile('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    insertFontFile('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    insertFontFile('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

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
function insertScript(url, defer = false) {
    const scriptfound = document.querySelector("script[src*='" + url + "']");
    if (!!scriptfound) {
        return;
    }
    const script = document.createElement('script');
    !!script && script.setAttribute('type', 'text/javascript');
    !!script && script.setAttribute('src', url);
    !!script && !!defer && script.setAttribute('defer', '');

    const headElement = document.querySelector('head');
    !!headElement && !!script && headElement.appendChild(script);
}
insertScript('http://localhost:8080/uq-lib-reusable.min.js');

ready(loadReusableComponents);

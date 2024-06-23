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

function createAuthButton() {
    if (!!document.querySelector('auth-button')) {
        return false;
    }

    const authButton = document.createElement('auth-button');
    return !!authButton && createSlotForButtonInUtilityArea(authButton, 'auth');
}

function createAskusButton() {
    if (!!document.querySelector('askus-button')) {
        return false;
    }

    const askusButton = document.createElement('askus-button');
    return !!askusButton && createSlotForButtonInUtilityArea(askusButton, 'askus');
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

    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    if (!document.querySelector('uq-gtm')) {
        const gtm = document.createElement('uq-gtm');
        !!gtm && gtm.setAttribute('gtm', 'GTM-NC7M38Q');
        !!gtm && document.body.insertBefore(gtm, firstElement);
    }

    if (!document.querySelector('uq-header')) {
        const header = document.createElement('uq-header');
        header.setAttribute('hideLibraryMenuItem', '');
        header.setAttribute('skipnavid', 'skiptohere');
        !!header && document.body.insertBefore(header, firstElement);
    }

    if (!document.querySelector('uq-site-header')) {
        const siteHeader = document.createElement('uq-site-header');

        const askusButton = createAskusButton();
        !!siteHeader && !!askusButton && siteHeader.appendChild(askusButton);

        const authButton = createAuthButton();
        !!siteHeader && !!authButton && siteHeader.appendChild(authButton);

        !!siteHeader && document.body.insertBefore(siteHeader, firstElement);
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && document.body.insertBefore(alerts, firstElement);
    }

    if (!document.querySelector('connect-footer')) {
        const connectFooter = document.createElement('connect-footer');
        !!connectFooter && document.body.appendChild(connectFooter);
    }

    if (!document.querySelector('uq-footer')) {
        const subFooter = document.createElement('uq-footer');
        !!subFooter && document.body.appendChild(subFooter);
    }
    // Proactive Chat button
    if (!document.querySelector('proactive-chat')) {
        const proactiveChat = document.createElement('proactive-chat');
        !!proactiveChat && document.body.appendChild(proactiveChat);
    }
}

ready(loadReusableComponents);

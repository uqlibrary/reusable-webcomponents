function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

let isOutsideUQ = true;

if (window.location.href.indexOf('uq.edu.au') > -1) {
    isOutsideUQ = false;
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
    const slot = !!authButton && createSlotForButtonInUtilityArea(authButton, 'auth');

    return slot;
}

function createElement(type, props) {
    var $e = document.createElement(type);
    for (var prop in props) {
        $e.setAttribute(prop, props[prop]);
    }
    return $e;
}

function fontLoader(font) {
    var headID = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    headID.appendChild(link);
    link.href = font;
}

function loadReusableComponentsLibGuides() {
    fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    const firstElement = document.body.children[0];

    const gtm = document.createElement('uq-gtm');
    !!gtm && gtm.setAttribute('gtm', 'GTM-NC7M38Q');
    document.body.insertBefore(gtm, firstElement);

    const header = document.createElement('uq-header');
    !!header && header.setAttribute('hidelibrarymenuitem', true);
    document.body.insertBefore(header, firstElement);

    const siteHeader = document.createElement('uq-site-header');
    siteHeader.setAttribute('skipnavid', 's-lc-public-main');

    if (!isOutsideUQ) {
        const authButton = createAuthButton();
        !!siteHeader && !!authButton && siteHeader.appendChild(authButton);
    }

    if (!document.querySelector('cultural-advice-popup')) {
        const culturalAdvice = document.createElement('cultural-advice-popup');
        !!culturalAdvice && document.body.appendChild(culturalAdvice);
    }

    document.body.insertBefore(siteHeader, firstElement);

    // Proactive Chat button
    if (!document.querySelector('proactive-chat')) {
        const proactiveChat = document.createElement('proactive-chat');
        !!proactiveChat && document.body.insertBefore(proactiveChat, firstElement);
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && document.body.insertBefore(alerts, firstElement);
    }

    // const connectFooter = document.createElement('connect-footer');
    // document.body.appendChild(connectFooter);

    const subFooter = document.createElement('uq-footer');
    document.body.appendChild(subFooter);
}

ready(loadReusableComponentsLibGuides);

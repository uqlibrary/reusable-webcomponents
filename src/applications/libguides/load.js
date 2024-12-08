function getSearchParam(name, value) {
    const url = window.location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get(name);
}

function ready(fn) {
    if (getSearchParam('override') === 'on' && getSearchParam('skipScript') === 'yes') {
        // to stop reusable being loaded, call it like this.
        // https://guides.library.uq.edu.au/?override=on&skipScript=yes
        // You can then manually load things in the console
        return;
    }
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

const isInEditMode = () => {
    if (window.location.hostname === 'localhost') {
        return false;
    }
    // guides is edited on springshare domain, with our looknfeel.
    // Don't include some elements - they are distracting to the admin
    if (window.location.href.includes('uq.edu.au')) {
        return false;
    }
    return true;
};

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

function createAskusButton() {
    if (!!document.querySelector('askus-button')) {
        return false;
    }

    const askusButton = document.createElement('askus-button');
    const slot = !!askusButton && createSlotForButtonInUtilityArea(askusButton, 'askus');

    return slot;
}

function fontLoader(font) {
    var headID = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    headID.appendChild(link);
    link.href = font;
}

function insertScript(url, defer = false) {
    const scriptfound = document.querySelector("script[src*='" + url + "']");
    if (!!scriptfound) {
        return;
    }
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    !!defer && script.setAttribute('defer', '');

    const head = document.head;
    console.log('insert script: ', url);
    !!head && head.appendChild(script);
}

function addCss(fileName) {
    const scriptfound = document.querySelector("link[href*='" + fileName + "']");
    if (!!scriptfound) {
        return;
    }

    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = fileName;

    console.log('insert css: ', link);
    const head = document.head;
    !!head && head.appendChild(link);
}

function loadReusableComponentsLibGuides() {
    fontLoader('https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700');
    fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    const script =
        window.location.hostname === 'localhost'
            ? '/uq-lib-reusable.min.js'
            : 'https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js';
    insertScript(script, true);
    addCss('https://assets.library.uq.edu.au/reusable-webcomponents/applications/libguides/custom-styles.css');

    const firstElement = document.body.children[0];

    const gtm = document.createElement('uq-gtm');
    !!gtm && gtm.setAttribute('gtm', 'GTM-NC7M38Q');
    document.body.insertBefore(gtm, firstElement);

    const header = document.createElement('uq-header');
    !!header && header.setAttribute('hideLibraryMenuItem', '');
    document.body.insertBefore(header, firstElement);

    const siteHeader = document.createElement('uq-site-header');

    if (!isInEditMode()) {
        const askusButton = createAskusButton();
        !!siteHeader && !!askusButton && siteHeader.appendChild(askusButton);

        const authButton = createAuthButton();
        !!siteHeader && !!authButton && siteHeader.appendChild(authButton);
    }

    if (!document.querySelector('cultural-advice-popup')) {
        const culturalAdvice = document.createElement('cultural-advice-popup');
        !!culturalAdvice && document.body.appendChild(culturalAdvice);
    }

    !!siteHeader && document.body.insertBefore(siteHeader, firstElement);

    // Proactive Chat button
    if (!isInEditMode()) {
        if (!document.querySelector('proactive-chat')) {
            const proactiveChat = document.createElement('proactive-chat');
            !!proactiveChat && document.body.insertBefore(proactiveChat, firstElement);
        }
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && document.body.insertBefore(alerts, firstElement);
    }

    const connectFooter = document.createElement('connect-footer');
    document.body.appendChild(connectFooter);

    const subFooter = document.createElement('uq-footer');
    document.body.appendChild(subFooter);
}

ready(loadReusableComponentsLibGuides);

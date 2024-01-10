const libraryProductionDomain = 'web.library.uq.edu.au';
const libraryStagingDomain = 'web-staging.library.uq.edu.au';
const libraryFeatureBranchName = 'drupal-staging';
const libraryAssetsRootLocation = 'https://assets.library.uq.edu.au/reusable-webcomponents';

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

// example usage: fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
function fontLoader(fontFileFullLink) {
    const headID = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    !!headID && headID.appendChild(link);
    link.href = fontFileFullLink;
}

function addCss(fileName) {
    const head = document.head;
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = fileName;

    head.appendChild(link);
}

// certain admin pages in drupal don't take the webcomponents because they interact badly
const libraryPagesWithoutComponents = [
    '/src/applications/drupal/pageWithoutComponents.html', // localhost test this concept
    '/ckfinder/browse',
    '/ckfinder/browse/images',
    '/ckfinder/browse/files',
];

function insertScript(url, defer = false) {
    const scriptfound = document.querySelector("script[src*='" + url + "']");
    if (!scriptfound) {
        const head = document.querySelector('head');
        if (head) {
            const script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', url);
            !!defer && script.setAttribute('defer', '');
            head.appendChild(script);
        }
    }
}

const stagingHosts = [libraryStagingDomain, 'dev-library-uq.pantheonsite.io'];
function isStagingSite() {
    return stagingHosts.includes(window.location.hostname);
}

function isValidDrupalHost() {
    const validHosts = [libraryProductionDomain, ...stagingHosts, 'localhost:8080'];
    return validHosts.includes(window.location.host);
}

function localScriptName(jsFilename) {
    if (window.location.host === 'localhost:8080') {
        return '/' + jsFilename;
    }
    let folder = '/'; // default. Use for prod.
    if (isStagingSite()) {
        folder = `-development/${libraryFeatureBranchName}/`;
    } else if (window.location.hostname === 'assets.library.uq.edu.au') {
        if (/reusable-webcomponents-staging/.test(window.location.href)) {
            folder = '-staging/';
        } else if (/reusable-webcomponents-development\/master/.test(window.location.href)) {
            folder = '-development/master/';
        } else {
            folder = `-development/${libraryFeatureBranchName}/`;
        }
    }
    return libraryAssetsRootLocation + folder + jsFilename;
}

function loadReusableComponentsDrupal() {
    insertScript(localScriptName('drupal-lib-reusable.min.js'), true);
    insertScript(localScriptName('uq-lib-reusable.min.js'), true);

    fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    if (isValidDrupalHost() && libraryPagesWithoutComponents.includes(window.location.pathname)) {
        return;
    }

    const stagingLocation = `-development/${libraryFeatureBranchName}`;
    const cssFile =
        libraryAssetsRootLocation + (isStagingSite() ? stagingLocation : '') + '/applications/drupal/custom-styles.css';
    addCss(cssFile);

    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    // gtm is inserted by drupal

    // uq-header is done manually by drupal

    if (!document.querySelector('uq-site-header')) {
        const librarySiteHeader = document.createElement('uq-site-header');

        const askusButton = createAskusButton();
        !!librarySiteHeader && !!askusButton && librarySiteHeader.appendChild(askusButton);

        const authButton = createAuthButton();
        !!librarySiteHeader && !!authButton && librarySiteHeader.appendChild(authButton);

        const replaceableUqHeader = document.querySelector('.uq-site-header');
        if (!!replaceableUqHeader) {
            !!librarySiteHeader && replaceableUqHeader.parentNode.replaceChild(librarySiteHeader, replaceableUqHeader);
        } else {
            // if drupal have changed the markup insert the element _somewhere_ anyway
            !!librarySiteHeader && document.body.insertBefore(librarySiteHeader, firstElement);
        }
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && alerts.setAttribute('system', 'drupal');
        const librarySiteHeader = document.querySelector('uq-site-header');
        const globalAlerts = document.querySelector('.uq-alerts-global-container');
        const pageHeader = document.querySelector('header');
        if (!!librarySiteHeader) {
            !!alerts && librarySiteHeader.parentNode.insertBefore(alerts, librarySiteHeader.nextSibling);
            // if drupal have changed the markup insert the element _somewhere_ anyway
        } else if (!!globalAlerts) {
            globalAlerts.parentNode.insertBefore(alerts, globalAlerts.nextSibling);
        } else if (!!pageHeader) {
            !!alerts && pageHeader.insertBefore(alerts, pageHeader.firstChild);
        } else {
            !!alerts && document.body.insertBefore(alerts, firstElement);
        }
    }

    const uqFooter = document.querySelector('footer.uq-footer');
    if (!document.querySelector('connect-footer')) {
        const connectFooter = document.createElement('connect-footer');
        if (!!uqFooter) {
            !!connectFooter && uqFooter.parentNode.insertBefore(connectFooter, uqFooter);
        } else {
            // if drupal have changed the markup insert the element _somewhere_ anyway
            !!connectFooter && document.body.appendChild(connectFooter);
        }
    }
    if (!document.querySelector('cultural-advice-popup')) {
        const culturalAdvice = document.createElement('cultural-advice-popup');
        if (!!uqFooter) {
            !!culturalAdvice && uqFooter.parentNode.insertBefore(culturalAdvice, uqFooter);
        } else {
            // if drupal have changed the markup insert the element _somewhere_ anyway
            !!culturalAdvice && document.body.appendChild(culturalAdvice);
        }
    }

    // uq-footer is done manually by drupal

    // Proactive Chat button
    if (!document.querySelector('proactive-chat')) {
        const proactiveChat = document.createElement('proactive-chat');
        !!proactiveChat && document.body.appendChild(proactiveChat);
    }
}

ready(loadReusableComponentsDrupal);

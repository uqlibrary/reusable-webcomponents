const featureBranchName = 'drupal-staging';

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

function addCss(fileName) {
    var head = document.head,
        link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = fileName;

    head.appendChild(link);
}

// certain admin pages in drupal dont take the webcomponents because they interact badly
const drupalHosts = ['web.library.uq.edu.au', 'library.stage.drupal.uq.edu.au', 'localhost:8080'];
const pagesWithoutComponents = [
    '/src/applications/drupal/pageWithoutComponents.html', // localhost
    '/ckfinder/browse',
    '/ckfinder/browse/images',
    '/ckfinder/browse/files',
];

function insertScript(url, defer = false) {
    const scriptfound = document.querySelector("script[src*='" + url + "']");
    if (!scriptfound) {
        const heads = document.getElementsByTagName('head');
        if (heads && heads.length) {
            const head = heads[0];
            if (head) {
                const script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', url);
                !!defer && script.setAttribute('defer', '');
                head.appendChild(script);
            }
        }
    }
}

function localScriptName() {
    const drupaljs = 'drupal-lib-reusable.min.js';
    if (window.location.host === 'localhost:8080') {
        return '/' + drupaljs;
    }
    var folder = '/'; // default. Use for prod.
    if (window.location.hostname === 'library.stage.drupal.uq.edu.au') {
        folder = `-development/${featureBranchName}/`;
    } else if (window.location.hostname === 'assets.library.uq.edu.au') {
        if (/reusable-webcomponents-staging/.test(window.location.href)) {
            folder = '-staging/';
        } else if (/reusable-webcomponents-development\/master/.test(window.location.href)) {
            folder = '-development/master/';
        } else {
            folder = `-development/${featureBranchName}/`;
        }
    }
    return 'https://assets.library.uq.edu.au/reusable-webcomponents' + folder + drupaljs;
}

function loadReusableComponentsDrupal() {
    insertScript(localScriptName(), true);

    fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    if (drupalHosts.includes(window.location.host) && pagesWithoutComponents.includes(window.location.pathname)) {
        return;
    }

    const stagingLocation = `-development/${featureBranchName}`;
    const cssFile =
        '//assets.library.uq.edu.au/reusable-webcomponents' +
        (window.location.host === 'library.stage.drupal.uq.edu.au' ? stagingLocation : '') +
        '/applications/drupal/custom-styles.css';
    addCss(cssFile);

    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    // gtm is inserted by drupal

    // if (!document.querySelector('uq-header')) {
    //     const header = document.createElement('uq-header');
    //     !!header && header.setAttribute('hideLibraryMenuItem', '');
    //     // no 'skip to content' as drupal provides a 'skip to menu' on first click
    //     !!header && document.body.insertBefore(header, firstElement);
    // }

    if (!document.querySelector('uq-site-header')) {
        const siteHeader = document.createElement('uq-site-header');
        // !!siteHeader && siteHeader.setAttribute('showmenu', '');

        const askusButton = createAskusButton();
        !!siteHeader && !!askusButton && siteHeader.appendChild(askusButton);

        const authButton = createAuthButton();
        !!siteHeader && !!authButton && siteHeader.appendChild(authButton);

        !!siteHeader && document.body.insertBefore(siteHeader, firstElement);
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && alerts.setAttribute('system', 'drupal');
        !!alerts && document.body.insertBefore(alerts, firstElement);
    }

    if (!document.querySelector('connect-footer')) {
        const connectFooter = document.createElement('connect-footer');
        !!connectFooter && document.body.appendChild(connectFooter);
    }
    // cultural advice popup
    if (!document.querySelector('cultural-advice-popup')) {
        const culturalAdvice = document.createElement('cultural-advice-popup');
        !!culturalAdvice && document.body.appendChild(culturalAdvice);
    }

    // if (!document.querySelector('uq-footer')) {
    //     const subFooter = document.createElement('uq-footer');
    //     !!subFooter && document.body.appendChild(subFooter);
    // }

    // Proactive Chat button
    if (!document.querySelector('proactive-chat')) {
        const proactiveChat = document.createElement('proactive-chat');
        !!proactiveChat && document.body.appendChild(proactiveChat);
    }
}

ready(loadReusableComponentsDrupal);

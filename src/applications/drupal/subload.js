function getValueLocal(param) {
    // don't set global constants, it makes it hard to run the script manually
    const lookup = {
        libraryFeatureBranchName: 'drupal-staging',
        libraryAssetsRootLocation: 'https://assets.library.uq.edu.au/reusable-webcomponents',
        libraryProductionDomain: 'web.library.uq.edu.au',
        libraryStagingDomain: 'web-staging.library.uq.edu.au',
        library2024DevDomain: 'web-live.library.uq.edu.au',
    };

    return lookup[param] || '';
}

// certain admin pages in drupal don't take the webcomponents because they interact badly
const libraryPagesWithoutComponents = [
    '/src/applications/drupal/pageWithoutComponents.html', // localhost test this concept
    '/ckfinder/browse',
    '/ckfinder/browse/images',
    '/ckfinder/browse/files',
];

function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function addUtilityButtonsToSiteHeader() {
    // find the existing breadcrumbs holder and setup so the breadcrumb sit left and our buttons will sit right
    const breadcrumbWrapper = document.querySelector('.uq-breadcrumb');
    // create a wrapper to sit at the right
    const uqSiteHeaderRight = document.createElement('div');
    !!uqSiteHeaderRight && uqSiteHeaderRight.classList.add('uq-site-header__title-container__right');
    !!breadcrumbWrapper && !!uqSiteHeaderRight && breadcrumbWrapper.appendChild(uqSiteHeaderRight);

    let authButton = document.querySelector('auth-button');
    if (!authButton) {
        authButton = document.createElement('auth-button');
        !!uqSiteHeaderRight && !!authButton && uqSiteHeaderRight.appendChild(authButton);
    }
}

// example usage: loadFontFile('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
function loadFontFile(fontFileFullLink) {
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

function isITSExternalHosting() {
    return window.location.hostname.endsWith('-library-uq.pantheonsite.io');
}

function isStagingSite() {
    const validHosts = [getValueLocal('libraryStagingDomain'), getValueLocal('library2024DevDomain')];
    return validHosts.includes(window.location.host) || isITSExternalHosting();
}

function isValidDrupalHost() {
    const validHosts = [
        getValueLocal('libraryProductionDomain'),
        getValueLocal('libraryStagingDomain'),
        getValueLocal('library2024DevDomain'),
        'localhost:8080',
    ];
    return validHosts.includes(window.location.host) || isITSExternalHosting();
}

function getScriptUrl(jsFilename) {
    if (window.location.host === 'localhost:8080') {
        return 'http://localhost:8080/' + jsFilename;
    }
    let folder = '/'; // default. Use for prod.
    if (isStagingSite()) {
        folder = `-development/${getValueLocal('libraryFeatureBranchName')}/`;
    } else if (window.location.hostname === 'assets.library.uq.edu.au') {
        if (/reusable-webcomponents-staging/.test(window.location.href)) {
            folder = '-staging/';
        } else if (/reusable-webcomponents-development\/master/.test(window.location.href)) {
            folder = '-development/master/';
        } else {
            folder = `-development/${getValueLocal('libraryFeatureBranchName')}/`;
        }
    }
    return getValueLocal('libraryAssetsRootLocation') + folder + jsFilename;
}

function addCulturalAdviceToSite() {
    const targetElement = document.getElementById('block-uq-standard-theme-breadcrumbs');
    if (!targetElement) return;

    if (!document.querySelector('cultural-advice')) {
        const culturalAdvice = document.createElement('cultural-advice');
        !!culturalAdvice && targetElement.parentNode.insertBefore(culturalAdvice, targetElement.nextSibling);
    }
}

function loadReusableComponentsDrupal() {
    insertScript(getScriptUrl('drupal-lib-reusable.min.js'), true);
    insertScript(getScriptUrl('uq-lib-reusable.min.js'), true);

    loadFontFile('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    loadFontFile('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    loadFontFile('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    loadFontFile('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    if (isValidDrupalHost() && libraryPagesWithoutComponents.includes(window.location.pathname)) {
        return;
    }

    const stagingLocation = `-development/${getValueLocal('libraryFeatureBranchName')}`;
    const cssFile =
        getValueLocal('libraryAssetsRootLocation') +
        (isStagingSite() ? stagingLocation : '') +
        '/applications/drupal/custom-styles.css';
    addCss(cssFile);

    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    // gtm is inserted by drupal

    // uq-header is done manually by drupal

    addCulturalAdviceToSite();

    addUtilityButtonsToSiteHeader();

    // Proactive Chat button
    if (!document.querySelector('proactive-chat')) {
        const proactiveChat = document.createElement('proactive-chat');
        !!proactiveChat && document.body.insertBefore(proactiveChat, firstElement);
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

    // uq-footer is done manually by drupal
}

ready(loadReusableComponentsDrupal);

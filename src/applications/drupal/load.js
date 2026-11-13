const libraryProductionDomain = 'web.library.uq.edu.au';
const libraryStagingDomain = 'web-staging.library.uq.edu.au';
const library2024DevDomain = 'web-live.library.uq.edu.au';
const libraryFeatureBranchName = 'drupal-staging';
const libraryAssetsRootLocation = 'https://assets.library.uq.edu.au/reusable-webcomponents';

// certain admin pages in drupal don't take the webcomponents because they interact badly
const libraryPagesWithoutComponents = [
    '/src/applications/drupal/pageWithoutComponents.html', // localhost test this concept
    '/ckfinder/browse',
    '/ckfinder/browse/images',
    '/ckfinder/browse/files',
];

function ready(fn) {
    if (scriptSkipped()) {
        return;
    }
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function scriptSkipped() {
    const url = window.location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get('skipScript') === 'yes';
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

// example usage: insertFontFile('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
function insertFontFile(fontUrl) {
    const link = document.createElement('link');
    !!link && (link.type = 'text/css');
    !!link && (link.rel = 'stylesheet');
    !!link && (link.href = fontUrl);

    const headElement = document.querySelector('head');
    !!headElement && !!link && headElement.appendChild(link);
}

function insertCssFile(cssFileName) {
    const includeFound = document.querySelector("link[href*='" + cssFileName + "']");
    if (!!includeFound) {
        return;
    }

    const link = document.createElement('link');
    !!link && (link.type = 'text/css');
    !!link && (link.rel = 'stylesheet');
    !!link && (link.href = cssFileName);

    const headElement = document.head;
    !!headElement && !!link && headElement.appendChild(link);
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

function isITSExternalHosting() {
    return window.location.hostname.endsWith('-library-uq.pantheonsite.io');
}

function isStagingSite() {
    const validHosts = [libraryStagingDomain, library2024DevDomain];
    return validHosts.includes(window.location.host) || isITSExternalHosting();
}

function isValidDrupalHost() {
    const validHosts = [libraryProductionDomain, libraryStagingDomain, library2024DevDomain, 'localhost:8080'];
    return validHosts.includes(window.location.host) || isITSExternalHosting();
}

function getScriptPath(jsFilename) {
    if (window.location.host === 'localhost:8080') {
        return 'http://localhost:8080/' + jsFilename;
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
    } else if (window.location.hostname === 'web-staging.library.uq.edu.au') {
        folder = `-development/drupal-staging/`;
    }
    return libraryAssetsRootLocation + folder + jsFilename;
}

function addCulturalAdviceToSite() {
    const targetElement = document.getElementById('block-uq-standard-theme-breadcrumbs');
    if (!targetElement) return;

    if (!document.querySelector('cultural-advice')) {
        const culturalAdvice = document.createElement('cultural-advice');
        !!culturalAdvice && targetElement.parentNode.insertBefore(culturalAdvice, targetElement.nextSibling);
    }
}

function addProactiveChatToSite(firstElement) {
    if (!document.querySelector('proactive-chat:not([display="inline"])')) {
        const proactiveChat = document.createElement('proactive-chat');
        !!proactiveChat && document.body.insertBefore(proactiveChat, firstElement);
    }
}

function addAlertsToSite(firstElement) {
    const targetElement = document.getElementById('block-uq-standard-theme-breadcrumbs');
    if (!targetElement) return;

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && alerts.setAttribute('system', 'drupal');

        !!alerts && targetElement.parentNode.insertBefore(alerts, targetElement.nextSibling);
    }
}

function loadReusableComponentsDrupal() {
    insertScript(getScriptPath('drupal-lib-reusable.min.js'), true);
    insertScript(getScriptPath('uq-lib-reusable.min.js'), true);

    insertFontFile('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    insertFontFile('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    insertFontFile('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    insertFontFile('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    if (isValidDrupalHost() && libraryPagesWithoutComponents.includes(window.location.pathname)) {
        return;
    }

    const stagingLocation = `-development/${libraryFeatureBranchName}`;
    const cssFile =
        libraryAssetsRootLocation + (isStagingSite() ? stagingLocation : '') + '/applications/drupal/custom-styles.css';
    insertCssFile(cssFile);

    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    // gtm is inserted by drupal

    // uq-header is done manually by drupal

    addCulturalAdviceToSite();

    addUtilityButtonsToSiteHeader();
    addProactiveChatToSite(firstElement);
    addAlertsToSite();

    // uq-footer is done manually by drupal
}

ready(loadReusableComponentsDrupal);

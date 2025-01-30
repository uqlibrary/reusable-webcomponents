/*
 * this file is included by load.js and can be pulled from different branches
 * some functions are defined in that file
 */
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

// example usage: insertFontFile('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
function insertFontFile(fontFileFullLink) {
    const headID = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    !!headID && headID.appendChild(link);
    link.href = fontFileFullLink;
}

function insertCssFile(fileName) {
    const head = document.head;
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = fileName;

    head.appendChild(link);
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

function addAlertsToSite() {
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

    if (isValidDrupalHost() && getValue('libraryPagesWithoutComponents').includes(window.location.pathname)) {
        return;
    }

    const stagingLocation = `-development/${getValue('libraryFeatureBranchName')}`;
    const cssFile =
        getValue('libraryAssetsRootLocation') +
        (isStagingSite() ? stagingLocation : '') +
        '/applications/drupal/custom-styles.css';
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

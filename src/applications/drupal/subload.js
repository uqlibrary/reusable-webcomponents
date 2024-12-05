/*
 * this file is included by load.js and can be pulled from different branches
 * some functions are defined in that file
 */
function getValueLocal(param) {
    // don't set global constants, it makes it hard to run the script manually
    const lookup = {
        libraryFeatureBranchName: 'drupal-staging',
        libraryAssetsRootLocation: 'https://assets.library.uq.edu.au/reusable-webcomponents',
        // certain admin pages in drupal don't take the webcomponents because they interact badly
        libraryPagesWithoutComponents: [
            '/src/applications/drupal/pageWithoutComponents.html', // localhost test this concept
            '/ckfinder/browse',
            '/ckfinder/browse/images',
            '/ckfinder/browse/files',
        ],
    };

    return lookup[param] || '';
}

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

function loadReusableComponentsDrupal() {
    insertScript(getScriptUrl('drupal-lib-reusable.min.js'), true);
    insertScript(getScriptUrl('uq-lib-reusable.min.js'), true);

    insertFontFile('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    insertFontFile('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    insertFontFile('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    insertFontFile('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    if (isValidDrupalHost() && getValueLocal('libraryPagesWithoutComponents').includes(window.location.pathname)) {
        return;
    }

    const stagingLocation = `-development/${getValueLocal('libraryFeatureBranchName')}`;
    const cssFile =
        getValueLocal('libraryAssetsRootLocation') +
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

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

function fontLoader(font) {
    var headID = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    headID.appendChild(link);
    link.href = font;
}

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

function loadGuidesComponents() {
    insertScript(getScriptUrl('uq-lib-reusable.min.js'), true);

    insertFontFile('https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700');

    const assetsRoot = 'https://assets.library.uq.edu.au';
    const cssLocation = '/applications/libguides/custom-styles.css';
    const cssFile = isStaging()
        ? assetsRoot + '/reusable-webcomponents-staging' + cssLocation
        : assetsRoot + '/reusable-webcomponents' + cssLocation;
    insertCssFile(cssFile);

    fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    const firstElement = document.body.children[0];

    const gtm = document.createElement('uq-gtm');
    !!gtm && gtm.setAttribute('gtm', 'GTM-NC7M38Q');
    document.body.insertBefore(gtm, firstElement);

    const header = document.createElement('uq-header');
    !!header && header.setAttribute('hideLibraryMenuItem', '');
    document.body.insertBefore(header, firstElement);

    const siteHeader = document.createElement('uq-site-header');
    !!siteHeader && siteHeader.setAttribute('secondleveltitle', 'Guides');
    !!siteHeader && siteHeader.setAttribute('secondlevelurl', 'https://guides.library.uq.edu.au/');

    if (!isInEditMode()) {
        const authButton = createAuthButton();
        !!siteHeader && !!authButton && siteHeader.appendChild(authButton);

        // get list of breadcrumbs from guides nav
        const breadcrumbNav = document.getElementById('s-lib-bc');
        console.log('breadcrumbNav=', breadcrumbNav);
        const listItems = !!breadcrumbNav && breadcrumbNav.querySelectorAll('ol li');
        const breadcrumbData = [];
        !!listItems &&
            listItems.forEach((item) => {
                const anchor = item.querySelector('a');
                const title = anchor ? anchor.textContent : item.textContent;
                const href = anchor ? anchor.href : null;
                if (
                    href !== 'https://www.library.uq.edu.au/' &&
                    href !== 'https://www.library.uq.edu.au' &&
                    href !== 'http://www.library.uq.edu.au/' &&
                    href !== 'http://www.library.uq.edu.au' &&
                    href !== 'https://guides.library.uq.edu.au/' &&
                    href !== 'https://guides.library.uq.edu.au'
                ) {
                    breadcrumbData.push({ title, href });
                }
            });

        const shadowRoot = siteHeader.shadowRoot;
        const breadcrumbParent = !!shadowRoot && shadowRoot.getElementById('breadcrumb_nav');
        !!breadcrumbParent &&
            breadcrumbData.length > 0 &&
            breadcrumbData.forEach((gb) => {
                const listItemEntry = !!gb.href
                    ? `<li class="uq-breadcrumb__item">
                <a class="uq-breadcrumb__link" href="${gb.href}">${gb.title}</a>
                </li>`
                    : `<li class="uq-breadcrumb__item">
                <span class="uq-breadcrumb__link">${gb.title}</span>
                </li>`;
                breadcrumbParent.insertAdjacentHTML('beforeend', listItemEntry);
            });
        !!breadcrumbNav && breadcrumbNav.remove();
    }

    document.body.insertBefore(siteHeader, firstElement);

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

    if (!document.querySelector('cultural-advice')) {
        const culturalAdvice = document.createElement('cultural-advice');
        const alerts = document.getElementsByTagName('alert-list');
        const alert = alerts[0];
        !!culturalAdvice && !!alert && alert.parentNode.insertBefore(culturalAdvice, alert.nextSibling);
    }

    const subFooter = document.createElement('uq-footer');
    document.body.appendChild(subFooter);
}

ready(loadGuidesComponents);

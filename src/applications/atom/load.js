function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function updateLogoLink() {
    const logoElement = document.getElementById('logo');
    !!logoElement && logoElement.setAttribute('href', 'https://www.uq.edu.au/');
}

// function fontLoader(font) {
//     var headID = document.getElementsByTagName('head')[0];
//     var link = document.createElement('link');
//     link.type = 'text/css';
//     link.rel = 'stylesheet';
//     headID.appendChild(link);
//     link.href = font;
// }

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

function createSlotForButtonInUtilityArea(button, id = null) {
    const slot = document.createElement('span');
    !!slot && slot.setAttribute('slot', 'site-utilities');
    !!slot && !!id && slot.setAttribute('id', id);
    !!button && !!slot && slot.appendChild(button);

    return slot;
}

function createAskusButton() {
    if (!!document.querySelector('askus-button')) {
        return false;
    }

    const askusButton = document.createElement('askus-button');
    return !!askusButton && createSlotForButtonInUtilityArea(askusButton, 'askus');
}

function moveBrowseButton() {
    const browseButton = document.getElementById('browse-menu');
    return !!browseButton && createSlotForButtonInUtilityArea(browseButton, 'browseButton');
}

function moveQuickLinks() {
    const quickLinksButton = document.getElementById('quick-links-menu');
    return !!quickLinksButton && createSlotForButtonInUtilityArea(quickLinksButton, 'quickLinksButton');
}

// function moveSearchBar(header) {
//     const uqSearchArea = header.querySelector('header.uq-header div.uq-header__search-toggle');
//     const uqSearchButton = header.querySelector('header.uq-header div.uq-header__search-toggle button');
//     const fryerSearchButton = document.querySelector('#top-bar #search-bar');
//
//     !!uqSearchButton && uqSearchButton.remove();
//     !!uqSearchArea && uqSearchArea.appendChild(fryerSearchButton);
// }

function loadReusableComponentsAtom() {
    insertScript('https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js', true);

    updateLogoLink();

    // fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    // fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    // fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    // fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    const firstElement = document.body.children[0];

    const header = document.createElement('uq-header');
    !!header && header.setAttribute('hideLibraryMenuItem', '');
    // moveSearchBar(header);
    document.body.insertBefore(header, firstElement);

    const siteHeader = document.createElement('uq-site-header');
    const siteTitle =
        window.location.hostname === 'manuscripts.library.uq.edu.au'
            ? 'Fryer Library Manuscripts'
            : 'localhost'
            ? 'Fryer Library DEV'
            : 'Fryer Library SANDBOX';
    !!siteHeader && siteHeader.setAttribute('sitetitle', siteTitle);
    !!siteHeader && siteHeader.setAttribute('siteurl', 'https://manuscripts.library.uq.edu.au/');
    const askusButton = createAskusButton();
    !!siteHeader && !!askusButton && siteHeader.appendChild(askusButton);
    const browseButton = moveBrowseButton();
    !!siteHeader && !!browseButton && siteHeader.appendChild(browseButton);
    const quickLinksButton = moveQuickLinks();
    !!siteHeader && !!quickLinksButton && siteHeader.appendChild(quickLinksButton);
    if (!document.querySelector('cultural-advice-popup')) {
        const culturalAdvice = document.createElement('cultural-advice-popup');
        !!culturalAdvice && document.body.appendChild(culturalAdvice);
    }
    document.body.insertBefore(siteHeader, firstElement);
}

ready(loadReusableComponentsAtom);

function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// function updateLogoLink() {
//     const logoElement = document.getElementById('logo');
//     !!logoElement && logoElement.setAttribute('href', 'https://www.uq.edu.au/');
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

function addUqHeader() {
    // add UQ Header and move search bar into it
    const header = document.createElement('uq-header');
    !!header && header.setAttribute('hideLibraryMenuItem', '');
    !!header && header.setAttribute('hideUqSearch', '');

    const slot = document.createElement('span');
    !!slot && slot.setAttribute('slot', 'header-extras');
    !!slot && slot.setAttribute('id', 'atomSearch');

    // we find the existing atom search, then we find the slot we provided the attribute for above, then we stick a in b
    const fryerSearchButton = document.querySelector('#top-bar #search-bar');
    !!fryerSearchButton && !!slot && slot.appendChild(fryerSearchButton);
    !!slot && !!header && header.appendChild(slot);

    document.body.insertBefore(header, firstElement);
}

function addUqSiteheader(firstElement) {
    // add UQ Site Header, then move various atom elements into it
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

function loadReusableComponentsAtom() {
    // const scriptLink = 'https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js';
    const scriptLink = '/uq-lib-reusable.min.js';
    insertScript(scriptLink, true);

    const firstElement = document.body.children[0];
    addUqHeader(firstElement);
    addUqSiteheader(firstElement);

    // then remove the supplied atom header block
    const existingAtomHeader = document.getElementById('top-bar');
    !!existingAtomHeader && existingAtomHeader.remove();

    // updateLogoLink();
}

ready(loadReusableComponentsAtom);

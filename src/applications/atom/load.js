function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

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

function createSlotForButtonInUtilityArea(button, id, slotName = 'site-utilities') {
    const slot = document.createElement('span');
    !!slot && slot.setAttribute('slot', slotName);
    !!slot && !!id && slot.setAttribute('id', id);
    !!button && !!slot && slot.appendChild(button);

    return slot;
}

// function createAskusButton() {
//     const askusButton = document.createElement('askus-button');
//     const slot = !!askusButton && createSlotForButtonInUtilityArea(askusButton, 'askus');
//     !!siteHeader && !!slot && siteHeader.appendChild(slot);
// }

function moveBrowseButton(siteHeader) {
    const browseButton = document.getElementById('browse-menu');
    const slot = !!browseButton && createSlotForButtonInUtilityArea(browseButton, 'browseButton');
    !!siteHeader && !!slot && siteHeader.appendChild(slot);
}

function moveQuickLinks(siteHeader) {
    const quickLinksButton = document.getElementById('quick-links-menu');
    const slot = !!quickLinksButton && createSlotForButtonInUtilityArea(quickLinksButton, 'quickLinksButton');
    !!siteHeader && !!slot && siteHeader.appendChild(slot);
}

function moveAtomSearch(header) {
    // move the existing atom search into the UQ Header
    const fryerSearchButton = document.querySelector('#top-bar #search-bar');
    const slot =
        !!fryerSearchButton && createSlotForButtonInUtilityArea(fryerSearchButton, 'atomSearch', 'header-extras');
    !!fryerSearchButton && !!slot && slot.appendChild(fryerSearchButton);
    !!slot && !!header && header.appendChild(slot);
}

function addUqHeader(firstElement) {
    // add UQ Header and move search bar into it
    const header = document.createElement('uq-header');
    !!header && header.setAttribute('hideLibraryMenuItem', '');
    !!header && header.setAttribute('hideUqSearch', '');

    moveAtomSearch(header);

    document.body.insertBefore(header, firstElement);
}

function addCulturalAdvicePopup() {
    if (!document.querySelector('cultural-advice-popup')) {
        const culturalAdvice = document.createElement('cultural-advice-popup');
        !!culturalAdvice && document.body.appendChild(culturalAdvice);
    }
}

function addUqSiteheader(firstElement) {
    // add UQ Site Header, then move various atom elements into it
    const siteHeader = document.createElement('uq-site-header');
    const siteTitle =
        window.location.hostname === 'manuscripts.library.uq.edu.au'
            ? 'Fryer Library Manuscripts'
            : window.location.hostname === 'localhost'
            ? 'Fryer Library DEV'
            : 'Fryer Library SANDBOX'; // more?
    !!siteHeader && siteHeader.setAttribute('sitetitle', siteTitle);
    !!siteHeader && siteHeader.setAttribute('siteurl', 'https://manuscripts.library.uq.edu.au/');

    // askus button not required? TBC
    // createAskusButton();

    moveBrowseButton(siteHeader);

    moveQuickLinks(siteHeader);

    addCulturalAdvicePopup();

    // no proactive chat

    document.body.insertBefore(siteHeader, firstElement);
}

function loadReusableComponentsAtom() {
    let scriptLink = '/uq-lib-reusable.min.js';
    if (window.location.hostname !== 'localhost') {
        scriptLink = `https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js`;
    }
    insertScript(scriptLink, true);

    const firstElement = document.body.children[0];
    addUqHeader(firstElement);
    addUqSiteheader(firstElement);

    // then remove the supplied atom header block
    const existingAtomHeader = document.getElementById('top-bar');
    !!existingAtomHeader && existingAtomHeader.remove();
}

ready(loadReusableComponentsAtom);

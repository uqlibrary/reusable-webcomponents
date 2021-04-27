// remove the older header-footer tags immediately (they will load old content on the pages with old widgets, eg training)
// this wont be required once the old tags are replaced
const removeOldMinimalHeader = setInterval(() => {
    const element = document.querySelector('uq-minimal-header');
    if (!!element) {
        element.remove();
        clearInterval(removeOldMinimalHeader);
    }
}, 50);
const removeOldMenu = setInterval(() => {
    const element = document.querySelector('uql-menu');
    if (!!element) {
        element.remove();
        clearInterval(removeOldMenu);
    }
}, 50);
const removeOldConnectFooter = setInterval(() => {
    const element = document.querySelector('uql-connect-footer');
    if (!!element) {
        element.remove();
        clearInterval(removeOldConnectFooter);
    }
}, 50);
const removeOldMinimalFooter = setInterval(() => {
    const element = document.querySelector('uq-minimal-footer');
    if (!!element) {
        element.remove();
        clearInterval(removeOldMinimalFooter);
    }
}, 50);

function ready(fn) {
    if (document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function createSlotForButtonInUtilityArea(button, id=null) {
    const slot = document.createElement('span');
    !!slot && slot.setAttribute('slot', 'site-utilities');
    !!slot && !!id && slot.setAttribute('id', id);
    !!button && !!slot && slot.appendChild(button);

    return slot;
}

function createMylibraryStub() {
    const stubId = 'mylibrarystub'; // match mylibraryLocale.MYLIBRARY_STUB_ID
    if (!!document.getElementById(stubId)) {
        return false;
    }

    const mylibraryButtonId = 'mylibrarybutton'; // match mylibraryLocale.MYLIBRARY_BUTTON_ID
    if (!!document.getElementById(mylibraryButtonId)) {
        return false;
    }

    // this just creates a stub - authbutton will insert the actual button if they are logged in when this stub is present
    mylibraryButton = document.createElement('div');
    mylibraryButton.id = stubId;

    return !!mylibraryButton && this.createSlotForButtonInUtilityArea(mylibraryButton, mylibraryButtonId);
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

function loadReusableComponentsDrupal() {
    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    if (!document.querySelector('uq-gtm')) {
        const gtm = document.createElement('uq-gtm');
        !!gtm && document.body.insertBefore(gtm, firstElement);
    }

    if (!document.querySelector('uq-header')) {
        const header = document.createElement('uq-header');
        !!header && header.setAttribute("hideLibraryMenuItem", "");
        // no 'skip to content' as drupal provides a 'skip to menu' on first click
        !!header && document.body.insertBefore(header, firstElement);
    }

    if (!document.querySelector('uq-site-header')) {
        const siteHeader = document.createElement('uq-site-header');
        !!siteHeader && siteHeader.setAttribute("showmenu", "");
        !!siteHeader && siteHeader.setAttribute("sitetitle", "thingy");
        !!siteHeader && siteHeader.setAttribute("siteurl", "http://example.com");

        const askusButton = createAskusButton();
        !!siteHeader && !!askusButton && siteHeader.appendChild(askusButton);

        const mylibraryStub = createMylibraryStub();
        !!siteHeader && !!mylibraryStub && siteHeader.appendChild(mylibraryStub);

        const authButton = createAuthButton();
        !!siteHeader && !!authButton && siteHeader.appendChild(authButton);

        !!siteHeader && document.body.insertBefore(siteHeader, firstElement);
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && document.body.insertBefore(alerts, firstElement);
    }

    if (!document.querySelector('connect-footer')) {
        const connectFooter = document.createElement('connect-footer');
        !!connectFooter && document.body.appendChild(connectFooter);
    }

    if (!document.querySelector('uq-footer')) {
        const subFooter = document.createElement('uq-footer');
        !!subFooter && document.body.appendChild(subFooter);
    }
}

ready(loadReusableComponentsDrupal);
function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function addSkipNavLandingPoint(skipnavid) {
    const firstContentElement = document.querySelector('#rn_ErrorLocation');

    const skiptohere = document.createElement('a');
    !!skiptohere && (skiptohere.id = skipnavid);
    !!skiptohere && (skiptohere.href = '#');

    !!firstContentElement &&
        !!skiptohere &&
        firstContentElement.parentElement.insertBefore(skiptohere, firstContentElement);
}

function createSlotForButtonInUtilityArea(button, id = null) {
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

function loadReusableComponents() {
    const skipnavid = 'skiptohere';
    addSkipNavLandingPoint(skipnavid);

    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    const gtm = document.createElement('uq-gtm');
    gtm.setAttribute('gtm', 'ABC123');
    document.body.insertBefore(gtm, firstElement);

    if (!document.querySelector('uq-header')) {
        const header = document.createElement('uq-header');
        !!header && header.setAttribute('hideLibraryMenuItem', '');
        !!header && header.setAttribute('skipnavid', skipnavid);
        !!header && document.body.insertBefore(header, firstElement);
    }

    if (!document.querySelector('uq-site-header')) {
        const siteHeader = document.createElement('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('showmenu', '');

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
function insertScript(url) {
    var script = document.querySelector("script[src*='" + url + "']");
    if (!script) {
        var heads = document.getElementsByTagName('head');
        if (heads && heads.length) {
            var head = heads[0];
            if (head) {
                script = document.createElement('script');
                script.setAttribute('src', url);
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('defer', '');
                head.appendChild(script);
            }
        }
    }
}
insertScript('http://localhost:8080/uq-lib-reusable.min.js');

ready(loadReusableComponents);

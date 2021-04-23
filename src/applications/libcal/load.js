function ready(fn) {
    if (document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

let isOutsideUQ = true;

if (window.location.href.indexOf("uq.edu.au") > -1) {
    isOutsideUQ = false;
}

console.log('Is libcal in edit mode?: ', isOutsideUQ);

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

    const slot = !!mylibraryButton && this.createSlotForButtonInUtilityArea(mylibraryButton, mylibraryButtonId);

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

function createAskusButton() {
    if (!!document.querySelector('askus-button')) {
        return false;
    }

    const askusButton = document.createElement('askus-button');
    const slot = !!askusButton && createSlotForButtonInUtilityArea(askusButton, 'askus');

    return slot;
}

function createElement(type, props) {
    var $e = document.createElement(type);
    for (var prop in props) {
        $e.setAttribute(prop, props[prop]);
    }
    return $e;
}

function loadReusableComponentsLibGuides() {
    const firstElement = document.body.children[0];

    const gtmElement = createElement('uq-gtm', {gtm: 'ABC123'});
    document.body.insertBefore(gtmElement, firstElement);

    const header = document.createElement('uq-header');
    document.body.insertBefore(header, firstElement);

    const siteHeader = document.createElement('uq-site-header');

    if (!isOutsideUQ) {
        const askusButton = createAskusButton();
        !!siteHeader && !!askusButton && siteHeader.appendChild(askusButton);

        const mylibraryStub = createMylibraryStub();
        !!siteHeader && !!mylibraryStub && siteHeader.appendChild(mylibraryStub);

        const authButton = createAuthButton();
        !!siteHeader && !!authButton && siteHeader.appendChild(authButton);
    }

    document.body.insertBefore(siteHeader, firstElement);

    const connectFooter = document.createElement('connect-footer');
    document.body.appendChild(connectFooter);

    const subFooter = document.createElement('uq-footer');
    document.body.appendChild(subFooter);
}

ready(loadReusableComponentsLibGuides);
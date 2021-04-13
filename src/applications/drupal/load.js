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
    console.log('createSlotForButtonInUtilityArea: button = ', button, ' (id = ', id, ')'); // #dev
    !!slot && !!id && slot.setAttribute('id', id);
    !!button && !!slot && slot.appendChild(button);

    // !!slot && !!siteHeader && siteHeader.appendChild(slot);
    return slot;
}

function createMylibraryStub() {
    const stubId = 'mylibrarystub'; // match mylibraryLocale.MYLIBRARY_STUB_ID
    if (!!document.getElementById(stubId)) {
        console.log('createMylibraryStub: stub found ');
        return false;
    }

    const mylibraryButtonId = 'mylibrarybutton'; // match mylibraryLocale.MYLIBRARY_BUTTON_ID
    if (!!document.getElementById(mylibraryButtonId)) {
        console.log('createMylibraryStub: slot found');
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

function loadReusableComponents() {
    const firstElement = document.body.children[0];

    if (!document.querySelector('uq-gtm')) {
        const header = document.createElement('uq-gtm');
        document.body.insertBefore(header, firstElement);
    }

    if (!document.querySelector('uq-header')) {
        const header = document.createElement('uq-header');
        header.setAttribute("hideLibraryMenuItem", "");
        document.body.insertBefore(header, firstElement);
    }

    if (!document.querySelector('uq-site-header')) {
        const slot = document.createElement('slot');
        !!slot && slot.setAttribute("name", "site-utilities");

        const siteHeader = document.createElement('uq-site-header');
        siteHeader.setAttribute("showmenu", "");
        siteHeader.appendChild(slot);
        console.log('siteHeader = ', siteHeader);

        const askusButton = createAskusButton();
        !!askusButton && siteHeader.appendChild(askusButton);

        const mylibraryButton = createMylibraryStub();
        !!mylibraryButton && siteHeader.appendChild(mylibraryButton);

        const authButton = createAuthButton();
        !!authButton && siteHeader.appendChild(authButton);

        document.body.insertBefore(siteHeader, firstElement);
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        document.body.insertBefore(alerts, firstElement);
    }

    if (!document.querySelector('connect-footer')) {
        const connectFooter = document.createElement('connect-footer');
        console.log('add connectFooter footer');
        document.body.appendChild(connectFooter);
    }

    if (!document.querySelector('uq-footer')) {
        const subFooter = document.createElement('uq-footer');
        console.log('add uq footer');
        document.body.appendChild(subFooter);
    }
}

ready(loadReusableComponents);
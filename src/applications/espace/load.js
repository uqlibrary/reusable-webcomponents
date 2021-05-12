/*
   We probably wont call espace with a load.js file - espace can manage its includes itself
   This is more useful to test the header properties of changing the label and search, as espace will need to do, for code coverage of the header
   or, if your like, demonstrating that the requirements of espace can be met
 */
function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

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

function loadReusableComponents() {
    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    const header = document.createElement('uq-header');
    !!header && header.setAttribute('hidelibrarymenuitem', true);
    !!header && header.setAttribute('searchlabel', 'eSpace');
    !!header && header.setAttribute('searchurl', 'https://espace.library.uq.edu.au/');
    !!header && document.body.insertBefore(header, firstElement);

    const siteHeader = document.createElement('uq-site-header');
    !!siteHeader && siteHeader.setAttribute('sitetitle', 'eSpace');
    !!siteHeader && siteHeader.setAttribute('siteurl', 'https://espace.library.uq.edu.au/');

    const authButton = createAuthButton();
    !!siteHeader && !!authButton && siteHeader.appendChild(authButton);

    document.body.insertBefore(siteHeader, firstElement);

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && document.body.insertBefore(alerts, firstElement);
    }
}

ready(loadReusableComponents);

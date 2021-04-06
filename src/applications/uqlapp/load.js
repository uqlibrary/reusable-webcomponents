function ready(fn) {
    if (document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function loadReusableComponents() {
    const firstElement = document.body.children[0];
    if (!document.querySelector('uq-gtm')) {
        const gtm = document.createElement('uq-gtm');
        gtm.setAttribute("gtm", "GTM-W4KK37");
        !!firstElement && !!header && document.body.insertBefore(gtm, firstElement);
    }

    if (!document.querySelector('uq-header')) {
        const header = document.createElement('uq-header');
        header.setAttribute("hideLibraryMenuItem", "");
        !!firstElement && !!header && document.body.insertBefore(header, firstElement);
    }

    if (!document.querySelector('uq-site-header')) {
        const slot = document.createElement('slot');
        !!slot && slot.setAttribute("name", "site-utilities");

        const siteHeader = document.createElement('uq-site-header');
        !!siteHeader && siteHeader.setAttribute("hideAskUs", "");
        !!siteHeader && siteHeader.setAttribute("hideMyLibrary", "");
        !!slot && !!siteHeader && siteHeader.appendChild(slot);
        !!firstElement && !!siteHeader && document.body.insertBefore(siteHeader, firstElement);
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!firstElement && !!alerts && document.body.insertBefore(alerts, firstElement);
    }

    if (!document.querySelector('connect-footer')) {
        const connectFooter = document.createElement('connect-footer');
        !!connectFooter && document.body.appendChild(connectFooter);
    }

    if (!document.querySelector('uq-footer')) {
        const subFooter = document.createElement('uq-footer');
        !!subFooter && document.body.appendChild(subFooter);
    }

    // the angular in app.library is unreliable in how it interacts with our webcomponent buttons.
    // sometimes we get none, sometimes we get a double set :(
    // let it do the header blocks, above, but control the button addition carefully
    const maxLoops = 20;
    let currentLoop = 0;
    function addRequiredButtons() {
        const addButtons = setInterval(() => {
            function addButtonToSlot(button) {
                const buttonWrapper = document.createElement('span');
                !!buttonWrapper && buttonWrapper.setAttribute('slot', 'site-utilities');
                !!button && !!buttonWrapper && buttonWrapper.appendChild(button);

                const uqSiteHeaderElement = document.querySelector('uq-site-header');
                !!buttonWrapper && !!uqSiteHeaderElement && uqSiteHeaderElement.appendChild(buttonWrapper);
            }

            async function isLoggedIn() {
                // give authbutton time to finish writing to storage
                const checkStorage = setInterval(() => {
                    clearInterval(checkStorage);
                    const account = JSON.parse(sessionStorage.getItem('userAccount'));
                    return !!account && !!account.id;
                }, 200);
            }

            function createAuthButton() {
                if (!document.querySelector('auth-button')) {
                    !!isLoggedIn() && createMylibraryButton();

                    const authButton = document.createElement('auth-button');
                    addButtonToSlot(authButton);
                }
            }

            function createMylibraryButton() {
                if (!document.querySelector('mylibrary-button')) {
                    const mylibraryButton = document.createElement('mylibrary-button');
                    addButtonToSlot(mylibraryButton);
                }
            }

            function createAskusButton() {
                if (!document.querySelector('askus-button')) {
                    const askusButton = document.createElement('askus-button');
                    addButtonToSlot(askusButton);
                }
            }

            if (!!document.querySelector('uq-site-header')) {
                createAskusButton();
                createAuthButton(mylibraryRequired);
            }

            const authButtonFound = document.querySelector('auth-button') || false;
            const askusButtonFound = document.querySelector('askus-button') || false;
            if (!!authButtonFound && !!askusButtonFound) {
                clearInterval(addButtons);
            }

            // setting the attribute doesnt seem to be takng off the menu item
            const uqheader = document.querySelector('uq-header') || false;
            const shadowDOM = (!!uqheader && uqheader.shadowRoot) || false;
            const libraryMenuItem = !!shadowDOM && shadowDOM.getElementById('menu-item-library');
            !!libraryMenuItem && libraryMenuItem.remove();

            // just in case something weird happens
            // we dont want it potentially making infinite API calls as it attempts to make each button
            if (currentLoop++ > maxLoops) {
                clearInterval(addButtons);
            }
        }, 300); // check for the elements periodically
    }
    addRequiredButtons();
}

ready(loadReusableComponents);
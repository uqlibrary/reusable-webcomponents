function ready(fn) {
    if (document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function loadReusableComponents() {
    const firstElement = document.body.children[0];

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
    function addRequiredButtons(mylibraryRequired = true) {
        const addButtons = setInterval(() => {
            function addButtonToSlot(button) {
                const uqSiteHeaderElement = document.querySelector('uq-site-header');
                const buttonWrapper = document.createElement('span');
                !!buttonWrapper && buttonWrapper.setAttribute('slot', 'site-utilities');
                !!button && !!buttonWrapper && buttonWrapper.appendChild(button);

                !!buttonWrapper && !!uqSiteHeaderElement && uqSiteHeaderElement.appendChild(buttonWrapper);
            }

            async function isLoggedIn() {
                // give authbutton time to finish writing to storage
                const checkStorage = setInterval(() => {
                    clearInterval(checkStorage);
                    const account = JSON.parse(sessionStorage.getItem('userAccount'));
                    let b = !!account && !!account.id;
                    console.log('logged in? ', b); // #dev
                    return b;
                }, 200);
            }

            function createAuthButton(mylibraryRequired = true) {
                const authButton0 = document.querySelector('auth-button') || false;
                if (!authButton0) {
                    console.log(' checking for mylibrary'); // #dev
                    !!mylibraryRequired && !!isLoggedIn() && createMylibraryButton();

                    const authButton = document.createElement('auth-button');
                    addButtonToSlot(authButton);
                }
            }

            function createMylibraryButton() {
                console.log('createMylibraryButton'); // #dev
                const mylibraryButton0 = document.querySelector('mylibrary-button') || false;
                if (!mylibraryButton0) {
                    const mylibraryButton = document.createElement('mylibrary-button');
                    addButtonToSlot(mylibraryButton);
                }
            }

            function createAskusButton() {
                const askusButton0 = document.querySelector('askus-button') || false;
                if (!askusButton0) {
                    const askusButton = document.createElement('askus-button');
                    addButtonToSlot(askusButton);
                }
            }

            const uqsiteheader = document.querySelector('uq-site-header') || false;
            if (!!uqsiteheader) {
                const askusButton0 = document.querySelector('askus-button') || false;
                if (!askusButton0) {
                    createAskusButton();
                }

                const authButton0 = document.querySelector('auth-button') || false;
                if (!authButton0) {
                    createAuthButton(mylibraryRequired);
                }

                const authButton1 = document.querySelector('auth-button') || false;
                const askusButton1 = document.querySelector('askus-button') || false;
                if (!!authButton1 && !!askusButton1) {
                    clearInterval(addButtons);
                }
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
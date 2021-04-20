import styles from './css/auth.css';
import ApiAccess from '../ApiAccess/ApiAccess';
import { authLocale } from './auth.locale';
import { mylibraryLocale } from './mylibrary.locale';

/*
 * usage:
 *  <auth-button />
 *  <auth-button overwriteasloggedout />
 *
 */

const authorisedtemplate = document.createElement('template');
authorisedtemplate.innerHTML = `
    <style>${styles.toString()}</style>
    <div id="auth">
     <button id="auth-button-logout" data-testid="auth-button-logout">
        <svg id="auth-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" id="logged-in-icon">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
        </svg>
        <div id="auth-log-out-label">Log out</div>
    </button>
    </div>
`;
const unauthorisedtemplate = document.createElement('template');
unauthorisedtemplate.innerHTML = `
    <style>${styles.toString()}</style>
    <div id="auth">
        <button id="auth-button-login" data-testid="auth-button-login">
            <svg id="auth-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" id="logged-out-icon">
                <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"></path>
            </svg>
            <div id="auth-log-in-label">Log in</div>
        </button>
    </div>
`;

let initCalled;

class AuthButton extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({mode: 'open'});

        if (this.isOverwriteAsLoggedOutRequested()) {
            // Render the template
            shadowDOM.appendChild(unauthorisedtemplate.content.cloneNode(true));
            this.addButtonListeners(shadowDOM);
        } else {
            this.showLoginFromAuthStatus(shadowDOM);
        }

        // Bindings
        this.loadJS = this.loadJS.bind(this);
        this.showLoginFromAuthStatus = this.showLoginFromAuthStatus.bind(this);
        this.addButtonListeners = this.addButtonListeners.bind(this);
        this.checkAuthorisedUser = this.checkAuthorisedUser.bind(this);
    }

    async showLoginFromAuthStatus(shadowDOM) {
        const that = this;
        this.checkAuthorisedUser().then((isAuthorised) => {
            const template = !!isAuthorised ? authorisedtemplate : unauthorisedtemplate;

            // Render the template
            shadowDOM.appendChild(template.content.cloneNode(true));
            that.addButtonListeners(shadowDOM);

            if (!!isAuthorised) {
                // if we can find the stub we built for mylibrary, replace it with the button
                const mylibraryStub = document.getElementById(mylibraryLocale.MYLIBRARY_STUB_ID);
                if (!mylibraryStub || mylibraryStub.children.length > 0) {
                    // if the stub was not set up, then mylibrary is not required
                    // if the stub already has a child button, dont create another
                    return;
                }
                const mylibraryButton = document.createElement('mylibrary-button');
                !!mylibraryButton && mylibraryStub.parentNode.replaceChild(mylibraryButton, mylibraryStub);
            }
        });
    }

    addButtonListeners(shadowDOM) {
        function visitLogOutPage() {
            new ApiAccess().removeAccountStorage();

            const returnUrl = window.location.href;
            window.location.assign(`${authLocale.AUTH_URL_LOGOUT}${window.btoa(returnUrl)}`);
        }

        function visitLoginPage() {
            const returnUrl = window.location.href;
            window.location.assign(`${authLocale.AUTH_URL_LOGIN}${window.btoa(returnUrl)}`);
        }

        const loggedinButton = !!shadowDOM && shadowDOM.getElementById('auth-button-login');
        !!loggedinButton && loggedinButton.addEventListener('click', visitLoginPage);

        const loggedoutButton = !!shadowDOM && shadowDOM.getElementById('auth-button-logout');
        !!loggedoutButton && loggedoutButton.addEventListener('click', visitLogOutPage);

        !loggedinButton && !loggedoutButton && console.log('neither logged in nor logged out buttons exist');
    }

    async checkAuthorisedUser() {
        this.accountLoading = true;
        this.account = {};
        let loggedin = null;

        const that = this;
        const api = new ApiAccess();
        await api
            .getAccount()
            .then((account) => {
                if (account.hasOwnProperty('hasSession') && account.hasSession === true) {
                    that.account = account;
                }
                that.accountLoading = false;

                loggedin = !!that.account && !!that.account.id;
            })
            .catch((error) => {
                that.accountLoading = false;
                loggedin = false;
            });
        return loggedin;
    }

    // we have an option to add the attribute `overwriteasloggedout` to the authbutton
    // this will include the auth button, but always show them as logged out
    isOverwriteAsLoggedOutRequested() {
        const isOverwriteRequired = this.getAttribute('overwriteasloggedout');
        return (!!isOverwriteRequired || isOverwriteRequired === '') && isOverwriteRequired !== 'false';
    }

    loadJS() {
        // This loads the external JS file into the HTML head dynamically
        //Only load js if it has not been loaded before (tracked by the initCalled flag)
        if (!initCalled) {
            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.defer = true;
            script.onload = function () {
                //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
                initCalled = true;
            };

            //Specify the location of the ITS DS JS file
            script.src = 'auth-button.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    }

    connectedCallback() {
        this.loadJS();
    }
}

export default AuthButton;

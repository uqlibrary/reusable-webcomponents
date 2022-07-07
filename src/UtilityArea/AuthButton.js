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
     <button id="auth-button-logout" data-testid="auth-button-logout" title="View logged in options">
        <svg id="auth-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" id="logged-in-icon">
            <path d="M 12 12 c 2.21 0 4 -1.79 4 -4 s -1.79 -4 -4 -4 s -4 1.79 -4 4 s 1.79 4 4 4 z m 0 2 c -2.67 0 -8 1.34 -8 4 v 2 h 16 v -2 c 0 -2.66 -5.33 -4 -8 -4 z m 7 0 h 12 l -6 6"></path>
        </svg>
        <div id="auth-log-out-label" data-testid="auth-button-logout-label"></div>
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
            <div id="auth-log-in-label" data-testid="auth-button-login-label">Log in</div>
        </button>
    </div>
`;

let initCalled;

class AuthButton extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        if (this.isOverwriteAsLoggedOutRequested()) {
            // Render the template
            shadowDOM.appendChild(unauthorisedtemplate.content.cloneNode(true));
            this.addButtonListeners(shadowDOM);
        } else {
            this.showLoginFromAuthStatus(shadowDOM);
        }

        // Bindings
        this.showLoginFromAuthStatus = this.showLoginFromAuthStatus.bind(this);
        this.addButtonListeners = this.addButtonListeners.bind(this);
        this.checkAuthorisedUser = this.checkAuthorisedUser.bind(this);
        this.displayUserNameOnLogoutButton = this.displayUserNameOnLogoutButton.bind(this);
        this.isOverwriteAsLoggedOutRequested = this.isOverwriteAsLoggedOutRequested.bind(this);
    }

    async showLoginFromAuthStatus(shadowDOM) {
        const that = this;
        this.checkAuthorisedUser(shadowDOM).then((account) => {
            const isAuthorised = !!account.id;
            const template = !!isAuthorised ? authorisedtemplate : unauthorisedtemplate;

            // Render the template
            shadowDOM.appendChild(template.content.cloneNode(true));
            that.addButtonListeners(shadowDOM);

            if (!!isAuthorised) {
                this.displayUserNameOnLogoutButton(shadowDOM, account);

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

    displayUserNameOnLogoutButton(shadowDOM, account) {
        function getShortName() {
            /* istanbul ignore next */
            if (!account.firstName || !account.lastName) {
                return authLocale.logoutButtonLabelDefault;
            }

            // some people have a '.' or a '-' for their last name.
            // Assume this is notation for 'user uses a single word name'
            const lastName = account.lastName.trim();
            const usesASingleName = lastName.length <= 1 && !lastName.match(/[a-z]/i);
            const cleanedLastName = usesASingleName ? '' : lastName;

            const maxLength = 12;
            const firstInitial = account.firstName.substring(0, 1);

            if (cleanedLastName.length > maxLength || (usesASingleName && account.firstName.length > maxLength)) {
                /* istanbul ignore next */
                if (!account.id) {
                    return authLocale.logoutButtonLabelDefault;
                }
                return account.id;
            }
            const fullDisplayName = `${account.firstName} ${cleanedLastName}`.trim();
            if (fullDisplayName.length > maxLength) {
                return `${firstInitial} ${cleanedLastName}`;
            }
            return fullDisplayName;
        }

        const userNameField = !!shadowDOM && shadowDOM.getElementById('auth-log-out-label');
        const textNode = document.createTextNode(getShortName());
        !!userNameField && userNameField.appendChild(textNode);
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

        !loggedinButton &&
            !loggedoutButton &&
            /* istanbul ignore next */ console.log('neither logged in nor logged out buttons exist');
    }

    async checkAuthorisedUser(shadowDOM) {
        this.accountLoading = true;
        this.account = {};
        let loggedin = null;

        const that = this;
        const api = new ApiAccess();
        await api
            .getAccount()
            .then((account) => {
                /* istanbul ignore else */
                if (account.hasOwnProperty('hasSession') && account.hasSession === true) {
                    that.account = account;
                }
                that.accountLoading = false;
            })
            .catch((error) => {
                that.accountLoading = false;
            });

        return that.account;
    }

    // we have an option to add the attribute `overwriteasloggedout` to the authbutton
    // this will include the auth button, but always show them as logged out
    isOverwriteAsLoggedOutRequested() {
        const isOverwriteRequired = this.getAttribute('overwriteasloggedout');
        return (!!isOverwriteRequired || isOverwriteRequired === '') && isOverwriteRequired !== 'false';
    }
}

export default AuthButton;

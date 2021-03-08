import styles from './css/overrides.css';
import icons from './css/icons.css';

const unauthorisedtemplate = document.createElement('template');
unauthorisedtemplate.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${icons.toString()}</style>
    <div class="MuiGrid-root-8 makeStyles-utility-115 MuiGrid-item-10 MuiGrid-grid-xs-auto-41" id="auth-button-block" data-testid="auth" style="display: block;">
        <button
            class="MuiButtonBase-root-148 MuiIconButton-root-158 makeStyles-iconButtonRoot-182 log-in-button"
            data-testid="auth-button-loggedout"
            id="auth-button-loggedout"
            tabindex="0"
            type="button"
        >
            <span class="MuiIconButton-label-166 makeStyles-iconButtonLabel-181">
                <svg class="MuiSvgIcon-root-167 makeStyles-iconButton-180" focusable="false" viewBox="0 0 24 24" aria-hidden="true" id="logged-out-icon">
                    <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"></path>
                </svg>
                <div id="log-in-label">Log in</div>
            </span>
            <span class="MuiTouchRipple-root-412"></span>
        </button>
    </div>
`;
const authorisedtemplate = document.createElement('template');
authorisedtemplate.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${icons.toString()}</style>
    <div class="MuiGrid-root-8 makeStyles-utility-115 MuiGrid-item-10 MuiGrid-grid-xs-auto-41" id="auth-button-block" data-testid="auth" style="display: block;">
        <button
            class="MuiButtonBase-root-148 MuiIconButton-root-158 makeStyles-iconButtonRoot-182 log-out-button"
            data-testid="auth-button-loggedin"
            id="auth-button-loggedin"
            tabindex="0"
            type="button"
        >
            <span class="MuiIconButton-label-166 makeStyles-iconButtonLabel-181">
                <svg class="MuiSvgIcon-root-167 makeStyles-iconButton-180" focusable="false" viewBox="0 0 24 24" aria-hidden="true" id="logged-in-icon">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                </svg>
                <div id="log-out-label">Log out</div>
            </span>
            <span class="MuiTouchRipple-root-412"></span>
        </button>
    </div>
`;

let initCalled;


class AuthButton extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({mode: 'open'});

        this.checkAuthorisedUser()
            .then(isAuthorised => {
                const template = !!isAuthorised ? authorisedtemplate : unauthorisedtemplate;

                // Render the template
                shadowDOM.appendChild(template.content.cloneNode(true));
            });

        // Bindings
        this.loadJS = this.loadJS.bind(this);
    }

    setButtonAttributes() {
    }

    async checkAuthorisedUser() {
        this.accountLoading = true;
        this.account = {};
        let loggedin = null;

        if (this.getUQCookies() === undefined || this.sessionGroupId === undefined) {
            console.log('no cookie so we wont bother asking for an account that cant be returned');
            loggedin = false;
            return false;
        }

        await this.fetchAccount()
            .then(account => {
                if (account.hasOwnProperty('hasSession') && account.hasSession === true) {
                    this.account = account;
                }
                this.accountLoading = false;

                loggedin = !!this.account && !!this.account.id;
            }).catch(error => {
                this.accountLoading = false;
                loggedin = false;
            });
        return loggedin;
    }

    // reference: https://dmitripavlutin.com/javascript-fetch-async-await/
    async fetchAccount() {
        const response = await fetch('https://api.library.uq.edu.au/staging/account', {
            headers: {
                'Content-Type': 'application/json',
                'x-uql-token': this.getUQCookies(),
            }
        });
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        const account = await response.json();
        return account;
    }

    getUQCookies() {
        if (this.sessionCookie !== undefined) {
            return this.sessionCookie;
        }
        const SESSION_USER_GROUP_COOKIE_NAME = 'UQLID_USER_GROUP';
        const sessionGroupId = this.getCookie(SESSION_USER_GROUP_COOKIE_NAME);
        this.sessionGroupId = sessionGroupId === null ? undefined : sessionGroupId;

        const SESSION_COOKIE_NAME = 'UQLID';
        const sessionCookie = this.getCookie(SESSION_COOKIE_NAME);
        this.sessionCookie = sessionCookie === null ? undefined : sessionCookie;

        return this.sessionCookie;
    }

    getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i=0 ; i < cookies.length ; ++i) {
            const pair = cookies[i].trim().split('=');
            if (!!pair[0] && pair[0] === name) {
                return !!pair[1] ? pair[1] : null;
            }
        }
        return null;
    };

    loadJS() {
        // This loads the external JS file into the HTML head dynamically
        //Only load js if it has not been loaded before (tracked by the initCalled flag)
        if (!initCalled) {
            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function () {
                //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
                initCalled = true;
            };

            function visitLogOutPage() {
                const AUTH_URL_LOGOUT = 'https://auth.library.uq.edu.au/logout';
                const returnUrl = window.location.href;
                window.location.assign(`${AUTH_URL_LOGOUT}?url=${window.btoa(returnUrl)}`);
            }

            function visitLoginPage() {
                const AUTH_URL_LOGIN = 'https://auth.library.uq.edu.au/login';
                const returnUrl = window.location.href;
                window.location.assign(`${AUTH_URL_LOGIN}?url=${window.btoa(returnUrl)}`);
            }

            // Attach listeners to the auth button
            const parentNode = document.getElementsByTagName('auth-button')[0] || false;
            const loggedinButton = !!parentNode && parentNode.shadowRoot.getElementById("auth-button-loggedin")
            !!loggedinButton && loggedinButton.addEventListener('click', visitLogOutPage);
            const loggedoutButton = !!parentNode && parentNode.shadowRoot.getElementById("auth-button-loggedout")
            !!loggedoutButton && loggedoutButton.addEventListener('click', visitLoginPage);

            //Specify the location of the ITS DS JS file
            script.src = 'auth-button.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    };

    connectedCallback() {
        this.loadJS();
    }
}

export default AuthButton;

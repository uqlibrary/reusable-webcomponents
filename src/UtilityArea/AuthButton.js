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
    <div id="auth" class="auth">
        <button id="account-option-button" data-testid="account-option-button">
            <div id="username-area" data-testid="auth-button-logout-label" class="username-area">
                <svg id="options-dropdown-arrow" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium  css-w2bhrx" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowDropDownIcon" aria-label="fontSize medium">
                    <path d="m7 10 5 5 5-5z"></path>
                </svg>
            </div>
        </button>
        <!-- Menu -->
        <div id="account-options-menu" class="auth-menu" data-testid="account-options-menu" class="account-options-menu-closed" style="display: none;">
            <ul class="account-options-menu-list" role="menu">
                <li role="menuitem" aria-disabled="false">
                    <button id="auth-button-logout" data-testid="auth-button-logout" title="Log out">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="LogoutIcon" aria-label="fontSize large">
                            <path d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
                        </svg>
                        <span>Log out</span>
                    </button>
                    </a>
                </li>
            </ul>
        </div>
        <!-- Screen wrapper -->
        <div id="account-options-pane" data-testid="account-options-pane" aria-hidden="true" class="account-options-pane account-options-pane-closed" style="display: none" />
    </div>
`;
const unauthorisedtemplate = document.createElement('template');
unauthorisedtemplate.innerHTML = `
    <style>${styles.toString()}</style>
    <div class="auth">
        <button id="auth-button-login" class="login-button" data-testid="auth-button-login">
            <svg class="auth-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" id="logged-out-icon">
                <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"></path>
            </svg>
            <div class="auth-log-in-label" data-testid="auth-button-login-label">Log in</div>
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
            this.addLoginButtonListener(shadowDOM);
            this.addLogoutButtonListeners(shadowDOM);
        } else {
            this.showLoginFromAuthStatus(shadowDOM);
        }

        // Bindings
        this.showLoginFromAuthStatus = this.showLoginFromAuthStatus.bind(this);
        this.addLoginButtonListener = this.addLoginButtonListener.bind(this);
        this.addLogoutButtonListeners = this.addLogoutButtonListeners.bind(this);
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
            this.addLoginButtonListener(shadowDOM);
            that.addLogoutButtonListeners(shadowDOM);

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
        function getDisplayName() {
            // some people have a '.' or a '-' for their last name.
            // Assume this is notation for 'user uses a single word name'
            const lastName = account.lastName.trim();
            const usesASingleName = lastName.length <= 1 && !lastName.match(/[a-z]/i);

            const maxLength = 40;
            const firstInitial = account.firstName.substring(0, 1);

            if (usesASingleName) {
                return account.firstName;
            }
            const displayName = `${account.lastName}, ${account.firstName}`.trim();
            if (displayName.length > maxLength) {
                return `${firstInitial} ${account.lastName}`;
            }
            return displayName;
        }
        const parentUserNameArea = !!shadowDOM && shadowDOM.getElementById('username-area');
        const childArrow = !!shadowDOM && shadowDOM.getElementById('options-dropdown-arrow');
        const textNode = document.createTextNode(getDisplayName());
        !!parentUserNameArea && !!childArrow && !!textNode && parentUserNameArea.insertBefore(textNode, childArrow);
    }

    addLoginButtonListener(shadowDOM) {
        function visitLoginPage() {
            const returnUrl = window.location.href;
            window.location.assign(`${authLocale.AUTH_URL_LOGIN}${window.btoa(returnUrl)}`);
        }

        const loginButton = !!shadowDOM && shadowDOM.getElementById('auth-button-login');
        !!loginButton && loginButton.addEventListener('click', visitLoginPage);
        return loginButton;
    }

    addLogoutButtonListeners(shadowDOM) {
        function visitLogOutPage() {
            new ApiAccess().removeAccountStorage();

            const returnUrl = window.location.href;
            window.location.assign(`${authLocale.AUTH_URL_LOGOUT}${window.btoa(returnUrl)}`);
        }

        let accountOptionsClosed = true;

        function openAccountOptionsMenu() {
            console.log('options: openAccountOptionsMenu');
            accountOptionsClosed = false;
            const shadowMenu = shadowDOM.getElementById('account-options-menu');
            !!shadowMenu && (shadowMenu.style.display = 'block');
            const shadowPane = shadowDOM.getElementById('account-options-pane');
            console.log('1 shadowPane=', shadowPane);
            !!shadowPane && (shadowPane.style.display = 'block');

            function showDisplay() {
                console.log('options: showDisplay');
                !!shadowMenu && shadowMenu.classList.remove('account-options-menu-closed');
                !!shadowPane && shadowPane.classList.remove('account-options-pane-closed');
                console.log('2 shadowPane=', shadowPane);
            }

            setTimeout(showDisplay, 100);
            document.onkeydown = function (evt) {
                evt = evt || /* istanbul ignore next */ window.event;
                const escapeKeyCode = 27;
                if ((evt.key === escapeKeyCode || evt.keyCode === escapeKeyCode) && accountOptionsClosed === false) {
                    console.log('options: escapekey');
                    closeAccountOptionsMenu();
                }
            };
        }

        function closeAccountOptionsMenu() {
            console.log('options: closeAccountOptionsMenu');
            accountOptionsClosed = true;
            const shadowMenu = shadowDOM.getElementById('account-options-menu');
            shadowMenu.classList.add('account-options-menu-closed');
            const shadowPane = shadowDOM.getElementById('account-options-pane');
            shadowPane.classList.add('account-options-pane-closed');

            function hideAccountOptionsDisplay() {
                console.log('options: hideAccountOptionsDisplay');
                !!shadowMenu && (shadowMenu.style.display = 'none');
                !!shadowPane && (shadowPane.style.display = 'none');
            }

            setTimeout(hideAccountOptionsDisplay, 500);
        }

        function handleAccountOptionsButton() {
            console.log('options: handleAccountOptionsButton');
            const shadowButton = shadowDOM.getElementById('account-options-button');
            accountOptionsClosed
                ? !!shadowButton && shadowButton.blur()
                : /* istanbul ignore next */ !!shadowButton && shadowButton.focus();
            const shadowPane = shadowDOM.getElementById('account-options-pane');
            !!shadowPane && shadowPane.addEventListener('click', handleAccountOptionsMouseOut);
            openAccountOptionsMenu();
        }

        function handleAccountOptionsMouseOut() {
            console.log('options: handleAccountOptionsMouseOut');
            accountOptionsClosed = !accountOptionsClosed;
            const shadowPane = shadowDOM.getElementById('account-options-pane');
            !!shadowPane && shadowPane.removeEventListener('mouseleave', handleAccountOptionsMouseOut);
            closeAccountOptionsMenu();
        }

        // Attach a listener to the options button
        const accountOptionsButton = !!shadowDOM && shadowDOM.getElementById('account-option-button');
        !!accountOptionsButton && accountOptionsButton.addEventListener('click', handleAccountOptionsButton);

        const loggedoutButton = !!shadowDOM && shadowDOM.getElementById('auth-button-logout');
        !!loggedoutButton && loggedoutButton.addEventListener('click', visitLogOutPage);
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

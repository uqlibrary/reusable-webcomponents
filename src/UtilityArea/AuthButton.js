import styles from './css/auth.css';
import ApiAccess from '../ApiAccess/ApiAccess';
import { authLocale } from './auth.locale';

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
            <div id="username-area" data-testid="username-area-label" class="username-area">
                <span id="username-area-label" class="username-area-label"></span>
                <svg id="options-dropdown-arrow" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium  css-w2bhrx" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowDropDownIcon" aria-label="Open account panel">
                    <path d="m7 10 5 5 5-5z"></path>
                </svg>
            </div>
        </button>
        <!-- Menu -->
        <div id="account-options-menu" class="auth-menu" data-testid="account-options-menu" class="account-options-menu-closed" style="display: none;">
            <div class="account-options-menu-list">
                <div width="5" class="md-menu-content prm-user-menu-content md-primoExplore-theme" role="menu">
                    <h2 class="accessible-only">Menu</h2>
                    <div class="md-menu-item">
                        <div class="user-menu-header">
                            <div layout="column" flex="" class="layout-column flex">
                                <span class="tiny-uppercase-text">Logged in as:</span>
                                <span id="user-display-name" class="user-display-name bold-text" style="padding-right:1rem"></span>
                            </div>
                            <button class="logout md-primary md-button md-primoExplore-theme md-ink-ripple" type="button" data-testid="auth-button-logout" id="signOutButton" aria-label="Log out" role="menuitem">
                                <span class="bold-text">Log out</span>
                            </button>
                        </div>
                    </div>
                    <ul class="mylibrary-menu-list" role="menu">
                        <!-- Borrowing -->
                        <li role="menuitem" aria-disabled="false">
                            <a data-testid="mylibrary-menu-borrowing" href="https://search.library.uq.edu.au/primo-explore/login?vid=61UQ&targetURL=https%3A%2F%2Fsearch.library.uq.edu.au%2Fprimo-explore%2Faccount%3Fvid%3D61UQ%26lang%3Den_US%26section%3Dloans" rel="noreferrer">
                                <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.41.21.75-.19.75-.45V6c-1.49-1.12-3.63-1.5-5.5-1.5zm3.5 14c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path></svg>
                                <span>Borrowing</span>
                            </a>
                        </li>
                        
                        <!-- Document delivery -->
                        <li role="menuitem" aria-disabled="false">
                            <a data-testid="mylibrary-menu-document-delivery" href="https://auth.library.uq.edu.au/login?relais_return=1" rel="noreferrer">
                                <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"></path></svg>
                                <span>Document delivery</span>
                            </a>
                        </li>
                        
                        <!-- eSpace dashboard -->
                        <li data-testid="mylibrary-espace" id="mylibrary-espace" role="menuitem" aria-disabled="false">
                            <a data-testid="mylibrary-menu-espace-dashboard" href="https://espace.library.uq.edu.au/dashboard" rel="noreferrer">
                                <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path></svg>
                                <span>eSpace dashboard</span>
                            </a>
                        </li>
                                
                        <!-- Saved items -->
                        <li role="menuitem" aria-disabled="false">
                            <a data-testid="mylibrary-menu-saved-items" href="https://search.library.uq.edu.au/primo-explore/login?vid=61UQ&targetURL=https%3A%2F%2Fsearch.library.uq.edu.au%2Fprimo-explore%2Ffavorites%3Fvid%3D61UQ%26lang%3Den_US%26section%3Ditems" rel="noreferrer">
                                <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                                <span>Saved items</span>
                            </a>
                        </li>
                        
                        <!-- Feedback -->
                        <li role="menuitem" aria-disabled="false">
                            <a data-testid="mylibrary-menu-feedback" href="https://support.my.uq.edu.au/app/library/feedback" rel="noreferrer">
                                <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"></path></svg>
                                <span>Feedback</span>
                            </a>
                        </li>

                        <!-- Learning resources -->
                        <li role="menuitem" aria-disabled="false">
                            <a data-testid="mylibrary-menu-course-resources" href="https://www.library.uq.edu.au/learning-resources" rel="noreferrer">
                                <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"></path></svg>
                                <span>Learning resources</span>
                            </a>
                        </li>
                        
                        <!-- Printing balance -->
                        <li role="menuitem" aria-disabled="false">
                            <a data-testid="mylibrary-menu-print-balance" href="https://lib-print.library.uq.edu.au:9192/user" rel="noreferrer">
                                <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"></path></svg>
                                <span>Print balance</span>
                            </a>
                        </li>
                        
                        <!-- Room bookings -->
                        <li role="menuitem" aria-disabled="false">
                            <a data-testid="mylibrary-menu-room-bookings" href="https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb" rel="noreferrer">
                                <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M2 17h20v2H2zm11.84-9.21c.1-.24.16-.51.16-.79 0-1.1-.9-2-2-2s-2 .9-2 2c0 .28.06.55.16.79C6.25 8.6 3.27 11.93 3 16h18c-.27-4.07-3.25-7.4-7.16-8.21z"></path></svg>
                                <span>Room bookings</span>
                            </a>
                        </li>
                        
                        <!-- Saved searches -->
                        <li role="menuitem" aria-disabled="false">
                            <a data-testid="mylibrary-menu-saved-searches" href="https://search.library.uq.edu.au/primo-explore/login?vid=61UQ&targetURL=https%3A%2F%2Fsearch.library.uq.edu.au%2Fprimo-explore%2Ffavorites%3Fvid%3D61UQ%26lang%3Den_US%26section%3Dqueries" rel="noreferrer">
                                <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M17.01 14h-.8l-.27-.27c.98-1.14 1.57-2.61 1.57-4.23 0-3.59-2.91-6.5-6.5-6.5s-6.5 3-6.5 6.5H2l3.84 4 4.16-4H6.51C6.51 7 8.53 5 11.01 5s4.5 2.01 4.5 4.5c0 2.48-2.02 4.5-4.5 4.5-.65 0-1.26-.14-1.82-.38L7.71 15.1c.97.57 2.09.9 3.3.9 1.61 0 3.08-.59 4.22-1.57l.27.27v.79l5.01 4.99L22 19l-4.99-5z"></path></svg>
                                <span>Saved searches</span>
                            </a>
                        </li>
                    </ul>
                    <div id="admin-options" class="admin-options" data-testid="admin-options">
                        <ul class="mylibrary-menu-list" id="mylibrary-menu-list" role="menu">
                                                       
                            <!-- Masquerade -->
                            <li data-testid="mylibrary-masquerade" id="mylibrary-masquerade" role="menuitem" aria-disabled="false">
                                <a data-testid="mylibrary-menu-masquerade" href="https://www.library.uq.edu.au/admin/masquerade" rel="noreferrer">
                                    <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;">
                                        <path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"></path>
                                    </svg>
                                    <span>Masquerade</span>
                                </a>
                            </li>
                             
                            <!-- Alerts Admin -->
                            <li data-testid="alerts-admin" id="alerts-admin" role="menuitem" aria-disabled="false">
                                <a data-testid="mylibrary-menu-alerts-admin" href="https://www.library.uq.edu.au/admin/alerts" rel="noreferrer">
                                    <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
                                    <span>Website alerts</span>
                                </a>
                            </li>
                                            
                            <!-- Spotlights Admin -->
                            <li data-testid="spotlights-admin" id="spotlights-admin" role="menuitem" aria-disabled="false">
                                <a data-testid="mylibrary-menu-spotlights-admin" href="https://www.library.uq.edu.au/admin/spotlights" rel="noreferrer">
                                    <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
                                    <span>Website spotlights</span>
                                </a>
                            </li>
            
                        </ul>
                    </div>
                </div>
            </div>
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
        this.displayUserNameAsButtonLabel = this.displayUserNameAsButtonLabel.bind(this);
        this.isOverwriteAsLoggedOutRequested = this.isOverwriteAsLoggedOutRequested.bind(this);
        this.showHideMylibraryEspaceOption = this.showHideMylibraryEspaceOption.bind(this);
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
                this.displayUserNameAsButtonLabel(shadowDOM, account);

                // // if we can find the stub we built for mylibrary, replace it with the button
                // const mylibraryStub = document.getElementById(mylibraryLocale.MYLIBRARY_STUB_ID);
                // if (!mylibraryStub || mylibraryStub.children.length > 0) {
                //     // if the stub was not set up, then mylibrary is not required
                //     // if the stub already has a child button, dont create another
                //     return;
                // }
                // const mylibraryButton = document.createElement('mylibrary-button');
                // !!mylibraryButton && mylibraryStub.parentNode.replaceChild(mylibraryButton, mylibraryStub);

                const masqueradeElement = !!shadowDOM && shadowDOM.getElementById('mylibrary-masquerade');
                !account.canMasquerade && !!masqueradeElement && masqueradeElement.remove();

                const alertsAdminElement = !!shadowDOM && shadowDOM.getElementById('alerts-admin');
                !this.canSeeAlertsAdmin(account) && !!alertsAdminElement && alertsAdminElement.remove();

                const spotlightsAdminElement = !!shadowDOM && shadowDOM.getElementById('spotlights-admin');
                !this.canSeeSpotlightsAdmin(account) && !!spotlightsAdminElement && spotlightsAdminElement.remove();

                this.showHideMylibraryEspaceOption(shadowDOM);

                // if admin area has no entries, delete the area so we lose the border at the top
                const adminarealist = !!shadowDOM && shadowDOM.getElementById('mylibrary-menu-list');
                if (!!adminarealist && adminarealist.children.length === 0) {
                    const adminarea = !!shadowDOM && shadowDOM.getElementById('admin-options');
                    !!adminarea && adminarea.remove();
                }

                // add the user's name to the account button
                const userNameArea = !!shadowDOM && shadowDOM.getElementById('user-display-name');
                const textNode = document.createTextNode(this.getUserDisplayName(account));
                !!userNameArea && !!textNode && userNameArea.appendChild(textNode);
            }
        });
    }

    getUserDisplayName(account) {
        const maxLength = 40;
        const firstInitial = account.firstName.substring(0, 1);

        if (this.usesASingleName(account)) {
            return account.firstName;
        }
        const displayName = `${account.lastName}, ${account.firstName}`.trim();
        if (displayName.length > maxLength) {
            return `${firstInitial} ${account.lastName}`;
        }
        return displayName;
    }

    // some people have a '.' or a '-' for their last name.
    // Assume this is notation for 'user uses a single word name'
    usesASingleName(account) {
        const lastName = account.lastName.trim();
        return lastName.length <= 1 && !lastName.match(/[a-z]/i);
    }

    displayUserNameAsButtonLabel(shadowDOM, account) {
        const parentUserNameArea = !!shadowDOM && shadowDOM.getElementById('username-area-label');
        const textNode = document.createTextNode(this.getUserDisplayName(account));
        !!parentUserNameArea && parentUserNameArea.appendChild(textNode);
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
            accountOptionsClosed = false;
            const shadowMenu = shadowDOM.getElementById('account-options-menu');
            !!shadowMenu && (shadowMenu.style.display = 'block');
            const shadowPane = shadowDOM.getElementById('account-options-pane');
            !!shadowPane && (shadowPane.style.display = 'block');

            function showDisplay() {
                !!shadowMenu && shadowMenu.classList.remove('account-options-menu-closed');
                !!shadowPane && shadowPane.classList.remove('account-options-pane-closed');
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

        const loggedoutButton = !!shadowDOM && shadowDOM.getElementById('signOutButton');
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

    // access controlled via Active Directory (AD)
    hasWebContentAdminAccess(account) {
        return (
            !!account &&
            !!account.groups &&
            account.groups.find((group) => group.includes('lib_libapi_SpotlightAdmins'))
        );
    }

    canSeeAlertsAdmin(account) {
        return !!account && !!this.hasWebContentAdminAccess(account);
    }

    canSeeSpotlightsAdmin(account) {
        return !!account && !!this.hasWebContentAdminAccess(account);
    }

    async showHideMylibraryEspaceOption(shadowDOM) {
        const api = new ApiAccess();
        return await api.loadAuthorApi().then((author) => {
            const espaceitem = !!shadowDOM && shadowDOM.getElementById('mylibrary-espace');
            const isAuthor = !!author && !!author.data && !!author.data.hasOwnProperty('aut_id');
            !!espaceitem && !isAuthor && espaceitem.remove();
            return author;
        });
    }
}

export default AuthButton;

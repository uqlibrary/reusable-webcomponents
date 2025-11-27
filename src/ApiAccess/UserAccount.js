import MockApi from '../../mock/MockApi';
import ApiRoutes from '../ApiRoutes';
import { apiLocale as locale } from './ApiAccess.locale';
import { getCookieValue } from '../helpers/cookie';
import { authLocale } from '../UtilityArea/auth.locale';
import { getHomepageLink } from '../helpers/access';
import ApiAccess from './ApiAccess';

// this manages services that need to check for a logged in account
// actual login button click is handled within AuthButton
class UserAccount extends ApiAccess {
    constructor() {
        super();
        if (!!UserAccount.instance) {
            return UserAccount.instance;
        }

        UserAccount.instance = this;

        this.account = {};
    }

    async get() {
        const that = this;
        const ACCOUNT_CALL_INCOMPLETE = 'incomplete';
        const ACCOUNT_CALL_DONE = 'done';

        if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
            // no cookie, this is the auto-load-account process; if there is no cookie, then there is no point making the call to api!
            return false;
        }

        if (!!this.account && this.account.hasOwnProperty('status') && this.account?.status === locale.USER_LOGGED_IN) {
            return this.account;
        }

        const accountApi = new ApiRoutes().CURRENT_ACCOUNT_API();
        let accountCallStatus = ACCOUNT_CALL_INCOMPLETE;
        await this.fetchAPI(accountApi?.apiUrl, {}, true)
            .then((account) => {
                if (account.hasOwnProperty('hasSession') && account.hasSession === true) {
                    accountCallStatus = ACCOUNT_CALL_DONE;

                    that.watchForSessionExpiry();

                    this.account = {
                        status: locale.USER_LOGGED_IN,
                        account: {
                            ...account,
                        },
                    };
                } else {
                    that.announceUserLoggedOut();
                    accountCallStatus = ACCOUNT_CALL_DONE;
                    return false;
                }

                const authorApi = new ApiRoutes().CURRENT_AUTHOR_API();
                return that.fetchAPI(authorApi?.apiUrl, {}, true);
            })
            .then((author) => {
                this.account = {
                    ...this.account,
                    currentAuthor: {
                        ...author.data,
                    },
                };
                return this.account;
            })
            .catch((error) => {
                if (accountCallStatus === ACCOUNT_CALL_INCOMPLETE) {
                    // it was the account call that had an error; authors was never called
                    that.announceUserLoggedOut();
                    return false;
                }
                return true;
            })
            .finally(() => {
                return this.account;
            });
        return this.account;
    }

    watchForSessionExpiry() {
        // let the calling page know account is available
        if ('BroadcastChannel' in window) {
            const bc = new BroadcastChannel('account_availability');
            bc.postMessage('account_updated');

            bc.onmessage = (messageEvent) => {
                if (messageEvent.data === 'account_removed') {
                    this.showLoggedOutButton();
                    this.logUserOut();
                }
            };
        }

        // watch the session cookie for expiry when the user is logged in
        if (this.getSessionCookie() !== undefined && this.getLibraryGroupCookie() !== undefined) {
            const watchforAccountExpiry = setInterval(() => {
                if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
                    this.announceUserLoggedOut();
                    clearInterval(watchforAccountExpiry);
                }
            }, 1000);
        }
    }

    showLoggedOutButton() {
        const authButton = document.querySelector('auth-button');
        if (!!authButton) {
            // create temporary reference element so we know where to paste the new logged out auth
            const referenceElement = document.createElement('span');
            !!referenceElement && authButton.parentNode.insertBefore(referenceElement, authButton.nextSibling);

            authButton.parentNode.removeChild(authButton);
            const recreatedAuthButton = document.createElement('auth-button');
            !!referenceElement &&
                !!recreatedAuthButton &&
                referenceElement.parentNode.insertBefore(recreatedAuthButton, referenceElement);

            !!referenceElement && referenceElement.parentNode.removeChild(referenceElement);
        }
    }

    logUserOut() {
        let homepagelink = getHomepageLink();
        window.location.assign(`${authLocale.AUTH_URL_LOGOUT}${window.btoa(homepagelink)}`);
    }

    announceUserLoggedOut() {
        setTimeout(() => {
            // a short delay so the above removals have firmly happened before the notified apps can action it
            if ('BroadcastChannel' in window) {
                // let the calling page know account has been removed
                const bc = new BroadcastChannel('account_availability');
                bc.postMessage('account_removed');
            }
        }, 100);
    }

    getSessionCookie() {
        return getCookieValue(locale.SESSION_COOKIE_NAME);
    }

    getLibraryGroupCookie() {
        // I am guessing this field is used as a proxy for 'has a Library account, not just a general UQ login'
        return getCookieValue(locale.SESSION_USER_GROUP_COOKIE_NAME);
    }

    fetchMock(url, options = null) {
        const response = new MockApi().mockfetch(url, options);
        window.location.hostname === 'localhost' && console.log('mock url = ', url);
        window.location.hostname === 'localhost' && console.log('mock response = ', response);
        if (!response?.ok || !response?.body) {
            const msg = `fetchMock: An error has occured in mock for ${url}: ${response?.status}`;
            window.location.hostname === 'localhost' && console.log(msg);
            throw new Error(msg);
        }
        return response?.body || /* istanbul ignore next */ {};
    }

    isMock() {
        return process.env.USE_MOCK;
    }
}

export default UserAccount;

import MockApi from '../../mock/MockApi';
import ApiRoutes from '../ApiRoutes';
import { apiLocale as locale } from './ApiAccess.locale';

let initCalled;

class ApiAccess {
    constructor() {
        this.STORAGE_ACCOUNT_KEYNAME = 'userAccount';

        // Bindings
        this.loadJS = this.loadJS.bind(this);
    }

    async getAccount() {
        if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
            // no cookie, force them to log in again
            this.removeAccountStorage();
            return false;
        }

        let accountData = this.getAccountFromStorage();
        if (accountData !== null) {
            console.log('getAccount: account from session storage = ', accountData);
            return accountData;
        }

        const accountApi = new ApiRoutes().CURRENT_ACCOUNT_API();
        const urlPath = accountApi.apiUrl;
        const options = !!accountApi.options ? accountApi.options : {};
        return await this.fetchAPI(urlPath, options, true).then((account) => {
            console.log('getAccount: account from server = ', account);
            this.storeAccount(account);

            return account;
        });
    }

    async loadAuthorApi() {
        const api = new ApiRoutes().CURRENT_AUTHOR_API();
        const urlPath = api.apiUrl;
        const options = !!api.options ? api.options : {};
        return await this.fetchAPI(urlPath, options, true).then((author) => {
            return author;
        });
    }

    async loadChatStatus() {
        let isOnline = false;
        const chatstatusApi = new ApiRoutes().CHAT_API();
        const urlPath = chatstatusApi.apiUrl;
        const options = !!chatstatusApi.options ? chatstatusApi.options : {};
        await this.fetchAPI(urlPath, options)
            .then((chatResponse) => {
                isOnline = !!chatResponse.online;
            })
            .catch((error) => {
                console.log('error loading chat status ', error);
            });
        return isOnline;
    }

    async loadOpeningHours() {
        let result;
        const hoursApi = new ApiRoutes().LIB_HOURS_API();
        const urlPath = hoursApi.apiUrl;
        const options = !!hoursApi.options ? hoursApi.options : {};
        await this.fetchAPI(urlPath, options)
            .then((hoursResponse) => {
                let askusHours = null;
                if (!!hoursResponse && !!hoursResponse.locations && hoursResponse.locations.length > 1) {
                    askusHours = hoursResponse.locations.map((item) => {
                        if (item.abbr === 'AskUs') {
                            return {
                                chat: item.departments[0].rendered,
                                phone: item.departments[1].rendered,
                            };
                        }
                        return null;
                    });
                }
                result = askusHours ? askusHours.filter((item) => item !== null)[0] : null;
            })
            .catch((error) => {
                console.log('error loading hours ', error);
                result = null;
            });
        return result;
    }

    async fetchAPI(urlPath, headers, tokenRequired = false) {
        console.log('fetchAPI, getting api "', urlPath, '" with these headers: ', headers);

        if (!!tokenRequired && (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined)) {
            // no cookie so we wont bother asking for an api that cant be returned
            console.log('no cookie so we wont bother asking for an api that cant be returned');
            return false;
        }

        if (this.isMock()) {
            return this.fetchMock(urlPath);
        }

        const token = !!tokenRequired ? { 'x-uql-token': this.getSessionCookie() } : null;

        const options = {
            'Content-Type': 'application/json',
            ...token,
            ...headers,
        };
        // reference: https://dmitripavlutin.com/javascript-fetch-async-await/
        const response = await this.fetchFromServer(urlPath, options);
        if (!response.ok) {
            console.log(`ApiAccess console: An error has occured: ${response.status} ${response.statusText}`);
            const message = `ApiAccess: An error has occured: ${response.status} ${response.statusText}`;
            throw new Error(message);
        }
        return await response.json();
    }

    fetchFromServer(urlPath, options) {
        const API_URL = process.env.API_URL || 'https://api.library.uq.edu.au/staging/';
        return fetch(`${API_URL}${urlPath}?ts=${new Date().getTime()}`, {
            headers: options,
        });
    }

    storeAccount(account) {
        // for improved UX, expire the session storage when the token must surely be expired, for those rare long sessions
        const numberOfHoursUntilExpiry = 8; // session lasts 8 hours, per https://auth.uq.edu.au/about/

        const millisecondsUntilExpiry = numberOfHoursUntilExpiry * 60 /*min*/ * 60 /*sec*/ * 1000; /* milliseconds */
        const storageExpiryDate = {
            storageExpiryDate: new Date().setTime(new Date().getTime() + millisecondsUntilExpiry),
        };
        let storeableAccount = {
            ...account,
            ...storageExpiryDate,
        };
        storeableAccount = JSON.stringify(storeableAccount);
        sessionStorage.setItem(this.STORAGE_ACCOUNT_KEYNAME, storeableAccount);
    }

    getAccountFromStorage() {
        const account = JSON.parse(sessionStorage.getItem(this.STORAGE_ACCOUNT_KEYNAME));
        if (this.isMock() && !!account) {
            if ((!!account.id && account.id !== new MockApi().user) || !account.id) {
                // allow developer to swap between users in the same tab
                this.removeAccountStorage();
                return null;
            }
        }

        if (account === null) {
            return null;
        }

        const now = new Date().getTime();
        if (!account.storageExpiryDate || account.storageExpiryDate < now) {
            this.removeAccountStorage();
            return null;
        }

        return account;
    }

    removeAccountStorage() {
        sessionStorage.removeItem(this.STORAGE_ACCOUNT_KEYNAME);
    }

    getSessionCookie() {
        if (this.isMock() && new MockApi().getUserParameter() !== 'public') {
            return 'abc123';
        }
        return this.getCookie(locale.SESSION_COOKIE_NAME);
    }

    getLibraryGroupCookie() {
        // I am guessing this field is used as a proxy for 'has a Library account, not just a general UQ login'
        if (this.isMock() && new MockApi().getUserParameter() !== 'public') {
            return 'LIBRARYSTAFFB';
        }
        return this.getCookie(locale.SESSION_USER_GROUP_COOKIE_NAME);
    }

    getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; ++i) {
            const pair = cookies[i].trim().split('=');
            if (!!pair[0] && pair[0] === name) {
                return !!pair[1] ? pair[1] : undefined;
            }
        }
        return undefined;
    }

    fetchMock(url, options = null) {
        const response = new MockApi().mockfetch(url, options);
        if (!response.ok || !response.body) {
            console.log(`fetchMock console: An error has occured in mock for ${url}: ${response.status}`);
            const message = `fetchMock: An error has occured in mock for ${url}: ${response.status}`;
            // vanilla gets a 403 so we don't want to throw an error here
            return {};
        }
        return response.body || {};
    }

    isMock() {
        return process.env.BRANCH !== 'production' && process.env.USE_MOCK;
    }

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

            //Specify the location of the ITS DS JS file
            script.src = 'api-access.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    }

    connectedCallback() {
        this.loadJS();
    }
}

export default ApiAccess;

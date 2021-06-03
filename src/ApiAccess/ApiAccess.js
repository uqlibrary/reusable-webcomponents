import MockApi from '../../mock/MockApi';
import ApiRoutes from '../ApiRoutes';
import { apiLocale as locale } from './ApiAccess.locale';

let initCalled;

class ApiAccess {
    constructor() {
        this.STORAGE_ACCOUNT_KEYNAME = locale.STORAGE_ACCOUNT_KEYNAME;
    }

    async getAccount() {
        if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
            // no cookie, force them to log in again
            this.removeAccountStorage();
            return false;
        }

        let accountData = this.getAccountFromStorage();
        if (accountData !== null) {
            return accountData;
        }

        const accountApi = new ApiRoutes().CURRENT_ACCOUNT_API();
        const urlPath = accountApi.apiUrl;
        // const options = !!accountApi.options ? accountApi.options : {};
        const options = {}; // options not currently used
        return await this.fetchAPI(urlPath, options, true).then((account) => {
            this.storeAccount(account);

            return account;
        });
    }

    async loadAuthorApi() {
        const api = new ApiRoutes().CURRENT_AUTHOR_API();
        const urlPath = api.apiUrl;
        // const options = !!api.options ? api.options : {};
        const options = {}; // options not currently used
        return await this.fetchAPI(urlPath, options, true)
            .then((author) => {
                return author;
            })
            .catch((error) => {
                console.log('error loading authors ', error);
                return {};
            });
    }

    async loadChatStatus() {
        let isOnline = false;
        const chatstatusApi = new ApiRoutes().CHAT_API();
        const urlPath = chatstatusApi.apiUrl;
        // const options = !!chatstatusApi.options ? chatstatusApi.options : {};
        const options = {}; // options not currently used
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
        // const options = !!hoursApi.options ? hoursApi.options : {};
        const options = {}; // options not currently used
        await this.fetchAPI(urlPath, options)
            .then((hoursResponse) => {
                let askusHours = null;
                /* istanbul ignore else */
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
                result = askusHours ? askusHours.filter((item) => item !== null)[0] : /* istanbul ignore next */ null;
            })
            .catch((error) => {
                console.log('error loading hours ', error);
                return null;
            });
        return result;
    }

    async loadAlerts() {
        const alertApi = new ApiRoutes().ALERT_API();
        const urlPath = alertApi.apiUrl;
        // const options = !!alertApi.options ? alertApi.options : {};
        const options = {}; // options not currently used
        return await this.fetchAPI(urlPath, options)
            .then((alerts) => {
                return alerts;
            })
            .catch((error) => {
                console.log('error loading alerts ', error);
                return null;
            });
    }

    async loadTrainingEvents(maxEventCount, filterId) {
        const trainingApi = new ApiRoutes().TRAINING_API();
        const urlPath = trainingApi.apiUrl;
        const filter = {
            maxEventCount,
            // filterIds should be an array. Passing an array as value to
            // URLSearchParams doesn't seem to be working.
            'filterIds[]': filterId, // Value of filter to extract data from career hub.
        };
        const filterParams = new URLSearchParams(filter).toString();

        // Need to decode the url-encoded version of '[]' in filterIds.
        const url = urlPath.concat('?', decodeURIComponent(filterParams));

        return await this.fetchAPI(url).catch((error) => {
            console.log('error loading training events ', error);
            return null;
        });
    }

    async fetchAPI(urlPath, headers = {}, tokenRequired = false) {
        if (!!tokenRequired && (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined)) {
            // no cookie so we wont bother asking for an api that cant be returned
            console.log('no cookie so we wont bother asking for an api that cant be returned');
            return false;
        }

        const token = !!tokenRequired ? { 'x-uql-token': this.getSessionCookie() } : null;

        const options = {
            'Content-Type': 'application/json',
            ...token,
            ...headers,
        };

        /* istanbul ignore else  */
        if (this.isMock()) {
            try {
                return this.fetchMock(urlPath);
            } catch (e) {
                const msg = `mock api error: ${e.message}`;
                console.log(msg);
                throw new Error(msg);
            }
        } else {
            // reference: https://dmitripavlutin.com/javascript-fetch-async-await/
            const response = await this.fetchFromServer(urlPath, options);
            if (!response.ok) {
                console.log(`ApiAccess console: An error has occured: ${response.status} ${response.statusText}`);
                const message = `ApiAccess: An error has occured: ${response.status} ${response.statusText}`;
                throw new Error(message);
            }
            return await response.json();
        }
    }

    /* istanbul ignore next */
    fetchFromServer(urlPath, options) {
        const API_URL = process.env.API_URL || 'https://api.library.uq.edu.au/staging/';

        return fetch(`${API_URL}${urlPath}?${new Date().getTime()}`, {
            headers: options,
        });
    }

    storeAccount(account, numberOfHoursUntilExpiry = 8) {
        // for improved UX, expire the session storage when the token must surely be expired, for those rare long sessions
        // session lasts 8 hours, per https://auth.uq.edu.au/about/

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
        /* istanbul ignore else  */
        if (this.isMock() && new MockApi().getUserParameter() !== 'public') {
            return locale.UQLID_COOKIE_MOCK;
        }
        return this.getCookie(locale.SESSION_COOKIE_NAME);
    }

    getLibraryGroupCookie() {
        // I am guessing this field is used as a proxy for 'has a Library account, not just a general UQ login'
        /* istanbul ignore else  */
        if (this.isMock() && new MockApi().getUserParameter() !== 'public') {
            return locale.USERGROUP_COOKIE_MOCK;
        }
        return this.getCookie(locale.SESSION_USER_GROUP_COOKIE_NAME);
    }

    getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; ++i) {
            const pair = cookies[i].trim().split('=');
            if (!!pair[0] && pair[0] === name) {
                return !!pair[1] ? pair[1] : /* istanbul ignore next */ undefined;
            }
        }
        return undefined;
    }

    fetchMock(url, options = null) {
        const response = new MockApi().mockfetch(url, options);
        if (!response.ok || !response.body) {
            const msg = `fetchMock: An error has occured in mock for ${url}: ${response.status}`;
            console.log(msg);
            throw new Error(msg);
        }
        return response.body || /* istanbul ignore next */ {};
    }

    isMock() {
        return process.env.USE_MOCK;
    }
}

export default ApiAccess;

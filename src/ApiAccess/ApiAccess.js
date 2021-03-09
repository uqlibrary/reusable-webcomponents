import MockApi from '../../mock/MockApi';

let initCalled;

class ApiAccess {
    constructor() {
        this.STORAGE_ACCOUNT_KEYNAME = 'userAccount';

        // Bindings
        this.loadJS = this.loadJS.bind(this);
    }

    removeAccountStorage() {
        sessionStorage.removeItem(this.STORAGE_ACCOUNT_KEYNAME);
    }

    async getAccount() {
        console.log('ApiAccess::getAccount');
        if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
            // no cookie, force them to log in again
            console.log('ApiAccess::getAccount - no cookie, force them to log in again')
            this.removeAccountStorage();
            return false;
        }

        let accountData = JSON.parse(sessionStorage.getItem(this.STORAGE_ACCOUNT_KEYNAME));
        console.log('account from session storage = ', accountData);
        if (accountData !== null) {
            return accountData;
        }

        const account = await this.fetchAccount();
        console.log('ApiAccess::getAccount: account = ', account);

        sessionStorage.setItem(this.STORAGE_ACCOUNT_KEYNAME, JSON.stringify(account));

        return account;
    }

    // reference: https://dmitripavlutin.com/javascript-fetch-async-await/
    async fetchAccount() {
        console.log('fetchAccount start');
        if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
            // no cookie so we wont bother asking for an account that cant be returned
            console.log('no cookie so we wont bother asking for an account that cant be returned');
            return false;
        }

        const url = '/account';
        if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
            console.log('fetchAccount get mock');
            return this.fetchMock(url);
        } else {
            console.log('fetchAccount get real');
            const response = await this.fetchFromServer(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-uql-token': this.getSessionCookie(),
                    options: {params: {ts: `${new Date().getTime()}`}},
                }
            });
            console.log('ACCOUNT API response = ', response);
            console.log('ACCOUNT API response.ok = ', response.ok);
            if (!response.ok) {
                console.log(`An error has occured: ${response.status}`);
                const message = `An error has occured: ${response.status} ${response.statusText}`;
                throw new Error(message);
            }
            const result = await response.json();
            console.log('ACCOUNT API response.json() = ', result);
            return result;
        }
    }

    fetchFromServer(url, options) {
        console.log('fetchApi from server: ', url);
        const API_URL = process.env.API_URL || 'https://api.library.uq.edu.au/staging';
        const responsePromise = fetch(`${API_URL}${url}`, options);
        console.log('server - fetchApi got: ', responsePromise);
        return responsePromise;
    }

    getSessionCookie() {
        const SESSION_COOKIE_NAME = 'UQLID';
        const cookie = this.getCookie(SESSION_COOKIE_NAME);
        const sessionCookie = cookie === null ? undefined : cookie;

        console.log('sessionCookie = ', sessionCookie);

        return sessionCookie;
    }

    getLibraryGroupCookie() {
        const SESSION_USER_GROUP_COOKIE_NAME = 'UQLID_USER_GROUP';
        // I am guessing this field says whether they have a library login, not just a general uq login
        const cookie = this.getCookie(SESSION_USER_GROUP_COOKIE_NAME);
        const libraryGroupId = cookie === null ? undefined : cookie;

        console.log('libraryGroupId = ', libraryGroupId);

        return libraryGroupId;
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

    fetchMock(url, options = null) {
        console.log('masterfetch from mock: ', url);
        const response = (new MockApi).mockfetch(url, options);
        console.log('mock - masterfetch got: ', response);
        if (!response.ok || !response.body) {
            console.log(`An error has occured: ${response.status}`);
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        return response.body;
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
    };

    connectedCallback() {
        this.loadJS();
    }
}

export default ApiAccess;

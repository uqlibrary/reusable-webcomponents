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
        if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
            // no cookie, force them to log in again
            this.removeAccountStorage();
            return false;
        }

        let accountData = JSON.parse(sessionStorage.getItem(this.STORAGE_ACCOUNT_KEYNAME));
        console.log('account from session storage = ', accountData);
        if (accountData !== null) {
            return accountData;
        }

        const urlPath = '/account';
        const options = {
            'x-uql-token': this.getSessionCookie(),
            options: {params: {ts: `${new Date().getTime()}`}}
        }
        const account = await this.fetchAPI(urlPath, options);

        sessionStorage.setItem(this.STORAGE_ACCOUNT_KEYNAME, JSON.stringify(account));

        return account;
    }

    async fetchAPI(urlPath, options) {
        if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
            // no cookie so we wont bother asking for an account that cant be returned
            console.log('no cookie so we wont bother asking for an account that cant be returned');
            return false;
        }

        if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
            return this.fetchMock(urlPath);
        } else {
            // reference: https://dmitripavlutin.com/javascript-fetch-async-await/
            const response = await this.fetchFromServer(urlPath, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options,
                }
            });
            if (!response.ok) {
                console.log(`An error has occured: ${response.status}`);
                const message = `An error has occured: ${response.status} ${response.statusText}`;
                throw new Error(message);
            }
            const result = await response.json();
            return result;
        }
    }

    fetchFromServer(urlPath, options) {
        const API_URL = process.env.API_URL || 'https://api.library.uq.edu.au/staging';
        return fetch(`${API_URL}${urlPath}`, options);
    }

    getSessionCookie() {
        const SESSION_COOKIE_NAME = 'UQLID';
        return this.getCookie(SESSION_COOKIE_NAME);
    }

    getLibraryGroupCookie() {
        // I am guessing this field indicates that they have a Library account, not just a general UQ login
        const SESSION_USER_GROUP_COOKIE_NAME = 'UQLID_USER_GROUP';
        return this.getCookie(SESSION_USER_GROUP_COOKIE_NAME);
    }

    getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i=0 ; i < cookies.length ; ++i) {
            const pair = cookies[i].trim().split('=');
            if (!!pair[0] && pair[0] === name) {
                return !!pair[1] ? pair[1] : undefined;
            }
        }
        return undefined;
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

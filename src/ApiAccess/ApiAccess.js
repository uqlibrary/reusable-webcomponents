
let initCalled;

class ApiAccess {
    constructor() {
        // Bindings
        this.loadJS = this.loadJS.bind(this);
    }

    // reference: https://dmitripavlutin.com/javascript-fetch-async-await/
    async getAccount() {
        if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
            console.log('no cookie so we wont bother asking for an account that cant be returned');
            return false;
        }

        const response = await fetch('https://api.library.uq.edu.au/staging/account', {
            headers: {
                'Content-Type': 'application/json',
                'x-uql-token': this.getSessionCookie(),
            }
        });
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        const account = await response.json();
        return account;
    }

    getSessionCookie() {
        if (this.sessionCookie === undefined) {
            const SESSION_COOKIE_NAME = 'UQLID';
            const sessionCookie = this.getCookie(SESSION_COOKIE_NAME);
            this.sessionCookie = sessionCookie === null ? undefined : sessionCookie;
        }

        return this.sessionCookie;
    }

    // I am guessing this field says whether they have a library login, not just a general uq login
    getLibraryGroupCookie() {
        if (this.libraryGroupId === undefined) {
            const SESSION_USER_GROUP_COOKIE_NAME = 'UQLID_USER_GROUP';
            const sessionGroupId = this.getCookie(SESSION_USER_GROUP_COOKIE_NAME);
            this.libraryGroupId = sessionGroupId === null ? undefined : sessionGroupId;
        }

        return this.libraryGroupId;
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

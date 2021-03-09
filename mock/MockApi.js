/* eslint-disable */
import Cookies from 'js-cookie';
import * as mockData from './data';
import ApiRoutes from "../src/ApiRoutes";
import { apiLocale as apilocale } from '../src/ApiAccess/ApiAccess.locale';

import {
    libHours,
} from './data/account';

const queryString = require('query-string');

// set session cookie in mock mode
Cookies.set(apilocale.SESSION_COOKIE_NAME, 'abc123');
Cookies.set(apilocale.SESSION_USER_GROUP_COOKIE_NAME, 'LIBRARYSTAFFB');

// Get user from query string
let user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;
console.log('user = ', user);

mockData.accounts.uqrdav10 = mockData.uqrdav10.account;
mockData.accounts.uqagrinb = mockData.uqagrinb.account;
if (user && !mockData.accounts[user]) {
    console.warn(
        `API MOCK DATA: User name (${user}) is not found, please use one of the usernames from mock data only...`,
    );
}

// default user is researcher if user is not defined
user = user || 'vanilla';

class MockApi {
    response(httpstatus, body, withDelay) {
        const response = {
            body: body,
            headers: {},
            ok: httpstatus === 200,
            redirected: false,
            status: httpstatus,
            statusText: '',
            type: 'basic',
            url: this.url,
        };
        if (withDelay) {
            const randomTime = Math.floor(Math.random() * 100) + 1; // Change these values to delay mock API
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(response);
                }, randomTime);
            });
        }
        return response
    }

    mockfetch(url, options) {
        this.url = url;
        const apiRoute = new ApiRoutes();
        switch (url) {
            case apiRoute.CURRENT_ACCOUNT_API.apiUrl:
                console.log('Loading Account');
                // mock account response
                if (user === 'public') {
                    return this.response(403, {});
                } else if (mockData.accounts[user]) {
                    return this.response(200, mockData.accounts[user]);
                }
                return this.response(403, {});

            case apiRoute.CURRENT_AUTHOR_API.apiUrl:
                console.log('Loading eSpace Author');
                // mock current author details from fez
                if (user === 'anon') {
                    return this.response(403, {});
                } else if (mockData.currentAuthor[user]) {
                    return this.response(200, mockData.currentAuthor[user]);
                }
                return this.response(404, {});

            case apiRoute.AUTHOR_DETAILS_API.apiUrl:
                console.log('Loading eSpace Author Details');
                // mock current author details
                if (user === 'anon') {
                    return this.response(403, {});
                } else if (mockData.authorDetails[user]) {
                    return this.response(200, mockData.authorDetails[user]);
                }
                return this.response(404, {});

            case apiRoute.CHAT_API.apiUrl:
                return this.response(200, {online: true}, true);

            case apiRoute.LIB_HOURS_API.apiUrl:
                return this.response(200, libHours, true);
                // return this.response(500, {}, true);

            default:
                console.log('url not mocked...', url);
                return this.response(404, {message: `MOCK URL NOT FOUND: ${url}`});
        }
    }
}

export default MockApi;

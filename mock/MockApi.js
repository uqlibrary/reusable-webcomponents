/* eslint-disable */
// import { api, sessionApi } from 'config';
// import MockAdapter from 'axios-mock-adapter';
// import Cookies from 'js-cookie';
// import { SESSION_COOKIE_NAME } from 'config';
// import * as routes from 'repositories/routes';
import * as mockData from './data';

import {
    libHours,
    printBalance,
    loans,
    possibleRecords,
    incompleteNTROs,
} from './data/account';
import ApiAccess from "../src/ApiAccess/ApiAccess";

const queryString = require('query-string');

// set session cookie in mock mode
// Cookies.set(SESSION_COOKIE_NAME, 'abc123');

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
    withDelay(response, config) {
        const randomTime = Math.floor(Math.random() * 100) + 1; // Change these values to delay mock API
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(response);
            }, randomTime);
        });
    };

    response(httpstatus, body) {
        return {
            body: body,
            headers: {},
            ok: httpstatus === 200,
            redirected: false,
            status: httpstatus,
            statusText: '',
            type: 'basic',
            url: this.url,
        }
    }

    mockfetch(url, options) {
        this.url = url;
        const accountApiRoute = '/account';
        switch (url) {
            case accountApiRoute:
                console.log('Loading Account');
                // mock account response
                if (user === 'public') {
                    return this.response(403, {});
                } else if (mockData.accounts[user]) {
                    return this.response(200, mockData.accounts[user]);
                }
                return this.response(403, {});

            default:
                console.log('url not mocked...', url);
                return this.response(404, {message: `MOCK URL NOT FOUND: ${url}`});
        }
    }

// mock.onGet(routes.CURRENT_AUTHOR_API().apiUrl)
//     .reply(() => {
//         console.log('Loading eSpace Author');
//         // mock current author details from fez
//         if (user === 'anon') {
//             return [403, {}];
//         } else if (mockData.currentAuthor[user]) {
//             return [200, mockData.currentAuthor[user]];
//         }
//         return [404, {}];
//     });
//
// mock.onGet(routes.AUTHOR_DETAILS_API({ userId: user }).apiUrl)
//     .reply(() => {
//         console.log('Loading eSpace Author Details');
//         // mock current author details
//         if (user === 'anon') {
//             return [403, {}];
//         } else if (mockData.authorDetails[user]) {
//             return [200, mockData.authorDetails[user]];
//         }
//         return [404, {}];
//     });
//
//     mock.onGet(routes.CHAT_API().apiUrl)
//         .reply(withDelay([200, {online: true}]));
//
//     mock.onGet(routes.PRINTING_API().apiUrl)
//         .reply(withDelay([200, printBalance]));
//
//     mock.onGet(routes.LOANS_API().apiUrl)
//         .reply(withDelay([200, loans]));
//
//     mock.onGet(routes.LIB_HOURS_API().apiUrl)
//         .reply(withDelay([200, libHours]));
//     // .reply(withDelay([500, {}]));
//
//     mock.onGet(routes.POSSIBLE_RECORDS_API().apiUrl)
//         .reply(withDelay([200, possibleRecords]));
//
//     mock.onGet(routes.INCOMPLETE_NTRO_RECORDS_API().apiUrl)
//         .reply(withDelay([200, incompleteNTROs]));
//
//     mock
//         .onAny()
//         .reply(config => {
//             console.log('url not mocked...', config);
//             return [404, {message: `MOCK URL NOT FOUND: ${config.url}`}];
//         });
// }
}

export default MockApi;

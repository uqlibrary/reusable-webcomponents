/* eslint-disable */
import Cookies from 'js-cookie';
import * as mockData from './data';
import ApiRoutes from "../src/ApiRoutes";
import { apiLocale as apilocale } from '../src/ApiAccess/ApiAccess.locale';

import {
    libHours,
} from './data/account';

class MockApi {
    constructor() {
        // set session cookie in mock mode
        Cookies.set(apilocale.SESSION_COOKIE_NAME, apilocale.UQLID_COOKIE_MOCK);
        Cookies.set(apilocale.SESSION_USER_GROUP_COOKIE_NAME, apilocale.USERGROUP_COOKIE_MOCK);

        // Get user from query string
        const user = this.getUserParameter();

        this.mockData = mockData
        this.mockData.accounts.uqrdav10 = mockData.uqrdav10.account;
        this.mockData.accounts.uqagrinb = mockData.uqagrinb.account;
        if (user && user !== 'public' && !mockData.accounts[user]) {
            console.warn(
                `API MOCK DATA: User name (${user}) is not found, please use one of the usernames from mock data only...`,
            );
        }

        // default user is researcher if user is not defined
        this.user = user || 'vanilla';
    }

    getUserParameter() {
        const queryString = require('query-string');
        return queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;
    }

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
            // TODO
            // const randomTime = Math.floor(Math.random() * 100) + 1; // Change these values to delay mock API
            // return new Promise(function (resolve, reject) {
            //     setTimeout(function () {
            //         resolve(response);
            //     }, randomTime);
            // });
        }
        return response
    }

    mockfetch(url, options) {
        this.url = url;
        const apiRoute = new ApiRoutes();
        switch (url) {
            case apiRoute.CURRENT_ACCOUNT_API().apiUrl:
                // mock account response
                if (this.user === 'public') {
                    return this.response(403, {});
                } else if (this.mockData.accounts[this.user]) {
                    return this.response(200, this.mockData.accounts[this.user]);
                }
                return this.response(403, {});

            case apiRoute.CURRENT_AUTHOR_API().apiUrl:
                // mock current author details from fez
                if (this.user === 'anon') {
                    return this.response(403, {});
                } else if (this.mockData.currentAuthor[this.user]) {
                    return this.response(200, this.mockData.currentAuthor[this.user]);
                }
                return this.response(404, {});

            case apiRoute.AUTHOR_DETAILS_API().apiUrl:
                // mock current author details
                if (this.user === 'anon') {
                    return this.response(403, {});
                } else if (this.mockData.authorDetails[this.user]) {
                    return this.response(200, this.mockData.authorDetails[this.user]);
                }
                return this.response(404, {});

            case apiRoute.CHAT_API().apiUrl:
                return this.response(200, {online: true}, true);
                // return this.response(200, {online: false}, true);

            case apiRoute.LIB_HOURS_API().apiUrl:
                return this.response(200, libHours, true);
                // return this.response(500, {}, true);

            default:
                console.log('url not mocked...', url);
                return this.response(404, {message: `MOCK URL NOT FOUND: ${url}`});
        }
    }
}

export default MockApi;

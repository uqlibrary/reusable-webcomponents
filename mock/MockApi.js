/* eslint-disable */
import Cookies from 'js-cookie';
import * as mockData from './data/account';
import ApiRoutes from '../src/ApiRoutes';
import { apiLocale as apilocale } from '../src/ApiAccess/ApiAccess.locale';

import { alerts, examSuggestions, learningResourceSuggestions, libHours, primoSuggestions } from './data/misc';

import trainingEvents from './data/trainingobject';

class MockApi {
    constructor() {
        // Get user from query string
        const user = this.getUserParameter();

        // set session cookie in mock mode
        if (user !== 'public') {
            Cookies.set(apilocale.SESSION_COOKIE_NAME, apilocale.UQLID_COOKIE_MOCK);
            Cookies.set(apilocale.SESSION_USER_GROUP_COOKIE_NAME, apilocale.USERGROUP_COOKIE_MOCK);
        }

        const chatStatusOffline = this.getChatStatusParameter() === "true";
        this.chatStatusOffline = chatStatusOffline || false;

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
        const queryString = new URLSearchParams(window.location.search);
        return !!queryString ? queryString.get('user') : window.location.hash.substring(window.location.hash.indexOf('?')).user;
    }

    getChatStatusParameter() {
        const queryString = new URLSearchParams(window.location.search);
        return !!queryString ? queryString.get('chatstatusoffline') : window.location.hash.substring(window.location.hash.indexOf('?')).chatstatusoffline;
    }

    response(httpstatus, body, withDelay) {
        const response = {
            body: body,
            headers: {},
            ok: httpstatus === 200,
            redirected: false,
            status: !!body ? httpstatus : /* istanbul ignore next */ 500,
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
        console.log('mockfetch url = ', url);
        this.url = url;
        const apiRoute = new ApiRoutes();

        const queryString = new URLSearchParams(window.location.search);
        const requestType = !!queryString ? queryString.get('requestType') : window.location.hash.substring(window.location.hash.indexOf('?')).requestType;

        const urlWithoutQueryString = !!url && url.length > 0 ? url.split('?')[0] : '';
        if (url.startsWith('openathens/check/')) {
            if (requestType === 'error') {
                // when openathens has an internal error
                return this.response(503, {error: 'some message'});
            } else if (requestType === 'failure') {
                // when openathens says "no"
                const openAthensSuccessResponse = { available: false };
                return this.response(200, openAthensSuccessResponse, true);
            }
            // otherwise, openathens says "yes"
            // default success
            return this.response(200, { available: true }, true);
        }

        switch (urlWithoutQueryString) {
            case apiRoute.CURRENT_ACCOUNT_API().apiUrl:
                // mock account response
                if (this.user === 'public') {
                    return this.response(403, {});
                }
                if (this.mockData.accounts[this.user]) {
                    return this.response(200, this.mockData.accounts[this.user]);
                }
                return this.response(403, {});

            case apiRoute.CURRENT_AUTHOR_API().apiUrl:
                // mock current author details from fez
                /* istanbul ignore next */
                if (this.user === 'anon') {
                    return this.response(403, {});
                }
                if (this.mockData.currentAuthor[this.user]) {
                    return this.response(200, this.mockData.currentAuthor[this.user]);
                }
                return this.response(404, {});

            case apiRoute.CHAT_API().apiUrl:
                if (this.user === 'errorUser') {
                    return this.response(403, {});
                }
                if(!this.chatStatusOffline) {
                    return this.response(200, {online: true}, true);
                }
                return this.response(200, {online: false}, true);

            case apiRoute.LIB_HOURS_API().apiUrl:
                if (this.user === 'errorUser') {
                    return this.response(403, {});
                    // return this.response(500, {}, true);
                }
                return this.response(200, libHours, true);

            case apiRoute.ALERT_API().apiUrl:
                if (this.user === 'errorUser') {
                    return this.response(403, {});
                    // return this.response(500, {}, true);
                }
                const fakeUrl = new URL(`https://api/${url}`);
                let searchParams = new URLSearchParams(fakeUrl.search);

                let system;
                if (searchParams.has('system')) {
                    system = searchParams.get('system');
                }
                // it seems more flexible to filter the mock data here rather than create multiple mock files
                // and conditionally return them
                const filteredAlerts = alerts.filter(a => {
                    if (a.systems.length === 0) {
                        return true; // display this alert on all systems
                    }
                    if (!!system && a.systems.includes(system)) {
                        return true; // this alert is specific to this system - display
                    }
                    return false; // this alert is specific to a different system than this one - dont display
                })
                return this.response(200, filteredAlerts, true);

            case apiRoute.TRAINING_API().apiUrl:
                if (this.user === 'errorUser') {
                    return this.response(403, {error: 'true'});
                    // return this.response(500, null, true);
                }
                if (this.user === 'emptyUser') {
                    return this.response(200, [], true);
                }
                return this.response(200, trainingEvents, true);

            default:
                // splitting the '?' out of some apis doesn't work
                switch (url) {
                    case apiRoute.PRIMO_SUGGESTIONS_API_GENERIC('DDDDD').apiUrl: // to test the repeating key works and doesnt pass just because the mock data doesnt exist
                    case apiRoute.PRIMO_SUGGESTIONS_API_GENERIC('bear').apiUrl:
                    case apiRoute.PRIMO_SUGGESTIONS_API_GENERIC('beard').apiUrl:
                    case apiRoute.PRIMO_SUGGESTIONS_API_GENERIC('').apiUrl:
                        if (this.user === 'errorUser') {
                            return this.response(403, {});
                            // return this.response(500, {}, true);
                        }
                        return this.response(200, primoSuggestions, true);

                    case apiRoute.EXAMS_SUGGESTIONS_API('PHIL').apiUrl:
                    case apiRoute.EXAMS_SUGGESTIONS_API('').apiUrl:
                        if (this.user === 'errorUser') {
                            return this.response(403, {});
                            // return this.response(500, {}, true);
                        }
                        return this.response(200, examSuggestions, true);

                    case apiRoute.SUGGESTIONS_API_PAST_COURSE('PHIL').apiUrl:
                    case apiRoute.SUGGESTIONS_API_PAST_COURSE('').apiUrl:
                        if (this.user === 'errorUser') {
                            return this.response(403, {});
                            // return this.response(500, {}, true);
                        }
                        return this.response(200, learningResourceSuggestions, true);


                    // secure collection checks

                    // http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=exams&file=phil1010.pdf
                    case apiRoute.SECURE_COLLECTION_CHECK_API({ path: 'exams/phil1010.pdf' }).apiUrl:
                        return this.response(200, {response: 'Login required'});

                    case apiRoute.SECURE_COLLECTION_FILE_API({ path: 'exams/phil1010.pdf' }).apiUrl:
                        return this.response(
                            200,
                            {
                                url:
                                    'https://files.library.uq.edu.au/secure/exams/phil1010.pdf?Expires=1621059344&Signature=long_string&Key-Pair-Id=APKAJNDQICYW445PEOSA',
                                displaypanel: 'redirect',
                            },
                        );

                    // http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=collection&file=doesntExist
                    case apiRoute.SECURE_COLLECTION_CHECK_API({ path: 'collection/doesntExist' }).apiUrl:
                            return this.response(200, { response: 'No such collection' });
                    case apiRoute.SECURE_COLLECTION_FILE_API({ path: 'collection/doesntExist' }).apiUrl:
                            return this.response(200, { response: 'No such collection' });

                    // http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=unknown&file=unknown
                    // https://files.library.uq.edu.au/testlogin/unknown/unknown
                    case apiRoute.SECURE_COLLECTION_CHECK_API({ path: 'unknown/unknown' }).apiUrl:
                            return this.response(200, { response: 'No such collection' });

                    // https://files.library.uq.edu.au/unknown/unknown
                    case apiRoute.SECURE_COLLECTION_FILE_API({ path: 'unknown/unknown' }).apiUrl:
                            return this.response(200, { response: 'No such collection' });

                    // http://localhost:8080/src/applications/securecollection/demo.html?user=public&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf
                    // https://files.library.uq.edu.au/testlogin/exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf
                    case apiRoute.SECURE_COLLECTION_CHECK_API({
                            path: 'exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf',
                        }).apiUrl:
                        return this.response(200, {response: 'Login required'});

                    // https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf
                    case apiRoute.SECURE_COLLECTION_FILE_API({ path: 'exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf' })
                                .apiUrl:
                            return this.response(
                                200,
                                {
                                    url:
                                        'https://files.library.uq.edu.au/secure/exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf?Expires=1621059344&Signature=long_string&Key-Pair-Id=APKAJNDQICYW445PEOSA',
                                    displaypanel: 'redirect',
                                },
                            );

                    // it is intended this mock is called only with a non-uq user type, eg emcommunity
                    // http://localhost:8080/src/applications/securecollection/demo.html?user=emcommunity&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_EMuser.pdf
                    // https://files.library.uq.edu.au/testlogin/exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_EMuser.pdf
                    case apiRoute.SECURE_COLLECTION_CHECK_API({ path: 'exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_EMuser.pdf' })
                                .apiUrl:
                        if (this.user.match(/^em/) !== null) {
                            return this.response(200, {response: 'Invalid User'});
                        }
                        return this.response(
                            200,
                            {
                                url:
                                    'https://files.library.uq.edu.au/secure/exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf?Expires=1621059344&Signature=long_string&Key-Pair-Id=APKAJNDQICYW445PEOSA',
                                displaypanel: 'statutoryCopyright',
                                acknowledgementRequired: true,
                            },
                        );

                    // http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=coursebank&file=111111111111111.pdf
                    // https://files.library.uq.edu.au/coursebank/111111111111111.pdf
                    case apiRoute.SECURE_COLLECTION_CHECK_API({ path: 'coursebank/111111111111111.pdf' }).apiUrl:
                        return this.response(200, {response: 'Login required'});
                    case apiRoute.SECURE_COLLECTION_FILE_API({ path: 'coursebank/111111111111111.pdf' }).apiUrl:
                        return this.response(
                            200,
                            {
                                url:
                                    'https://files.library.uq.edu.au/secure/coursebank/111111111111111.pdf?Expires=1621060025&Signature=longString&Key-Pair-Id=APKAJNDQICYW445PEOSA',
                                displaypanel: 'statutoryCopyright',
                                acknowledgementRequired: true,
                            },
                        );

                    // http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=coursebank&file=22222222222.pdf
                    // https://files.library.uq.edu.au/coursebank/22222222222.pdf
                    case apiRoute.SECURE_COLLECTION_CHECK_API({ path: 'coursebank/22222222222.pdf' }).apiUrl:
                        return this.response(
                            200,
                            {
                                url:
                                    'https://files.library.uq.edu.au/secure/coursebank/22222222222.pdf?Expires=1621060025&Signature=longString&Key-Pair-Id=APKAJNDQICYW445PEOSA',
                                displaypanel: 'redirect',
                            },
                        );

                    // http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=bomdata&file=abcdef.zip
                    // https://files.library.uq.edu.au/bomdata/abcdef.zip
                    case apiRoute.SECURE_COLLECTION_CHECK_API({ path: 'bomdata/abcdef.zip' }).apiUrl:
                        return this.response(200, {response: 'Login required'});
                    case apiRoute.SECURE_COLLECTION_FILE_API({ path: 'bomdata/abcdef.zip' }).apiUrl:
                        return this.response(
                            200,
                            {
                                url:
                                    'https://files.library.uq.edu.au/secure/bomdata/abcdef.zip?Expires=1621060025&Signature=longString&Key-Pair-Id=APKAJNDQICYW445PEOSA',
                                displaypanel: 'commercialCopyright',
                                acknowledgementRequired: true,
                                hasList: true, // as yet unused
                            },
                        );

                    // (list of example Thomson papers at http://ezproxy.library.uq.edu.au/loggedin/UQ/resources/thomson_classic_legal.html note, url will change as ezproxy is decommissioned)
                    // https://files.library.uq.edu.au/thomson/classic_legal_texts/Thynne_Accountability_And_Control.pdf
                    // http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=thomson&file=classic_legal_texts/Thynne_Accountability_And_Control.pdf
                    case apiRoute.SECURE_COLLECTION_CHECK_API({ path: 'thomson/classic_legal_texts/Thynne_Accountability_And_Control.pdf' })
                                .apiUrl:
                        return this.response(200, {response: 'Login required'});
                    case apiRoute.SECURE_COLLECTION_FILE_API({ path: 'thomson/classic_legal_texts/Thynne_Accountability_And_Control.pdf' })
                                .apiUrl:
                        return this.response(
                            200,
                            {
                                url:
                                    'https://files.library.uq.edu.au/secure/thomson/classic_legal_texts/Thynne_Accountability_And_Control.pdf?Expires=1621380128&Signature=longstring&Key-Pair-Id=APKAJNDQICYW445PEOSA',
                                displaypanel: 'redirect',
                                acknowledgementRequired: false,
                                hasList: true, // as yet unused
                            },
                        );

                    // a link without a file extension
                    // http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=coursebank&file=2222222
                    case apiRoute.SECURE_COLLECTION_CHECK_API({ path: 'coursebank/2222222' }).apiUrl:
                        return this.response(200, {response: 'Login required'});
                    case apiRoute.SECURE_COLLECTION_FILE_API({ path: 'coursebank/2222222' }).apiUrl:
                        return this.response(
                                200,
                                {
                                    url:
                                        'https://files.library.uq.edu.au/secure/coursebank/2222222?Expires=1621060025&Signature=longString&Key-Pair-Id=APKAJNDQICYW445PEOSA',
                                    displaypanel: 'statutoryCopyright',
                                    acknowledgementRequired: true,
                                },
                            );

                    // http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=api&file=fails
                    case apiRoute.SECURE_COLLECTION_CHECK_API({ path: 'api/fails' }).apiUrl:
                            return this.response(500, {});
                    case apiRoute.SECURE_COLLECTION_FILE_API({ path: 'api/fails' }).apiUrl:
                            return this.response(500, {});

                    /* istanbul ignore next  */
                    default:
                        console.log('url not mocked...', url);
                        return this.response(404, {message: `MOCK URL NOT FOUND: ${url}`});
                }

        }
    }
}

export default MockApi;

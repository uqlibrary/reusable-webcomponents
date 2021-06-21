import MockApi from '../../mock/MockApi';
import ApiRoutes from '../ApiRoutes';
import { apiLocale as locale } from './ApiAccess.locale';
import fetchJsonp from 'fetch-jsonp';
import { getCookieValue } from '../helpers/cookie';

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

    /**
     * Loads the primo search suggestions
     * @returns {function(*)}
     */
    async loadPrimoSuggestions(keyword) {
        console.log('loadPrimoSuggestions: ', keyword);
        const route = new ApiRoutes().PRIMO_SUGGESTIONS_API_GENERIC(keyword);
        const url = route.apiUrl;
        return await this.fetchJsonpAPI(url, {
            jsonpCallbackFunction: 'byutv_jsonp_callback_c631f96adec14320b23f1cac342d30f6',
            timeout: 3000,
        })
            .then((data) => {
                return (
                    (data &&
                        data.response &&
                        data.response.docs &&
                        data.response.docs.map((item, index) => {
                            return {
                                ...item,
                                index,
                            };
                        })) ||
                    /* istanbul ignore next */ []
                );
            })
            .catch((error) => {
                console.log('error loading Primo suggestions ', error);
                const msg = `error loading Primo suggestions: ${error.message}`;
                throw new Error(msg);
            });
    }

    async loadExamPaperSuggestions(keyword) {
        return await this.fetchAPI(new ApiRoutes().EXAMS_SUGGESTIONS_API(keyword).apiUrl)
            .then((data) => {
                return data.map((item, index) => {
                    const title = !!item.course_title ? ` (${item.course_title})` : '';
                    return {
                        text: `${item.name}${title}`,
                        courseid: item.name,
                        index,
                    };
                });
            })
            .catch((error) => {
                console.log('error loading Exam suggestions ', error);
                const msg = `error loading Exam suggestions: ${error.message}`;
                throw new Error(msg);
            });
    }

    async loadHomepageCourseReadingListsSuggestions(keyword) {
        return await this.fetchAPI(new ApiRoutes().SUGGESTIONS_API_PAST_COURSE(keyword).apiUrl)
            .then((data) => {
                return data.map((item, index) => {
                    const specifier =
                        (item.course_title ? `${item.course_title} | ` : '') +
                        (item.campus ? `${item.campus} , ` : '') +
                        (item.period ? item.period.toLowerCase() : '');
                    const append = !!specifier ? ` ( ${specifier} )` : '';
                    return {
                        ...item,
                        text: `${item.name}${append}`,
                        index,
                    };
                });
            })
            .catch((error) => {
                console.log('error loading Learning Resource suggestions ', error);
                const msg = `error loading Learning Resource suggestions: ${error.message}`;
                throw new Error(msg);
            });
    }

    async fetchAPI(urlPath, headers, tokenRequired = false) {
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

    async fetchJsonpAPI(url, headers) {
        console.log('fetchJsonpAPI: url = ', url);
        const options = {
            ...headers,
        };

        /* istanbul ignore else  */
        if (this.isMock()) {
            try {
                console.log('mocking url : ', url);
                return this.fetchMock(url);
            } catch (e) {
                const msg = `mock api error: ${e.message}`;
                console.log(msg);
                throw new Error(msg);
            }
        } else {
            // this assumes non api.library urls
            const response = await fetchJsonp(url, options);
            console.log('fetchJsonp got ', response);
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
        const connector = urlPath.indexOf('?') > -1 ? '&' : '?';

        return fetch(`${API_URL}${urlPath}${connector}${new Date().getTime()}`, {
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
        return getCookieValue(locale.SESSION_COOKIE_NAME);
    }

    getLibraryGroupCookie() {
        // I am guessing this field is used as a proxy for 'has a Library account, not just a general UQ login'
        /* istanbul ignore else  */
        if (this.isMock() && new MockApi().getUserParameter() !== 'public') {
            return locale.USERGROUP_COOKIE_MOCK;
        }
        return getCookieValue(locale.SESSION_USER_GROUP_COOKIE_NAME);
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

    /**
     * display an error in the bottom left corner of the screen if we have a problem from the api
     */
    showApiErrorDiv() {
        let apiErrorDiv = document.getElementById('api-error');
        if (!apiErrorDiv) {
            apiErrorDiv = document.createElement('div');
            !!apiErrorDiv && apiErrorDiv.setAttribute('id', 'api-error');
            !!apiErrorDiv && apiErrorDiv.setAttribute('data-testid', 'api-error');
            !!apiErrorDiv && (apiErrorDiv.style.position = 'fixed');
            !!apiErrorDiv && (apiErrorDiv.style.left = 0);
            !!apiErrorDiv && (apiErrorDiv.style.bottom = 0);
            !!apiErrorDiv && (apiErrorDiv.style.color = '#fff');
            !!apiErrorDiv && (apiErrorDiv.style.backgroundColor = '#951126');
            !!apiErrorDiv && (apiErrorDiv.style.padding = '12px 18px');
            const errorMessage = 'There was a problem - if the display is incorrect, please refresh the page.';
            !!apiErrorDiv && (apiErrorDiv.innerHTML = errorMessage);

            const body = document.querySelector('body');
            !!apiErrorDiv && !!body && body.appendChild(apiErrorDiv);
        }
        apiErrorDiv.style.display = 'block';
        // apiErrorDiv.style.visibility = 'visible';
        // apiErrorDiv.style.opacity = '1';
        // apiErrorDiv.style.transition = "visibility 0s, opacity 0.5s linea";
        setTimeout(function () {
            // apiErrorDiv.style.visibility = "hidden";
            // apiErrorDiv.style.opacity = "0";
            apiErrorDiv.style.display = 'none';
            // apiErrorDiv.style.transition = "visibility 0s, opacity 0.5s linea";
        }, 3000);
    }
}

const throwFetchErrors = (response) => {
    if (!response.ok) {
        const status = response.status || 'status undefined';
        const statusText = response.statusText || 'status message undefined';
        console.log('throwing');
        throw Error(`Error ${status} - ${statusText}`);
    }
    return response;
};

export default ApiAccess;

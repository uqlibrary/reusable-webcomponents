import MockApi from '../../mock/MockApi';
import ApiRoutes from '../ApiRoutes';
import { apiLocale as locale } from './ApiAccess.locale';
import fetchJsonp from 'fetch-jsonp';
import { clearCookie, getCookieValue } from '../helpers/cookie';

let initCalled;

class ApiAccess {
    async getAccount() {
        // cleanup sessionStorage as we are no longer using sessionstorage to hold the account
        // can be removed some months after March 2023
        // (it generated too many errors as it turns out we cant know when their session expires because
        // other UQ sites may have crrated the session)
        this.removeAccountStorage();

        if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
            // no cookie, force them to log in again
            return false;
        }

        const accountApi = new ApiRoutes().CURRENT_ACCOUNT_API();
        const urlPath = accountApi.apiUrl;
        // const options = !!accountApi.options ? accountApi.options : {};
        const options = {}; // options not currently used
        return await this.fetchAPI(urlPath, options, true).then((account) => {
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

    async loadAlerts(system) {
        const alertApi = new ApiRoutes().ALERT_API(system);
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
            take: maxEventCount,
            // filterIds should be an array. Passing an array as value to
            // URLSearchParams doesn't seem to be working.
            'filterIds[]': filterId, // Value of filter to extract data from career hub.
        };
        const filterParams = new URLSearchParams(filter).toString();

        // Need to decode the url-encoded version of '[]' in filterIds.
        const url = urlPath.concat('?', decodeURIComponent(filterParams));

        return await this.fetchAPI(url)
            .then((trainingData) => {
                return trainingData;
            })
            .catch((error) => {
                throw new Error(error.message());
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
                    const title = !!item.course_title ? ` (${item.course_title})` : /* istanbul ignore next */ '';
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
                        (item.course_title ? `${item.course_title} | ` : /* istanbul ignore next */ '') +
                        (item.campus ? `${item.campus} , ` : /* istanbul ignore next */ '') +
                        (item.period ? item.period.toLowerCase() : /* istanbul ignore next */ '');
                    const append = !!specifier ? ` ( ${specifier} )` : /* istanbul ignore next */ '';
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

    async loadSecureCollectionCheck(path) {
        return await this.fetchAPI(new ApiRoutes().SECURE_COLLECTION_CHECK_API({ path }).apiUrl, {}, false, false)
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.log('error loading Secure Collection Check ', error);
                const msg = `error loading Secure Collection Check: ${error.message}`;
                throw new Error(msg);
            });
    }

    async loadSecureCollectionFile(path) {
        return await this.fetchAPI(new ApiRoutes().SECURE_COLLECTION_FILE_API({ path }).apiUrl, {}, true, false)
            .then((data) => {
                return data;
            })
            .catch(
                /* istanbul ignore next */ (error) => {
                    console.log('error loading Secure Collection File ', error);
                    const msg = `error loading Secure Collection File: ${error.message}`;
                    throw new Error(msg);
                },
            );
    }

    async fetchAPI(urlPath, headers, tokenRequired = false, timestampRequired = true) {
        /* istanbul ignore next */
        if (!!tokenRequired && (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined)) {
            // no cookie so we wont bother asking for the account api that cant be returned
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
            const API_URL = process.env.API_URL || 'https://api.library.uq.edu.au/staging/';
            const connector = urlPath.indexOf('?') > -1 ? '&' : '?';
            const addTimestamp = !!timestampRequired ? `${connector}${new Date().getTime()}` : '';

            const response = await fetch(`${API_URL}${urlPath}${addTimestamp}`, {
                headers: options,
            });

            if (!response.ok) {
                console.log(`ApiAccess console [A3]: An error has occured: ${response.status} ${response.statusText}`);
                const message = `ApiAccess [A1]: An error has occured: ${response.status} ${response.statusText}`;
                throw new Error(message);
            }
            return await response.json();
        }
    }

    async fetchJsonpAPI(url, headers) {
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
            if (!response.ok) {
                console.log(`ApiAccess console [A4]: An error has occured: ${response.status} ${response.statusText}`);
                const message = `ApiAccess [A2]: An error has occured: ${response.status} ${response.statusText}`;
                throw new Error(message);
            }
            return await response.json();
        }
    }

    removeAccountStorage() {
        sessionStorage.removeItem(this.STORAGE_ACCOUNT_KEYNAME);
    }

    getSessionCookie() {
        if (!this.isMock()) {
            /* istanbul ignore next */
            return getCookieValue(locale.SESSION_COOKIE_NAME);
        }

        if (new MockApi().getUserParameter() !== 'public') {
            return locale.UQLID_COOKIE_MOCK;
        }
        return undefined;
    }

    getLibraryGroupCookie() {
        // I am guessing this field is used as a proxy for 'has a Library account, not just a general UQ login'
        /* istanbul ignore next */
        if (!this.isMock()) {
            return getCookieValue(locale.SESSION_USER_GROUP_COOKIE_NAME);
        }
        /* istanbul ignore else */
        if (new MockApi().getUserParameter() !== 'public') {
            return locale.USERGROUP_COOKIE_MOCK;
        }
        /* istanbul ignore next */
        return undefined;
    }

    fetchMock(url, options = null) {
        const response = new MockApi().mockfetch(url, options);
        console.log('mock url = ', url);
        console.log('mock response = ', response);
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

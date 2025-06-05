import MockApi from '../../mock/MockApi';
import ApiRoutes from '../ApiRoutes';
import { apiLocale as locale } from './ApiAccess.locale';
import fetchJsonp from 'fetch-jsonp';
import { clearCookie, cookieFound, getCookieValue } from '../helpers/cookie';
import { authLocale } from '../UtilityArea/auth.locale';
import { getHomepageLink } from '../helpers/access';

let initCalled;

class ApiAccess {
    constructor() {
        this.LOGGED_OUT_ACCOUNT = {
            status: locale.USER_LOGGED_OUT,
            account: 'empty', // this is temporary code - account needs to exist for old homepage version to not trip some bad code. Remove after May 2023
        };

        this.isSessionStorageEnabled = this.sessionStorageCheck();
        const storedUserDetailsRaw =
            (this.isSessionStorageEnabled && sessionStorage.getItem(locale.STORAGE_ACCOUNT_KEYNAME)) || null;
        // never allow there to be no or invalid account storage (weird thing happening on Secure Collection)
        if (storedUserDetailsRaw === null) {
            this.setStorageLoggedOut();
        } else {
            const storedUserDetails = !!storedUserDetailsRaw && JSON.parse(storedUserDetailsRaw);
            if (!storedUserDetails.hasOwnProperty('status')) {
                this.setStorageLoggedOut();
            }
        }
    }

    sessionStorageCheck() {
        try {
            const key = `__storage__test`;
            sessionStorage.setItem(key, null);
            sessionStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }

    watchForSessionExpiry() {
        // let the calling page know account is available
        if ('BroadcastChannel' in window) {
            const bc = new BroadcastChannel('account_availability');
            bc.postMessage('account_updated');

            bc.onmessage = (messageEvent) => {
                if (messageEvent.data === 'account_removed') {
                    this.markAccountStorageLoggedOut();
                    this.logUserOut();
                    this.recreateAuthButton();
                }
            };
        }

        // watch the session cookie for expiry when the user is logged in
        if (this.getSessionCookie() !== undefined && this.getLibraryGroupCookie() !== undefined) {
            const watchforAccountExpiry = setInterval(() => {
                if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
                    this.announceUserLoggedOut();
                    clearInterval(watchforAccountExpiry);
                }
            }, 1000);
        }
    }

    async loadAccountApi() {
        const ACCOUNT_CALL_INCOMPLETE = 'incomplete';
        const ACCOUNT_CALL_DONE = 'done';

        if (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined) {
            // no cookie, force them to log in again
            this.markAccountStorageLoggedOut();
            return false;
        }

        const userDetails = this.getAccountFromStorage();
        if (
            !!userDetails &&
            userDetails.hasOwnProperty('status') &&
            userDetails.status === locale.USER_LOGGED_IN &&
            userDetails.hasOwnProperty('account') &&
            userDetails.account.hasOwnProperty('id')
        ) {
            this.watchForSessionExpiry();
            return true;
        }

        const accountApi = new ApiRoutes().CURRENT_ACCOUNT_API();
        const urlPath = accountApi.apiUrl;
        let accountCallStatus = ACCOUNT_CALL_INCOMPLETE;
        return await this.fetchAPI(urlPath, {}, true)
            .then((account) => {
                if (account.hasOwnProperty('hasSession') && account.hasSession === true) {
                    this.storeAccount(account);
                    accountCallStatus = ACCOUNT_CALL_DONE;

                    this.watchForSessionExpiry();

                    const authorApi = new ApiRoutes().CURRENT_AUTHOR_API();
                    const urlPath = authorApi.apiUrl;
                    return this.fetchAPI(urlPath, {}, true);
                } else {
                    this.announceUserLoggedOut();
                    accountCallStatus = ACCOUNT_CALL_DONE;
                    return false;
                }
            })
            .then((author) => {
                this.addCurrentAuthorToStoredAccount(author);
                return true;
            })
            .catch((error) => {
                if (accountCallStatus === ACCOUNT_CALL_INCOMPLETE) {
                    // it was the account call that had an error; authors was never called
                    this.announceUserLoggedOut();
                    return false;
                }
                this.addCurrentAuthorToStoredAccount({ data: null });
                return true;
            });
    }

    async loadChatStatus() {
        let isOnline = false;
        const chatstatusApi = new ApiRoutes().CHAT_API();
        const urlPath = chatstatusApi.apiUrl;
        await this.fetchAPI(urlPath)
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
        await this.fetchAPI(urlPath)
            .then((hoursResponse) => {
                let askusHours = null;
                /* istanbul ignore else */
                if (!!hoursResponse && !!hoursResponse.locations && hoursResponse.locations.length > 1) {
                    askusHours = hoursResponse.locations.map((item) => {
                        if (item.abbr === 'AskUs') {
                            return {
                                chat: `${item?.departments[0].times?.hours[0].from} \u2013 ${item?.departments[0].times?.hours[0]?.to}`,
                                phone: `${item?.departments[1].times?.hours[0].from} \u2013 ${item?.departments[1].times?.hours[0]?.to}`,
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
        return await this.fetchAPI(urlPath)
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

    /**
     * Loads the open athens link checker
     * is the requested link one that open athens can link to?
     * @returns {function(*)}
     */
    /*
      Example responses:
      {
        "goLinkResponseList": [
            {
                "link": "https://www.youtube.com/watch?v=jwKH6X3cGMg",
                "type": "UNAUTHORISED"
            },
        ]
      }
      --
      {
        "goLinkResponseList": [
            {
                "link": "https://aclandanatomy.com/",
                "goLink": "https://go.openathens.net/redirector/uq.edu.au?url=https%3A%2F%2Faclandanatomy.com%2F",
                "type": "RECOGNIZED_REDIRECT",
                "resourceType": "federated",
                "resourceTitle": "Acland’s Video Atlas Of Human Anatomy",
                "resourceId": "ab594f60-d379-42ae-9aa1-4a296d58da9d"
            }
        ]
      }
    */
    async loadOpenAthensCheck(urlPath) {
        const openAthensApi = new ApiRoutes().OPEN_ATHENS_LINK_CHECKER(urlPath);
        return await this.fetchAPI(openAthensApi.apiUrl, {}, false, false)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log('error loading openathens ', error);
                const msg = 'There was a problem loading Open Athens - please try again later.';
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

    async fetchPrimoStatus() {
        const PRIMO_STATUS_BACKOFFICE = 'bo';

        const api = new ApiRoutes().PRIMO_STATUS_API();

        return await this.fetchAPI(api.apiUrl)
            .then((data) => {
                return data?.status || PRIMO_STATUS_BACKOFFICE;
            })
            .catch((error) => {
                // send the user to BO if we cant tell where they should go
                return PRIMO_STATUS_BACKOFFICE;
            });
    }

    async fetchAPI(urlPath, headers = {}, tokenRequired = false, timestampRequired = true) {
        /* istanbul ignore next */
        if (!!tokenRequired && (this.getSessionCookie() === undefined || this.getLibraryGroupCookie() === undefined)) {
            // no cookie so we won't bother asking for the account api that cant be returned
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
            const addTimestamp = !!timestampRequired ? `${connector}ts=${new Date().getTime()}` : '';

            const response = await fetch(`${API_URL}${urlPath}${addTimestamp}`, {
                headers: options,
            });

            if (!response.ok) {
                console.log(`ApiAccess console [A3]: An error has occurred: ${response.status} ${response.statusText}`);
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

    storeAccount(account, numberOfHoursUntilExpiry = 1) {
        // for improved UX, expire the session storage when the token must surely be expired, for those rare long sessions
        // session lasts 8 hours, per https://auth.uq.edu.au/about/
        // (note: because we cant predict what other system the user first logged into we don't actually know
        // how much more of their session is left)

        const millisecondsUntilExpiry =
            8 * numberOfHoursUntilExpiry * 60 /*min*/ * 60 /*sec*/ * 1000; /* milliseconds */
        const storageExpiryDate = {
            storageExpiryDate: new Date().setTime(new Date().getTime() + millisecondsUntilExpiry),
        };
        // structure must match that used in homepage as they both write to the same storage
        // (has to, as reusable will remove storage to log homepage out!)
        let storeableAccount = {
            status: locale.USER_LOGGED_IN,
            account: {
                ...account,
            },
            ...storageExpiryDate,
        };
        storeableAccount = JSON.stringify(storeableAccount);
        this.isSessionStorageEnabled && sessionStorage.setItem(locale.STORAGE_ACCOUNT_KEYNAME, storeableAccount);
    }

    // this is called from loadAccountApi, above, via authbutton once and if that fails,
    // it will call the apis to get the account details and load them into sessionstorage.
    // It is called from other components (training, secure collection, etc.) in a loop, waiting on
    // the authbutton's call to loadAccountApi, above, to load the account into the sessionstorage
    getAccountFromStorage() {
        const storedUserDetailsRaw =
            this.isSessionStorageEnabled && sessionStorage.getItem(locale.STORAGE_ACCOUNT_KEYNAME);
        const storedUserDetails = !!storedUserDetailsRaw && JSON.parse(storedUserDetailsRaw);
        if (this.isMock()) {
            const mockUserHasChanged =
                !!storedUserDetails &&
                storedUserDetails.hasOwnProperty('account') &&
                storedUserDetails.account.hasOwnProperty('id') &&
                storedUserDetails.account.id !== new MockApi().user;
            if (!!mockUserHasChanged) {
                // allow developer to swap between users in the same tab
                this.markAccountStorageLoggedOut();
                return null;
            }
        }

        const now = new Date().getTime();
        if (!!storedUserDetails.hasOwnProperty('storageExpiryDate') && storedUserDetails.storageExpiryDate < now) {
            this.announceUserLoggedOut();
            this.markAccountStorageLoggedOut();
            this.logUserOut();
            return this.LOGGED_OUT_ACCOUNT;
        }

        return storedUserDetails;
    }

    addCurrentAuthorToStoredAccount(currentAuthor) {
        const storedAccount = this.getAccountFromStorage();
        /* istanbul ignore next */
        if (!this.isSessionStorageEnabled || storedAccount === null) {
            return;
        }
        let storeableAccount = {
            ...storedAccount,
            currentAuthor: {
                ...currentAuthor.data,
            },
        };
        storeableAccount = JSON.stringify(storeableAccount);
        this.isSessionStorageEnabled && sessionStorage.setItem(locale.STORAGE_ACCOUNT_KEYNAME, storeableAccount);
    }

    recreateAuthButton() {
        const authButton = document.querySelector('auth-button');
        if (!!authButton) {
            // create temporary reference element so we know where to paste the new logged out auth
            const referenceElement = document.createElement('span');
            !!referenceElement && authButton.parentNode.insertBefore(referenceElement, authButton.nextSibling);

            authButton.parentNode.removeChild(authButton);
            const recreatedAuthButton = document.createElement('auth-button');
            !!referenceElement &&
                !!recreatedAuthButton &&
                referenceElement.parentNode.insertBefore(recreatedAuthButton, referenceElement);

            !!referenceElement && referenceElement.parentNode.removeChild(referenceElement);
        }
    }

    markAccountStorageLoggedOut() {
        this.setStorageLoggedOut();
        !!cookieFound(locale.SESSION_COOKIE_NAME) && clearCookie(locale.SESSION_COOKIE_NAME);
    }

    setStorageLoggedOut() {
        if (!this.isSessionStorageEnabled) {
            return;
        }
        sessionStorage.removeItem(locale.STORAGE_ACCOUNT_KEYNAME);
        const emptyAccount = JSON.stringify(this.LOGGED_OUT_ACCOUNT);
        sessionStorage.setItem(locale.STORAGE_ACCOUNT_KEYNAME, emptyAccount);

        // also remove the chatbot session ids, killing the chatbot session
        sessionStorage.removeItem('directLineToken');
        sessionStorage.removeItem('directLineURL');
        sessionStorage.removeItem('directLineConversationId');
        // see homepage/chatbot.html
    }

    logUserOut() {
        let homepagelink = getHomepageLink();
        window.location.assign(`${authLocale.AUTH_URL_LOGOUT}${window.btoa(homepagelink)}`);
    }

    announceUserLoggedOut() {
        setTimeout(() => {
            // a short delay so the above removals have firmly happened before the notified apps can action it
            if ('BroadcastChannel' in window) {
                // let the calling page know account has been removed
                const bc = new BroadcastChannel('account_availability');
                bc.postMessage('account_removed');
            }
        }, 100);
    }

    getSessionCookie() {
        return getCookieValue(locale.SESSION_COOKIE_NAME);
    }

    getLibraryGroupCookie() {
        // I am guessing this field is used as a proxy for 'has a Library account, not just a general UQ login'
        return getCookieValue(locale.SESSION_USER_GROUP_COOKIE_NAME);
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

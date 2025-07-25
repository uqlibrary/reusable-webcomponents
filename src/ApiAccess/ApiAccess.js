import MockApi from '../../mock/MockApi';
import ApiRoutes from '../ApiRoutes';
import { apiLocale as locale } from './ApiAccess.locale';
import fetchJsonp from 'fetch-jsonp';
import { getCookieValue } from '../helpers/cookie';

class ApiAccess {
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
                urlPath === 'chat_status' && this.showVPNNeededToast(); // dev

                const msg = `mock api error: ${e.message}`;
                console.log(msg);
                throw new Error(msg);
            }
        } else {
            // reference: https://dmitripavlutin.com/javascript-fetch-async-await/
            const API_URL = process.env.API_URL || 'https://api.library.uq.edu.au/staging/';
            const connector = urlPath.indexOf('?') > -1 ? '&' : '?';
            const addTimestamp = !!timestampRequired ? `${connector}ts=${new Date().getTime()}` : '';

            // if we are calling a non-api url then we will have already set the domain name
            const finalUrl = urlPath.startsWith('http')
                ? `${urlPath}${addTimestamp}`
                : `${API_URL}${urlPath}${addTimestamp}`;
            console.log(urlPath, 'calls: ', finalUrl);
            let response;
            try {
                response = await fetch(finalUrl, {
                    headers: options,
                });
            } catch (e) {
                urlPath === 'chat_status' && this.showVPNNeededToast();
            }

            if (!response?.ok) {
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

    getSessionCookie() {
        return getCookieValue(locale.SESSION_COOKIE_NAME);
    }

    getLibraryGroupCookie() {
        // I am guessing this field is used as a proxy for 'has a Library account, not just a general UQ login'
        return getCookieValue(locale.SESSION_USER_GROUP_COOKIE_NAME);
    }

    fetchMock(url, options = null) {
        const response = new MockApi().mockfetch(url, options);
        console.log(`mock "${url}": response = `, response);
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

    // across dev, apis silently fail when they are blocked by CORS - point out that VPN is needed because its very confusing!!
    showVPNNeededToast() {
        const toast = `
            <style>
                body {
                    position: relative;
                }
                .vpn-needed-toast {
                    background-color: #D62929;
                    color: #fff;
                    padding: .5rem 1.5rem .5rem 2.5rem;
                    background-image: url("data:image/svg+xml,%3csvg viewBox=%270 0 24 24%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M20.127 18.545a1.18 1.18 0 0 1-1.055 1.706H4.929a1.18 1.18 0 0 1-1.055-1.706l7.072-14.143a1.179 1.179 0 0 1 2.109 0l7.072 14.143Z%27 stroke=%27%23fff%27 stroke-width=%271.5%27%3e%3c/path%3e%3cpath d=%27M12 9v4%27 stroke=%27%23fff%27 stroke-width=%271.5%27 stroke-linecap=%27round%27%3e%3c/path%3e%3ccircle cx=%2711.9%27 cy=%2716.601%27 r=%271.1%27 fill=%27%23fff%27%3e%3c/circle%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-size: 1.5rem;
                    background-position: 0.75rem center;
                    position: fixed;
                    bottom: 0.5rem;
                    left: 0.5rem;
                    transition: opacity 500ms ease-out;
                    p {
                        font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        font-size: 1rem;
                        font-weight: 400;
                        letter-spacing: 0.16px;
                        line-height: 25.6px;
                    }
                }
            </style>
            <div id="vpn-needed-toast" class="vpn-needed-toast" data-testid="vpn-needed-toast">
                <p>You may need VPN to see some elements of this page.</p>
            </div>
        `;
        const toastAlreadyExists = document.getElementById('vpn-needed-toast');
        const vpnDomains = [
            'localhost', // superfluous, but allows test
            'homepage-staging.library.uq.edu.au', // probably doesnt work - completely 403 on page
            'homepage-development.library.uq.edu.au', // here it is very needed, no other clue that apis blocked without vpn
            'sandbox-fryer.library.uq.edu.au', // probably doesnt work - completely 403 on page
            'app-testing.library.uq.edu.au', // probably doesnt work - completely 403 on page
        ];
        if (vpnDomains.includes(window.location.hostname) && !toastAlreadyExists) {
            const template = document.createElement('template');
            !!toast && !!template && (template.innerHTML = toast);
            const body = document.querySelector('body');
            !!body && !!template && body.appendChild(template.content.cloneNode(true));
            const hideDelay = 3000;
            setTimeout(() => {
                const toast = document.getElementById('vpn-needed-toast');
                !!toast && (toast.style.opacity = 0);
            }, hideDelay);
            setTimeout(() => {
                const toast = document.getElementById('vpn-needed-toast');
                !!toast && toast.remove();
            }, hideDelay + 1000);
        }
    }
}

export default ApiAccess;

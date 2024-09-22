import mainStyles from './css/main.css';
import customStyles from './css/overrides.css';
import isURL from 'validator/es/lib/isURL';
import ApiAccess from '../ApiAccess/ApiAccess';
import { throttle } from 'throttle-debounce';

/*
 * usage:
 *  <open-athens create-link="true"></open-athens>         -- copy a link
 *  <open-athens></open-athens>                            -- visit a link
 *
 */

const template = document.createElement('template');
template.innerHTML = `
    <style>
        ${mainStyles.toString()}
        ${customStyles.toString()}
    </style>
    <div id="open-athens" data-testid="open-athens" class="uq-card">
        <fieldset class="uq-card__content">
            <input type="url" placeholder="DOI or URL" id="open-athens-input" data-testid="open-athens-input" />
            <div id="open-athens-input-error" data-testid="open-athens-input-error" class="uq-error-message hidden"></div>
            <div class="spinnerWrapper" id="spinnerWrapper">
                <span id="spinner" class="spinner" role="progressbar">
                    <svg viewBox="22 22 44 44">
                        <circle cx="44" cy="44" r="21" fill="none" stroke-width="2"></circle>
                    </svg>
                </span>
            </div>
            <button id="open-athens-create-link-button" data-testid="open-athens-create-link-button" class="uq-button hidden">Create Link</button>
            <button id="open-athens-url-clear-button" data-testid="open-athens-url-clear-button" class="uq-button uq-button--secondary hidden">Clear</button>
            <span id="open-athens-copy-options" data-testid="open-athens-copy-options" class="hidden">
                <textarea readonly id="open-athens-url-display-area" data-testid="open-athens-url-display-area"></textarea>
                <button id="open-athens-visit-link-button" data-testid="open-athens-visit-link-button" class="uq-button">Visit Link</button>
                <button id="open-athens-copy-link-button" data-testid="open-athens-copy-link-button" class="uq-button">Copy Link</button>
                <button id="open-athens-create-new-link-button" data-testid="open-athens-create-new-link-button" class="uq-button uq-button--secondary">Clear</button>
                <div id="open-athens-copy-status" data-testid="open-athens-copy-status"></div>
            </span>
            <span id="open-athens-redirect-options" data-testid="open-athens-redirect-options" class="hidden">
                <button id="open-athens-redirect-button" data-testid="open-athens-redirect-button" class="uq-button">Go</button>
                <button id="open-athens-input-clear-button" data-testid="open-athens-input-clear-button" class="uq-button uq-button--secondary">Clear</button>
            </span>
        </fieldset>
    </div>
`;

class OpenAthens extends HTMLElement {
    constructor() {
        super();

        this.openAthensUrl = '';
    }

    get redirectOnly() {
        const createLink = this.hasAttribute('create-link') && this.getAttribute('create-link') !== 'false';
        // convert legacy option to more logical option
        // (The links are created in either case, it's what we do with it that's different)
        return !createLink;
    }

    get inputUrl() {
        return this.inputField.value;
    }

    set inputUrl(value) {
        if (!this.redirectOnly) {
            this.createLinkButton.classList.remove('hidden');
            this.createLinkClearButton.classList.remove('hidden');
        }
        this.inputField.value = value;
        this.inputField.classList.remove('hidden');
        this.inputField.focus();
    }

    get doiRegexp() {
        return /^\b(10[.][0-9]{3,}(?:[.][0-9]+)*\/(?:(?!['&\'])\S)+)\b/;
    }

    get inputValidator() {
        const valid = this.hasAttribute('valid') && this.getAttribute('valid') === 'true';
        return { valid };
    }

    set inputValidator(value) {
        this.setAttribute('valid', value.valid);

        this.inputField.classList.toggle('uq-input--error', !value.valid);

        this.inputErrorArea.innerText = value.message;
        this.inputErrorArea.classList.toggle('hidden', value.valid);
    }

    get outputUrl() {
        return this.urlDisplayArea.value;
    }

    set outputUrl(value) {
        this.urlDisplayArea.style.height = '';
        this.urlDisplayArea.value = value;

        if (this.redirectOnly) {
            return;
        }

        if (!!value) {
            this.inputField.classList.add('hidden');
            this.createLinkButton.classList.add('hidden');
            this.createLinkClearButton.classList.add('hidden');
            setTimeout(() => {
                this.urlDisplayArea.style.height = 'calc(' + this.urlDisplayArea.scrollHeight + 'px' + ' + 0.1rem)';
            }, 100);
        }

        this.copyOptions.classList.toggle('hidden', !value);
    }

    set copyStatus(value) {
        const { success, message } = value;
        this.statusToast.innerText = message;
        if (!message) {
            this.statusToast.classList.add('hidden');
            return;
        }
        this.statusToast.classList.toggle('uq-success-message', success);
        this.statusToast.classList.toggle('uq-error-message', !success);
        this.statusToast.classList.remove('hidden');
        setTimeout(() => {
            this.statusToast.classList.add('open');
        }, 10);
        setTimeout(() => {
            this.statusToast.classList.remove('open');
            setTimeout(() => {
                this.copyStatus = { message: '' };
            }, 1000);
        }, 3010);
    }

    connectedCallback() {
        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));

        this.copyLinkButton = shadowDOM.getElementById('open-athens-copy-link-button');
        this.copyOptions = shadowDOM.getElementById('open-athens-copy-options');
        this.createLinkButton = shadowDOM.getElementById('open-athens-create-link-button');
        this.createLinkClearButton = shadowDOM.getElementById('open-athens-url-clear-button');
        this.createNewLinkButton = shadowDOM.getElementById('open-athens-create-new-link-button');
        this.inputClearButton = shadowDOM.getElementById('open-athens-input-clear-button');
        this.inputErrorArea = shadowDOM.getElementById('open-athens-input-error');
        this.inputField = shadowDOM.getElementById('open-athens-input');
        this.redirectButton = shadowDOM.getElementById('open-athens-redirect-button');
        this.redirectOptions = shadowDOM.getElementById('open-athens-redirect-options');
        this.statusToast = shadowDOM.getElementById('open-athens-copy-status');
        this.visitLinkButton = shadowDOM.getElementById('open-athens-visit-link-button');
        this.urlDisplayArea = shadowDOM.getElementById('open-athens-url-display-area');

        if (this.redirectOnly) {
            this.redirectOptions.classList.remove('hidden');
        } else {
            this.createLinkButton.classList.remove('hidden');
            this.createLinkClearButton.classList.remove('hidden');
        }

        this.addEventListeners();
    }

    addEventListeners() {
        this.copyLinkButton.addEventListener('click', () => this.copyUrl());
        this.createLinkButton.addEventListener('click', () => this.createLink());
        this.createLinkClearButton.addEventListener('click', () => this.clearInput());
        this.createNewLinkButton.addEventListener('click', () => this.clearInput());
        this.inputClearButton.addEventListener('click', () => this.clearInput());
        this.inputField.addEventListener('keypress', (e) => this.inputUrlKeypress(e));
        this.redirectButton.addEventListener('click', () => this.redirectToLinkViaOpenAthens());
        this.visitLinkButton.addEventListener('click', () => this.navigateToLinkViaOpenAthens());
    }

    /**
     * handle 'enter key' on input field
     * @param e
     */
    inputUrlKeypress(e) {
        if (e.keyCode !== 13) {
            return;
        }
        if (this.redirectOnly) {
            this.redirectToLinkViaOpenAthens(e);
        } else {
            this.createLink(e);
        }
    }

    /**
     * Remove extraneous bits from the web address
     *
     * @param dest
     * @returns {String}
     */
    cleanupUrl(dest) {
        let _dest = !!dest ? dest.trim() : '';

        // EzProxy is the system that was replaced by Open Athens.
        // and there was a problem back then that people would paste in exproxy links to be ezproxied :facepalm:
        // Convert any old ezproxy links that might get pasted in
        // Link type 1, example https://ezproxy.library.uq.edu.au/login?url=http://www.sciencedirect.com/science/article/pii/S1744388116300159
        var ezpRegexp = /https?:\/\/(www.)?ezproxy.library.uq.edu.au\/login\?url\=/i;
        _dest = _dest.replace(ezpRegexp, '');

        // Link type 2, example: http://www.sciencedirect.com.ezproxy.library.uq.edu.au/science/article/pii/S1744388116300159
        var ezproxyUrlRegexp = /(([A-Za-z]*:(?:\/\/)?)(.)+(.ezproxy.library.uq.edu.au))(.*)?/;
        if (ezproxyUrlRegexp.test(_dest)) {
            _dest = _dest.replace('.ezproxy.library.uq.edu.au', '');
        }

        return _dest;
    }

    /**
     * Test the requested link with OpenAthens. If it is available, display it.
     * If it isn't, show a friendly error message
     */
    createLink() {
        var cleanedUrl = this.cleanupUrl(this.inputUrl);
        this.inputValidator = this.validateRequestedUrl(cleanedUrl);
        if (!this.inputValidator.valid) {
            return;
        }
        const throttledOpenAthensCheck = throttle(3100, (passedUrl) => this.getOpenAthens(passedUrl));
        throttledOpenAthensCheck(this.determineUrl(cleanedUrl));
    }

    /**
     * display the Open athens link
     */
    displayUrl(url) {
        var cleanedUrl = this.cleanupUrl(url);
        this.inputValidator = this.validateRequestedUrl(cleanedUrl);

        if (this.inputValidator.valid) {
            this.outputUrl = this.determineUrl(cleanedUrl);
            this.visitLinkButton.focus();
        }
    }

    /**
     * Open the Open athens link in a new window/tab
     */
    navigateToLinkViaOpenAthens() {
        if (this.redirectOnly) {
            var cleanedUrl = this.cleanupUrl(this.inputUrl);
            this.inputValidator = this.validateRequestedUrl(cleanedUrl);
            this.outputUrl = this.determineUrl(cleanedUrl);
        }

        if (this.inputValidator.valid) {
            const win = window.open(this.outputUrl);
        }
    }

    /**
     * Create the landing url
     *
     * @param cleanedUrl
     * @returns {string}
     */
    determineUrl(cleanedUrl) {
        var dest;

        dest = '';
        if (this.doiRegexp.test(cleanedUrl)) {
            dest += 'https://dx.doi.org/';
        }
        dest += cleanedUrl;
        return dest;
    }

    /**
     * Verify if users URL request is a valid link
     *
     * @param dest - the URl to be checked
     * @returns {Object}
     */
    validateRequestedUrl(dest) {
        const validation = {
            valid: false,
            message: '',
        };

        if (dest.length <= 0) {
            validation.message = 'Please enter a URL.';
            const inputField = this.shadowRoot.getElementById('open-athens-input');
            inputField.focus();
        } else if (this.doiRegexp.test(dest)) {
            validation.valid = true;
        } else if (!isURL(dest, { require_protocol: true })) {
            validation.message = 'Please enter a valid URL.';
            if (dest.substring(0, 4).toLowerCase() !== 'http') {
                validation.message = 'Invalid URL. Please add the protocol e.g. http://, https://';
            }
        } else {
            validation.valid = true;
        }

        return validation;
    }

    /**
     * Open the Open athens link in a new window/tab
     */
    redirectToLinkViaOpenAthens() {
        if (this.redirectOnly) {
            const cleanedUrl = this.cleanupUrl(this.inputUrl);
            this.inputValidator = this.validateRequestedUrl(cleanedUrl);
            if (!this.inputValidator.valid) {
                return false;
            }
            const throttledOpenAthensCheckThenNewWindow = throttle(3100, (passedUrl) => {
                this.getOpenAthens(passedUrl).then((url) => {
                    !!url && window.open(url);
                });
            });
            throttledOpenAthensCheckThenNewWindow(cleanedUrl);
        }
    }

    async getOpenAthens(url) {
        const spinner = this.shadowRoot.getElementById('spinnerWrapper');
        const inputArea = this.shadowRoot.getElementById('open-athens-input');
        spinner.style.display = 'block';
        inputArea.classList.add('hideInput');
        return await new ApiAccess()
            .loadOpenAthensCheck(url)
            .then((response) => {
                // // uncomment the setInterval to see the spinner in dev (otherwise it is too fast)
                // // but it stops "visit a link" from working
                // const delay = setInterval(
                //     () => {
                //         clearInterval(delay);

                spinner.style.display = 'none';
                inputArea.classList.remove('hideInput');

                if (!response || !response.hasOwnProperty('available')) {
                    this.inputValidator = {
                        valid: false,
                        message: 'The link generator is temporarily unavailable. Please try again later.',
                    };
                    return null;
                } else if (response?.available === true) {
                    const newUrl = `https://resolver.library.uq.edu.au/openathens/redir?url=${url}`;
                    this.displayUrl(newUrl);
                    return newUrl;
                } else {
                    // OA said thats not an OA url
                    this.inputValidator = {
                        valid: false,
                        message: 'This link does not require UQ access. Try accessing it directly.',
                    };
                    return null;
                }
                //     },
                //     // delay the mock response; let prod straight through
                //     window.location.hostname === 'localhost' ? 500 : 0,
                // );
            })
            .catch((e) => {
                spinner.style.display = 'none';
                inputArea.classList.remove('hideInput');
                this.inputValidator = {
                    valid: false,
                    message: 'The link generator is temporarily unavailable. Please try again later.',
                };
                return null;
            });
    }

    /**
     * Clear url input field
     */
    clearInput() {
        this.outputUrl = '';
        this.inputUrl = '';
        this.inputField.classList.remove('uq-input--error');
        this.inputErrorArea.innerText = '';
        this.inputErrorArea.classList.add('hidden');
    }

    /*
     * Copy URL to Clipboard (same as ctrl+a / ctrl+c)
     * Only available for Firefox 41+, Chrome 43+, Opera 29+, IE 10+
     */
    copyUrl() {
        if ((!window.navigator.clipboard || !window.navigator.clipboard.writeText) && !document.execCommand) {
            this.copyStatus = {
                success: false,
                message: 'The Copy function is not available in this web browser.',
            };
            return;
        }

        this.urlDisplayArea.select();

        try {
            const that = this;
            if (window.navigator.permissions && window.navigator.clipboard && window.navigator.clipboard.writeText) {
                // from https://stackoverflow.com/questions/56306153/domexception-on-calling-navigator-clipboard-readtext
                window.navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
                    // If permission to read the clipboard is granted or if the user will
                    // be prompted to allow it, we proceed.
                    if (result.state === 'granted' || result.state === 'prompt') {
                        window.navigator.clipboard
                            .writeText(this.outputUrl)
                            .then((text) => {
                                that.copyStatus = {
                                    success: true,
                                    message: 'URL copied successfully.',
                                };
                            })
                            .catch((err) => {
                                console.error('Failed to read clipboard contents: ', err);
                                that.copyStatus = {
                                    success: false,
                                    message: 'Unable to copy the URL.',
                                };
                            });
                    } else {
                        that.copyStatus = {
                            success: false,
                            message: 'The Copy function is not available in this web browser.',
                        };
                    }
                });
            } else {
                const copyStatus = document.execCommand('copy');
                this.copyStatus = {
                    success: !!copyStatus,
                    message: copyStatus ? 'URL copied successfully.' : 'Unable to copy the URL.',
                };
            }
        } catch (err) {
            this.copyStatus = {
                success: false,
                message: 'An error occurred while copying the URL.',
            };
        }
    }
}

export default OpenAthens;

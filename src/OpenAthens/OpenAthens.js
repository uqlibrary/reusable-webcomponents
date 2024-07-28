import mainStyles from './css/main.css';
import customStyles from './css/overrides.css';
import isURL from 'validator/es/lib/isURL';
import ApiAccess from '../ApiAccess/ApiAccess';
import { throttle } from 'throttle-debounce';

/*
 * usage:
 *  <open-athens create-link="true"></open-athens>
 *  <open-athens></open-athens>
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
            <button id="open-athens-create-link-button" data-testid="open-athens-create-link-button" class="uq-button hidden">Create Link</button>
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
        }

        this.addEventListeners();
    }

    addEventListeners() {
        this.copyLinkButton.addEventListener('click', () => this.copyUrl());
        this.createLinkButton.addEventListener('click', () => this.createLink());
        this.createNewLinkButton.addEventListener('click', () => this.clearInput());
        this.inputClearButton.addEventListener('click', () => this.clearInput());
        this.inputField.addEventListener('keypress', (e) => this.inputUrlKeypress(e));
        this.redirectButton.addEventListener('click', () => this.navigateToLinkViaOpenAthens());
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
            this.navigateToLinkViaOpenAthens(e);
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
        console.log(`cleanupUrl "${dest}"`);
        dest = dest?.trim();

        // // URLs like the one generated by this component
        // var ezpRegexp = /https:\/\/go.openathens.net\/redirector\/uq.edu.au?url\=/i;
        // dest = dest.replace(ezpRegexp, '');
        //
        // // // Example: http://www.sciencedirect.com.ezproxy.library.uq.edu.au/science/article/pii/S1744388116300159
        // // var ezproxyUrlRegexp = /(([A-Za-z]*:(?:\/\/)?)(.)+(.ezproxy.library.uq.edu.au))(.*)?/;
        // // if (ezproxyUrlRegexp.test(dest)) {
        // //     dest = dest.replace('.ezproxy.library.uq.edu.au', '');
        // // }
        // //
        // // var doiRegexp = /https?:\/\/dx.doi.org\//i;
        // // dest = dest.replace(doiRegexp, '');

        return dest;
    }

    /**
     * Test the requested link with OpenAthens. If it is available, display it.
     * If it isn't, show a friendly wrror message
     */
    createLink() {
        console.log('createLink');
        var cleanedUrl = this.cleanupUrl(this.inputUrl);
        this.inputValidator = this.validateRequestedUrl(cleanedUrl);
        if (!this.inputValidator.valid) {
            return;
        }
        this.getOpenAthens(this.determineUrl(cleanedUrl));
    }

    /**
     * display the Open athens link
     */
    displayUrl(url) {
        console.log('displayUrl', url);
        var cleanedUrl = this.cleanupUrl(url);
        this.inputValidator = this.validateRequestedUrl(cleanedUrl);

        if (this.inputValidator.valid) {
            this.outputUrl = this.determineUrl(cleanedUrl);
            this.visitLinkButton.focus();
        }
    }

    /**
     * Open Open athens link in a new window/tab
     */
    navigateToLinkViaOpenAthens() {
        if (this.redirectOnly) {
            var cleanedUrl = this.cleanupUrl(this.inputUrl);
            this.inputValidator = this.validateRequestedUrl(cleanedUrl);
            this.outputUrl = this.determineUrl(cleanedUrl);
        }

        if (this.inputValidator.valid) {
            var win = window.open(this.outputUrl);
            win.focus();
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
        // if (this.inputValidator.valid) {
        //     dest = 'https://222go.openathens.net/redirector/uq.edu.au?url=';
        if (this.doiRegexp.test(cleanedUrl)) {
            dest += 'https://dx.doi.org/';
        }
        dest += cleanedUrl;
        // }
        console.log('OpenAthens::determineUrl', dest);
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
            validation.message = 'Please enter a URL';
            const inputField = this.shadowRoot.getElementById('open-athens-input');
            inputField.focus();
        } else if (this.doiRegexp.test(dest)) {
            validation.valid = true;
        } else if (!isURL(dest, { require_protocol: true })) {
            if (dest.substring(0, 4).toLowerCase() !== 'http') {
                validation.message = 'Invalid URL. Please add the protocol ie: http://, https://';
            } else {
                validation.message = 'Invalid URL.';
            }
        } else {
            validation.valid = true;
        }

        return validation;
    }

    getOpenAthens(url) {
        console.log('getOpenAthens start', url);
        const throttledOpenAthensCheck = throttle(3100, (newValue) => this.getOpenAthensAsync(newValue));
        throttledOpenAthensCheck(url);
    }

    async getOpenAthensAsync(url) {
        console.log('getOpenAthensAsync start', url);
        await new ApiAccess()
            .loadOpenAthensCheck(url)
            .then((response) => {
                console.log('api response=', response);
                if (response?.available === true) {
                    console.log('getOpenAthensAsync response.useLink=', response.useLink);
                    this.displayUrl(response.useLink);
                } else {
                    // show error
                }
            })
            /* istanbul ignore next */
            .catch((e) => {
                console.log('getOpenAthensAsync, error: ', e);
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
                message: 'Copy function not available in this web browser',
            };
            return;
        }

        this.urlDisplayArea.select();

        try {
            const ezProxy = this;
            if (window.navigator.clipboard && window.navigator.clipboard.writeText) {
                window.navigator.clipboard.writeText(this.outputUrl).then(() => {
                    ezProxy.copyStatus = {
                        success: true,
                        message: 'URL copied successfully',
                    };
                });
            } else {
                const copyStatus = document.execCommand('copy');
                this.copyStatus = {
                    success: !!copyStatus,
                    message: copyStatus ? 'URL copied successfully' : 'Unable to copy URL',
                };
            }
        } catch (err) {
            this.copyStatus = {
                success: false,
                message: 'An error occurred while copying the URL',
            };
        }
    }
}

export default OpenAthens;

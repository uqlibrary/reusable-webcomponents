import mainStyles from './css/main.css';
import customStyles from './css/overrides.css';
import isURL from 'validator/es/lib/isURL';

/*
 * usage:
 *  <ez-proxy create-link="true"></ez-proxy>
 *  <ez-proxy></ez-proxy>
 *
 */

const template = document.createElement('template');
template.innerHTML = `
    <style>
        ${mainStyles.toString()}
        ${customStyles.toString()}
    </style>
    <div id="ez-proxy" data-testid="ez-proxy" class="uq-card">
        <fieldset class="uq-card__content">
            <input type="url" placeholder="DOI or URL" id="ez-proxy-input" data-testid="ez-proxy-input" />
            <div id="ez-proxy-input-error" data-testid="ez-proxy-input-error" class="uq-error-message hidden"></div>
            <button id="ez-proxy-create-link-button" data-testid="ez-proxy-create-link-button" class="uq-button hidden">Create Link</button>
            <span id="ez-proxy-copy-options" data-testid="ez-proxy-copy-options" class="hidden">
                <textarea readonly id="ez-proxy-url-display-area" data-testid="ez-proxy-url-display-area"></textarea>
                <button id="ez-proxy-test-link-button" data-testid="ez-proxy-test-link-button" class="uq-button">Test Link</button>
                <button id="ez-proxy-copy-link-button" data-testid="ez-proxy-copy-link-button" class="uq-button">Copy Link</button>
                <button id="ez-proxy-create-new-link-button" data-testid="ez-proxy-create-new-link-button" class="uq-button uq-button--secondary">Create New Link</button>
                <div id="ez-proxy-copy-status" data-testid="ez-proxy-copy-status"></div>
            </span>
            <span id="ez-proxy-redirect-options" data-testid="ez-proxy-redirect-options" class="hidden">
                <button id="ez-proxy-redirect-button" data-testid="ez-proxy-redirect-button" class="uq-button">Go</button>
                <button id="ez-proxy-input-clear-button" data-testid="ez-proxy-input-clear-button" class="uq-button uq-button--secondary">Clear</button>
            </span>
        </fieldset>
    </div>
`;

class EzProxy extends HTMLElement {
    constructor() {
        super();
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

        this.copyLinkButton = shadowDOM.getElementById('ez-proxy-copy-link-button');
        this.copyOptions = shadowDOM.getElementById('ez-proxy-copy-options');
        this.createLinkButton = shadowDOM.getElementById('ez-proxy-create-link-button');
        this.createNewLinkButton = shadowDOM.getElementById('ez-proxy-create-new-link-button');
        this.inputClearButton = shadowDOM.getElementById('ez-proxy-input-clear-button');
        this.inputErrorArea = shadowDOM.getElementById('ez-proxy-input-error');
        this.inputField = shadowDOM.getElementById('ez-proxy-input');
        this.redirectButton = shadowDOM.getElementById('ez-proxy-redirect-button');
        this.redirectOptions = shadowDOM.getElementById('ez-proxy-redirect-options');
        this.statusToast = shadowDOM.getElementById('ez-proxy-copy-status');
        this.testLinkButton = shadowDOM.getElementById('ez-proxy-test-link-button');
        this.urlDisplayArea = shadowDOM.getElementById('ez-proxy-url-display-area');

        if (this.redirectOnly) {
            this.redirectOptions.classList.remove('hidden');
        } else {
            this.createLinkButton.classList.remove('hidden');
        }

        this.addEventListeners();
    }

    addEventListeners() {
        this.copyLinkButton.addEventListener('click', () => this.copyUrl());
        this.createLinkButton.addEventListener('click', () => this.displayUrl());
        this.createNewLinkButton.addEventListener('click', () => this.resetInput());
        this.inputClearButton.addEventListener('click', () => this.resetInput());
        this.inputField.addEventListener('keypress', (e) => this.inputUrlKeypress(e));
        this.redirectButton.addEventListener('click', () => this.navigateToEzproxy());
        this.testLinkButton.addEventListener('click', () => this.navigateToEzproxy());
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
            this.navigateToEzproxy(e);
        } else {
            this.displayUrl(e);
        }
    }

    /**
     * Remove extraneous bits from the web address
     *
     * @param dest
     * @returns {String}
     */
    cleanupUrl(dest) {
        dest = dest.trim();

        // URLs like the one generated by this component
        var ezpRegexp = /https?:\/\/(www.)?ezproxy.library.uq.edu.au\/login\?url\=/i;
        dest = dest.replace(ezpRegexp, '');

        // Example: http://www.sciencedirect.com.ezproxy.library.uq.edu.au/science/article/pii/S1744388116300159
        var ezproxyUrlRegexp = /(([A-Za-z]*:(?:\/\/)?)(.)+(.ezproxy.library.uq.edu.au))(.*)?/;
        if (ezproxyUrlRegexp.test(dest)) {
            dest = dest.replace('.ezproxy.library.uq.edu.au', '');
        }

        var doiRegexp = /https?:\/\/dx.doi.org\//i;
        dest = dest.replace(doiRegexp, '');

        return dest;
    }

    /**
     * display the ezproxy link
     */
    displayUrl() {
        var cleanedUrl = this.cleanupUrl(this.inputUrl);
        this.inputValidator = this.checkUrl(cleanedUrl);

        if (this.inputValidator.valid) {
            this.outputUrl = this.getUrl(cleanedUrl);
            this.testLinkButton.focus();
        }
    }

    /**
     * Open ezproxy link in a new window/tab
     */
    navigateToEzproxy() {
        if (this.redirectOnly) {
            var cleanedUrl = this.cleanupUrl(this.inputUrl);
            this.inputValidator = this.checkUrl(cleanedUrl);
            this.outputUrl = this.getUrl(cleanedUrl);
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
    getUrl(cleanedUrl) {
        var dest;

        dest = '';
        if (this.inputValidator.valid) {
            dest = 'https://ezproxy.library.uq.edu.au/login?url=';
            if (this.doiRegexp.test(cleanedUrl)) {
                dest += 'https://dx.doi.org/';
            }
            dest += cleanedUrl;
        }
        return dest;
    }

    /**
     * Verify if users URL request is a valid link
     *
     * @param dest - the URl to be checked
     * @returns {Object}
     */
    checkUrl(dest) {
        const validation = {
            valid: false,
            message: '',
        };

        if (dest.length <= 0) {
            validation.message = 'Please enter a URL';
            const inputField = this.shadowRoot.getElementById('ez-proxy-input');
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

    /**
     * Resets url input field
     */
    resetInput() {
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

export default EzProxy;

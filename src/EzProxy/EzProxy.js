import mainStyles from './css/main.css';
import customStyles from './css/overrides.css';
import isURL from 'validator/es/lib/isURL';

/*
 * usage:
 *  <ez-proxy></ez-proxy>
 *  <ez-proxy redirectonly></ez-proxy>
 *
 */

const template = document.createElement('template');
template.innerHTML = `
    <style>
        ${mainStyles.toString()}
        ${customStyles.toString()}
    </style>
    <div id="ez-proxy" class="uq-grid">
        <fieldset class="uq-grid__col--5">
            <input type="url" placeholder="DOI or URL" id="ez-proxy-input" />
            <div id="ez-proxy-input-error" class="uq-error-message hidden"></div>
            <button id="ez-proxy-create-link-button" class="uq-button hidden">Create Link</button>
            <span id="ez-proxy-copy-link-buttons" class="hidden">
                <textarea readonly id="ez-proxy-url-display-area"></textarea>
                <button id="ez-proxy-test-link-button" class="uq-button">Test Link</button>
                <button id="ez-proxy-copy-link-button" class="uq-button">Copy Link</button>
                <button id="ez-proxy-create-new-link-button" class="uq-button">Create New Link</button>
                <div id="ez-proxy-copy-status"></div>
            </span>
            <button id="ez-proxy-redirect-button" class="uq-button hidden">Go</button>
        </fieldset>
    </div>
`;

/**
 * remove extraneous bits from the web address
 * @param dest
 * @returns {String}
 */
const cleanupUrl = (dest) => {
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
};

class EzProxy extends HTMLElement {
    constructor() {
        super();
    }

    get redirectOnly() {
        return this.hasAttribute('redirectonly');
    }

    get inputUrl() {
        const inputField = this.shadowRoot.getElementById('ez-proxy-input');
        return inputField.value;
    }

    set inputUrl(value) {
        const createLinkButton = this.shadowRoot.getElementById('ez-proxy-create-link-button');
        createLinkButton.classList.remove('hidden');

        const inputField = this.shadowRoot.getElementById('ez-proxy-input');
        inputField.value = value;
        inputField.classList.remove('hidden');
        inputField.focus();
    }

    get doiRegexp() {
        return /^\b(10[.][0-9]{3,}(?:[.][0-9]+)*\/(?:(?!['&\'])\S)+)\b/;
    }

    get inputValidator() {
        const valid = this.getAttribute('valid') === 'true';
        return { valid };
    }

    set inputValidator(value) {
        this.setAttribute('valid', value.valid);

        const inputField = this.shadowRoot.getElementById('ez-proxy-input');
        inputField.classList.toggle('uq-input--error', !value.valid);

        const inputErrorArea = this.shadowRoot.getElementById('ez-proxy-input-error');
        inputErrorArea.innerText = value.message;
        inputErrorArea.classList.toggle('hidden', value.valid);
    }

    get outputUrl() {
        const outputArea = this.shadowRoot.getElementById('ez-proxy-url-display-area');
        return outputArea.value;
    }

    set outputUrl(value) {
        const outputArea = this.shadowRoot.getElementById('ez-proxy-url-display-area');
        outputArea.value = value;

        if (this.redirectOnly) {
            return;
        }

        if (!!value) {
            const inputField = this.shadowRoot.getElementById('ez-proxy-input');
            inputField.classList.add('hidden');
            const createLinkButton = this.shadowRoot.getElementById('ez-proxy-create-link-button');
            createLinkButton.classList.add('hidden');
        }

        const copyUrlOptions = this.shadowRoot.getElementById('ez-proxy-copy-link-buttons');
        copyUrlOptions.classList.toggle('hidden', !value);
    }

    set copyStatus(value) {
        const { success, message } = value;
        const statusToast = this.shadowRoot.getElementById('ez-proxy-copy-status');
        statusToast.innerText = message;
        if (!message) {
            statusToast.classList.add('hidden');
            return;
        }
        statusToast.classList.toggle('uq-success-message', success);
        statusToast.classList.toggle('uq-error-message', !success);
        statusToast.classList.remove('hidden');
        setTimeout(() => {
            statusToast.classList.add('open');
        }, 10);
        setTimeout(() => {
            statusToast.classList.remove('open');
            setTimeout(() => {
                this.copyStatus = { message: '' };
            }, 1000);
        }, 3010);
    }

    connectedCallback() {
        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));

        const createLinkButton = shadowDOM.getElementById('ez-proxy-create-link-button');
        const redirectButton = shadowDOM.getElementById('ez-proxy-redirect-button');
        // const urlDisplayArea = shadowDOM.getElementById('ez-proxy-url-display-area');

        if (this.redirectOnly) {
            redirectButton.classList.remove('hidden');
        } else {
            createLinkButton.classList.remove('hidden');
        }

        this.addEventListeners(shadowDOM);
    }

    addEventListeners(shadowDOM) {
        const ezProxy = this;

        const copyLinkButton = shadowDOM.getElementById('ez-proxy-copy-link-button');
        !!copyLinkButton &&
            copyLinkButton.addEventListener('click', () => {
                ezProxy.copyUrl(ezProxy);
            });

        const createLinkButton = shadowDOM.getElementById('ez-proxy-create-link-button');
        !!createLinkButton &&
            createLinkButton.addEventListener('click', (e) => {
                ezProxy.displayUrl(e, ezProxy);
            });

        const createNewLinkButton = shadowDOM.getElementById('ez-proxy-create-new-link-button');
        !!createNewLinkButton &&
            createNewLinkButton.addEventListener('click', () => {
                ezProxy.resetInput(ezProxy);
            });

        const inputField = shadowDOM.getElementById('ez-proxy-input');
        !!inputField &&
            inputField.addEventListener('keypress', (e) => {
                ezProxy.inputUrlKeypress(e, ezProxy);
            });

        const redirectButton = shadowDOM.getElementById('ez-proxy-redirect-button');
        !!redirectButton &&
            redirectButton.addEventListener('click', (e) => {
                ezProxy.navigateToEzproxy(e, ezProxy);
            });

        const testLinkButton = shadowDOM.getElementById('ez-proxy-test-link-button');
        !!testLinkButton &&
            testLinkButton.addEventListener('click', (e) => {
                ezProxy.navigateToEzproxy(e, ezProxy);
            });
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
     * display the ezproxy link
     * @param e
     */
    displayUrl(e) {
        var cleanedUrl = cleanupUrl(this.inputUrl);
        this.inputValidator = this.checkUrl(cleanedUrl);

        if (this.inputValidator.valid) {
            this.outputUrl = this.getUrl(cleanedUrl);
            // this.ga.addEvent('ShowUrl', this.outputUrl);
            this.shadowRoot.getElementById('ez-proxy-test-link-button').focus();
        }
    }

    /**
     * Open ezproxy link in a new window/tab
     * @param e
     */
    navigateToEzproxy(e) {
        if (this.redirectOnly) {
            var cleanedUrl = cleanupUrl(this.inputUrl);
            this.inputValidator = this.checkUrl(cleanedUrl);
            this.outputUrl = this.getUrl(cleanedUrl);
        }

        if (this.inputValidator.valid) {
            // this.ga.addEvent('GoProxy', this.outputUrl);
            var win = window.open(this.outputUrl);
            win.focus();
        }
    }

    /**
     * create the landing url
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
     * resets url input field
     */
    resetInput() {
        this.outputUrl = '';
        this.inputUrl = '';
    }

    /*
     * Copy URL to Clipboard (same as ctrl+a / ctrl+c)
     * Only available for Firefox 41+, Chrome 43+, Opera 29+, IE 10+
     */
    copyUrl() {
        if (!document.execCommand) {
            this.copyStatus = {
                success: false,
                message: 'Copy function not available in this web browser',
            };
            return;
        }

        this.shadowRoot.getElementById('ez-proxy-url-display-area').select();

        try {
            const copyStatus = document.execCommand('copy');
            this.copyStatus = {
                success: !!copyStatus,
                message: copyStatus ? 'URL copied successfully' : 'Unable to copy URL',
            };
        } catch (err) {
            this.copyStatus = {
                success: false,
                message: 'An error occurred while copying the URL',
            };
        }
    }
}

export default EzProxy;

import mainStyles from './css/main.css';
import customStyles from './css/overrides.css';
import isURL from 'validator/es/lib/isURL';

/*
 * usage:
 *  <ez-proxy></ez-proxy>
 *  <ez-proxy copy-only></ez-proxy>
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
            <div id="ez-proxy-input-error" class="hidden"></div>
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

    var ezpRegexp = /https?:\/\/(www.)?ezproxy.library.uq.edu.au\/login\?url\=/i;
    dest = dest.replace(ezpRegexp, '');

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

    get copyOnly() {
        return this.hasAttribute('copy-only');
    }

    get inputUrl() {
        return this.getAttribute('inputUrl');
    }

    set inputUrl(value) {
        this.setAttribute('inputUrl', value);
    }

    get showInputPanel() {
        return this.getAttribute('showInputPanel') === 'true';
    }

    set showInputPanel(value) {
        this.setAttribute('showInputPanel', value);
    }

    get doiRegexp() {
        return /^\b(10[.][0-9]{3,}(?:[.][0-9]+)*\/(?:(?!['&\'])\S)+)\b/;
    }

    get inputValidator() {
        const valid = this.getAttribute('valid');
        const invalid = this.getAttribute('invalid');
        const message = this.getAttribute('validator-message');
        return {
            valid,
            invalid,
            message,
        };
    }

    set inputValidator(value) {
        this.setAttribute('valid', value.valid);
        this.setAttribute('invalid', value.invalid);
        this.setAttribute('validator-message', value.message);
    }

    get outputUrl() {
        return this.getAttribute('outputUrl');
    }

    set outputUrl(value) {
        this.setAttribute('outputUrl', value);

        const inputField = this.shadowRoot.getElementById('ez-proxy-input');
        inputField.classList.add('hidden');

        const createLinkButton = this.shadowRoot.getElementById('ez-proxy-create-link-button');
        createLinkButton.classList.add('hidden');

        const outputArea = this.shadowRoot.getElementById('ez-proxy-url-display-area');
        outputArea.value = value;

        const copyUrlOptions = this.shadowRoot.getElementById('ez-proxy-copy-link-buttons');
        copyUrlOptions.classList.remove('hidden');
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
                statusToast.classList.add('hidden');
                statusToast.innerText = '';
            }, 1000);
        }, 3010);
    }

    connectedCallback() {
        this.setAttribute('showInputPanel', true);

        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));

        const createLinkButton = shadowDOM.getElementById('ez-proxy-create-link-button');
        const redirectButton = shadowDOM.getElementById('ez-proxy-redirect-button');
        // const urlDisplayArea = shadowDOM.getElementById('ez-proxy-url-display-area');

        if (this.copyOnly) {
            createLinkButton.classList.remove('hidden');
        } else {
            redirectButton.classList.remove('hidden');
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
    inputUrlKeypress(e, ezProxy) {
        if (e.keyCode !== 13) {
            ezProxy.setAttribute('inputUrl', e.path[0].value);
            return;
        }
        if (ezProxy.createLink) {
            ezProxy.displayUrl(e, ezProxy);
        } else {
            ezProxy.navigateToEzproxy(e, ezProxy);
        }
    }

    /**
     * display the ezproxy link
     * @param e
     */
    displayUrl(e, ezProxy) {
        var cleanedUrl = cleanupUrl(ezProxy.inputUrl);
        ezProxy.inputValidator = ezProxy.checkUrl(cleanedUrl, ezProxy);
        ezProxy.outputUrl = ezProxy.getUrl(cleanedUrl, ezProxy);

        if (ezProxy.inputValidator.valid) {
            // ezProxy.ga.addEvent('ShowUrl', ezProxy.outputUrl);

            //show output url panel
            ezProxy.showInputPanel = false;
            ezProxy.shadowRoot.getElementById('ez-proxy-test-link-button').focus();
        }
    }

    /**
     * Open ezproxy link in a new window/tab
     * @param e
     */
    navigateToEzproxy(e, ezProxy) {
        var cleanedUrl = cleanupUrl(ezProxy.inputUrl);
        ezProxy.inputValidator = ezProxy.checkUrl(cleanedUrl, ezProxy);
        ezProxy.outputUrl = ezProxy.getUrl(cleanedUrl, ezProxy);

        if (ezProxy.inputValidator.valid) {
            // ezProxy.ga.addEvent('GoProxy', ezProxy.outputUrl);
            var win = window.open(ezProxy.outputUrl);
            win.focus();
        }
    }

    /**
     * create the landing url
     * @param cleanedUrl
     * @returns {string}
     */
    getUrl(cleanedUrl, ezProxy) {
        var dest;

        dest = '';
        if (ezProxy.inputValidator.valid) {
            dest = 'https://ezproxy.library.uq.edu.au/login?url=';
            if (ezProxy.doiRegexp.test(cleanedUrl)) {
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
    checkUrl(dest, ezProxy) {
        const validation = {
            valid: false,
            message: '',
        };

        if (dest.length <= 0) {
            validation.message = 'Please enter a URL';
        } else if (ezProxy.doiRegexp.test(dest)) {
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

        //paper-input-container invalid property doesn't apply ! operator
        validation.invalid = !validation.valid;
        return validation;
    }

    /**
     * resets url input field
     */
    resetInput(ezProxy) {
        ezProxy.showInputPanel = true;
        ezProxy.copyStatus = {
            status: null,
            message: '',
        };
        ezProxy.shadowRoot.getElementById('ez-proxy-input').focus();
        ezProxy.outputUrl = '';
        ezProxy.inputUrl = '';
    }

    /*
     * Copy URL to Clipboard (same as ctrl+a / ctrl+c)
     * Only available for Firefox 41+, Chrome 43+, Opera 29+, IE 10+
     */
    copyUrl(ezProxy) {
        if (!document.execCommand) {
            ezProxy.copyStatus = {
                success: false,
                message: 'Copy function not available in this web browser',
            };
            return;
        }

        ezProxy.shadowRoot.getElementById('ez-proxy-url-display-area').select();

        try {
            const copyStatus = document.execCommand('copy');
            ezProxy.copyStatus = {
                success: !!copyStatus,
                message: copyStatus ? 'URL copied successfully' : 'Unable to copy URL',
            };
        } catch (err) {
            ezProxy.copyStatus = {
                success: false,
                message: 'An error occurred while copying the URL',
            };
        }
    }
}

export default EzProxy;

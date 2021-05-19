import mainStyles from './css/main.css';
import customStyles from './css/overrides.css';

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
            <textarea id="ez-proxy-url-display-area" class="hidden"></textarea>
            <button id="ez-proxy-create-link-button" class="uq-button hidden">Create Link</button>
            <button id="ez-proxy-create-new-link-button" class="uq-button hidden">Create New Link</button>
            <button id="ez-proxy-test-link-button" class="uq-button hidden">Test Link</button>
            <button id="ez-proxy-copy-link-button" class="uq-button hidden">Copy Link</button>
            <button id="ez-proxy-redirect-button" class="uq-button hidden">Go</button>
        </fieldset>
    </div>
`;

class EzProxy extends HTMLElement {
    constructor() {
        super();

        this.createLink = this.isCopyOnly();
        this.doiRegexp = /^\b(10[.][0-9]{3,}(?:[.][0-9]+)*\/(?:(?!['&\'])\S)+)\b/;
        this.inputUrl = '';
        this.outputUrl = '';
        this.copyStatus = '';
        this.showInputPanel = true;
        this.inputValidator = {
            valid: true,
            invalid: false,
            message: '',
        };

        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));

        this.inputField = shadowDOM.getElementById('ez-proxy-input');
        this.createLinkButton = shadowDOM.getElementById('ez-proxy-create-link-button');
        this.createNewLinkButton = shadowDOM.getElementById('ez-proxy-create-new-link-button');
        this.testLinkButton = shadowDOM.getElementById('ez-proxy-test-link-button');
        this.copyLinkButton = shadowDOM.getElementById('ez-proxy-copy-link-button');
        this.redirectButton = shadowDOM.getElementById('ez-proxy-redirect-button');
        this.urlDisplayArea = shadowDOM.getElementById('ez-proxy-url-display-area');

        if (this.createLink) {
            this.createLinkButton.classList.remove('hidden');
        } else {
            this.redirectButton.classList.remove('hidden');
        }

        this.inputField.addEventListener('keypress', this.inputUrlKeypress);

        this.createLinkButton.addEventListener('click', this.displayUrl);
        this.createNewLinkButton.addEventListener('click', this.resetInput);
        this.copyLinkButton.addEventListener('click', this.copyUrl);
        this.testLinkButton.addEventListener('click', this.navigateToEzproxy);
        this.redirectButton.addEventListener('click', this.navigateToEzproxy);
    }

    isCopyOnly() {
        return this.getAttribute('copy-only') !== null;
    }

    /**
     * handle 'enter key' on input field
     * @param e
     */
    inputUrlKeypress(e) {
        if (e.keyCode !== 13) {
            return;
        }
        if (this.createLink) {
            this.displayUrl(e);
        } else {
            this.navigateToEzproxy(e);
        }
    }

    /**
     * display the ezproxy link
     * @param e
     */
    displayUrl(e) {
        var cleanedUrl = this.cleanupUrl(this.inputUrl);
        this.inputValidator = this.checkUrl(cleanedUrl);
        this.outputUrl = this.getUrl(cleanedUrl);

        if (this.inputValidator.valid) {
            this.$.ga.addEvent('ShowUrl', this.outputUrl);

            //show output url panel
            this.showInputPanel = false;
            this.$.testLinkButton.focus();
        }
    }

    /**
     * Open ezproxy link in a new window/tab
     * @param e
     */
    navigateToEzproxy(e) {
        var cleanedUrl = this.cleanupUrl(this.inputUrl);
        this.inputValidator = this.checkUrl(cleanedUrl);
        this.outputUrl = this.getUrl(cleanedUrl);

        if (this.inputValidator.valid) {
            this.$.ga.addEvent('GoProxy', this.outputUrl);
            var win = window.open(this.outputUrl);
            win.focus();
        }
    }

    /**
     * remove extraneous bits from the web address
     * @param dest
     * @returns {String}
     */
    cleanupUrl(dest) {
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
        var validation = {
            valid: false,
            message: '',
        };

        if (dest.length <= 0) {
            validation.message = 'Please enter a URL';
        } else if (this.doiRegexp.test(dest)) {
            validation.valid = true;
        } else if (!validator.isURL(dest, { require_protocol: true })) {
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
     * @param e
     */
    resetInput(e) {
        this.showInputPanel = true;
        this.copyStatus = '';
        this.$.inputUrlTextfield.focus();
        this.outputUrl = '';
        this.inputUrl = '';
    }

    /*
     * Copy URL to Clipboard (same as ctrl+a / ctrl+c)
     * Only available for Firefox 41+, Chrome 43+, Opera 29+, IE 10+
     */
    copyUrl() {
        var copySuccess = {
            success: false,
            message: '',
        };

        if (!document.execCommand) {
            copySuccess.message = 'Copy function not available in this web browser';
            this.copyStatus = copySuccess.message;
            this.$.copyNotification.open();
            return copySuccess;
        }

        //Show the hidden textfield with the URL, and select it
        this.$.outputUrlTextarea.querySelector('#textarea').select();

        try {
            copySuccess.success = document.execCommand('copy');
            copySuccess.message = copySuccess.success ? 'URL copied successfully' : 'Unable to copy URL';
        } catch (err) {
            copySuccess.message = 'An error occurred while copying the URL';
        } finally {
            //Hide the textfield
            this.copyStatus = copySuccess.message;
            this.$.copyNotification.open();
        }

        return copySuccess;
    }
}

export default EzProxy;

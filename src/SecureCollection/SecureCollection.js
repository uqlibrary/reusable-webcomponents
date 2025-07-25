import ApiAccess from '../ApiAccess/ApiAccess';
import UserAccount from '../ApiAccess/UserAccount';
import overrides from './css/overrides.css';
import { authLocale } from '../UtilityArea/auth.locale';
import { apiLocale as apilocale, apiLocale as locale } from '../ApiAccess/ApiAccess.locale';
import { linkToDrupal } from '../helpers/access';

const fileExtensionElement = document.createElement('template');
fileExtensionElement.innerHTML = `
<p data-testid="fileExtension">
    Save the file with a name ending in <b data-testid="secure-collection-file-extension" id="fileExtensionEmphasis"></b> so your system will know how to open
    it.
</p>
`;
const spinnerElement = document.createElement('template');
spinnerElement.innerHTML = `
   <div class="spinnerWrapper" id="spinnerWrapper">
       <span id="spinner" class="spinner" role="progressbar">
          <svg viewBox="22 22 44 44">
              <circle cx="44" cy="44" r="21" fill="none" stroke-width="2"></circle>
          </svg>
       </span>
   </div>
`;
const template = document.createElement('template');
template.innerHTML = `
    <style>${overrides.toString()}</style>
    <div>
        <div id="library-hero" class="block block-system block-system-main-block" data-testid="hero-wrapper">
                <div>
                    <div class="uq-hero">
                        <div class="uq-container">
                            <div class="uq-hero__content" data-testid="hero-words-words-wrapper">
                                <h1 class="uq-hero__title" data-testid="hero-text">Secure collection</h1>
                                <!-- <div class="uq-hero__description"></div> -->
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <div class="root MuiGrid-root MuiGrid-container" data-testid="secure-collection" id="StandardPage">
            <div class="secure-collection-container">
                <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12">
                    <section aria-live="assertive">
                        <div id="block" class="contentbox MuiPaper-root MuiCard-root jss196 StandardCard MuiPaper-elevation1 MuiPaper-rounded StandardCard" data-testid="standard-card-copyright-notice" id="standard-card-copyright-notice">
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
`;

export const getFileExtension = (filename) => {
    /* istanbul ignore next */
    if (filename === undefined) {
        return false;
    }

    // remove any search param from the url so we can extract the file extension
    const url = new URL(filename);
    url.search = '';
    const pathName = url.pathname;

    const dotPosition = pathName.lastIndexOf('.');
    if (dotPosition !== undefined && dotPosition >= 0) {
        return pathName.substr(dotPosition + 1);
    }

    return false;
};

export const getUrlSearchParams = (url) => {
    if (url.search.startsWith('?')) {
        // prod and localhost
        return new URLSearchParams(url.search);
    }
    /* istanbul ignore next */
    if (url.hash.startsWith('#')) {
        // staging has the search params inside the hash :(
        // eg #/collection?collection=thomson&file=classic_legal_texts/Thynne_Accountability_And_Control.pdf
        const search = url.hash.replace('#/collection', '');
        return new URLSearchParams(search);
    }
    return new URLSearchParams(url);
};

export const extractPathFromParams = (href) => {
    const url = new URL(href);
    const searchParams = getUrlSearchParams(url);
    if (!searchParams.has('collection') || !searchParams.has('file')) {
        // if parameters are missing, force 'No such collection' response from the api
        return 'unknown/unknown';
    }
    return `${searchParams.get('collection')}/${searchParams.get('file')}`;
};

const currentSearchParams = extractPathFromParams(window.location.href);

class SecureCollection extends HTMLElement {
    constructor() {
        super();

        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        this.displayPanel = 'loading'; // which display panel should the page display?
        this.redirectLink = null; // the link the user will presently be auto directed to, as there is no copyright to acknowledge
        this.clickLink = null; // the link that the user will click to acknowledge copyright and load the file

        this.displayLoadingPanel();

        this.getSecureCollectionCheck(currentSearchParams);

        this.appendExtensionsSavePrompt = this.appendExtensionsSavePrompt.bind(this);
        this.displayApiErrorPanel = this.displayApiErrorPanel.bind(this);
        this.displayCommercialCopyrightAcknowledgementPanel =
            this.displayCommercialCopyrightAcknowledgementPanel.bind(this);
        this.displayCorrectPanel = this.displayCorrectPanel.bind(this);
        this.displayLoginRequiredRedirectorPanel = this.displayLoginRequiredRedirectorPanel.bind(this);
        this.displayNoAccessPanel = this.displayNoAccessPanel.bind(this);
        this.displayRedirectingPanel = this.displayRedirectingPanel.bind(this);
        this.displayStatutoryCopyrightAcknowledgementPanel =
            this.displayStatutoryCopyrightAcknowledgementPanel.bind(this);
        this.displayUnknownCollectionPanel = this.displayUnknownCollectionPanel.bind(this);
        this.evaluateApiResponse = this.evaluateApiResponse.bind(this);
        this.getSecureCollectionCheck = this.getSecureCollectionCheck.bind(this);
        this.getSecureCollectionFile = this.getSecureCollectionFile.bind(this);
        this.wrapFragmentInStandardPage = this.wrapFragmentInStandardPage.bind(this);
    }

    async getSecureCollectionCheck(path) {
        const that = this;
        await new ApiAccess()
            .loadSecureCollectionCheck(path)
            .then((data) => {
                if (data.response === 'Login required') {
                    return new UserAccount().get().then((accountData) => {
                        if (
                            !!accountData &&
                            accountData.hasOwnProperty('status') &&
                            accountData.status === apilocale.USER_LOGGED_IN
                        ) {
                            // they are logged in! now we ask for the actual file they want
                            that.getSecureCollectionFile(currentSearchParams);
                        } else {
                            this.displayLoginRequiredRedirectorPanel();
                        }
                    });
                } else {
                    that.evaluateApiResponse(data);
                }
                return that.displayCorrectPanel();
            })
            /* istanbul ignore next */
            .catch((e) => {
                return that.displayApiErrorPanel();
            });
    }

    async getSecureCollectionFile(path) {
        const that = this;
        await new ApiAccess()
            .loadSecureCollectionFile(path)
            .then((data) => {
                that.evaluateApiResponse(data);

                return that.displayCorrectPanel();
            })
            .catch(
                /* istanbul ignore next */ (e) => {
                    return that.displayApiErrorPanel();
                },
            );
    }

    displayCorrectPanel() {
        /* istanbul ignore next */
        if (!this.displayPanel) {
            this.displayPanel = 'error';
        }

        switch (this.displayPanel) {
            case 'loading':
                return this.displayLoadingPanel();
            case 'redirect':
                return this.displayRedirectingPanel();
            case 'noSuchCollection':
                return this.displayUnknownCollectionPanel();
            /* istanbul ignore next */
            case 'loginRequired':
                return this.displayLoginRequiredRedirectorPanel(this.redirectLink);
            case 'commercialCopyright':
                return this.displayCommercialCopyrightAcknowledgementPanel();
            case 'statutoryCopyright':
                return this.displayStatutoryCopyrightAcknowledgementPanel();
            case 'invalidUser':
                return this.displayNoAccessPanel();
            /* istanbul ignore next */
            case 'error':
                return this.displayApiErrorPanel();
            /* istanbul ignore next */
            default:
                // to satisfy switch syntax - shouldnt be possible
                this.wrapFragmentInStandardPage('Something went wrong');
        }
    }

    displayLoadingPanel() {
        const block = document.createElement('div');
        block.appendChild(spinnerElement.content.cloneNode(true));
        this.wrapFragmentInStandardPage(block);
    }

    displayCommercialCopyrightAcknowledgementPanel() {
        const commercialCopyrightAcknowledgementPanel = document.createElement('template');
        commercialCopyrightAcknowledgementPanel.innerHTML = `
<p>This file is provided to support teaching and learning for the staff and students of the University of Queensland</p>
<h2>COMMONWEALTH OF AUSTRALIA</h2>
<h3>Copyright Regulations 1969</h3>
<h4>WARNING</h4>
<p>
    This material has been reproduced and communicated to you by or on behalf of the University of Queensland pursuant
    to Part VB of the Copyright Act 1968 (the Act).
</p>
<p>
    The material in this communication may be subject to copyright under the Act. Any further reproduction or
    communication of this material by you may be the subject of copyright protection under the Act.
</p>
<div id="download">
    <a data-analyticsid="secure-collection-commercial-copyright-download-link" data-testid="secure-collection-commercial-copyright-download-link" id="downloadLink" class="followLink" href="">Acknowledge Copyright and Download</a>
</div>
`;
        // update the download link
        const anchor = commercialCopyrightAcknowledgementPanel.content.getElementById('downloadLink');
        anchor.href = this.clickLink;

        const block = document.createElement('div');
        block.appendChild(commercialCopyrightAcknowledgementPanel.content.cloneNode(true));

        this.appendExtensionsSavePrompt(block);

        this.wrapFragmentInStandardPage(block, 'Copyright Notice');
    }

    displayStatutoryCopyrightAcknowledgementPanel() {
        const statutoryCopyrightAcknowledgementPanel = document.createElement('template');
        statutoryCopyrightAcknowledgementPanel.innerHTML = `
<p>
    This material has been reproduced and communicated to you by or on behalf of The University of Queensland in
    accordance with section 113P of the Copyright Act 1968 (the Act). The material in this communication may be subject
    to copyright under the Act.
</p>
<p>
    Any further reproduction or communication of this material by you may be the subject of copyright protection under
    the Act.
</p>
<div id="download">
    <a id="downloadLink" data-analyticsid="secure-collection-statutory-copyright-download-link" data-testid="secure-collection-statutory-copyright-download-link" class="followLink" href="">Acknowledge Copyright and Download</a>
</div>
`;
        // update the download link
        const anchor = statutoryCopyrightAcknowledgementPanel.content.getElementById('downloadLink');
        anchor.href = this.clickLink;

        const block = document.createElement('div');
        block.appendChild(statutoryCopyrightAcknowledgementPanel.content.cloneNode(true));
        this.appendExtensionsSavePrompt(block);

        this.wrapFragmentInStandardPage(block, 'Warning');
    }

    /**
     * if the downloadable file has an extension, eg .pdf, then we prompt the user that they should make sure they save it properly
     * (in practice, all the links have an extension)
     * @param block
     */
    appendExtensionsSavePrompt(block) {
        const fileExtension = !!this.clickLink && getFileExtension(this.clickLink);
        if (!!fileExtension) {
            const anchor = fileExtensionElement.content.getElementById('fileExtensionEmphasis');
            anchor.innerHTML = `.${fileExtension}`;

            block.appendChild(fileExtensionElement.content.cloneNode(true));
        }
    }

    displayUnknownCollectionPanel() {
        const emailAddressDisplay = 'webmaster@library.uq.edu.au';
        const emailSubject = 'Broken link to the Secure File Collection';
        const getEmailBody = () => {
            let emailBody = 'Hi there!' + '\n\n';
            emailBody += "I'd like to report a problem with the Secure File Collection." + '\n\n';
            /* istanbul ignore else */
            if (document.referrer !== '' && document.referrer !== window.location.href) {
                emailBody += 'I was visiting ' + document.referrer + ' and clicked a link.' + '\n';
            }
            emailBody += 'I landed on ' + window.location.href + ' but it said the link wasnt valid.' + '\n\n';
            emailBody +=
                '(You can also include any other detail that will help us provide the file here, ' +
                'including where you were coming from)';
            return encodeURIComponent(emailBody);
        };
        const emailLink = `mailto:${emailAddressDisplay}?Subject=${emailSubject}&body=${getEmailBody()}`;

        const p1 = this.createSimpleTextInElement('Please check the link you have used.');

        const p2 = this.createSimpleTextWithMiddleLinkInElement(
            'Email us at ',
            emailLink,
            emailAddressDisplay,
            ' to report broken links.',
        );

        const block = document.createElement('div');
        block.appendChild(p1);
        block.appendChild(p2);

        this.wrapFragmentInStandardPage(block, 'This file does not exist or is unavailable.');
    }

    displayApiErrorPanel() {
        const message =
            "We're working on the issue and will have service restored as soon as possible. Please try again later.";
        const content = document.createTextNode(message);
        const displayWrapper = document.createElement('p');
        displayWrapper.appendChild(content);

        this.wrapFragmentInStandardPage(displayWrapper, 'System temporarily unavailable');
    }

    displayNoAccessPanel() {
        const noAccessPanel = document.createElement('template');
        noAccessPanel.innerHTML = `
 <ul>
    <li>
        If you have another UQ account, <a id="logoutandreturnhere" data-analyticsid="secure-collection-logoutandreturnhere" href="">logout and switch accounts</a> to proceed.
    </li>
    <li>
        <a data-analyticsid="secure-collection-contact" href="${linkToDrupal(
            '/about/contact-us',
        )}">Contact us</a> if you should have file collection access
        with this account.
    </li>
</ul>
<p>
    Return to the <a data-analyticsid="secure-collection-return" href="https://www.library.uq.edu.au/">Library Home Page</a>.
</p>
`;

        const logoutLink = `${authLocale.AUTH_URL_LOGOUT}${window.btoa(window.location.href)}`;
        const anchor = noAccessPanel.content.getElementById('logoutandreturnhere');
        anchor.href = logoutLink;

        const block = document.createElement('div');
        block.appendChild(noAccessPanel.content.cloneNode(true));

        this.wrapFragmentInStandardPage(block, 'Access to this file is only available to UQ staff and students.');
    }

    // the window is set to the auth url before this panel is displayed, so it should only blink up, if at all
    displayLoginRequiredRedirectorPanel() {
        const loginRequiredRedirectorPanel = document.createElement('template');
        loginRequiredRedirectorPanel.innerHTML = `
<p>Login is required for this file - please wait while you are redirected.</p>
<div id="spinner"></div>
<p>You can <a data-analyticsid="secure-collection-manuallogin" data-testid="secure-collection-auth-redirector" id="redirector" href="">click here</a> if you aren't redirected.</p>
`;

        const redirectLink = `${authLocale.AUTH_URL_LOGIN}${window.btoa(window.location.href)}`;
        /* istanbul ignore next */
        if (!this.isSpecialTestMode()) {
            window.location.assign(redirectLink);
        }

        const anchor = loginRequiredRedirectorPanel.content.getElementById('redirector');
        anchor.href = redirectLink;

        const spinner = loginRequiredRedirectorPanel.content.getElementById('spinner');
        spinner.appendChild(spinnerElement.content.cloneNode(true));

        const block = document.createElement('div');
        block.appendChild(loginRequiredRedirectorPanel.content.cloneNode(true));

        this.wrapFragmentInStandardPage(block, 'Redirecting');
    }

    isSpecialTestMode() {
        /* istanbul ignore next */
        if (window.location.host !== 'localhost:8080') {
            return false;
        }
        const queryString = new URLSearchParams(window.location.search);
        const mode = !!queryString
            ? queryString.get('mode')
            : window.location.hash.substring(window.location.hash.indexOf('?')).mode;
        return mode === 'manualRedirect';
    }

    displayRedirectingPanel() {
        /* istanbul ignore next */
        if (this.redirectLink !== null && !this.isSpecialTestMode()) {
            window.location.assign(this.redirectLink);
        }

        const redirectorPanel = document.createElement('template');
        redirectorPanel.innerHTML = `
<p>We are preparing the file, you should be redirected shortly.</p>
<div id="spinner"></div>
<p style="margin-top: 1rem">You can <a data-testid="secure-collection-resource-redirector" data-analyticsid="secure-collection-manualdownload" id="redirector" href="">download the file</a> if the page does not redirect.</p>
`;

        const anchor = redirectorPanel.content.getElementById('redirector');
        anchor.href = this.redirectLink;

        const spinner = redirectorPanel.content.getElementById('spinner');
        spinner.appendChild(spinnerElement.content.cloneNode(true));

        const block = document.createElement('div');
        block.appendChild(redirectorPanel.content.cloneNode(true));

        this.wrapFragmentInStandardPage(block, 'Redirecting');
    }

    /**
     * delete any existing page child and replace with the passed in one
     * @param fragment
     * @param title
     */
    wrapFragmentInStandardPage(fragment, title = '') {
        const block = this.shadowRoot.getElementById('block');
        // clear current child
        block.innerHTML = '';

        if (!!title) {
            const titleNode = document.createTextNode(title);
            const h2Element = document.createElement('h2');
            h2Element.className =
                'uqds-typography-root MuiCardHeader-title uqds-h2 MuiTypography-colorInherit MuiTypography-displayBlock';
            h2Element.appendChild(titleNode);

            const wrapper = document.createElement('div');
            wrapper.className = 'MuiCardHeader-root wrapper';
            wrapper.appendChild(h2Element);
            block.appendChild(wrapper);
        }

        const blockwrapper = document.createElement('div');
        blockwrapper.appendChild(fragment);
        block.appendChild(blockwrapper);
    }

    evaluateApiResponse(apiResponse) {
        const that = this;

        // unexpectedly, the api responses have attributes all in lower case,
        // ie apiResponse.displaypanel NOT apiResponse.displayPanel
        if (apiResponse.response === 'Invalid User') {
            that.displayPanel = 'invalidUser';
        } else if (apiResponse.displaypanel === 'redirect') {
            /* istanbul ignore else */
            if (!!apiResponse.url) {
                that.displayPanel = 'redirect';
                that.redirectLink = apiResponse.url;
            } else {
                that.displayPanel = 'error';
            }
        } else if (apiResponse.displaypanel === 'commercialCopyright') {
            /* istanbul ignore else */
            if (!!apiResponse.url) {
                that.clickLink = apiResponse.url;
                that.displayPanel = 'commercialCopyright';
            } else {
                that.displayPanel = 'error';
            }
        } else if (apiResponse.displaypanel === 'statutoryCopyright') {
            /* istanbul ignore else */
            if (!!apiResponse.url) {
                that.clickLink = apiResponse.url;
                that.displayPanel = 'statutoryCopyright';
            } else {
                that.displayPanel = 'error';
            }
        } else {
            // should mean secureCollection.response === 'No such collection',
            // but at any rate it isnt one of the recognised types, so display 'no such'
            that.displayPanel = 'noSuchCollection';
        }
    }

    createSimpleTextWithMiddleLinkInElement(starttext, href, linktext, endtext, elementType = 'p') {
        const linktextNode = document.createTextNode(linktext);

        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.appendChild(linktextNode);

        const startText = document.createTextNode(starttext);
        const endText = document.createTextNode(endtext);

        const paragraph = document.createElement(elementType);
        paragraph.appendChild(startText);
        paragraph.appendChild(anchor);
        paragraph.appendChild(endText);
        return paragraph;
    }

    createSimpleTextInElement(text, elementType = 'p') {
        const textNode = document.createTextNode(text);
        const paragraph = document.createElement(elementType);
        paragraph.appendChild(textNode);

        return paragraph;
    }
}

export default SecureCollection;

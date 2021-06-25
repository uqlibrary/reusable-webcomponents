import ApiAccess from '../ApiAccess/ApiAccess';
import overrides from './css/overrides.css';
import { authLocale } from '../UtilityArea/auth.locale';
import { default as menuLocale } from '../locale/menu';

const fileExtensionElement = document.createElement('template');
fileExtensionElement.innerHTML = `
<p data-testid="fileExtension">
    Save the file with a name ending in <b data-testid="secure-collection-file-extension" id="fileExtensionEmphasis"></b> so your system will know how to open
    it.
</p>
`;
const circularProgressElement = document.createElement('template');
circularProgressElement.innerHTML = `
    <div class="MuiCircularProgress-root MuiCircularProgress-colorPrimary MuiCircularProgress-indeterminate"
         role="progressbar" data-testid="loading-secure-collection" style="width: 20px; height: 20px;">
        <svg class="MuiCircularProgress-svg" viewBox="22 22 44 44">
            <circle class="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate" cx="44" cy="44" r="20.2"
                    fill="none" stroke-width="3.6"></circle>
        </svg>
    </div>
`;

const template = document.createElement('template');
template.innerHTML = `
    <style>${overrides.toString()}</style>
    <div class="root MuiGrid-root MuiGrid-container" data-testid="secure-collection" id="StandardPage">
        <div class="secure-collection-container">
            <div class="MuiGrid-root jss163 MuiGrid-item MuiGrid-grid-xs-true"><h2
                    class="MuiTypography-root jss162 MuiTypography-h4 MuiTypography-colorPrimary"
                    data-testid="StandardPage-title">Secure Collection</h2></div>
            <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12">
                <section aria-live="assertive">
                    <div id="block" class="MuiPaper-root MuiCard-root jss196 StandardCard MuiPaper-elevation1 MuiPaper-rounded jss196 StandardCard" data-testid="standard-card-copyright-notice" id="standard-card-copyright-notice">
                    </div>
                </section>
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
        this.loadFileApi = false; // true: Check Api indicates all good, go on and load the File Api

        // add 'go back' button if page has a referer TODO

        this.displayLoadingPanel();

        this.getSecureCollectionCheck(currentSearchParams);

        this.displayRedirectingPanel = this.displayRedirectingPanel.bind(this);
        this.getSecureCollectionCheck = this.getSecureCollectionCheck.bind(this);
    }

    async getSecureCollectionCheck(path) {
        const that = this;
        await new ApiAccess()
            .loadSecureCollectionCheck(path)
            .then((data) => {
                console.log('getSecureCollectionCheck got: ', data);
                that.evaluateApiResponse(data);
            })
            /* istanbul ignore next */
            .catch((e) => {
                console.log('catch getSecureCollectionCheck, error: ', e);
                that.displayPanel = 'error';
                return that.displayCorrectPanel();
            })
            .finally((e) => {
                console.log('finally getSecureCollectionCheck ', e);
                if (!that.loadFileApi && !!that.displayPanel) {
                    // may not need loadFileApi
                    return that.displayCorrectPanel();
                }
            });
    }

    async getSecureCollectionFile(path) {
        const that = this;
        await new ApiAccess()
            .loadSecureCollectionFile(path)
            .then((data) => {
                that.evaluateApiResponse(data);

                if (!!that.displayPanel) {
                    return that.displayCorrectPanel();
                }
            })
            /* istanbul ignore next */
            .catch((e) => {
                console.log('loadSecureCollectionFile, error: ', e);
                that.displayPanel = 'error';
                return that.displayCorrectPanel();
            });
    }

    displayCorrectPanel() {
        console.log('displaying the correct panel, per: ', this.displayPanel);
        switch (this.displayPanel) {
            case 'loading':
                console.log('displayCorrectPanel loading');
                return this.displayLoadingPanel();
            case 'redirect':
                console.log('displayCorrectPanel redirect');
                return this.displayRedirectingPanel(this.redirectLink);
            case 'noSuchCollection':
                console.log('displayCorrectPanel noSuchCollection');
                return this.displayUnknownCollectionPanel();
            case 'commercialCopyright':
                console.log('displayCorrectPanel commercialCopyright');
                return this.displayCommercialCopyrightAcknowledgementPanel();
            case 'statutoryCopyright':
                console.log('displayCorrectPanel statutoryCopyright');
                return this.displayStatutoryCopyrightAcknowledgementPanel();
            case 'invalidUser':
                console.log('displayCorrectPanel invalidUser');
                return this.displayNoAccessPanel();
            case 'error':
                console.log('displayCorrectPanel error');
                return this.displayApiErrorPanel();
            /* istanbul ignore next */
            default:
                console.log('displayCorrectPanel default');
                // to satisfy switch syntax - shouldnt be possible
                this.wrapFragmentInStandardPage('Something went wrong');
        }
    }

    displayLoadingPanel() {
        const block = document.createElement('div');
        block.appendChild(circularProgressElement.content.cloneNode(true));
        this.wrapFragmentInStandardPage(block);
    }

    displayCommercialCopyrightAcknowledgementPanel() {
        const fileExtension = !!this.clickLink && getFileExtension(this.clickLink);

        const commercialCopyrightAcknowledgementPanel = document.createElement('template');
        commercialCopyrightAcknowledgementPanel.innerHTML = `
<p>This file is provided to support teaching and learning for the staff and students of the University of Queensland</p>
<h3>COMMONWEALTH OF AUSTRALIA</h3>
<h4>Copyright Regulations 1969</h4>
<h5>WARNING</h5>
<p>
    This material has been reproduced and communicated to you by or on behalf of the University of Queensland pursuant
    to Part VB of the Copyright Act 1968 (the Act).
</p>
<p>
    The material in this communication may be subject to copyright under the Act. Any further reproduction or
    communication of this material by you may be the subject of copyright protection under the Act.
</p>
<div id="download">
    <a data-testid="secure-collection-commercial-copyright-download-link" id="downloadLink" class="followLink" href="">
        Acknowledge Copyright and Download
    </a>
</div>
`;

        // update the download link
        const anchor = commercialCopyrightAcknowledgementPanel.content.getElementById('downloadLink');
        anchor.href = this.clickLink;

        const block = document.createElement('div');
        block.appendChild(commercialCopyrightAcknowledgementPanel.content.cloneNode(true));

        if (!!fileExtension) {
            const anchor = fileExtensionElement.content.getElementById('fileExtensionEmphasis');
            anchor.innerHTML = `.${fileExtension}`;

            block.appendChild(fileExtensionElement.content.cloneNode(true));
        }

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
    <a id="downloadLink" data-testid="secure-collection-statutory-copyright-download-link" class="followLink" href="">
        Acknowledge Copyright and Download
    </a>
</div>
`;

        // update the download link
        const anchor = statutoryCopyrightAcknowledgementPanel.content.getElementById('downloadLink');
        anchor.href = this.clickLink;

        const block = document.createElement('div');
        block.appendChild(statutoryCopyrightAcknowledgementPanel.content.cloneNode(true));

        const fileExtension = !!this.clickLink && getFileExtension(this.clickLink);
        if (!!fileExtension) {
            const anchor = fileExtensionElement.content.getElementById('fileExtensionEmphasis');
            anchor.innerHTML = `.${fileExtension}`;

            block.appendChild(fileExtensionElement.content.cloneNode(true));
        }

        this.wrapFragmentInStandardPage(block, 'WARNING');
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
        If you have another UQ account, <a id="logoutandreturnhere" href="">logout and switch accounts</a> to proceed.
    </li>
    <li>
        <a href="https://web.library.uq.edu.au/contact-us">Contact us</a> if you should have file collection access
        with this account.
    </li>
</ul>
<p>
    Return to the <a href="https://www.library.uq.edu.au/">Library Home Page</a>.
</p>
`;

        const logoutLink = `${authLocale.AUTH_URL_LOGOUT}?return=${window.btoa(window.location.href)}`;
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
<div id="circularprogress"></div>
<p>You can <a id="redirector" href="">click here</a> if you aren't redirected.</p>
`;

        const redirectLink = `${authLocale.AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;
        console.log('displayLoginRequiredRedirectorPanel: I will redirect to ', redirectLink);
        window.location.assign(redirectLink);

        const anchor = loginRequiredRedirectorPanel.content.getElementById('redirector');
        anchor.href = redirectLink;

        const circularprogress = loginRequiredRedirectorPanel.content.getElementById('circularprogress');
        circularprogress.appendChild(circularProgressElement.content.cloneNode(true));

        const block = document.createElement('div');
        block.appendChild(loginRequiredRedirectorPanel.content.cloneNode(true));

        this.wrapFragmentInStandardPage(block, 'Redirecting');
    }

    displayRedirectingPanel(redirectLink) {
        /* istanbul ignore else */
        if (redirectLink !== null) {
            console.log('displayRedirectingPanel: I will redirect to ', redirectLink);
            window.location.assign(redirectLink);
        }

        const redirectorPanel = document.createElement('template');
        redirectorPanel.innerHTML = `
<p>We are preparing the file, you should be redirected shortly.</p>
<p>You can <a id="redirector" href="">download the file</a> if the page does not redirect.</p>
<div id="circularprogress"></div>
`;

        const anchor = redirectorPanel.content.getElementById('redirector');
        anchor.href = redirectLink;

        const circularprogress = redirectorPanel.content.getElementById('circularprogress');
        circularprogress.appendChild(circularProgressElement.content.cloneNode(true));

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
            const h3 = document.createElement('h3');
            h3.className =
                'MuiTypography-root MuiCardHeader-title MuiTypography-h5 MuiTypography-colorInherit MuiTypography-displayBlock';
            h3.appendChild(titleNode);

            const wrapper = document.createElement('div');
            wrapper.className = 'MuiCardHeader-root wrapper';
            wrapper.appendChild(h3);
            block.appendChild(wrapper);
        }

        const blockwrapper = document.createElement('div');
        blockwrapper.style.marginBottom = '24px';
        blockwrapper.style.paddingLeft = '24px';
        blockwrapper.style.paddingRight = '24px';
        blockwrapper.style.paddingBottom = '24px';
        blockwrapper.appendChild(fragment);
        block.appendChild(blockwrapper);
    }

    async isUserLoggedin() {
        console.log('loggedin');
        const that = this;
        let loggedin = false;
        await new ApiAccess()
            .getAccount()
            .then((account) => {
                console.log('loggedin? account = ', account);
                /* istanbul ignore else */
                if (account.hasOwnProperty('hasSession') && account.hasSession === true) {
                    that.account = account;
                }
                that.accountLoading = false;

                loggedin = !!that.account && !!that.account.id;
            })
            .catch((error) => {
                that.accountLoading = false;
            });
        console.log('loggedin: ', loggedin);
        return loggedin;
    }

    evaluateApiResponse(apiResponse) {
        const that = this;
        console.log('evaluateApiResponse: ', apiResponse);

        // unexpectedly, the api responses have attributes all in lower case,
        // ie secureCollection.displaypanel NOT secureCollection.displayPanel

        if (apiResponse.response === 'Login required') {
            console.log('secureCollection.response === Login required');
            this.isUserLoggedin()
                .then((isLoggedIn) => {
                    if (!!isLoggedIn) {
                        console.log('user is logged in');
                        // that.displayPanel = 'loading'; // assume we dont need it as we start off loading
                        // they are actually logged in! now we ask for the actual file they want
                        that.getSecureCollectionFile(currentSearchParams);
                    } else {
                        console.log('user is NOT logged in');
                        this.displayLoginRequiredRedirectorPanel();
                    }
                })
                .catch(() => {
                    console.log('catch: user is NOT logged in');
                    // no, this should be system error
                    this.displayLoginRequiredRedirectorPanel();
                });
        } else if (apiResponse.response === 'Invalid User') {
            that.displayPanel = 'invalidUser';
        } else if (apiResponse.displaypanel === 'redirect') {
            console.log('redirect');
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

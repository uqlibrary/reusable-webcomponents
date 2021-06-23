import ApiAccess from '../ApiAccess/ApiAccess';
import overrides from './css/overrides.css';

const template = document.createElement('template');
template.innerHTML = `
    <style>${overrides.toString()}</style>
    <div class="root MuiGrid-root MuiGrid-container" data-testid="StandardPage" id="StandardPage">
        <div class="secure-collection-container">
            <div class="MuiGrid-root jss163 MuiGrid-item MuiGrid-grid-xs-true"><h2
                    class="MuiTypography-root jss162 MuiTypography-h4 MuiTypography-colorPrimary"
                    data-testid="StandardPage-title">Secure Collection</h2></div>
            <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12">
                <section aria-live="assertive">
                    <div class="MuiPaper-root MuiCard-root jss196 StandardCard MuiPaper-elevation1 MuiPaper-rounded"
                         data-testid="standard-card-copyright-notice" id="standard-card-copyright-notice">
<!--                        <div class="MuiCardHeader-root" style="border-top-left-radius: 4px; border-top-right-radius: 4px;">-->
<!--                            <div class="MuiCardHeader-content">-->
<!--                                <h3-->
<!--                                    class="MuiTypography-root MuiCardHeader-title MuiTypography-h5 MuiTypography-colorInherit MuiTypography-displayBlock"-->
<!--                                    data-testid="standard-card-copyright-notice-header">Copyright Notice</h3>-->
<!--                            </div>-->
<!--                        </div>-->
                        <div class="MuiCardContent-root jss197" data-testid="standard-card-copyright-notice-content">
                            <div class="MuiGrid-root MuiGrid-container">
                                <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"
                                     style="width: 80px; margin-right: 20px; margin-bottom: 6px; opacity: 0.3;">
                                    <div class="MuiCircularProgress-root MuiCircularProgress-colorPrimary MuiCircularProgress-indeterminate"
                                         role="progressbar" data-testid="loading-secure-collection" style="width: 20px; height: 20px;">
                                        <svg class="MuiCircularProgress-svg" viewBox="22 22 44 44">
                                            <circle class="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate" cx="44" cy="44" r="20.2"
                                                    fill="none" stroke-width="3.6"></circle>
                                        </svg>
                                    </div>
                                </div>
                                <!-- here -->
<!--                                <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12" data-testid="secure-collection"-->
<!--                                     style="margin-bottom: 24px; padding-left: 24px; padding-right: 24px;">-->
<!--                                     <p class="copyrightsubhead">This file is provided to support teaching and learning for-->
<!--                                        the staff and students of the University of Queensland</p>-->
<!--                                    <h3>COMMONWEALTH OF AUSTRALIA</h3><h4>Copyright Regulations 1969</h4><h5>WARNING</h5>-->
<!--                                    <p>This material has been reproduced and communicated to you by or on behalf of the-->
<!--                                        University of Queensland pursuant to Part VB of the Copyright Act 1968 (the-->
<!--                                        Act).</p>-->
<!--                                    <p>The material in this communication may be subject to copyright under the Act. Any-->
<!--                                        further-->
<!--                                        reproduction or communication of this material by you may be the subject of-->
<!--                                        copyright-->
<!--                                        protection under the Act.</p>-->
<!--                                    <div id="download">-->
<!--                                    <a class="followLink"-->
<!--                                                          href="https://files.library.uq.edu.au/secure/bomdata/ev_2012.zip?Expires=1624499954&amp;Signature=C-htj9YO3qzAsQca36GiZV5hT~K8i5fFQ4-Kjy7-fjOeS-nlH8NXJjCD5xPz3GfdSK0rOJSFyPalhLZNbflOOinkuDQ0aROiAFvaBKDwdQFW0IUbu2tidmHTYpyGJCFjgeKKMimvJhPWP4tpL9q86sU9N4gIr2y7iRF5i36i5aUMGQhluZC9C5MUnwQG4b85ZtEa~VDVJiZaACEyoXhVpcSnHxU4eLm2r9Q65na~iBNAQkqKzP9djuxXjOawJ5qczcpxfCINZqGg8dNcuf6uill3D5ODCL-sViT8yqO02RvT0-~NFkY4Rbvbmn8vXD5oO4gYNBwFiKSv-2z3x4sQlg__&amp;Key-Pair-Id=APKAJNDQICYW445PEOSA">Acknowledge-->
<!--                                        Copyright and Download</a></div>-->
<!--                                    <p data-testid="fileExtension">Save the file with a name ending in <b>.zip</b> so your-->
<!--                                        system will know how to open it.</p>-->
<!--                                </div>-->
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
`;

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

        // add 'go back' button if page has a referer

        this.getSecureCollectionCheck(currentSearchParams);

        this.getSecureCollectionCheck = this.getSecureCollectionCheck.bind(this);
    }

    async getSecureCollectionCheck(path) {
        console.log('getSecureCollectionCheck');
        const that = this;
        await new ApiAccess()
            .loadSecureCollectionCheck(path)
            .then((data) => {
                console.log('got: ', data);
                that.evaluateApiResponse(data);
                if (!!that.loadFileApi) {
                    getSecureCollectionFile(currentSearchParams);
                } else if (!!that.displayPanel) {
                    return that.displayCorrectPanel();
                }
            })
            /* istanbul ignore next */
            .catch((e) => {
                console.log('catch getSecureCollectionCheck, error: ', e);
                // throw up footer error here?
                that.displayPanel = 'error';
                return that.displayCorrectPanel();
            });
    }

    async getSecureCollectionFile(path) {
        const that = this;
        await new ApiAccess()
            .loadSecureCollectionFile(secureCollection)
            .then((data) => {
                that.evaluateApiResponse(data);

                if (!!that.displayPanel) {
                    return that.displayCorrectPanel();
                }
            })
            /* istanbul ignore next */
            .catch((e) => {
                console.log('loadSecureCollectionFile, error: ', e);
                // throw up footer error here?
            });
    }

    // loadCheckResults(secureCollection) {
    //     const that = this;
    //
    //     this.evaluateApiResponse(secureCollection);
    //
    //     if (!!that.loadFileApi) {
    //         getSecureCollectionFile(currentSearchParams);
    //     } else if (!!that.displayPanel) {
    //         return this.displayCorrectPanel();
    //     }
    // }

    displayCorrectPanel() {
        switch (this.displayPanel) {
            case 'error':
                return this.displayApiErrorPanel();
            case 'loading':
                return this.displayLoadingPanel();
            case 'noSuchCollection':
                return this.displayUnknownCollectionPanel();
            case 'loginRequired':
                return this.displayLoginRequiredRedirectorPanel(that.redirectLink);
            case 'commercialCopyright':
                return this.displayCommercialCopyrightAcknowledgementPanel();
            case 'statutoryCopyright':
                return this.displayStatutoryCopyrightAcknowledgementPanel();
            case 'invalidUser':
                return this.displayNoAccessPanel();
            case 'redirect':
                return this.displayRedirectingPanel(that.redirectLink);
            /* istanbul ignore next */
            default:
                // to satisfy switch syntax - shouldnt be possible
                return this.wrapFragmentInStandardPage('', <div className="waiting empty">Something went wrong</div>);
        }
    }

    displayLoadingPanel() {
        return (
            <Grid item xs={'auto'} style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}>
                <div
                    className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"
                    style="width: 80px; margin-right: 20px; margin-bottom: 6px; opacity: 0.3;"
                >
                    <div
                        className="MuiCircularProgress-root MuiCircularProgress-colorPrimary MuiCircularProgress-indeterminate"
                        role="progressbar"
                        data-testid="loading-secure-collection"
                        style="width: 20px; height: 20px;"
                    >
                        <svg className="MuiCircularProgress-svg" viewBox="22 22 44 44">
                            <circle
                                className="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate"
                                cx="44"
                                cy="44"
                                r="20.2"
                                fill="none"
                                stroke-width="3.6"
                            />
                        </svg>
                    </div>
                </div>
            </Grid>
        );
    }

    displayCommercialCopyrightAcknowledgementPanel() {
        return this.wrapFragmentInStandardPage(
            'Copyright Notice',
            <React.Fragment>
                <p className={'copyrightsubhead'}>
                    This file is provided to support teaching and learning for the staff and students of the University
                    of Queensland
                </p>
                <h3>COMMONWEALTH OF AUSTRALIA</h3>
                <h4>Copyright Regulations 1969</h4>
                <h5>WARNING</h5>
                <p>
                    This material has been reproduced and communicated to you by or on behalf of the University of
                    Queensland pursuant to Part VB of the Copyright Act 1968 (the Act).
                </p>
                <p>
                    The material in this communication may be subject to copyright under the Act. Any further
                    reproduction or communication of this material by you may be the subject of copyright protection
                    under the Act.
                </p>
                <div id="download">
                    <a className={classes.followLink} href={clickLink}>
                        Acknowledge Copyright and Download
                    </a>
                </div>
                {!!fileExtension && (
                    <p data-testid={'fileExtension'}>
                        Save the file with a name ending in <b>.{fileExtension}</b> so your system will know how to open
                        it.
                    </p>
                )}
            </React.Fragment>,
        );
    }

    displayStatutoryCopyrightAcknowledgementPanel() {
        return this.wrapFragmentInStandardPage(
            'WARNING',
            <React.Fragment>
                <p>
                    This material has been reproduced and communicated to you by or on behalf of The University of
                    Queensland in accordance with section 113P of the Copyright Act 1968 (the Act). The material in this
                    communication may be subject to copyright under the Act.
                </p>
                <p>
                    Any further reproduction or communication of this material by you may be the subject of copyright
                    protection under the Act.
                </p>
                <div id="download">
                    <a className={classes.followLink} href={clickLink}>
                        Acknowledge Copyright and Download
                    </a>
                </div>
                {!!fileExtension && (
                    <p data-testid={'fileExtension'}>
                        Save the file with a name ending in <b>.{fileExtension}</b> so your system will know how to open
                        it.
                    </p>
                )}
            </React.Fragment>,
        );
    }

    displayUnknownCollectionPanel() {
        const emailAddress = 'webmaster@library.uq.edu.au';
        const emailSubject = 'Broken link to the Secure File Collection';
        const getEmailBody = () => {
            let emailBody = 'Hi there!' + '\n\n';
            emailBody += "I'd like to report a problem with the Secure File Collection." + '\n\n';
            /* istanbul ignore else */
            if (document.referrer !== '') {
                emailBody += 'I was visiting ' + document.referrer + ' and clicked a link.' + '\n';
            }
            emailBody += 'I landed on ' + window.location.href + ' but it said the link wasnt valid.' + '\n\n';
            emailBody +=
                '(You can also include any other detail that will help us provide the file here, ' +
                'including where you were coming from)';
            return encodeURIComponent(emailBody);
        };
        const emailLink = `mailto:${emailAddress}?Subject=${emailSubject}&body=${getEmailBody()}`;

        return this.wrapFragmentInStandardPage(
            'This file does not exist or is unavailable.',
            <React.Fragment>
                <p>Please check the link you have used.</p>
                <p>
                    Email us at <a href={emailLink}>{emailAddress}</a> to report broken links.
                </p>
            </React.Fragment>,
        );
    }

    displayApiErrorPanel() {
        console.log('displayApiErrorPanel');
        return this.wrapFragmentInStandardPage(
            'System temporarily unavailable',
            // 'body'
            <p>
                We're working on the issue and will have service restored as soon as possible. Please try again later.
            </p>,
        );
    }

    displayNoAccessPanel() {
        const logoutLink = `${AUTH_URL_LOGOUT}?return=${window.btoa(window.location.href)}`;
        return this.wrapFragmentInStandardPage(
            'Access to this file is only available to UQ staff and students.',
            <React.Fragment>
                <ul>
                    <li>
                        If you have another UQ account, <a href={logoutLink}>logout and switch accounts</a> to proceed.
                    </li>
                    <li>
                        <a href={menuLocale.contactus.link}>Contact us</a> if you should have file collection access
                        with this account.
                    </li>
                </ul>
                <p>
                    Return to the <a href="https://www.library.uq.edu.au/">Library Home Page</a>.
                </p>
            </React.Fragment>,
        );
    }

    // the window is set to the auth url before this panel is displayed, so it should only blink up, if at all
    displayLoginRequiredRedirectorPanel(redirectLink) {
        /* istanbul ignore else */
        if (redirectLink !== null) {
            window.location.assign(redirectLink);
        }
        return this.wrapFragmentInStandardPage(
            'Redirecting',
            <React.Fragment>
                <p>Login is required for this file - please wait while you are redirected.</p>

                <Grid item xs={'auto'} style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}>
                    <CircularProgress color="primary" size={20} data-testid="loading-secure-collection-login" />
                </Grid>

                <p>
                    You can <a href={redirectLink}>click here</a> if you aren't redirected.
                </p>
            </React.Fragment>,
        );
    }

    displayRedirectingPanel(redirectLink) {
        /* istanbul ignore else */
        if (redirectLink !== null) {
            window.location.assign(redirectLink);
        }
        return this.wrapFragmentInStandardPage(
            'Redirecting',
            <React.Fragment>
                <p>We are preparing the file, you should be redirected shortly.</p>
                <p>
                    You can <a href={redirectLink}>download the file</a> if the page does not redirect.
                </p>

                <Grid item xs={'auto'} style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}>
                    <CircularProgress color="primary" size={20} data-testid="loading-secure-collection-redirect" />
                </Grid>
            </React.Fragment>,
        );
    }

    wrapFragmentInStandardPage(title, fragment) {
        console.log('wrapFragmentInStandardPage ', title);
        // delete any existing page child and replace with the passed in one
        // return (
        //     <StandardPage title="Secure Collection" goBackFunc={() => history.back()}>
        //         <section aria-live="assertive">
        //             <StandardCard title={title} noPadding>
        //                 <Grid container>
        //                     <Grid
        //                         item
        //                         xs={12}
        //                         data-testid="secure-collection"
        //                         style={{ marginBottom: 24, paddingLeft: 24, paddingRight: 24 }}
        //                     >
        //                         {fragment}
        //                     </Grid>
        //                 </Grid>
        //             </StandardCard>
        //         </section>
        //     </StandardPage>
        // );
    }

    evaluateApiResponse(secureCollection) {
        const that = this;
        console.log('evaluateApiResponse: ', secureCollection);

        // unexpectedly, the api responses have attributes all in lower case,
        // ie secureCollection.displaypanel NOT secureCollection.displayPanel
        // if (!!secureCollectionError) {
        //     that.displayPanel = 'error';
        // } else if (!secureCollectionError && !!secureCollectionLoading) {
        //     that.displayPanel = 'loading';
        // } else if (!secureCollection) {
        //     that.displayPanel = 'loading'; // initially
        // } else
        if (secureCollection.response === 'Login required') {
            if (!account || !account.id) {
                that.displayPanel = 'loginRequired';
                that.redirectLink = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;
            } else {
                that.displayPanel = 'loading';
                // they are actually logged in! now we ask for the actual file they want
                that.loadFileApi = true;
            }
        } else if (secureCollection.response === 'Invalid User') {
            that.displayPanel = 'invalidUser';
        } else if (secureCollection.displaypanel === 'redirect') {
            /* istanbul ignore else */
            if (!!secureCollection.url) {
                that.displayPanel = 'redirect';
                that.redirectLink = secureCollection.url;
            } else {
                that.displayPanel = 'error';
            }
        } else if (secureCollection.displaypanel === 'commercialCopyright') {
            /* istanbul ignore else */
            if (!!secureCollection.url) {
                that.clickLink = secureCollection.url;
                that.displayPanel = 'commercialCopyright';
            } else {
                that.displayPanel = 'error';
            }
        } else if (secureCollection.displaypanel === 'statutoryCopyright') {
            /* istanbul ignore else */
            if (!!secureCollection.url) {
                that.clickLink = secureCollection.url;
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
}

export default SecureCollection;

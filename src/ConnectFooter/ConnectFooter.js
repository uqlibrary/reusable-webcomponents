import styles from './css/overrides.css';
import icons from './css/icons.css';
import { default as menuLocale } from '../locale/menu';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${icons.toString()}</style>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700" rel="stylesheet">
    <div data-testid="connect-footer" id="connect-footer" class="connect-footer connectfooter-wrapper griditem griditem12" data-gtm-category="Footer">
        <div class="uq-footer__container connectfooter-wrapper2 griditem griditem12">
            <div class="connectfooter-wrapper3">
                <div class="layout-card">
                    <div class="gridcontainer flexstart justifyxscenter" data-testid="connect-footer" id="connect-footer-block">
                        <div class="navigation griditem griditem12 gridmd4">
                            <ul id="footer-menu" data-testid="connect-footer-menu" class="footerMenu">
                            </ul>
                        </div>
                    <div class="contacts griditem griditem12 gridmd4">
                        <div class="gridcontainer">
                            <div class="griditem gridxsauto">
                                <h3 class="typography typographyh6">Connect with us</h3>
                            </div>
                        </div>
                        <div class="gridcontainer spacingxs1">
                            <div class="griditem gridxsauto" id="buttonSocial-0">
                                <button class="buttonBase button socialButtonClass buttonContained buttonContainedPrimary" tabindex="0" type="button" aria-label="Library Blog" data-testid="connect-footer-blog-link" id="socialbutton-0" title="Library Blog">
                                    <span class="buttonLabel">
                                        <svg class="svgIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                                        </svg>
                                    </span>
                                    <span class="touchRipple"></span>
                                </button>
                            </div>
                            <div class="griditem gridxsauto" id="buttonSocial-1">
                                <button class="buttonBase button socialButtonClass buttonContained buttonContainedPrimary" tabindex="0" type="button" aria-label="Library on Twitter" data-testid="connect-twitter-link" id="socialbutton-1" title="Library on Twitter">
                                    <span class="buttonLabel">
                                        <svg class="svgIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                                        </svg>
                                    </span>
                                    <span class="touchRipple"></span>
                                </button>
                            </div>
                            <div class="griditem gridxsauto" id="buttonSocial-2">
                                <button class="buttonBase button socialButtonClass buttonContained buttonContainedPrimary" tabindex="0" type="button" aria-label="Library on Facebook" data-testid="connect-facebook-link" id="socialbutton-2" title="Library on Facebook">
                                    <span class="buttonLabel">
                                        <svg class="svgIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"></path>
                                        </svg>
                                    </span>
                                    <span class="touchRipple"></span>
                                </button>
                            </div>
                            <div class="griditem gridxsauto" id="buttonSocial-3">
                                <button class="buttonBase button socialButtonClass buttonContained buttonContainedPrimary" tabindex="0" type="button" aria-label="Library on Instagram" data-testid="connect-instagram-link" id="socialbutton-3" title="Library on Instagram">
                                    <span class="buttonLabel">
                                        <svg class="svgIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                                        </svg>
                                    </span>
                                    <span class="touchRipple"></span>
                                </button>
                            </div>
                            <div class="griditem gridxsauto" id="buttonSocial-4">
                                <button class="buttonBase button socialButtonClass buttonContained buttonContainedPrimary" tabindex="0" type="button" aria-label="Library on YouTube" data-testid="connect-youtube-link" id="socialbutton-4" title="Library on YouTube">
                                    <span class="buttonLabel">
                                        <svg class="svgIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"></path>
                                        </svg>
                                    </span>
                                    <span class="touchRipple"></span>
                                </button>
                            </div>
                        </div>
                        <div class="internalLinks">
                            <span>
                                <a data-testid="connect-feedback-link" href="https://support.my.uq.edu.au/app/library/feedback">Library feedback</a>
                                <span>&nbsp;|&nbsp; </span>
                            </span>
                            <span>
                                <a data-testid="connect-participate-link" href="https://web.library.uq.edu.au/about-us/participate-customer-research">Help us improve</a>
                                <span>&nbsp;|&nbsp; </span>
                            </span>
                            <span>
                                <a data-testid="connect-sitemap-link" href="https://web.library.uq.edu.au/sitemap">Site Map</a>
                            </span>
                        </div>
                    </div>
                    <div class="givingWrapper griditem griditem12 gridmd4">
                        <div class="gridcontainer MuiGrid-spacing-xs-2">
                            <div class="givingBlock griditem griditem12">
                                <button class="buttonBase button buttonContained givingButtonClass buttonFullWidth" tabindex="0" type="button" data-testid="connect-friends-link">
                                    <span class="buttonLabel">Join Friends of the Library</span>
                                    <span class="touchRipple"></span>
                                </button>
                            </div>
                            <div class="givingBlock griditem griditem12">
                                <button class="buttonBase button buttonContained givingButtonClass buttonFullWidth" tabindex="0" type="button" data-testid="connect-give-link">
                                    <span class="buttonLabel">Give to the Library</span>
                                    <span class="touchRipple"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

let initCalled;

class ConnectFooter extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        this.updateFooterMenuFromJson();

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        // Bindings
        this.loadJS = this.loadJS.bind(this);
    }

    updateFooterMenuFromJson() {
        const plainSeparator = document.createElement('span');
        plainSeparator.textContent = ' | ';

        const footerMenu = template.content.getElementById('footer-menu');

        const homelink = this.createLink(
            'footermenu-homepage',
            menuLocale.menuhome.linkTo || '',
            menuLocale.menuhome.primaryText || '',
        );

        const homeMenuItem = document.createElement('li');
        homeMenuItem.appendChild(homelink);
        homeMenuItem.appendChild(plainSeparator);

        footerMenu.appendChild(homeMenuItem);

        menuLocale.publicmenu.forEach((linkProperties, index) => {
            const menulink = this.createLink(
                linkProperties.dataTestid || '',
                linkProperties.linkTo || '',
                linkProperties.primaryText || '',
            );

            const menuItem = document.createElement('li');
            menuItem.appendChild(menulink);

            const separator = document.createElement('span');
            separator.setAttribute('class', 'separator');
            separator.textContent = ' | ';
            menuItem.appendChild(separator);

            footerMenu.appendChild(menuItem);
        });
    }

    createLink(datatestid, href, linktext) {
        const homelink = document.createElement('a');
        homelink.setAttribute('data-testid', datatestid);
        homelink.setAttribute('href', href);
        const textOfLink = document.createTextNode(linktext);
        homelink.appendChild(textOfLink);
        return homelink;
    }

    loadJS() {
        // This loads the external JS file into the HTML head dynamically
        //Only load js if it has not been loaded before (tracked by the initCalled flag)
        if (!initCalled) {
            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function () {
                //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
                initCalled = true;
            };
            //Specify the location of the ITS DS JS file
            script.src = 'connect-footer.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    }

    connectedCallback() {
        this.loadJS();
    }
}

export default ConnectFooter;

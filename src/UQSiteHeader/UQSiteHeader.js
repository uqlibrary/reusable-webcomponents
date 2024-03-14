import styles from './css/main.css';
import overrides from './css/overrides.css';
import { default as menuLocale } from '../locale/menu';

/**
 * API:
 *   <uq-site-header
 *       sitetitle="Library"                     // should be displayed on all sites - the text of the homepage link. Optional. Default "Library"
 *       siteurl="http://www.library.uq.edu.au"  // should be displayed on all sites - the link of the homepage link. Optional. Default "http://www.library.uq.edu.au"
 *       showmenu                                // should the megamenu be displayed? (just include, don't put ="true" on the end)
 *   >
 *       <span slot="site-utilities">
 *           <askus-button />
 *       </span>
 *       <span slot="site-utilities">
 *           <auth-button />
 *       </span>
 *   </uq-site-header>
 *
 * ie uqsiteheader does not add the utility area buttons itself - add them externally by either html or javascriot
 */

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${overrides.toString()}</style>
  <div class="uq-site-header" part="root">
      <!-- Site title and utility area with mobile nav toggler (JS) -->
      <div class="uq-site-header__title-container" part="title">
        <div class="uq-site-header__title-container__left">
          <a id="site-title" data-testid="site-title" href="https://www.library.uq.edu.au/" class="uq-site-header__title">Library</a>
        </div>
        <div class="uq-site-header__title-container__right">
          <slot name="site-utilities"></slot>
          <button style="display: none" id="uq-site-header__navigation-toggle" class="uq-site-header__navigation-toggle jsNavToggle">Menu</button>
        </div>
      </div>

      <!-- Navigation Menu  -->
      <div id="uq-site-header__navigation-container"></div>
    </div>
    <a name="after-header" />  
`;

let initCalled;

class UQSiteHeader extends HTMLElement {
    static get observedAttributes() {
        return ['sitetitle', 'siteurl', 'showmenu'];
    }

    constructor() {
        super();

        // when the ITS script loads, we store a the object it supplies so we can use it
        // when the menu has finished loading to supply the menu mouseover
        this.uqReference = null;

        // Bindings
        this.getLink = this.getLink.bind(this);
        this.loadScript = this.loadScript.bind(this);
        this.updateMegaMenu = this.updateMegaMenu.bind(this);
        this.rewriteMegaMenuFromJson = this.rewriteMegaMenuFromJson.bind(this);
        this.createDesktopHeaderItem = this.createDesktopHeaderItem.bind(this);
        this.createMobileHeaderItem = this.createMobileHeaderItem.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setSiteUrl = this.setSiteUrl.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.unhideMobileMenuButton = this.unhideMobileMenuButton.bind(this);
        this.handlePanelClick = this.handlePanelClick.bind(this);

        // Render the template
        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));

        this.panelClicksAdded = false;
    }

    attributeChangedCallback(fieldName, oldValue, newValue) {
        const that = this;

        // the dom is not loaded for a moment
        const awaitShadowDom = setInterval(() => {
            /* istanbul ignore next */
            if (!that.shadowRoot) {
                return;
            }

            clearInterval(awaitShadowDom);

            switch (fieldName) {
                case 'sitetitle':
                    this.setTitle(newValue);

                    break;
                case 'siteurl':
                    this.setSiteUrl(newValue);

                    break;
                case 'showmenu':
                    console.log('showmenu');
                    this.showMenu();

                    break;
                /* istanbul ignore next  */
                default:
                    console.log(`unhandled attribute ${fieldName} received for UQSiteHeader`);
            }
        }, 50);
    }

    setSiteUrl(newSiteURL) {
        const siteTitleElement = !!this.shadowRoot && this.shadowRoot.getElementById('site-title');
        !!siteTitleElement && !!newSiteURL && (siteTitleElement.href = newSiteURL);
    }

    setTitle(newSiteTitle) {
        let siteTitleElement = !!this.shadowRoot && this.shadowRoot.getElementById('site-title');
        !!siteTitleElement && !!newSiteTitle && (siteTitleElement.innerHTML = newSiteTitle);
    }

    handlePanelClick(panelId) {
        console.log('handlePanelClick panelId= ', panelId);
        const panelIdFull = `panel-${panelId}`;
        const clickedPanel = this.shadowRoot.getElementById(panelIdFull);
        console.log('handlePanelClick clickedPanel= ', clickedPanel);
        if (!clickedPanel) {
            return;
        }

        if (clickedPanel.classList.contains('panel-showing')) {
            // click on an open panel
            clickedPanel.classList.remove('panel-showing');
            clickedPanel.classList.add('panel-panel-hidden');
        } else {
            // click on a closed panel - close any that are open and opened the clickee
            const listAllPanels = this.shadowRoot.querySelectorAll('.new-panels .panel-showing');
            !!listAllPanels &&
                listAllPanels.forEach((p) => {
                    p.classList.remove('panel-showing');
                    p.classList.add('panel-hidden');
                });
            !!clickedPanel && clickedPanel.classList.add('panel-showing');
        }
    }

    showMenu() {
        this.updateMegaMenu();

        this.unhideMobileMenuButton();
    }

    // waitOnUqScript() {
    //     const that = this;
    //     // we must wait for the script to finish loading before we can use it
    //     const waitOnUqScript = setInterval(
    //         () => {
    //             if (!that.uqReference) {
    //                 return;
    //             }
    //             clearInterval(waitOnUqScript);
    //
    //             const navelement = !!this.shadowRoot && this.shadowRoot.getElementById('uq-site-header__navigation-container');
    //             const uq = that.uqReference;
    //             !!navelement && new uq.siteHeaderNavigation(navelement, 'uq-site-header__navigation');
    //         },
    //         50,
    //         that,
    //     );
    // }

    updateMegaMenu() {
        const navpanels = `<div class="new-nav">
            <div class="new-nav-buttons">
                <button class="nav-button nav-button-findborrow" id="nav-button-findborrow">
                    <span class="new-icon icon-bookreading"><svg style="margin-top: 14px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 48 60" enable-background="new 0 0 48 48" xml:space="preserve"><g><g><path fill="none" stroke="#51247a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="    M1,4.509c0,0,11.972-7.895,22.204,0v29.465c0,0-11.199-5.199-22.204,0V4.509z"/><path fill="none" stroke="#51247a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="    M45.408,28.139V4.509c0,0-11.971-7.895-22.204,0v29.465c0,0,1.575-0.732,4.124-1.372"/></g><path fill="none" stroke="#51247a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="   M43.578,47v-5.12L47,30.743c0,0-0.089-2.604-1.711-2.604c-1.62,0-2.791,1.347-2.791,1.347s0.09-2.245-1.351-2.245   c-1.441,0-2.612,1.615-2.612,1.615s-0.81-1.795-1.98-2.063s-1.35-9.79-1.35-9.79s-0.63-1.704-1.711-1.704s-2.612,0.896-2.612,2.425   c0,1.526-0.449,11.044-0.449,11.044l-3.691,1.526l4.772,12.126L31.603,47H43.578z"/><path fill="none" stroke="#51247a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="   M5.925,8.135c0,0,7.002-2.411,12.221,0"/><path fill="none" stroke="#51247a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="   M27.565,8.135c0,0,7.001-2.411,12.22,0"/><path fill="none" stroke="#51247a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="   M5.925,14.264c0,0,7.002-2.414,12.221,0"/><path fill="none" stroke="#51247a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="   M5.925,20.391c0,0,7.002-2.413,12.221,0"/><path fill="none" stroke="#51247a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="   M5.925,26.518c0,0,7.002-2.411,12.221,0"/></g></svg></span>
                    <span class="new-label label-findborrow">Find and borrow</span>
                </button>
                <button class="nav-button nav-button-study-learning" id="nav-button-study-learning">
                    <span class="new-icon icon-whiteboard"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 20 25" style="enable-background:new 0 0 20 20;" xml:space="preserve"><path d="M19,0H1C0.4,0,0,0.4,0,1v12c0,0.6,0.4,1,1,1h5.4l-2.3,4.6c-0.2,0.5,0,1.1,0.4,1.3c0.5,0.2,1.1,0,1.3-0.4L6.6,18h6.8l0.7,1.4  c0.2,0.5,0.8,0.7,1.3,0.4c0.5-0.2,0.7-0.8,0.4-1.3L13.6,14H19c0.6,0,1-0.4,1-1V1C20,0.4,19.6,0,19,0z M12.4,16H7.6l1-2h2.8L12.4,16z   M18,12H2V2h16V12z" style="fill: #51247a;"/></svg></span>
                    <span class="new-label label-study-learning">Study and Learning support</span>
                </button>
                <button class="nav-button nav-button-visit" id="nav-button-visit">
                    <span class="new-icon icon-explore"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve"><g><path d="M25.526,43.119l-3.223,1.734c-0.197,0.044-0.403,0.029-0.593-0.047l-5.34-2.136c-0.509-0.205-1.095,0.043-1.3,0.558   c-0.205,0.513,0.045,1.095,0.558,1.3l5.339,2.136c0.356,0.143,0.735,0.214,1.115,0.214c0.302,0,0.604-0.045,0.896-0.137   c0.061-0.019,0.118-0.044,0.174-0.073l3.321-1.787c0.486-0.262,0.669-0.868,0.407-1.354C26.619,43.039,26.012,42.857,25.526,43.119   z" style="fill: #51247a;"/><path d="M12.371,41.071L8,39.323V11.476l12.968,5.188c0.641,0.257,1.354,0.283,2.009,0.077L37,12.359V28c0,0.553,0.447,1,1,1   s1-0.447,1-1V12.387l6.684,2.227c0.528,0.177,1.09-0.108,1.265-0.632c0.175-0.524-0.108-1.091-0.632-1.265l-7.387-2.462   c-0.601-0.201-1.239-0.208-1.844-0.018l-14.707,4.595c-0.216,0.068-0.454,0.06-0.668-0.026L7.371,9.071   C7.066,8.949,6.715,8.986,6.439,9.172C6.165,9.358,6,9.668,6,10v30c0,0.409,0.249,0.776,0.629,0.929l5,2   C11.75,42.977,11.876,43,12,43c0.396,0,0.772-0.237,0.929-0.629C13.134,41.858,12.884,41.276,12.371,41.071z" style="fill: #51247a;"/><path d="M53.316,15.052l-3-1c-0.528-0.176-1.09,0.108-1.265,0.632c-0.175,0.524,0.108,1.091,0.632,1.265L52,16.72v27.803   l-3.629-1.452c-0.508-0.206-1.095,0.043-1.3,0.558c-0.205,0.513,0.045,1.095,0.558,1.3l5,2C52.748,46.976,52.874,47,53,47   c0.197,0,0.393-0.059,0.561-0.172C53.835,46.641,54,46.332,54,46V16C54,15.569,53.725,15.187,53.316,15.052z" style="fill: #51247a;"/><path d="M22,18c-0.553,0-1,0.447-1,1v22c0,0.553,0.447,1,1,1s1-0.447,1-1V19C23,18.447,22.553,18,22,18z" style="fill: #51247a;"/><path d="M44.071,45.656c-0.016-0.016-0.037-0.021-0.053-0.035C45.255,44.079,46,42.126,46,40c0-4.963-4.037-9-9-9s-9,4.037-9,9   s4.037,9,9,9c2.127,0,4.08-0.745,5.622-1.983c0.015,0.016,0.02,0.037,0.035,0.053l3.636,3.637C46.488,50.902,46.744,51,47,51   s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414L44.071,45.656z M37,47c-3.859,0-7-3.141-7-7s3.141-7,7-7s7,3.141,7,7   S40.859,47,37,47z" style="fill: #51247a;"/></g></svg></span>
                    <span class="new-label label-visit">Visit</span>
                </button>
                <button class="nav-button nav-button-research" id="nav-button-research">
                    <span class="new-icon icon-research"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" style="enable-background:new 0 0 100 100;" xml:space="preserve"><g xmlns="http://www.w3.org/2000/svg" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" i:extraneous="self" style="fill: #51247a;"><path d="M47.958,61.162l18.238-8.503l0.958,2.054c1.109,2.378,0.08,5.204-2.298,6.312l-9.628,4.489    c-2.377,1.109-5.204,0.08-6.312-2.298L47.958,61.162z"/><path d="M93.938,90.375H57.817c-1.296-3.146-3.451-5.819-6.137-7.831L90.823,64.18c1.888-0.886,2.702-3.136,1.816-5.024    c-0.886-1.883-3.136-2.704-5.026-1.814L46.775,76.502c-7.627,2.888-16.213-0.933-19.142-8.568    c-2.732-7.122,0.451-15.019,7.07-18.452c1.791,1.084,3.869,1.743,6.115,1.743c0.82,0,1.621-0.083,2.394-0.242l1.735,3.721    l18.238-8.503L46.744,10.942c-1.109-2.377-3.935-3.406-6.312-2.297l-2.043,0.953l-2.813-6.032    c-0.431-0.924-1.529-1.323-2.453-0.893l-2.361,1.101c-0.924,0.431-1.324,1.529-0.893,2.453l2.812,6.031l-1.878,0.876    c-2.377,1.109-3.406,3.935-2.297,6.312l4.962,10.641c-2.737,2.176-4.526,5.494-4.526,9.261c0,1.49,0.306,2.901,0.807,4.214    c-8.987,5.544-13.088,16.867-9.172,27.079c1.844,4.803,5.263,8.656,9.642,11.215c-3.125,2.058-5.593,5.016-7.036,8.518H6.062    c-1.967,0-3.562,1.595-3.562,3.562c0,1.967,1.595,3.562,3.562,3.562h15.7h37.474h34.7c1.967,0,3.562-1.595,3.562-3.562    C97.5,91.97,95.905,90.375,93.938,90.375z M40.818,34.598c2.619,0,4.75,2.129,4.75,4.75s-2.131,4.75-4.75,4.75    s-4.75-2.129-4.75-4.75S38.2,34.598,40.818,34.598z"/></g></svg></span>
                    <span class="new-label label-research">Research and Publish</span>
                </button>
                <button class="nav-button nav-button-askus" id="nav-button-askus">
                    <span class="new-icon icon-askus"><svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" style="fill: #51247a;"></path></svg></span>
                    <span class="new-label label-askus">IT support</span>
                </button>
                <button class="nav-button nav-button-about" id="nav-button-about">
                    <span class="new-icon icon-townhall"><svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 68 85" x="0px" y="0px"><path d="M45.87,64.62H22.13V28.31L34,11.69,45.87,28.31Zm-21.74-2H43.87V29L34,15.13,24.13,29Z" style="fill: #51247a;"/><path d="M62.88,64.62h-19v-37h19Zm-17-2h15v-33h-15Z" style="fill: #51247a;"/><path d="M24.13,64.62h-19v-37h19Zm-17-2h15v-33h-15Z" style="fill: #51247a;"/><rect x="61.88" y="27.63" width="4.12" height="2" style="fill: #51247a;"/><rect x="2" y="27.63" width="4.12" height="2" style="fill: #51247a;"/><rect x="3.03" y="62.62" width="61.94" height="2" style="fill: #51247a;"/><path d="M40,64.62H28V47.06H40Zm-10-2h8V49.06H30Z" style="fill: #51247a;"/><rect x="31.94" y="54.85" width="2" height="2" style="fill: #51247a;"/><rect x="49.88" y="35.16" width="2" height="5" style="fill: #51247a;"/><rect x="54.88" y="35.16" width="2" height="5" style="fill: #51247a;"/><rect x="49.88" y="44.16" width="2" height="5" style="fill: #51247a;"/><rect x="54.88" y="44.16" width="2" height="5" style="fill: #51247a;"/><rect x="49.88" y="53.16" width="2" height="5" style="fill: #51247a;"/><rect x="54.88" y="53.16" width="2" height="5" style="fill: #51247a;"/><rect x="11.12" y="35.16" width="2" height="5" style="fill: #51247a;"/><rect x="16.12" y="35.16" width="2" height="5" style="fill: #51247a;"/><rect x="11.12" y="44.16" width="2" height="5" style="fill: #51247a;"/><rect x="16.12" y="44.16" width="2" height="5" style="fill: #51247a;"/><rect x="11.12" y="53.16" width="2" height="5" style="fill: #51247a;"/><rect x="16.12" y="53.16" width="2" height="5" style="fill: #51247a;"/><path d="M35,43.16H26.87V32.94H35Zm-6.13-2H33V34.94H28.87Z" style="fill: #51247a;"/><path d="M41.13,43.16H33V32.94h8.13Zm-6.13-2h4.13V34.94H35Z" style="fill: #51247a;"/><path d="M34,30.64a4,4,0,1,1,4-4A4,4,0,0,1,34,30.64Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,34,24.64Z" style="fill: #51247a;"/><rect x="33" y="4.38" width="2" height="9.04" style="fill: #51247a;"/><path d="M40.74,9.9H33V3.38h7.74ZM35,7.9h3.74V5.38H35Z" style="fill: #51247a;"/></svg></span>
                    <span class="new-label label-about">About</span>
                </button>
            </div>
            <div class="new-panels">
                <div class="panel panel-hidden panel-findborrow" id="panel-findborrow">
                    <p>UQ Library provides searching and borrowing facilities</p>
                    <ul class="littlePanels">
                        <li><a href="">Search</a> our full collection of resources <div class="readmorelink"> <a href="">Read more</a></div></li>
                        <li>We hold significant <a href="">Collections and resources</a> that support the teaching, learning and research needs of the UQ community.</li>
                        <li><a href="">The University of Queensland Archives</a> collects and preserves university records of enduring value, to document the administrative history and support corporate accountability.</li>
                        <li>Students, staff and members can <a href="">borrow</a> library resources. <div class="readmorelink"> <a href="">Read more</a></div></li>
                        <li>You can <a href="">request</a> the resources you need for teaching, learning, and research.</li>
                        <li style="margin-bottom: 15px"><a href="">Become a Library member</a><br /><a href="">Join or renew your membership</a><br />Our Friends play a vital role in supporting the Library to build and showcase our collection.  Become a Friend of the Library to attend a great program of events or to support our work!</li>
                    </ul>
                </div>
                <div class="panel panel-hidden panel-study-learning" id="panel-study-learning">
                    <p>UQ Library Study and Learning support blah blah blah</p>
                    <ul class="littlePanels">
                       <li><a href="">Library orientation events</a></li>
                       <li><a href="">Course work</a></li>
                       <li><a href="">Training and workshops</a></li>
                       <li><a href="">Library Guides</a></li>
                       <li><a href="">Copyright advice</a></li>
                       <li style="margin-bottom: 15px"><a href="">Support for teaching staff</a></li>
                    </ul>
                </div>
                <div class="panel panel-hidden panel-visit" id="panel-visit">
                    <p>UQ Library locations offer many features blah blah blah</p>
                    <ul class="littlePanels">
                        <li>
                                <span class="textWithIcon"><a href="">
                                    <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AccessTimeIcon" aria-label="fontSize large"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8"></path><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></svg>
                                    <span>All opening hours</span>
                                </a></span>
                        </li>
                        <li>
                                <span class="textWithIcon"><a href="">
                                    <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AirlineSeatLegroomNormalIcon" aria-label="fontSize large"><path d="M5 12V3H3v9c0 2.76 2.24 5 5 5h6v-2H8c-1.66 0-3-1.34-3-3m15.5 6H19v-7c0-1.1-.9-2-2-2h-5V3H6v8c0 1.65 1.35 3 3 3h7v7h4.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5"></path></svg>
                                    <span>Using library study spaces</span>
                                </a></span>
                        </li>
                        <li>
                        <p>(maybe we could put a dynamic map here, with icons on our library location that load the page about that Library when clicked)</p>
                            <img src="https://assets.library.uq.edu.au/reusable-webcomponents-development/redo-nav/applications/shared/mapuq.png"  style=" min-width: 768px; min-height: 439px; width: 100%; margin-top: 1rem" />
                            <!--
                            <ul>
                                <li><a href="">Architecture and Music Library</a></li>
                                <li><a href="">Biological Sciences Library</a></li>
                                <li><a href="">Central Library</a></li>
                                <li><a href="">Dorothy Hill Engineering and Sciences Library</a></li>
                                <li><a href="">Duhig Tower</a></li>
                                <li><a href="">Dutton Park Health Sciences Library</a></li>
                                <li><a href="">Fryer Library</a></li>
                                <li><a href="">Gatton Library</a></li>
                                <li><a href="">Herston Health Sciences Libraryï»¿ï»¿</a></li>
                                <li><a href="">Law Library</a></li>
                            </ul>
                            -->
                    </li>
                </ul>
                </div>
                <div class="panel panel-hidden panel-research" id="panel-research">
                    <p>UQ Library Research and publish blah blah blah</p>
                    <ul class="littlePanels">
                        <li><a href="">Open Scholarship</a></li>
                        <li><a href="">ORCID and researcher IDs</a></li>
                        <li><a href="">Find funding</a></li>
                        <li><a href="">Your research data</a></li>
                        <li><a href="">Metrics</a></li>
                        <li><a href="">Impact</a></li>
                        <li><a href="">Engagement</a></li>
                        <li><a href="">Publish</a></li>
                        <li style="margin-bottom: 15px"><a href="">UQ eSpace</a></li>
                    </ul>
                </div>
                <div class="panel panel-hidden panel-askus" id="panel-askus">
                    <p>UQ Library IT support blah blah blah</p>
                    <ul class="littlePanels">
                        <li><a href="">Print, scan and copy</a></li>
                        <li><a href="">Software</a></li>
                        <li><a href="">Referencing software</a></li>
                        <li><a href="">Online exams</a></li>
                        <li><a href="">Inspera</a></li>
                        <li><a href="">Office 365</a></li>
                        <li><a href="">Using your own devices</a></li>
                        <li style="margin-bottom: 15px"><a href="">Using library devices</a></li>
                    </ul>
                </div>
                <div class="panel panel-hidden panel-about" id="panel-about">
                    <p>About UQ Library blah blah blah</p>
                    <ul class="littlePanels">
                        <li>Read about the <a href="">History</a> of the Library</li>
                        <li><a href="">Our People</a></li>
                        <li><a href="">Employment</a></li>
                        <li><a href="">Policies</a></li>
                        <li><a href="">Awards</a></li>
                        <li style="margin-bottom: 15px"><a href="">Contact</a></li>
                    </ul>
                </div>
            </div>
        </div>`;
        const navpanelsElement = document.createElement('div');
        !!navpanelsElement && (navpanelsElement.id = 'nav-wrapper');
        !!navpanelsElement && navpanelsElement.setAttribute('class', 'nav-wrapper');
        !!navpanelsElement && (navpanelsElement.innerHTML = navpanels);

        const navPanelContainer =
            !!this.shadowRoot && this.shadowRoot.getElementById('uq-site-header__navigation-container');
        !!navPanelContainer && !!navpanels && navPanelContainer.appendChild(navpanelsElement);

        const that = this;
        if (!this.panelClicksAdded) {
            // this is inefficient but is fine for a demo
            const findbutton = that.shadowRoot.getElementById('nav-button-findborrow');
            if (!!findbutton) {
                findbutton.addEventListener('click', function clickFindPanel() {
                    that.handlePanelClick('findborrow');
                });
            }

            const studylearningbutton = that.shadowRoot.getElementById('nav-button-study-learning');
            !!studylearningbutton &&
                studylearningbutton.addEventListener('click', function clickStudyPanel() {
                    that.handlePanelClick('study-learning');
                });

            const visitbutton = that.shadowRoot.getElementById('nav-button-visit');
            !!visitbutton &&
                visitbutton.addEventListener('click', function clickVisitPanel() {
                    that.handlePanelClick('visit');
                });

            const researchbutton = that.shadowRoot.getElementById('nav-button-research');
            !!researchbutton &&
                researchbutton.addEventListener('click', function clickResearchPanel() {
                    that.handlePanelClick('research');
                });

            const askusbutton = that.shadowRoot.getElementById('nav-button-askus');
            !!askusbutton &&
                askusbutton.addEventListener('click', function clickAsusPanel() {
                    that.handlePanelClick('askus');
                });

            const aboutbutton = that.shadowRoot.getElementById('nav-button-about');
            !!aboutbutton &&
                aboutbutton.addEventListener('click', function clickAboutPanel() {
                    // this.currentPanelId = 'about';
                    that.handlePanelClick('about');
                });
            this.panelClicksAdded = true;
        }
    }

    createSubmenuCloseControl(linkPrimaryText, index) {
        const parentTextNode = document.createTextNode(linkPrimaryText);
        const closeControlNode = document.createElement('button');
        !!closeControlNode &&
            closeControlNode.setAttribute(
                'class',
                'uq-site-header__navigation__list--close slide-menu__backlink slide-menu__control mobile-only',
            );
        !!closeControlNode && closeControlNode.setAttribute('data-action', 'back');
        !!closeControlNode &&
            closeControlNode.setAttribute('data-testid', `uq-site-header__navigation__list--close-${index}`);
        !!closeControlNode && !!parentTextNode && closeControlNode.appendChild(parentTextNode);

        const listItem = document.createElement('li');
        !!listItem && listItem.setAttribute('class', 'mobile-only uq-site-header__navigation__list-item-header');
        !!listItem && !!closeControlNode && listItem.appendChild(closeControlNode);

        return listItem;
    }

    rewriteMegaMenuFromJson(menu) {
        const listWrapper = !!this.shadowRoot && this.shadowRoot.querySelector('.uq-site-header__navigation__list');
        const insertAboveChild =
            !!this.shadowRoot &&
            this.shadowRoot.querySelector('.uq-site-header__navigation__list__first-permanent-child');

        // get the id of the last list item which has primary text (ie, its not a placeholder)
        // so we can tab out of the last _visible_ menu item
        function getIdOfLastVisibleMenuItem(jsonParentItem) {
            let lastId = 0;
            jsonParentItem.submenuItems.forEach((jsonChild, indexChild) => {
                !!jsonChild.primaryText && (lastId = indexChild);
            });
            return lastId;
        }

        menuLocale.publicmenu.forEach((jsonParentItem, index) => {
            const datatestid = `menu-group-item-${index}`;
            const hasChildren = !!jsonParentItem.submenuItems && jsonParentItem.submenuItems.length > 0;
            const linkHref = jsonParentItem.linkTo || /* istanbul ignore next */ '';
            const linkPrimaryText = jsonParentItem.primaryText || /* istanbul ignore next */ '';

            // desktop has a link at top (submenu opens on mouseover); mobile has a button that opens the submenu
            const parentListItem = document.createElement('li');
            let classNavListitem = 'uq-site-header__navigation__list-item';
            !!hasChildren && (classNavListitem += ' uq-site-header__navigation__list-item--has-subnav');
            const activeClassName = ' uq-site-header__navigation__list-item--active';
            /* istanbul ignore next */
            jsonParentItem.linkTo === window.location.href && (classNavListitem += activeClassName);
            parentListItem.setAttribute('class', classNavListitem);
            parentListItem.setAttribute('data-testid', datatestid);
            parentListItem.setAttribute('data-analyticsid', datatestid);
            parentListItem.setAttribute('data-gtm-category', 'Main navigation');
            parentListItem.setAttribute('aria-haspopup', 'true');
            parentListItem.setAttribute('aria-expanded', 'false');

            parentListItem.appendChild(this.createDesktopHeaderItem(datatestid, linkHref, linkPrimaryText));
            if (hasChildren) {
                parentListItem.appendChild(this.createMobileHeaderItem(linkPrimaryText, datatestid));

                // make child items
                const listItemWrapper = document.createElement('ul');
                let listItemClass = 'uq-site-header__navigation__list uq-site-header__navigation__list--level-2';
                !!jsonParentItem.columnCount &&
                    jsonParentItem.columnCount > 1 &&
                    (listItemClass += ' multicolumn-' + jsonParentItem.columnCount);
                listItemClass += ' menu-undisplayed'; // desktop menus initially have width 0, this stops the page havent a stupidly wide width
                listItemWrapper.setAttribute('class', listItemClass);

                const textOfParentLinkNode = document.createTextNode(linkPrimaryText);

                const slideCloseControl = !!linkPrimaryText && this.createSubmenuCloseControl(linkPrimaryText, index);
                !!listItemWrapper && !!slideCloseControl && listItemWrapper.appendChild(slideCloseControl);

                const topMostLink = document.createElement('a');
                !!topMostLink && !!linkHref && topMostLink.setAttribute('href', this.getLink(linkHref));
                !!topMostLink && !!textOfParentLinkNode && topMostLink.appendChild(textOfParentLinkNode);

                const repeatParentListItem = document.createElement('li');
                repeatParentListItem.appendChild(topMostLink);
                !!repeatParentListItem &&
                    repeatParentListItem.setAttribute('class', 'uq-site-header__navigation__list-item mobile-only');

                !!listItemWrapper && !!repeatParentListItem && listItemWrapper.appendChild(repeatParentListItem);

                let lastId = getIdOfLastVisibleMenuItem(jsonParentItem);
                jsonParentItem.submenuItems.forEach((jsonChild, indexChild) => {
                    const listItem = document.createElement('li');
                    let theClassName = 'uq-site-header__navigation__list-item';
                    indexChild === 0 && (theClassName = `${theClassName} first-child`);
                    indexChild === lastId && (theClassName = `${theClassName} final-child`);
                    listItem.setAttribute('class', theClassName);
                    listItem.setAttribute(
                        'data-testid',
                        `${jsonParentItem.dataTestid}-${indexChild}` || /* istanbul ignore next */ '',
                    );
                    listItem.setAttribute(
                        'data-analyticsid',
                        `${jsonParentItem.dataTestid}-${indexChild}` || /* istanbul ignore next */ '',
                    );

                    // a missing primary text allows for an empty list item on desktop, controlling the spacing of the menu
                    if (!!jsonChild.primaryText) {
                        const primarytextOfLink = document.createTextNode(
                            jsonChild.primaryText || /* istanbul ignore next */ '',
                        );
                        const primaryTextItem = document.createElement('span');
                        primaryTextItem.setAttribute('class', 'displayText');
                        primaryTextItem.appendChild(primarytextOfLink);

                        const secondaryText = jsonChild.secondaryText || ' ';
                        const secondarytextOfLink = document.createTextNode(secondaryText);
                        const secondaryTextItem = document.createElement('span');
                        let secondaryClassName = 'displayText secondaryText';
                        secondaryText === ' ' && (secondaryClassName += ' desktop-only');
                        secondaryTextItem.setAttribute('class', secondaryClassName);
                        secondaryTextItem.appendChild(secondarytextOfLink);

                        const itemLink = document.createElement('a');
                        let itemLinkClassName = ''; // uq-site-header-menu-list-item';
                        secondaryText === ' ' &&
                            (itemLinkClassName += ' uq-site-header-menu-list-item-no-secondary-child');
                        itemLink.setAttribute('class', itemLinkClassName);
                        itemLink.setAttribute('tabindex', '0');
                        !!jsonChild.linkTo && itemLink.setAttribute('href', this.getLink(jsonChild.linkTo));
                        itemLink.appendChild(primaryTextItem);
                        itemLink.appendChild(secondaryTextItem);

                        listItem.appendChild(itemLink);
                    } else {
                        listItem.setAttribute('class', 'desktop-only');
                    }

                    listItemWrapper.appendChild(listItem);
                });
                parentListItem.appendChild(listItemWrapper);
            }

            listWrapper.insertBefore(parentListItem, insertAboveChild);
        });

        return listWrapper;
    }

    createMobileHeaderItem(linkPrimaryText, datatestid) {
        const toggle1label = `Show ${linkPrimaryText} sub-navigation`;
        const textOfToggle = document.createTextNode(toggle1label);

        const parentToggleSpan = document.createElement('span');
        parentToggleSpan.setAttribute('class', 'visually-hidden');
        parentToggleSpan.appendChild(textOfToggle);

        const parentMobileToggle = document.createElement('button');
        parentMobileToggle.setAttribute('class', 'uq-site-header__navigation__sub-toggle');
        parentMobileToggle.setAttribute('data-testid', `${datatestid}-open`);
        parentMobileToggle.setAttribute('data-analyticsid', `${datatestid}-open`);
        parentMobileToggle.appendChild(parentToggleSpan);
        return parentMobileToggle;
    }

    createDesktopHeaderItem(datatestid, linkTo, primaryText) {
        const anchor = document.createElement('a');
        anchor.setAttribute('data-testid', `${datatestid}-link`);
        anchor.setAttribute('data-analyticsid', `${datatestid}-link`);
        anchor.setAttribute('href', this.getLink(linkTo) || /* istanbul ignore next */ '');
        anchor.setAttribute('aria-expanded', 'false');
        anchor.setAttribute('aria-haspopup', 'true');
        anchor.setAttribute('class', 'uq-site-header__navigation-link slide-menu__control');
        const parentTextNode = document.createTextNode(primaryText);
        anchor.appendChild(parentTextNode);
        return anchor;
    }

    // we either use the production link from the json,
    // or if we are on the drupal staging site, rewrite the url to be local to the staging site
    getLink(linkTo) {
        const stagingDomain = 'library.stage.drupal.uq.edu.au';
        const prodDomain = 'web.library.uq.edu.au';
        const stagingLink = linkTo.replace(prodDomain, stagingDomain);
        /* istanbul ignore next */
        return window.location.hostname === stagingDomain ? stagingLink : linkTo;
    }

    // the button has moved to uq-header :(
    // sneaky fix: keep this button as a focus for uq-header to programmatically click to show the megamenu in mobile
    unhideMobileMenuButton() {
        // const button = !!this.shadowRoot && this.shadowRoot.getElementById('uq-site-header__navigation-toggle');
        // !!button && (button.style.display = null);
    }

    loadScript() {
        // This loads the external JS file into the HTML head dynamically
        // Only load js if it has not been loaded before
        const scriptId = 'uq-nav-script';
        const scriptFound = document.getElementById(scriptId);
        /* istanbul ignore else */
        if (!scriptFound) {
            const that = this;

            // const showMenu = this.getAttribute('showmenu');
            // const isMegaMenuDisplayed = !!showMenu || showMenu === '';

            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.defer = true;
            script.id = scriptId;
            script.onload = function () {
                //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
                // store reference so we can initialise the main menu when it is available
                that.uqReference = uq;

                // Equalised grid menu examples
                var equaliseGridMenu = uq.gridMenuEqualiser('.uq-grid-menu--equalised>a');
                equaliseGridMenu.align();
            };
            //Specify the location of the ITS DS JS file
            script.src = 'uq-site-header.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    }

    connectedCallback() {
        // when this method has fired, the shadow dom is available
        this.loadScript();
        // this.waitOnUqScript();
    }
}

export default UQSiteHeader;

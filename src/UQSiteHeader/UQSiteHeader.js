import styles from './css/main.css';
import overrides from './css/overrides.css';
import { default as menuLocale } from '../locale/menu';
import myLibStyles from '../UtilityArea/css/mylibrary.css';

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
 *           <div id="mylibrarystub" />         // provide a stub and let auth-button handle replacing with the mylibrary button if the user is logged in
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
    <style>${myLibStyles.toString()}</style>
  <div class="uq-site-header" part="root">
      <!-- Site title and utility area with mobile nav toggler (JS) -->
      <div class="uq-site-header__title-container" part="title">
        <div class="uq-site-header__title-container__left">
          <a id="site-title" data-testid="site-title" href="https://www.library.uq.edu.au/" class="uq-site-header__title">Library</a>
        </div>
        <div class="uq-site-header__title-container__right">
          <slot name="site-utilities"></slot>
          <button style="display: none" id="uq-site-header__navigation-toggle" data-testid="uq-site-header__navigation-toggle" class="uq-site-header__navigation-toggle jsNavToggle">Menu</button>
        </div>
      </div>

      <!-- Navigation Menu  -->
      <div class="uq-site-header__navigation-container">
        <nav class="uq-site-header__navigation" id="jsNav">
          <ul class="uq-site-header__navigation__list uq-site-header__navigation__list--level-1">
          </ul>
        </nav>
      </div>
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
        this.createLink = this.createLink.bind(this);
        this.loadScript = this.loadScript.bind(this);
        this.rewriteMegaMenuFromJson = this.rewriteMegaMenuFromJson.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.unhideMobileMenuButton = this.unhideMobileMenuButton.bind(this);

        // whether or not a menu is requested, clear any children supplied by ITS
        const megaMenu = template.content.getElementById('jsNav');
        !!megaMenu && (megaMenu.textContent = '');

        // Render the template
        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));
    }

    attributeChangedCallback(fieldName, oldValue, newValue) {
        const that = this;

        // the dom is not loaded for a moment
        const awaitShadowDom = setInterval(() => {
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
                    this.showMenu();

                    break;
                default:
                    console.log(`unknown attribute ${fieldName} received for UQSiteHeader`);
            }
        }, 50);
    }

    setSiteUrl(newSiteURL) {
        const siteTitleElement = !!this.shadowRoot && this.shadowRoot.getElementById('site-title');
        (!!siteTitleElement && !!newSiteURL && (siteTitleElement.href = newSiteURL)) ||
            console.log('site url update failed');
    }

    setTitle(newSiteTitle) {
        let siteTitleElement = !!this.shadowRoot && this.shadowRoot.getElementById('site-title');
        (!!siteTitleElement && !!newSiteTitle && (siteTitleElement.innerHTML = newSiteTitle)) ||
            console.log('site title update failed');
    }

    showMenu() {
        this.rewriteMegaMenuFromJson();

        this.unhideMobileMenuButton();

        const that = this;
        // we must wait for the script to finish loading before we can use it
        const waitOnUqScript = setInterval(
            () => {
                if (!that.uqReference) {
                    return;
                }
                clearInterval(waitOnUqScript);

                const navelement = !!this.shadowRoot && this.shadowRoot.getElementById('jsNav');
                const uq = that.uqReference;
                new uq.siteHeaderNavigation(navelement, 'uq-site-header__navigation');
            },
            50,
            that,
        );
    }

    rewriteMegaMenuFromJson() {
        const megaMenu = !!this.shadowRoot && this.shadowRoot.getElementById('jsNav');

        const listWrapper = document.createElement('ul');
        listWrapper.setAttribute('class', 'uq-site-header__navigation__list uq-site-header__navigation__list--level-1');

        menuLocale.publicmenu.forEach((jsonParentItem, index) => {
            const hasChildren = !!jsonParentItem.submenuItems && jsonParentItem.submenuItems.length > 0;

            const parentListItem = document.createElement('li');

            let classNavListitem = 'uq-site-header__navigation__list-item';
            !!hasChildren && (classNavListitem += ' uq-site-header__navigation__list-item--has-subnav');
            const activeClassName = ' uq-site-header__navigation__list-item--active';
            jsonParentItem.linkTo === window.location.href && (classNavListitem += activeClassName);
            parentListItem.setAttribute('class', classNavListitem);
            const datatestid = `menu-group-item-${index}`;
            parentListItem.setAttribute('data-testid', datatestid);

            const parentLink = this.createLink(
                jsonParentItem.linkTo || '',
                jsonParentItem.primaryText || '',
                `${datatestid}-link`,
            );
            parentLink.setAttribute('aria-expanded', 'false');
            parentListItem.appendChild(parentLink);

            if (hasChildren) {
                const textOfToggle = document.createTextNode('Open');
                const parentToggle = document.createElement('span');
                parentToggle.setAttribute('class', 'uq-site-header__navigation__sub-toggle');
                parentToggle.setAttribute('data-testid', `${datatestid}-open`);
                parentToggle.appendChild(textOfToggle);

                parentListItem.appendChild(parentToggle);
            }

            // make child items
            if (hasChildren) {
                const listItemWrapper = document.createElement('ul');
                let listItemClass = 'uq-site-header__navigation__list uq-site-header__navigation__list--level-2';
                !!jsonParentItem.columnCount &&
                    jsonParentItem.columnCount > 1 &&
                    (listItemClass += ' multicolumn-' + jsonParentItem.columnCount);
                listItemWrapper.setAttribute('class', listItemClass);
                jsonParentItem.submenuItems.forEach((jsonChild, indexChild) => {
                    const listItem = document.createElement('li');
                    listItem.setAttribute('class', 'uq-site-header__navigation__list-item');
                    listItem.setAttribute('data-testid', `${jsonParentItem.dataTestid}-${indexChild}` || '');

                    // a missing primary text allows for an empty cell, controlling the spacing of the menu
                    if (!!jsonChild.primaryText) {
                        const primarytextOfLink = document.createTextNode(jsonChild.primaryText || '');
                        const primaryTextItem = document.createElement('span');
                        primaryTextItem.setAttribute('class', 'displayText');
                        primaryTextItem.appendChild(primarytextOfLink);

                        const secondarytextOfLink = document.createTextNode(jsonChild.secondaryText || ' ');
                        const secondaryTextItem = document.createElement('span');
                        secondaryTextItem.setAttribute('class', 'displayText secondaryText');
                        secondaryTextItem.appendChild(secondarytextOfLink);

                        // we want to be able to navigate around the staging site, if thats where we are
                        const stagingDomain = 'library.stage.drupal.uq.edu.au';
                        let linkTo = jsonChild.linkTo || '';
                        const stagingLink = linkTo.replace('web.library.uq.edu.au', stagingDomain);
                        linkTo = window.location.hostname === stagingDomain ? stagingLink : linkTo;

                        const itemLink = document.createElement('a');
                        itemLink.setAttribute('href', linkTo);
                        itemLink.appendChild(primaryTextItem);
                        itemLink.appendChild(secondaryTextItem);
                        itemLink.setAttribute('aria-expanded', 'false');

                        listItem.appendChild(itemLink);
                    }

                    listItemWrapper.appendChild(listItem);
                });
                parentListItem.appendChild(listItemWrapper);
            }

            listWrapper.appendChild(parentListItem);
        });
        megaMenu.appendChild(listWrapper);
    }

    unhideMobileMenuButton() {
        const button = !!this.shadowRoot && this.shadowRoot.getElementById('uq-site-header__navigation-toggle');
        !!button && (button.style.display = null);
    }

    createLink(href, linktext, datatestid = '') {
        const textOfLink = document.createTextNode(linktext);

        const alink = document.createElement('a');
        !!datatestid && alink.setAttribute('data-testid', datatestid);
        alink.setAttribute('href', href);
        alink.appendChild(textOfLink);
        return alink;
    }

    loadScript() {
        // This loads the external JS file into the HTML head dynamically
        // Only load js if it has not been loaded before
        const scriptId = 'uq-nav-script';
        const scriptFound = document.getElementById(scriptId);
        if (!scriptFound) {
            const that = this;

            const showMenu = this.getAttribute('showmenu');
            const isMegaMenuDisplayed = !!showMenu || showMenu === '';

            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.defer = true;
            script.id = scriptId;
            script.onload = function () {
                //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
                // store reference so we can initialise the main menu when it is available
                that.uqReference = uq;

                // Initialise accordions
                new uq.accordion();
                // Equalised grid menu examples
                var equaliseGridMenu = uq.gridMenuEqualiser('.uq-grid-menu--equalised>a');
                equaliseGridMenu.align();
            };
            //Specify the location of the ITS DS JS file
            script.src = 'uq-site-header.js';
            // script.src = '../../../dist/uq-site-header.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    }

    connectedCallback() {
        // when this method has fired, the shadow dom is available
        this.loadScript();
    }
}

export default UQSiteHeader;

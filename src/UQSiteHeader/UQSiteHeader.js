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
      <div data-testid="mega-menu-container" class="uq-site-header__navigation-container">
        <nav class="uq-site-header__navigation slide-menu__slider" id="jsNav" data-testid="uq-site-header-megamenu" aria-label="Site navigation">
            <ul class="uq-site-header__navigation__list uq-site-header__navigation__list--level-1" aria-expanded="true">
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-header uq-site-header__navigation__list__first-permanent-child">
                    <a href="https://study.uq.edu.au/" data-testid="uq-header-study-link-mobile">Study</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-header">
                    <a href="https://research.uq.edu.au/">Research</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-header">
                    <a href="https://partners-community.uq.edu.au/">Partners and community</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-header">
                    <a href="https://about.uq.edu.au/">About</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-global">
                    <a href="https://www.uq.edu.au/" data-testid="uq-header-home-link-mobile">UQ home</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-global">
                    <a href="https://www.uq.edu.au/news/" data-testid="uq-header-news-link-mobile">News</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-global">
                    <a href="https://www.uq.edu.au/uq-events" data-testid="uq-header-events-link-mobile">Events</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-global">
                    <a href="https://alumni.uq.edu.au/giving" data-testid="uq-header-giving-link-mobile">Give</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-global">
                    <a href="https://contacts.uq.edu.au/" data-testid="uq-header-contacts-link-mobile">Contact</a>
                </li>
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

        // Render the template
        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));
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

    showMenu() {
        this.updateMegaMenu();

        this.unhideMobileMenuButton();
    }

    waitOnUqScript() {
        const that = this;
        // we must wait for the script to finish loading before we can use it
        const waitOnUqScript = setInterval(
            () => {
                console.log('waitOnUqScript');
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

    updateMegaMenu() {
        const megaMenu = !!this.shadowRoot && this.shadowRoot.getElementById('jsNav');
        const listWrapper = this.rewriteMegaMenuFromJson(menuLocale);
        megaMenu.appendChild(listWrapper);
    }

    createSubmenuCloseControl(linkPrimaryText) {
        const parentTextNode = document.createTextNode(linkPrimaryText);
        const closeControlNode = document.createElement('button');
        !!closeControlNode &&
            closeControlNode.setAttribute(
                'class',
                'uq-site-header__navigation__list--close slide-menu__backlink slide-menu__control mobile-only',
            );
        !!closeControlNode && closeControlNode.setAttribute('data-action', 'back');
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
            parentListItem.setAttribute('data-gtm-category', 'Main navigation');

            parentListItem.appendChild(this.createDesktopHeaderItem(datatestid, linkHref, linkPrimaryText));
            if (hasChildren) {
                parentListItem.appendChild(this.createMobileHeaderItem(linkPrimaryText, datatestid));

                // make child items
                const listItemWrapper = document.createElement('ul');
                let listItemClass = 'uq-site-header__navigation__list uq-site-header__navigation__list--level-2';
                !!jsonParentItem.columnCount &&
                    jsonParentItem.columnCount > 1 &&
                    (listItemClass += ' multicolumn-' + jsonParentItem.columnCount);
                listItemWrapper.setAttribute('class', listItemClass);

                const textOfParentLinkNode = document.createTextNode(linkPrimaryText);

                const slideCloseControl = !!linkPrimaryText && this.createSubmenuCloseControl(linkPrimaryText);
                !!listItemWrapper && !!slideCloseControl && listItemWrapper.appendChild(slideCloseControl);

                const topMostLink = document.createElement('a');
                !!topMostLink && !!linkHref && topMostLink.setAttribute('href', this.getLink(linkHref));
                !!topMostLink && !!textOfParentLinkNode && topMostLink.appendChild(textOfParentLinkNode);

                const repeatParentListItem = document.createElement('li');
                repeatParentListItem.appendChild(topMostLink);
                !!repeatParentListItem &&
                    repeatParentListItem.setAttribute('class', 'uq-site-header__navigation__list-item mobile-only');

                !!listItemWrapper && !!repeatParentListItem && listItemWrapper.appendChild(repeatParentListItem);

                jsonParentItem.submenuItems.forEach((jsonChild, indexChild) => {
                    const listItem = document.createElement('li');
                    listItem.setAttribute('class', 'uq-site-header__navigation__list-item');
                    listItem.setAttribute(
                        'data-testid',
                        `${jsonParentItem.dataTestid}-${indexChild}` || /* istanbul ignore next */ '',
                    );

                    // a missing primary text allows for an empty cell on desktop, controlling the spacing of the menu
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
                        // secondaryText === ' ' && (itemLinkClassName += ' mobile-no-min-height');
                        secondaryText === ' ' &&
                            (itemLinkClassName += ' uq-site-header-menu-list-item-no-secondary-child');
                        itemLink.setAttribute('class', itemLinkClassName);
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
        parentMobileToggle.appendChild(parentToggleSpan);
        return parentMobileToggle;
    }

    createDesktopHeaderItem(datatestid, linkTo, primaryText) {
        const anchor = document.createElement('a');
        anchor.setAttribute('data-testid', `${datatestid}-link`);
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

                // // Initialise accordions
                // new uq.accordion();

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
        this.waitOnUqScript();
    }
}

export default UQSiteHeader;

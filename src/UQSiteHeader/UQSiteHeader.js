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
        this.getMenuListItemHeaderLinkNode = this.getMenuListItemHeaderLinkNode.bind(this);
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

                // const menuLeftElem = document.getElementById('global-mobile-nav');
                //
                // const menuLeft = !!menuLeftElem && new SlideMenu(menuLeftElem, {
                //     position: 'left',
                //     submenuLinkAfter: ' ',
                //     backLinkBefore: ' ',
                // });
                //
                // var slideMenuBackButtons = document.querySelectorAll('.slide-menu__backlink, .global-mobile-nav__audience-link');
                //
                // Array.prototype.forEach.call(slideMenuBackButtons, function(el, i){
                //     el.addEventListener('click', () => {
                //         document.querySelector('.global-mobile-nav').scrollTop = 0;
                //     });
                // });
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

    createSlideCloseControl(textOfParentLinkNode) {
        const closeControlNode = document.createElement('a');
        !!closeControlNode &&
            closeControlNode.setAttribute('class', 'slide-menu__backlink slide-menu__control mobile-only');
        !!closeControlNode && closeControlNode.setAttribute('data-action', 'back');
        !!closeControlNode && !!textOfParentLinkNode && closeControlNode.appendChild(textOfParentLinkNode);

        const listItem = document.createElement('li');
        !!listItem && listItem.setAttribute('class', 'mobile-only uq-site-header__navigation__list-item-header');
        !!listItem && !!closeControlNode && listItem.appendChild(closeControlNode);

        return listItem;
    }

    rewriteMegaMenuFromJson(menu) {
        const listWrapper = document.createElement('ul');
        listWrapper.setAttribute('class', 'uq-site-header__navigation__list uq-site-header__navigation__list--level-1');

        menuLocale.publicmenu.forEach((jsonParentItem, index) => {
            const datatestid = `menu-group-item-${index}`;
            const hasChildren = !!jsonParentItem.submenuItems && jsonParentItem.submenuItems.length > 0;

            const linkHref = jsonParentItem.linkTo || /* istanbul ignore next */ '';
            const linkPrimaryText = jsonParentItem.primaryText || /* istanbul ignore next */ '';
            console.log('jsonParentItem.primaryText=', linkPrimaryText);
            const textOfParentLinkNode = document.createTextNode(linkPrimaryText);

            const parentLink = this.getMenuListItemHeaderLinkNode(datatestid, linkHref, linkPrimaryText);
            console.log('parentLink 1=', parentLink);

            const parentListItem = document.createElement('li');

            let classNavListitem = 'uq-site-header__navigation__list-item';
            !!hasChildren && (classNavListitem += ' uq-site-header__navigation__list-item--has-subnav');
            const activeClassName = ' uq-site-header__navigation__list-item--active';
            /* istanbul ignore next */
            jsonParentItem.linkTo === window.location.href && (classNavListitem += activeClassName);
            parentListItem.setAttribute('class', classNavListitem);
            parentListItem.setAttribute('data-testid', datatestid);
            parentListItem.setAttribute('data-gtm-category', 'Main navigation');

            parentListItem.appendChild(parentLink);

            if (hasChildren) {
                const toggle1label = `Show ${linkPrimaryText} sub-navigation`;
                const textOfToggle = document.createTextNode(toggle1label);

                const parentToggleSpan = document.createElement('span');
                parentToggleSpan.setAttribute('class', 'visually-hidden');
                parentToggleSpan.appendChild(textOfToggle);

                const parentToggle = document.createElement('button');
                parentToggle.setAttribute('class', 'uq-site-header__navigation__sub-toggle');
                parentToggle.setAttribute('data-testid', `${datatestid}-open`);
                parentToggle.appendChild(parentToggleSpan);
                parentListItem.appendChild(parentToggle);

                // make child items
                const listItemWrapper = document.createElement('ul');
                let listItemClass = 'uq-site-header__navigation__list uq-site-header__navigation__list--level-2';
                !!jsonParentItem.columnCount &&
                    jsonParentItem.columnCount > 1 &&
                    (listItemClass += ' multicolumn-' + jsonParentItem.columnCount);
                listItemWrapper.setAttribute('class', listItemClass);

                // add two items, one for fake header and one for back arrow here
                const slideCloseControl = this.createSlideCloseControl(textOfParentLinkNode);
                console.log('slideCloseControl= ', slideCloseControl);
                !!listItemWrapper && !!slideCloseControl && listItemWrapper.appendChild(slideCloseControl);

                console.log('jsonParentItem.primaryText=', jsonParentItem.primaryText);
                const textOfParentLinkNode2 = document.createTextNode(linkPrimaryText);
                console.log('textOfParentLinkNode2=', textOfParentLinkNode2);

                const topMostLink = document.createElement('a');
                !!topMostLink && !!linkHref && topMostLink.setAttribute('href', this.getLink(linkHref));
                !!topMostLink && !!textOfParentLinkNode && topMostLink.appendChild(textOfParentLinkNode2);

                const repeatParentListItem = document.createElement('li');
                repeatParentListItem.appendChild(topMostLink);
                !!repeatParentListItem &&
                    repeatParentListItem.setAttribute('class', 'uq-site-header__navigation__list-item mobile-only');

                !!listItemWrapper && !!repeatParentListItem && listItemWrapper.appendChild(repeatParentListItem);
                // this needs to wrap a link!

                jsonParentItem.submenuItems.forEach((jsonChild, indexChild) => {
                    const listItem = document.createElement('li');
                    listItem.setAttribute('class', 'uq-site-header__navigation__list-item');
                    listItem.setAttribute(
                        'data-testid',
                        `${jsonParentItem.dataTestid}-${indexChild}` || /* istanbul ignore next */ '',
                    );

                    // a missing primary text allows for an empty cell on desktop, controlling the spacing of the menu
                    console.log('jsonChild.primaryText = ', jsonChild.primaryText);
                    if (!!jsonChild.primaryText) {
                        console.log('jsonChild.primaryText found');
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
                        itemLink.setAttribute('href', this.getLink(jsonChild.linkTo));
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

            listWrapper.appendChild(parentListItem);
        });

        // maybe make this a global somewhere and then generate both uq-header and this from the same entry?
        const listGlobalNav = [
            {
                href: 'https://study.uq.edu.au/',
                linkLabel: 'Study',
                className: 'header',
                datatestid: 'uq-header-study-link-mobile',
            },
            {
                href: 'https://research.uq.edu.au/',
                linkLabel: 'Research',
                className: 'header',
            },
            {
                href: 'https://partners-community.uq.edu.au/',
                linkLabel: 'Partners and community',
                className: 'header',
            },
            {
                href: 'https://about.uq.edu.au/',
                linkLabel: 'About',
                className: 'header',
            },
            {
                href: 'https://www.uq.edu.au/',
                linkLabel: 'UQ home',
                className: 'global',
                datatestid: 'uq-header-home-link-mobile',
            },
            {
                href: 'https://www.uq.edu.au/news/',
                linkLabel: 'News',
                className: 'global',
                datatestid: 'uq-header-news-link-mobile',
            },
            {
                href: 'https://www.uq.edu.au/uq-events',
                linkLabel: 'Events',
                className: 'global',
                datatestid: 'uq-header-events-link-mobile',
            },
            {
                href: 'https://alumni.uq.edu.au/giving',
                linkLabel: 'Give',
                className: 'global',
                datatestid: 'uq-header-giving-link-mobile',
            },
            {
                href: 'https://contacts.uq.edu.au/',
                linkLabel: 'Contact',
                className: 'global',
                datatestid: 'uq-header-contacts-link-mobile',
            },
        ];

        listGlobalNav.forEach((entry) => {
            const listItemText = document.createTextNode(entry.linkLabel || /* istanbul ignore next */ '');

            const listItemLink = document.createElement('a');
            !!listItemLink && !!entry.href && (listItemLink.href = entry.href);
            !!listItemLink &&
                !!entry.href &&
                !!entry.datatestid &&
                listItemLink.setAttribute('data-testid', entry.datatestid);
            listItemLink.appendChild(listItemText);

            const listItem = document.createElement('li');
            !!listItem &&
                listItem.setAttribute(
                    'class',
                    `megamenu-global-nav--mobile megamenu-global-nav--mobile-${entry.className}`,
                );
            listItem.appendChild(listItemLink);

            listWrapper.appendChild(listItem);
        });

        return listWrapper;
    }

    getMenuListItemHeaderLinkNode(datatestid, linkTo, primaryText) {
        const parentLink = document.createElement('a');
        parentLink.setAttribute('data-testid', `${datatestid}-link`);
        parentLink.setAttribute('href', this.getLink(linkTo) || /* istanbul ignore next */ '');
        parentLink.setAttribute('aria-expanded', 'false');
        parentLink.setAttribute('aria-haspopup', 'true');
        parentLink.setAttribute('class', 'uq-site-header__navigation-link slide-menu__control');
        const textOfParentLinkNode = document.createTextNode(primaryText);
        parentLink.appendChild(textOfParentLinkNode);
        console.log('getMenuListItemHeaderLinkNode::parentLink=', parentLink);
        return parentLink;
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
    }
}

export default UQSiteHeader;

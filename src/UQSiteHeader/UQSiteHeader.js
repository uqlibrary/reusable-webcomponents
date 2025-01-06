import styles from './css/main.css';
import breadcrumbs from './css/breadcrumbs.css';
import overrides from './css/overrides.css';

/**
 * API:
 *   <uq-site-header
 *       sitetitle="Library"                       // should be displayed on all sites - the text of the homepage link. Optional. Default "Library"
 *       siteurl="https://www.library.uq.edu.au"  // should be displayed on 2nd level sites - the link to the homepage. Optional. Default "https://www.library.uq.edu.au/"
 *       secondleveltitle="Guides"                 // should be displayed on 2nd level sites - the text of the homepage link. Optional. Default null (not present)
 *                                                 // it is probably necessery to always have the secondleveltitle go first (before secondlevelurl)
 *       secondlevelurl="http://guides.library.uq.edu.au"    // should be displayed on all sites - the link of the homepage link. Optional. Default null (not present)
 *       (both second level required if either)
 *   >
 *       <span slot="site-utilities">
 *           <auth-button />
 *       </span>
 *   </uq-site-header>
 *
 * ie uqsiteheader does not add the utility area buttons itself - add them externally by either html or javascriot
 */

const subsiteTemplate = document.createElement('template');
subsiteTemplate.innerHTML = `<li id="subsite" data-testid="subsite-title" class="uq-breadcrumb__item">
                    <a class="uq-breadcrumb__link" id="secondlevel-site-breadcrumb-link" data-testid="secondlevel-site-title" href=""></a>
                </li>`;

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${breadcrumbs.toString()}</style>
    <style>${overrides.toString()}</style>
  <div class="uq-site-header" part="root">
      <!-- Site title and utility area with mobile nav toggler (JS) -->
      <div class="uq-site-header__title-container" part="title">
        <nav class="uq-breadcrumb" aria-label="Breadcrumb">
            <ol class="uq-breadcrumb__list" id="breadcrumb_nav">
                <li class="uq-breadcrumb__item">
                    <a class="uq-breadcrumb__link" data-testid="root-link" title="UQ home" href="https://uq.edu.au/">UQ home</a>
                </li>
                <li class="uq-breadcrumb__item">
                    <a id="site-title" data-testid="site-title" class="uq-breadcrumb__link" title="Library" href="https://www.library.uq.edu.au/">Library</a>
                </li>
            </ol>
        </nav>
        <div class="uq-site-header__title-container__right">
          <slot name="site-utilities" style="display: flex"></slot>
          <button style="display: none" id="uq-site-header__navigation-toggle" class="uq-site-header__navigation-toggle jsNavToggle">Menu</button>
        </div>
      </div>

      <!-- Navigation Menu  -->
      <div class="uq-site-header__navigation-container">
        <nav class="uq-site-header__navigation slide-menu__slider" id="jsNav" aria-label="Site navigation">
            <ul class="uq-site-header__navigation__list uq-site-header__navigation__list--level-1" aria-expanded="true">
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-header uq-site-header__navigation__list-item uq-site-header__navigation__list__first-permanent-child">
                    <a href="https://study.uq.edu.au/" data-testid="uq-header-study-link-mobile" data-analyticsid="uq-header-study-link-mobile">Study</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-header uq-site-header__navigation__list-item">
                    <a href="https://research.uq.edu.au/">Research</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-header uq-site-header__navigation__list-item">
                    <a href="https://partners-community.uq.edu.au/">Partners and community</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-header uq-site-header__navigation__list-item">
                    <a href="https://about.uq.edu.au/">About</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-global uq-site-header__navigation__list-item">
                    <a href="https://www.uq.edu.au/" data-testid="uq-header-home-link-mobile" data-analyticsid="uq-header-home-link-mobile">UQ home</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-global uq-site-header__navigation__list-item">
                    <a href="https://www.uq.edu.au/news" data-analyticsid="uq-header-news-link-mobile">News</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-global uq-site-header__navigation__list-item">
                    <a href="https://www.uq.edu.au/uq-events" data-analyticsid="uq-header-events-link-mobile">Events</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-global uq-site-header__navigation__list-item">
                    <a href="https://alumni.uq.edu.au/giving" data-analyticsid="uq-header-giving-link-mobile">Give</a>
                </li>
                <li class="megamenu-global-nav--mobile megamenu-global-nav--mobile-global uq-site-header__navigation__list-item">
                    <a href="https://contacts.uq.edu.au/contacts" data-analyticsid="uq-header-contacts-link-mobile">Contact</a>
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
        return ['sitetitle', 'siteurl', 'secondleveltitle', 'secondlevelurl'];
    }

    constructor() {
        super();

        // this.SecondLevelBreadcrumbPropertyCount = 0;

        // when the ITS script loads, we store the object it supplies,
        // so we can use it when the menu has finished loading to supply the menu mouseover
        this.uqReference = null;

        // Bindings
        this.getLink = this.getLink.bind(this);
        this.loadScript = this.loadScript.bind(this);
        this.rewriteMegaMenuFromJson = this.rewriteMegaMenuFromJson.bind(this);
        this.createDesktopHeaderItem = this.createDesktopHeaderItem.bind(this);
        this.createMobileHeaderItem = this.createMobileHeaderItem.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setSiteUrl = this.setSiteUrl.bind(this);
        this.unhideMobileMenuButton = this.unhideMobileMenuButton.bind(this);

        // Render the template
        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));
        this.addClickListeners(shadowDOM);
    }

    addClickListeners(shadowDOM) {
        function resetBreadcrumbs() {
            const subsiteTitle = shadowDOM.getElementById('subsite');
            !!subsiteTitle && subsiteTitle.remove();
        }
        // when we go back to the library homepage from a sub page, clear out any lower breadcrumbs
        const libraryTitleElement = shadowDOM.getElementById('site-title');
        !!libraryTitleElement && libraryTitleElement.addEventListener('click', resetBreadcrumbs);

        function checkIfHomepage() {
            if (window.location.pathname === '/') {
                resetBreadcrumbs();
            }
        }
        window.addEventListener('popstate', checkIfHomepage);
    }

    isValidUrl(urlString) {
        try {
            new URL(urlString);
            return true;
        } catch (e) {
            return false;
        }
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
                case 'secondleveltitle':
                    this.setSecondLevelTitle(newValue);
                    // this.SecondLevelBreadcrumbPropertyCount++;

                    break;
                case 'secondlevelurl':
                    this.setSecondLevelUrl(newValue);
                    // this.SecondLevelBreadcrumbPropertyCount++;

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

    setSecondLevelUrl(newSecondLevelURL) {
        const subsiteBreadcrumb =
            !!this.shadowRoot && this.shadowRoot.getElementById('secondlevel-site-breadcrumb-link');
        !!subsiteBreadcrumb && !!newSecondLevelURL && (subsiteBreadcrumb.href = newSecondLevelURL);
    }

    setSecondLevelTitle(newSecondLevelTitle) {
        function isDomainPrimoProd() {
            return window.location.hostname === 'search.library.uq.edu.au';
        }
        function isDomainPrimoSandbox() {
            return window.location.hostname === 'uq-edu-primo-sb.hosted.exlibrisgroup.com';
        }
        function getSearchParam(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }
        function isSitePrimoNonProd() {
            const vidParam = getSearchParam('vid');
            return (isDomainPrimoProd() && vidParam !== '61UQ') || isDomainPrimoSandbox();
        }

        const breadcrumbNav = this.shadowRoot.getElementById('breadcrumb_nav');
        const subsiteListItem = !!breadcrumbNav && breadcrumbNav.querySelector('li#subsite');
        if (!subsiteListItem) {
            if (!!newSecondLevelTitle) {
                const subsiteClone = subsiteTemplate.content.firstElementChild.cloneNode(true);

                const thirdListItem = !!breadcrumbNav && breadcrumbNav.children[2];
                // pages like guides with multiple levels needs different handling
                if (thirdListItem) {
                    !!breadcrumbNav && breadcrumbNav.insertBefore(subsiteClone, thirdListItem);
                } else {
                    !!breadcrumbNav && breadcrumbNav.appendChild(subsiteTemplate.content.cloneNode(true));
                }
                const subsiteBreadcrumb =
                    !!this.shadowRoot && this.shadowRoot.getElementById('secondlevel-site-breadcrumb-link');
                !!subsiteBreadcrumb && !!newSecondLevelTitle && (subsiteBreadcrumb.innerHTML = newSecondLevelTitle);
                if (isSitePrimoNonProd()) {
                    !!subsiteBreadcrumb && subsiteBreadcrumb.classList.add('primoNonProdMarker');
                }
            }
        } else if (newSecondLevelTitle === null) {
            if (!!subsiteListItem) {
                // the li exists, but we are back on the homepage - delete it
                subsiteListItem.remove();
            }
        } else {
            // it exists, update it
            const subsiteBreadcrumb =
                !!this.shadowRoot && this.shadowRoot.getElementById('secondlevel-site-breadcrumb-link');
            !!subsiteBreadcrumb && !!newSecondLevelTitle && (subsiteBreadcrumb.innerHTML = newSecondLevelTitle);
            if (isSitePrimoNonProd()) {
                !!subsiteBreadcrumb && subsiteBreadcrumb.classList.add('primoNonProdMarker');
            }
        }
    }

    waitOnUqScript() {
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
                !!navelement && new uq.siteHeaderNavigation(navelement, 'uq-site-header__navigation');
            },
            50,
            that,
        );
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
        this.waitOnUqScript();
    }
}

export default UQSiteHeader;

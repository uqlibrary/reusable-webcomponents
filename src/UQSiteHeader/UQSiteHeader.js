import styles from './css/main.css';
import overrides from './css/overrides.css';
import icons from './css/icons.css';
import {default as menuLocale} from '../locale/menu';
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
 *           <div id="mylibrarystub" />
 *       </span>
 *       <span slot="site-utilities">
 *           <auth-button />
 *       </span>
 *   </uq-site-header>
 *
 * uqsiteheader does not add the utility area buttons itself - add them externally by either html or javascriot
 */

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${icons.toString()}</style>
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
          <button id="uq-site-header__navigation-toggle" data-testid="uq-site-header__navigation-toggle" class="uq-site-header__navigation-toggle jsNavToggle">Menu</button>
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
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // the attributes seem to need an extra moment before they are available
        const handleAttributes = setInterval(() => {
            clearInterval(handleAttributes);

            // Set the title & link URL
            const siteTitleContent = template.content.getElementById('site-title');

            const siteTitle = this.getAttribute('sitetitle');
            !!siteTitleContent && !!siteTitle && (siteTitleContent.innerHTML = siteTitle);

            const siteURL = this.getAttribute('siteurl');
            !!siteTitleContent && !!siteURL && (siteTitleContent.href = siteURL);
        }, 50);

        // attributes take a moment to appear sometimes
        const displayMenu = setInterval(() => {
            clearInterval(displayMenu);

            this.rewriteMegaMenuFromJson();

            // Render the template
            shadowDOM.appendChild(template.content.cloneNode(true));

            this.loadMenu();
        }, 50);


        // Bindings
        this.loadMenu = this.loadMenu.bind(this);
        this.rewriteMegaMenuFromJson = this.rewriteMegaMenuFromJson.bind(this);
        this.isMegaMenuRequested = this.isMegaMenuRequested.bind(this);
        this.createLink = this.createLink.bind(this);
    }

    rewriteMegaMenuFromJson() {
        const megaMenu = template.content.getElementById('jsNav');

        // clear the existing children
        !!megaMenu && (megaMenu.textContent = '');

        if (!this.isMegaMenuRequested()) {
            // hide responsive menu button
            const button = template.content.getElementById('uq-site-header__navigation-toggle');
            !!button && (button.style.display = 'none');

            // don't add Library megamenu
            return;
        }

        const listWrapper = document.createElement('ul');
        listWrapper.setAttribute('class', 'uq-site-header__navigation__list uq-site-header__navigation__list--level-1');

        menuLocale.publicmenu.forEach((jsonParentItem, index) => {
            const hasChildren = !!jsonParentItem.submenuItems && jsonParentItem.submenuItems.length > 0;

            const parentListItem = document.createElement('li');

            let classNavListitem = 'uq-site-header__navigation__list-item';
            !!hasChildren && (classNavListitem += ' uq-site-header__navigation__list-item--has-subnav');
            jsonParentItem.linkTo === window.location.href &&
            (classNavListitem += ' uq-site-header__navigation__list-item--active');
            parentListItem.setAttribute('class', classNavListitem);

            const parentLink = this.createLink(
                `menu-group-item-${index}`,
                jsonParentItem.linkTo || '',
                jsonParentItem.primaryText || '',
            );
            parentLink.setAttribute('aria-expanded', 'false');
            parentListItem.appendChild(parentLink);

            if (hasChildren) {
                const textOfToggle = document.createTextNode('Open');
                const parentToggle = document.createElement('span');
                parentToggle.setAttribute('class', 'uq-site-header__navigation__sub-toggle');
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

                        const itemLink = document.createElement('a');
                        itemLink.setAttribute('href', jsonChild.linkTo || '');
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

    createLink(datatestid, href, linktext) {
        const alink = document.createElement('a');
        alink.setAttribute('data-testid', datatestid);
        alink.setAttribute('href', href);
        const textOfLink = document.createTextNode(linktext);
        alink.appendChild(textOfLink);
        return alink;
    }

    loadMenu() {
        // This loads the external JS file into the HTML head dynamically
        // Only load js if it has not been loaded before and the nav element is available
        const uqSiteHeader = document.querySelector('uq-site-header');
        const shadowRoot = (!!uqSiteHeader && uqSiteHeader.shadowRoot) || false;
        var navelement = (!!shadowRoot && shadowRoot.getElementById('jsNav')) || false;
        console.log('navelement = ', navelement);

        const scripts = document.getElementsByTagName('script');
        const scriptList = Array.prototype.slice.call(scripts);
        const scriptFound = scriptList.find(scriptTag => {
            return String(scriptTag).includes('uq-site-header.js');
        });
        console.log('scriptFound = ', scriptFound);

        if (!scriptFound && !!navelement) {

            const showMenu = this.getAttribute('showmenu');
            console.log('showMenu = ', showMenu);
            const isMegaMenuDisplayed = !!showMenu || showMenu === '';
            console.log('isMegaMenuDisplayed = ', isMegaMenuDisplayed);

            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.defer = true;
            script.onload = function () {
                //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
                // Initialise Main Navigation
                const uqSiteHeader = document.querySelector('uq-site-header');
                const shadowRoot = (!!uqSiteHeader && uqSiteHeader.shadowRoot) || false;
                if (!!isMegaMenuDisplayed) {
                    var navelement = !!shadowRoot && shadowRoot.getElementById('jsNav');
                    var nav = new uq.siteHeaderNavigation(navelement, 'uq-site-header__navigation');
                }
                // Initialise accordions
                new uq.accordion();
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

    isMegaMenuRequested() {
        const showMenu = this.getAttribute('showmenu');
        return !!showMenu || showMenu === '';
    }

    connectedCallback() {
        console.log('connectedCallback');
    }
}

export default UQSiteHeader;

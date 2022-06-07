import styles from './css/main.css';
import overrides from './css/overrides.css';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${overrides.toString()}</style>
    <button style="display: none" tabindex="0" class="skip-to-content-link" id="skip-nav" data-testid="skip-nav" aria-label="Click to skip to the sites main content">
        Skip to site content
    </button>
    <header class="uq-header" data-gtm-category="Header">
      <div class="uq-header__container">
        <div class="uq-header__menu-toggle" data-target="global-mobile-nav" data-gtm-category="Primary header">
          <button id="mobile-menu-toggle-button" data-testid="mobile-menu-toggle-button" type="button" class="nav-primary__toggle nav-primary__menu-toggle slide-menu__control" data-target="global-mobile-nav" data-action="toggle" data-gtm-action="Toggle">
            Menu
          </button>
        </div>
        <div class="uq-header__logo" data-gtm-category="Primary header">
          <a class="logo--large" href="https://www.uq.edu.au/" data-gtm-label="UQ Logo">
            <img alt="The University of Queensland" src="https://static.uq.net.au/v11/logos/corporate/uq-logo--reversed.svg">
          </a>
        </div>        
        <div class="uq-header__nav-primary"  data-gtm-category="Primary header">
          <nav class="uq-header__nav-primary-container" aria-label="primary navigation">
            <ul class="uq-header__nav-primary-list">
              <li><a class="uq-header__nav-primary-link" href="https://study.uq.edu.au/">Study</a></li>
              <li><a class="uq-header__nav-primary-link" href="https://research.uq.edu.au/">Research</a></li>
              <li><a class="uq-header__nav-primary-link" href="https://partners-community.uq.edu.au">Partners and Community</a></li>
              <li><a class="uq-header__nav-primary-link" href="https://about.uq.edu.au/">About</a></li>
            </ul>
          </nav>
        </div>
        <div class="uq-header__search-toggle" data-gtm-category="Search">
          <button class="nav-primary__toggle nav-primary__search-toggle" data-gtm-action="Toggle">
            <div class="search-toggle__label">Search</div>
          </button>
        </div>
      </div>
      <nav class="slide-menu global-mobile-nav" id="global-mobile-nav" data-gtm-category="Header navigation mobile" aria-label="primary navigation mobile">
        <div class="uq-site-header__title-container">
          <div class="uq-site-header__title-container__left">
            <a href="/" class="uq-site-header__title">Site title</a>
          </div>
        </div>
      </nav>
      <div class="uq-header__search" data-gtm-category="Search">
        <div class="uq-header__search-container">
          <form action="https://www.uq.edu.au/search/" method="get">
            <fieldset>
              <div class="uq-header__search-query">
                <label for="edit-q" class="visually-hidden uq-header__search-query-label">Search term</label>
                <input type="text" id="edit-q" name="q" value="" maxlength="128" placeholder="Search by keyword" class="uq-header__search-query-input">
                <span class="uq-header__search-query-button">
                  <input type="submit" name="op" value="Search" class="uq-header__search-query-submit">
                </span>
              </div>
              <div class="uq-header__search-range">
                <input type="radio" id="edit-as_sitesearch-off" name="as_sitesearch" value="" class="form-radio uq-header__search-radio">
                <label for="edit-as_sitesearch-off" class="option uq-header__search-label">Search all UQ websites</label>
              </div>
              <div class="uq-header__search-range">
                <input type="radio" id="edit-as_sitesearch-on" name="as_sitesearch" value="https://library.uq.edu.au/" checked="checked" class="form-radio uq-header__search-radio">
                <label for="edit-as_sitesearch-on" class="option uq-header__search-label">Search this website (library.uq.edu.au)</label>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
      <div class="uq-header__nav-secondary">
        <nav class="uq-header__nav-secondary-container">
          <ul class="uq-header__nav-secondary-list">
              <li class="uq-header__nav-secondary-item">
                 <a href="https://www.uq.edu.au/" rel="external" class="uq-header__nav-secondary-link">UQ home</a>
              </li>
              <li class="uq-header__nav-secondary-item">
                  <a href="https://www.uq.edu.au/news/" rel="external" class="uq-header__nav-secondary-link">News</a>
              </li>
              <li class="uq-header__nav-secondary-item">
                  <a href="https://www.uq.edu.au/uq-events" rel="external" class="uq-header__nav-secondary-link">Events</a>
              </li>
              <li class="uq-header__nav-secondary-item">
                  <a href="https://alumni.uq.edu.au/giving" rel="external" class="uq-header__nav-secondary-link">Give</a>
              </li>
              <li class="uq-header__nav-secondary-item">
                <a href="https://contacts.uq.edu.au/" rel="external" class="uq-header__nav-secondary-link">Contact</a>
              </li>
          </ul>
        </nav>
      </div>
    </header>
`;

let initCalled;

class UQHeader extends HTMLElement {
    static get observedAttributes() {
        return ['skipnavid', 'searchlabel', 'searchurl', 'hidelibrarymenuitem'];
    }

    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        // Bindings
        this.hideLibraryGlobalMenuItem = this.hideLibraryGlobalMenuItem.bind(this);
        this.appendSearchWidgetUrl = this.appendSearchWidgetUrl.bind(this);
        this.changeSearchWidgetLabel = this.changeSearchWidgetLabel.bind(this);
        this.handleSkipNavInsertion = this.handleSkipNavInsertion.bind(this);
        this.loadScript = this.loadScript.bind(this);
    }

    attributeChangedCallback(fieldName, oldValue, newValue) {
        const that = this;

        // the dom is not loaded for a moment (needed when attributes are added via JS, ie the applications)
        const awaitShadowDom = setInterval(() => {
            /* istanbul ignore next */
            if (!that.shadowRoot) {
                return;
            }

            clearInterval(awaitShadowDom);

            // (in other components we update the template from the attributes - that doesnt work here because
            // UQHeader/uqds.js is expecting things to be ready immediately)
            switch (fieldName) {
                case 'skipnavid':
                    this.handleSkipNavInsertion(newValue);

                    break;
                case 'searchlabel':
                    this.changeSearchWidgetLabel(newValue);

                    break;
                case 'searchurl':
                    this.appendSearchWidgetUrl(newValue);

                    break;
                case 'hidelibrarymenuitem':
                    this.hideLibraryGlobalMenuItem(newValue);

                    break;
                /* istanbul ignore next  */
                default:
                    console.log(`unhandled attribute ${fieldName} received for UQHeader`);
            }
        }, 50);
    }

    // Provides a #id for skip nav
    // if never provided, skip nav is never unhidden
    handleSkipNavInsertion(newValue) {
        console.log('handleSkipNavInsertion:newValue=', newValue);
        const skipToElement = () => {
            const skipNavLander = document.getElementById(newValue);
            !!skipNavLander && skipNavLander.focus();
        };
        const skipNavButton = this.shadowRoot.getElementById('skip-nav');
        console.log('skipNavButton=', skipNavButton);
        // element is style="display: none" by default
        !!skipNavButton && (skipNavButton.style.display = null);
        !!skipNavButton && skipNavButton.addEventListener('click', skipToElement);
    }

    // this does not apply to the current version as a Library link didnt make the cut for the top level
    // lazily leave this here on the assumption this will be fixed at some point
    hideLibraryGlobalMenuItem(newValue) {
        // If the attribute hidelibrarymenuitem is true, remove the global menu item from the DOM
        /* istanbul ignore else  */
        if (!(newValue === 'false' || newValue === null)) {
            const libraryMenuItem = this.shadowRoot.getElementById('menu-item-library');
            !!libraryMenuItem && libraryMenuItem.remove();
            const libraryMobileMenuItem = this.shadowRoot.getElementById('menu-item-library-mobile');
            !!libraryMobileMenuItem && libraryMenuItem.remove();
        }
    }

    appendSearchWidgetUrl(newValue) {
        /* istanbul ignore else  */
        if (!!newValue) {
            this.shadowRoot.getElementById('edit-as_sitesearch-on').value = newValue;
        }
    }

    changeSearchWidgetLabel(newValue) {
        /* istanbul ignore else  */
        if (!!newValue) {
            const oldValue = this.shadowRoot.getElementById('search-label').innerHTML;
            const result = oldValue.replace('library.uq.edu.au', newValue);
            this.shadowRoot.getElementById('search-label').innerHTML = result;
        }
    }

    loadScript() {
        // This loads the external JS file into the HTML head dynamically
        // Only load js if it has not been loaded before (tracked by the initCalled flag)
        /* istanbul ignore else  */
        if (!initCalled) {
            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.defer = true;
            script.onload = function () {
                //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
                initCalled = true;
                // Initialise the header once this JS file is loaded
                const headerElem = document.querySelector('uq-header').shadowRoot.querySelector('.uq-header');
                !!headerElem && !!uq && !!uq.header && new uq.header(headerElem);

                new uq.accordion();
                // new uq.siteHeaderNavigation(); // unused?
                // new uq.Tabs(); // unused?
            };
            //Specify the location of the ITS DS JS file
            script.src = 'uq-header.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    }

    connectedCallback() {
        this.loadScript();
    }
}

export default UQHeader;

import styles from './css/main.css';
import overrides from './css/overrides.css';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles.toString()}</style>
  <style>${overrides.toString()}</style>
    <button style="display: none" tabindex="0" class="skip-to-content-link" id="skip-nav" data-testid="skip-nav" aria-label="Click to skip to the sites main content">
        Skip to site content
    </button>
  <header class="uq-header" id="uq-header" data-testid="uq-header">
      <div class="uq-header__container">
        <div class="nav-global">
          <div class="logo">
            <a class="logo--large" id="logo--large" href="https://www.uq.edu.au/" data-testid="uq-header-logo-large-link"><img alt="The University of Queensland" src="https://static.uq.net.au/v11/logos/corporate/uq-lockup-landscape--reversed.svg"></a>
            <a class="logo--small" id="logo--small" href="https://www.uq.edu.au/" data-testid="uq-header-logo-small-link"><img alt="The University of Queensland" src="https://static.uq.net.au/v11/logos/corporate/uq-logo--reversed.svg"></a>
          </div>
          <nav class="menu-global" data-testid="uq-header-nav">
            <ul>
              <li><a href="https://contacts.uq.edu.au/" data-testid="uq-header-contacts-link">Contacts</a></li>
              <li><a href="https://future-students.uq.edu.au/" data-testid="uq-header-study-link">Study</a></li>
              <li><a href="https://maps.uq.edu.au/" data-testid="uq-header-maps-link">Maps</a></li>
              <li><a href="https://www.uq.edu.au/news/" data-testid="uq-header-news-link">News</a></li>
              <li><a href="https://www.uq.edu.au/events/" data-testid="uq-header-events-link">Events</a></li>
              <li><a href="https://jobs.uq.edu.au/" data-testid="uq-header-jobs-link">Jobs</a></li>
              <li id="menu-item-library"><a href="https://www.library.uq.edu.au/" data-testid="uq-header-library-link">Library</a></li>
              <li><a href="https://giving.uq.edu.au/" data-testid="uq-header-givenow-link">Give now</a></li>
              <li><a href="https://my.uq.edu.au/" data-testid="uq-header-myuq-link">my.UQ</a></li>
              <li class="menu-global__search-toggle">
                <button class="search-toggle__button" data-testid="uq-header-search-button">Search</button>
              </li>
            </ul>
          </nav>
        </div>
        <div class="nav-search">
          <form class="nav-search__form" action="https://www.uq.edu.au/search/" method="get" accept-charset="UTF-8">
            <fieldset class="nav-search__wrapper">
              <legend class="hidden">
                <span class="nav-search__title">What are you looking for?</span>
              </legend>
              <span class="nav-search__title">What are you looking for?</span>
              <div class="nav-search__scope">
                <div class="nav-search__scope__radio-wrapper">
                  <div class="form-item">
                    <input type="radio" id="edit-as_sitesearch-off" data-testid="edit-as_sitesearch-off" name="as_sitesearch" value="" class="form-radio">
                    <label for="edit-as_sitesearch-off" class="option">Search all UQ websites</label>
                  </div>
                  <div class="form-item">
                    <input type="radio" id="edit-as_sitesearch-on" data-testid="edit-as_sitesearch-on" name="as_sitesearch" value="https://library.uq.edu.au/" checked="checked" class="form-radio">
                    <label for="edit-as_sitesearch-on" class="option" id="search-label">Search this website (library.uq.edu.au)</label>
                  </div>
                </div>
              </div>
            </fieldset>
            <div class="nav-search__query">
                <span class="search-query__wrapper">
                    <label for="edit-q" class="visually-hidden">Search term</label>
                    <input type="text" id="edit-q" data-testid="uq-header-search-input" name="q" value="" size="60" maxlength="128" class="search-query__input">
                    <span class="search-query__button">
                        <input type="submit" name="op" id="op" data-testid="uq-header-search-submit" value="Search" class="search-query__submit">
                    </span>
                </span>
            </div>
            </form>

            <nav class="menu-global">
              <ul>
                <li><a href="https://contacts.uq.edu.au/" data-testid="uq-header-contacts-link-mobile">Contacts</a></li>
                <li><a href="https://www.uq.edu.au/news/" data-testid="uq-header-news-link-mobile">News</a></li>
                <li id="menu-item-library-mobile"><a href="https://www.library.uq.edu.au/" data-testid="uq-header-library-link-mobile">Library</a></li>
                <li><a href="https://future-students.uq.edu.au/" data-testid="uq-header-study-link-mobile">Study</a></li>
                <li><a href="https://www.uq.edu.au/events/" data-testid="uq-header-events-link-mobile">Events</a></li>
                <li><a href="https://giving.uq.edu.au/" data-testid="uq-header-giving-link-mobile">Give now</a></li>
                <li><a href="https://maps.uq.edu.au/" data-testid="uq-header-maps-link-mobile">Maps</a></li>
                <li><a href="https://jobs.uq.edu.au/" data-testid="uq-header-jobs-link-mobile">Jobs</a></li>
                <li><a href="https://my.uq.edu.au/" data-testid="uq-header-myuq-link-mobile">my.UQ</a></li>
              </ul>
            </nav>
        </div>
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
            if (!that.shadowRoot) {
                /* istanbul ignore next  */
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
        const skipToElement = () => {
            const skipNavLander = document.getElementById(newValue);
            !!skipNavLander && skipNavLander.focus();
        };
        const skipNavButton = this.shadowRoot.getElementById('skip-nav');
        // element is style="display: none" by default
        !!skipNavButton && (skipNavButton.style.display = null);
        !!skipNavButton && skipNavButton.addEventListener('click', skipToElement);
    }

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
        //Only load js if it has not been loaded before (tracked by the initCalled flag)
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
                new uq.header();
            };
            //Specify the location of the ITS DS JS file
            script.src = '/uq-header.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    }

    connectedCallback() {
        this.loadScript();
    }
}

export default UQHeader;

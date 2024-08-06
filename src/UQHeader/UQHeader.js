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
        <div class="uq-header__logo" data-testid="uq-header-logo" data-analyticsid="uq-header-logo" data-gtm-category="Primary header">
          <a class="logo--large" href="https://www.uq.edu.au" data-gtm-label="UQ Logo" data-testid="uq-header-logo-large-link" data-analyticsid="uq-header-logo-large-link">
            <img alt="The University of Queensland" src="https://static.uq.net.au/v15/logos/corporate/uq-logo--reversed.svg">
          </a>
        </div>        
        <div class="uq-header__nav-primary" data-testid="uq-header-primary-nav" data-analyticsid="uq-header-primary-nav">
          <nav class="uq-header__nav-primary-container" aria-label="primary navigation">
            <ul class="uq-header__nav-primary-list">
                <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link--has-dropdown gtm-processed" href="https://study.uq.edu.au/" data-gtm-label="Study">Study</a>
                    <div class="uq-header__megamenu">
                        <div class="uq-header__megamenu-container">
                            <a href="https://study.uq.edu.au/" class="megamenu__overview-link gtm-processed" data-gtm-label="Study > Study overview">Study overview</a>
                            <div class="megamenu__row">
                                <div class="megamenu__column">
                                    <div class="megamenu__heading">Study with us</div>
                                    <div class="megamenu__menu">
                                        <ul>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options/programs" data-gtm-label="Study > Find a course or program" class="gtm-processed">Find a course or program</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options/browse-study-areas" data-gtm-label="Study > Browse study areas" class="gtm-processed">Browse study areas</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options" data-gtm-label="Study > Study options" class="gtm-processed">Study options</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/short-courses" data-gtm-label="Study > Short courses" class="gtm-processed">Short courses</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/admissions" data-gtm-label="Study > How to apply" class="gtm-processed">How to apply</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://scholarships.uq.edu.au/" data-gtm-label="Study > Scholarships" class="gtm-processed">Scholarships</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://my.uq.edu.au/starting-at-uq" data-gtm-label="Study > Starting at UQ" class="gtm-processed">Starting at UQ</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/contact" data-gtm-label="Study > Contact" class="gtm-processed">Contact</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="megamenu__column">
                                    <div class="megamenu__heading">Discover UQ</div>
                                    <div class="megamenu__menu">
                                        <ul>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/why-choose-uq" data-gtm-label="Study > Why choose UQ" class="gtm-processed">Why choose UQ</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/enhance-your-employability" data-gtm-label="Study > Enhance your employability" class="gtm-processed">Enhance your employability</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/university-life" data-gtm-label="Study > Life at UQ and accommodation" class="gtm-processed">Life at UQ and accommodation</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://campuses.uq.edu.au/" data-gtm-label="Study > Campuses, maps and transport" class="gtm-processed">Campuses, maps and transport</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/events" data-gtm-label="Study > Events for prospective students" class="gtm-processed">Events for prospective students</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="megamenu__column">
                                    <div class="megamenu__heading">Information for</div>
                                    <div class="megamenu__menu">
                                        <ul>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/international-students" data-gtm-label="Study > International students" class="gtm-processed">International students</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/high-school-students" data-gtm-label="Study > High school students" class="gtm-processed">High school students</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/non-school-leavers" data-gtm-label="Study > Non-school leavers" class="gtm-processed">Non-school leavers</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options/phd-mphil-professional-doctorate" data-gtm-label="Study > PhD, MPhil and professional doctorate students" class="gtm-processed">PhD, MPhil and professional doctorate students</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/aboriginal-torres-strait-islander-students" data-gtm-label="Study > Aboriginal and Torres Strait Islander students" class="gtm-processed">Aboriginal and Torres Strait Islander students</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options/study-abroad" data-gtm-label="Study > Study abroad and exchange students" class="gtm-processed">Study abroad and exchange students</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/teachers-guidance-counsellors" data-gtm-label="Study > Teachers and guidance counsellors" class="gtm-processed">Teachers and guidance counsellors</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/parents-guardians" data-gtm-label="Study > Parents and guardians" class="gtm-processed">Parents and guardians</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://my.uq.edu.au/" data-gtm-label="Study > Current students" class="gtm-processed">Current students</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link--has-dropdown gtm-processed" href="https://research.uq.edu.au/" data-gtm-label="Research">Research</a>
                    <div class="uq-header__megamenu">
                        <div class="uq-header__megamenu-container">
                            <a href="https://research.uq.edu.au/" class="megamenu__overview-link gtm-processed" data-gtm-label="Research > Research overview">Research overview</a>
                            <div class="megamenu__row">
                            <div class="megamenu__column">
                                <div class="megamenu__heading">Our research</div>
                                <div class="megamenu__menu">
                                    <ul>
                                        <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/news" data-gtm-label="Research > Research news" class="gtm-processed">Research news</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/research-support" data-gtm-label="Research > Research funding, ethics and support" class="gtm-processed">Research funding, ethics and support</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/faculties-schools-institutes-centres" data-gtm-label="Research > Faculties, schools, institutes and centres" class="gtm-processed">Faculties, schools, institutes and centres</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://www.uq.edu.au/research/about/research-infrastructure" data-gtm-label="Research > Research facilities and infrastructure" class="gtm-processed">Research facilities and infrastructure</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://researchers.uq.edu.au/" data-gtm-label="Research > Find a researcher" class="gtm-processed">Find a researcher</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/contact" data-gtm-label="Research > Contact" class="gtm-processed">Contact</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="megamenu__column">
                                <div class="megamenu__heading">Graduate research</div>
                                <div class="megamenu__menu">
                                    <ul>
                                        <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/graduate-research" data-gtm-label="Research > About Graduate School" class="gtm-processed">About Graduate School</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options/phd-mphil-professional-doctorate" data-gtm-label="Research > PhD, MPhil and professional doctorate" class="gtm-processed">PhD, MPhil and professional doctorate</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://researchers.uq.edu.au/" data-gtm-label="Research > Find a supervisor" class="gtm-processed">Find a supervisor</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/admissions/phd-mphil-professional-doctorate" data-gtm-label="Research > How to apply" class="gtm-processed">How to apply</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://my.uq.edu.au/information-and-services/higher-degree-research" data-gtm-label="Research > Current students" class="gtm-processed">Current students</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="megamenu__column">
                                <div class="megamenu__heading">Partner with us</div>
                                <div class="megamenu__menu">
                                    <ul>
                                        <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/partner" data-gtm-label="Research > About research partnerships" class="gtm-processed">About research partnerships</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/partner/industry" data-gtm-label="Research > Industry portfolios" class="gtm-processed">Industry portfolios</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/partner/ways-to-partner" data-gtm-label="Research > Ways to partner" class="gtm-processed">Ways to partner</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </li>
                <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link--has-dropdown gtm-processed" href="https://partners-community.uq.edu.au" data-gtm-label="Partners and community">Partners and community</a>
                    <div class="uq-header__megamenu">
                        <div class="uq-header__megamenu-container">
                            <a href="https://partners-community.uq.edu.au" class="megamenu__overview-link gtm-processed" data-gtm-label="Partners and community > Partners and community overview">Partners and community overview</a>
                            <div class="megamenu__row">
                            <div class="megamenu__column">
                                <div class="megamenu__heading">Industry partnerships</div>
                                <div class="megamenu__menu">
                                    <ul>
                                        <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/partner" data-gtm-label="Partners and community > Research partnerships&ZeroWidthSpace;" class="gtm-processed">Research partnerships&ZeroWidthSpace;</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://global-partnerships.uq.edu.au/partnerships" data-gtm-label="Partners and community > Teaching and exchange collaborations" class="gtm-processed">Teaching and exchange collaborations</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://employability.uq.edu.au/work-experience" data-gtm-label="Partners and community > Student work placements and internships&ZeroWidthSpace;" class="gtm-processed">Student work placements and internships&ZeroWidthSpace;</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/initiatives/2032-games" data-gtm-label="Partners and community > Office of 2032 Games Engagement" class="gtm-processed">Office of 2032 Games Engagement</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="megamenu__column">
                                <div class="megamenu__heading">Community engagement&ZeroWidthSpace;</div>
                                <div class="megamenu__menu">
                                    <ul>
                                        <li data-gtm-category="Main navigation"><a href="https://alumni.uq.edu.au/" data-gtm-label="Partners and community > Alumni&ZeroWidthSpace;" class="gtm-processed">Alumni&ZeroWidthSpace;</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://alumni.uq.edu.au/giving" data-gtm-label="Partners and community > Giving and philanthropy" class="gtm-processed">Giving and philanthropy</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://alumni.uq.edu.au/volunteer" data-gtm-label="Partners and community > Volunteering&ZeroWidthSpace;" class="gtm-processed">Volunteering&ZeroWidthSpace;</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/teachers-guidance-counsellors" data-gtm-label="Partners and community > High school engagement" class="gtm-processed">High school engagement</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://indigenous-engagement.uq.edu.au" data-gtm-label="Partners and community > Indigenous engagement&ZeroWidthSpace;" class="gtm-processed">Indigenous engagement&ZeroWidthSpace;</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://www.uq.edu.au/about/sponsorships" data-gtm-label="Partners and community > Community sponsorships&ZeroWidthSpace;" class="gtm-processed">Community sponsorships&ZeroWidthSpace;</a></li>
                                        <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/initiatives/queensland-commitment" data-gtm-label="Partners and community > The Queensland Commitment" class="gtm-processed">The Queensland Commitment</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="megamenu__column">
                            <div class="megamenu__heading">Our facilities</div>
                            <div class="megamenu__menu">
                                <ul>
                                    <li data-gtm-category="Main navigation"><a href="https://partners-community.uq.edu.au/arts" data-gtm-label="Partners and community > Arts and culture&ZeroWidthSpace;" class="gtm-processed">Arts and culture&ZeroWidthSpace;</a></li>
                                    <li data-gtm-category="Main navigation"><a href="https://campuses.uq.edu.au" data-gtm-label="Partners and community > Explore our&nbsp;campuses&ZeroWidthSpace;" class="gtm-processed">Explore our&nbsp;campuses&ZeroWidthSpace;</a></li>
                                    <li data-gtm-category="Main navigation"><a href="https://campuses.uq.edu.au/information-and-services/shops" data-gtm-label="Partners and community > Services and shops&ZeroWidthSpace;" class="gtm-processed">Services and shops&ZeroWidthSpace;</a></li>
                                    <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/sport-recreation-precinct" data-gtm-label="Partners and community > Sport and recreation facilities&ZeroWidthSpace;" class="gtm-processed">Sport and recreation facilities&ZeroWidthSpace;</a></li>
                                    <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/venues" data-gtm-label="Partners and community > Venue hire and event spaces&ZeroWidthSpace;&ZeroWidthSpace;" class="gtm-processed">Venue hire and event spaces&ZeroWidthSpace;&ZeroWidthSpace;</a></li>
                                </ul>
                            </div>
                        </div>
                        </div>
                        </div>
                    </div>
                </li>
                <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link--has-dropdown gtm-processed" href="https://about.uq.edu.au/" data-gtm-label="About">About</a>
                    <div class="uq-header__megamenu">
                        <div class="uq-header__megamenu-container">
                            <a href="https://about.uq.edu.au/" class="megamenu__overview-link gtm-processed" data-gtm-label="About > About overview">About overview</a>
                            <div class="megamenu__row">
                                <div class="megamenu__column">
                                    <div class="megamenu__heading">Our profile</div>
                                    <div class="megamenu__menu">
                                        <ul>
                                            <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/university-profile" data-gtm-label="About > Introducing UQ" class="gtm-processed">Introducing UQ</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/strategic-plan" data-gtm-label="About > Vision, values and strategy" class="gtm-processed">Vision, values and strategy</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://teaching-learning.uq.edu.au/" data-gtm-label="About > Teaching and learning" class="gtm-processed">Teaching and learning</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/initiatives" data-gtm-label="About > Strategic initiatives and projects" class="gtm-processed">Strategic initiatives and projects</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/organisation" data-gtm-label="About > Organisational structure and governance" class="gtm-processed">Organisational structure and governance</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://policies.uq.edu.au" data-gtm-label="About > Policies and procedures" class="gtm-processed">Policies and procedures</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/faculties-schools-institutes-centres" data-gtm-label="About > Faculties, schools, institutes and centres" class="gtm-processed">Faculties, schools, institutes and centres</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="megamenu__column">
                                    <div class="megamenu__heading">Campuses and facilities</div>
                                    <div class="megamenu__menu">
                                        <ul>
                                            <li data-gtm-category="Main navigation"><a href="https://campuses.uq.edu.au/" data-gtm-label="About > Campuses, maps and transport" class="gtm-processed">Campuses, maps and transport</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://my.uq.edu.au/student-support/accommodation" data-gtm-label="About > Colleges and accommodation" class="gtm-processed">Colleges and accommodation</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://campuses.uq.edu.au/information-and-services/shops" data-gtm-label="About > Community facilities and services" class="gtm-processed">Community facilities and services</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/venues" data-gtm-label="About > Venue hire and event spaces&ZeroWidthSpace;" class="gtm-processed">Venue hire and event spaces&ZeroWidthSpace;</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="megamenu__column">
                                    <div class="megamenu__heading">Working at UQ</div>
                                    <div class="megamenu__menu">
                                        <ul>
                                            <li data-gtm-category="Main navigation"><a href="https://careers.uq.edu.au/" data-gtm-label="About > Careers at UQ" class="gtm-processed">Careers at UQ</a></li>
                                            <li data-gtm-category="Main navigation"><a href="https://careers.uq.edu.au/search-jobs" data-gtm-label="About > Jobs search" class="gtm-processed">Jobs search</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
          </nav>
        </div>
        <div class="uq-header__search-toggle">
          <button class="nav-primary__toggle nav-primary__search-toggle" data-testid="uq-header-search-button" data-analyticsid="uq-header-search-button" data-gtm-action="Toggle">
            <div class="search-toggle__label">Search</div>
          </button>
        </div>
      </div>
      <nav class="slide-menu global-mobile-nav" id="global-mobile-nav" aria-label="primary navigation mobile">
        <div class="uq-site-header__title-container">
          <div class="uq-site-header__title-container__left">
            <a href="/" class="uq-site-header__title">Site title</a>
          </div>
        </div>
      </nav>
      <div class="uq-header__search">
        <div class="uq-header__search-container">
          <form action="https://www.uq.edu.au/search" method="get">
            <fieldset>
              <div class="uq-header__search-query">
                <label for="edit-q" class="visually-hidden uq-header__search-query-label">Search term</label>
                <input type="text" id="edit-q" data-testid="uq-header-search-input" data-analyticsid="uq-header-search-input" name="q" value="" maxlength="128" placeholder="Search by keyword" class="uq-header__search-query-input">
                <span class="uq-header__search-query-button">
                  <input type="submit" name="op" value="Search" class="uq-header__search-query-submit" data-testid="uq-header-search-submit" data-analyticsid="uq-header-search-submit">
                </span>
              </div>
              <input type="hidden" value="library.uq.edu.au" name="as_sitesearch" id="edit-as_sitesearch-on" data-testid="uq-header-search-input-as-sitesearch" data-analyticsid="uq-header-search-input-as-sitesearch">
            </fieldset>
          </form>
        </div>
      </div>
      <div class="uq-header__nav-secondary">
        <nav class="uq-header__nav-secondary-container" data-analyticsid="uq-header-nav">
          <ul class="uq-header__nav-secondary-list" data-testid="uq-header-secondary-nav" data-analyticsid="uq-header-secondary-nav">
              <li class="uq-header__nav-secondary-item">
                 <a href="https://www.uq.edu.au" rel="external" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-logo-small-link">UQ home</a>
              </li>
              <li class="uq-header__nav-secondary-item">
                  <a href="https://www.uq.edu.au/news" rel="external" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-news-link">News</a>
              </li>
              <li class="uq-header__nav-secondary-item">
                  <a href="https://www.uq.edu.au/uq-events" rel="external" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-events-link">Events</a>
              </li>
              <li class="uq-header__nav-secondary-item">
                  <a href="https://alumni.uq.edu.au/giving" rel="external" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-giving-link">Give</a>
              </li>
              <li class="uq-header__nav-secondary-item">
                <a href="https://contacts.uq.edu.au/contacts" rel="external" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-contacts-link">Contact</a>
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
                    //this.changeSearchWidgetLabel(newValue);

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
                const rootHeaderElement = document.querySelector('uq-header');
                const headerElem = !!rootHeaderElement && rootHeaderElement.shadowRoot.querySelector('.uq-header');
                !!headerElem && !!uq && !!uq.header && new uq.header(headerElem);

                new uq.accordion(); // opens and closes the Site Search toggle
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

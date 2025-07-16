import styles from './css/main.css';
import overrides from './css/overrides.css';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${overrides.toString()}</style>
    <button style="display: none" tabindex="0" class="skip-to-content-link" id="skip-nav" data-testid="skip-nav" aria-label="Click to skip to the sites main content" data-analyticsid="uq-header-skip-click">
        Skip to site content
    </button>
    <header class="uq-header" data-gtm-category="Header">
    <div class="uq-header__container">
        <div class="uq-header__menu-toggle" data-target="global-mobile-nav"  data-gtm-category="Primary header">
            <button id="mobile-menu-toggle-button" data-testid="mobile-menu-toggle-button" data-analyticsid="uq-header-skip-click" type="button" 
            class="nav-primary__toggle nav-primary__menu-toggle slide-menu__control" 
            data-target="global-mobile-nav" data-action="toggle" data-gtm-action="Toggle"
            aria-haspopup="true" aria-expanded="false" aria-controls="uq-site-header__navigation-container">
              Menu
            </button>
        </div>
        <div class="uq-header__logo" data-testid="uq-header-logo" data-analyticsid="uq-header-logo" data-gtm-category="Primary header">
            <a class="logo--large" href="https://www.uq.edu.au/" data-gtm-label="UQ Logo" data-testid="uq-header-logo-large-link" data-analyticsid="uq-header-logo-large-link">
                <img alt="The University of Queensland" src="https://static.uq.net.au/v11/logos/corporate/uq-logo--reversed.svg">
            </a>
        </div>
        <div class="uq-header__nav-primary" data-testid="uq-header-primary-nav" data-analyticsid="uq-header-primary-nav">
            <nav class="uq-header__nav-primary-container" aria-label="primary navigation">
                <ul class="uq-header__nav-primary-list">
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link" href="https://study.uq.edu.au/" data-gtm-label="Study" data-analyticsid="uq-header-primary-study">Study</a>
                    </li>
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link" href="https://research.uq.edu.au/" data-gtm-label="Research" data-analyticsid="uq-header-primary-research">Research</a>
                    </li>
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link" href="https://partners-community.uq.edu.au" data-gtm-label="Partners and community" data-analyticsid="uq-header-primary-partners">Partners and community</a>
                    </li>
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link" href="https://about.uq.edu.au/" data-gtm-label="About" data-analyticsid="uq-header-primary-about">About</a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="uq-header__search-toggle">
            <button class="nav-primary__toggle nav-primary__search-toggle" id="uq-header-search-button" 
                data-testid="uq-header-search-button" data-analyticsid="uq-header-search-button" data-gtm-action="Toggle"
                aria-haspopup="true" aria-expanded="false" aria-controls="uq-header_search_panel">
                <div id="search-toggle__label" class="search-toggle__label">Search</div>
            </button>
        </div>
    </div>
    <nav class="slide-menu global-mobile-nav" id="global-mobile-nav" aria-label="primary navigation mobile">
        <ul>
            <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
                <a class="uq-header__newglobal-nav-link slide-menu__control" href="https://study.uq.edu.au/" data-analyticsid="uq-header-mobile-study">Study</a>
                <ul>
                    <li>
                        <a href="https://study.uq.edu.au/" data-gtm-label="Study > Study overview" data-analyticsid="uq-header-mobile-study-overview">Study overview</a>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-study-with-us">Study with us</a>
                        <ul>
                            <li><a href="https://study.uq.edu.au/study-options/programs" data-gtm-label="Study > Find a course or program" data-analyticsid="uq-header-mobile-find-course">Find a course or program</a></li>
                            <li><a href="https://study.uq.edu.au/study-options/browse-study-areas" data-gtm-label="Study > Browse study areas" data-analyticsid="uq-header-mobile-browser-areas">Browse study areas</a></li>
                            <li><a href="https://study.uq.edu.au/study-options" data-gtm-label="Study > Study options" data-analyticsid="uq-header-mobile-study-options">Study options</a></li>
                            <li><a href="https://study.uq.edu.au/short-courses" data-gtm-label="Study > Short courses" data-analyticsid="uq-header-mobile-short-courses">Short courses</a></li>
                            <li><a href="https://study.uq.edu.au/admissions" data-gtm-label="Study > How to apply" data-analyticsid="uq-header-mobile-how-to-apply">How to apply</a></li>
                            <li><a href="https://scholarships.uq.edu.au/" data-gtm-label="Study > Scholarships" data-analyticsid="uq-header-mobile--scholarships">Scholarships</a></li>
                            <li><a href="https://my.uq.edu.au/starting-at-uq" data-gtm-label="Study > Starting at UQ" data-analyticsid="uq-header-mobile-starting">Starting at UQ</a></li>
                            <li><a href="https://study.uq.edu.au/contact" data-gtm-label="Study > Contact" data-analyticsid="uq-header-mobile-contact">Contact</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-discover">Discover UQ</a>
                        <ul>
                            <li><a href="https://study.uq.edu.au/why-choose-uq" data-gtm-label="Study > Why choose UQ" data-analyticsid="uq-header-mobile-discover-why">Why choose UQ</a></li>
                            <li><a href="https://study.uq.edu.au/enhance-your-employability" data-gtm-label="Study > Enhance your employability" data-analyticsid="uq-header-mobile-discover-enhance">Enhance your employability</a></li>
                            <li><a href="https://study.uq.edu.au/university-life" data-gtm-label="Study > Life at UQ and accommodation" data-analyticsid="uq-header-mobile-discover-life">Life at UQ and accommodation</a></li>
                            <li><a href="https://campuses.uq.edu.au/" data-gtm-label="Study > Campuses, maps and transport" data-analyticsid="uq-header-mobile-discover-maps">Campuses, maps and transport</a></li>
                            <li><a href="https://study.uq.edu.au/events" data-gtm-label="Study > Events for prospective students" data-analyticsid="uq-header-mobile-discover-events">Events for prospective students</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-information">Information for</a>
                        <ul>
                            <li><a href="https://study.uq.edu.au/information-resources/international-students" data-gtm-label="Study > International students" data-analyticsid="uq-header-mobile-information-international">International students</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/high-school-students" data-gtm-label="Study > High school students" data-analyticsid="uq-header-mobile-information-highschool">High school students</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/non-school-leavers" data-gtm-label="Study > Non-school leavers" data-analyticsid="uq-header-mobile-information-nonschool">Non-school leavers</a></li>
                            <li><a href="https://study.uq.edu.au/study-options/phd-mphil-professional-doctorate" data-gtm-label="Study > PhD, MPhil and professional doctorate students" data-analyticsid="uq-header-mobile-information-postgrad">PhD, MPhil and professional doctorate students</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/aboriginal-torres-strait-islander-students" data-gtm-label="Study > Aboriginal and Torres Strait Islander students" data-analyticsid="uq-header-mobile-information-aboriginal">Aboriginal and Torres Strait Islander students</a></li>
                            <li><a href="https://study.uq.edu.au/study-options/study-abroad" data-gtm-label="Study > Study abroad and exchange students" data-analyticsid="uq-header-mobile-information-abroad">Study abroad and exchange students</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/teachers-guidance-counsellors" data-gtm-label="Study > Teachers and guidance counsellors" data-analyticsid="uq-header-mobile-information-teachers">Teachers and guidance counsellors</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/parents-guardians" data-gtm-label="Study > Parents and guardians" data-analyticsid="uq-header-mobile-information-parents">Parents and guardians</a></li>
                            <li><a href="https://my.uq.edu.au/" data-gtm-label="Study > Current students" data-analyticsid="uq-header-mobile-information-current">Current students</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
                <a class="uq-header__newglobal-nav-link slide-menu__control" href="https://research.uq.edu.au/" data-analyticsid="uq-header-mobile-research">Research</a>
                <ul>
                    <li>
                        <a href="https://research.uq.edu.au/" data-gtm-label="Research > Research overview" data-analyticsid="uq-header-mobile-research-overview">Research overview</a>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-research-overview-our">Our research</a>
                        <ul>
                            <li><a href="https://research.uq.edu.au/strategy" data-gtm-label="Research > Strategy and impact" data-analyticsid="uq-header-mobile-research-overview-strategy">Strategy and impact</a></li>
                            <li><a href="https://research.uq.edu.au/research-capabilities" data-gtm-label="Research > Research capabilities" data-analyticsid="uq-header-mobile-research-overview-capabilities">Research capabilities</a></li>
                            <li><a href="https://research.uq.edu.au/facilities" data-gtm-label="Research > Facilities and infrastructure" data-analyticsid="uq-header-mobile-research-overview-facilities">Facilities and infrastructure</a></li>
                            <li><a href="https://research.uq.edu.au/ethics-integrity" data-gtm-label="Research > Ethics and integrity" data-analyticsid="uq-header-mobile-research-overview-ethics">Ethics and integrity</a></li>
                            <li><a href="https://research.uq.edu.au/supporting-researchers" data-gtm-label="Research > Supporting our researchers" data-analyticsid="uq-header-mobile-research-overview-support">Supporting our researchers</a></li>
                            <li><a href="https://uq.edu.au/research/news" data-gtm-label="Research > News" data-analyticsid="uq-header-mobile-research-overview-news">News</a></li>
                            <li><a href="https://about.uq.edu.au/experts" data-gtm-label="Research > Find an expert" data-analyticsid="uq-header-mobile-research-overview-expert">Find an expert</a></li>
                            <li><a href="https://research.uq.edu.au/contact" data-gtm-label="Research > Contact" data-analyticsid="uq-header-mobile-research-overview-contact">Contact</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-research-graduate">Graduate research</a>
                        <ul>
                            <li><a href="https://research.uq.edu.au/graduate-research" data-gtm-label="Research > About Graduate School" data-analyticsid="uq-header-mobile-research-graduate-about">About Graduate School</a></li>
                            <li><a href="https://study.uq.edu.au/study-options/phd-mphil-professional-doctorate" data-gtm-label="Research > PhD, MPhil and professional doctorate" data-analyticsid="uq-header-mobile-research-graduate-postgrad">PhD, MPhil and professional doctorate</a></li>
                            <li><a href="https://about.uq.edu.au/experts" data-gtm-label="Research > Find a supervisor" data-analyticsid="uq-header-mobile-research-graduate-supervisor">Find a supervisor</a></li>
                            <li><a href="https://study.uq.edu.au/admissions/phd-mphil-professional-doctorate" data-gtm-label="Research > How to apply" data-analyticsid="uq-header-mobile-research-graduate-how">How to apply</a></li>
                            <li><a href="https://my.uq.edu.au/information-and-services/higher-degree-research" data-gtm-label="Research > Current students" data-analyticsid="uq-header-mobile-research-graduate-current">Current students</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-research-partner">Partner with us</a>
                        <ul>
                            <li><a href="https://research.uq.edu.au/partner" data-gtm-label="Research > About partnerships" data-analyticsid="uq-header-mobile-research-partner-about">About partnerships</a></li>
                            <li><a href="https://research.uq.edu.au/partner/industry" data-gtm-label="Research > Industry portfolios" data-analyticsid="uq-header-mobile-research-partner-industry">Industry portfolios</a></li>
                            <li><a href="https://research.uq.edu.au/partner/ways-to-partner" data-gtm-label="Research > Ways to partner" data-analyticsid="uq-header-mobile-research-partner-ways">Ways to partner</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
                <a class="uq-header__newglobal-nav-link slide-menu__control" href="https://partners-community.uq.edu.au" data-analyticsid="uq-header-mobile-partner">Partners and community</a>
                <ul>
                    <li>
                        <a href="https://partners-community.uq.edu.au" data-gtm-label="Partners and community > Partners and community overview" data-analyticsid="uq-header-mobile-partner-overview">Partners and community overview</a>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-partner-industry">Industry partnerships</a>
                        <ul>
                            <li><a href="https://research.uq.edu.au/partner" data-gtm-label="Partners and community > Research partnerships" data-analyticsid="uq-header-mobile-partner-industry-partnership">Research partnerships</a></li>
                            <li><a href="https://global-partnerships.uq.edu.au/partnerships" data-gtm-label="Partners and community > Teaching and exchange collaborations" data-analyticsid="uq-header-mobile-partner-industry-teaching">Teaching and exchange collaborations</a></li>
                            <li><a href="https://employability.uq.edu.au/work-experience" data-gtm-label="Partners and community > Student work placements and internships" data-analyticsid="uq-header-mobile-partner-industry-placement">Student work placements and internships</a></li>
                            <li><a href="https://about.uq.edu.au/initiatives/2032-games" data-gtm-label="Partners and community > Office of 2032 Games Engagement" data-analyticsid="uq-header-mobile-partner-industry-2032">Office of 2032 Games Engagement</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-partner-community">Community engagement</a>
                        <ul>
                            <li><a href="https://alumni.uq.edu.au/" data-gtm-label="Partners and community > Alumni" data-analyticsid="uq-header-mobile-partner-community-alumni">Alumni</a></li>
                            <li><a href="https://alumni.uq.edu.au/giving" data-gtm-label="Partners and community > Giving and philanthropy" data-analyticsid="uq-header-mobile-partner-community-giving">Giving and philanthropy</a></li>
                            <li><a href="https://alumni.uq.edu.au/volunteer" data-gtm-label="Partners and community > Volunteering" data-analyticsid="uq-header-mobile-partner-community-volunteering">Volunteering</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/teachers-guidance-counsellors" data-gtm-label="Partners and community > High school engagement" data-analyticsid="uq-header-mobile-partner-community-highschool">High school engagement</a></li>
                            <li><a href="https://indigenous-engagement.uq.edu.au" data-gtm-label="Partners and community > Indigenous engagement" data-analyticsid="uq-header-mobile-partner-community-indigenous">Indigenous engagement</a></li>
                            <li><a href="https://partners-community.uq.edu.au/sponsorships" data-gtm-label="Partners and community > Sponsorships and brand partnerships" data-analyticsid="uq-header-mobile-partner-community-sponsorships">Sponsorships and brand partnerships</a></li>
                            <li><a href="https://about.uq.edu.au/initiatives/queensland-commitment" data-gtm-label="Partners and community > The Queensland Commitment" data-analyticsid="uq-header-mobile-partner-community-commitment">The Queensland Commitment</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-partner-facilities">Our facilities</a>
                        <ul>
                            <li><a href="https://partners-community.uq.edu.au/arts" data-gtm-label="Partners and community > Arts and culture" data-analyticsid="uq-header-mobile-partner-facilities-arts">Arts and culture</a></li>
                            <li><a href="https://campuses.uq.edu.au" data-gtm-label="Partners and community > Explore our campuses" data-analyticsid="uq-header-mobile-partner-facilities-explore">Explore our campuses</a></li>
                            <li><a href="https://campuses.uq.edu.au/information-and-services/shops" data-gtm-label="Partners and community > Services and shops" data-analyticsid="uq-header-mobile-partner-facilities-services">Services and shops</a></li>
                            <li><a href="https://about.uq.edu.au/sport-recreation-precinct" data-gtm-label="Partners and community > Sport and recreation facilities" data-analyticsid="uq-header-mobile-partner-facilities-sport">Sport and recreation facilities</a></li>
                            <li><a href="https://about.uq.edu.au/venues" data-gtm-label="Partners and community > Venue hire and event spaces" data-analyticsid="uq-header-mobile-partner-facilities-venue">Venue hire and event spaces</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
                <a class="uq-header__newglobal-nav-link slide-menu__control" href="https://about.uq.edu.au/" data-analyticsid="uq-header-mobile-about">About</a>
                <ul>
                    <li>
                        <a href="https://about.uq.edu.au/" data-gtm-label="About > About overview" data-analyticsid="uq-header-mobile-about-overview">About overview</a>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-about-profile">Our profile</a>
                        <ul>
                            <li><a href="https://about.uq.edu.au/university-profile" data-gtm-label="About > Introducing UQ" data-analyticsid="uq-header-mobile-about-intro">Introducing UQ</a></li>
                            <li><a href="https://about.uq.edu.au/strategic-plan" data-gtm-label="About > Vision, values and strategy" data-analyticsid="uq-header-mobile-about-vision">Vision, values and strategy</a></li>
                            <li><a href="https://about.uq.edu.au/learning-teaching-student-experience" data-gtm-label="About > Learning, teaching and student experience" data-analyticsid="uq-header-mobile-about-teaching">Learning, teaching and student experience</a></li>
                            <li><a href="https://about.uq.edu.au/initiatives" data-gtm-label="About > Strategic initiatives and projects" data-analyticsid="uq-header-mobile-about-strategic">Strategic initiatives and projects</a></li>
                            <li><a href="https://about.uq.edu.au/governance-and-organisational-structure" data-gtm-label="About > Governance and organisational structure" data-analyticsid="uq-header-mobile-about-governance">Governance and organisational structure</a></li>
                            <li><a href="https://policies.uq.edu.au" data-gtm-label="About > Policies and procedures" data-analyticsid="uq-header-mobile-about-policies">Policies and procedures</a></li>
                            <li><a href="https://about.uq.edu.au/faculties-schools-institutes-centres" data-gtm-label="About > Faculties, schools, institutes and centres" data-analyticsid="uq-header-mobile-about-faculties">Faculties, schools, institutes and centres</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-about-campuses">Campuses and facilities</a>
                        <ul>
                            <li><a href="https://campuses.uq.edu.au/" data-gtm-label="About > Campuses, maps and transport" data-analyticsid="uq-header-mobile-about-campuses">Campuses, maps and transport</a></li>
                            <li><a href="https://my.uq.edu.au/student-support/accommodation" data-gtm-label="About > Colleges and accommodation" data-analyticsid="uq-header-mobile-about-accomodation">Colleges and accommodation</a></li>
                            <li><a href="https://campuses.uq.edu.au/information-and-services/shops" data-gtm-label="About > Community facilities and services" data-analyticsid="uq-header-mobile-about-facilities">Community facilities and services</a></li>
                            <li><a href="https://about.uq.edu.au/venues" data-gtm-label="About > Venue hire and event spaces" data-analyticsid="uq-header-mobile-about-venue">Venue hire and event spaces</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control" data-analyticsid="uq-header-mobile-working">Working at UQ</a>
                        <ul>
                            <li><a href="https://about.uq.edu.au/careers" data-gtm-label="About > Careers at UQ" data-analyticsid="uq-header-mobile-working-careers">Careers at UQ</a></li>
                            <li><a href="https://about.uq.edu.au/careers" data-gtm-label="About > Jobs search" data-analyticsid="uq-header-mobile-working-search">Jobs search</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                <a class="uq-header__nav-secondary-link" href="https://www.uq.edu.au/" data-analyticsid="uq-header-mobile-top-home">UQ home</a>
            </li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                <a class="uq-header__nav-secondary-link" href="https://www.uq.edu.au/news/" data-analyticsid="uq-header-mobile-top-news">News</a>
            </li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                <a class="uq-header__nav-secondary-link" href="https://www.uq.edu.au/uq-events" data-analyticsid="uq-header-mobile-top-events">Events</a>
            </li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                <a class="uq-header__nav-secondary-link" href="https://alumni.uq.edu.au/giving/" data-analyticsid="uq-header-mobile-top-give">Give</a>
            </li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                <a class="uq-header__nav-secondary-link" href="https://contacts.uq.edu.au/contacts" data-analyticsid="uq-header-mobile-top-contact">Contact</a>
            </li>
        </ul>
    </nav>
    <div id="uq-header_search_panel" class="uq-header__search" data-gtm-category="Search">
        <div class="uq-header__search-container">
            <form action="https://search.uq.edu.au/" method="get" data-gtm-action="Text search" data-gtm-form-action="">
                <fieldset>
                    <div class="uq-header__search-query">
                        <label for="edit-q" class="visually-hidden uq-header__search-query-label">Search term</label>
                        <input type="text" id="edit-q" data-testid="uq-header-search-input" data-analyticsid="uq-header-search-input" name="q" value="" maxlength="128" placeholder="Search by keyword" autocomplete="off" class="uq-header__search-query-input" data-gtm-form-search="">
                        <span class="uq-header__search-query-button">
                            <input type="submit" name="op" value="Search" class="uq-header__search-query-submit" data-testid="uq-header-search-submit" data-analyticsid="uq-header-search-submit" data-gtm-trigger="click">
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
                <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                    <a href="https://www.uq.edu.au/" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-logo-small-link">UQ home</a>
                </li>
                <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                    <a href="https://www.uq.edu.au/news/" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-news-link">News</a>
                </li>
                <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                    <a href="https://www.uq.edu.au/uq-events" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-events-link">Events</a>
                </li>
                <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                    <a href="https://alumni.uq.edu.au/giving/" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-giving-link">Give</a>
                </li>
                <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                    <a href="https://contacts.uq.edu.au/contacts" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-contacts-link">Contact</a>
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

        this.addButtonListeners(shadowDOM);
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

    addButtonListeners(shadowDOM) {
        function toggleSearchInputField() {
            function toggleButton() {
                const buttonPanel = shadowDOM.getElementById('uq-header-search-button');
                if (!!buttonPanel) {
                    buttonPanel.classList.toggle('nav-primary__search-toggle--is-open');
                    const currentExpanded = buttonPanel.getAttribute('aria-expanded');
                    buttonPanel.setAttribute('aria-expanded', currentExpanded === 'false' ? 'true' : 'false');
                }

                const button = shadowDOM.getElementById('search-toggle__label');
                button.innerHTML = button.innerHTML === 'Search' ? 'Close' : 'Search';
            }

            function placeFocus(inputFieldPanel) {
                const inputField = shadowDOM.getElementById('edit-q');
                if (inputFieldPanel.classList.contains('uq-header__search--is-open')) {
                    inputField.focus();
                } else {
                    inputField.blur();
                    inputFieldPanel.blur();
                }
            }

            function showHideInputField() {
                const inputFieldPanel = shadowDOM.getElementById('uq-header_search_panel');
                !!inputFieldPanel && inputFieldPanel.classList.toggle('uq-header__search--is-open');
                placeFocus(inputFieldPanel);
            }

            toggleButton();
            showHideInputField();
        }

        function openCloseMobileMenu() {
            function clickSiteHeaderMenuButton() {
                // clicking the uq-header hamburger button clicks the hidden menu button on uq-site-header
                const siteHeader = document.querySelector('uq-site-header');
                const siteHeaderShadowRoot = !!siteHeader && siteHeader.shadowRoot;
                const siteHeaderHiddenMobileButton =
                    !!siteHeaderShadowRoot && siteHeaderShadowRoot.getElementById('uq-site-header__navigation-toggle');
                !!siteHeaderHiddenMobileButton && siteHeaderHiddenMobileButton.click();
            }

            function toggleMobileMenuButton() {
                const mobileMenuToggleButton = shadowDOM.getElementById('mobile-menu-toggle-button');
                if (!!mobileMenuToggleButton) {
                    mobileMenuToggleButton.classList.toggle('nav-primary__menu-toggle--is-open');
                    const currentExpanded = mobileMenuToggleButton.getAttribute('aria-expanded');
                    mobileMenuToggleButton.setAttribute(
                        'aria-expanded',
                        currentExpanded === 'false' ? 'true' : 'false',
                    );
                }
            }

            function isSiteSearchOpen() {
                const siteSearchToggle = shadowDOM.querySelector('.nav-primary__search-toggle');
                return (
                    !!siteSearchToggle && !!siteSearchToggle.classList.contains('nav-primary__search-toggle--is-open')
                );
            }

            function closeSiteSearch() {
                const siteSearchToggle = shadowDOM.querySelector('.nav-primary__search-toggle');
                siteSearchToggle.classList.remove('nav-primary__search-toggle--is-open');

                const siteSearchLabel = shadowDOM.querySelector('.uq-header__search');
                !!siteSearchLabel && (siteSearchLabel.innerHTML = 'Search');

                const siteSearchPanel = shadowDOM.querySelector('.uq-header__search');
                !!siteSearchPanel &&
                    !!siteSearchPanel.classList.contains('uq-header__search') &&
                    siteSearchPanel.classList.remove('uq-header__search');
            }

            function isPrimoPage() {
                const primoNavbar = document.querySelector('.top-nav-bar.layout-row');
                return !!primoNavbar;
            }

            function isMobileMenuOpen() {
                const mobileMenuToggleButton = shadowDOM.querySelector('.nav-primary__menu-toggle');
                return (
                    !!mobileMenuToggleButton &&
                    mobileMenuToggleButton.classList.contains('nav-primary__menu-toggle--is-open')
                );
            }

            function showHidePrimoUtilityBar() {
                const newClass = isMobileMenuOpen() ? 'none' : null;
                const primoNavbar = document.querySelector('.top-nav-bar.layout-row');
                !!primoNavbar && (primoNavbar.style.display = newClass);
            }

            toggleMobileMenuButton();
            if (isSiteSearchOpen()) {
                closeSiteSearch();
            }
            if (isPrimoPage()) {
                showHidePrimoUtilityBar();
            }
            clickSiteHeaderMenuButton();
        }

        const searchButton = shadowDOM.getElementById('uq-header-search-button');
        !!searchButton && searchButton.addEventListener('click', toggleSearchInputField);

        const mobileMenuToggleButton = shadowDOM.getElementById('mobile-menu-toggle-button');
        !!mobileMenuToggleButton && mobileMenuToggleButton.addEventListener('click', openCloseMobileMenu);
    }
}

export default UQHeader;

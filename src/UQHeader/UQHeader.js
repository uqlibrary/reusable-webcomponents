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
            <a class="logo--large" href="https://www.uq.edu.au/" data-gtm-label="UQ Logo" data-testid="uq-header-logo-large-link" data-analyticsid="uq-header-logo-large-link">
                <img alt="The University of Queensland" src="https://static.uq.net.au/v11/logos/corporate/uq-logo--reversed.svg">
            </a>
        </div>
        <div class="uq-header__nav-primary" data-testid="uq-header-primary-nav" data-analyticsid="uq-header-primary-nav">
            <nav class="uq-header__nav-primary-container" aria-label="primary navigation">
                <ul class="uq-header__nav-primary-list">
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link--has-dropdown" href="https://study.uq.edu.au/" data-gtm-label="Study">Study</a>
                        <div class="uq-header__megamenu">
                            <div class="uq-header__megamenu-container">
                                <a href="https://study.uq.edu.au/" class="megamenu__overview-link" data-gtm-label="Study > Study overview">Study overview</a>
                                <div class="megamenu__row">
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Study with us</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options/programs" data-gtm-label="Study > Find a course or program">Find a course or program</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options/browse-study-areas" data-gtm-label="Study > Browse study areas">Browse study areas</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options" data-gtm-label="Study > Study options">Study options</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/short-courses" data-gtm-label="Study > Short courses">Short courses</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/admissions" data-gtm-label="Study > How to apply">How to apply</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://scholarships.uq.edu.au/" data-gtm-label="Study > Scholarships">Scholarships</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://my.uq.edu.au/starting-at-uq" data-gtm-label="Study > Starting at UQ">Starting at UQ</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/contact" data-gtm-label="Study > Contact">Contact</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Discover UQ</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/why-choose-uq" data-gtm-label="Study > Why choose UQ">Why choose UQ</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/enhance-your-employability" data-gtm-label="Study > Enhance your employability">Enhance your employability</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/university-life" data-gtm-label="Study > Life at UQ and accommodation">Life at UQ and accommodation</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://campuses.uq.edu.au/" data-gtm-label="Study > Campuses, maps and transport">Campuses, maps and transport</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/events" data-gtm-label="Study > Events for prospective students">Events for prospective students</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Information for</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/international-students" data-gtm-label="Study > International students">International students</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/high-school-students" data-gtm-label="Study > High school students">High school students</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/non-school-leavers" data-gtm-label="Study > Non-school leavers">Non-school leavers</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options/phd-mphil-professional-doctorate" data-gtm-label="Study > PhD, MPhil and professional doctorate students">PhD, MPhil and professional doctorate students</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/aboriginal-torres-strait-islander-students" data-gtm-label="Study > Aboriginal and Torres Strait Islander students">Aboriginal and Torres Strait Islander students</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options/study-abroad" data-gtm-label="Study > Study abroad and exchange students">Study abroad and exchange students</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/teachers-guidance-counsellors" data-gtm-label="Study > Teachers and guidance counsellors">Teachers and guidance counsellors</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/parents-guardians" data-gtm-label="Study > Parents and guardians">Parents and guardians</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://my.uq.edu.au/" data-gtm-label="Study > Current students">Current students</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link--has-dropdown" href="https://research.uq.edu.au/" data-gtm-label="Research">Research</a>
                        <div class="uq-header__megamenu">
                            <div class="uq-header__megamenu-container">
                                <a href="https://research.uq.edu.au/" class="megamenu__overview-link" data-gtm-label="Research > Research overview">Research overview</a>
                                <div class="megamenu__row">
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Our research</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/strategy" data-gtm-label="Research > Strategy and impact">Strategy and impact</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/research-capabilities" data-gtm-label="Research > Research capabilities">Research capabilities</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/facilities" data-gtm-label="Research > Facilities and infrastructure">Facilities and infrastructure</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/ethics-integrity" data-gtm-label="Research > Ethics and integrity">Ethics and integrity</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/supporting-researchers" data-gtm-label="Research > Supporting our researchers">Supporting our researchers</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://uq.edu.au/research/news" data-gtm-label="Research > News">News</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/experts" data-gtm-label="Research > Find an expert">Find an expert</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/contact" data-gtm-label="Research > Contact">Contact</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Graduate research</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/graduate-research" data-gtm-label="Research > About Graduate School">About Graduate School</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/study-options/phd-mphil-professional-doctorate" data-gtm-label="Research > PhD, MPhil and professional doctorate">PhD, MPhil and professional doctorate</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/experts" data-gtm-label="Research > Find a supervisor">Find a supervisor</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/admissions/phd-mphil-professional-doctorate" data-gtm-label="Research > How to apply">How to apply</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://my.uq.edu.au/information-and-services/higher-degree-research" data-gtm-label="Research > Current students">Current students</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Partner with us</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/partner" data-gtm-label="Research > About partnerships">About partnerships</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/partner/industry" data-gtm-label="Research > Industry portfolios">Industry portfolios</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/partner/ways-to-partner" data-gtm-label="Research > Ways to partner">Ways to partner</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link--has-dropdown" href="https://partners-community.uq.edu.au" data-gtm-label="Partners and community">Partners and community</a>
                        <div class="uq-header__megamenu">
                            <div class="uq-header__megamenu-container">
                                <a href="https://partners-community.uq.edu.au" class="megamenu__overview-link" data-gtm-label="Partners and community > Partners and community overview">Partners and community overview</a>
                                <div class="megamenu__row">
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Industry partnerships</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://research.uq.edu.au/partner" data-gtm-label="Partners and community > Research partnerships">Research partnerships</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://global-partnerships.uq.edu.au/partnerships" data-gtm-label="Partners and community > Teaching and exchange collaborations">Teaching and exchange collaborations</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://employability.uq.edu.au/work-experience" data-gtm-label="Partners and community > Student work placements and internships">Student work placements and internships</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/initiatives/2032-games" data-gtm-label="Partners and community > Office of 2032 Games Engagement">Office of 2032 Games Engagement</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Community engagement</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://alumni.uq.edu.au/" data-gtm-label="Partners and community > Alumni">Alumni</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://alumni.uq.edu.au/giving" data-gtm-label="Partners and community > Giving and philanthropy">Giving and philanthropy</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://alumni.uq.edu.au/volunteer" data-gtm-label="Partners and community > Volunteering">Volunteering</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://study.uq.edu.au/information-resources/teachers-guidance-counsellors" data-gtm-label="Partners and community > High school engagement">High school engagement</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://indigenous-engagement.uq.edu.au" data-gtm-label="Partners and community > Indigenous engagement">Indigenous engagement</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://partners-community.uq.edu.au/sponsorships" data-gtm-label="Partners and community > Sponsorships and brand partnerships">Sponsorships and brand partnerships</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/initiatives/queensland-commitment" data-gtm-label="Partners and community > The Queensland Commitment">The Queensland Commitment</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Our facilities</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://partners-community.uq.edu.au/arts" data-gtm-label="Partners and community > Arts and culture">Arts and culture</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://campuses.uq.edu.au" data-gtm-label="Partners and community > Explore our campuses">Explore our campuses</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://campuses.uq.edu.au/information-and-services/shops" data-gtm-label="Partners and community > Services and shops">Services and shops</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/sport-recreation-precinct" data-gtm-label="Partners and community > Sport and recreation facilities">Sport and recreation facilities</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/venues" data-gtm-label="Partners and community > Venue hire and event spaces">Venue hire and event spaces</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link--has-dropdown" href="https://about.uq.edu.au/" data-gtm-label="About">About</a>
                        <div class="uq-header__megamenu">
                            <div class="uq-header__megamenu-container">
                                <a href="https://about.uq.edu.au/" class="megamenu__overview-link" data-gtm-label="About > About overview">About overview</a>
                                <div class="megamenu__row">
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Our profile</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/university-profile" data-gtm-label="About > Introducing UQ">Introducing UQ</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/strategic-plan" data-gtm-label="About > Vision, values and strategy">Vision, values and strategy</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://teaching-learning.uq.edu.au/" data-gtm-label="About > Teaching and learning">Teaching and learning</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/initiatives" data-gtm-label="About > Strategic initiatives and projects">Strategic initiatives and projects</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/governance-and-organisational-structure" data-gtm-label="About > Governance and organisational structure">Governance and organisational structure</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://policies.uq.edu.au" data-gtm-label="About > Policies and procedures">Policies and procedures</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/faculties-schools-institutes-centres" data-gtm-label="About > Faculties, schools, institutes and centres">Faculties, schools, institutes and centres</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Campuses and facilities</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://campuses.uq.edu.au/" data-gtm-label="About > Campuses, maps and transport">Campuses, maps and transport</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://my.uq.edu.au/student-support/accommodation" data-gtm-label="About > Colleges and accommodation">Colleges and accommodation</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://campuses.uq.edu.au/information-and-services/shops" data-gtm-label="About > Community facilities and services">Community facilities and services</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://about.uq.edu.au/venues" data-gtm-label="About > Venue hire and event spaces">Venue hire and event spaces</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="megamenu__column">
                                        <div class="megamenu__heading">Working at UQ</div>
                                        <div class="megamenu__menu">
                                            <ul>
                                                <li data-gtm-category="Main navigation"><a href="https://careers.uq.edu.au/" data-gtm-label="About > Careers at UQ">Careers at UQ</a></li>
                                                <li data-gtm-category="Main navigation"><a href="https://careers.uq.edu.au/search-jobs" data-gtm-label="About > Jobs search">Jobs search</a></li>
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
        <ul>
            <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
                <a class="uq-header__newglobal-nav-link slide-menu__control" href="https://study.uq.edu.au/">Study</a>
                <ul>
                    <li>
                        <a href="https://study.uq.edu.au/" data-gtm-label="Study > Study overview">Study overview</a>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Study with us</a>
                        <ul>
                            <li><a href="https://study.uq.edu.au/study-options/programs" data-gtm-label="Study > Find a course or program">Find a course or program</a></li>
                            <li><a href="https://study.uq.edu.au/study-options/browse-study-areas" data-gtm-label="Study > Browse study areas">Browse study areas</a></li>
                            <li><a href="https://study.uq.edu.au/study-options" data-gtm-label="Study > Study options">Study options</a></li>
                            <li><a href="https://study.uq.edu.au/short-courses" data-gtm-label="Study > Short courses">Short courses</a></li>
                            <li><a href="https://study.uq.edu.au/admissions" data-gtm-label="Study > How to apply">How to apply</a></li>
                            <li><a href="https://scholarships.uq.edu.au/" data-gtm-label="Study > Scholarships">Scholarships</a></li>
                            <li><a href="https://my.uq.edu.au/starting-at-uq" data-gtm-label="Study > Starting at UQ">Starting at UQ</a></li>
                            <li><a href="https://study.uq.edu.au/contact" data-gtm-label="Study > Contact">Contact</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Discover UQ</a>
                        <ul>
                            <li><a href="https://study.uq.edu.au/why-choose-uq" data-gtm-label="Study > Why choose UQ">Why choose UQ</a></li>
                            <li><a href="https://study.uq.edu.au/enhance-your-employability" data-gtm-label="Study > Enhance your employability">Enhance your employability</a></li>
                            <li><a href="https://study.uq.edu.au/university-life" data-gtm-label="Study > Life at UQ and accommodation">Life at UQ and accommodation</a></li>
                            <li><a href="https://campuses.uq.edu.au/" data-gtm-label="Study > Campuses, maps and transport">Campuses, maps and transport</a></li>
                            <li><a href="https://study.uq.edu.au/events" data-gtm-label="Study > Events for prospective students">Events for prospective students</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Information for</a>
                        <ul>
                            <li><a href="https://study.uq.edu.au/information-resources/international-students" data-gtm-label="Study > International students">International students</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/high-school-students" data-gtm-label="Study > High school students">High school students</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/non-school-leavers" data-gtm-label="Study > Non-school leavers">Non-school leavers</a></li>
                            <li><a href="https://study.uq.edu.au/study-options/phd-mphil-professional-doctorate" data-gtm-label="Study > PhD, MPhil and professional doctorate students">PhD, MPhil and professional doctorate students</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/aboriginal-torres-strait-islander-students" data-gtm-label="Study > Aboriginal and Torres Strait Islander students">Aboriginal and Torres Strait Islander students</a></li>
                            <li><a href="https://study.uq.edu.au/study-options/study-abroad" data-gtm-label="Study > Study abroad and exchange students">Study abroad and exchange students</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/teachers-guidance-counsellors" data-gtm-label="Study > Teachers and guidance counsellors">Teachers and guidance counsellors</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/parents-guardians" data-gtm-label="Study > Parents and guardians">Parents and guardians</a></li>
                            <li><a href="https://my.uq.edu.au/" data-gtm-label="Study > Current students">Current students</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
                <a class="uq-header__newglobal-nav-link slide-menu__control" href="https://research.uq.edu.au/">Research</a>
                <ul>
                    <li>
                        <a href="https://research.uq.edu.au/" data-gtm-label="Research > Research overview">Research overview</a>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Our research</a>
                        <ul>
                            <li><a href="https://research.uq.edu.au/strategy" data-gtm-label="Research > Strategy and impact">Strategy and impact</a></li>
                            <li><a href="https://research.uq.edu.au/research-capabilities" data-gtm-label="Research > Research capabilities">Research capabilities</a></li>
                            <li><a href="https://research.uq.edu.au/facilities" data-gtm-label="Research > Facilities and infrastructure">Facilities and infrastructure</a></li>
                            <li><a href="https://research.uq.edu.au/ethics-integrity" data-gtm-label="Research > Ethics and integrity">Ethics and integrity</a></li>
                            <li><a href="https://research.uq.edu.au/supporting-researchers" data-gtm-label="Research > Supporting our researchers">Supporting our researchers</a></li>
                            <li><a href="https://uq.edu.au/research/news" data-gtm-label="Research > News">News</a></li>
                            <li><a href="https://about.uq.edu.au/experts" data-gtm-label="Research > Find an expert">Find an expert</a></li>
                            <li><a href="https://research.uq.edu.au/contact" data-gtm-label="Research > Contact">Contact</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Graduate research</a>
                        <ul>
                            <li><a href="https://research.uq.edu.au/graduate-research" data-gtm-label="Research > About Graduate School">About Graduate School</a></li>
                            <li><a href="https://study.uq.edu.au/study-options/phd-mphil-professional-doctorate" data-gtm-label="Research > PhD, MPhil and professional doctorate">PhD, MPhil and professional doctorate</a></li>
                            <li><a href="https://about.uq.edu.au/experts" data-gtm-label="Research > Find a supervisor">Find a supervisor</a></li>
                            <li><a href="https://study.uq.edu.au/admissions/phd-mphil-professional-doctorate" data-gtm-label="Research > How to apply">How to apply</a></li>
                            <li><a href="https://my.uq.edu.au/information-and-services/higher-degree-research" data-gtm-label="Research > Current students">Current students</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Partner with us</a>
                        <ul>
                            <li><a href="https://research.uq.edu.au/partner" data-gtm-label="Research > About partnerships">About partnerships</a></li>
                            <li><a href="https://research.uq.edu.au/partner/industry" data-gtm-label="Research > Industry portfolios">Industry portfolios</a></li>
                            <li><a href="https://research.uq.edu.au/partner/ways-to-partner" data-gtm-label="Research > Ways to partner">Ways to partner</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
                <a class="uq-header__newglobal-nav-link slide-menu__control" href="https://partners-community.uq.edu.au">Partners and community</a>
                <ul>
                    <li>
                        <a href="https://partners-community.uq.edu.au" data-gtm-label="Partners and community > Partners and community overview">Partners and community overview</a>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Industry partnerships</a>
                        <ul>
                            <li><a href="https://research.uq.edu.au/partner" data-gtm-label="Partners and community > Research partnerships">Research partnerships</a></li>
                            <li><a href="https://global-partnerships.uq.edu.au/partnerships" data-gtm-label="Partners and community > Teaching and exchange collaborations">Teaching and exchange collaborations</a></li>
                            <li><a href="https://employability.uq.edu.au/work-experience" data-gtm-label="Partners and community > Student work placements and internships">Student work placements and internships</a></li>
                            <li><a href="https://about.uq.edu.au/initiatives/2032-games" data-gtm-label="Partners and community > Office of 2032 Games Engagement">Office of 2032 Games Engagement</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Community engagement</a>
                        <ul>
                            <li><a href="https://alumni.uq.edu.au/" data-gtm-label="Partners and community > Alumni">Alumni</a></li>
                            <li><a href="https://alumni.uq.edu.au/giving" data-gtm-label="Partners and community > Giving and philanthropy">Giving and philanthropy</a></li>
                            <li><a href="https://alumni.uq.edu.au/volunteer" data-gtm-label="Partners and community > Volunteering">Volunteering</a></li>
                            <li><a href="https://study.uq.edu.au/information-resources/teachers-guidance-counsellors" data-gtm-label="Partners and community > High school engagement">High school engagement</a></li>
                            <li><a href="https://indigenous-engagement.uq.edu.au" data-gtm-label="Partners and community > Indigenous engagement">Indigenous engagement</a></li>
                            <li><a href="https://partners-community.uq.edu.au/sponsorships" data-gtm-label="Partners and community > Sponsorships and brand partnerships">Sponsorships and brand partnerships</a></li>
                            <li><a href="https://about.uq.edu.au/initiatives/queensland-commitment" data-gtm-label="Partners and community > The Queensland Commitment">The Queensland Commitment</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Our facilities</a>
                        <ul>
                            <li><a href="https://partners-community.uq.edu.au/arts" data-gtm-label="Partners and community > Arts and culture">Arts and culture</a></li>
                            <li><a href="https://campuses.uq.edu.au" data-gtm-label="Partners and community > Explore our campuses">Explore our campuses</a></li>
                            <li><a href="https://campuses.uq.edu.au/information-and-services/shops" data-gtm-label="Partners and community > Services and shops">Services and shops</a></li>
                            <li><a href="https://about.uq.edu.au/sport-recreation-precinct" data-gtm-label="Partners and community > Sport and recreation facilities">Sport and recreation facilities</a></li>
                            <li><a href="https://about.uq.edu.au/venues" data-gtm-label="Partners and community > Venue hire and event spaces">Venue hire and event spaces</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
                <a class="uq-header__newglobal-nav-link slide-menu__control" href="https://about.uq.edu.au/">About</a>
                <ul>
                    <li>
                        <a href="https://about.uq.edu.au/" data-gtm-label="About > About overview">About overview</a>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Our profile</a>
                        <ul>
                            <li><a href="https://about.uq.edu.au/university-profile" data-gtm-label="About > Introducing UQ">Introducing UQ</a></li>
                            <li><a href="https://about.uq.edu.au/strategic-plan" data-gtm-label="About > Vision, values and strategy">Vision, values and strategy</a></li>
                            <li><a href="https://teaching-learning.uq.edu.au/" data-gtm-label="About > Teaching and learning">Teaching and learning</a></li>
                            <li><a href="https://about.uq.edu.au/initiatives" data-gtm-label="About > Strategic initiatives and projects">Strategic initiatives and projects</a></li>
                            <li><a href="https://about.uq.edu.au/governance-and-organisational-structure" data-gtm-label="About > Governance and organisational structure">Governance and organisational structure</a></li>
                            <li><a href="https://policies.uq.edu.au" data-gtm-label="About > Policies and procedures">Policies and procedures</a></li>
                            <li><a href="https://about.uq.edu.au/faculties-schools-institutes-centres" data-gtm-label="About > Faculties, schools, institutes and centres">Faculties, schools, institutes and centres</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Campuses and facilities</a>
                        <ul>
                            <li><a href="https://campuses.uq.edu.au/" data-gtm-label="About > Campuses, maps and transport">Campuses, maps and transport</a></li>
                            <li><a href="https://my.uq.edu.au/student-support/accommodation" data-gtm-label="About > Colleges and accommodation">Colleges and accommodation</a></li>
                            <li><a href="https://campuses.uq.edu.au/information-and-services/shops" data-gtm-label="About > Community facilities and services">Community facilities and services</a></li>
                            <li><a href="https://about.uq.edu.au/venues" data-gtm-label="About > Venue hire and event spaces">Venue hire and event spaces</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control">Working at UQ</a>
                        <ul>
                            <li><a href="https://careers.uq.edu.au/" data-gtm-label="About > Careers at UQ">Careers at UQ</a></li>
                            <li><a href="https://careers.uq.edu.au/search-jobs" data-gtm-label="About > Jobs search">Jobs search</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                <a class="uq-header__nav-secondary-link" href="https://www.uq.edu.au/">UQ home</a>
            </li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                <a class="uq-header__nav-secondary-link" href="https://www.uq.edu.au/news/">News</a>
            </li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                <a class="uq-header__nav-secondary-link" href="https://www.uq.edu.au/uq-events">Events</a>
            </li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                <a class="uq-header__nav-secondary-link" href="https://alumni.uq.edu.au/giving/">Give</a>
            </li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                <a class="uq-header__nav-secondary-link" href="https://contacts.uq.edu.au/contacts">Contact</a>
            </li>
        </ul>
    </nav>
    <div class="uq-header__search" data-gtm-category="Search">
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

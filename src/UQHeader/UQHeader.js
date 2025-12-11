import styles from './css/main.css';
import overrides from './css/overrides.css';
import { sendClickToGTM } from '../helpers/gtmHelpers';

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
            data-target="global-mobile-nav" data-action="toggle" data-gtm-action="Toggle" data-gtm-trigger="click"
            aria-haspopup="true" aria-expanded="false" aria-controls="uq-site-header__navigation-container">
              Menu
            </button>
        </div>
        <div class="uq-header__logo" data-testid="uq-header-logo" data-analyticsid="uq-header-logo" data-gtm-category="Primary header">
            <a class="logo--large" href="https://uq.edu.au" data-gtm-label="UQ Logo" data-testid="uq-header-logo-large-link" data-analyticsid="uq-header-logo-large-link">
                <img alt="The University of Queensland" src="https://static.uq.net.au/v11/logos/corporate/uq-logo--reversed.svg">
            </a>
        </div>
        <div class="uq-header__nav-primary" data-gtm-category="Primary header" data-testid="uq-header-primary-nav" data-analyticsid="uq-header-primary-nav">
            <nav class="uq-header__nav-primary-container" aria-label="primary navigation">
                <ul class="uq-header__nav-primary-list">
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link" href="https://study.uq.edu.au" data-gtm-label="Study" data-analyticsid="uq-header-primary-study">Study</a>
                    </li>
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link" href="https://research.uq.edu.au" data-gtm-label="Research" data-analyticsid="uq-header-primary-research">Research</a>
                    </li>
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link" href="https://partners-community.uq.edu.au" data-gtm-label="Partners and community" data-analyticsid="uq-header-primary-partners">Partners and community</a>
                    </li>
                    <li class="uq-header__nav-primary-item"><a class="uq-header__nav-primary-link nav-primary-link" href="https://about.uq.edu.au" data-gtm-label="About" data-analyticsid="uq-header-primary-about">About</a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="uq-header__search-toggle" data-gtm-category="Search">
            <button class="nav-primary__toggle nav-primary__search-toggle" id="uq-header-search-button" 
                data-testid="uq-header-search-button" data-analyticsid="uq-header-search-button" data-gtm-action="Toggle"
                aria-haspopup="true" aria-expanded="false" aria-controls="uq-header_search_panel" aria-labelledby="search-toggle__label">
                <div id="search-toggle__label" class="search-toggle__label">Search</div>
            </button>
        </div>
    </div>
    <nav class="slide-menu global-mobile-nav" id="global-mobile-nav" aria-label="primary navigation mobile" style="left: 0px; right: auto; transform: translateX(-100%); display: block;">
        <ul>
          <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
            <a class="uq-header__newglobal-nav-link slide-menu__control gtm-processed" href="https://study.uq.edu.au" data-analyticsid="uq-header-mobile-study">Study<span class="slide-menu__decorator"> </span></a>
              <ul>
                <li><a class="slide-menu__backlink slide-menu__control" data-action="back"> Study</a></li>
                <li><a href="https://study.uq.edu.au" data-gtm-label="Study > Study overview" class="gtm-processed" data-analyticsid="uq-header-mobile-study-overview">Study overview</a></li>
                <li><a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed">Study with us<span class="slide-menu__decorator"> </span></a>
                  <ul>
                    <li><a class="slide-menu__backlink slide-menu__control" data-action="back" data-analyticsid="uq-header-mobile-study-with-us"> Study with us</a></li>
                    <li><a href="https://study.uq.edu.au/study-options/programs" data-gtm-label="Study > Find a course or program" class="gtm-processed" data-analyticsid="uq-header-mobile-find-course">Find a course or program</a></li>
                    <li><a href="https://study.uq.edu.au/study-options/browse-study-areas" data-gtm-label="Study > Browse study areas" class="gtm-processed" data-analyticsid="uq-header-mobile-browser-areas">Browse study areas</a></li>
                    <li><a href="https://study.uq.edu.au/study-options" data-gtm-label="Study > Study options" class="gtm-processed" data-analyticsid="uq-header-mobile-study-options">Study options</a></li>
                    <li><a href="https://study.uq.edu.au/short-courses" data-gtm-label="Study > Short courses" class="gtm-processed" data-analyticsid="uq-header-mobile-short-courses">Short courses</a></li>
                    <li><a href="https://study.uq.edu.au/admissions" data-gtm-label="Study > How to apply" class="gtm-processed" data-analyticsid="uq-header-mobile-how-to-apply">How to apply</a></li>
                    <li><a href="https://scholarships.uq.edu.au" data-gtm-label="Study > Scholarships" class="gtm-processed" data-analyticsid="uq-header-mobile-scholarships">Scholarships</a></li>
                    <li><a href="https://my.uq.edu.au/starting-at-uq" data-gtm-label="Study > Starting at UQ" class="gtm-processed" data-analyticsid="uq-header-mobile-starting">Starting at UQ</a></li>
                    <li><a href="https://study.uq.edu.au/contact" data-gtm-label="Study > Contact" class="gtm-processed" data-analyticsid="uq-header-mobile-contact">Contact</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed" data-analyticsid="uq-header-mobile-discover">Discover UQ<span class="slide-menu__decorator"> </span></a>
                  <ul>
                    <li><a class="slide-menu__backlink slide-menu__control" data-action="back" data-analyticsid="uq-header-mobile-discover"> Discover UQ</a></li>
                    <li><a href="https://study.uq.edu.au/why-choose-uq" data-gtm-label="Study > Why choose UQ" class="gtm-processed" data-analyticsid="uq-header-mobile-discover-why">Why choose UQ</a></li>
                    <li><a href="https://study.uq.edu.au/enhance-your-employability" data-gtm-label="Study > Enhance your employability" class="gtm-processed" data-analyticsid="uq-header-mobile-discover-enhance">Enhance your employability</a></li>
                    <li><a href="https://study.uq.edu.au/university-life" data-gtm-label="Study > Life at UQ and accommodation" class="gtm-processed" data-analyticsid="uq-header-mobile-discover-life">Life at UQ and accommodation</a></li>
                    <li><a href="https://campuses.uq.edu.au" data-gtm-label="Study > Campuses, maps and transport" class="gtm-processed" data-analyticsid="uq-header-mobile-discover-maps">Campuses, maps and transport</a></li>
                    <li><a href="https://study.uq.edu.au/events" data-gtm-label="Study > Events for prospective students" class="gtm-processed" data-analyticsid="uq-header-mobile-discover-events">Events for prospective students</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed">Information for<span class="slide-menu__decorator"> </span></a>
                  <ul>
                      <li><a class="slide-menu__backlink slide-menu__control" data-action="back"> Information for</a></li>
                      <li><a href="https://study.uq.edu.au/information-resources/international-students" data-gtm-label="Study > International students" class="gtm-processed" data-analyticsid="uq-header-mobile-information-international">International students</a></li>
                      <li><a href="https://study.uq.edu.au/information-resources/high-school-students" data-gtm-label="Study > High school students" class="gtm-processed" data-analyticsid="uq-header-mobile-information-highschool"">High school students</a></li>
                      <li><a href="https://study.uq.edu.au/information-resources/non-school-leavers" data-gtm-label="Study > Non-school leavers" class="gtm-processed" data-analyticsid="uq-header-mobile-information-nonschool"">Non-school leavers</a></li>
                      <li><a href="https://study.uq.edu.au/study-options/phd-mphil-professional-doctorate" data-gtm-label="Study > PhD, MPhil and professional doctorate students" class="gtm-processed" data-analyticsid="uq-header-mobile-information-postgrad"">PhD, MPhil and professional doctorate students</a></li>
                      <li><a href="https://study.uq.edu.au/information-resources/aboriginal-torres-strait-islander-students" data-gtm-label="Study > Aboriginal and Torres Strait Islander students" class="gtm-processed" data-analyticsid="uq-header-mobile-information-aboriginal">Aboriginal and Torres Strait Islander students</a></li>
                      <li><a href="https://study.uq.edu.au/study-options/study-abroad" data-gtm-label="Study > Study abroad and exchange students" class="gtm-processed" data-analyticsid="uq-header-mobile-information-abroad">Study abroad and exchange students</a></li>
                      <li><a href="https://study.uq.edu.au/information-resources/teachers-guidance-counsellors" data-gtm-label="Study > Teachers and guidance counsellors" class="gtm-processed" data-analyticsid="uq-header-mobile-information-teachers">Teachers and guidance counsellors</a></li>
                      <li><a href="https://study.uq.edu.au/information-resources/parents-guardians" data-gtm-label="Study > Parents and guardians" class="gtm-processed" data-analyticsid="uq-header-mobile-information-parents">Parents and guardians</a></li>
                      <li><a href="https://my.uq.edu.au" data-gtm-label="Study > Current students" class="gtm-processed" data-analyticsid="uq-header-mobile-information-current">Current students</a></li>
                  </ul>
                </li>
            </ul>
          </li>
          <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
            <a class="uq-header__newglobal-nav-link slide-menu__control gtm-processed" href="https://research.uq.edu.au">Research<span class="slide-menu__decorator"> </span></a>
            <ul>
                <li><a class="slide-menu__backlink slide-menu__control" data-action="back"> Research</a></li>
                <li><a href="https://research.uq.edu.au" data-gtm-label="Research > Research overview" class="gtm-processed">Research overview</a></li>
                <li><a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed">Our research<span class="slide-menu__decorator"> </span></a>
                    <ul>
                        <li><a class="slide-menu__backlink slide-menu__control" data-action="back" data-analyticsid="uq-header-mobile-research-overview-our"> Our research</a></li>
                        <li><a href="https://research.uq.edu.au/strategy" data-gtm-label="Research > Strategy and impact" class="gtm-processed" data-analyticsid="uq-header-mobile-research-overview-strategy">Strategy and impact</a></li>
                        <li><a href="https://research.uq.edu.au/research-capabilities" data-gtm-label="Research > Research capabilities" class="gtm-processed" data-analyticsid="uq-header-mobile-research-overview-capabilities">Research capabilities</a></li>
                        <li><a href="https://research.uq.edu.au/facilities" data-gtm-label="Research > Facilities and infrastructure" class="gtm-processed" data-analyticsid="uq-header-mobile-research-overview-facilities">Facilities and infrastructure</a></li>
                        <li><a href="https://research.uq.edu.au/ethics-integrity" data-gtm-label="Research > Ethics and integrity" class="gtm-processed" data-analyticsid="uq-header-mobile-research-overview-ethics">Ethics and integrity</a></li>
                        <li><a href="https://research.uq.edu.au/supporting-researchers" data-gtm-label="Research > Supporting our researchers" class="gtm-processed" data-analyticsid="uq-header-mobile-research-overview-support">Supporting our researchers</a></li>
                        <li><a href="https://uq.edu.au/research/news" data-gtm-label="Research > News" class="gtm-processed" data-analyticsid="uq-header-mobile-research-overview-news">News</a></li>
                        <li><a href="https://about.uq.edu.au/experts" data-gtm-label="Research > Find an expert" class="gtm-processed" data-analyticsid="uq-header-mobile-research-overview-expert">Find an expert</a></li>
                        <li><a href="https://research.uq.edu.au/contact" data-gtm-label="Research > Contact" class="gtm-processed" data-analyticsid="uq-header-mobile-research-overview-contact">Contact</a></li>
                    </ul>
                </li>
                <li>
                  <a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed" data-analyticsid="uq-header-mobile-research-graduate">Graduate research<span class="slide-menu__decorator"> </span></a>
                  <ul>
                    <li><a class="slide-menu__backlink slide-menu__control" data-action="back"> Graduate research</a></li>
                      <li><a href="https://research.uq.edu.au/graduate-research" data-gtm-label="Research > About Graduate School" class="gtm-processed" data-analyticsid="uq-header-mobile-research-graduate-about">About Graduate School</a></li>
                      <li><a href="https://study.uq.edu.au/study-options/phd-mphil-professional-doctorate" data-gtm-label="Research > PhD, MPhil and professional doctorate" class="gtm-processed" data-analyticsid="uq-header-mobile-research-graduate-postgrad">PhD, MPhil and professional doctorate</a></li>
                      <li><a href="https://about.uq.edu.au/experts" data-gtm-label="Research > Find a supervisor" class="gtm-processed" data-analyticsid="uq-header-mobile-research-graduate-supervisor">Find a supervisor</a></li>
                      <li><a href="https://study.uq.edu.au/admissions/phd-mphil-professional-doctorate" data-gtm-label="Research > How to apply" class="gtm-processed" data-analyticsid="uq-header-mobile-research-graduate-how">How to apply</a></li>
                      <li><a href="https://my.uq.edu.au/information-and-services/higher-degree-research" data-gtm-label="Research > Current students" class="gtm-processed" data-analyticsid="uq-header-mobile-research-graduate-current">Current students</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed" data-analyticsid="uq-header-mobile-research-partner">Partner with us<span class="slide-menu__decorator"> </span></a>
                  <ul>
                    <li><a class="slide-menu__backlink slide-menu__control" data-action="back"> Partner with us</a></li>
                    <li><a href="https://research.uq.edu.au/partner" data-gtm-label="Research > About partnerships" class="gtm-processed" data-analyticsid="uq-header-mobile-research-partner-about">About partnerships</a></li>
                    <li><a href="https://research.uq.edu.au/partner/industry" data-gtm-label="Research > Industry portfolios" class="gtm-processed" data-analyticsid="uq-header-mobile-research-partner-industry">Industry portfolios</a></li>
                    <li><a href="https://research.uq.edu.au/partner/ways-to-partner" data-gtm-label="Research > Ways to partner" class="gtm-processed" data-analyticsid="uq-header-mobile-research-partner-ways">Ways to partner</a></li>
                  </ul>
                </li>
            </ul>
          </li>
          <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
            <a class="uq-header__newglobal-nav-link slide-menu__control gtm-processed" href="https://partners-community.uq.edu.au" data-analyticsid="uq-header-mobile-partner">Partners and community<span class="slide-menu__decorator"> </span></a>
              <ul>
                <li><a class="slide-menu__backlink slide-menu__control" data-action="back"> Partners and community</a></li>
                <li><a href="https://partners-community.uq.edu.au" data-gtm-label="Partners and community > Partners and community overview" class="gtm-processed">Partners and community overview</a></li>
                <li>
                  <a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed" data-analyticsid="uq-header-mobile-partner-industry">Industry partnerships<span class="slide-menu__decorator"> </span></a>
                  <ul>
                      <li><a class="slide-menu__backlink slide-menu__control" data-action="back" data-analyticsid="uq-header-mobile-partner-industry"> Industry partnerships</a></li>
                      <li><a href="https://research.uq.edu.au/partner" data-gtm-label="Partners and community > Research partnerships" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-industry-partnership">Research partnerships</a></li>
                      <li><a href="https://global-partnerships.uq.edu.au/partnerships" data-gtm-label="Partners and community > Teaching and exchange collaborations" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-industry-teaching">Teaching and exchange collaborations</a></li>
                      <li><a href="https://employability.uq.edu.au/work-experience" data-gtm-label="Partners and community > Student work placements and internships" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-industry-placement">Student work placements and internships</a></li>
                      <li><a href="https://about.uq.edu.au/initiatives/2032-games" data-gtm-label="Partners and community > Office of 2032 Games Engagement" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-industry-2032">Office of 2032 Games Engagement</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed" data-analyticsid="uq-header-mobile-partner-community">Community engagement<span class="slide-menu__decorator"> </span></a>
                  <ul>
                      <li><a class="slide-menu__backlink slide-menu__control" data-action="back" data-analyticsid="uq-header-mobile-partner-community"> Community engagement</a></li>
                      <li><a href="https://alumni.uq.edu.au" data-gtm-label="Partners and community > Alumni" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-community-alumni">Alumni</a></li>
                      <li><a href="https://alumni.uq.edu.au/giving" data-gtm-label="Partners and community > Giving and philanthropy" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-community-giving">Giving and philanthropy</a></li>
                      <li><a href="https://alumni.uq.edu.au/volunteer" data-gtm-label="Partners and community > Volunteering" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-community-alumni">Volunteering</a></li>
                      <li><a href="https://study.uq.edu.au/information-resources/teachers-guidance-counsellors" data-gtm-label="Partners and community > High school engagement" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-community-highschool">High school engagement</a></li>
                      <li><a href="https://indigenous-engagement.uq.edu.au" data-gtm-label="Partners and community > Indigenous engagement" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-community-indigenous">Indigenous engagement</a></li>
                      <li><a href="https://partners-community.uq.edu.au/sponsorships" data-gtm-label="Partners and community > Sponsorships and brand partnerships" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-community-sponsorships">Sponsorships and brand partnerships</a></li>
                      <li><a href="https://about.uq.edu.au/initiatives/queensland-commitment" data-gtm-label="Partners and community > The Queensland Commitment" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-community-commitment">The Queensland Commitment</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed" data-analyticsid="uq-header-mobile-partner-facilities">Our facilities<span class="slide-menu__decorator"> </span></a>
                  <ul>
                    <li><a class="slide-menu__backlink slide-menu__control" data-action="back" data-analyticsid="uq-header-mobile-partner-facilities"> Our facilities</a></li>
                    <li><a href="https://partners-community.uq.edu.au/arts" data-gtm-label="Partners and community > Arts and culture" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-facilities-arts">Arts and culture</a></li>
                    <li><a href="https://campuses.uq.edu.au" data-gtm-label="Partners and community > Explore our campuses" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-facilities-explore">Explore our campuses</a></li>
                    <li><a href="https://campuses.uq.edu.au/information-and-services/shops" data-gtm-label="Partners and community > Services and shops" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-facilities-services">Services and shops</a></li>
                    <li><a href="https://about.uq.edu.au/sport-recreation-precinct" data-gtm-label="Partners and community > Sport and recreation facilities" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-facilities-sport">Sport and recreation facilities</a></li>
                    <li><a href="https://about.uq.edu.au/venues" data-gtm-label="Partners and community > Venue hire and event spaces" class="gtm-processed" data-analyticsid="uq-header-mobile-partner-facilities-venue">Venue hire and event spaces</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li class="uq-header__newglobal-nav-item" data-gtm-category="Primary header">
                <a class="uq-header__newglobal-nav-link slide-menu__control gtm-processed" href="https://about.uq.edu.au" data-analyticsid="uq-header-mobile-about">About<span class="slide-menu__decorator"> </span></a>
                  <ul>
                    <li><a class="slide-menu__backlink slide-menu__control" data-action="back"> About</a></li>
                    <li><a href="https://about.uq.edu.au" data-gtm-label="About > About overview" class="gtm-processed" data-analyticsid="uq-header-mobile-about-overview">About overview</a></li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed">Our University<span class="slide-menu__decorator"> </span></a>
                        <ul>
                          <li><a class="slide-menu__backlink slide-menu__control" data-action="back" data-analyticsid="uq-header-mobile-about-intro"> Our University</a></li>
                          <li><a href="https://about.uq.edu.au/profile-rankings" data-gtm-label="About > Profile and rankings" class="gtm-processed" data-analyticsid="uq-header-mobile-about-Profile">Profile and rankings</a></li>
                          <li><a href="https://about.uq.edu.au/strategy-values" data-gtm-label="About > Strategy and values" class="gtm-processed" data-analyticsid="uq-header-mobile-about-Strategy">Strategy and values</a></li>
                          <li><a href="https://about.uq.edu.au/strategy-values/strategic-plan/domains/teaching-learning-student-experience" data-gtm-label="About > Learning, teaching and student experience" class="gtm-processed" data-analyticsid="uq-header-mobile-about-Learning">Learning, teaching and student experience</a></li>
                          <li><a href="https://about.uq.edu.au/leadership-governance" data-gtm-label="About > Leadership and governance" class="gtm-processed" data-analyticsid="uq-header-mobile-about-Leadership">Leadership and governance</a></li>
                          <li><a href="https://about.uq.edu.au/faculties-schools-institutes-centres" data-gtm-label="About > Faculties, schools, centres and institutes" class="gtm-processed" data-analyticsid="uq-header-mobile-about-Faculties">Faculties, schools, centres and institutes</a></li>
                          <li><a href="https://about.uq.edu.au/experts" data-gtm-label="About > Find an expert" class="gtm-processed" data-analyticsid="uq-header-mobile-about-Find">Find an expert</a></li>
                          <li><a href="https://policies.uq.edu.au" data-gtm-label="About > Policies and procedures" class="gtm-processed" data-analyticsid="uq-header-mobile-about-policies">Policies and procedures</a></li>
                      </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed" data-analyticsid="uq-header-mobile-about-campuses">Campuses and facilities<span class="slide-menu__decorator"> </span></a>
                        <ul>
                          <li><a class="slide-menu__backlink slide-menu__control" data-action="back" data-analyticsid="uq-header-mobile-about-campuses2"> Campuses and facilities</a></li>
                          <li><a href="https://campuses.uq.edu.au" data-gtm-label="About > Our campuses" class="gtm-processed" data-analyticsid="uq-header-mobile-about-campuses">Our campuses</a></li>
                          <li><a href="https://campuses.uq.edu.au/information-and-services/parking-transport" data-gtm-label="About > Parking and transport" class="gtm-processed" data-analyticsid="uq-header-mobile-about-Parking">Parking and transport</a></li>
                          <li><a href="https://campuses.uq.edu.au/information-and-services/shops" data-gtm-label="About > Facilities and services" class="gtm-processed" data-analyticsid="uq-header-mobile-about-Facilities">Facilities and services</a></li>
                          <li><a href="https://about.uq.edu.au/venues" data-gtm-label="About > Venue hire and event spaces" class="gtm-processed" data-analyticsid="uq-header-mobile-about-venue">Venue hire and event spaces</a></li>
                      </ul>
                    </li>
                    <li>
                        <a href="#" class="global-mobile-nav__audience-link slide-menu__control gtm-processed" data-analyticsid="uq-header-mobile-working">Working with us<span class="slide-menu__decorator"> </span></a>
                        <ul>
                          <li><a class="slide-menu__backlink slide-menu__control" data-action="back" data-analyticsid="uq-header-mobile-working2"> Working with us</a></li>
                          <li><a href="https://about.uq.edu.au/careers" data-gtm-label="About > Careers and job search" class="gtm-processed" data-analyticsid="uq-header-mobile-working-careers">Careers and job search</a></li>
                          <li><a href="https://about.uq.edu.au/careers/why-work-uq" data-gtm-label="About > Why work at UQ" class="gtm-processed" data-analyticsid="uq-header-mobile-working-why">Why work at UQ</a></li>
                          <li><a href="https://about.uq.edu.au/careers/equity-diversity-inclusion" data-gtm-label="About > Equity, diversity and inclusion" class="gtm-processed" data-analyticsid="uq-header-mobile-working-Equity">Equity, diversity and inclusion</a></li>
                      </ul>
                    </li>
                  </ul>
            </li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header"><a class="uq-header__nav-secondary-link gtm-processed" href="https://uq.edu.au" data-analyticsid="uq-header-mobile-top-home">UQ home</a></li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header"><a class="uq-header__nav-secondary-link gtm-processed" href="https://news.uq.edu.au" data-analyticsid="uq-header-mobile-top-news">News</a></li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header"><a class="uq-header__nav-secondary-link gtm-processed" href="https://uq.edu.au/uq-events" data-analyticsid="uq-header-mobile-top-events">Events</a></li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header"><a class="uq-header__nav-secondary-link gtm-processed" href="https://alumni.uq.edu.au/giving" data-analyticsid="uq-header-mobile-top-give">Give</a></li>
            <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header"><a class="uq-header__nav-secondary-link gtm-processed" href="https://contacts.uq.edu.au/contacts" data-analyticsid="uq-header-mobile-top-contact">Contact</a></li>
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
                    <a href="https://uq.edu.au" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-logo-small-link">UQ home</a>
                </li>
                <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                    <a href="https://news.uq.edu.au" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-news-link">News</a>
                </li>
                <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                    <a href="https://uq.edu.au/uq-events" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-events-link">Events</a>
                </li>
                <li class="uq-header__nav-secondary-item" data-gtm-category="Secondary header">
                    <a href="https://alumni.uq.edu.au/giving" class="uq-header__nav-secondary-link" data-analyticsid="uq-header-giving-link">Give</a>
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
        !!template && !!shadowDOM && shadowDOM.appendChild(template.content.cloneNode(true));

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
                    window.location.hostname === 'localhost' &&
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

        const links = shadowDOM.querySelectorAll('a');
        !!links && links.length > 0 && links.forEach((l) => l.addEventListener('click', (e) => sendClickToGTM(e)));

        const buttons = shadowDOM.querySelectorAll('button');
        !!buttons &&
            buttons.length > 0 &&
            buttons.forEach((b) => b.addEventListener('click', (e) => sendClickToGTM(e)));
    }
}

export default UQHeader;

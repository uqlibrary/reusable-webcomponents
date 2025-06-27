import mainStyles from './css/main.css';
import globalStyles from './css/global-oneuq.css';
import overrides from './css/overrides.css';
import { default as navLocale } from './js/nav';
import { linkToDrupal } from '../helpers/access';

const template = document.createElement('template');
template.innerHTML = `
  <style>${mainStyles.toString()}</style>
  <style>${globalStyles.toString()}</style>
  <style>${overrides.toString()}</style>
  <footer id="footer" class="uq-footer" data-gtm-category="Footer">
    <div class="uq-acknowledgement uq-acknowledgement--large">
        <div class="uq-acknowledgement__content">
          <div class="uq-acknowledgement__text">
              UQ acknowledges the Traditional Owners and their custodianship of the lands on which UQ is situated. &mdash; <a href="https://about.uq.edu.au/reconciliation" class="uq-acknowledgement__link" data-testid="footer-acknowledgement-link">Reconciliation at UQ</a>
          </div>
        </div>
    </div>
    <div class="uq-footer__container">
        <nav id="footer-desktop-nav" data-testid="footer-desktop-nav" class="uq-footer__navigation uq-footer--desktop" aria-label="footer navigation">
            <ul class="uq-footer__navigation-list uq-footer__navigation-level-1">
                <li class="uq-footer__navigation-item uq-footer__navigation--is-open">
                    <h2 class="uq-footer__navigation-title">Media</h2>
                    <ul class="uq-footer__navigation-list uq-footer__navigation-level-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.uq.edu.au/news/contacts" class="uq-footer__navigation-link">Media team contacts</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://researchers.uq.edu.au/uqexperts" class="uq-footer__navigation-link">Find a subject matter expert</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.uq.edu.au/news/" class="uq-footer__navigation-link">UQ news</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-footer__navigation-item uq-footer__navigation--is-open">
                    <h2 class="uq-footer__navigation-title">Working at UQ</h2>
                    <ul class="uq-footer__navigation-list uq-footer__navigation-level-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au" class="uq-footer__navigation-link">Current staff</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/careers" class="uq-footer__navigation-link">Careers at UQ</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/strategic-plan" class="uq-footer__navigation-link">Strategic plan</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au/information-and-services/health-safety-wellbeing" class="uq-footer__navigation-link">Staff support</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au/information-and-services/information-technology/it-support" class="uq-footer__navigation-link">IT support for staff</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-footer__navigation-item uq-footer__navigation--is-open">
                    <h2 class="uq-footer__navigation-title">Current students</h2>
                    <ul class="uq-footer__navigation-list uq-footer__navigation-level-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au" class="uq-footer__navigation-link">my.UQ</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au/programs-courses" class="uq-footer__navigation-link">Programs and courses</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.uq.edu.au/events/calendar_view.php?category_id=16" class="uq-footer__navigation-link">Key dates</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au/student-support" class="uq-footer__navigation-link">Student support</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au/information-and-services/information-technology/student-it-support" class="uq-footer__navigation-link">IT support for students</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-footer__navigation-item uq-footer__navigation--is-open">
                    <h2 class="uq-footer__navigation-title">Library</h2>
                    <ul class="uq-footer__navigation-list uq-footer__navigation-level-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.library.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-homepage-desktop">Library</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="${linkToDrupal(
                                '/study-and-learning-support',
                            )}" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-locations-desktop">Study and learning support</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="${linkToDrupal(
                                '/research-and-publish',
                            )}" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-services-desktop">Research and publish</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="${linkToDrupal(
                                '/visit',
                            )}" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-research-desktop">Visit</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-footer__navigation-item uq-footer__navigation--is-open">
                    <h2 class="uq-footer__navigation-title">Contact</h2>
                    <ul class="uq-footer__navigation-list uq-footer__navigation-level-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://contacts.uq.edu.au/contacts" class="uq-footer__navigation-link">Contact UQ</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.uq.edu.au/complaints-appeals/" class="uq-footer__navigation-link">Make a complaint</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/faculties-schools-institutes-centres" class="uq-footer__navigation-link">Faculties, schools, institutes and centres</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.uq.edu.au/departments/" class="uq-footer__navigation-link">Divisions and departments</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://campuses.uq.edu.au" class="uq-footer__navigation-link">Campuses, maps and transport</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>

        <nav id="footer-mobile-nav" data-testid="footer-mobile-nav" class="uq-footer__navigation uq-footer--mobile" aria-label="footer navigation mobile">
            <ul class="uq-accordion uq-footer__navigation-list uq-footer__navigation-level-1">
                <li class="uq-accordion__item uq-footer__navigation-item" id="menu-toggle-0" data-testid="menu-toggle-0">
                    <button class="uq-accordion__toggle uq-footer__navigation-toggle" data-testid="button-menu-toggle-0" data-analyticsid="button-menu-toggle-0" id="button-menu-toggle-0">Media</button>
                    <ul class="uq-accordion__content uq-footer__navigation-list uq-footer__navigation-level-2" data-testid="mobile-child-list-0">
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.uq.edu.au/news/contacts" class="uq-footer__navigation-link">Media team contacts</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://researchers.uq.edu.au/uqexperts" class="uq-footer__navigation-link">Find a subject matter expert</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.uq.edu.au/news/" class="uq-footer__navigation-link">UQ news</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-accordion__item uq-footer__navigation-item" id="menu-toggle-1" data-testid="menu-toggle-1">
                    <button class="uq-accordion__toggle uq-footer__navigation-toggle" data-testid="button-menu-toggle-1" data-analyticsid="button-menu-toggle-1" id="button-menu-toggle-1">Working at UQ</button>
                    <ul class="uq-accordion__content uq-footer__navigation-list uq-footer__navigation-level-2" data-testid="mobile-child-list-1">
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au" class="uq-footer__navigation-link">Current staff</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://careers.uq.edu.au" class="uq-footer__navigation-link">Careers at UQ</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/strategic-plan" class="uq-footer__navigation-link">Strategic plan</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au/information-and-services/health-safety-wellbeing" class="uq-footer__navigation-link">Staff support</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au/information-and-services/information-technology/it-support" class="uq-footer__navigation-link">IT support for staff</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-accordion__item uq-footer__navigation-item" id="menu-toggle-2" data-testid="menu-toggle-2">
                    <button class="uq-accordion__toggle uq-footer__navigation-toggle" data-testid="button-menu-toggle-2" data-analyticsid="button-menu-toggle-2" id="button-menu-toggle-2">Current students</button>
                    <ul class="uq-accordion__content uq-footer__navigation-list uq-footer__navigation-level-2" data-testid="mobile-child-list-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au/" class="uq-footer__navigation-link">my.UQ</a>
                            </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au/programs-courses/" class="uq-footer__navigation-link">Programs and courses</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.uq.edu.au/events/calendar_view.php?category_id=16" class="uq-footer__navigation-link">Key dates</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au/student-support" class="uq-footer__navigation-link">Student support</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au/information-and-services/information-technology/student-it-support" class="uq-footer__navigation-link">IT support for students</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-accordion__item uq-footer__navigation-item" id="menu-toggle-3" data-testid="menu-toggle-3">
                    <button class="uq-accordion__toggle uq-footer__navigation-toggle" data-testid="button-menu-toggle-3" data-analyticsid="button-menu-toggle-3" id="button-menu-toggle-3">Library</button>
                    <ul class="uq-accordion__content uq-footer__navigation-list uq-footer__navigation-level-2" data-testid="mobile-child-list-3">
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.library.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-homepage-mobile">Library</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="${linkToDrupal(
                                '/visit',
                            )}" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-locations-mobile">Locations and hours</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="${linkToDrupal(
                                '/library-services',
                            )}" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-services-mobile">Library services</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="${linkToDrupal(
                                '/research-and-publish',
                            )}" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-research-mobile">Research tools</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-accordion__item uq-footer__navigation-item" id="menu-toggle-4" data-testid="menu-toggle-4">
                    <button class="uq-accordion__toggle uq-footer__navigation-toggle" data-testid="button-menu-toggle-4" data-analyticsid="button-menu-toggle-4" id="button-menu-toggle-4">Contact</button>
                    <ul class="uq-accordion__content uq-footer__navigation-list uq-footer__navigation-level-2" data-testid="mobile-child-list-4">
                        <li class="uq-footer__navigation-item">
                            <a href="https://contacts.uq.edu.au/contacts" class="uq-footer__navigation-link">Contact UQ</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.uq.edu.au/complaints-appeals/" class="uq-footer__navigation-link">Make a complaint</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/faculties-schools-institutes-centres" class="uq-footer__navigation-link">Faculties, schools, institutes and centres</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.uq.edu.au/departments/" class="uq-footer__navigation-link">Divisions and departments</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://campuses.uq.edu.au" class="uq-footer__navigation-link">Campuses, maps and transport</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
        <!-- Footer contact details -->
        <div class="uq-footer__contact">
          <nav class="uq-footer__contact-item" aria-label="Social Media" data-gtm-category="Social share link">
            <ul class="uq-footer__footer-list uq-footer__contact-social">
              <li class="uq-footer__footer-item"><a href="https://www.facebook.com/uniofqld" class="uq-footer__meta-icons--facebook uq-footer__meta-icons" aria-label="Facebook" data-gtm-label="Facebook"></a></li>
              <li class="uq-footer__footer-item"><a href="https://www.linkedin.com/school/university-of-queensland" class="uq-footer__meta-icons--linkedin uq-footer__meta-icons" data-gtm-label="Linkedin" aria-label="Linkedin"></a></li>
              <li class="uq-footer__footer-item"><a href="https://twitter.com/uq_news" class="uq-footer__meta-icons--twitter uq-footer__meta-icons" data-gtm-label="X" aria-label="X"></a></li>
              <li class="uq-footer__footer-item"><a href="https://www.youtube.com/user/universityqueensland" class="uq-footer__meta-icons--youtube uq-footer__meta-icons" data-gtm-label="Youtube" aria-label="Youtube"></a></li>
              <li class="uq-footer__footer-item"><a href="https://instagram.com/uniofqld" class="uq-footer__meta-icons--instagram uq-footer__meta-icons" data-gtm-label="Instagram" aria-label="Instagram"></a></li>
              <li class="uq-footer__footer-item"><a href="https://www.tiktok.com/@uniofqld" class="uq-footer__meta-icons--tiktok uq-footer__meta-icons" data-gtm-label="TikTok" aria-label="TikTok"></a></li>          
            </ul>
          </nav>

        </div>
        <nav class="uq-footer__meta" aria-label="Business meta">
          <ul class="uq-footer__footer-list">
            <li class="uq-footer__footer-item">&copy; The University of Queensland</li>
            <li class="uq-footer__footer-item"><abbr title="Australian Business Number">ABN</abbr>: 63 942 912 684 </li>
            <li class="uq-footer__footer-item"><abbr title="Commonwealth Register of Institutions and Courses for Overseas Students">CRICOS</abbr>: <a class="uq-footer__link" href="https://www.uq.edu.au/about/cricos-link" rel="external">00025B</a></li>
            <li class="uq-footer__footer-item"><abbr title="Tertiary Education Quality and Standards Agency">TEQSA</abbr>: <a class="uq-footer__link" href="https://www.teqsa.gov.au/national-register/provider/university-queensland" rel="external" data-gtm-label="TEQSA PRV12080">PRV12080</a></li>
          </ul>
        </nav>
        <nav class="uq-footer__footer" aria-label="Terms and conditions">
          <ul class="uq-footer__footer-list">
              <li class="uq-footer__footer-item">
                  <a href="https://www.uq.edu.au/legal/copyright-privacy-disclaimer/" class="uq-footer__link">Copyright, privacy and disclaimer</a>
              </li>
              <li class="uq-footer__footer-item">
                <a href="https://uq.edu.au/accessibility/" class="uq-footer__link">Accessibility</a>
              </li>
              <li class="uq-footer__footer-item">
                  <a href="https://governance-risk.uq.edu.au/rtip" class="uq-footer__link">Right to information</a>
              </li>
              <li class="uq-footer__footer-menu__item">
                <a href="https://my.uq.edu.au/feedback?r=${encodeURIComponent(
                    window.location.href,
                )}" class="uq-footer__link">Feedback</a>
              </li>
          </ul>
        </nav>
    </div>
</footer>
`;

let initCalled;

class UQFooter extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        this.addButtonListeners(shadowDOM); // always after template rendered!!

        // Bindings
        this.addButtonListeners = this.addButtonListeners.bind(this);
    }

    addButtonListeners(shadowDOM) {
        const toggleMenuItem = (index) => {
            const elementId = `menu-toggle-${index}`;
            // control the open-close of the footer menu that is collapse-expandable in mobile view
            const listLeader = shadowDOM.getElementById(elementId);

            if (!listLeader) {
                return;
            }

            const button = listLeader.querySelector('button');
            const ul = listLeader.querySelector('ul');

            // max-height value is an arbitrary number that should be larger than all menus, used to make transition fire
            const displayedHeightMenuItem = 'height:auto;max-height:400px';
            if (listLeader.className.match(/uq-accordion__item--is-open/)) {
                // close the menu item
                listLeader.classList.remove('uq-accordion__item--is-open');
                !!button && button.classList.remove('uq-accordion__toggle--active');
                !!ul && ul.classList.remove('uq-accordion__content--active');
                !!ul && ul.removeAttribute('style');
                !!ul && ul.setAttribute('aria-hidden', 'true');
            } else {
                // first close any currently open menu item
                const openItem = shadowDOM.querySelector('.uq-accordion__item--is-open');
                !!openItem && openItem.classList.remove('uq-accordion__item--is-open');
                const buttonOpen = shadowDOM.querySelector('.uq-accordion__toggle--active');
                !!buttonOpen && buttonOpen.classList.remove('uq-accordion__toggle--active');
                const ulOpen = shadowDOM.querySelector('.uq-accordion__content--active');
                !!ulOpen && ulOpen.classList.remove('uq-accordion__content--active');
                !!ulOpen && ulOpen.removeAttribute('style');
                !!ulOpen && ulOpen.setAttribute('aria-hidden', 'true');

                // open the requested menu item
                listLeader.classList.add('uq-accordion__item--is-open');
                !!button && button.classList.add('uq-accordion__toggle--active');
                !!ul && ul.classList.add('uq-accordion__content--active');
                !!ul && ul.setAttribute('style', displayedHeightMenuItem);
                !!ul && ul.setAttribute('aria-hidden', 'false');
            }
        };

        navLocale.forEach((unused, index) => {
            const buttonId = `button-menu-toggle-${index}`;
            let button = shadowDOM.getElementById(buttonId);
            !!button &&
                button.addEventListener('click', function clickFooterButton() {
                    toggleMenuItem(index);
                });
        });
    }
}

export default UQFooter;

import mainStyles from './css/main.css';
import globalStyles from './css/global-oneuq.css';
import overrides from './css/overrides.css';
import { default as navLocale } from './js/nav';
import { linkToDrupal } from '../helpers/access';
import { sendClickToGTM } from '../helpers/gtmHelpers';

const template = document.createElement('template');

const footerLinkToGuidesAdmin = `
    <div class="uq-footer__contact-item uq-footer__contact-login">
        <a href="https://uq.libapps.com/libapps/login.php?site_id=731" class="uq-footer__link gtm-processed" rel="nofollow noopener" data-testid="footer-guides-login">Guides login</a>
    </div>`;
const isGuidesProductionPage = document.location.hostname === 'guides.library.uq.edu.au';
const guideLoginLink = isGuidesProductionPage ? footerLinkToGuidesAdmin : '';

template.innerHTML = `
  <style>${mainStyles.toString()}</style>
  <style>${globalStyles.toString()}</style>
  <style>${overrides.toString()}</style>
  <footer id="footer" class="uq-footer" data-gtm-category="Footer" data-testid="uq-footer">
    <div class="uq-acknowledgement uq-acknowledgement--large" data-testid="uq-footer-acknowledgement">
        <div class="uq-acknowledgement__content">
          <div class="uq-acknowledgement__text" data-testid="uq-acknowledgement__text">
            UQ acknowledges the Traditional Owners and their custodianship of the lands on which UQ is situated. <a href="https://about.uq.edu.au/strategy-values/reconciliation" class="uq-acknowledgement__link gtm-processed" data-testid="footer-acknowledgement-link">Reconciliation at UQ</a>
          </div>
        </div>
    </div>
    <div class="uq-footer__container">
        <nav id="footer-desktop-nav" data-testid="footer-desktop-nav" class="uq-footer__navigation uq-footer--desktop" aria-label="footer navigation">
            <ul class="uq-footer__navigation-list uq-footer__navigation-level-1">
                <li class="uq-footer__navigation-item uq-footer__navigation--is-open" data-testid="footer-navigation-block-1">
                    <h2 class="uq-footer__navigation-title" data-testid="uq-footer__navigation-title--media">Media</h2>
                    <ul class="uq-footer__navigation-list uq-footer__navigation-level-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://news.uq.edu.au/contact" class="uq-footer__navigation-link" data-analyticsid="uqfooter-media-team-desktop">Media team contacts</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/experts" class="uq-footer__navigation-link" data-analyticsid="uqfooter-media-expert-desktop">Find a subject matter expert</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://news.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-media-news-desktop">UQ news</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-footer__navigation-item uq-footer__navigation--is-open" data-testid="footer-navigation-block-2">
                    <h2 class="uq-footer__navigation-title">Working with us</h2>
                    <ul class="uq-footer__navigation-list uq-footer__navigation-level-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-working-current-desktop">Current staff</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/careers" class="uq-footer__navigation-link">Careers and job search</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/strategy-values/strategic-plan" class="uq-footer__navigation-link" data-analyticsid="uqfooter-working-strategic-desktop">Strategic plan</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au/information-and-services/health-safety-wellbeing" class="uq-footer__navigation-link" data-analyticsid="uqfooter-working-support-desktop">Staff support</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au/information-and-services/information-technology/it-support" class="uq-footer__navigation-link" data-analyticsid="uqfooter-working-it-desktop">IT support for staff</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-footer__navigation-item uq-footer__navigation--is-open" data-testid="footer-navigation-block-3">
                    <h2 class="uq-footer__navigation-title">Current students</h2>
                    <ul class="uq-footer__navigation-list uq-footer__navigation-level-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-students-my-desktop">my.UQ</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://programs-courses.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-students-courses-desktop">Programs and courses</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/academic-calendar" class="uq-footer__navigation-link" data-analyticsid="uqfooter-students-dates-desktop">Academic calendar</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au/student-support" class="uq-footer__navigation-link" data-analyticsid="uqfooter-students-support-desktop">Student support</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au/information-and-services/information-technology/student-it-support" class="uq-footer__navigation-link" data-analyticsid="uqfooter-students-it-desktop">IT support for students</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-footer__navigation-item uq-footer__navigation--is-open" data-testid="footer-navigation-block-4">
                    <h2 class="uq-footer__navigation-title">Library</h2>
                    <ul class="uq-footer__navigation-list uq-footer__navigation-level-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://www.library.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-homepage-desktop" data-testid="uqfooter-nav-library-homepage-desktop">Library</a>
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
                <li class="uq-footer__navigation-item uq-footer__navigation--is-open" data-testid="footer-navigation-block-5">
                    <h2 class="uq-footer__navigation-title">Contact</h2>
                    <ul class="uq-footer__navigation-list uq-footer__navigation-level-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://contacts.uq.edu.au/contacts" class="uq-footer__navigation-link" data-analyticsid="uqfooter-contact-uq-desktop">Contact UQ</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://uq.edu.au/complaints-appeals" class="uq-footer__navigation-link" data-analyticsid="uqfooter-contact-complaint-desktop">Make a complaint</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/faculties-schools-institutes-centres" class="uq-footer__navigation-link" data-analyticsid="uqfooter-contact-schools-desktop">Faculties, schools, institutes and centres</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://uq.edu.au/departments" class="uq-footer__navigation-link" data-analyticsid="uqfooter-contact-divisions-desktop">Divisions and departments</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://campuses.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-contact-campuses-desktop">Campuses, maps and transport</a>
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
                            <a href="https://news.uq.edu.au/contact" class="uq-footer__navigation-link" data-analyticsid="uqfooter-media-team-mobile">Media team contacts</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/experts" class="uq-footer__navigation-link" data-analyticsid="uqfooter-media-expert-mobile">Find a subject matter expert</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://news.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-media-news-mobile">UQ news</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-accordion__item uq-footer__navigation-item" id="menu-toggle-1" data-testid="menu-toggle-1">
                    <button class="uq-accordion__toggle uq-footer__navigation-toggle" data-testid="button-menu-toggle-1" data-analyticsid="button-menu-toggle-1" id="button-menu-toggle-1">Working with us</button>
                    <ul class="uq-accordion__content uq-footer__navigation-list uq-footer__navigation-level-2" data-testid="mobile-child-list-1">
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-working-current-mobile">Current staff</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/careers" class="uq-footer__navigation-link" data-analyticsid="uqfooter-working-careers-mobile">Careers and job search</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/strategy-values/strategic-plan" class="uq-footer__navigation-link" data-analyticsid="uqfooter-working-strategic-mobile">Strategic plan</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au/information-and-services/health-safety-wellbeing" class="uq-footer__navigation-link" data-analyticsid="uqfooter-working-support-mobile">Staff support</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://staff.uq.edu.au/information-and-services/information-technology/it-support" class="uq-footer__navigation-link" data-analyticsid="uqfooter-working-it-mobile">IT support for staff</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-accordion__item uq-footer__navigation-item" id="menu-toggle-2" data-testid="menu-toggle-2">
                    <button class="uq-accordion__toggle uq-footer__navigation-toggle" data-testid="button-menu-toggle-2" data-analyticsid="button-menu-toggle-2" id="button-menu-toggle-2">Current students</button>
                    <ul class="uq-accordion__content uq-footer__navigation-list uq-footer__navigation-level-2" data-testid="mobile-child-list-2">
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-students-my-mobile">my.UQ</a>
                            </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://programs-courses.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-students-courses-mobile">Programs and courses</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/academic-calendar" class="uq-footer__navigation-link" data-analyticsid="uqfooter-students-dates-mobile">Academic calendar</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au/student-support" class="uq-footer__navigation-link" data-analyticsid="uqfooter-students-support-mobile">Student support</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://my.uq.edu.au/information-and-services/information-technology/student-it-support" class="uq-footer__navigation-link" data-analyticsid="uqfooter-students-it-mobile">IT support for students</a>
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
                                '/study-and-learning-support',
                            )}" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-services-mobile">Study and learning support</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="${linkToDrupal(
                                '/research-and-publish',
                            )}" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-research-mobile">Research and publish</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="${linkToDrupal(
                                '/visit',
                            )}" class="uq-footer__navigation-link" data-analyticsid="uqfooter-nav-library-locations-mobile">Visit</a>
                        </li>
                    </ul>
                </li>
                <li class="uq-accordion__item uq-footer__navigation-item" id="menu-toggle-4" data-testid="menu-toggle-4">
                    <button class="uq-accordion__toggle uq-footer__navigation-toggle" data-testid="button-menu-toggle-4" data-analyticsid="button-menu-toggle-4" id="button-menu-toggle-4">Contact</button>
                    <ul class="uq-accordion__content uq-footer__navigation-list uq-footer__navigation-level-2" data-testid="mobile-child-list-4">
                        <li class="uq-footer__navigation-item">
                            <a href="https://contacts.uq.edu.au/contacts" class="uq-footer__navigation-link" data-analyticsid="uqfooter-contact-uq-mobile">Contact UQ</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://uq.edu.au/complaints-appeals" class="uq-footer__navigation-link" data-analyticsid="uqfooter-contact-complaint-mobile">Make a complaint</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://about.uq.edu.au/faculties-schools-institutes-centres" class="uq-footer__navigation-link" data-analyticsid="uqfooter-contact-schools-mobile">Faculties, schools, institutes and centres</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://uq.edu.au/departments" class="uq-footer__navigation-link" data-analyticsid="uqfooter-contact-divisions-mobile">Divisions and departments</a>
                        </li>
                        <li class="uq-footer__navigation-item">
                            <a href="https://campuses.uq.edu.au" class="uq-footer__navigation-link" data-analyticsid="uqfooter-contact-campuses-mobile">Campuses, maps and transport</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
        <!-- Footer contact details -->
        <div class="uq-footer__contact">
          <nav class="uq-footer__contact-item" aria-label="Social Media" data-gtm-category="Social share link">
            <ul class="uq-footer__footer-list uq-footer__contact-social">
              <li class="uq-footer__footer-item"><a href="https://www.facebook.com/uniofqld" class="uq-footer__meta-icons--facebook uq-footer__meta-icons" data-gtm-label="Facebook" aria-label="Facebook" data-analyticsid="uqfooter-facebook" data-testid="uqfooter-facebook"></a></li>
              <li class="uq-footer__footer-item"><a href="https://www.linkedin.com/school/university-of-queensland" class="uq-footer__meta-icons--linkedin uq-footer__meta-icons" data-gtm-label="Linkedin" aria-label="Linkedin"data-analyticsid="uqfooter-linkedin"></a></li>
              <li class="uq-footer__footer-item"><a href="https://x.com/uq_news" class="uq-footer__meta-icons--twitter uq-footer__meta-icons" data-gtm-label="X" aria-label="X" data-analyticsid="uqfooter-twitter"></a></li>
              <li class="uq-footer__footer-item"><a href="https://www.youtube.com/user/universityqueensland" class="uq-footer__meta-icons--youtube uq-footer__meta-icons" data-gtm-label="Youtube" aria-label="Youtube" data-analyticsid="uqfooter-youtube"></a></li>
              <li class="uq-footer__footer-item"><a href="https://instagram.com/uniofqld" class="uq-footer__meta-icons--instagram uq-footer__meta-icons" data-gtm-label="Instagram" aria-label="Instagram" data-analyticsid="uqfooter-insta"></a></li>
              <li class="uq-footer__footer-item"><a href="https://www.tiktok.com/@uniofqld" class="uq-footer__meta-icons--tiktok uq-footer__meta-icons" data-gtm-label="TikTok" aria-label="TikTok" data-analyticsid="uqfooter-tiktok"></a></li>        
            </ul>
          </nav>
          ${guideLoginLink}
      
    </div>
        <nav class="uq-footer__meta" aria-label="Business meta">
          <ul class="uq-footer__footer-list">
            <li class="uq-footer__footer-item">&copy; The University of Queensland</li>
            <li class="uq-footer__footer-item"><abbr title="Australian Business Number">ABN</abbr>: <a class="uq-footer__link gtm-processed" href="https://abr.business.gov.au/ABN/View?id=63942912684" rel="external" data-gtm-label="ABN">63 942 912 684</a> </li>
            <li class="uq-footer__footer-item"><abbr title="Commonwealth Register of Institutions and Courses for Overseas Students">CRICOS</abbr>: <a class="uq-footer__link" href="https://about.uq.edu.au/cricos-link" rel="external" data-gtm-label="CRICOS 00025B">00025B</a></li>
            <li class="uq-footer__footer-item"><abbr title="Tertiary Education Quality and Standards Agency">TEQSA</abbr>: <a data-analyticsid="uqfooter-teqsa" class="uq-footer__link" href="https://about.uq.edu.au/teqsa-link" rel="external" data-gtm-label="TEQSA PRV12080">PRV12080</a></li>
          </ul>
        </nav>
        <nav class="uq-footer__footer" aria-label="Terms and conditions">
          <ul class="uq-footer__footer-list">
              <li class="uq-footer__footer-item">
                  <a href="https://uq.edu.au/legal/copyright-privacy-disclaimer" class="uq-footer__link" data-analyticsid="uqfooter-privacy">Copyright, privacy and disclaimer</a>
              </li>
              <li class="uq-footer__footer-item">
                <a href="https://uq.edu.au/accessibility" class="uq-footer__link" data-analyticsid="uqfooter-accessibility">Accessibility</a>
              </li>
              <li class="uq-footer__footer-item">
                  <a href="https://governance-risk.uq.edu.au/rtip" class="uq-footer__link" data-analyticsid="uqfooter-RIO">Right to information</a>
              </li>
              <li class="uq-footer__footer-menu__item">
                <a href="https://my.uq.edu.au/feedback?r=${encodeURIComponent(
                    window.location.href,
                )}" class="uq-footer__link" data-analyticsid="uqfooter-feedback">Feedback</a>
              </li>
          </ul>
        </nav>
    </div>
</footer>
`;

class UQFooter extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        !!template && !!shadowDOM && shadowDOM.appendChild(template.content.cloneNode(true));

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

        const links = shadowDOM.querySelectorAll('a');
        !!links && links.length > 0 && links.forEach((l) => l.addEventListener('click', (e) => sendClickToGTM(e)));

        const buttons = shadowDOM.querySelectorAll('button');
        !!buttons &&
            buttons.length > 0 &&
            buttons.forEach((b) => b.addEventListener('click', (e) => sendClickToGTM(e)));
    }
}

export default UQFooter;

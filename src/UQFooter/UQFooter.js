import styles from './css/main.css';
import overrides from './css/overrides.css';
import { default as navLocale } from './js/nav';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles.toString()}</style>
  <style>${overrides.toString()}</style>
  <footer id="footer" class="uq-footer" data-gtm-category="Footer">
      <div class="uq-footer__reconciliation">
        <div class="uq-footer__acknowledgement">
          <img class="uq-footer__acknowledgement-flag" alt="Australian Aboriginal Flag" src="https://static.uq.net.au/v15/images/rap/aboriginal.svg">
          <img class="uq-footer__acknowledgement-flag" alt="Torres Strait Islander Flag" src="https://static.uq.net.au/v15/images/rap/torres-strait-islanders.svg">
          <span class="uq-footer__acknowledgement-text">
            UQ acknowledges the Traditional Owners and their custodianship of the lands on which UQ is situated. &mdash;
            <a href="https://about.uq.edu.au/reconciliation" class="uq-footer__link">
                Reconciliation at UQ
            </a>
          </span>
        </div>
      </div>
      <div class="uq-footer__container">
        <nav id="footer-desktop-nav" data-testid="footer-desktop-nav" class="uq-footer__navigation uq-footer--desktop" aria-label="footer navigation"></nav>
        <nav id="footer-mobile-nav" data-testid="footer-mobile-nav" class="uq-footer__navigation uq-footer--mobile" aria-label="footer navigation mobile">
        </nav>
        <!-- Footer contact details -->
        <div class="uq-footer__contact">   
          <nav class="uq-footer__contact-item" aria-label="Social Media" data-gtm-category="Social share link">
            <ul class="uq-footer__footer-list uq-footer__contact-social"> 
              <li class="uq-footer__footer-item"><a href="https://www.facebook.com/uniofqld" class="uq-footer__meta-icons--facebook uq-footer__meta-icons" aria-label="Facebook" data-gtm-label="Facebook"></a></li> 
              <li class="uq-footer__footer-item"><a href="https://www.linkedin.com/school/university-of-queensland" class="uq-footer__meta-icons--linkedin uq-footer__meta-icons" aria-label="linkedin" data-gtm-label="Linkedin"></a></li> 
              <li class="uq-footer__footer-item"><a href="https://twitter.com/uq_news" class="uq-footer__meta-icons--twitter uq-footer__meta-icons" aria-label="Twitter" data-gtm-label="Twitter"></a></li>
              <li class="uq-footer__footer-item"><a href="https://www.youtube.com/user/universityqueensland" class="uq-footer__meta-icons--youtube uq-footer__meta-icons" aria-label="Youtube" data-gtm-label="Youtube"></a></li>
              <li class="uq-footer__footer-item"><a href="https://instagram.com/uniofqld" class="uq-footer__meta-icons--instagram uq-footer__meta-icons" aria-label="Instagram" data-gtm-label="Instagram"></a></li>
            </ul>
          </nav> 
       
        </div>
        <nav class="uq-footer__meta" aria-label="Business meta">
          <ul class="uq-footer__footer-list">
            <li class="uq-footer__footer-item">&copy; The University of Queensland</li>
            <li class="uq-footer__footer-item"><abbr title="Australian Business Number">ABN</abbr>: 63 942 912 684 </li>
            <li class="uq-footer__footer-item"><a class="uq-footer__link" href="https://www.uq.edu.au/about/cricos-link" rel="external" data-gtm-label="CRICOS 00025B"><abbr title="Commonwealth Register of Institutions and Courses for Overseas Students">CRICOS</abbr>: 00025B</a></li>
            <li class="uq-footer__footer-item"><abbr title="Tertiary Education Quality and Standards Agency">TEQSA</abbr>: <a class="uq-footer__link" href="https://www.teqsa.gov.au/national-register/provider/university-queensland" rel="external" data-gtm-label="TEQSA PRV12080">PRV12080</a></li>
          </ul>
        </nav>
        <nav class="uq-footer__footer" aria-label="Terms and conditions">
          <ul class="uq-footer__footer-list">
              <li class="uq-footer__footer-item">
                  <a href="https://www.uq.edu.au/legal/terms-of-use" class="uq-footer__link">Privacy and terms of use</a>
              </li>
              <li class="uq-footer__footer-item">
                <a href="https://uq.edu.au/accessibility" class="uq-footer__link">Accessibility</a>
              </li>
              <li class="uq-footer__footer-item">
                  <a href="https://www.uq.edu.au/rti" class="uq-footer__link">Right to information</a>
              </li>
              <li class="uq-footer__footer-item">
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

        this.loadDesktopFooterMenuFromJson();
        this.loadMobileFooterMenuFromJson();

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        this.addButtonListeners(shadowDOM); // always after template rendered!!

        // Bindings
        this.loadDesktopFooterMenuFromJson = this.loadDesktopFooterMenuFromJson.bind(this);
        this.loadMobileFooterMenuFromJson = this.loadMobileFooterMenuFromJson.bind(this);
        this.createNavLink = this.createNavLink.bind(this);
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

    createNavLink(href, linktext, datatestid = null) {
        const link = document.createElement('a');
        !!link && link.setAttribute('href', href);
        !!link && link.setAttribute('class', 'uq-footer__navigation-link');
        !!datatestid && !!link && link.setAttribute('data-analyticsid', datatestid);

        const textOfLink = document.createTextNode(linktext);
        !!link && !!textOfLink && link.appendChild(textOfLink);

        return link;
    }

    loadMobileFooterMenuFromJson() {
        const footerMenu = template.content.getElementById('footer-mobile-nav');

        const ul1 = document.createElement('ul');
        !!ul1 && ul1.setAttribute('class', 'uq-accordion uq-footer__navigation-list uq-footer__navigation-level-1');
        !!ul1 && !!footerMenu && footerMenu.appendChild(ul1);

        !!footerMenu &&
            navLocale.forEach((list, index) => {
                const li1 = document.createElement('li');
                const li1Class = 'uq-accordion__item uq-footer__navigation-item';
                !!li1 && li1.setAttribute('class', li1Class);
                const toggleId = `menu-toggle-${index}`;
                !!li1 && li1.setAttribute('id', toggleId);
                !!li1 && li1.setAttribute('data-testid', toggleId);
                !!li1 && !!ul1 && ul1.appendChild(li1);

                const h2Text = document.createTextNode(list.label);

                const mobileToggleButton = document.createElement('button');
                // apply classes on toggle
                !!mobileToggleButton &&
                    mobileToggleButton.setAttribute('class', 'uq-accordion__toggle uq-footer__navigation-toggle');
                !!h2Text && !!mobileToggleButton && mobileToggleButton.appendChild(h2Text);
                const buttonId = `button-${toggleId}`;
                !!mobileToggleButton && mobileToggleButton.setAttribute('data-testid', buttonId);
                !!mobileToggleButton && mobileToggleButton.setAttribute('data-analyticsid', buttonId);
                !!mobileToggleButton && mobileToggleButton.setAttribute('id', buttonId);
                !!mobileToggleButton && !!li1 && li1.appendChild(mobileToggleButton);

                const ul2 = document.createElement('ul');
                const ul2Class = 'uq-accordion__content uq-footer__navigation-list uq-footer__navigation-level-2';
                !!ul2 && ul2.setAttribute('class', ul2Class);
                !!ul2 && ul2.setAttribute('data-testid', `mobile-child-list-${index}`);
                !!ul2 && !!li1 && li1.appendChild(ul2);

                const invalidDiv = document.createElement('div');
                !!invalidDiv && !!ul2 && ul2.appendChild(invalidDiv);

                list?.list?.length > 0 &&
                    list.list.forEach((entry1) => {
                        const datatestid = !!entry1.dataTestid ? `${entry1.dataTestid}-mobile` : null;
                        const link = this.createNavLink(entry1.href, entry1.label, datatestid);

                        const li2 = document.createElement('li');
                        li2.setAttribute('class', 'uq-footer__navigation-item');
                        !!link && !!li2 && li2.appendChild(link);
                        !!li2 && !!invalidDiv && invalidDiv.appendChild(li2);
                    });
            });
    }

    /**
     * ITS built this with separate mobile and desktop html
     */
    loadDesktopFooterMenuFromJson() {
        const footerMenu = template.content.getElementById('footer-desktop-nav');

        const ul1 = document.createElement('ul');
        !!ul1 && ul1.setAttribute('class', 'uq-footer__navigation-list uq-footer__navigation-level-1');
        !!ul1 && !!footerMenu && footerMenu.appendChild(ul1);

        !!footerMenu &&
            navLocale?.length > 0 &&
            navLocale?.forEach((list, index) => {
                const li1 = document.createElement('li');
                !!li1 && li1.setAttribute('class', 'uq-footer__navigation-item uq-footer__navigation--is-open');
                !!li1 && !!ul1 && ul1.appendChild(li1);

                const h2Text = document.createTextNode(list.label);

                const h2 = document.createElement('h2');
                !!h2 && h2.setAttribute('class', 'uq-footer__navigation-title');
                !!h2Text && !!h2 && h2.appendChild(h2Text);
                !!h2 && !!li1 && li1.appendChild(h2);

                const ul2 = document.createElement('ul');
                !!ul2 && ul2.setAttribute('class', 'uq-footer__navigation-list uq-footer__navigation-level-2');
                !!ul2 && !!li1 && li1.appendChild(ul2);

                list?.list?.length > 0 &&
                    list.list.forEach((entry1) => {
                        const datatestid = !!entry1.dataTestid ? `${entry1.dataTestid}-desktop` : null;
                        const link = this.createNavLink(entry1.href, entry1.label, datatestid);

                        const li2 = document.createElement('li');
                        li2.setAttribute('class', 'uq-footer__navigation-item');
                        !!link && !!li2 && li2.appendChild(link);
                        !!li2 && !!ul2 && ul2.appendChild(li2);
                    });
            });
    }
}

export default UQFooter;

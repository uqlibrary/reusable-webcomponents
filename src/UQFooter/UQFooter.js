import styles from './css/main.css';
import icons from './css/icons.css';
import overrides from './css/overrides.css';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles.toString()}</style>
  <style>${icons.toString()}</style>
  <style>${overrides.toString()}</style>
  <footer data-testid="uq-footer" id="footer" class="uq-footer" data-gtm-category="Footer">
      <div class="uq-footer__container">
          <div class="uq-footer__acknowledgement">
              UQ acknowledges the Traditional Owners and their custodianship of the lands on which UQ is situated. &mdash; <a href="https://about.uq.edu.au/reconciliation" class="uq-footer__acknowledgement__link">Reconciliation statement</a>
          </div>

          <div class="uq-footer__row">
              <div class="uq-footer__column">
                  <div class="uq-footer__copyright">&copy; The University of Queensland</div>
                  <div class="uq-footer__contact">
                      Enquiries: <a href="tel:+61733651111" class="uq-footer__link footer__enquiries-phone" data-testid="uq-footer-enquiry" ><span itemprop="telephone">+61 7 3365 1111</span></a>&nbsp; | &nbsp;<a href="https://uq.edu.au/contacts" class="uq-footer__link footer__contacts-link" >Contact directory</a>
                  </div>
                  <div class="uq-footer__meta">
                      <abbr title="Australian Business Number">ABN</abbr>: 63 942 912 684 &nbsp; | &nbsp;
                      <abbr title="Commonwealth Register of Institutions and Courses for Overseas Students">CRICOS</abbr> Provider No: <a class="uq-footer__link cricos__link" data-testid="uq-footer-cricos-link" href="https://www.uq.edu.au/about/cricos-link" rel="external" >00025B</a>
                  </div>
              </div>
              <div class="uq-footer__column">
                  <div class="uq-footer__emergency-contact uq-footer__aside">
                          <strong class="uq-footer__sub-title">Emergency</strong><br> Phone: <a href="tel:+61733653333" class="uq-footer__link footer__emergency-phone" data-testid="uq-footer-emergency-link" >3365 3333</a>
                  </div>
              </div>
          </div>

          <div class="uq-footer__footer">
              <div class="uq-footer__row">
                  <div class="uq-footer__column">
                      <div class="uq-footer__footer-menu">
                          <ul class="uq-footer__footer-menu__list">
                              <li class="uq-footer__footer-menu__item">
                                  <a href="https://www.uq.edu.au/terms-of-use/" rel="external" class="uq-footer__footer-menu__link" data-testid="uq-footer-privacy-link">Privacy &amp; Terms of use</a>
                              </li>
                              <li class="uq-footer__footer-menu__item">
                                  <a href="https://www.uq.edu.au/rti/" rel="external" class="uq-footer__footer-menu__link" data-testid="uq-footer-righttoinfo-link" >Right to Information</a>
                              </li>
                              <li class="uq-footer__footer-menu__item">
                                  <a href="https://uq.edu.au/accessibility/" rel="external" class="uq-footer__footer-menu__link" data-testid="uq-footer-accessibility-link">Accessibility</a>
                              </li>
                              <li class="uq-footer__footer-menu__item">
                                  <a href="https://its.uq.edu.au/feedback?r=https://uq.edu.au" rel="external" class="uq-footer__footer-menu__link" data-testid="uq-footer-feedback-link" >Feedback</a>
                              </li>
                          </ul>
                      </div>
                  </div>
                  <div class="uq-footer__column" id="login-link">
                      <a href="" class="uq-footer__login-link uq-footer__aside" id="login-link-a" data-testid="login-link-a" rel="nofollow">Login</a>
                  </div>
              </div>
          </div>

      </div>
    </footer>
`;

let initCalled;

class UQFooter extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({mode: 'open'});

        const loginURL = this.getAttribute('loginurl');
        if (!loginURL) {
            const loginLink = template.content.getElementById('login-link');
            !!loginLink && loginLink.remove();
        } else {
            const link = template.content.getElementById('login-link-a');
            link.href = loginURL;
        }

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        // Bindings
        this.loadJS = this.loadJS.bind(this);
    }

    loadJS() {
        // This loads the external JS file into the HTML head dynamically
        //Only load js if it has not been loaded before (tracked by the initCalled flag)
        if (!initCalled) {
            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.defer = true;
            script.onload = function () {
                //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
                initCalled = true;
            };
            //Specify the location of the ITS DS JS file
            script.src = 'uq-footer.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    }

    connectedCallback() {
        this.loadJS();
    }
}

export default UQFooter;

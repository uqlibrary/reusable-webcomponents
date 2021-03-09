import styles from './css/main.css';
import icons from './css/icons.css';
import askusStyles from './css/askus.css';
import { askus } from './AskUs';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${icons.toString()}</style>
    <style>${askusStyles.toString()}</style>
    <link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v6/fonts/Roboto/roboto.css" />
    <link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v9/fonts/Merriweather/merriweather.css" />
    <link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v13/fonts/Montserrat/montserrat.css">
  <div class="uq-site-header">
      <!-- Site title and utility area with mobile nav toggler (JS) -->
      <div class="uq-site-header__title-container">
        <div class="uq-site-header__title-container__left">
          <a id="site-title" href="/" class="uq-site-header__title">Site title</a>
        </div>
        <div class="uq-site-header__title-container__right">
            <div id="askus"></div>
            <slot name="site-utilities"></slot>
          <button class="uq-site-header__navigation-toggle jsNavToggle">Menu</button>
        </div>
      </div>

      <!-- Navigation Menu  -->
      <div class="uq-site-header__navigation-container">
        <nav class="uq-site-header__navigation" id="jsNav">
          <ul class="uq-site-header__navigation__list
                     uq-site-header__navigation__list--level-1">
            <li class="uq-site-header__navigation__list-item
                       uq-site-header__navigation__list-item--has-subnav
                       uq-site-header__navigation__list-item--active">
              <a href="/study" aria-expanded="false">Study</a>
              <span class="uq-site-header__navigation__sub-toggle">Open</span>
              <ul class="uq-site-header__navigation__list
                         uq-site-header__navigation__list--level-2">
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/programs" aria-expanded="false">Find a program</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/agriculture-environment" aria-expanded="false">Agriculture and Environment</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/architecture-planning" aria-expanded="false">Architecture and Planning</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/arts-humanities-social-sciences" aria-expanded="false">Arts, Humanities and Social Sciences</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/business-economics" aria-expanded="false">Business and Economics</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/education" aria-expanded="false">Education</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/engineering-computing" aria-expanded="false">Engineering and Computing</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/health-behavioural-sciences" aria-expanded="false">Health and Behavioural Sciences</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/law" aria-expanded="false">Law</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/medicine" aria-expanded="false">Medicine</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/science-mathematics" aria-expanded="false"
                    >Science and Mathematics</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/study/micromasters-uqx" aria-expanded="false">MicroMasters and UQx</a>
                </li>
              </ul>
            </li>
            <li class="uq-site-header__navigation__list-item
                       uq-site-header__navigation__list-item--has-subnav">
              <a href="/admissions" aria-expanded="false">Admissions</a>
              <span class="uq-site-header__navigation__sub-toggle">Open</span>
              <ul class="uq-site-header__navigation__list
                         uq-site-header__navigation__list--level-2">
                <li class="uq-site-header__navigation__list-item">
                  <a href="/admissions/undergraduate" aria-expanded="false">Undergraduate</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/admissions/honours" aria-expanded="false">Honours</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/admissions/postgraduate-coursework" aria-expanded="false">Postgraduate coursework</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/admissions/higher-degree-research" aria-expanded="false">Higher degree by research</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/admissions/cross-institutional-study" aria-expanded="false">Cross-institutional study</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/admissions/non-award-study" aria-expanded="false">Non-award study</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/admissions/doctor-medicine" aria-expanded="false">Doctor of Medicine</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="https://www.uq.edu.au/studyabroad/how-to-apply" aria-expanded="false">Study abroad and incoming exchange</a>
                </li>
              </ul>
            </li>
            <li class="uq-site-header__navigation__list-item
                       uq-site-header__navigation__list-item--has-subnav">
              <a href="/university-life" aria-expanded="false">University life</a>
              <span class="uq-site-header__navigation__sub-toggle">Open</span>
              <ul class="uq-site-header__navigation__list
                         uq-site-header__navigation__list--level-2">
                <li class="uq-site-header__navigation__list-item">
                  <a href="/university-life/living-in-brisbane" aria-expanded="false">Living in Brisbane</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/university-life/getting-prepared-to-come-to-australia" aria-expanded="false">Getting prepared to come to Australia</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/university-life/campuses-research-sites" aria-expanded="false">Campuses and research sites</a>
                </li>
                <li class="uq-site-header__navigation__list-item">
                  <a href="/university-life/campus-tours" aria-expanded="false">Campus tours</a>
                </li>
              </ul>
            </li>
            <li class="uq-site-header__navigation__list-item">
              <a href="/events" aria-expanded="false">Events</a>
            </li>
            <li class="uq-site-header__navigation__list-item">
              <a href="/stories" aria-expanded="false">Stories</a>
            </li>
            <li class="uq-site-header__navigation__list-item">
              <a href="/contact-us" aria-expanded="false">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>  
  
`;

let initCalled;

class UQSiteHeader extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({mode: 'open'});


        // Handle the attributes for this component
        // // Set the title
        const siteTitle = this.getAttribute('siteTitle');
        if (!!siteTitle) {
            template.content.getElementById('site-title').innerHTML = siteTitle;
        }

        const hideAskUs = this.getAttribute('hideAskUs');
        if (hideAskUs === "true") {
            template.content.getElementById('askus').remove();
        } else {
            template.content.getElementById('askus').innerHTML = askus([
                {
                    icon: `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.41.21.75-.19.75-.45V6c-1.49-1.12-3.63-1.5-5.5-1.5zm3.5 14c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path></svg>`,
                    label: 'FAQ',
                    url: 'https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=loans&lang=en_US',
                },
                {
                    icon: `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.41.21.75-.19.75-.45V6c-1.49-1.12-3.63-1.5-5.5-1.5zm3.5 14c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path></svg>`,
                    label: 'Chat',
                    url: 'https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=loans&lang=en_US',
                }
            ]);
        }

        // Set the title link URL
        const siteURL = this.getAttribute('siteURL');
        if (!!siteURL) {
            template.content.getElementById('site-title').href = siteURL;
        }

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        // Bindings
        this.loadJS = this.loadJS.bind(this);
    }

    loadJS(hideAskUs) {
        // This loads the external JS file into the HTML head dynamically
        //Only load js if it has not been loaded before (tracked by the initCalled flag)
        if (!initCalled) {
            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function () {
                //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
                initCalled = true;
                // Initialise Main Navigation
                var navelement = document.querySelector('uq-site-header').shadowRoot.getElementById("jsNav");
                var nav = new uq.siteHeaderNavigation(navelement, "uq-site-header__navigation");
                // Initialise accordions
                new uq.accordion();
                // Equalised grid menu examples
                var equaliseGridMenu = uq.gridMenuEqualiser('.uq-grid-menu--equalised>a');
                equaliseGridMenu.align();

                // Actions for the ask us menu
                if (hideAskUs !== "true") {
                    let askUsClosed = true;
                    if(hideAskUs !== "true") {
                        function openMenu() {
                            askUsClosed = false;
                            document.querySelector('uq-site-header').shadowRoot.getElementById("askus-menu").style.display = "block";
                            document.querySelector('uq-site-header').shadowRoot.getElementById("askus-pane").style.display = "block";

                            function showDisplay() {
                                document.querySelector('uq-site-header').shadowRoot.getElementById("askus-menu").classList.remove("closed-menu");
                                document.querySelector('uq-site-header').shadowRoot.getElementById("askus-pane").classList.remove("closed-pane");
                            }

                            setTimeout(showDisplay, 100);
                            document.onkeydown = function (evt) {
                                evt = evt || window.event;
                                if (evt.keyCode == 27 && askUsClosed === false) {
                                    closeMenu();
                                }
                            };
                        }

                        function closeMenu() {
                            askUsClosed = true;
                            document.querySelector('uq-site-header').shadowRoot.getElementById("askus-menu").classList.add("closed-menu");
                            document.querySelector('uq-site-header').shadowRoot.getElementById("askus-pane").classList.add("closed-pane");

                            function hideDisplay() {
                                document.querySelector('uq-site-header').shadowRoot.getElementById("askus-menu").style.display = "none";
                                document.querySelector('uq-site-header').shadowRoot.getElementById("askus-pane").style.display = "none";
                            }

                            setTimeout(hideDisplay, 500);
                        }

                        function handleAskUsButton() {
                            askUsClosed ? document.querySelector('uq-site-header').shadowRoot.getElementById("askus-button").blur() : document.querySelector('uq-site-header').shadowRoot.getElementById("askus-button").focus();
                            document.querySelector('uq-site-header').shadowRoot.getElementById("askus-pane").addEventListener('click', handleMouseOut);
                            openMenu();
                        }

                        function handleMouseOut() {
                            askUsClosed = !askUsClosed;
                            document.querySelector('uq-site-header').shadowRoot.getElementById("askus-pane").removeEventListener('mouseleave', handleMouseOut);
                            closeMenu();
                        }

                        // Attach a listener to the askus button
                        document.querySelector('uq-site-header').shadowRoot.getElementById("askus-button").addEventListener('click', handleAskUsButton);
                    }
                }
            };
            //Specify the location of the ITS DS JS file
            script.src = 'uq-site-header.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    };

    connectedCallback() {
        this.loadJS();
    }
}

export default UQSiteHeader;

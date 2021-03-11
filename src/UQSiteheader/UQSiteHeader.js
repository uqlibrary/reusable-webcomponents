import styles from "./css/main.css";
import icons from "./css/icons.css";
import askusStyles from "./css/askus.css";
import myLibStyles from "./css/mylibrary.css";
import { askus } from "./AskUs";
import { mylibrary } from "./MyLibrary";

const template = document.createElement("template");
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${icons.toString()}</style>
    <style>${askusStyles.toString()}</style>
    <style>${myLibStyles.toString()}</style>
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
            <div id="mylibrary"></div>
            <div id="askus"></div>
            <slot name="site-utilities"></slot>
          <button class="uq-site-header__navigation-toggle jsNavToggle">Menu</button>
        </div>
      </div>

      <!-- Navigation Menu  -->
      <div class="uq-site-header__navigation-container">
        <nav class="uq-site-header__navigation" id="jsNav">
          <ul class="uq-site-header__navigation__list uq-site-header__navigation__list--level-1">
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
    const shadowDOM = this.attachShadow({ mode: "open" });

    // Handle the attributes for this component
    // // Set the title
    const siteTitle = this.getAttribute("siteTitle");
    if (!!siteTitle) {
      template.content.getElementById("site-title").innerHTML = siteTitle;
    }

    // Ask Us
    const hideAskUs = this.getAttribute("hideAskUs") === "true";

    // Chat
    const chatAvail = this.getAttribute("chatAvailable") || "false";
    const chatStart = this.getAttribute("chatStart") || "false";
    const chatEnd = this.getAttribute("chatEnd") || "false";
    const phoneStart = this.getAttribute("phoneStart") || "";
    const phoneEnd = this.getAttribute("phoneEnd") || "";

    // My Library
    const hideEspace = this.getAttribute("hideEspace") || "false";
    const hideMasquerade = this.getAttribute("hideMasquerade") || "true";

    if (!!hideAskUs) {
      template.content.getElementById("askus").remove();
    } else {
      template.content.getElementById("askus").innerHTML = askus();
      if (chatAvail !== "true") {
        // Chat disabled
        template.content.getElementById("askus-chat-li").style.opacity = "0.6";
        template.content
          .getElementById("askus-chat-link")
          .removeAttribute("onclick");

        template.content.getElementById("askus-phone-li").style.opacity = "0.6";
        template.content
          .getElementById("askus-phone-link")
          .removeAttribute("href");
      }
      // Set the attributes
      template.content.getElementById("askus-chat-start").innerText = chatStart;
      template.content.getElementById("askus-chat-end").innerText = chatEnd;
      template.content.getElementById(
        "askus-phone-start"
      ).innerText = phoneStart;
      template.content.getElementById("askus-phone-end").innerText = phoneEnd;
    }

    // My Library
    const hideMyLibrary = this.getAttribute("hideMyLibrary") === "true";

    if (!!hideMyLibrary) {
      template.content.getElementById("mylibrary").remove();
    } else {
      template.content.getElementById("mylibrary").innerHTML = mylibrary();
      hideEspace === "true" &&
        template.content.getElementById("mylibrary-espace").remove();
      hideMasquerade === "true" &&
        template.content.getElementById("mylibrary-masquerade").remove();
    }

    // Set the title link URL
    const siteURL = this.getAttribute("siteURL");
    if (!!siteURL) {
      template.content.getElementById("site-title").href = siteURL;
    }

    // Render the template
    shadowDOM.appendChild(template.content.cloneNode(true));

    // Bindings
    this.loadJS = this.loadJS.bind(this);
  }

  loadJS(hideAskUs, hideMyLibrary) {
    // This loads the external JS file into the HTML head dynamically
    //Only load js if it has not been loaded before (tracked by the initCalled flag)
    if (!initCalled) {
      //Dynamically import the JS file and append it to the document header
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.onload = function () {
        //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
        initCalled = true;
        // Initialise Main Navigation
        var navelement = document
          .querySelector("uq-site-header")
          .shadowRoot.getElementById("jsNav");
        var nav = new uq.siteHeaderNavigation(
          navelement,
          "uq-site-header__navigation"
        );
        // Initialise accordions
        new uq.accordion();
        // Equalised grid menu examples
        var equaliseGridMenu = uq.gridMenuEqualiser(
          ".uq-grid-menu--equalised>a"
        );
        equaliseGridMenu.align();

        // Actions for the ask us menu
        if (hideAskUs !== "true") {
          let askUsClosed = true;
          function openMenu() {
            askUsClosed = false;
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("askus-menu").style.display = "block";
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("askus-pane").style.display = "block";

            function showDisplay() {
              document
                .querySelector("uq-site-header")
                .shadowRoot.getElementById("askus-menu")
                .classList.remove("closed-menu");
              document
                .querySelector("uq-site-header")
                .shadowRoot.getElementById("askus-pane")
                .classList.remove("closed-pane");
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
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("askus-menu")
              .classList.add("closed-menu");
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("askus-pane")
              .classList.add("closed-pane");

            function hideDisplay() {
              document
                .querySelector("uq-site-header")
                .shadowRoot.getElementById("askus-menu").style.display = "none";
              document
                .querySelector("uq-site-header")
                .shadowRoot.getElementById("askus-pane").style.display = "none";
            }

            setTimeout(hideDisplay, 500);
          }

          function handleAskUsButton() {
            askUsClosed
              ? document
                  .querySelector("uq-site-header")
                  .shadowRoot.getElementById("askus-button")
                  .blur()
              : document
                  .querySelector("uq-site-header")
                  .shadowRoot.getElementById("askus-button")
                  .focus();
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("askus-pane")
              .addEventListener("click", handleMouseOut);
            openMenu();
          }

          function handleMouseOut() {
            askUsClosed = !askUsClosed;
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("askus-pane")
              .removeEventListener("mouseleave", handleMouseOut);
            closeMenu();
          }

          // Attach a listener to the askus button
          document
            .querySelector("uq-site-header")
            .shadowRoot.getElementById("askus-button")
            .addEventListener("click", handleAskUsButton);
        }

        // Actions for My Library menu
        if (hideMyLibrary !== "true") {
          let myLibraryClosed = true;
          function openMyLibMenu() {
            myLibraryClosed = false;
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("mylibrary-menu").style.display =
              "block";
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("mylibrary-pane").style.display =
              "block";

            function showDisplay() {
              document
                .querySelector("uq-site-header")
                .shadowRoot.getElementById("mylibrary-menu")
                .classList.remove("closed-menu");
              document
                .querySelector("uq-site-header")
                .shadowRoot.getElementById("mylibrary-pane")
                .classList.remove("closed-pane");
            }

            setTimeout(showDisplay, 100);
            document.onkeydown = function (evt) {
              evt = evt || window.event;
              if (evt.keyCode == 27 && myLibraryClosed === false) {
                closeMyLibMenu();
              }
            };
          }

          function closeMyLibMenu() {
            myLibraryClosed = true;
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("mylibrary-menu")
              .classList.add("closed-menu");
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("mylibrary-pane")
              .classList.add("closed-pane");

            function hideMyLibDisplay() {
              document
                .querySelector("uq-site-header")
                .shadowRoot.getElementById("mylibrary-menu").style.display =
                "none";
              document
                .querySelector("uq-site-header")
                .shadowRoot.getElementById("mylibrary-pane").style.display =
                "none";
            }

            setTimeout(hideMyLibDisplay, 500);
          }

          function handleMyLibButton() {
            myLibraryClosed
              ? document
                  .querySelector("uq-site-header")
                  .shadowRoot.getElementById("mylibrary-button")
                  .blur()
              : document
                  .querySelector("uq-site-header")
                  .shadowRoot.getElementById("mylibrary-button")
                  .focus();
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("mylibrary-pane")
              .addEventListener("click", handleMyLibMouseOut);
            openMyLibMenu();
          }

          function handleMyLibMouseOut() {
            myLibraryClosed = !myLibraryClosed;
            document
              .querySelector("uq-site-header")
              .shadowRoot.getElementById("mylibrary-pane")
              .removeEventListener("mouseleave", handleMyLibMouseOut);
            closeMyLibMenu();
          }

          // Attach a listener to the mylibrary button
          document
            .querySelector("uq-site-header")
            .shadowRoot.getElementById("mylibrary-button")
            .addEventListener("click", handleMyLibButton);
        }
      };
      //Specify the location of the ITS DS JS file
      script.src = "uq-site-header.js";

      //Append it to the document header
      document.head.appendChild(script);
    }
  }

  connectedCallback() {
    this.loadJS();
  }
}

export default UQSiteHeader;

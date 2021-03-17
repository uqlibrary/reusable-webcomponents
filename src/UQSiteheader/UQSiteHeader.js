import styles from "./css/main.css";
import overrides from "./css/overrides.css";
import icons from "./css/icons.css";
import {default as menuLocale} from "../locale/menu";
import myLibStyles from "../UtilityArea/css/mylibrary.css";

/**
 * API:
 *   <uq-site-header
 *       siteTitle="Library"                     // should be displayed on all sites - the text of the homepage link
 *       siteURL="http://www.library.uq.edu.au"  // should be displayed on all sites - the link of the homepage link
 *       showMenu                                // should the megamenu be displayed? (just include, don't put ="true" on the end)
 *       showLoginButton                         // should the auth button be displayed? (just include, don't put ="true" on the end)
 *       requireLoggedOut                        // only valid if 'showLoginButton' is true
 *                                               // forces the auth button to the logged out state (just include, don't put ="true" on the end)
 *       hideAskUs                               // when present, askus button will not be displayed (just include for true, or can put "false" on the end)
 *       hideMyLibrary                           // when present, mylibrary button will not be displayed (mylibrary is only available when logged in) (just include for true, or can put "false" on the end)
 *   >
 <slot name="site-utilities"></slot>
 </uq-site-header>

 */

const template = document.createElement("template");
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${icons.toString()}</style>
    <style>${overrides.toString()}</style>
    <style>${myLibStyles.toString()}</style>
    <link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v6/fonts/Roboto/roboto.css" />
    <link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v9/fonts/Merriweather/merriweather.css" />
    <link rel="stylesheet" type="text/css" href="https://static.uq.net.au/v13/fonts/Montserrat/montserrat.css">
  <div class="uq-site-header">
      <!-- Site title and utility area with mobile nav toggler (JS) -->
      <div class="uq-site-header__title-container">
        <div class="uq-site-header__title-container__left">
          <a id="site-title" href="https://www.library.uq.edu.au/" class="uq-site-header__title">Library</a>
        </div>
        <div class="uq-site-header__title-container__right">
          <slot name="site-utilities"></slot>
          <button id="uq-site-header__navigation-toggle" class="uq-site-header__navigation-toggle jsNavToggle">Menu</button>
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

    // Set the title & link URL
    const siteTitleContent = template.content.getElementById("site-title");
    const siteTitle = this.getAttribute("siteTitle");
    const siteURL = this.getAttribute("siteURL");
    !!siteTitleContent &&
      !!siteTitle &&
      (siteTitleContent.innerHTML = siteTitle);
    !!siteTitleContent && !!siteURL && (siteTitleContent.href = siteURL);

    this.addMyLibraryButtonToSlot();
    this.addAskUsButtonToSlot();
    this.addAuthButtonToSlot();

    this.rewriteMegaMenuFromJson();

    // Render the template
    shadowDOM.appendChild(template.content.cloneNode(true));

    // Bindings
    this.loadJS = this.loadJS.bind(this);
  }

    addMyLibraryButtonToSlot() {
      if (!this.isMylibraryButtonRequested()) {
        // if the page doesnt want mylibrary, just dont show it - no account check required
        return;
      }

      console.log('show mylibrary button');
      // this one just creates the stub - authbutton will fill in the actual button if they are logged in
      const mylibraryButton0 = document.createElement('div');
      mylibraryButton0.id = 'mylibraryslot';

      !!mylibraryButton0 && this.addButtonToUtilityArea(mylibraryButton0);
    }

    addAskUsButtonToSlot() {
        if (!this.isAskusButtonRequested()) {
            return;
        }

        const askusButton0 = document.createElement('askus-button');

        const askusButton = !!askusButton0 && askusButton0.cloneNode(true);
        !!askusButton && this.addButtonToUtilityArea(askusButton);
    }

    addAuthButtonToSlot() {
      if (!this.isAuthButtonRequested()) {
        return;
      }

      const authButton0 = document.createElement("auth-button");
      !!authButton0 &&
        this.overwriteAsLoggedOut() &&
        authButton0.setAttribute("overwriteAsLoggedOut", "true");

      const authButton = !!authButton0 && authButton0.cloneNode(true);
      !!authButton && this.addButtonToUtilityArea(authButton);
    }

    addButtonToUtilityArea(button) {
      const buttonWrapper = document.createElement('span');
          !!buttonWrapper && buttonWrapper.setAttribute('slot', 'site-utilities');
      !!button && !!buttonWrapper && buttonWrapper.appendChild(button);

      const siteHeader =
        document.getElementsByTagName("uq-site-header")[0] || false;
      !!buttonWrapper && !!siteHeader && siteHeader.appendChild(buttonWrapper);
    }

  rewriteMegaMenuFromJson() {
    const megaMenu = template.content.getElementById("jsNav");

    // clear the existing children
    megaMenu.textContent = "";

    if (!this.isMegaMenuRequested()) {
      // hide responsive menu button
      const button = template.content.getElementById(
        "uq-site-header__navigation-toggle"
      );
      !!button && (button.style.display = "none");

      // don't add Library megamenu
      return;
    }

    const listWrapper = document.createElement("ul");
    listWrapper.setAttribute(
      "class",
      "uq-site-header__navigation__list uq-site-header__navigation__list--level-1"
    );

    menuLocale.publicmenu.forEach((jsonParentItem, index) => {
      const hasChildren =
        !!jsonParentItem.submenuItems && jsonParentItem.submenuItems.length > 0;

      const parentListItem = document.createElement("li");

      let classNavListitem = "uq-site-header__navigation__list-item";
      !!hasChildren &&
        (classNavListitem +=
          " uq-site-header__navigation__list-item--has-subnav");
      jsonParentItem.linkTo === window.location.href &&
        (classNavListitem += " uq-site-header__navigation__list-item--active");
      parentListItem.setAttribute("class", classNavListitem);

      const parentLink = this.createLink(
        `megamenu-submenus-item-${index}`,
        jsonParentItem.linkTo || "",
        jsonParentItem.primaryText || ""
      );
      parentLink.setAttribute("aria-expanded", "false");
      parentListItem.appendChild(parentLink);

      if (hasChildren) {
        const textOfToggle = document.createTextNode("Open");
        const parentToggle = document.createElement("span");
        parentToggle.setAttribute(
          "class",
          "uq-site-header__navigation__sub-toggle"
        );
        parentToggle.appendChild(textOfToggle);

        parentListItem.appendChild(parentToggle);
      }

      // make child items
      if (hasChildren) {
        const listItemWrapper = document.createElement("ul");
        let listItemClass =
          "uq-site-header__navigation__list uq-site-header__navigation__list--level-2";
        !!jsonParentItem.columnCount &&
          jsonParentItem.columnCount > 1 &&
          (listItemClass += " multicolumn-" + jsonParentItem.columnCount);
        listItemWrapper.setAttribute("class", listItemClass);
        jsonParentItem.submenuItems.forEach((jsonChild) => {
          const listItem = document.createElement("li");
          listItem.setAttribute(
            "class",
            "uq-site-header__navigation__list-item"
          );

          // a missing primary text allows for an empty cell, controlling the spacing of the menu
          if (!!jsonChild.primaryText) {
            const primarytextOfLink = document.createTextNode(
              jsonChild.primaryText || ""
            );
            const primaryTextItem = document.createElement("span");
            primaryTextItem.setAttribute("class", "displayText");
            primaryTextItem.appendChild(primarytextOfLink);

            const secondarytextOfLink = document.createTextNode(
              jsonChild.secondaryText || " "
            );
            const secondaryTextItem = document.createElement("span");
            secondaryTextItem.setAttribute(
              "class",
              "displayText secondaryText"
            );
            secondaryTextItem.appendChild(secondarytextOfLink);

            const itemLink = document.createElement("a");
            itemLink.setAttribute("data-testid", jsonChild.dataTestid || "");
            itemLink.setAttribute("href", jsonChild.linkTo || "");
            itemLink.appendChild(primaryTextItem);
            itemLink.appendChild(secondaryTextItem);
            itemLink.setAttribute("aria-expanded", "false");

            listItem.appendChild(itemLink);
          }

          listItemWrapper.appendChild(listItem);
        });
        parentListItem.appendChild(listItemWrapper);
      }

      listWrapper.appendChild(parentListItem);
    });
    megaMenu.appendChild(listWrapper);
  }

  createLink(datatestid, href, linktext) {
    const alink = document.createElement("a");
    alink.setAttribute("data-testid", datatestid);
    alink.setAttribute("href", href);
    const textOfLink = document.createTextNode(linktext);
    alink.appendChild(textOfLink);
    return alink;
  }

  loadJS(hideAskUs, hideMyLibrary) {
    // This loads the external JS file into the HTML head dynamically
    //Only load js if it has not been loaded before (tracked by the initCalled flag)
    if (!initCalled) {
      const isMegaMenuDisplayed = this.isMegaMenuRequested();

      //Dynamically import the JS file and append it to the document header
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.onload = function () {
        //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
        initCalled = true;
        // Initialise Main Navigation
        const uqSiteHeader = document.querySelector("uq-site-header");
        const shadowDOM = (!!uqSiteHeader && uqSiteHeader.shadowRoot) || false;
        if (!!isMegaMenuDisplayed) {
          var navelement =
            !!uqSiteHeader && uqSiteHeader.shadowRoot.getElementById("jsNav");
          var nav = new uq.siteHeaderNavigation(
            navelement,
            "uq-site-header__navigation"
          );
        }
        // Initialise accordions
        new uq.accordion();
        // Equalised grid menu examples
        var equaliseGridMenu = uq.gridMenuEqualiser(
          ".uq-grid-menu--equalised>a"
        );
        equaliseGridMenu.align();
      };
      //Specify the location of the ITS DS JS file
      script.src = "uq-site-header.js";

      //Append it to the document header
      document.head.appendChild(script);
    }
  }

  isMegaMenuRequested() {
    if (this.showMenu === undefined) {
        this.showMenu = this.getAttribute('showMenu');
    }
    return !!this.showMenu || this.showMenu === '';
  }

  isAuthButtonRequested() {
    if (this.isloginRequired === undefined) {
      this.isloginRequired = this.getAttribute("showLoginButton");
    }
    return !!this.isloginRequired || this.isloginRequired === "";
  }

  isAskusButtonRequested() {
    const hideAskUs = this.getAttribute("hideAskUs");
    return hideAskUs === "false" || hideAskUs === null;
  }

  isMylibraryButtonRequested() {
    const hideMylibrary = this.getAttribute("hideMyLibrary");
    console.log("hideMylibrary = ", hideMylibrary);
    return hideMylibrary === "false" || hideMylibrary === null;
  }

  overwriteAsLoggedOut() {
    if (this.overwriteAsLoggedOutVar === undefined) {
      this.overwriteAsLoggedOutVar = this.getAttribute("requireLoggedOut");
    }
    return (
      !!this.overwriteAsLoggedOutVar || this.overwriteAsLoggedOutVar === ""
    );
  }

  connectedCallback() {
    this.loadJS();
  }
}

export default UQSiteHeader;

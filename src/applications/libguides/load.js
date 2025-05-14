(function loadGuides() {
    class URLParameterHandler {
        // this class lets us either use actual search parameters for overrides, or manually override these overrides in test
        constructor() {
            this.values = {};
            this.overrides = {};
        }

        getValue(key) {
            // Check for override first, then URL parameter, then default
            if (!!this.overrides[key]) {
                return this.overrides[key];
            }
            if (!!this.values[key]) {
                return this.values[key];
            }
            const value = this.getSearchParameter(key);
            if (!!value) {
                this.values[key] = value;
                return this.values[key];
            }
            return null;
        }

        getSearchParameter(key) {
            const url = window.location.href;
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            return params.get(key);
        }

        setOverride(key, value) {
            // overrides only used to test our param usage
            if (window.location.hostname !== 'localhost') {
                return;
            }
            this.overrides[key] = value;
        }

        clearOverride(key) {
            delete this.overrides[key];
        }

        clearAllOverrides() {
            this.overrides = {};
        }
    }

    const searchParameters = new URLParameterHandler();

    function ready(fn) {
        if (searchParameters.getValue('override') === 'on' && searchParameters.getValue('skipScript') === 'yes') {
            // to stop reusable being loaded, call it like this.
            // https://guides.library.uq.edu.au/?override=on&skipScript=yes
            // You can then manually load things in the console
            return;
        }
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function applyUQLItemsToGuides() {
        prePurpleLinks();

        closeAllUqAccordions();

        makeSidebarMenuStandard();

        if (window.location.hostname === 'localhost') {
            testIncludePathGeneration();
        }

        fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
        fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
        fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
        fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

        let scriptUrl = getIncludeFullPath('uq-lib-reusable.min.js');
        insertScript(scriptUrl, true);

        const waitForBody = setInterval(() => {
            const firstElement = document.body.children[0];
            if (!firstElement) {
                return;
            }
            clearInterval(waitForBody);

            const cssFileName = getIncludeFullPath('applications/libguides/custom-styles.css');
            insertCssFile(cssFileName);

            const gtm = document.createElement('uq-gtm');
            !!gtm && gtm.setAttribute('gtm', 'GTM-NC7M38Q');
            document.body.insertBefore(gtm, firstElement);

            if (!document.querySelector('uq-header')) {
                const header = document.createElement('uq-header');
                !!header && header.setAttribute('hideLibraryMenuItem', '');
                !!header && header.setAttribute('searchurl', 'guides.library.uq.edu.au');
                document.body.insertBefore(header, firstElement);
            }

            // for 2025 dev - should not be needed for prod (the if block, above, is skipped because the production js has already written the header)
            const uqheader = document.querySelector('uq-header');
            if (!!uqheader && uqheader.getAttribute('searchurl') === null) {
                uqheader.setAttribute('searchurl', 'guides.library.uq.edu.au');
            }

            if (!document.querySelector('uq-site-header')) {
                const siteHeader = document.createElement('uq-site-header');
                !!siteHeader && siteHeader.setAttribute('secondleveltitle', 'Guides');
                !!siteHeader && siteHeader.setAttribute('secondlevelurl', 'https://guides.library.uq.edu.au/');
                !!siteHeader && document.body.insertBefore(siteHeader, firstElement);

                if (!isInEditMode()) {
                    const authButton = createAuthButton();
                    !!siteHeader && !!authButton && siteHeader.appendChild(authButton);

                    moveSpringshareBreadcrumbsToSiteHeader(siteHeader);
                }
            }

            if (!document.querySelector('proactive-chat:not([display="inline"])')) {
                const proactiveChat = document.createElement('proactive-chat');
                !!proactiveChat && document.body.insertBefore(proactiveChat, firstElement);
            }

            if (!document.querySelector('alert-list')) {
                const alerts = document.createElement('alert-list');
                !!alerts && document.body.insertBefore(alerts, firstElement);
            }

            if (!document.querySelector('cultural-advice')) {
                const culturalAdvice = document.createElement('cultural-advice');
                !!culturalAdvice && document.body.insertBefore(culturalAdvice, firstElement);
            }
            moveHeroShot();

            if (!document.querySelector('uq-footer')) {
                const subFooter = document.createElement('uq-footer');
                document.body.appendChild(subFooter);
            }

            addHeroHeader();
        }, 100);
    }

    function isInEditMode() {
        if (window.location.hostname === 'localhost') {
            return false;
        }
        // guides is edited on springshare domain, with our looknfeel.
        // Don't include some elements - they are distracting to the admin
        if (window.location.href.includes('uq.edu.au')) {
            return false;
        }
        return true;
    }

    function createSlotForButtonInUtilityArea(button, id = null) {
        const slot = document.createElement('span');
        !!slot && slot.setAttribute('slot', 'site-utilities');
        !!slot && !!id && slot.setAttribute('id', id);
        !!button && !!slot && slot.appendChild(button);

        return slot;
    }

    function createAuthButton() {
        if (!!document.querySelector('auth-button')) {
            return false;
        }

        const authButton = document.createElement('auth-button');
        const slot = !!authButton && createSlotForButtonInUtilityArea(authButton, 'auth');

        return slot;
    }

    function fontLoader(font) {
        const link = document.createElement('link');
        !!link && (link.type = 'text/css');
        !!link && (link.rel = 'stylesheet');
        !!link && (link.href = font);

        const head = document.head;
        !!head && !!link && head.appendChild(link);
    }

    function getPathnameRoot(pathname) {
        const parts = pathname.split('/');
        if (parts.length < 3) {
            return '/';
        }

        const firstTwoLevels = parts.slice(1, 3);
        return '/' + firstTwoLevels.join('/') + '/';
    }

    function insertScript(url, defer = false, onloadCallback = null) {
        const scriptfound = document.querySelector("script[src*='" + url + "']");
        if (!!scriptfound) {
            return;
        }
        const script = document.createElement('script');
        !!script && script.setAttribute('type', 'text/javascript');
        !!script && script.setAttribute('src', url);

        !!defer && script.setAttribute('defer', '');

        const head = document.querySelector('head');
        !!head && !!script && head.appendChild(script);
    }

    function forceStaging() {
        // guides does not have a staging environment, but we can force a load from assets staging by calling it like this:
        // https://guides.library.uq.edu.au/?override=on&useAlternate=staging
        return (
            searchParameters.getValue('override') === 'on' && searchParameters.getValue('useAlternate') === 'staging'
        );
    }

    function forceFeatureBranch() {
        return (
            searchParameters.getValue('override') === 'on' && searchParameters.getValue('useAlternate') === 'working'
        );
    }

    function getFeatureBranchName() {
        return forceFeatureBranch() ? searchParameters.getValue('branchName') : 'master';
    }

    // we can use parameters to force our css and js to come from staging or feature branch locations
    // default is assets production
    function getIncludeFullPath(includeFilename, _overrideHost = null, _featureBranchName = null) {
        // override values only used for testing this function
        const overrideHost = _overrideHost === null ? window.location.host : _overrideHost; // domain
        const featureBranchName = _featureBranchName === null ? getFeatureBranchName() : _featureBranchName;

        const assetsHostname = 'assets.library.uq.edu.au';
        const assetsRoot = 'https://' + assetsHostname;

        if (overrideHost === 'localhost:8080') {
            return '/' + includeFilename;
        }
        if (forceStaging()) {
            // we don't have a staging environment on guides, but we can use this override to test things
            // eg https://guides.library.uq.edu.au/how-to-find/news-and-newspapers?override=on&useAlternate=staging
            return assetsRoot + '/reusable-webcomponents-staging/' + includeFilename;
        }

        if (forceFeatureBranch()) {
            // for development testing on feature branch - force Staging (useAlternate=staging) longer term instead
            // eg https://guides.library.uq.edu.au/how-to-find/news-and-newspapers?override=on&useAlternate=working&branchName=featureBranchName
            return `${assetsRoot}/reusable-webcomponents-development/${featureBranchName}/${includeFilename}`;
        }

        // TEMPORARY CODE - REMOVE AFTER 2025 REDEV - TODO
        const queryStrings = new URLSearchParams(window.location.search);
        if (
            window.location.pathname === '/sandbox' ||
            window.location.pathname.startsWith('/Sandbox') ||
            (!!queryStrings && queryStrings.has('group_id'))
        ) {
            // we are on a groups page - 2025 dev
            return `${assetsRoot}/reusable-webcomponents-development/guides-AD-111/${includeFilename}`;
        }

        // otherwise prod
        return assetsRoot + '/reusable-webcomponents/' + includeFilename;
    }

    function testIncludePathGeneration() {
        // because we cant really test alternate environments, this will dump lines onto the console
        console.log('============================');
        console.log('##### CONFIRM INCLUDE PATH GENERATION (use http://localhost:8080/index-guides.html)');

        const prodUrl = getIncludeFullPath('applications/libguides/load.js', 'guides.library.uq.edu.au'); // , null, null);
        if ('https://assets.library.uq.edu.au/reusable-webcomponents/applications/libguides/load.js' === prodUrl) {
            console.log('prod ok', prodUrl);
        } else {
            console.error('PROD PROBLEM', prodUrl);
        }

        searchParameters.clearAllOverrides();
        searchParameters.setOverride('override', 'on');
        searchParameters.setOverride('useAlternate', 'staging');
        const stagingUrl = getIncludeFullPath('applications/libguides/load.js', 'assets.library.uq.edu.au');
        if (
            'https://assets.library.uq.edu.au/reusable-webcomponents-staging/applications/libguides/load.js' ===
            stagingUrl
        ) {
            console.log('staging ok:', stagingUrl);
        } else {
            console.error('STAGING PROBLEM', stagingUrl);
        }

        searchParameters.clearAllOverrides();
        searchParameters.setOverride('override', 'on');
        searchParameters.setOverride('useAlternate', 'working');
        searchParameters.setOverride('branchName', 'master');
        const masterUrl = getIncludeFullPath('applications/libguides/load.js', 'assets.library.uq.edu.au');
        if (
            'https://assets.library.uq.edu.au/reusable-webcomponents-development/master/applications/libguides/load.js' ===
            masterUrl
        ) {
            console.log('master ok:', masterUrl);
        } else {
            console.error('MASTER PROBLEM', masterUrl);
        }

        searchParameters.clearAllOverrides();
        searchParameters.setOverride('override', 'on');
        searchParameters.setOverride('useAlternate', 'working');
        searchParameters.setOverride('branchName', 'some-branch');
        const featureUrl = getIncludeFullPath('applications/libguides/load.js', 'assets.library.uq.edu.au');
        if (
            `https://assets.library.uq.edu.au/reusable-webcomponents-development/some-branch/applications/libguides/load.js` ===
            featureUrl
        ) {
            console.log('feature branch ok:', featureUrl);
        } else {
            console.error('FEATURE BRANCH PROBLEM', featureUrl);
        }

        searchParameters.clearAllOverrides();
        console.log('============================');
    }

    function moveSpringshareBreadcrumbsToSiteHeader(siteHeader) {
        const awaitSiteHeader = setInterval(() => {
            const siteHeaderShadowRoot = siteHeader.shadowRoot;

            if (!!siteHeaderShadowRoot) {
                clearInterval(awaitSiteHeader);

                const breadcrumbNav = document.getElementById('s-lib-bc');
                const listItems = !!breadcrumbNav && breadcrumbNav.querySelectorAll('ol li');
                const breadcrumbParent =
                    !!siteHeaderShadowRoot && siteHeaderShadowRoot.getElementById('breadcrumb_nav');
                !!listItems &&
                    listItems.forEach((item) => {
                        const anchor = item.querySelector('a');
                        const title = anchor ? anchor.textContent : item.textContent;
                        const href = anchor ? anchor.href : null;
                        if (
                            isNotHomepage(href) &&
                            document.location.pathname !== '/' &&
                            title !== 'Home' // the breadcrumbs that indicate "here" don't add any value
                        ) {
                            const listItemEntry = !!href ? breadcrumblink({ title, href }) : breadcrumbSpan(title);
                            breadcrumbParent.insertAdjacentHTML('beforeend', listItemEntry);
                        }
                    });
                !!breadcrumbNav && breadcrumbNav.remove();
            }

            function breadcrumblink(b) {
                return `<li class="uq-breadcrumb__item">
                <a class="uq-breadcrumb__link" title="${b.title}" href="${b.href}">${b.title}</a>
                </li>`;
            }
            function breadcrumbSpan(title) {
                return `<li class="uq-breadcrumb__item">
                <span class="uq-breadcrumb__link" title="${title}">${title}</span>
                </li>`;
            }
            function isNotHomepage(href) {
                return (
                    href !== 'https://www.library.uq.edu.au/' &&
                    href !== 'https://www.library.uq.edu.au' &&
                    href !== 'http://www.library.uq.edu.au/' &&
                    href !== 'http://www.library.uq.edu.au' &&
                    href !== 'https://guides.library.uq.edu.au/' &&
                    href !== 'https://guides.library.uq.edu.au'
                );
            }
        }, 100);
    }

    function insertCssFile(cssFileName) {
        const includeFound = document.querySelector("link[href*='" + cssFileName + "']");
        if (!!includeFound) {
            return;
        }

        // insert the css late so it is more likely to override other styles,
        // might be better to go back to attach-to-head at sandbox test point to avoid FOUC? but needed right now
        const link = document.createElement('link');
        !!link && (link.type = 'text/css');
        !!link && (link.rel = 'stylesheet');
        !!link && (link.href = cssFileName);

        const body = document.body;
        !!body && !!link && body.appendChild(link);
    }

    function prePurpleLinks() {
        // We get a flash of blue links, the built-in style
        // Lets try to minimise that by doing a generic early application of style
        const styleSheet = document.createElement('style');
        styleSheet.textContent = 'a { color: #51247a; }';
        document.head.appendChild(styleSheet);
    }

    function closeAllUqAccordions() {
        // accordions are loaded open so the content is viewable without javascript, we then close them all here as part of the load
        const accordionPanels = document.querySelectorAll('.uq-accordion__content--active');
        !!accordionPanels &&
            accordionPanels.forEach((panel) => {
                panel.classList.remove('uq-accordion__content--active');
                const button = document.querySelector(`[aria-controls="${panel.id}"]`);
                if (button) {
                    !!button.classList.contains('uq-accordion__toggle--active') &&
                        button.classList.remove('uq-accordion__toggle--active');
                    button.setAttribute('aria-expanded', 'false');

                    const wrappingDiv = button.parentElement;
                    !!wrappingDiv && wrappingDiv.classList.remove('uq-accordion__item--is-open');
                }
            });
    }

    function moveHeroShot() {
        // move the hero image up higher so it can go full width
        // const wrappingBlock = document.querySelector('#s-lg-box-22990011-container>div');
        const wrappingBlock = document.querySelector('[href="#s-lib-public-main"]');
        const heroDiv = document.getElementById('guides-library-hero');
        !!wrappingBlock && !!heroDiv && wrappingBlock.after(heroDiv);
    }

    function makeSidebarMenuStandard() {
        const uqMenu = `<nav class="uq-local-nav" aria-label="Local navigation">
            <div class="uq-local-nav__grandparent"><a href="https://uq.edu.au/" class="uq-local-nav__link">UQ home</a></div>
            <div class="uq-local-nav__grandparent"><a href="/" class="uq-local-nav__link">Library</a></div>
            <div class="uq-local-nav__parent"><a href="https://guides.library.uq.edu.au" class="uq-local-nav__link">Guides</a></div>
        </nav>`;
        const template = document.createElement('template');
        template.innerHTML = uqMenu;

        const sidebar = document.querySelector('#s-lg-guide-tabs[role="navigation"]');
        const menuList = document.querySelector('#s-lg-guide-tabs[role="navigation"] ul');

        !!sidebar && sidebar.insertBefore(template.content.cloneNode(true), sidebar.firstChild);

        const newNav = document.querySelector('#s-lg-guide-tabs[role="navigation"] nav');
        !!newNav && newNav.appendChild(menuList);
    }

    function addHeroHeader() {
        const checkHero = document.querySelector('.hero-wrapper-1');
        if (!!checkHero) {
            // hero already provided
            return;
        }

        let h1Element = document.querySelector('#s-lg-guide-header-info h1');
        if (!h1Element) {
            h1Element = document.querySelector('#s-lib-public-main h1');
        }
        const h1Text = !!h1Element && h1Element.textContent;

        if (!h1Text) {
            // no h1 found to move
            return;
        }
        !!h1Element && h1Element.remove();

        const heroHtml = `<div id="guides-library-hero" class="hero-wrapper-1 non-homepage-hero" data-testid="hero-wrapper">
                <div class="hero-wrapper-2">
                    <div class="hero-wrapper-3"></div>
                    <div class="hero-wrapper-3">
                        <div class="hero-words-wrapper-1" data-testid="hero-words-words-wrapper">
                            <div class="hero-words-wrapper-2">
                                <h1 class="hero-h1" data-testid="hero-text">${h1Text}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        const template = document.createElement('template');
        template.innerHTML = heroHtml;

        const sibling = document.querySelector('#s-lg-public-skiplink');
        !!sibling && sibling.parentNode.insertBefore(template.content, sibling.nextSibling);
    }

    ready(applyUQLItemsToGuides);
})();

function toggleAccordionPanel(clickedButton) {
    /*
    used with markup like:
    <div class="uq-accordion">
        <div class="uq-accordion__item"> <!-- repeat this block for multiple accordions -->
            <button aria-controls="MATCHING_ID" aria-expanded="true" aria-haspopup="true" onclick="toggleAccordionPanel(this)" class="uq-accordion__toggle uq-accordion__toggle--active">Research</button>
            <div id="MATCHING_ID" class="uq-accordion__content uq-accordion__content--active uq-accordion__content-wrapper">
                <p>content</p>
            </div>
        </div>
    </div>
    usage:
    - update the button label
    - replace the 2 instances of MATCHING_ID with the same page-unique id on both
    - replace `<p>content</p>` with the desired contents of the hideable panel
    note: loads open so content is available without js, function closeAllUqAccordions, above, closes them onload
     */
    const panelId = clickedButton.getAttribute('aria-controls');
    const panel = !!panelId && document.getElementById(panelId);
    if (!panel) {
        return true;
    }

    const wrappingDiv = clickedButton.parentElement;
    if (!panel.classList.contains('uq-accordion__content--active')) {
        clickedButton.setAttribute('aria-expanded', 'true');
        !clickedButton.classList.contains('uq-accordion__toggle--active') &&
            clickedButton.classList.add('uq-accordion__toggle--active');
        !panel.classList.contains('uq-accordion__content--active') &&
            panel.classList.add('uq-accordion__content--active');
        !!wrappingDiv &&
            !wrappingDiv.classList.contains('uq-accordion__item--is-open') &&
            wrappingDiv.classList.add('uq-accordion__item--is-open');
    } else {
        clickedButton.setAttribute('aria-expanded', 'false');
        !!clickedButton.classList.contains('uq-accordion__toggle--active') &&
            clickedButton.classList.remove('uq-accordion__toggle--active');
        !!panel.classList.contains('uq-accordion__content--active') &&
            panel.classList.remove('uq-accordion__content--active');
        !!wrappingDiv &&
            !!wrappingDiv.classList.contains('uq-accordion__item--is-open') &&
            wrappingDiv.classList.remove('uq-accordion__item--is-open');
    }
    return false;
}

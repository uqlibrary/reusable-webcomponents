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

        replaceSpringShareSidebarMenu();

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

            addAZNavigationToSomePages();
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
            window.location.host === 'springycommunity.libapps.com' ||
            window.location.pathname === '/sandbox' ||
            window.location.pathname.startsWith('/Sandbox') ||
            (!!queryStrings && queryStrings.has('group_id'))
        ) {
            // we are on a groups page - 2025 dev
            return `${assetsRoot}/reusable-webcomponents-development/guides-AD-111-subdomain/${includeFilename}`;
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
        const siblingBlock = document.querySelector('[href="#s-lib-public-main"]');
        const heroDiv = document.getElementById('guides-library-hero');
        !!siblingBlock && !!heroDiv && siblingBlock.after(heroDiv);
    }

    function replaceSpringShareSidebarMenu() {
        const menuQuerySelector = '#s-lg-guide-tabs .nav-pills';
        const currentUrl = `${document.location.origin}${document.location.pathname}`;

        function parseUrlPath(url) {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/').filter((part) => part !== '');

            const hierarchy = [];
            let currentPath = '';

            // Add root
            hierarchy.push({
                level: 'root',
                path: '/',
                name: 'Home',
            });

            // Build hierarchy from path parts
            pathParts.forEach((part, index) => {
                currentPath += '/' + part;
                let level;

                if (index === 0) level = 'grandparent';
                else if (index === 1) level = 'parent';
                else level = 'current';

                hierarchy.push({
                    level: level,
                    path: currentPath,
                    name: part
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                });
            });

            return hierarchy;
        }

        function extractLinksFromDiv(divQuerySelector) {
            // this ignores links with a hash fragment - springshare puts them in the sidebar, but UQ DS doesn't
            const targetDiv = document.querySelector(divQuerySelector);
            if (!targetDiv) {
                console.error(`Div matching "${divQuerySelector}" not found`);
                return [];
            }

            const links = targetDiv.querySelectorAll('a[href]');
            const linkMap = new Map();

            Array.from(links).forEach((link) => {
                const href = link.href;
                const text = link.textContent.trim();
                const hasFragment = href.includes('#');

                // Get base URL without fragment
                const baseHref = hasFragment ? href.split('#')[0] : href;

                if (!linkMap.has(baseHref)) {
                    // First occurrence - add it
                    linkMap.set(baseHref, {
                        href: baseHref,
                        text: text,
                        title: link.title || text,
                        hasFragment: hasFragment,
                    });
                } else {
                    // Duplicate found - keep the one without fragment, or first one if both have fragments
                    const existing = linkMap.get(baseHref);
                    if (existing.hasFragment && !hasFragment) {
                        // Replace with non-fragment version
                        linkMap.set(baseHref, {
                            href: baseHref,
                            text: text,
                            title: link.title || text,
                            hasFragment: false,
                        });
                    }
                    // If existing doesn't have fragment, keep it (ignore current)
                }
            });

            return Array.from(linkMap.values());
        }

        // Build navigation HTML structure
        function buildNavigationHtml(currentUrl, links) {
            const urlHierarchy = parseUrlPath(currentUrl);
            const url = new URL(currentUrl);
            const currentPath = `${url.pathname}${url.search}`;

            // Group links by their path depth relative to current URL
            const groupedLinks = {
                siblings: [],
                children: [],
            };

            links.forEach((link) => {
                try {
                    const linkUrl = new URL(link.href);
                    const linkPath = `${linkUrl.pathname}${linkUrl.search}`;
                    const linkParts = linkPath.split('/').filter((part) => part !== '');
                    const currentParts = currentPath.split('/').filter((part) => part !== '');

                    // Determine relationship to current URL
                    if (linkParts.length === currentParts.length) {
                        // Same level (siblings)
                        console.log('compare', linkPath, ' to ', currentPath);
                        groupedLinks.siblings.push({
                            ...link,
                            path: linkPath,
                            isActive: linkPath === currentPath,
                        });
                    } else if (linkParts.length === currentParts.length + 1 && linkPath.startsWith(currentPath)) {
                        // One level deeper (children)
                        groupedLinks.children.push({
                            ...link,
                            path: linkPath,
                            isActive: false,
                        });
                    }
                } catch (e) {
                    // Handle relative URLs
                    groupedLinks.siblings.push({
                        ...link,
                        path: link.href,
                        isActive: false,
                    });
                }
            });

            // Build HTML structure
            let html = `<div class="uq-sidebar-layout__sidebar">
        <div id="local-nav-app" data-once="local-nav">
        <nav class="uq-local-nav" aria-label="Local navigation">
            <div class="uq-local-nav__grandparent"><a href="https://uq.edu.au/" class="uq-local-nav__link">UQ home</a></div>
            <div class="uq-local-nav__grandparent"><a href="https://www.library.uq.edu.au/" class="uq-local-nav__link">Library</a></div>
            <div class="uq-local-nav__grandparent"><a href="https://guides.library.uq.edu.au/" class="uq-local-nav__link">Guides</a></div>`;

            // Add hierarchy breadcrumbs
            urlHierarchy.forEach((item, index) => {
                if (item.level === 'grandparent' && index > 0) {
                    html += `<div class="uq-local-nav__grandparent"><a href="${item.path}" class="uq-local-nav__link">${item.name}</a></div>`;
                } else if (item.level === 'parent') {
                    html += `<div class="uq-local-nav__parent"><a href="${item.path}" class="uq-local-nav__link">${item.name}</a></div>`;
                }
            });

            // Add children list
            if (groupedLinks.siblings.length > 0 || groupedLinks.children.length > 0) {
                html += `
            <ul class="uq-local-nav__children">`;

                // Add sibling links
                groupedLinks.siblings.forEach((link) => {
                    const activeClass = link.isActive ? ' uq-local-nav--current-child' : '';
                    const linkActiveClass = link.isActive ? ' uq-local-nav--active-link' : '';
                    const hasChildren = groupedLinks.children.length > 0 && link.isActive;
                    const hasChildrenClass = hasChildren ? ' uq-local-nav--has-children' : '';

                    html += `<li class="uq-local-nav__child${activeClass}${hasChildrenClass}"><a href="${link.path}" class="uq-local-nav__link${linkActiveClass}">${link.text}</a>`;

                    // Add grandchildren if this is the active item
                    if (hasChildren) {
                        html += `<ul class="uq-local-nav__grandchildren">`;

                        groupedLinks.children.forEach((child) => {
                            html += `
                        <li class="uq-local-nav__grandchild"><a href="${child.path}" class="uq-local-nav__link">${child.text}</a></li>`;
                        });

                        html += `
                    </ul>`;
                    }

                    html += `</li>`;
                });

                html += `</ul>`;
            }

            html += `</nav></div></div>`;

            return html;
        }

        // Main execution
        const links = extractLinksFromDiv(menuQuerySelector);
        const navigationHtml = buildNavigationHtml(currentUrl, links);

        const originalDiv = document.querySelector(menuQuerySelector);
        !!originalDiv && (originalDiv.outerHTML = navigationHtml);
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

        const heroHtml = `<div id="guides-library-hero" class="block block-system block-system-main-block" data-testid="hero-wrapper">
                    <div>
                        <div class="uq-hero">
                            <div class="uq-container">
                                <div class="uq-hero__content" data-testid="hero-words-words-wrapper">
                                    <h1 class="uq-hero__title" data-testid="hero-text">${h1Text}</h1>
                                    <div class="uq-hero__description"></div>
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

    function addAZNavigationToSomePages() {
        function insertAZIntoDocument(indexElement) {
            const wrappingElement = 'div'; // nav
            const azList = `<${wrappingElement} class="uq-alpha-nav" aria-label="Navigate by alphabet">
                <ul class="uq-pagination">
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="A">A</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="B">B</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="C">C</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="D">D</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="E">E</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="F">F</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="G">G</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="H">H</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="I">I</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="J">J</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="K">K</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="L">L</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="M">M</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="N">N</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="O">O</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="P">P</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="Q">Q</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="R">R</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="S">S</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="T">T</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="U">U</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="V">V</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="W">W</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="X">X</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="Y">Y</a></li>
                    <li class="uq-pagination__item"><a class="uq-pagination__link" data-label="Z">Z</a></li>
                </ul>
            </${wrappingElement}>`;
            const template = document.createElement('template');
            template.innerHTML = azList;
            !!indexElement && indexElement.appendChild(template.content);
        }

        // temporary code for subdomain
        const springshareBanner = document.getElementById('s-lib-banner');
        !!springshareBanner && springshareBanner.remove();

        /*
        html like the following is included on the page template
        <div id="a-z-index" data-for="a-z-list"></div>
        the data-for value matches the id of the element that parents the a-z block
         */

        const indexElement = document.getElementById('a-z-index');
        const listIndex = !!indexElement && indexElement.dataset.for;
        const alphaBlocks = !!listIndex && document.querySelectorAll(`#${listIndex} > div > div`);

        // if (!alphaBlocks) {
        //     return; // this page does not have an a-z index (or its wrongly built, see example html above)
        // }

        !!indexElement && indexElement.classList.add('uql-az-index');
        !!indexElement && insertAZIntoDocument(indexElement);

        !!alphaBlocks &&
            alphaBlocks.forEach((l) => {
                const h2Title = l.querySelector('h2');
                const azLink = !!h2Title?.textContent && document.querySelector(`[data-label=${h2Title.textContent}]`);
                !!l?.id && !!azLink && (azLink.href = `#${l.id}`);
            });
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

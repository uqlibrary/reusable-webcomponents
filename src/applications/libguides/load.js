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
            const params = new URLSearchParams(window.location.search);
            const value = params.get(key);
            return value;
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
        if (!!document.currentScript?.src) {
            if (searchParameters.getValue('override') === 'on' && searchParameters.getValue('skipScript') === 'on') {
                // to stop reusable being loaded, call it like this.
                // https://guides.library.uq.edu.au/?override=on&skipScript=on
                // You can then manually load things in the console
                return;
            }
            console.log('document.currentScript.src=', document.currentScript.src);
            const assetsHostname = 'assets.library.uq.edu.au';
            const assetsRoot = 'https://' + assetsHostname;
            const includeFilename = 'applications/libguides/load.js';

            const scriptNameStaging = assetsRoot + '/reusable-webcomponents-staging/' + includeFilename;
            if (forceStaging() && document.currentScript.src !== scriptNameStaging) {
                // we don't have a staging environment on guides, but we can use this override to test things
                // eg https://guides.library.uq.edu.au/how-to-find/news-and-newspapers?override=on&useAlternate=staging
                insertScript(scriptNameStaging, true);
                return;
            }

            const featureBranchName = getFeatureBranchName();
            const scriptNameFeature = `${assetsRoot}/reusable-webcomponents-development/${featureBranchName}/${includeFilename}`;
            if (forceFeatureBranch() && document.currentScript.src !== scriptNameFeature) {
                // for development testing on feature branch - force Staging (useAlternate=staging) longer term instead
                // eg https://guides.library.uq.edu.au/how-to-find/news-and-newspapers?override=on&useAlternate=working&branchName=featureBranchName
                insertScript(scriptNameFeature, true);
                return;
            }
        }
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function applyUQLItemsToGuides() {
        if (window.location.hostname === 'localhost') {
            testIncludePathGeneration();
        }

        if (!!isInEditMode()) {
            // we dont need any UQ styling on the edit pages
            return;
        }

        fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
        fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
        fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
        fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

        let scriptUrl = getIncludeFullPath('uq-lib-reusable.min.js');
        insertScript(scriptUrl, true);

        const waitForBody = setInterval(() => {
            prePurpleLinks();

            closeAllUqAccordions();

            replaceSpringShareSidebarMenu();

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

                const authButton = createAuthButton();
                !!siteHeader && !!authButton && siteHeader.appendChild(authButton);

                moveSpringshareBreadcrumbsToSiteHeader(siteHeader);
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

            if (!document.querySelector('uq-footer')) {
                const subFooter = document.createElement('uq-footer');
                document.body.appendChild(subFooter);
            }

            addHeroHeader();

            addAZNavigationToSomePages();
        }, 100);
    }

    function isInEditMode() {
        // temp for 2025 dev
        if (window.location.hostname === 'springycommunity.libapps.com') {
            return true;
        }
        if (window.location.hostname === 'uq.libapps.com' && window.location.pathname.startsWith('/libguides/admin')) {
            return true;
        }
        return false;
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
            window.location.host === 'customertesting6.libguides.com' ||
            window.location.host === 'springycommunity.libapps.com' ||
            window.location.host === 'uq.libapps.com' ||
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
        console.log('moveSpringshareBreadcrumbsToSiteHeader start', siteHeader);
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
        console.log('moveSpringshareBreadcrumbsToSiteHeader end', siteHeader);
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

    function replaceSpringShareSidebarMenu() {
        // const currentUrl = `${document.location.origin}${document.location.pathname}`;

        function replaceWord(word) {
            const correctionsList = [
                { incorrect: 'Uqespace', correct: 'UQ eSpace' },
                { incorrect: 'Library Home', correct: 'Library' },
                { incorrect: 'Library Guides', correct: 'Guides' },
            ];
            let correctedText = word;

            for (const correction of correctionsList) {
                if (correctedText.includes(correction.incorrect)) {
                    const regex = new RegExp(correction.incorrect, 'g');
                    correctedText = correctedText.replace(regex, correction.correct);
                }
            }
            return correctedText;
        }

        function extractLinksFromDiv(divQuerySelector) {
            // this ignores links with a hash fragment - springshare puts them in the sidebar, but UQ DS doesn't
            const targetDiv = document.querySelector(divQuerySelector);
            console.log('extractLinksFromDiv', divQuerySelector, targetDiv);
            if (!targetDiv) {
                // console.log(`Div matching "${divQuerySelector}" not found`);
                return [];
            }

            const links = targetDiv.querySelectorAll('a[href]');
            const linkMap = new Map();

            Array.from(links).forEach((link, index) => {
                const href = link.href;
                const linkTextContent = link.textContent.trim();
                const hasFragment = href.includes('#');

                // Get base URL without fragment
                const url = new URL(href);
                let urlPath = url.pathname;
                if (url.search !== '') {
                    // urlPath += url.search;
                    // temp menu debug - uncomment above and delete after dev 2025
                    const searchP = url.search.replace('&override=on&skipScript=on', '');
                    urlPath += searchP;
                }
                const baseHref = url.origin + urlPath;

                let level;
                if (index < Array.from(links).length - 1) level = 'grandparent';
                else if (index === Array.from(links).length - 1) level = 'parent';
                else level = 'current';
                console.log('extractLinksFromDiv', index, Array.from(links).length, baseHref, level, urlPath);

                if (!linkMap.has(baseHref)) {
                    // First occurrence - add it
                    linkMap.set(baseHref, {
                        href: baseHref,
                        linkLabel: replaceWord(linkTextContent),
                        urlPath: urlPath,
                        // title: link.title || linkTextContent,
                        hasFragment: hasFragment,
                        level: level,
                    });
                } else {
                    // Duplicate found - keep the one without fragment, or first one if both have fragments
                    const existing = linkMap.get(baseHref);
                    if (existing.hasFragment && !hasFragment) {
                        // Replace with non-fragment version
                        linkMap.set(baseHref, {
                            href: baseHref,
                            linkLabel: replaceWord(linkTextContent),
                            urlPath: urlPath,
                            // title: link.title || linkTextContent,
                            hasFragment: false,
                            level: level,
                        });
                    }
                    // If existing doesn't have fragment, keep it (ignore current)
                }
            });

            return Array.from(linkMap.values());
        }

        // Build navigation HTML structure
        function buildNavigationHtml(linksFromExistingSidebar, parentLinksFromBreadcrumbs) {
            console.log('buildNavigationHtml links=', linksFromExistingSidebar);
            const currentPath = `${document.location.pathname}${document.location.search}`;

            // Group links by their path depth relative to current URL
            const groupedLinks = {
                siblings: [],
                children: [],
            };

            linksFromExistingSidebar.forEach((link) => {
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
                            href: linkPath,
                            isActive: linkPath === currentPath,
                        });
                    } else if (linkParts.length === currentParts.length + 1 && linkPath.startsWith(currentPath)) {
                        // One level deeper (children)
                        groupedLinks.children.push({
                            ...link,
                            href: linkPath,
                            isActive: false,
                        });
                    }
                } catch (e) {
                    // Handle relative URLs
                    groupedLinks.siblings.push({
                        ...link,
                        href: link.href,
                        isActive: false,
                    });
                }
            });

            // Build HTML structure
            let html = `<div id="uq-sidebar-layout__sidebar" class="uq-sidebar-layout__sidebar">
        <div id="local-nav-app" data-once="local-nav">
        <nav class="uq-local-nav" aria-label="Local navigation">
            <div class="uq-local-nav__grandparent"><a href="https://uq.edu.au/" class="uq-local-nav__link">UQ home</a></div>`;

            // Add hierarchy breadcrumbs
            console.log('parentLinksFromBreadcrumbs=', parentLinksFromBreadcrumbs);
            console.log('groupedLinks=', groupedLinks);
            parentLinksFromBreadcrumbs.forEach((item, index) => {
                console.log('parentLinksFromBreadcrumbs foreach item', index, item);
                const siblingPaths = groupedLinks.siblings.map((item) => item.href);
                console.log('siblingPaths=', siblingPaths);
                // dont include ones that are in the child list
                if (siblingPaths.includes(item.urlPath)) {
                    console.log('known, skip', item);
                    return;
                }

                if (item.level === 'grandparent') {
                    console.log('grandparent');
                    html += `<div class="uq-local-nav__grandparent"><a href="${item.href}" class="uq-local-nav__link">${item.linkLabel}</a></div>`;
                } else if (item.level === 'parent') {
                    console.log('parent');
                    html += `<div class="uq-local-nav__parent"><a href="${item.href}" class="uq-local-nav__link">${item.linkLabel}</a></div>`;
                } else {
                    console.log('child - skip html');
                }
                console.log('parentLinksFromBreadcrumbs foreach result', index, html);
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

                    html += `<li class="uq-local-nav__child${activeClass}${hasChildrenClass}"><a href="${link.href}" class="uq-local-nav__link${linkActiveClass}">${link.linkLabel}</a>`;

                    // Add grandchildren if this is the active item
                    if (hasChildren) {
                        html += `<ul class="uq-local-nav__grandchildren">`;

                        groupedLinks.children.forEach((child) => {
                            html += `
                        <li class="uq-local-nav__grandchild"><a href="${child.href}" class="uq-local-nav__link">${child.linkLabel}</a></li>`;
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

        const menuDone = document.getElementById('uq-sidebar-layout__sidebar');
        if (!!menuDone) {
            return;
        }

        const menuQuerySelector = '#s-lg-guide-tabs .nav-pills';
        const linksinCurrentSidebar = extractLinksFromDiv(menuQuerySelector);
        console.log('linksinCurrentSidebar=', linksinCurrentSidebar);

        // let test = 'nav[aria-label="breadcrumb"]';
        // const targetDiv = document.querySelector(test);
        // console.log('1', targetDiv);
        // if (!targetDiv) {
        //     let test = 'nav[aria-label="breadcrumb"]';
        //     const targetDiv = document.querySelector(test);
        //     console.log('2', targetDiv);
        // }

        const parentLinksFromBreadcrumbs = extractLinksFromDiv('nav[aria-label="breadcrumb"]');

        const navigationHtml = buildNavigationHtml(linksinCurrentSidebar, parentLinksFromBreadcrumbs);

        const originalDiv = document.querySelector(menuQuerySelector);
        !!originalDiv && (originalDiv.outerHTML = navigationHtml);
    }

    function addHeroHeader() {
        // move the hero image up higher so it can go full width on the homepage
        const siblingBlock = document.querySelector('[href="#s-lib-public-main"]');
        const heroDiv = document.getElementById('guides-library-hero');
        !!siblingBlock && !!heroDiv && siblingBlock.after(heroDiv);

        // (on non-homepage) move the existing h1 into a hero structure
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
            const azList = `<${wrappingElement} class="uq-alpha-nav uq-pagination" aria-label="Navigate by alphabet">
                    <ul class="uq-pagination__list">
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="A">A</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="B">B</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="C">C</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="D">D</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="E">E</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="F">F</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="G">G</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="H">H</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="I">I</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="J">J</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="K">K</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="L">L</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="M">M</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="N">N</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="O">O</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="P">P</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="Q">Q</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="R">R</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="S">S</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="T">T</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="U">U</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="V">V</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="W">W</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="X">X</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="Y">Y</a></li>
                        <li class="uq-pagination__list-item"><a class="uq-pagination__item" data-label="Z">Z</a></li>
                    </ul>
            </${wrappingElement}>`;
            const template = document.createElement('template');
            template.innerHTML = azList;
            !!indexElement && indexElement.appendChild(template.content);
        }

        // temporary code for subdomain - 2025 dev
        const springshareBanner = document.getElementById('s-lib-banner');
        !!springshareBanner && springshareBanner.remove();

        /*
        html like the following is included on the page template
        <div id="a-z-index" data-for="a-z-list"></div>
        the data-for value matches the id of the element that parents the a-z block:
        <div class="clearfix can-scroll-to-top" id="a-z-list">
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

        // add a "scroll to top" arrow to the left of each letter-box
        const boxes = document.querySelectorAll('.can-scroll-to-top > div');
        !!boxes &&
            boxes.forEach((box, index) => {
                const h2Element = box.querySelector('h2.s-lib-box-title');
                let newHTML;
                if (h2Element) {
                    const h2Content = h2Element.innerHTML;
                    newHTML = `<div class="h2-arrow-wrapper"><a title="Scroll to top" href="#" class="uparrow" onclick="scrollToTop()"></a><h2 class="s-lib-box-title">${h2Content}</h2></div>`;
                    if (index === 0) {
                        // no link on the first one, but occupy the space
                        newHTML = `<div class="h2-arrow-wrapper"><span class="uparrow"></span><h2 class="s-lib-box-title">${h2Content}</h2></div>`;
                    }
                    h2Element.outerHTML = newHTML;
                }
            });
        function scrollToTop() {
            document.activeElement.blur();
            const topOfPage = document.getElementById('a-z-index');
            !!topOfPage && topOfPage.scrollIntoView();
        }
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

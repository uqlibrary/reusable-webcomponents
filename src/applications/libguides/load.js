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

    const currentScriptSrc = document.currentScript?.src || false;

    function ready(fn) {
        if (!!document.currentScript?.src) {
            if (searchParameters.getValue('override') === 'on' && searchParameters.getValue('skipScript') === 'on') {
                // to stop reusable being loaded, call it like this.
                // https://guides.library.uq.edu.au/?override=on&skipScript=on
                // You can then manually load things in the console
                return;
            }
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

        fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
        fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
        fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
        fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

        let scriptUrl = getIncludeFullPath('uq-lib-reusable.min.js');
        insertScript(scriptUrl, true);

        const cssFileName = getIncludeFullPath('applications/libguides/custom-styles.css');
        insertCssFile(cssFileName);

        const waitForBody = setInterval(() => {
            const firstElement = document.body.children[0];
            if (!firstElement) {
                return;
            }
            clearInterval(waitForBody);

            if (!isInEditMode()) {
                prePurpleLinks();
            } else {
                !document.body.classList.contains('editmode') && document.body.classList.add('editmode');
            }

            replaceTabsWithAccordion();

            closeAllUqAccordions();

            replaceSpringShareSidebarMenu();

            if (!isInEditMode()) {
                const gtm = document.createElement('uq-gtm');
                !!gtm && gtm.setAttribute('gtm', 'GTM-NC7M38Q');
                document.body.insertBefore(gtm, firstElement);

                if (!document.querySelector('uq-header')) {
                    const header = document.createElement('uq-header');
                    !!header && header.setAttribute('hideLibraryMenuItem', '');
                    !!header && header.setAttribute('searchurl', 'guides.library.uq.edu.au');
                    document.body.insertBefore(header, firstElement);
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
            }

            addHeroHeader();

            addAZNavigationToSomePages();

            fixNextPrevButtons();

            removeEmptyParagraphs();

            // they want to see our components on the edit page, but sometimes it needs a little space
            if (!!isInEditMode()) {
                const editModeStylesId = 'editModeStyles';
                const editModeStylesElement = document.getElementById(editModeStylesId);
                if (!!editModeStylesElement) {
                    editModeStylesElement.remove();
                }
                const editModeStyles = document.createElement('template');
                editModeStyles.innerHTML = `<style id="${editModeStylesId}">
                        #s-lg-row-1 > div:first-child {
                            margin-top: 50px;
                        }
                        #acctlinks {
                            margin-top: -35px;
                        }
                        #guides-library-hero {
                            margin-top: 50px;
                        } 
                 </style>`;

                const head = document.querySelector('head');
                !!head && head.appendChild(editModeStyles.content.cloneNode(true));
            }
        }, 100);
    }

    function fixNextPrevButtons() {
        const listLinks = document.querySelectorAll('#s-lg-page-prevnext a');
        !!listLinks &&
            listLinks.forEach((anchor) => {
                const currentHTML = anchor.innerHTML;
                const newHTML = currentHTML.replace(/<strong>(.*?)<\/strong>/g, '$1');
                anchor.innerHTML = newHTML;
            });
    }

    function isInEditMode() {
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

        const head = document.head;
        !!head && !!link && head.appendChild(link);
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

    // Guides are authored by many, many uq staff and Library staff found it hard to police how they use it.
    // Some of them use the built-in Springshare tabs, which have truly horrible accesssability!
    // but they have a very nice tie between heading and content, which is just what an accordion has
    // so we can magically replace each tab with a uq-standard accordion
    function replaceTabsWithAccordion() {
        const hasTabs = document.querySelector('[role="tablist"]');
        if (!hasTabs) {
            return;
        }

        const isAdminPage = document.querySelector('header.navbar');
        if (isAdminPage) {
            return;
        }

        const htmlAccordionTemplate = `<div class="uq-accordion__item">  
            <button aria-controls="MATCHING_ID" aria-expanded="true" aria-haspopup="true" onclick="toggleAccordionPanel(this)" class="uq-accordion__toggle uq-accordion__toggle--active">BUTTON_TITLE</button> 
            <div id="MATCHING_ID" class="uq-accordion__content uq-accordion__content--active uq-accordion__content-wrapper"> 
                CONTENT_HERE
            </div> 
        </div> `;

        const listTabBlocks = document.querySelectorAll('[role="tablist"]');
        !!listTabBlocks &&
            listTabBlocks.forEach((tabBlock, index1) => {
                const box = tabBlock.closest('.s-lib-box.s-lib-box-std');
                const contentBox = tabBlock.closest('.s-lib-box-content');

                const hasExternalH2 = box.innerHTML.includes('<h2') && !contentBox.innerHTML.includes('<h2');

                const listButtons = tabBlock.querySelectorAll('[role="tablist"] [aria-controls]');

                let contents = '';
                !!listButtons &&
                    listButtons.forEach((button, index) => {
                        let buttonLabel = button.textContent;
                        const linkedId = button.href;
                        const newUrl = new URL(linkedId);
                        const linkedItem = document.querySelector(newUrl.hash);
                        let linkedItemContent = linkedItem.innerHTML;

                        // sometimes the contents include an iframe. This wasn't copying properly. Pull them early and reinsert them later
                        const extractedIframes = [];
                        linkedItemContent = extractIframes(linkedItemContent, extractedIframes);

                        // the auto-springshare tool doesn't put a heading in the button
                        // so make the heading hierarchy correct!
                        if (!!hasExternalH2) {
                            linkedItemContent = linkedItemContent.replaceAll('h5', 'h6');
                            linkedItemContent = linkedItemContent.replaceAll('h4', 'h5');
                            linkedItemContent = linkedItemContent.replaceAll('h3', 'h4');
                        } else {
                            linkedItemContent = linkedItemContent.replaceAll('h5', 'h6');
                            linkedItemContent = linkedItemContent.replaceAll('h4', 'h5');
                            linkedItemContent = linkedItemContent.replaceAll('h3', 'h4');
                            linkedItemContent = linkedItemContent.replaceAll('h2', 'h3');
                        }

                        buttonLabel = !!hasExternalH2 ? `<h3>${buttonLabel}</h3>` : `<h2>${buttonLabel}</h2>`;

                        const hash = newUrl.hash.replace('#', '');
                        let accordionBody = htmlAccordionTemplate.repeat(1); // hack to use htmlAccordionTemplate for each box
                        accordionBody = accordionBody.replace('MATCHING_ID', hash);
                        accordionBody = accordionBody.replace('MATCHING_ID', hash);
                        accordionBody = accordionBody.replace('CONTENT_HERE', linkedItemContent);
                        accordionBody = reinsertIframes(accordionBody, extractedIframes);

                        accordionBody = accordionBody.replace('BUTTON_TITLE', buttonLabel);

                        contents += accordionBody;
                    });
                const newAccordion = document.createElement('template');
                newAccordion.innerHTML = `<div class="uq-accordion">${contents}</div>`;

                const parent = tabBlock.parentElement.parentElement;
                parent.appendChild(newAccordion.content.cloneNode(true));

                tabBlock.parentElement.remove();
            });

        /**
         * Extracts iframes from HTML content and replaces them with placeholders
         * @param {string} htmlContent - The HTML content to process
         * @param {Array} extractedIframes - Array to store the extracted iframes
         * @returns {string} - The HTML content with iframes replaced by placeholders
         */
        function extractIframes(htmlContent, extractedIframes) {
            // Create a temporary div to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            // Find all iframes in the content
            const iframes = tempDiv.querySelectorAll('iframe');

            // Process each iframe
            iframes.forEach((iframe, index) => {
                // Create a unique placeholder ID
                const placeholderId = `iframe-placeholder-${Date.now()}-${index}`;

                // Store the iframe HTML
                extractedIframes.push({
                    id: placeholderId,
                    html: iframe.outerHTML,
                });

                // Replace the iframe with a placeholder
                const placeholder = document.createElement('div');
                placeholder.setAttribute('data-iframe-placeholder', placeholderId);
                iframe.parentNode.replaceChild(placeholder, iframe);
            });

            return tempDiv.innerHTML;
        }

        /**
         * Reinserts iframes back into the HTML content
         * @param {string} htmlContent - The HTML content with placeholders
         * @param {Array} extractedIframes - Array of extracted iframes
         * @returns {string} - The HTML content with iframes reinserted
         */
        function reinsertIframes(htmlContent, extractedIframes) {
            let processedContent = htmlContent;

            // Replace each placeholder with its corresponding iframe
            extractedIframes.forEach((iframe) => {
                const placeholderRegex = new RegExp(`<div data-iframe-placeholder="${iframe.id}"></div>`, 'g');
                processedContent = processedContent.replace(placeholderRegex, iframe.html);
            });

            return processedContent;
        }
    }

    function replaceSpringShareSidebarMenu() {
        const menuDone = document.getElementById('uq-sidebar-layout__sidebar');
        if (!!menuDone) {
            return;
        }

        function styleSidebarPerUQ() {
            const isAdminPage = document.querySelector('header.navbar');
            if (isAdminPage) {
                return;
            }

            const constructedTree = [];

            // extract all the list items (and its anchor child) from the sidebar menu, in a tree structure
            const treeChildren = document.querySelectorAll('ul.split-button-nav > li');
            !!treeChildren &&
                treeChildren.forEach((child, index) => {
                    const details = getTreeChildDetails(child, index === 0);
                    if (details) {
                        constructedTree.push(details);
                    }
                });

            // rebuild the UQ style html from the tree of listitems
            const firstChild = constructedTree.shift();
            !!firstChild && (firstChild.hasChildren = true);
            let htmlTree = '';
            if (!!firstChild && firstChild.isCurrentPage) {
                // the current page is the first page in the sidebar - make the other items its child
                firstChild.children = constructedTree;
                htmlTree += '<ul class="uq-local-nav__children">';
                htmlTree += addChildToHtmlTree(firstChild, true);
                htmlTree += '</ul>';
            } else if (
                constructedTree.some(
                    (item) =>
                        item.children &&
                        Array.isArray(item.children) &&
                        item.children.some((child) => child.isCurrentPage),
                )
            ) {
                // the current page is a grandchild element - put the higher level ones as backArrow divs at the top
                // we don't include the sibling elements
                const theparent = constructedTree.find(
                    (item) =>
                        item.children &&
                        Array.isArray(item.children) &&
                        item.children.some((child) => child.isCurrentPage),
                );

                htmlTree +=
                    !!firstChild &&
                    `<div class="uq-local-nav__grandparent"><a href="${firstChild.href}" class="uq-local-nav__link">${firstChild.title}</a></div>`;
                htmlTree += `<div class="uq-local-nav__parent"><a href="${theparent.href}" class="uq-local-nav__link">${theparent.title}</a></div>`;
                htmlTree += '<ul class="uq-local-nav__children">';
                !!theparent &&
                    theparent.children.forEach((child) => {
                        const canHaveGrandchildren =
                            child?.isCurrentPage ||
                            (child?.hasChildren && child.children.some((child) => child.isCurrentPage));
                        htmlTree += addChildToHtmlTree(child, canHaveGrandchildren);
                    });
                htmlTree += '</ul>';
            } else {
                // just a regular child link - first link as backArrow div
                htmlTree +=
                    !!firstChild &&
                    `<div class="uq-local-nav__parent"><a href="${firstChild.href}" class="uq-local-nav__link">${firstChild.title}</a></div>`;
                htmlTree += '<ul class="uq-local-nav__children">';
                !!constructedTree &&
                    constructedTree.forEach((child) => {
                        const canHaveGrandchildren =
                            child.isCurrentPage ||
                            (child?.hasChildren && child.children.some((child) => child.isCurrentPage));
                        htmlTree += addChildToHtmlTree(child, canHaveGrandchildren);
                    });
                htmlTree += '</ul>';
            }
            htmlTree = getBreadcrumbsNeededInSidebar(!!firstChild && !!firstChild.isCurrentPage) + htmlTree;

            const templateElement = document.createElement('template');
            templateElement.innerHTML = htmlTree.trim();

            // find the root of the existing sidebar menu and replace with our shiny new html
            const navElement = document.querySelector('.split-button-nav');
            !!navElement && navElement.replaceWith(...templateElement.content.childNodes);

            // add an entry to the new html tree
            function addChildToHtmlTree(child, canHaveGrandchildren = false) {
                let htmlTree = '';
                let liClasses = child?.hasChildren
                    ? 'uq-local-nav__child uq-local-nav--has-children'
                    : 'uq-local-nav__child';
                if (child.isCurrentPage) {
                    liClasses += ' uq-local-nav--current-child';
                }
                const hrefClasses = child.isCurrentPage
                    ? 'uq-local-nav__link uq-local-nav--active-link'
                    : 'uq-local-nav__link';
                htmlTree += `<li class="${liClasses}">`;
                htmlTree += `<a href="${child.href}" class="${hrefClasses}">${child.title}</a>`;
                if (!!canHaveGrandchildren && child?.hasChildren) {
                    htmlTree += '<ul class="uq-local-nav__grandchildren">';
                    !!child.children &&
                        child.children.forEach((grandchild) => {
                            htmlTree += addChildToHtmlTree(grandchild, grandchild.isCurrentPage);
                        });
                    htmlTree += '</ul>';
                }
                htmlTree += `</li>`;
                return htmlTree;
            }

            // extract the details of each link in the sidebar
            function getTreeChildDetails(child, isVeryFirstChild = false) {
                const anchor = child.querySelector('a');
                const record = {
                    title: anchor.innerText,
                    href: anchor.href,
                    currentPage: window.location.href,
                    children: [],
                    hasChildren: false,
                    isCurrentPage:
                        anchor.href.trim() === window.location.href.trim() ||
                        child.classList.contains('active') ||
                        anchor.classList.contains('active'),
                };
                if (isVeryFirstChild) {
                    const veryFirstAnchor = child.querySelector(':scope > ul > li:first-child > a:first-child');
                    const parentLi = !!veryFirstAnchor && veryFirstAnchor.parentNode;
                    const firstGrandchild = !!parentLi && parentLi.querySelector('ul li:first-child a');
                    if (!!firstGrandchild) {
                        // use the link from the first internal link in the local nav block
                        // (Springshare are supplying 2 links to this page and we are trying to get around the SEO issues of that by never linking to the dupe)
                        const link = new URL(firstGrandchild.href);
                        record.href = `${link.origin}${link.pathname}${link.search}`;
                    } else {
                        // otherwise, when we arent on that first page that has the grandchilden, truncate the current url
                        // (author guideline: "our format is https://guides.library.uq.edu.au/group-name/guide-title/page-name")
                        const url = window.location;
                        const pathname = url.pathname.substring(0, url.pathname.lastIndexOf('/'));
                        record.href = `${url.origin}${pathname}${url.search}`;
                    }

                    // use the page title as the first link
                    const h1 = document.querySelector('h1#s-lg-guide-name');
                    !!h1 && (record.title = h1.textContent);
                }

                if (hasHashLink(anchor.href)) {
                    return;
                }

                const grandchildren = child.querySelectorAll(':scope ul li');
                !!grandchildren &&
                    grandchildren.forEach((grandchild, index) => {
                        const grandchildDetails = getTreeChildDetails(grandchild);
                        if (grandchildDetails) {
                            record.children.push(grandchildDetails);
                            record.hasChildren = true;
                        }
                    });

                return record;
            }

            function hasHashLink(href) {
                const url = new URL(href);
                return url.hash !== '';
            }

            function getBreadcrumbsNeededInSidebar(parentElementRequired) {
                const rootLink = document.querySelector(
                    'div.uq-local-nav__grandparent a[href="https://www.library.uq.edu.au/"]',
                );
                if (!!rootLink) {
                    // breadcrumbs already exist
                    return;
                }

                let parentLinksFromBreadcrumbs = document.querySelectorAll('nav[aria-label="breadcrumb"] a[href]');
                if (!parentLinksFromBreadcrumbs) {
                    parentLinksFromBreadcrumbs = document.querySelectorAll('nav[aria-label="Breadcrumb"] a[href]');
                }
                parentLinksFromBreadcrumbs = Array.from(parentLinksFromBreadcrumbs);

                const parentTemplate = (classNameBreadcrumb, href, textContent) => {
                    return `<div class="${classNameBreadcrumb}"><a href="${href}" class="uq-local-nav__link">${textContent}</a></div>`;
                };

                let classNameBreadcrumb = 'uq-local-nav__grandparent';
                let htmlToInsert = '';
                htmlToInsert += parentTemplate(classNameBreadcrumb, 'https://uq.edu.au/', 'UQ home');
                htmlToInsert += parentTemplate(classNameBreadcrumb, 'https://www.library.uq.edu.au/', 'Library');

                parentLinksFromBreadcrumbs.shift(); // remove that initial Library link that we have just hardcoded

                const breadcrumbLength = 2;
                const breadcrumbsToUse = parentLinksFromBreadcrumbs.slice(0, breadcrumbLength);
                !!breadcrumbsToUse &&
                    breadcrumbsToUse.forEach((link, index) => {
                        if (!!parentElementRequired && index === breadcrumbLength - 1) {
                            classNameBreadcrumb = 'uq-local-nav__parent';
                        }
                        htmlToInsert += parentTemplate(classNameBreadcrumb, link.href, link.textContent);
                    });
                return htmlToInsert;
            }
        }

        styleSidebarPerUQ();
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
        if (!h1Element) {
            h1Element = document.querySelector('#s-lib-public-header h1'); // 404 search page
        }
        const h1Text = !!h1Element && h1Element.textContent;

        if (!h1Text) {
            // no h1 found to move
            return;
        }
        if (!isInEditMode()) {
            !!h1Element && h1Element.remove();
        }

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
        !!sibling && sibling.parentNode.insertBefore(template.content.cloneNode(true), sibling.nextSibling);

        // make the guide description be the subtitle on the hero image
        const strapline = document.getElementById('s-lg-guide-description');
        const editPageDescriptionPlaceholder = '[Click to enter a description]';
        const straplineContent =
            !!strapline && strapline.textContent !== editPageDescriptionPlaceholder && strapline.textContent;
        const heroPlacement = document.querySelector('.uq-hero__description');
        !!straplineContent && !!heroPlacement && (heroPlacement.textContent = straplineContent);
        if (!isInEditMode() && !!straplineContent && !!heroPlacement) {
            !!strapline && strapline.remove();
            const straplineWrapper = document.getElementById('s-lg-guide-desc-container');
            !!strapline && !!straplineWrapper && straplineWrapper.remove();
        }
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

        /*
        html like the following is included on the page template
        <div id="a-z-index" data-for="a-z-list"></div>
        the data-for value matches the id of the element that parents the a-z block:
        <div class="clearfix can-scroll-to-top" id="a-z-list">
         */

        const indexElement = document.getElementById('a-z-index');
        const listIndex = !!indexElement && indexElement.dataset.for;
        const alphaBlocks = !!listIndex && document.querySelectorAll(`#${listIndex} > div > div`);

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
                    newHTML = `<div class="h2-arrow-wrapper"><a title="Scroll to top" href="#" class="uparrow" onclick="{
        document.activeElement.blur(); const topOfPage = document.getElementById('a-z-index'); !!topOfPage && topOfPage.scrollIntoView();
    }"></a><h2 class="s-lib-box-title">${h2Content}</h2></div>`;
                    if (index === 0) {
                        // no link on the first one, but occupy the space
                        newHTML = `<div class="h2-arrow-wrapper"><span class="uparrow"></span><h2 class="s-lib-box-title">${h2Content}</h2></div>`;
                    }
                    h2Element.outerHTML = newHTML;
                }
            });
    }

    // unfortunately, the GUI editor sometimes leaves blank paragraphs (all they have to do is press return at the end of the gui and *boom* empty para!)
    // clean them out as they ruin our layout!
    function removeEmptyParagraphs() {
        const elements = document.querySelectorAll('p');
        !!elements &&
            elements.length > 0 &&
            elements.forEach((element) => {
                // Get the text content with whitespace preserved
                const text = element.innerHTML.trim();
                if (
                    text === '' ||
                    text === '&nbsp;' ||
                    text === ' ' ||
                    text === '<br>' ||
                    text === '<br/>' ||
                    text === '<br />'
                ) {
                    console.log('remove empty paragraph');
                    element.remove();
                }
            });
    }

    ready(applyUQLItemsToGuides);
})();

if (!toggleAccordionPanel || typeof toggleAccordionPanel === 'undefined') {
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
}

(function loadGuides() {
    function ready(fn) {
        if (getSearchParam('override') === 'on' && getSearchParam('skipScript') === 'yes') {
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
        if (window.location.host !== 'guides.library.uq.edu.au') {
            testincludePathGeneration();
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

            const gtm = document.createElement('uq-gtm');
            !!gtm && gtm.setAttribute('gtm', 'GTM-NC7M38Q');
            document.body.insertBefore(gtm, firstElement);

            if (!document.querySelector('uq-header')) {
                const header = document.createElement('uq-header');
                !!header && header.setAttribute('hideLibraryMenuItem', '');
                document.body.insertBefore(header, firstElement);
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

            const subFooter = document.createElement('uq-footer');
            document.body.appendChild(subFooter);
        }, 100);
    }

    function getSearchParam(name, value) {
        const url = window.location.href;
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        return params.get(name);
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
        return getSearchParam('override') === 'on' && getSearchParam('useAlternate') === 'staging';
    }

    function forceFeatureBranch() {
        return getSearchParam('override') === 'on' && getSearchParam('useAlternate') === 'working';
    }

    function getFeatureBranchName() {
        return forceFeatureBranch() ? getSearchParam('branchName') : '';
    }

    // we can use parameters to force our css and js to come from staging or feature branch locations
    // default is assets production
    function getIncludeFullPath(
        includeFilename,
        _overrideHost = null,
        _overridePathname = null,
        _overrideHref = null,
        _featureBranchName = null,
    ) {
        // override values only used for testing this function
        const overrideHost = _overrideHost === null ? window.location.host : _overrideHost; // domain
        const overridePathname = _overridePathname === null ? window.location.pathname : _overridePathname;
        const overrideHref = _overrideHref === null ? window.location.href : _overrideHref;
        const featureBranchName = _featureBranchName === null ? getFeatureBranchName() : _featureBranchName;

        const assetsHostname = 'assets.library.uq.edu.au';
        const assetsRoot = 'https://' + assetsHostname;

        if (overrideHost === 'localhost:8080') {
            return '/' + includeFilename;
        }
        if (forceStaging()) {
            // we don't have a staging environment on guides, but we can use this override to test things
            return assetsRoot + '/reusable-webcomponents-staging/' + includeFilename;
        }

        if (forceFeatureBranch()) {
            // for development testing on feature branch - force Staging (useAlternate=staging) longer term
            // eg https://guides.library.uq.edu.au/how-to-find/news-and-newspapers?override=on&useAlternate=working
            return `${assetsRoot}/reusable-webcomponents-development/${featureBranchName}/${includeFilename}`;
        }

        if (window.location.pathname === '/sandbox') {
            // we are on a groups page - 2025 dev
            // TEMPORARY CODE - REMOVE AFTER 2025 REDEV - TODO
            return `${assetsRoot}/reusable-webcomponents-development/${featureBranchName}/${includeFilename}`;
        }

        if (overrideHost === assetsHostname && /reusable-webcomponents-staging/.test(overrideHref)) {
            // a test on staging branch gets staging version
            return assetsRoot + '/reusable-webcomponents-staging/' + includeFilename;
        }
        if (overrideHost === assetsHostname && /reusable-webcomponents-development\/master/.test(overrideHref)) {
            // a test on master branch gets master version
            return assetsRoot + '/reusable-webcomponents-development/master/' + includeFilename;
        }
        if (overrideHost === assetsHostname) {
            // a test on any feature branch gets the feature branch
            return assetsRoot + getPathnameRoot(overridePathname) + includeFilename;
        }

        // otherwise prod
        return assetsRoot + '/reusable-webcomponents/' + includeFilename;
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
                        if (isNotHomepage(href) && document.location.pathname !== '/') {
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
        const link = document.createElement('link');
        !!link && (link.type = 'text/css');
        !!link && (link.rel = 'stylesheet');
        !!link && (link.href = cssFileName);

        const head = document.head;
        !!head && !!link && head.appendChild(link);
    }

    ready(applyUQLItemsToGuides);

    function testincludePathGeneration() {
        // because we cant really test alternate environments, this will dump lines onto the console
        console.log('============================');
        console.log('##### WHEN _NOT_ OVERRIDING (use http://localhost:8080/index-guides.html)');
        const prodUrl = getIncludeFullPath('applications/libguides/load.js', 'guides.library.uq.edu.au', null, null);
        if ('https://assets.library.uq.edu.au/reusable-webcomponents/applications/libguides/load.js' === prodUrl) {
            console.log('prod ok', prodUrl);
        } else {
            console.log('PROD PROBLEM', prodUrl);
        }
        const stagingUrl = getIncludeFullPath(
            'applications/libguides/load.js',
            'assets.library.uq.edu.au',
            null,
            'reusable-webcomponents-staging',
        );
        if (
            'https://assets.library.uq.edu.au/reusable-webcomponents-staging/applications/libguides/load.js' ===
            stagingUrl
        ) {
            console.log('staging ok:', stagingUrl);
        } else {
            console.error('STAGING PROBLEM', stagingUrl);
        }
        const masterUrl = getIncludeFullPath(
            'applications/libguides/load.js',
            'assets.library.uq.edu.au',
            null,
            'reusable-webcomponents-development/master',
        );
        if (
            'https://assets.library.uq.edu.au/reusable-webcomponents-development/master/applications/libguides/load.js' ===
            masterUrl
        ) {
            console.log('master ok:', masterUrl);
        } else {
            console.error('MASTER PROBLEM', masterUrl);
        }

        const featureUrl = getIncludeFullPath(
            'applications/libguides/load.js',
            'assets.library.uq.edu.au',
            `/reusable-webcomponents-development/feature-branch/index-guides.html`,
            `https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-branch/index-guides.html`,
        );
        if (
            `https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-branch/applications/libguides/load.js` ===
            featureUrl
        ) {
            console.log('feature ok:', featureUrl);
        } else {
            console.error('FEATURE PROBLEM', featureUrl);
        }
        console.log('============================');
        console.log('##### WHEN OVERRIDING (http://localhost:8080/index-guides.html?override=on&useAlternate=staging)');
        const overrideUrl = getIncludeFullPath(
            'applications/libguides/load.js',
            'assets.library.uq.edu.au',
            null,
            'reusable-webcomponents-staging',
        );
        if (
            'https://assets.library.uq.edu.au/reusable-webcomponents-staging/applications/libguides/load.js' ===
            overrideUrl
        ) {
            console.log('faux staging ok:', overrideUrl);
        } else {
            console.error('FAUX STAGING PROBLEM', overrideUrl);
        }
        console.log('============================');
    }
})();

(function loadGuides() {
    function getSearchParam(name, value) {
        const url = window.location.href;
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        return params.get(name);
    }

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

    function insertCssFile(fileName) {
        const link = document.createElement('link');
        !!link && (link.type = 'text/css');
        !!link && (link.rel = 'stylesheet');
        !!link && (link.href = fileName);

        const head = document.head;
        !!head && !!link && head.appendChild(link);
    }

    function getIncludeFullPath(includeFilename, _overrideHost = null, _overridePathname = null, _overrideHref = null) {
        const overrideHost = _overrideHost === null ? window.location.host : _overrideHost;
        const overridePathname = _overridePathname === null ? window.location.pathname : _overridePathname;
        const overrideHref = _overrideHref === null ? window.location.href : _overrideHref;

        const assetsHostname = 'assets.library.uq.edu.au';
        const assetsRoot = 'https://' + assetsHostname;

        if (overrideHost === 'localhost:8080') {
            return '/' + includeFilename;
        }
        if (useStaging()) {
            // we don't have a staging environemnt on guides, so we use this override to test things
            return assetsRoot + '/reusable-webcomponents-staging/' + includeFilename;
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

    function useStaging() {
        // guides does not have a staging environment, but we can force a load from assets staging by calling it like this:
        // https://guides.library.uq.edu.au/?override=on&useAlternate=staging
        return getSearchParam('override') === 'on' && getSearchParam('useAlternate') === 'staging';
    }

    fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    let scriptUrl = getIncludeFullPath('uq-lib-reusable.min.js');
    console.log('real (unused) scriptUrl=', scriptUrl);
    // to test on feature branch - use useAlternate=staging longer term
    const featureBranchName = 'webpresence-working';
    if (getSearchParam('override') === 'on' && getSearchParam('useAlternate') === 'working') {
        // eg https://guides.library.uq.edu.au/how-to-find/news-and-newspapers?override=on&useAlternate=working
        // update these paths for your current feature branch
        scriptUrl = getIncludeFullPath(
            'uq-lib-reusable.min.js',
            'assets.library.uq.edu.au',
            `/reusable-webcomponents-development/${featureBranchName}/index-guides.html`,
            `https://assets.library.uq.edu.au/reusable-webcomponents-development/${featureBranchName}/index-guides.html`,
        );
        console.log('working scriptUrl=', scriptUrl);
    }
    insertScript(scriptUrl, true);

    let cssFile = getIncludeFullPath('applications/libguides/custom-styles.css');
    console.log('cssFile=', cssFile);
    if (getSearchParam('override') === 'on' && getSearchParam('useAlternate') === 'working') {
        // 2024 test
        cssFile = scriptUrl = getIncludeFullPath(
            'applications/libguides/custom-styles.css',
            'assets.library.uq.edu.au',
            `/reusable-webcomponents-development/${featureBranchName}/index-guides.html`,
        );
    } else if (window.location.pathname === '/sandbox') {
        // we are on a groups page - 2025 dev
        cssFile = scriptUrl = getIncludeFullPath(
            'applications/libguides/custom-styles.css',
            'assets.library.uq.edu.au',
            `/reusable-webcomponents-development/guides-AD-111/index-guides.html`,
        );
    }
    insertCssFile(cssFile);

    const firstElement = document.body.children[0];

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

    function loadReusableComponentsLibGuides() {
        insertScript(getIncludeFullPath('applications/libguides/subload.js'), true);
    }

    ready(loadReusableComponentsLibGuides);
})();

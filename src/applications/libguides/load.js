// the "does function exists" checks are only temp during 2024 dev
function getSearchParam2(name, value) {
    const url = window.location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get(name);
}

function ready2(fn) {
    if (getSearchParam2('override') === 'on' && getSearchParam2('skipScript') === 'yes') {
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

function isInEditMode2() {
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

function createSlotForButtonInUtilityArea2(button, id = null) {
    const slot = document.createElement('span');
    !!slot && slot.setAttribute('slot', 'site-utilities');
    !!slot && !!id && slot.setAttribute('id', id);
    !!button && !!slot && slot.appendChild(button);

    return slot;
}

function createAuthButton2() {
    if (!!document.querySelector('auth-button')) {
        return false;
    }

    const authButton = document.createElement('auth-button');
    const slot = !!authButton && createSlotForButtonInUtilityArea2(authButton, 'auth');

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

    // temp code for 2024 dev
    if (getSearchParam2('override') === 'on' && getSearchParam2('useAlternate') === 'working') {
        const s1 = assetsRoot + '/reusable-webcomponents-development/webpresence-working/' + includeFilename;
        console.log('working', s1);
        return s1;
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

function insertScript2(url, defer = false, onloadCallback = null) {
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
    return getSearchParam2('override') === 'on' && getSearchParam2('useAlternate') === 'staging';
}

function loadReusableComponentsLibGuides2() {
    insertScript2(getIncludeFullPath('applications/libguides/subload.js'), true);
}

ready2(loadReusableComponentsLibGuides2);

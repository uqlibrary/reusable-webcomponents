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

const isInEditMode = () => {
    if (window.location.hostname === 'localhost') {
        return false;
    }
    // guides is edited on springshare domain, with our looknfeel.
    // Don't include some elements - they are distracting to the admin
    if (window.location.href.includes('uq.edu.au')) {
        return false;
    }
    return true;
};

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
    var headID = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    headID.appendChild(link);
    link.href = font;
}

function getScriptUrl(jsFilename, _overrideHost = null, _overridePathname = null, _overrideHref = null) {
    const overrideHost = _overrideHost === null ? window.location.host : _overrideHost;
    const overridePathname = _overridePathname === null ? window.location.pathname : _overridePathname;
    const overrideHref = _overrideHref === null ? window.location.href : _overrideHref;

    const assetsHostname = 'assets.library.uq.edu.au';
    const assetsRoot = 'https://' + assetsHostname;

    if (overrideHost === 'localhost:8080') {
        return 'http://localhost:8080/' + jsFilename;
    }
    if (isStaging()) {
        // no actual staging on guides, override must be on
        return assetsRoot + '/reusable-webcomponents-staging/' + jsFilename;
    }

    if (overrideHost === assetsHostname && /reusable-webcomponents-staging/.test(overrideHref)) {
        // a test on staging branch gets staging version
        return assetsRoot + '/reusable-webcomponents-staging/' + jsFilename;
    }
    if (overrideHost === assetsHostname && /reusable-webcomponents-development\/master/.test(overrideHref)) {
        // a test on master branch gets master version
        return assetsRoot + '/reusable-webcomponents-development/master/' + jsFilename;
    }
    if (overrideHost === assetsHostname) {
        // a test on any feature branch gets the feature branch
        return assetsRoot + getPathnameRoot(overridePathname) + jsFilename;
    }

    // otherwise prod
    return assetsRoot + '/reusable-webcomponents/' + jsFilename;
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
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);

    !!defer && script.setAttribute('defer', '');

    !!head && head.appendChild(script);
}

function isStaging() {
    // guides does not have a staging environment, but we can force a load from assets staging by calling it like this:
    // https://guides.library.uq.edu.au/?override=on&useStaging=yes
    return getSearchParam('override') === 'on' && getSearchParam('useStaging') === 'yes';
}

function loadReusableComponentsLibGuides() {
    insertScript(getScriptUrl('applications/libguides/subload.js'), true);
}

ready(loadReusableComponentsLibGuides);

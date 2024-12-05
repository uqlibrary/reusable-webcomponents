function getSearchParam(name, value) {
    const url = window.location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get(name);
}

function readyLoad(fn) {
    if (getSearchParam('override') === 'yes' && getSearchParam('skipScript') === 'yes') {
        // to stop reusable being loaded, call it like this.
        // https://guides.library.uq.edu.au/?override=yes&skipScript=yes
        // You can then manually load things in the console
        return;
    }
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function getScriptUrl(jsFilename) {
    const libraryAssetsRootLocation = 'https://assets.library.uq.edu.au/reusable-webcomponents';

    if (window.location.host === 'localhost:8080') {
        return 'http://localhost:8080/' + jsFilename;
    }
    if (getSearchParam('override') === 'yes' && getSearchParam('useStaging') === 'yes') {
        // guides does not have a staging environment, but we can force a load from assets staging by calling it like this:
        // https://guides.library.uq.edu.au/?override=yes&useStaging=yes
        return libraryAssetsRootLocation + '-staging/applications/libguides/' + jsFilename;
    }
    let folder = '/'; // default. Use for prod.
    if (window.location.hostname === 'assets.library.uq.edu.au') {
        if (/reusable-webcomponents-staging/.test(window.location.href)) {
            folder = '-staging/';
        } else if (/reusable-webcomponents-development\/master/.test(window.location.href)) {
            folder = '-development/master/';
        } else {
            folder = `${window.location.pathname.replace('/reusable-webcomponents', '')}`;
        }
    }
    return libraryAssetsRootLocation + folder + jsFilename;
}

function insertScript(url, defer = false) {
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

function loadGuidesScript() {
    insertScript(getScriptUrl('applications/libguides/subload.js'), true);
}

readyLoad(loadGuidesScript);

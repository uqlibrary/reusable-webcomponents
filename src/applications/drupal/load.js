/*
 * this determines what environment to load from
 */
function getValue(param) {
    // to avoid setting global constants, as it makes it hard to run the script manually
    const lookup = {
        libraryProductionDomain: 'web.library.uq.edu.au',
        libraryStagingDomain: 'web-staging.library.uq.edu.au',
        library2024DevDomain: 'web-live.library.uq.edu.au',
        // libraryFeatureBranchName: 'drupal-staging',
        libraryFeatureBranchName: 'webpresence-working', // debug only!!!!
        libraryAssetsRootLocation: 'https://assets.library.uq.edu.au/reusable-webcomponents',
        // certain admin pages in drupal don't take the webcomponents because they interact badly
        libraryPagesWithoutComponents: [
            '/src/applications/drupal/pageWithoutComponents.html', // localhost test this concept
            '/ckfinder/browse',
            '/ckfinder/browse/images',
            '/ckfinder/browse/files',
        ],
    };

    return lookup[param] || '';
}

function getSearchParam(name, value) {
    const url = window.location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get(name);
}

function readyDrupal(fn) {
    if (getSearchParam('override') === 'yes' && getSearchParam('skipScript') === 'yes') {
        // to stop reusable being loaded, load Drupal like this:
        // https://web.library.uq.edu.au/?override=yes&skipScript=yes
        // You can then manually load things in the console
        return;
    }
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
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

function isITSExternalHosting() {
    return window.location.hostname.endsWith('-library-uq.pantheonsite.io');
}

function isStagingSite() {
    const validHosts = [getValue('libraryStagingDomain'), getValue('library2024DevDomain')];
    return validHosts.includes(window.location.host) || isITSExternalHosting();
}

function isValidDrupalHost() {
    const validHosts = [
        getValue('libraryProductionDomain'),
        getValue('libraryStagingDomain'),
        getValue('library2024DevDomain'),
        'localhost:8080',
    ];
    return validHosts.includes(window.location.host) || isITSExternalHosting();
}

function getScriptUrl(jsFilename) {
    if (window.location.host === 'localhost:8080') {
        return 'http://localhost:8080/' + jsFilename;
    }

    let folder = '/'; // default. Use for prod.

    if (isStagingSite()) {
        console.log('drupal sdtaging');
        folder = `-development/${getValue('libraryFeatureBranchName')}/`;
    } else if (window.location.hostname === 'assets.library.uq.edu.au') {
        console.log('dev');
        if (/reusable-webcomponents-staging/.test(window.location.href)) {
            folder = '-staging/';
        } else if (/reusable-webcomponents-development\/master/.test(window.location.href)) {
            folder = '-development/master/';
        } else {
            folder = `-development/${getValue('libraryFeatureBranchName')}/`;
        }
    }
    const s = getValue('libraryAssetsRootLocation') + folder + jsFilename;
    console.log('getScriptUrl=', s);
    return s;
}

function loadDrupalScripts() {
    const url = getScriptUrl('applications/drupal/subload.js');
    insertScript(url, true);
}

readyDrupal(loadDrupalScripts);

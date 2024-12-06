/*
 * this determines what environment to load from
 */
function getValue(param) {
    // to avoid setting global constants, as it makes it hard to run the script manually
    const lookup = {
        libraryProductionDomain: 'web.library.uq.edu.au',
        libraryStagingDomain: 'web-staging.library.uq.edu.au',
        library2024DevDomain: 'web-live.library.uq.edu.au',
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
    if (getSearchParam('override') === 'on' && getSearchParam('skipScript') === 'yes') {
        // to stop reusable being loaded, load Drupal like this:
        // https://web.library.uq.edu.au/find-and-borrow?override=on&skipScript=yes
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

function getScriptUrl(jsFilename, _overrideHost = null, _overrideHref = null) {
    const overrideHost = _overrideHost === null ? window.location.host : _overrideHost;
    const overrideHref = _overrideHref === null ? window.location.href : _overrideHref;

    // const libraryFeatureBranchName = 'drupal-staging';
    const libraryFeatureBranchName = 'webpresence-working'; // debug only!!!!

    // we determine the location to draw the file from according to the current location
    if (overrideHost === 'localhost:8080') {
        return 'http://localhost:8080/' + jsFilename;
    }

    const assetsHostname = 'assets.library.uq.edu.au';
    const assetsRoot = 'https://' + assetsHostname;
    if (isStagingSite()) {
        // drupal staging sites pull from the test feature branch
        return assetsRoot + '/reusable-webcomponents-development/' + `${libraryFeatureBranchName}/` + jsFilename;
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
        // a test on any feature branch get all other branches get the feature branch
        // eg https://assets.library.uq.edu.au/reusable-webcomponents-development/webpresence-working/index-drupalcontactus.html
        return assetsRoot + '/reusable-webcomponents-development/' + `${libraryFeatureBranchName}` + '/' + jsFilename;
    }
    // drupal production
    return assetsRoot + '/reusable-webcomponents/' + jsFilename;
}

function loadDrupalScripts() {
    const url = getScriptUrl('applications/drupal/subload.js');
    insertScript(url, true);
}

readyDrupal(loadDrupalScripts);

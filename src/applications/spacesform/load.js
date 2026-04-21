function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function hasDebugParam(testHost) {
    if (window.location.host !== testHost) {
        return false;
    }
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('debug') && urlParams.get('debug') === 'true';
}

function loadReusableComponentsAtom() {
    console.log('spaces load file ready!');
    if (hasDebugParam('test.crm.uq.edu.au')) {
        // host needs update
        console.log('?debug=true found on test url');
    }
}

ready(loadReusableComponentsAtom);

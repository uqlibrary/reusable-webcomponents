function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function updateLogoLink() {
    const logoElement = document.getElementById('logo');
    !!logoElement && logoElement.setAttribute('href', 'https://www.uq.edu.au/');
}

// TODO: move styles into an included .scss file and add hover styling, as per RaP button
function addBookNowLink() {
    setInterval(() => {
        const sidebarMenu = document.getElementById('context-menu');
        const bookNowWrapperIdentifier = 'booknowLink';
        const buttonWrapper = document.getElementById(bookNowWrapperIdentifier);
        if (!!sidebarMenu && !buttonWrapper) {
            const buttonlabel = 'Book now to view this item';
            const bookingUrl = 'https://calendar.library.uq.edu.au/reserve/spaces/reading-room';
            const bookingLinkContainer =
                `<div id="${bookNowWrapperIdentifier}" data-testid="booknowLink" class="bookNowBlock">` +
                `<a class="booknow" target="_blank" href="${bookingUrl}">${buttonlabel}</a>` +
                '</div>';

            sidebarMenu.insertAdjacentHTML('beforebegin', bookingLinkContainer);
        }
    }, 100);
}

function addCulturalAdvicePopup() {
    if (!document.querySelector('cultural-advice-popup')) {
        const culturalAdvice = document.createElement('cultural-advice-popup');
        !!culturalAdvice && document.body.appendChild(culturalAdvice);
    }
}

function insertScript(url, defer = false) {
    const scriptfound = document.querySelector("script[src*='" + url + "']");
    if (!scriptfound) {
        const heads = document.getElementsByTagName('head');
        if (heads && heads.length) {
            const head = heads[0];
            if (head) {
                const script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', url);
                !!defer && script.setAttribute('defer', '');
                head.appendChild(script);
            }
        }
    }
}

function addCss(fileName) {
    var head = document.head,
        link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = fileName;

    head.appendChild(link);
}

function isEnvironmentProduction() {
    return window.location.host === 'manuscripts.library.uq.edu.au';
}

function getCssFileLocation() {
    let cssFileLocation = '/applications/atom/custom-styles.css';
    if (window.location.hostname !== 'localhost') {
        let environmentLocation = '';
        if (!isEnvironmentProduction()) {
            const atomGitStagingBranch = 'atom-staging';
            environmentLocation = `-development/${atomGitStagingBranch}`;
        }
        cssFileLocation =
            'https://assets.library.uq.edu.au/reusable-webcomponents' +
            (window.location.host === 'sandbox-fryer.library.uq.edu.au' ? environmentLocation : '') +
            '/applications/atom/custom-styles.css';
    }
    return cssFileLocation;
}

function loadReusableComponentsAtom() {
    const cssFile = getCssFileLocation();
    addCss(cssFile);

    let scriptLink = '/uq-lib-reusable.min.js';
    if (window.location.hostname !== 'localhost') {
        scriptLink = `https://assets.library.uq.edu.au/reusable-webcomponents/applications/atom/custom-styles.css`;
    }
    insertScript(scriptLink, true);

    updateLogoLink();

    addBookNowLink();

    addCulturalAdvicePopup();
}

ready(loadReusableComponentsAtom);

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

const createIcon = (svgPath, size) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    !!path && path.setAttribute('d', svgPath);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    !!svg && svg.setAttribute('class', 'svgIcon');
    !!svg && svg.setAttribute('focusable', 'false');
    !!svg && svg.setAttribute('viewBox', '0 0 24 24');
    !!svg && svg.setAttribute('ariaHidden', 'true');
    !!svg && svg.setAttribute('width', size);
    !!svg && svg.setAttribute('height', size);
    !!svg && !!path && svg.appendChild(path);

    return svg;
};

// they supply an 'i' as a font on the button - we want a better icon
// css in custom-styles to override built in entry
function swapQuickMenuIcon() {
    // https://mui.com/material-ui/material-icons/?query=hamburger&selected=Menu
    const hamburgerIconSvg = 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z';
    const quickMenuButton = document.querySelector('#quick-links-menu button');
    const hamburgerIcon = createIcon(hamburgerIconSvg, 28);
    !!quickMenuButton && !!hamburgerIcon && quickMenuButton.appendChild(hamburgerIcon);
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
    const atomGitStagingBranch = 'atom-staging';
    const stagingEnvironmentLocation = `-development/${atomGitStagingBranch}`;
    cssFileLocation =
        'https://assets.library.uq.edu.au/reusable-webcomponents' +
        (isEnvironmentProduction() ? '' : stagingEnvironmentLocation) +
        '/applications/atom/custom-styles.css';
    console.log('cssFileLocation=', cssFileLocation);
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

    swapQuickMenuIcon();

    addCulturalAdvicePopup();
}

ready(loadReusableComponentsAtom);

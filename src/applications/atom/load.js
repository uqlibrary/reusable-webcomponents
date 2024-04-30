function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function hasDebugParam() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('debug') && urlParams.get('debug') === 'true';
}

function centerheaderBlock() {
    // insert a wrapping element as the first child of the header, so we can center the block
    const wrapper = document.createElement('div');
    !!wrapper && wrapper.classList.add('header-outer');

    const header = document.querySelector('header#top-bar');
    // move the existing children of the header to the wrapper, so they can sit inside the centered area
    if (!!header && !!wrapper) {
        while (header.firstChild) {
            wrapper.appendChild(header.firstChild);
        }
        header.appendChild(wrapper);
    }
}

function updateLogoLink() {
    const logoElement = document.getElementById('logo');
    !!logoElement && logoElement.setAttribute('href', 'https://www.uq.edu.au/');
}

function addBookNowButton() {
    const buttonLabel = 'Book now';
    const bookingLandingPage = 'https://calendar.library.uq.edu.au/reserve/spaces/reading-room';

    // Only pages with a Reference code are for an item that the patron can make a booking to view
    const hasReferenceCode = document.querySelector('.referenceCode');
    if (!hasReferenceCode) {
        return;
    }
    // the tree in the area at the top of the detail page reloads the page. Re-add the button each time.
    // note, the button sits in the top padding of the sidebar so the sidebar doesn't flicker as this redraws.
    setInterval(() => {
        const buttonLabel = 'Book now';
        const bookingLandingPage = 'https://calendar.library.uq.edu.au/reserve/spaces/reading-room';

        const sidebarMenu = document.getElementById('context-menu');
        const bookNowWrapperIdentifier = 'booknowLink';
        const buttonWrapper = document.getElementById(bookNowWrapperIdentifier);
        if (!!sidebarMenu && !buttonWrapper) {
            const sidebarParent = sidebarMenu.parentNode;
            !!sidebarParent &&
                !sidebarParent.classList.contains('sidebarParent') &&
                sidebarParent.classList.add('sidebarParent');
            const bookingLinkContainer =
                `<div id="${bookNowWrapperIdentifier}" data-testid="booknowLink" class="bookNowWrapper"">` +
                '<p>Make an appointment to request access</p>' +
                `<a class="booknow bookNowLink" target="_blank" href="${bookingLandingPage}">${buttonLabel}</a>` +
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
    const hamburgerIcon = createIcon(hamburgerIconSvg, 28);
    const quickMenuButton = document.querySelector('#quick-links-menu button');
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
        const script = document.createElement('script');
        !!script && script.setAttribute('type', 'text/javascript');
        !!script && script.setAttribute('src', url);
        !!defer && !!script && script.setAttribute('defer', '');

        const head = document.head;
        head.appendChild(script);
    }
}

function insertCss(fileName) {
    const link = document.createElement('link');
    !!link && (link.type = 'text/css');
    !!link && (link.rel = 'stylesheet');
    !!link && (link.href = fileName);

    const head = document.head;
    !!head && !!link && head.appendChild(link);
}

function isEnvironmentProduction() {
    return window.location.host === 'manuscripts.library.uq.edu.au';
}

function getIncludeFileLocation(filename) {
    const atomStagingBranch = 'atom-staging'; // this is the git branch that atom installed at sandbox-fryer.library.uq.edu.au knows about
    const stagingFileLocationFragment = `-development/${atomStagingBranch}`;
    const fileLocationFragment = isEnvironmentProduction() ? '' : stagingFileLocationFragment;
    return `https://assets.library.uq.edu.au/reusable-webcomponents${fileLocationFragment}/${filename}`;
}

function relabelMenuDropdown() {
    const hamburgerMenuHeading = document.querySelector('#quick-links-menu .top-dropdown-header h2');
    !!hamburgerMenuHeading && (hamburgerMenuHeading.textContent = 'Menu');
}

function addCulturalAdviceBanner(displayText) {
    // eg "Aboriginal and Torres Strait Islander people are warned that this resource may contain images transcripts or names of Aboriginal and Torres Strait Islander people now deceased.  It may also contain historically and culturally sensitive words, terms, and descriptions."
    const displayBlockClassName = 'culturalAdviceBanner';
    const displayBlock = document.querySelector(`.${displayBlockClassName}`);
    if (!!displayBlock) {
        // block already exists - don't duplicate
        return;
    }

    const para = document.createElement('p');
    !!para && (para.innerHTML = displayText);

    const block = document.createElement('div');
    !!block && (block.className = displayBlockClassName);
    !!para && !!para && block.appendChild(para);

    const waitforWrapperToExist = setInterval(() => {
        const parent = document.querySelector('#main-column h1');
        if (!!parent) {
            clearInterval(waitforWrapperToExist);
            parent.appendChild(block);
        }
    }, 100);
}

function highlightCulturallySignificantEntriesOnDetailPage() {
    const contentAndStructureAreaElement = document.querySelectorAll('#contentAndStructureArea p');
    const contentAdvisoryParagraph =
        !!contentAndStructureAreaElement &&
        Array.from(contentAndStructureAreaElement).filter((paragraph) =>
            paragraph.textContent.startsWith('Content advice:'),
        );

    let bannerText = null;
    !!contentAdvisoryParagraph &&
        contentAdvisoryParagraph.forEach((paragraph) => {
            const contentAdvice = paragraph.textContent;
            if (!!contentAdvice.startsWith('Content advice: Aboriginal and Torres Strait Islander')) {
                bannerText = contentAdvice.replace('Content advice: ', '');
            } else if (!!contentAdvice.startsWith('Content advice: Aboriginal, Torres Strait Islander')) {
                bannerText = contentAdvice.replace('Content advice: ', '');
            }
            !!bannerText && addCulturalAdviceBanner(bannerText);
        });
}

function createCustomIconIndicator(svgPathValue, iconWrapperClassName, labelText) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    !!path && path.setAttribute('d', svgPathValue);
    !!path && path.setAttribute('d', svgPathValue);

    const svgCR = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    !!svgCR && svgCR.setAttribute('width', '18px');
    !!svgCR && svgCR.setAttribute('height', '18px');
    !!svgCR && svgCR.setAttribute('viewBox', '0 0 24 24');
    !!svgCR && svgCR.setAttribute('focusable', 'false');
    !!svgCR && svgCR.setAttribute('class', 'icon-after-icon');
    !!svgCR && !!path && svgCR.appendChild(path);

    const mdIcon = document.createElement('md-icon');
    !!mdIcon && mdIcon.setAttribute('role', 'presentation');
    !!mdIcon && (mdIcon.className = 'md-primoExplore-theme');
    !!mdIcon && !!svgCR && mdIcon.appendChild(svgCR);

    const contentLabel = document.createElement('span');
    !!contentLabel && (contentLabel.className = 'customIndicatorLabel');
    !!contentLabel && (contentLabel.innerHTML = labelText);

    const iconWrapper = document.createElement('span');
    // iconWrapperClassName is used to hide any duplicate icons, which shouldnt happen, but rarely there is a race condition
    !!iconWrapper && (iconWrapper.className = `customIndicator ${iconWrapperClassName}`);
    !!iconWrapper && !!mdIcon && iconWrapper.appendChild(mdIcon);
    !!iconWrapper && !!contentLabel && iconWrapper.appendChild(contentLabel);

    return iconWrapper;
}

function highlightCulturallySignificantEntriesOnListPage() {
    if (hasDebugParam() && window.location.host === 'sandbox-fryer.library.uq.edu.au') {
        return;
    }
    const contentlist = document.querySelectorAll('article.search-result .scope-and-content em');
    !!contentlist &&
        contentlist.forEach(function (contentAdvice) {
            console.log('111 contentAdvice', contentAdvice);
            let hasContentAdvice = false;
            const contentAdviceText = contentAdvice.textContent;
            if (!!contentAdviceText.startsWith('Content advice: Aboriginal and Torres Strait Islander')) {
                hasContentAdvice = true;
            } else if (!!contentAdviceText.startsWith('Content advice: Aboriginal, Torres Strait Islander')) {
                hasContentAdvice = true;
            }
            if (!hasContentAdvice) {
                console.log('no advice');
                return;
            }

            // svg for "Info" icon from MUI icon set
            const muiIconInfoSvgPath =
                'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z';
            let culturalAdviceMarkClassName = 'culturalAdviceMark';
            const createdIndicator = createCustomIconIndicator(
                muiIconInfoSvgPath,
                culturalAdviceMarkClassName,
                'CULTURAL ADVICE',
            );
            if (!createdIndicator) {
                return;
            }
            const newElement = document.createElement('div');
            !!newElement && newElement.appendChild(createdIndicator);

            console.log('contentAdvice=', contentAdvice);
            console.log('contentAdvice p1=', contentAdvice.parentNode);
            console.log('contentAdvice p2=', contentAdvice.parentNode.parentNode);
            console.log('contentAdvice p3=', contentAdvice.parentNode.parentNode.parentNode);
            console.log('contentAdvice p4=', contentAdvice.parentNode.parentNode.parentNode.parentNode);
            const targetParent = contentAdvice.parentNode.parentNode;
            console.log('targetParent=', targetParent);
            const targetSibling = targetParent.firstChild; //.querySelector('.scope-and-content');
            console.log('targetSibling=', targetSibling);
            const checkExists = targetParent.querySelectorAll(`.${culturalAdviceMarkClassName}`);
            console.log('111 checkExists=', checkExists);
            if (checkExists.length === 0) {
                targetParent.insertBefore(newElement, targetSibling);
            }
        });
}

function loadReusableComponentsAtom() {
    const cssFile = getIncludeFileLocation('applications/atom/custom-styles.css');
    // note: we cannot reach css in the localhost dist folder for test
    insertCss(cssFile);

    let scriptLink = '/uq-lib-reusable.min.js';
    if (window.location.hostname !== 'localhost') {
        scriptLink = getIncludeFileLocation('uq-lib-reusable.min.js');
    }
    insertScript(scriptLink, true);

    centerheaderBlock();

    updateLogoLink();

    addBookNowButton();

    swapQuickMenuIcon();

    addCulturalAdvicePopup();

    relabelMenuDropdown();

    highlightCulturallySignificantEntriesOnDetailPage();
    highlightCulturallySignificantEntriesOnListPage();
}

ready(loadReusableComponentsAtom);

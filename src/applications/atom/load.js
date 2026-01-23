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

function contentExists(searchText = 'Reference code') {
    const headings = document.evaluate(
        `//h3[contains(., '${searchText}')]`,
        document,
        null,
        XPathResult.ANY_TYPE,
        null,
    );
    const thisHeading = headings.iterateNext();
    return !!thisHeading;
}
function addBookNowButton() {
    const buttonLabel = 'Book now';
    const bookingLandingPage = 'https://calendar.library.uq.edu.au/reserve/spaces/reading-room';

    // Only pages with a Reference code are for an item that the patron can make a booking to view
    if (!contentExists('Reference code')) {
        return;
    }
    // the tree in the area at the top of the detail page reloads the page. Re-add the button each time.
    // note, the button sits in the top padding of the sidebar so the sidebar doesn't flicker as this redraws.
    setInterval(() => {
        const sidebarMenu = document.getElementById('action-icons'); //
        const bookNowWrapperIdentifier = 'booknowLink';
        const buttonWrapper = document.getElementById(bookNowWrapperIdentifier);
        if (!!sidebarMenu && !buttonWrapper) {
            const sidebarParent = sidebarMenu.parentNode;
            !!sidebarParent &&
                !sidebarParent.classList.contains('sidebarParent') &&
                sidebarParent.classList.add('sidebarParent');
            // icon: https://www.streamlinehq.com/icons/ultimate-regular-free?search=calendar&icon=ico_cyjrCEgOghvvMPl4
            const bookingLinkContainer = `<div id="${bookNowWrapperIdentifier}" data-testid="booknowLink" class="bookNowWrapper box">
                    <p>Make an appointment to request access</p>
                    <div class="bookNowLinkWrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Time-Daily-1--Streamline-Ultimate" height="24" width="24" aria-hidden="true">
                          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M10.5 13h0.75c0.1989 0 0.3897 0.079 0.5303 0.2197 0.1407 0.1406 0.2197 0.3314 0.2197 0.5303V19" stroke-width="1.5"></path>
                          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M10.5 19h3" stroke-width="1.5"></path>
                          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M2.25 3.75h19.5s1.5 0 1.5 1.5v16.5s0 1.5 -1.5 1.5H2.25s-1.5 0 -1.5 -1.5V5.25s0 -1.5 1.5 -1.5Z" stroke-width="1.5"></path>
                          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M0.75 9.75h22.5" stroke-width="1.5"></path>
                          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M6.75 6V0.75" stroke-width="1.5"></path>
                          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M17.25 6V0.75" stroke-width="1.5"></path>
                        </svg>
    
                        <a class="booknow bookNowLink" data-analyticsid="fryer-booking" target="_blank" href="${bookingLandingPage}">${buttonLabel}</a>
                    </div>
                </div>`;

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

// replace 'i' icon with a hamburger icon
function swapQuickMenuIcon() {
    const existingIcon = document.querySelector('#quick-links-menu i');
    !!existingIcon &&
        existingIcon.classList.contains('fa-info-circle') &&
        existingIcon.classList.remove('fa-info-circle');
    !!existingIcon && !existingIcon.classList.contains('fa-bars') && existingIcon.classList.add('fa-bars');
}

function addCulturalAdviceBanner() {
    const targetElement = document.getElementById('top-bar');
    if (!targetElement) return;

    if (!document.querySelector('cultural-advice')) {
        const culturalAdvice = document.createElement('cultural-advice');
        !!culturalAdvice && targetElement.parentNode.insertBefore(culturalAdvice, targetElement.nextSibling);
    }
}

function insertScript(url, defer = false) {
    const scriptfound = document.querySelector("script[src*='" + url + "']");
    if (!!scriptfound) {
        return;
    }
    const script = document.createElement('script');
    !!script && script.setAttribute('type', 'text/javascript');
    !!script && script.setAttribute('src', url);
    !!script && !!defer && script.setAttribute('defer', '');

    const headElement = document.querySelector('head');
    !!headElement && !!script && headElement.appendChild(script);
}

function insertCssFile(cssFileName) {
    const includeFound = document.querySelector("link[href*='" + cssFileName + "']");
    if (!!includeFound) {
        return;
    }

    const link = document.createElement('link');
    !!link && (link.type = 'text/css');
    !!link && (link.rel = 'stylesheet');
    !!link && (link.href = cssFileName);

    const headElement = document.head;
    !!headElement && !!link && headElement.appendChild(link);
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
    const hamburgerMenuHeading = document.querySelector('[aria-labelledby="quick-links-menu"] h6.dropdown-header');
    !!hamburgerMenuHeading && (hamburgerMenuHeading.textContent = 'Menu');
}

function setupLinksForStyling(menuIdentifier) {
    const menus = document.querySelectorAll(menuIdentifier);
    if (!menus) {
        return;
    }

    menus.forEach((menu) => {
        console.log('menu=', menu);
        const anchors = menu.querySelectorAll('a');

        anchors.forEach((anchor) => {
            anchor.childNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    console.log('node=', node);
                    const span = document.createElement('span');
                    span.textContent = node.textContent;
                    anchor.replaceChild(span, node);
                }
            });
        });
    });
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
    !!svgCR && svgCR.setAttribute('width', '16px'); // hard code here so we don't get a FOUC
    !!svgCR && svgCR.setAttribute('height', '16px');
    !!svgCR && svgCR.setAttribute('viewBox', '0 0 24 24');
    !!svgCR && svgCR.setAttribute('focusable', 'false');
    !!svgCR && svgCR.setAttribute('class', 'icon-after-icon');
    !!svgCR && !!path && svgCR.appendChild(path);

    const indicatorLabel = document.createElement('span');
    !!indicatorLabel && (indicatorLabel.className = 'customIndicatorLabel');
    !!indicatorLabel && (indicatorLabel.innerHTML = labelText);

    const indicatorWrapper = document.createElement('span');
    // iconWrapperClassName is used to hide any duplicate icons, which shouldnt happen, but rarely there is a race condition
    !!indicatorWrapper && (indicatorWrapper.className = `customIndicator ${iconWrapperClassName}`);
    !!indicatorWrapper && !!svgCR && indicatorWrapper.appendChild(svgCR);
    !!indicatorWrapper && !!indicatorLabel && indicatorWrapper.appendChild(indicatorLabel);

    return indicatorWrapper;
}

function splitSidebarIntoBoxes() {
    const actionIcons = document.querySelector('#context-menu #action-icons');

    if (!actionIcons) {
        return;
    }

    const children = Array.from(actionIcons.children);

    const groups = [];
    let currentGroup = null;

    children.forEach((child) => {
        if (child.tagName === 'H4') {
            if (currentGroup) {
                groups.push(currentGroup); // Start a new group
            }
            currentGroup = [child];
        } else {
            // if (child.tagName === 'UL' && currentGroup) {
            // Add other children to the current group
            currentGroup.push(child);
            groups.push(currentGroup);
            currentGroup = null;
        }
    });

    actionIcons.innerHTML = ''; // Clear the action-icons section

    groups.forEach((group) => {
        const wrapper = document.createElement('div');
        !!wrapper && !wrapper.classList.contains('box') && wrapper.classList.add('box');
        group.forEach((element) => {
            wrapper.appendChild(element);
        });
        actionIcons.appendChild(wrapper);
    });
}

function highlightCulturallySignificantEntriesOnListPage() {
    if (hasDebugParam('sandbox-fryer.library.uq.edu.au')) {
        return;
    }

    // get text blocks which may have content advice
    const contentlist = document.querySelectorAll('article.search-result .scope-and-content em');
    !!contentlist &&
        contentlist.forEach(function (contentAdvice) {
            let hasContentAdvice = false;
            const contentAdviceText = contentAdvice.textContent;
            if (!!contentAdviceText.startsWith('Content advice: Aboriginal and Torres Strait Islander')) {
                hasContentAdvice = true;
            } else if (!!contentAdviceText.startsWith('Content advice: Aboriginal, Torres Strait Islander')) {
                hasContentAdvice = true;
            }
            if (!hasContentAdvice) {
                return;
            }

            // svg for "Info" icon from MUI icon set
            const muiIconInfoSvgPath =
                'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z';
            let culturalAdviceMarkClassName = 'culturalAdviceMark';
            const createdCAIndicator = createCustomIconIndicator(
                muiIconInfoSvgPath,
                culturalAdviceMarkClassName,
                'CULTURAL ADVICE',
            );
            if (!createdCAIndicator) {
                return;
            }

            const indicatorList = document.createElement('div');
            !!indicatorList && indicatorList.setAttribute('class', 'customIndicatorList');
            !!indicatorList && indicatorList.appendChild(createdCAIndicator);

            const targetParent = contentAdvice.parentNode.parentNode;
            const checkExists = targetParent.querySelectorAll(`.${culturalAdviceMarkClassName}`);
            if (
                checkExists.length === 0 && // dont insert it twice
                !!targetParent &&
                !!indicatorList
            ) {
                targetParent.insertBefore(indicatorList, targetParent.firstChild);
            }
        });
}

function loadReusableComponentsAtom() {
    const cssFile = getIncludeFileLocation('applications/atom/custom-styles.css');
    // note: we cannot reach css in the localhost dist folder for test
    insertCssFile(cssFile);

    let scriptLink = '/uq-lib-reusable.min.js';
    if (window.location.hostname !== 'localhost') {
        scriptLink = getIncludeFileLocation('uq-lib-reusable.min.js');
    }
    insertScript(scriptLink, true);

    const firstElement = document.body.children[0];

    const gtm = document.createElement('uq-gtm');
    !!gtm && gtm.setAttribute('gtm', 'GTM-NC7M38Q');
    document.body.insertBefore(gtm, firstElement);

    centerheaderBlock();

    updateLogoLink();

    addBookNowButton();

    swapQuickMenuIcon();

    addCulturalAdviceBanner();

    relabelMenuDropdown();

    setupLinksForStyling('ul[aria-labelledby="clipboard-menu"]'); // header paperclip menu
    setupLinksForStyling('ul[aria-labelledby="quick-links-menu"]'); // header hamburger menu
    setupLinksForStyling('nav ul.list-unstyled'); // sidebar items
    setupLinksForStyling('ul[aria-labelledby="browse-menu"]'); // header browse menu

    highlightCulturallySignificantEntriesOnDetailPage();
    highlightCulturallySignificantEntriesOnListPage();

    splitSidebarIntoBoxes();
}

ready(loadReusableComponentsAtom);

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

// function updateHomeLink() {
//     // They supply one link to fryer home with 2 elements, an image and a span
//     // We want the image to go to uq home and the span to go to fryer home
//
//     const oldHomeLink = document.querySelector('.header-outer a:first-of-type');
//     if (!oldHomeLink) {
//         return;
//     }
//     // Get the current href
//     const currentHref = oldHomeLink.getAttribute('href');
//     const rel = oldHomeLink.getAttribute('rel');
//
//     // Get the img and span elements
//     const img = oldHomeLink.querySelector('img');
//     const span = oldHomeLink.querySelector('span');
//
//     // Create first link (for logo) - pointing to UQ website
//     const logoLink = document.createElement('a');
//     logoLink.className = 'navbar-brand d-flex flex-wrap flex-lg-nowrap align-items-center py-0 me-0';
//     logoLink.setAttribute('data-testid', 'uqHomeLink');
//     logoLink.href = 'https://www.uq.edu.au/';
//     logoLink.title = 'UQ home page';
//     logoLink.rel = rel;
//     logoLink.appendChild(img.cloneNode(true));
//
//     // Create second link (for text) - keeping original href
//     const textContent = span.textContent;
//     const textLabel = document.createTextNode(textContent);
//     const textLink = document.createElement('a');
//     // no rel home
//     textLink.title = 'Manuscripts home page';
//     textLink.setAttribute('data-testid', 'fryerHomeLink');
//     textLink.href = currentHref;
//     textLink.classList.add('textHomeLink');
//     textLink.appendChild(textLabel.cloneNode(true));
//
//     // Replace the original element with both new links
//     oldHomeLink.parentNode.insertBefore(logoLink, oldHomeLink);
//     oldHomeLink.parentNode.insertBefore(document.createTextNode(' '), oldHomeLink);
//     oldHomeLink.parentNode.insertBefore(textLink, oldHomeLink);
//
//     // Remove the original element
//     oldHomeLink.remove();
// }

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
            const bookingLinkContainer = document.createElement('template');
            bookingLinkContainer.innerHTML = `<div id="${bookNowWrapperIdentifier}" data-testid="booknowLink" class="box">
                    <h4>Access</h4>
                    <p>Make an appointment to request access.</p>
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

            sidebarMenu.insertBefore(bookingLinkContainer.content.cloneNode(true), sidebarMenu.firstChild);
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

function addCulturalAdviceBannerOnHeader() {
    const targetElement = document.querySelector('uq-site-header');
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
    // const atomStagingBranch = 'atom-staging'; // this is the git branch that atom installed at sandbox-fryer.library.uq.edu.au knows about
    const atomStagingBranch = 'atom-bootstrap5-AD649'; // dev branch - return to above after dev
    const stagingFileLocationFragment = `-development/${atomStagingBranch}`;
    const fileLocationFragment = isEnvironmentProduction() ? '' : stagingFileLocationFragment;
    return `https://assets.library.uq.edu.au/reusable-webcomponents${fileLocationFragment}/${filename}`;
}

function relabelMenuDropdown() {
    const hamburgerMenuHeading = document.querySelector('[aria-labelledby="quick-links-menu"] h6.dropdown-header');
    !!hamburgerMenuHeading && (hamburgerMenuHeading.textContent = 'Menu');
}

function setupLinksForStyling(menuIdentifier) {
    // embed the content of each link in a span, for styling
    const menus = document.querySelectorAll(menuIdentifier);
    if (!menus) {
        return;
    }

    menus.forEach((menu) => {
        const anchors = menu.querySelectorAll('a');

        anchors.forEach((anchor) => {
            anchor.childNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    const span = document.createElement('span');
                    span.textContent = node.textContent;
                    anchor.replaceChild(span, node);
                }
            });
        });
    });
}

function highlightCulturallySignificantEntriesOnDetailPage() {
    // eg "Aboriginal and Torres Strait Islander people are warned that this resource may contain images transcripts or names of Aboriginal and Torres Strait Islander people now deceased.  It may also contain historically and culturally sensitive words, terms, and descriptions."
    const displayBlockIdentifier = 'culturalAdviceBanner';
    setInterval(() => {
        const displayBlock = document.getElementById(displayBlockIdentifier);
        if (!!displayBlock) {
            return; // block already exists - don't duplicate
            // (maybe we should delete it here and not return, if its appear on pages it shuldnt?
        }

        const contentAndStructureAreaElement = document.querySelectorAll('#contentAndStructureArea .details p');
        const contentAdvisoryParagraph =
            !!contentAndStructureAreaElement &&
            Array.from(contentAndStructureAreaElement).filter((paragraph) =>
                paragraph.textContent.startsWith('Cultural advice:'),
            );

        let bannerText = null;
        !!contentAdvisoryParagraph &&
            contentAdvisoryParagraph.forEach((paragraph) => {
                const contentAdvice = paragraph.textContent;
                if (
                    !!contentAdvice.startsWith('Content advice: Aboriginal and Torres Strait Islander') ||
                    !!contentAdvice.startsWith('Content advice: Aboriginal, Torres Strait Islander')
                ) {
                    bannerText = contentAdvice.replace('Content advice: ', '');
                } else if (
                    !!contentAdvice.startsWith('Cultural advice: Aboriginal and Torres Strait Islander') ||
                    !!contentAdvice.startsWith('Cultural advice: Aboriginal, Torres Strait Islander')
                ) {
                    bannerText = contentAdvice.replace('Cultural advice: ', '');
                }
            });
        if (!bannerText) {
            return;
        }

        const para = document.createElement('p');
        !!para && (para.innerHTML = bannerText);

        const block = document.createElement('div');
        !!block && (block.id = displayBlockIdentifier);
        !!block && block.classList.add(displayBlockIdentifier);
        const innerblock = document.createElement('div');
        !!para && !!innerblock && innerblock.appendChild(para);
        !!innerblock && !!block && block.appendChild(innerblock);

        const parentElement = document.querySelector('#main-column h1');
        if (!!parentElement) {
            if (parentElement.nextSibling) {
                parentElement.parentNode.insertBefore(block, parentElement.nextSibling);
            } else {
                parentElement.parentNode.appendChild(block);
            }
        }
    }, 100);
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
    setInterval(() => {
        const actionIcons = document.querySelector('#context-menu #action-icons');
        if (!actionIcons) {
            // no sidebar items to box-ify
            return;
        }

        const actionIconsBox = document.querySelector('#context-menu #action-icons .box');
        if (!!actionIconsBox) {
            // boxes currently exist
            return;
        }

        // the page redraws when a heirarchy link is clicked, and boxes go away - this re-adds them
        const children = Array.from(actionIcons.children);

        const groups = [];
        let currentGroup = null;

        children.forEach((child) => {
            if (child.tagName === 'H4') {
                if (currentGroup) {
                    groups.push(currentGroup); // Start a new group
                }
                currentGroup = [child];
            } else if (!!currentGroup) {
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
    }, 100);

    addBookNowButton(); // now we have boxes, add the Request Access box as the top one
}

function highlightCulturallySignificantEntriesOnListPage() {
    if (hasDebugParam('sandbox-fryer.library.uq.edu.au')) {
        return;
    }

    const waitForBody = setInterval(() => {
        const contentBody = document.querySelectorAll('#content article p');
        if (!contentBody) {
            return; // the paragraphs have not yet been displayed, so we can't tell if they need CA or not
        }

        clearInterval(waitForBody);

        !!contentBody &&
            contentBody.forEach(function (contentAdvice) {
                const contentAdviceText = contentAdvice?.textContent;

                let hasContentAdvice = false;
                if (
                    !!contentAdviceText.startsWith('Content advice: Aboriginal and Torres Strait Islander') ||
                    !!contentAdviceText.startsWith('Cultural advice: Aboriginal and Torres Strait Islander') ||
                    !!contentAdviceText.startsWith('Content advice: Aboriginal, Torres Strait Islander') ||
                    !!contentAdviceText.startsWith('Cultural advice: Aboriginal, Torres Strait Islander')
                ) {
                    hasContentAdvice = true;
                }
                if (!hasContentAdvice) {
                    return;
                }

                // svg for "Info" icon from MUI icon set, match search.library
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
    }, 100);
}

function fixSidebarSearchBox() {
    const treeviewElement = document.getElementById('treeview-menu');
    if (!treeviewElement) {
        return;
    }

    // wrap the sidebar search element so we can restyle it as a sidebar box
    const firstChild = document.querySelector('#sidebar div:first-of-type');
    const newWrapper = document.createElement('div');
    !!newWrapper && newWrapper.classList.add('sidebarSearchWrapper');
    if (!newWrapper) {
    } else if (firstChild.nextSibling) {
        firstChild.parentNode.insertBefore(newWrapper, firstChild.nextSibling);
    } else {
        firstChild.parentNode.appendChild(newWrapper);
    }

    const sidebarElement = document.getElementById('sidebar');
    const listChildElement = sidebarElement.querySelector('#sidebar > ul');
    !!listChildElement && !!newWrapper && newWrapper.appendChild(listChildElement);

    const listDivElement = sidebarElement.querySelector('#sidebar > #treeview-content');
    !!listDivElement && !!newWrapper && newWrapper.appendChild(listDivElement);
}

function addHeaders() {
    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }
    if (!document.querySelector('uq-header')) {
        const header = document.createElement('uq-header');
        !!header && header.setAttribute('hideLibraryMenuItem', '');
        !!header && header.setAttribute('searchurl', 'guides.library.uq.edu.au');
        document.body.insertBefore(header, firstElement);
    }

    if (!document.querySelector('uq-site-header')) {
        const siteHeader = document.createElement('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', 'Fryer Library Manuscripts');
        !!siteHeader && siteHeader.setAttribute('secondlevelurl', '/index.php/');
        !!siteHeader && document.body.insertBefore(siteHeader, firstElement);

        moveBreadcrumbsToSiteHeader(siteHeader);

        renameInfoMenu();
        moveHamburgerToSiteHeader(siteHeader);
    }

    const atomHomelink = document.querySelector('.header-outer a:first-of-type');
    !!atomHomelink && atomHomelink.remove();
}

function moveBreadcrumbsToSiteHeader(siteHeader) {
    const awaitSiteHeader = setInterval(() => {
        const siteHeaderShadowRoot = siteHeader.shadowRoot;

        if (!!siteHeaderShadowRoot) {
            clearInterval(awaitSiteHeader);

            console.log('moveBreadcrumbsToSiteHeader siteHeaderShadowRoot=', siteHeaderShadowRoot);
            const breadcrumbParent = !!siteHeaderShadowRoot && siteHeaderShadowRoot.getElementById('breadcrumb_nav');
            console.log('moveBreadcrumbsToSiteHeader breadcrumbParent=', breadcrumbParent);

            const breadcrumbNav = document.querySelector('nav:has(ol.breadcrumb)');
            const listItems = !!breadcrumbNav && breadcrumbNav.querySelectorAll('ol li');
            console.log('moveBreadcrumbsToSiteHeader listItems=', listItems);

            !!listItems &&
                listItems.forEach((item) => {
                    console.log('moveBreadcrumbsToSiteHeader item=', item);
                    const anchor = item.querySelector('a');
                    const title = anchor ? anchor.textContent : item.textContent;
                    const href = anchor ? anchor.href : null;
                    const listItemEntry = !!href ? breadcrumblink({ title, href }) : breadcrumbSpan(title);
                    breadcrumbParent.insertAdjacentHTML('beforeend', listItemEntry);
                });
            !!breadcrumbNav && breadcrumbNav.remove();
        }

        function breadcrumblink(b) {
            return `<li class="uq-breadcrumb__item">
                <a class="uq-breadcrumb__link" title="${b.title}" href="${b.href}">${b.title}</a>
                </li>`;
        }
        function breadcrumbSpan(title) {
            return `<li class="uq-breadcrumb__item">
                <span class="uq-breadcrumb__link" title="${title}">${title}</span>
                </li>`;
        }
    }, 100);
}

function renameInfoMenu() {
    const quickLinksAnchor = document.querySelector('#quick-links-menu');
    !!quickLinksAnchor && (quickLinksAnchor.innerHTML = ''); // remove currrent contents, icon and accesible name
    quickLinksAnchor.textContent = 'Menu';
}

function createSlotForButtonInUtilityArea(button, id = null) {
    const slot = document.createElement('span');
    !!slot && slot.setAttribute('slot', 'site-utilities');
    !!slot && !!id && slot.setAttribute('id', id);
    !!button && !!slot && slot.appendChild(button);

    return slot;
}

function moveHamburgerToSiteHeader(siteHeader) {
    const menuButton = document.querySelector('#quick-links-menu');
    console.log('moveHamburgerToSiteHeader menuButton=', menuButton);
    const menuDropdown = menuButton.nextElementSibling;
    console.log('moveHamburgerToSiteHeader menuDropdown=', menuDropdown);

    const newWrapper = document.createElement('div');
    !!newWrapper && newWrapper.appendChild(menuButton);
    !!newWrapper && newWrapper.appendChild(menuDropdown);

    const slot = !!menuButton && createSlotForButtonInUtilityArea(newWrapper, 'menu');
    console.log('moveHamburgerToSiteHeader slot=', slot);

    !!siteHeader && !!menuButton && siteHeader.appendChild(slot);
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

    addHeaders();

    centerheaderBlock();

    addCulturalAdviceBannerOnHeader();

    relabelMenuDropdown();

    setupLinksForStyling('ul[aria-labelledby="clipboard-menu"]'); // header paperclip menu
    setupLinksForStyling('ul[aria-labelledby="quick-links-menu"]'); // header hamburger menu
    setupLinksForStyling('nav ul.list-unstyled'); // sidebar items
    setupLinksForStyling('ul[aria-labelledby="browse-menu"]'); // header browse menu

    highlightCulturallySignificantEntriesOnDetailPage();
    highlightCulturallySignificantEntriesOnListPage();

    splitSidebarIntoBoxes();

    fixSidebarSearchBox();
}

ready(loadReusableComponentsAtom);

/*
   Atom is built on Bootstrap 5
   Changes we have implemented on OTB include:
   - Add UQ headers and footer
   - Move built in Quick links button ('i' icon) to uq-site-header. It is commonly referred to as the Action Menu. Restyle to match homepage Account Menu.
   - Restyle the Atom search area
   - Add a "Book now" prompt that appears on detail pages that have a Reference code
   - Style all (99%) of links hover as "uq tight links"
   - Style the left sidebar functions as boxes to match homepage look of boxes
   - List pages that have "Cultural Advice" or "Content Advice" in the body have a blue "Cultural Advice" icon on them
   - Detail page items with "Cultural Advice" or "Content Advice" in the body have a blue banner duplicating the message at the top
   - Remove pinkish shadow box on input fields
   - Style Advanced search Submit & Reset buttons to DS button primary & secondary style and push them left and right
   - Add/ move certain on page elements to breadcrumbs
   - Make the Subject sidebar readable (remove wrapping, some titles are looong and remove max-height)
*/
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

const isFryerHomepage = () => {
    return window.location.pathname === '/index.php/' || window.location.pathname === '/';
};

function centerHeaderBlock() {
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

function resizeSiteHeader() {
    // unexpectedly the site header is very thin
    // we need to fix it inside because fixing the wrappe in custom-styles.css gives grey strips the page grey background
    const awaitSiteHeader = setInterval(() => {
        const siteHeader = document.querySelector('uq-site-header');
        const siteHeaderShadowRoot = !!siteHeader && siteHeader.shadowRoot;
        if (!!siteHeaderShadowRoot) {
            clearInterval(awaitSiteHeader);
            const block = !!siteHeaderShadowRoot && siteHeaderShadowRoot.querySelector('.uq-site-header');
            if (!block) {
                return;
            }
            block.style.height = '51px';
            block.style.paddingTop = '10px';
        }
    }, 100);
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
    // Only pages with a Reference code are for an item that the patron can make a booking to view
    if (!contentExists('Reference code')) {
        return;
    }
    const bookNowWrapperIdentifier = 'booknowLink';
    const bookingBlockTemplate = `<div id="${bookNowWrapperIdentifier}" data-testid="booknowLink" class="box bookNowBox">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Time-Daily-1--Streamline-Ultimate" height="24" width="24" aria-hidden="true">
          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M10.5 13h0.75c0.1989 0 0.3897 0.079 0.5303 0.2197 0.1407 0.1406 0.2197 0.3314 0.2197 0.5303V19" stroke-width="1.5"></path>
          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M10.5 19h3" stroke-width="1.5"></path>
          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M2.25 3.75h19.5s1.5 0 1.5 1.5v16.5s0 1.5 -1.5 1.5H2.25s-1.5 0 -1.5 -1.5V5.25s0 -1.5 1.5 -1.5Z" stroke-width="1.5"></path>
          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M0.75 9.75h22.5" stroke-width="1.5"></path>
          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M6.75 6V0.75" stroke-width="1.5"></path>
          <path stroke="#51247a" stroke-linecap="round" stroke-linejoin="round" d="M17.25 6V0.75" stroke-width="1.5"></path>
        </svg>
        <h4>Access</h4>
        <p>Make an appointment to request access.</p>
        <div class="bookNowLink">
            <a data-analyticsid="fryer-booking" target="_blank" href="https://calendar.library.uq.edu.au/reserve/spaces/reading-room">
                <span>Book now</span>
            </a>
        </div>
    </div>`;

    // the tree in the area at the top of the detail page reloads the page. Re-add the button each time.
    setInterval(() => {
        const sidebarMenu = document.getElementById('action-icons'); //
        const buttonWrapper = document.getElementById(bookNowWrapperIdentifier);
        if (!!sidebarMenu && !buttonWrapper) {
            const sidebarParent = sidebarMenu.parentNode;
            !!sidebarParent &&
                !sidebarParent.classList.contains('sidebarParent') &&
                sidebarParent.classList.add('sidebarParent');
            // icon: https://www.streamlinehq.com/icons/ultimate-regular-free?search=calendar&icon=ico_cyjrCEgOghvvMPl4
            const bookingLinkContainer = document.createElement('template');
            bookingLinkContainer.innerHTML = bookingBlockTemplate;
            sidebarMenu.insertBefore(bookingLinkContainer.content.cloneNode(true), sidebarMenu.firstChild);
        }
    }, 100);
}

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

        const contentAndStructureAreaElement = document.querySelectorAll('#contentAndStructureArea p');
        const contentAdvisoryParagraph =
            !!contentAndStructureAreaElement &&
            Array.from(contentAndStructureAreaElement).filter(
                (paragraph) =>
                    paragraph.textContent.trim().startsWith('Cultural advice:') ||
                    paragraph.textContent.trim().startsWith('Content advice:'),
            );
        let bannerText = null;
        !!contentAdvisoryParagraph &&
            contentAdvisoryParagraph.forEach((paragraph) => {
                const contentAdvice = paragraph.textContent.trim();
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
        !!block && block.setAttribute('data-testid', displayBlockIdentifier);
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
            const boxHeading = group.find((el) => el.tagName === 'H4');
            const id = !!boxHeading && boxHeading.textContent.toLowerCase().replace(' ', '-');
            !!wrapper && !!id && wrapper.setAttribute('data-testid', id);
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

function addHeaderFooter() {
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
        !!siteHeader && siteHeader.setAttribute('secondlevelurl', '/');
        !!siteHeader && document.body.insertBefore(siteHeader, firstElement);

        buildAtomBreadcrumbsinSiteHeader(siteHeader);

        moveActionMenuToSiteHeader(siteHeader);
    }

    const atomHomelink = document.querySelector('.header-outer a:first-of-type');
    !!atomHomelink && atomHomelink.remove();

    const subFooter = document.createElement('uq-footer');
    !!subFooter && document.body.appendChild(subFooter);
}

function buildAtomBreadcrumbsinSiteHeader(siteHeader) {
    // pick out the content on certain pages to use as breadcrumbs
    const awaitSiteHeader = setInterval(() => {
        const siteHeaderShadowRoot = siteHeader.shadowRoot;
        if (!siteHeaderShadowRoot) {
            return;
        }

        clearInterval(awaitSiteHeader);

        const breadcrumbParent = !!siteHeaderShadowRoot && siteHeaderShadowRoot.getElementById('breadcrumb_nav');
        if (!breadcrumbParent) {
            return;
        }

        const breadcrumbNav = document.querySelector('nav:has(ol.breadcrumb)');
        const breadcrumbListItems = !!breadcrumbNav && breadcrumbNav.querySelectorAll('ol li');
        const headingLabel = document.getElementById('heading-label');
        const activeSidebarTreeview = document.querySelector('#treeview-content li.active');

        addListenerToHierarchyLinks();

        if (!!breadcrumbListItems) {
            // transfer the in-page breadcrumbs to the site-header breadcrumb area
            breadcrumbListItems.forEach((item) => {
                const anchor = item.querySelector('a');
                const title = anchor ? anchor.textContent : item.textContent;
                const href = anchor ? anchor.href : null;
                const listItemEntry = !!href ? breadcrumbLink({ title, href }) : breadcrumbSpan(title);
                breadcrumbParent.insertAdjacentHTML('beforeend', listItemEntry);
            });
            !!breadcrumbNav && breadcrumbNav.remove();
        } else if (!!headingLabel) {
            // if a subheading appears just below the H1, use it as a breadcrumb
            const subheadListItemEntry = breadcrumbSpan(headingLabel.innerText);
            !!subheadListItemEntry && breadcrumbParent.insertAdjacentHTML('beforeend', subheadListItemEntry);
        } else if (!!activeSidebarTreeview) {
            // if not, then try for the active browse subject in sidebar
            const sidebarListItemEntry = !!activeSidebarTreeview && breadcrumbSpan(activeSidebarTreeview.innerText);
            if (!!sidebarListItemEntry) {
                const subjectBreadcrumb = {
                    title: 'Subject',
                    href: '/index.php/taxonomy/index/id/35',
                };
                const subjectBreadcrumbHtml = breadcrumbLink(subjectBreadcrumb);
                breadcrumbParent.insertAdjacentHTML('beforeend', subjectBreadcrumbHtml);

                breadcrumbParent.insertAdjacentHTML('beforeend', sidebarListItemEntry);
            }
        } else if (!isFryerHomepage()) {
            // if not homepage, use H1
            addH1ToBreadcrumbs(breadcrumbParent);
        }

        function breadcrumbLink(b) {
            return `<li class="uq-breadcrumb__item">
                <a class="uq-breadcrumb__link" title="${b.title}" href="${b.href}">${b.title}</a>
                </li>`;
        }
        function breadcrumbSpan(title) {
            return `<li class="uq-breadcrumb__item">
                <span class="uq-breadcrumb__link" title="${title}">${title}</span>
                </li>`;
        }
        function addH1ToBreadcrumbs(breadcrumbParent) {
            const mainColumnH1 = document.querySelector('#main-column h1:first-of-type');
            const mainH1ItemEntry = !!mainColumnH1 && breadcrumbSpan(mainColumnH1.innerText);
            !!mainH1ItemEntry && breadcrumbParent.insertAdjacentHTML('beforeend', mainH1ItemEntry);
        }
        function onHierarchyPageLoadMoveBreadcrumbs(e) {
            // the "hierarchy box" on some pages gives links that do an in-page update - move the new breadcrumbs to the site header when this happens

            // do we have a breadcrumb section in the site header to add to?
            const siteHeader = document.querySelector('uq-site-header');
            const siteHeaderShadowRoot = siteHeader.shadowRoot;
            const breadcrumbParent = !!siteHeaderShadowRoot && siteHeaderShadowRoot.getElementById('breadcrumb_nav');
            if (!breadcrumbParent) {
                return;
            }

            const maxLoop = 10;
            let loop = 0;
            const waitForSiteBreadcrumbs = setInterval(() => {
                const breadcrumbNav = document.querySelector('nav#breadcrumb');
                const breadcrumbListItems = document.querySelectorAll('nav#breadcrumb ol li');

                console.log('loop=', loop);

                if ((!breadcrumbListItems || breadcrumbListItems.length === 0) && loop < maxLoop) {
                    // wait longer, within reason
                    loop++;
                    return;
                }

                clearInterval(waitForSiteBreadcrumbs);

                // remove the breadcrumbs previously transferred from the in-page
                const siteheaderBreadcrumbList = siteHeaderShadowRoot.querySelectorAll('#breadcrumb_nav li');
                !!siteheaderBreadcrumbList &&
                    siteheaderBreadcrumbList.length > 0 &&
                    siteheaderBreadcrumbList.forEach((b, index) => {
                        if (index < 3) {
                            // don't strip out the top level breadcrumbs (uq, library, fryer)
                            return;
                        }
                        b.remove();
                    });

                if (loop === maxLoop) {
                    // no breadcrumbs? use the h1
                    addH1ToBreadcrumbs(breadcrumbParent);
                    return;
                }

                // transfer the in-page breadcrumbs to the site-header breadcrumb area
                breadcrumbListItems.forEach((item, index) => {
                    const anchor = item.querySelector('a');
                    const title = anchor ? anchor.textContent : item.textContent;
                    const href = anchor ? anchor.href : null;
                    const listItemEntry = !!href ? breadcrumbLink({ title, href }) : breadcrumbSpan(title);
                    breadcrumbParent.insertAdjacentHTML('beforeend', listItemEntry);
                });
                !!breadcrumbNav && breadcrumbNav.remove();

                // add the listener to any additional links that have been exposed by expansion of a hierarchy item
                addListenerToHierarchyLinks();
            }, 200);
        }
        function addListenerToHierarchyLinks() {
            const listHeirarchyItems = document.querySelectorAll('#fullwidth-treeview a');
            // if they click on a link in the heirarchy box, it reloads, including the in-page breadcrumbs
            listHeirarchyItems.forEach((h) => {
                // if we haven't added a listener to the anchor, add it
                if (!h.hasAttribute('data-listener')) {
                    h.addEventListener('click', onHierarchyPageLoadMoveBreadcrumbs);
                    h.setAttribute('data-listener', `set`);
                }
            });
        }
    }, 100);
}

function createSlotForButtonInUtilityArea(button, id = null) {
    const slot = document.createElement('span');
    !!slot && slot.setAttribute('slot', 'site-utilities');
    !!slot && !!id && slot.setAttribute('id', id);
    !!button && !!slot && slot.appendChild(button);

    return slot;
}

function moveActionMenuToSiteHeader(siteHeader) {
    // retitle action menu from "Quick links" to "Menu"
    const quickLinksAnchor = document.querySelector('#quick-links-menu');
    !!quickLinksAnchor && (quickLinksAnchor.innerHTML = ''); // remove currrent contents, icon and accesible name
    quickLinksAnchor.textContent = 'Menu';

    // remove superfluous heading from menu body
    const actionMenuHeading = document.querySelector('[aria-labelledby="quick-links-menu"] li:has(h6.dropdown-header)');
    !!actionMenuHeading && actionMenuHeading.remove();

    // now move the Action menu

    // get the action button and popup area out of the existing html
    const menuButton = document.querySelector('#quick-links-menu');
    const menuDropdown = menuButton.nextElementSibling;

    // the existing ::after arrow doesn't act properly with our required "tight-link" hover. Create icons to replace it
    const arrowDownIconTemplate = document.createElement('template');
    arrowDownIconTemplate.innerHTML = `<svg class="downArrow" id="down-arrow" data-testid="down-arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <g id="icon/standard/chevron-down-sml">
            <path id="Chevron-down" d="M7 10L12 15L17 10" stroke="#51247A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </g>
    </svg>`;
    const arrowUpIconTemplate = document.createElement('template');
    arrowUpIconTemplate.innerHTML = `<svg class="upArrow" id="up-arrow" data-testid="up-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M17 14L12 9L7 14" stroke="#19151C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>`;

    // wrap the existing anchor text in a span and put the svgs inside the anchor
    // (the anchor itself must sit right beside the popup in the html for the Bootstrap open-on-click to work)
    menuButton.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const span = document.createElement('span');
            span.textContent = node.textContent;
            menuButton.replaceChild(span, node);
            !!menuButton && menuButton.appendChild(arrowDownIconTemplate.content.cloneNode(true));
            !!menuButton && menuButton.appendChild(arrowUpIconTemplate.content.cloneNode(true));
        }
    });

    const allWrapper = document.createElement('div');
    !!allWrapper && allWrapper.appendChild(menuButton);
    !!allWrapper && allWrapper.appendChild(menuDropdown);

    const slot = !!allWrapper && createSlotForButtonInUtilityArea(allWrapper, 'atomMenu');

    !!siteHeader && !!slot && siteHeader.appendChild(slot);
}
function moveAtomMenuPopup() {
    setInterval(() => {
        const siteHeader = document.querySelector('uq-site-header');
        const menu = !!siteHeader && siteHeader.querySelector('#atomMenu');
        const atomMenu = !!siteHeader && siteHeader.querySelector('#atomMenu [aria-labelledby="quick-links-menu"]');

        // atomMenu is default styled to 'display: none'
        // this is to prevent it visually moving across the screen
        // display: block is set when it has a bottom style
        if (!!atomMenu) {
            if (!!atomMenu.style.bottom) {
                // if has bottom property, then it must be open - reset inline transform style
                atomMenu.style.transform = 'translate(0, 40px)';
                atomMenu.style.display = 'block';
            } else {
                atomMenu.style.display = 'none';
            }
        }
    }, 100);
}

function relabelMainSearch() {
    const searchHeading = document.querySelector('#search-box h2');
    !!searchHeading &&
        searchHeading.classList.contains('visually-hidden') &&
        searchHeading.classList.remove('visually-hidden');
    !!searchHeading && (searchHeading.textContent = 'Fryer Library Manuscripts');

    const h3 = document.createElement('h3');
    !!h3 && h3.setAttribute('data-testid', 'Search');
    !!h3 && (h3.textContent = 'Search');
    !!h3 && !!searchHeading && searchHeading.after(h3);
}

function resetSearchPlaceholder() {
    const newPlaceholderText = 'Find manuscripts,  architectural drawings, photographs, and more';

    const inputField = document.getElementById('search-box-input');
    !!inputField && (inputField.placeholder = newPlaceholderText);
}

function makeH1Unique() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let h1Count = 0;
    headings.forEach((heading) => {
        if (heading.tagName === 'H1') {
            h1Count++;
        }
        if (h1Count > 1) {
            lowerHeadingLevel(heading);
        }
    });

    function lowerHeadingLevel(element) {
        // Function to lower heading level by 1
        const currentLevel = parseInt(element.tagName.substring(1));
        if (currentLevel < 6) {
            const newLevel = currentLevel + 1;
            const newElement = document.createElement('h' + newLevel);
            Array.from(element.attributes).forEach((attr) => {
                newElement.setAttribute(attr.name, attr.value);
            });
            while (element.firstChild) {
                newElement.appendChild(element.firstChild);
            }
            element.parentNode.replaceChild(newElement, element);
        }
    }
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

    addHeaderFooter();

    centerHeaderBlock();

    resizeSiteHeader();

    addCulturalAdviceBannerOnHeader();

    makeH1Unique();

    // handle span styling in custom-styles.scss
    setupLinksForStyling('ul[aria-labelledby="quick-links-menu"]'); // header menu
    setupLinksForStyling('ul[aria-labelledby="browse-menu"]'); // search Browse menu
    setupLinksForStyling('#collapse-aggregations');
    setupLinksForStyling('#sidebar'); // all left sidebar links
    setupLinksForStyling('#context-menu'); // all right sidebar links
    isFryerHomepage() && setupLinksForStyling('#sidebar section:first-of-type'); // homepage "Browse by" section

    highlightCulturallySignificantEntriesOnDetailPage();
    highlightCulturallySignificantEntriesOnListPage();

    splitSidebarIntoBoxes();

    fixSidebarSearchBox();

    relabelMainSearch();

    moveAtomMenuPopup();

    resetSearchPlaceholder();
}

ready(loadReusableComponentsAtom);

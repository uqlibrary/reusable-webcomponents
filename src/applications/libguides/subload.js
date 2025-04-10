fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

let scriptUrl = getIncludeFullPath('uq-lib-reusable.min.js');
console.log('real (unused) scriptUrl=', scriptUrl);
// 2024 test on feature, use staging longer term
if (getSearchParam2('override') === 'on' && getSearchParam2('useAlternate') === 'working') {
    // eg https://guides.library.uq.edu.au/how-to-find/news-and-newspapers?override=on&useAlternate=working
    scriptUrl = getIncludeFullPath(
        'uq-lib-reusable.min.js',
        'assets.library.uq.edu.au',
        '/reusable-webcomponents-development/webpresence-working/index-guides.html',
        'https://assets.library.uq.edu.au/reusable-webcomponents-development/webpresence-working/index-guides.html',
    );
    console.log('working scriptUrl=', scriptUrl);
    // 'https://assets.library.uq.edu.au/reusable-webcomponents-development/webpresence-working/uq-lib-reusable.min.js';
}
insertScript2(scriptUrl, true);

let cssFile = getIncludeFullPath('applications/libguides/custom-styles.css');
if (getSearchParam2('override') === 'on' && getSearchParam2('useAlternate') === 'working') {
    // 2024 test
    cssFile = scriptUrl = getIncludeFullPath(
        'applications/libguides/custom-styles.css',
        'assets.library.uq.edu.au',
        '/reusable-webcomponents-development/webpresence-working/index-guides.html',
    );
}
insertCssFile(cssFile);

const firstElement = document.body.children[0];

const gtm = document.createElement('uq-gtm');
!!gtm && gtm.setAttribute('gtm', 'GTM-NC7M38Q');
document.body.insertBefore(gtm, firstElement);

const header = document.createElement('uq-header');
!!header && header.setAttribute('hideLibraryMenuItem', '');
document.body.insertBefore(header, firstElement);

const siteHeader = document.createElement('uq-site-header');
!!siteHeader && siteHeader.setAttribute('secondleveltitle', 'Guides');
!!siteHeader && siteHeader.setAttribute('secondlevelurl', 'https://guides.library.uq.edu.au/');
!!siteHeader && document.body.insertBefore(siteHeader, firstElement);

if (!isInEditMode2()) {
    const authButton = createAuthButton2();
    !!siteHeader && !!authButton && siteHeader.appendChild(authButton);

    moveSpringshareBreadcrumbsToSiteHeader();
}

if (!document.querySelector('proactive-chat:not([display="inline"])')) {
    const proactiveChat = document.createElement('proactive-chat');
    !!proactiveChat && document.body.insertBefore(proactiveChat, firstElement);
}

if (!document.querySelector('alert-list')) {
    const alerts = document.createElement('alert-list');
    !!alerts && document.body.insertBefore(alerts, firstElement);
}

if (!document.querySelector('cultural-advice')) {
    const culturalAdvice = document.createElement('cultural-advice');
    !!culturalAdvice && document.body.insertBefore(culturalAdvice, firstElement);
}

const subFooter = document.createElement('uq-footer');
document.body.appendChild(subFooter);

function moveSpringshareBreadcrumbsToSiteHeader() {
    const awaitSiteHeader = setInterval(() => {
        const siteHeaderShadowRoot = siteHeader.shadowRoot;

        if (!!siteHeaderShadowRoot) {
            clearInterval(awaitSiteHeader);

            const breadcrumbNav = document.getElementById('s-lib-bc');
            const listItems = !!breadcrumbNav && breadcrumbNav.querySelectorAll('ol li');
            const breadcrumbParent = !!siteHeaderShadowRoot && siteHeaderShadowRoot.getElementById('breadcrumb_nav');
            !!listItems &&
                listItems.forEach((item) => {
                    const anchor = item.querySelector('a');
                    !!anchor && anchor.setAttribute('data-analytics', 'guide-breadcrumb');
                    const title = anchor ? anchor.textContent : item.textContent;
                    const href = anchor ? anchor.href : null;
                    if (isNotHomepage(href) && document.location.pathname !== '/') {
                        const listItemEntry = !!href ? breadcrumblink({ title, href }) : breadcrumbSpan(title);
                        breadcrumbParent.insertAdjacentHTML('beforeend', listItemEntry);
                    }
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
        function isNotHomepage(href) {
            return (
                href !== 'https://www.library.uq.edu.au/' &&
                href !== 'https://www.library.uq.edu.au' &&
                href !== 'http://www.library.uq.edu.au/' &&
                href !== 'http://www.library.uq.edu.au' &&
                href !== 'https://guides.library.uq.edu.au/' &&
                href !== 'https://guides.library.uq.edu.au'
            );
        }
    }, 100);
}

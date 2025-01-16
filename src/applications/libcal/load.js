function getSearchParam(name) {
    const url = window.location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get(name);
}

function ready(fn) {
    if (getSearchParam('override') === 'on' && getSearchParam('skipScript') === 'yes') {
        // to stop reusable being loaded, call it like this.
        // https://calendar.library.uq.edu.au/?override=on&skipScript=yes
        // You can then manually load things in the console
        return;
    }
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function loadReusableComponentsLibGuides() {
    function isOutsideUQ() {
        return window.location.href.indexOf('uq.edu.au') <= -1;
    }

    function createSlotForButtonInUtilityArea(button, id = null) {
        const slot = document.createElement('span');
        !!slot && slot.setAttribute('slot', 'site-utilities');
        !!slot && !!id && slot.setAttribute('id', id);
        !!button && !!slot && slot.appendChild(button);

        return slot;
    }

    function createAuthButton() {
        if (!!document.querySelector('auth-button')) {
            return false;
        }

        const authButton = document.createElement('auth-button');
        return !!authButton && createSlotForButtonInUtilityArea(authButton, 'auth');
    }

    function fontLoader(font) {
        var headID = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        headID.appendChild(link);
        link.href = font;
    }
    function breadcrumblink(b) {
        // truncate the breadcrumb title manually because updating the springshare setting has Consequences
        const title = isCalendarHomepage(b.href) ? 'Calendar' : b.title;
        return `<li class="uq-breadcrumb__item">
                    <a class="uq-breadcrumb__link" title="${b.title}" href="${b.href}">${title}</a>
                    </li>`;
    }
    function breadcrumbSpan(title) {
        return `<li class="uq-breadcrumb__item">
                    <span class="uq-breadcrumb__link" title="${title}">${title}</span>
                    </li>`;
    }
    function isLibraryHomepage(href) {
        return (
            href === 'https://www.library.uq.edu.au/' ||
            href === 'https://www.library.uq.edu.au' ||
            href === 'http://www.library.uq.edu.au/' ||
            href === 'http://www.library.uq.edu.au'
        );
    }
    function isCalendarHomepage(href) {
        return (
            href !== 'https://calendar.library.uq.edu.au/' &&
            href !== 'https://calendar.library.uq.edu.au' &&
            href !== 'http://calendar.library.uq.edu.au/' &&
            href !== 'http://calendar.library.uq.edu.au'
        );
    }
    function moveSpringshareBreadcrumbsToSiteHeader(siteHeader) {
        const awaitSiteHeader = setInterval(() => {
            const siteHeaderShadowRoot = siteHeader.shadowRoot;
            if (!!siteHeaderShadowRoot) {
                clearInterval(awaitSiteHeader);

                const breadcrumbNav = document.querySelector('#s-lc-public-bc nav');
                const listItems = !!breadcrumbNav && breadcrumbNav.querySelectorAll('ol li');

                const breadcrumbParent =
                    !!siteHeaderShadowRoot && siteHeaderShadowRoot.getElementById('breadcrumb_nav');
                !!listItems &&
                    listItems.forEach((item) => {
                        const anchor = item.querySelector('a');
                        const title = anchor ? anchor.textContent : item.textContent;
                        const href = anchor ? anchor.href : null;
                        if (!isLibraryHomepage(href)) {
                            const listItemEntry = !!href ? breadcrumblink({ title, href }) : breadcrumbSpan(title);
                            breadcrumbParent.insertAdjacentHTML('beforeend', listItemEntry);
                        }
                    });
                !!breadcrumbNav && breadcrumbNav.remove();
            }
        }, 100);
    }

    // start of page update
    fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    const firstElement = document.body.children[0];

    const gtm = document.createElement('uq-gtm');
    !!gtm && gtm.setAttribute('gtm', 'GTM-NC7M38Q');
    document.body.insertBefore(gtm, firstElement);

    const header = document.createElement('uq-header');
    !!header && header.setAttribute('hidelibrarymenuitem', true);
    document.body.insertBefore(header, firstElement);

    const siteHeader = document.createElement('uq-site-header');
    siteHeader.setAttribute('skipnavid', 's-lc-public-main');

    if (!isOutsideUQ()) {
        const authButton = createAuthButton();
        !!siteHeader && !!authButton && siteHeader.appendChild(authButton);
    }

    !!siteHeader && moveSpringshareBreadcrumbsToSiteHeader(siteHeader);

    if (!document.querySelector('cultural-advice')) {
        const culturalAdvice = document.createElement('cultural-advice');
        !!culturalAdvice && document.body.insertBefore(culturalAdvice, firstElement);
    }

    document.body.insertBefore(siteHeader, firstElement);

    // Proactive Chat button
    if (!document.querySelector('proactive-chat')) {
        const proactiveChat = document.createElement('proactive-chat');
        !!proactiveChat && document.body.insertBefore(proactiveChat, firstElement);
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && document.body.insertBefore(alerts, firstElement);
    }

    // const connectFooter = document.createElement('connect-footer');
    // document.body.appendChild(connectFooter);

    const subFooter = document.createElement('uq-footer');
    document.body.appendChild(subFooter);
}

ready(loadReusableComponentsLibGuides);

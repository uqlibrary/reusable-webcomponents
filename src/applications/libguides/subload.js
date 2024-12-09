fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

insertScript(getScriptUrl('uq-lib-reusable.min.js'), true);

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

if (!isInEditMode()) {
    const authButton = createAuthButton();
    !!siteHeader && !!authButton && siteHeader.appendChild(authButton);

    // get list of breadcrumbs from guides nav
    const breadcrumbNav = document.getElementById('s-lib-bc');
    const listItems = !!breadcrumbNav && breadcrumbNav.querySelectorAll('ol li');
    const breadcrumbData = [];
    !!listItems &&
        listItems.forEach((item) => {
            const anchor = item.querySelector('a');
            const title = anchor ? anchor.textContent : item.textContent;
            const href = anchor ? anchor.href : null;
            if (
                href !== 'https://www.library.uq.edu.au/' &&
                href !== 'https://www.library.uq.edu.au' &&
                href !== 'http://www.library.uq.edu.au/' &&
                href !== 'http://www.library.uq.edu.au' &&
                href !== 'https://guides.library.uq.edu.au/' &&
                href !== 'https://guides.library.uq.edu.au'
            ) {
                breadcrumbData.push({ title, href });
            }
        });

    const breadcrumbParent = siteHeader.shadowRoot.getElementById('breadcrumb_nav');
    !!breadcrumbParent &&
        breadcrumbData.length > 0 &&
        breadcrumbData.forEach((gb) => {
            console.log('gb=', gb);
            const listItemEntry = !!gb.href
                ? `<li class="uq-breadcrumb__item">
                <a class="uq-breadcrumb__link" href="${gb.href}">${gb.title}</a>
                </li>`
                : `<li class="uq-breadcrumb__item">
                <span class="uq-breadcrumb__link">${gb.title}</span>
                </li>`;
            breadcrumbParent.insertAdjacentHTML('beforeend', listItemEntry);
        });
    !!breadcrumbNav && breadcrumbNav.remove();
}

document.body.insertBefore(siteHeader, firstElement);

if (!document.querySelector('cultural-advice-popup')) {
    const culturalAdvice = document.createElement('cultural-advice-popup');
    !!culturalAdvice && document.body.appendChild(culturalAdvice);
}

!!siteHeader && document.body.insertBefore(siteHeader, firstElement);

// Proactive Chat button
if (!isInEditMode()) {
    if (!document.querySelector('proactive-chat')) {
        const proactiveChat = document.createElement('proactive-chat');
        !!proactiveChat && document.body.insertBefore(proactiveChat, firstElement);
    }
}

if (!document.querySelector('alert-list')) {
    const alerts = document.createElement('alert-list');
    !!alerts && document.body.insertBefore(alerts, firstElement);
}

if (!document.querySelector('cultural-advice')) {
    const culturalAdvice = document.createElement('cultural-advice');
    const alerts = document.getElementsByTagName('alert-list');
    const alert = alerts[0];
    !!culturalAdvice && !!alert && alert.parentNode.insertBefore(culturalAdvice, alert.nextSibling);
}

// const connectFooter = document.createElement('connect-footer');
// document.body.appendChild(connectFooter);

const subFooter = document.createElement('uq-footer');
document.body.appendChild(subFooter);
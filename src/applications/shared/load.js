function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// example usage: insertFontFile('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
function insertFontFile(fontUrl) {
    const link = document.createElement('link');
    !!link && (link.type = 'text/css');
    !!link && (link.rel = 'stylesheet');
    !!link && (link.href = fontUrl);

    const headElement = document.querySelector('head');
    !!headElement && !!link && headElement.appendChild(link);
}

function loadReusableComponents() {
    insertFontFile('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

    const firstElement = document.body.children[0];
    if (!firstElement) {
        return;
    }

    if (!document.querySelector('uq-gtm')) {
        const gtm = document.createElement('uq-gtm');
        !!gtm && gtm.setAttribute('gtm', 'GTM-NC7M38Q');
        !!gtm && document.body.insertBefore(gtm, firstElement);
    }

    if (!document.querySelector('uq-header')) {
        const header = document.createElement('uq-header');
        header.setAttribute('hideLibraryMenuItem', '');
        header.setAttribute('skipnavid', 'content');
        !!header && document.body.insertBefore(header, firstElement);
    }

    if (!document.querySelector('uq-site-header')) {
        const siteHeader = document.createElement('uq-site-header');

        // no utility area buttons are required in this suite

        !!siteHeader && document.body.insertBefore(siteHeader, firstElement);
    }
    if (!document.querySelector('cultural-advice')) {
        const culturalAdvice = document.createElement('cultural-advice');
        !!culturalAdvice && document.body.insertBefore(culturalAdvice, firstElement);
    }

    if (!document.querySelector('alert-list')) {
        const alerts = document.createElement('alert-list');
        !!alerts && document.body.insertBefore(alerts, firstElement);
    }

    // the Ops-run shared apps do not have a connect footer
    if (!document.querySelector('uq-footer')) {
        const subFooter = document.createElement('uq-footer');
        !!subFooter && document.body.appendChild(subFooter);
    }
}

ready(loadReusableComponents);

function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function createSlotForButtonInUtilityArea(button, id = null) {
    const slot = document.createElement('span');
    !!slot && slot.setAttribute('slot', 'site-utilities');
    !!slot && !!id && slot.setAttribute('id', id);
    !!button && !!slot && slot.appendChild(button);

    return slot;
}

function loadReusableComponents() {
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
        !!siteHeader && document.body.insertBefore(siteHeader, firstElement);
    }
    // Proactive Chat button
    if (!document.querySelector('proactive-chat:not([display="inline"])')) {
        const proactiveChat = document.createElement('proactive-chat');
        !!proactiveChat && document.body.insertBefore(proactiveChat, firstElement);
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

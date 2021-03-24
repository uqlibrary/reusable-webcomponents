function ready(fn) {
    if (document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function loadReusableComponents() {
    const firstElement = document.body.children[0];

    const header = document.createElement('uq-header');
    document.body.insertBefore(header, firstElement);

    const siteHeader = document.createElement('uq-site-header');
    siteHeader.setAttribute('showLoginButton', "");
    document.body.insertBefore(siteHeader, firstElement);

    const connectFooter = document.createElement('connect-footer');
    document.body.appendChild(connectFooter);

    const subFooter = document.createElement('uq-footer');
    document.body.appendChild(subFooter);
}

ready(loadReusableComponents);
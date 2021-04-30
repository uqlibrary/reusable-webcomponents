function insertScript(url, defer = false) {
    const scriptfound = document.querySelector("script[src*='" + url + "']");
    if (!scriptfound) {
        const heads = document.getElementsByTagName('head');
        if (heads && heads.length) {
            const head = heads[0];
            if (head) {
                const script = document.createElement('script');
                script.setAttribute('src', url);
                script.setAttribute('type', 'text/javascript');
                !!defer && script.setAttribute('defer', '');
                head.appendChild(script);
            }
        }
    }
}
// we insert this script here, rather than the Springshare admin panel, so we can supply the defer attribute
insertScript('https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js', true);

function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function loadUQFavicon() {
    const favicon = document.querySelector('link[rel=icon]');

    favicon.type = 'image/x-icon';
    favicon.rel = 'shortcut icon';
    favicon.href = '//www.library.uq.edu.au/favicon.ico';
}

function loadReusableComponents() {
    loadUQFavicon();

    // remove the springdshare skip-to-content so that we get a consistent experience across the Library
    const springshareSkipLink = document.querySelector('.skip-to-main');
    !!springshareSkipLink && springshareSkipLink.remove();

    // add a lander for our skiptonav
    const skiptohere = document.createElement('a');
    !!skiptohere && (skiptohere.id = 'skiptohere');
    !!skiptohere && (skiptohere.href = '#');

    const maincontent = document.getElementById('main-content');
    !!maincontent && !!skiptohere && maincontent.parentElement.insertBefore(skiptohere, maincontent);

    // springshare adds a style, presumably for their header, that conflicts, and is stupid. delete.
    const centerBlock = document.querySelector('.text-center');
    !!centerBlock && (centerBlock.className = centerBlock.className.replace(/\btext-center\b/g, ''));
}

ready(loadReusableComponents);

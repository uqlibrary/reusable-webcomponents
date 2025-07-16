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
    let favicon = document.querySelector('link[rel=icon]');

    if (!favicon) {
        favicon = document.createElement('link');
    }

    !!favicon && (favicon.type = 'image/x-icon');
    !!favicon && (favicon.rel = 'icon');
    !!favicon && (favicon.href = '//www.library.uq.edu.au/favicon.ico');
}

function fontLoader(font) {
    var headID = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    headID.appendChild(link);
    link.href = font;
}

function loadReusableComponents() {
    fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
    loadUQFavicon();

    // remove the springdshare skip-to-content so that we get a consistent experience across the Library
    const springshareSkipLink = document.querySelector('.skip-to-main');
    !!springshareSkipLink && springshareSkipLink.remove();

    // add a lander for our skiptonav
    const skiptohere = document.createElement('a');
    !!skiptohere && (skiptohere.id = 'skiptohere');
    !!skiptohere && skiptohere.setAttribute('data-analytics', 'skiptohere');
    !!skiptohere && (skiptohere.href = '#');

    const maincontent = document.getElementById('main-content');
    !!maincontent && !!skiptohere && maincontent.parentElement.insertBefore(skiptohere, maincontent);

    // springshare adds a style, presumably for their header, that conflicts, and is stupid. delete.
    const centerBlock = document.querySelector('.text-center');
    !!centerBlock && (centerBlock.className = centerBlock.className.replace(/\btext-center\b/g, ''));
}

ready(loadReusableComponents);

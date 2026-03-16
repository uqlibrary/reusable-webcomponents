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
    insertFontFile('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    insertFontFile('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    insertFontFile('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    insertFontFile('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
    loadUQFavicon();

    // remove the springdshare skip-to-content so that we get a consistent experience across the Library
    const springshareSkipLink = document.querySelector('.skip-to-main');
    !!springshareSkipLink && springshareSkipLink.remove();

    // add a lander for our skiptonav
    const skiptohere = document.createElement('a');
    !!skiptohere && (skiptohere.id = 'skiptohere');
    !!skiptohere && skiptohere.setAttribute('data-analyticsid', 'skiptohere');
    !!skiptohere && (skiptohere.href = '#');

    const maincontent = document.getElementById('main-content');
    !!maincontent && !!skiptohere && maincontent.parentElement.insertBefore(skiptohere, maincontent);

    // springshare adds a style, presumably for their header, that conflicts, and is stupid. delete.
    const centerBlock = document.querySelector('.text-center');
    !!centerBlock && (centerBlock.className = centerBlock.className.replace(/\btext-center\b/g, ''));
}

ready(loadReusableComponents);

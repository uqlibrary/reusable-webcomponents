function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// function fontLoader(font) {
//     var headID = document.getElementsByTagName('head')[0];
//     var link = document.createElement('link');
//     link.type = 'text/css';
//     link.rel = 'stylesheet';
//     headID.appendChild(link);
//     link.href = font;
// }

function insertScript(url, defer = false) {
    const scriptfound = document.querySelector("script[src*='" + url + "']");
    if (!scriptfound) {
        const heads = document.getElementsByTagName('head');
        if (heads && heads.length) {
            const head = heads[0];
            if (head) {
                const script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', url);
                !!defer && script.setAttribute('defer', '');
                head.appendChild(script);
            }
        }
    }
}

function loadReusableComponentsDrupal() {
    insertScript('https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js', true);

    // fontLoader('https://static.uq.net.au/v15/fonts/Roboto/roboto.css');
    // fontLoader('https://static.uq.net.au/v15/fonts/Merriweather/merriweather.css');
    // fontLoader('https://static.uq.net.au/v15/fonts/Montserrat/montserrat.css');
    // fontLoader('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
}

ready(loadReusableComponentsDrupal);

function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function updateLogoLink() {
    const logoElement = document.getElementById('logo');
    !!logoElement && logoElement.setAttribute('href', 'https://www.uq.edu.au/');
}

// TODO: move styles into an included .scss file and add hover styling, as per RaP button
function addBookNowLink() {
    const buttonlabel = 'Book now to view this item';
    const bookingUrl = 'https://calendar.library.uq.edu.au/reserve/spaces/reading-room';
    const styles =
        'background-color: #2377CB; color: #fff; padding: 9px; max-width: 180px; display: block; text-align: center; font-size: 14px; border-radius: 2px; margin: 0.5em;';
    const html = `<div><a href="${bookingUrl}" style="${styles}">${buttonlabel}</a></div>`;

    const parentElement = document.getElementById('context-menu');
    !!parentElement && parentElement.insertAdjacentHTML('beforebegin', html);
}

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

function loadReusableComponentsAtom() {
    insertScript('https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js', true);

    updateLogoLink();

    addBookNowLink();
}

ready(loadReusableComponentsAtom);

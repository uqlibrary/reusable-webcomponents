const template = document.createElement('template');
template.innerHTML = `
    <!-- Google Tag Manager (noscript) -->
    <noscript>
    <iframe
        id="gtm"
        src="https://www.googletagmanager.com/ns.html?id="
        height="0"
        width="0"
        style="display:none;visibility:hidden"
        >
    </iframe>
    </noscript>
    <!-- End Google Tag Manager (noscript) -->
`;

class gtm extends HTMLElement {
    constructor() {
        super();

        const defaultGtmCode = 'GTM-W4KK37';
        const gtmCode = this.getAttribute('gtm') || defaultGtmCode;

        const gtmElement = template.content.getElementById('gtm');
        !!gtmElement && (gtmElement.src = "https://www.googletagmanager.com/ns.html?id=" + gtmCode);

        // <!-- Google Tag Manager -->
        (function (w, d, s, l, i) {
            console.log('UQ Lib reusable gtm');
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start':
                    new Date().getTime(), event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', gtmCode);
        // <!-- End Google Tag Manager -->

        // Render the template into the body
        document.body.appendChild(template.content.cloneNode(true));
    }
}

export default gtm;

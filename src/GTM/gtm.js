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
let hasInserted = false;
class gtm extends HTMLElement {
    constructor() {
        super();
        this.loadJS = this.loadJS.bind(this);
        const gtm = this.getAttribute('gtm');
        if (!!gtm) {
            this.loadJS(gtm);
        }
    }
    loadJS(gtm) {
        if (!!gtm && !hasInserted) {
            hasInserted = true;
            const gtmElement = template.content.getElementById('gtm');
            !!gtmElement && (gtmElement.src = 'https://www.googletagmanager.com/ns.html?id=' + gtm);

            // <!-- Google Tag Manager -->
            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js',
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    /* istanbul ignore next */
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', gtm);
            // <!-- End Google Tag Manager -->

            // Render the template into the body
            document.body.appendChild(template.content.cloneNode(true));
        }
    }
    static get observedAttributes() {
        return ['gtm'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.loadJS(newValue);
    }
}

export default gtm;

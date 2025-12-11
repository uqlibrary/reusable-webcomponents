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
        const gtmId = this.getAttribute('gtm');
        if (!!gtmId) {
            this.loadJS(gtmId);
        }
    }
    loadJS(gtmId) {
        if (!!gtmId && !hasInserted) {
            hasInserted = true;
            const gtmElement = template.content.getElementById('gtm');
            !!gtmElement && (gtmElement.src = 'https://www.googletagmanager.com/ns.html?id=' + gtmId);

            // <!-- Google Tag Manager -->
            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js',
                });
                const fTags = !!s && !!d && d.getElementsByTagName(s);
                const f = !!fTags && fTags.length > 0 && fTags[0];
                const dl = !!l && l !== 'dataLayer' ? '&l=' + l : '';
                const j = !!s && d.createElement(s);
                if (!j) {
                    return;
                }
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                console.log('gtm:: j.src=', j.src);
                !!f && f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', gtmId);
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

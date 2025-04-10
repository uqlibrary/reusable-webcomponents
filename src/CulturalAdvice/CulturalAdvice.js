import culturalcss from './css/culturaladvicebanner.css';
import { linkToDrupal } from '../helpers/access';

/**
 * API
 *  <cultural-advice-popup
 *      secondsTilCulturalAdviceAppears=3    -- default 1
 *  />
 * </cultural-advice-popup>
 *
 */

const template = document.createElement('template');
template.innerHTML = `
    <style>${culturalcss}</style>
    <div class="culturaladvice">
            <div class="layout-card">
                <p data-testid="cultural-advice-statement">
                    The Library is custodian of <a href="${linkToDrupal(
                        '/find-and-borrow/collections-overview/using-culturally-sensitive-collections',
                    )}">culturally sensitive Aboriginal and Torres Strait Islander materials</a>.
                </p>
            </div>
    </div>
`;

class CulturalAdvice extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        this.addButtonListeners(shadowDOM);
    }

    addButtonListeners(shadowDOM) {
        const that = this;

        const CAlink = shadowDOM.querySelector('p#cultural-advice-statement a');
        !!CAlink &&
            CAlink.addEventListener('click', function (e) {
                console.log('CulturalAdvice CA click');
                that.sendSubmitToGTM(e); // submit the GTM info, then carry on to the normal href navigation
            });
    }

    /**
     * Events aren't sending properly to GTM, so we force them manually here
     * @param e
     */
    sendSubmitToGTM(e) {
        window.dataLayer = window.dataLayer || []; // for tests
        console.log('CulturalAdvice sendSubmitToGTM: e');
        console.log(e);
        console.log('CulturalAdvice sendSubmitToGTM: window.dataLayer');
        console.log(window);
        console.log(window.dataLayer);

        // the user has clicked a link that we have attached a click handler to
        const gtmItems = {
            event: 'gtm.linkClick',
            'gtm.elementId': e.target['data-analyticsid'] || e.target.id || e.target.closest('[id]').id,
            'gtm.id': e.target['data-analyticsid'] || e.target.id || e.target.closest('[id]').id,
            'gtm.element': !!e && !!e.target && e.target.innerHTML,
        };
        console.log('### shadowdom send');
        console.log(gtmItems);
        window.dataLayer.push(gtmItems);
    }
}

export default CulturalAdvice;

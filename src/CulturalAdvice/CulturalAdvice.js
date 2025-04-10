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
                <p data-analyticsid="cultural-advice-statement" data-testid="cultural-advice-statement">
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
        console.log('addButtonListeners');
        const that = this;

        const CAlink = shadowDOM.querySelector('p a');

        console.log('addButtonListeners', CAlink);
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
        console.log('e.target');
        console.log(e.target);

        const wrappingLink = e.target.closest('a');
        console.log('wrappingLink');
        console.log(wrappingLink);
        console.log('wrappingLink id');
        console.log(wrappingLink?.id);
        console.log('wrappingLink DA');
        console.log(wrappingLink?.getAttribute('data-analyticsid'));

        const closestElementDA = e.target.closest('[data-analyticsid]');
        console.log('closestElement DA');
        console.log(closestElementDA?.getAttribute('data-analyticsid'));
        console.log('wrappingLink closest id');
        console.log(wrappingLink?.closest('[id]')?.id);

        const gtmItems = {
            event: 'gtm.linkClick',
            'gtm.elementId':
                wrappingLink?.getAttribute('data-analyticsid') ||
                wrappingLink?.id ||
                closestElementDA?.getAttribute('data-analyticsid') ||
                wrappingLink?.closest('[id]')?.id,
            'gtm.id':
                wrappingLink?.getAttribute('data-analyticsid') ||
                wrappingLink?.id ||
                closestElementDA?.getAttribute('data-analyticsid') ||
                wrappingLink?.closest('[id]')?.id,
            'gtm.element': !!e && !!e.target && e.target.innerHTML,
        };
        console.log(gtmItems);
        window.dataLayer.push(gtmItems);
        console.log('### shadowdom sent');
    }
}

export default CulturalAdvice;

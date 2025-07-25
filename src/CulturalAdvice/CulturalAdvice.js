import culturalcss from './css/culturaladvicebanner.css';
import { linkToDrupal } from '../helpers/access';
import { sendLinkClickToGTM } from '../helpers/gtmHelpers';

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

        this.addButtonListeners = this.addButtonListeners.bind(this);
    }
    addButtonListeners(shadowDOM) {
        const links = shadowDOM.querySelectorAll('a');
        !!links &&
            links.length > 0 &&
            links.forEach((l) =>
                l.addEventListener('click', (e) => {
                    sendLinkClickToGTM(e);
                }),
            );
    }
}

export default CulturalAdvice;

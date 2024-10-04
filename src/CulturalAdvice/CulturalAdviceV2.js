import culturalcss from './css/culturaladviceV2.css';
import { cookieNotFound, setCookie } from '../helpers/cookie';
import { addClassToElement, removeClassFromElement } from '../helpers/classManager';

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
    <div class="culturaladvicev2">
            <div class="layout-card">
                <p>
                    The Library is custodian of <a href="https://web.library.uq.edu.au/collections/culturally-sensitive-collections">culturally sensitive Aboriginal and Torres Strait Islander materials</a>.
                </p>
            </div>
    </div>
`;

class CulturalAdviceV2 extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));
        //this.updateCADom(shadowDOM);
    }
}

export default CulturalAdviceV2;

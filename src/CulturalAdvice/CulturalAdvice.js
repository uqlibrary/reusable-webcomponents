import culturalcss from './css/culturaladvice.css';
import { cookieNotFound, setCookie } from '../helpers/cookie';

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
    <div id="culturaladvice-popup">
        <div id="culturaladvice-container" class="culturaladvice-initial culturaladvice-popup-hidden">
                <div class="title" style="float: left;">Cultural advice</div>
                <span id="culturaladvice-container-dismiss">&times;</span>
                <div class="culturaladvice-wording" style="clear:both">
                    <p>Aboriginal and Torres Strait Islander peoples are advised that our collections and sites may contain images, voices or names of persons now deceased. Information may be culturally sensitive for some individuals and communities.</p>
                    <p style="text-align: right">
                        <a id="cultural-advice-read-more" 
                        href="https://web.library.uq.edu.au/collections/culturally-sensitive-collections">
                            Read more
                        </a>
                    </p>    
                </div>
            </div>
        <div id="culturaladvice-tab" class="culturaladvice-tab-hidden">
                <span>Cultural advice</span>
        </div>
    </div>
`;

const CULTURAL_ADVICE_HIDDEN_COOKIE_NAME = 'UQ_CULTURAL_ADVICE';
const CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE = 'hidden';

class CulturalAdvice extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const secondsTilCAAppears = this.getAttribute('secondsTilCulturalAdviceAppears') || 1;
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));
        this.updateCADom(shadowDOM, secondsTilCAAppears);
    }

    isCAHidden() {
        const hideCulturalAdvice = this.getAttribute('hideCulturalAdvice');
        return hideCulturalAdvice === 'true' || hideCulturalAdvice === '';
    }

    async updateCADom(shadowRoot, secondsTilCAAppears) {
        const dismissCA = () => {
            shadowRoot.getElementById('culturaladvice-container').classList.add('culturaladvice-popup-hidden');
            shadowRoot.getElementById('culturaladvice-tab').classList.remove('culturaladvice-tab-hidden');
            const date = new Date();
            date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
            setCookie(CULTURAL_ADVICE_HIDDEN_COOKIE_NAME, CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE, date);
        };
        const showCA = () => {
            shadowRoot.getElementById('culturaladvice-container').classList.remove('culturaladvice-popup-hidden');
            shadowRoot.getElementById('culturaladvice-tab').classList.add('culturaladvice-tab-hidden');
        };
        // Add event listeners to Close and Tab
        shadowRoot.getElementById('culturaladvice-container-dismiss').addEventListener('click', dismissCA);
        shadowRoot.getElementById('culturaladvice-tab').addEventListener('click', showCA);
        // Start presentation timer - show Tab OR advice based on cookie.
        setTimeout(() => {
            if (cookieNotFound(CULTURAL_ADVICE_HIDDEN_COOKIE_NAME, CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE)) {
                shadowRoot.getElementById('culturaladvice-container').classList.remove('culturaladvice-popup-hidden');
            } else {
                shadowRoot.getElementById('culturaladvice-container').classList.add('culturaladvice-popup-hidden');
                shadowRoot.getElementById('culturaladvice-tab').classList.remove('culturaladvice-tab-hidden');
            }
        }, secondsTilCAAppears * 1000);
    }
}

export default CulturalAdvice;

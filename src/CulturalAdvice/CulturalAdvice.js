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
    <div id="culturaladvice-popup" data-testid="culturaladvice-popup">
        <div id="culturaladvice-container" data-testid="culturaladvice-container" class="culturaladvice-popup-hidden">
            <h2 class="title" style="float: left;">Cultural advice</h2>
            <span id="culturaladvice-container-dismiss" data-testid="culturaladvice-container-dismiss">&times;</span>
            <div class="culturaladvice-wording" style="clear:both">
                <p>Aboriginal and Torres Strait Islander peoples are advised that our collections and sites may contain images, voices or names of persons now deceased. Information may be culturally sensitive for some individuals and communities.</p>
                <p style="text-align: left">
                    <a id="cultural-advice-read-more" data-testid="cultural-advice-read-more" href="https://web.library.uq.edu.au/collections/culturally-sensitive-collections">
                    Culturally sensitive collections
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
        // Get the dom for Proactive Chat.
        const setCACookie = () => {
            const date = new Date();
            date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
            setCookie(CULTURAL_ADVICE_HIDDEN_COOKIE_NAME, CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE, date);
        };
        const navigateToCSC = () => {
            setCACookie();
            // window.location.assign('https://web.library.uq.edu.au/collections/culturally-sensitive-collections');
        };
        const dismissCA = () => {
            const proactiveChatElement = document.getElementsByTagName('proactive-chat');
            proactiveChatElement.length > 0 && proactiveChatElement[0].setAttribute('caforcehidemobile', 'false');
            shadowRoot.getElementById('culturaladvice-container').classList.remove('culturaladvice-popup-shown');
            shadowRoot.getElementById('culturaladvice-container').classList.add('culturaladvice-popup-hidden');
            shadowRoot.getElementById('culturaladvice-tab').classList.remove('culturaladvice-tab-hidden');
            setCACookie();
        };
        const showCA = () => {
            const proactiveChatElement = document.getElementsByTagName('proactive-chat');
            proactiveChatElement.length > 0 && proactiveChatElement[0].setAttribute('caforcehidemobile', 'true');
            shadowRoot.getElementById('culturaladvice-container').classList.remove('culturaladvice-popup-hidden');
            shadowRoot.getElementById('culturaladvice-container').classList.add('culturaladvice-popup-shown');
            shadowRoot.getElementById('culturaladvice-tab').classList.add('culturaladvice-tab-hidden');
        };
        // Add event listeners to Close and Tab
        shadowRoot.getElementById('culturaladvice-container-dismiss').addEventListener('click', dismissCA);
        shadowRoot.getElementById('culturaladvice-tab').addEventListener('click', showCA);
        shadowRoot.getElementById('cultural-advice-read-more').addEventListener('click', navigateToCSC);
        // Start presentation timer - show Tab OR advice based on cookie.
        setTimeout(() => {
            const proactiveChatElement = document.getElementsByTagName('proactive-chat');
            if (cookieNotFound(CULTURAL_ADVICE_HIDDEN_COOKIE_NAME, CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE)) {
                proactiveChatElement.length > 0 && proactiveChatElement[0].setAttribute('caforcehidemobile', 'true');
                shadowRoot.getElementById('culturaladvice-container').classList.remove('culturaladvice-popup-hidden');
                shadowRoot.getElementById('culturaladvice-container').classList.add('culturaladvice-popup-shown');
            } else {
                proactiveChatElement.length > 0 && proactiveChatElement[0].setAttribute('caforcehidemobile', 'false');
                shadowRoot.getElementById('culturaladvice-container').classList.add('culturaladvice-popup-hidden');
                shadowRoot.getElementById('culturaladvice-container').classList.remove('culturaladvice-popup-shown');
                shadowRoot.getElementById('culturaladvice-tab').classList.remove('culturaladvice-tab-hidden');
            }
        }, secondsTilCAAppears * 1000);
    }
}

export default CulturalAdvice;

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
            <!-- <span id="culturaladvice-container-dismiss" data-testid="culturaladvice-container-dismiss">&times;</span> -->
            <button type="button" title="close cultural advice" class="culturaladvice-dismiss" id="culturaladvice-container-dismiss" data-testid="culturaladvice-container-dismiss">
            <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
            </button>
            <div id="cultural-advice-title" class="culturaladvice-wording"  style="clear:both">
                <p id="cultural-advice-content">Aboriginal and Torres Strait Islander peoples are advised that our collections and sites may contain images, voices or names of persons now deceased. Information may be culturally sensitive for some individuals and communities.</p>
                <p style="text-align: left">
                    <a id="cultural-advice-read-more" data-testid="cultural-advice-read-more" href="https://web.library.uq.edu.au/collections/culturally-sensitive-collections" target="_blank">
                    Culturally sensitive collections
                    </a>
                </p>    
            </div>
        </div>
        <div id="culturaladvice-tab" role="button" title="Cultural Advice" data-testid="culturaladvice-tab" class="culturaladvice-tab-shown">
                <span>Cultural advice</span>
        </div>
    </div>
`;

const CULTURAL_ADVICE_HIDDEN_COOKIE_NAME = 'UQ_CULTURAL_ADVICE';
const CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE = 'hidden';
let addClass = true;
let removeClass = true;

class CulturalAdvice extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const secondsTilCAAppears = this.getAttribute('secondsTilCulturalAdviceAppears') || 1;
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        console.log('Rendering shadowdom child');
        shadowDOM.appendChild(template.content.cloneNode(true));
        this.updateCADom(shadowDOM, secondsTilCAAppears);
    }

    isCAHidden() {
        const hideCulturalAdvice = this.getAttribute('hideCulturalAdvice');
        return hideCulturalAdvice === 'true' || hideCulturalAdvice === '';
    }

    async updateCADom(shadowRoot, secondsTilCAAppears) {
        // Get the dom for Proactive Chat.

        const bindScrollFunction = (shadowRoot) => {
            const TAB_PARAM = 155;
            const HEIGHT_LIMIT = 820;
            if (document.body.scrollHeight - window.scrollY - TAB_PARAM * 2 < HEIGHT_LIMIT) {
                if (addClass) {
                    shadowRoot.getElementById('culturaladvice-tab').classList.add('compensate-mobile');
                    // To stop dom throttling - Just add the class ONCE.
                    addClass = false;
                    removeClass = true;
                }
            } else {
                if (removeClass) {
                    shadowRoot.getElementById('culturaladvice-tab').classList.remove('compensate-mobile');
                    // To stop dom throttling - Just remove the class ONCE.
                    addClass = true;
                    removeClass = false;
                }
            }
        };

        const isPrimoPage = (hostname) => {
            var regExp = /(.*)exlibrisgroup.com/i;
            return 'search.library.uq.edu.au' === hostname || regExp.test(hostname);
        };
        if (!isPrimoPage(window.location.hostname)) {
            try {
                document.addEventListener('scroll', (event) => {
                    bindScrollFunction(shadowRoot);
                });
            } catch (e) {
                console.log('Failed to bind', e);
            }
        }

        const setCACookie = () => {
            const date = new Date();
            date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
            setCookie(CULTURAL_ADVICE_HIDDEN_COOKIE_NAME, CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE, date);
        };

        const navigateToCSC = (event) => {
            const url = 'https://web.library.uq.edu.au/collections/culturally-sensitive-collections';
            event.preventDefault();
            setCACookie();
            // Potentially Dismiss CA here if requested, with dismissCA();

            if (!isPrimoPage(window.location.hostname)) {
                window.location.assign(url);
            } else {
                window.open(url);
            }
        };
        const dismissCA = () => {
            const proactiveChatElement = document.getElementsByTagName('proactive-chat');
            proactiveChatElement.length > 0 && proactiveChatElement[0].setAttribute('caforcehidemobile', 'false');
            shadowRoot.getElementById('culturaladvice-container').classList.remove('culturaladvice-popup-shown');
            shadowRoot.getElementById('culturaladvice-container').classList.add('culturaladvice-popup-hidden');
            shadowRoot.getElementById('culturaladvice-tab').classList.remove('culturaladvice-tab-hidden');
            shadowRoot.getElementById('culturaladvice-tab').classList.add('culturaladvice-tab-shown');
            shadowRoot.getElementById('culturaladvice-container').setAttribute('aria-hidden', 'true');
            setCACookie();
        };
        const showCA = () => {
            const proactiveChatElement = document.getElementsByTagName('proactive-chat');
            proactiveChatElement.length > 0 && proactiveChatElement[0].setAttribute('caforcehidemobile', 'true');
            shadowRoot.getElementById('culturaladvice-container').classList.remove('culturaladvice-popup-hidden');
            shadowRoot.getElementById('culturaladvice-container').classList.add('culturaladvice-popup-shown');
            shadowRoot.getElementById('culturaladvice-tab').classList.remove('culturaladvice-tab-shown');
            shadowRoot.getElementById('culturaladvice-tab').classList.add('culturaladvice-tab-hidden');
            shadowRoot.getElementById('culturaladvice-container').setAttribute('aria-hidden', 'false');
        };
        // Add event listeners to Close and Tab
        shadowRoot.getElementById('culturaladvice-container-dismiss').addEventListener('click', dismissCA);
        shadowRoot.getElementById('culturaladvice-tab').addEventListener('click', showCA);
        shadowRoot.getElementById('cultural-advice-read-more').addEventListener('click', navigateToCSC);
        // Start presentation timer - show Tab OR advice based on cookie.
        setTimeout(() => {
            console.log('Firing');
            if (cookieNotFound(CULTURAL_ADVICE_HIDDEN_COOKIE_NAME, CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE)) {
                showCA();
            } else {
                dismissCA();
            }
        }, secondsTilCAAppears * 1000);
    }
}

export default CulturalAdvice;

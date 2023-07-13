import culturalcss from './css/culturaladvice.css';
import { cookieFound, getCookieValue, setCookie } from '../helpers/cookie';
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
    <div id="culturaladvice-popup" style="font-family: 'Roboto', sans-serif;">
        <div id="culturaladvice-container" data-testid="culturaladvice-container" class="culturaladvice-popup-hidden">
            <h2 class="title" style="float: left;">Cultural advice</h2>
            <button type="button" title="close cultural advice" class="culturaladvice-dismiss" id="culturaladvice-container-dismiss" data-analyticsid="culturaladvice-container-dismiss">
            <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
            </button>
            <div id="cultural-advice-title" class="culturaladvice-wording"  style="clear:both">
                <p id="cultural-advice-content">Aboriginal and Torres Strait Islander peoples are advised that our collections and sites may contain images, voices or names of persons now deceased. Information may be culturally sensitive for some individuals and communities.</p>
                <p style="text-align: left">
                    <a id="cultural-advice-read-more" data-analyticsid="cultural-advice-read-more" href="https://web.library.uq.edu.au/collections/culturally-sensitive-collections" target="_blank">
                    Culturally sensitive collections
                    </a>
                </p>    
            </div>
        </div>
        <div id="culturaladvice-tab" role="button" title="Cultural Advice" data-testid="culturaladvice-tab" data-analyticsid="culturaladvice-tab" class="culturaladvice-tab-shown">
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
        const shadowDOM = this.attachShadow({ mode: 'open' });

        const secondsTillPopupAppears = this.getAttribute('secondsTilCulturalAdviceAppears') || 1;

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));
        this.updateCADom(shadowDOM, secondsTillPopupAppears);
    }

    isPopupMinimised() {
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
                    addClassToElement(shadowRoot, 'culturaladvice-tab', 'compensate-mobile');
                    // To stop dom throttling - Just add the class ONCE.
                    addClass = false;
                    removeClass = true;
                }
            } else {
                if (removeClass) {
                    removeClassFromElement(shadowRoot, 'culturaladvice-tab', 'compensate-mobile');
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

        const storeHidePopupStatus = () => {
            if (getCookieValue(CULTURAL_ADVICE_HIDDEN_COOKIE_NAME) !== undefined) {
                return;
            }
            const expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + 365 * 24 * 60 * 60 * 1000);
            setCookie(CULTURAL_ADVICE_HIDDEN_COOKIE_NAME, CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE, expiryDate, true);
        };

        const navigateToReadMorePage = (event) => {
            const url = 'https://web.library.uq.edu.au/collections/culturally-sensitive-collections';
            event.preventDefault();
            storeHidePopupStatus();
            // Potentially minimise popup here if requested, with dismissCulturalAdvicePopup();

            if (!isPrimoPage(window.location.hostname)) {
                window.location.assign(url);
            } else {
                window.open(url);
            }
        };

        // when we are in narrow width screens (mobile) this popup and the askus popup don't both fit
        // we add this attribute to askus when this popup is maximised and then askus knows to auto-minimise
        function forceAskusPopupToMinimise(proactiveChatElement, value) {
            proactiveChatElement.length > 0 && proactiveChatElement[0].setAttribute('caforcehidemobile', value);
        }

        function markHiddenWithAria(value) {
            const container = shadowRoot.getElementById('culturaladvice-container');
            !!container && container.setAttribute('aria-hidden', value);
        }

        function showElement(elementId, classPrefix, shadowRoot) {
            removeClassFromElement(shadowRoot, elementId, classPrefix + '-hidden');
            addClassToElement(shadowRoot, elementId, classPrefix + '-shown');
        }
        function hideElement(elementId, classPrefixName, shadowRoot) {
            removeClassFromElement(shadowRoot, elementId, `${classPrefixName}-shown`);
            addClassToElement(shadowRoot, elementId, `${classPrefixName}-hidden`);
        }

        const dismissCulturalAdvicePopup = () => {
            const proactiveChatElement = document.getElementsByTagName('proactive-chat');
            forceAskusPopupToMinimise(proactiveChatElement, 'false');
            hideElement('culturaladvice-container', 'culturaladvice-popup', shadowRoot);
            showElement('culturaladvice-tab', 'culturaladvice-tab', shadowRoot);
            markHiddenWithAria('true');
            storeHidePopupStatus();
        };
        const showCulturalAdvicePopup = () => {
            const proactiveChatElement = document.getElementsByTagName('proactive-chat');
            forceAskusPopupToMinimise(proactiveChatElement, 'true');
            showElement('culturaladvice-container', 'culturaladvice-popup', shadowRoot);
            hideElement('culturaladvice-tab', 'culturaladvice-tab', shadowRoot);
            markHiddenWithAria('false');
        };
        // Add event listeners to Close and Tab
        const CAContainer = shadowRoot.getElementById('culturaladvice-container-dismiss');
        !!CAContainer && CAContainer.addEventListener('click', dismissCulturalAdvicePopup);
        const CATab = shadowRoot.getElementById('culturaladvice-tab');
        !!CATab && CATab.addEventListener('click', showCulturalAdvicePopup);
        const CAREadMore = shadowRoot.getElementById('cultural-advice-read-more');
        !!CAREadMore && CAREadMore.addEventListener('click', navigateToReadMorePage);
        // Start presentation timer - show Tab OR advice based on cookie.
        setTimeout(() => {
            if (cookieFound(CULTURAL_ADVICE_HIDDEN_COOKIE_NAME, CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE)) {
                dismissCulturalAdvicePopup();
            } else {
                showCulturalAdvicePopup();
            }
        }, secondsTilCAAppears * 1000);
    }
}

export default CulturalAdvice;

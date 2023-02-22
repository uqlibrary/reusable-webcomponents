import culturalcss from './css/culturaladvice.css';
import { cookieNotFound, setCookie } from '../helpers/cookie';

/**
 * API
 *  <proactive-chat
 *      hideProactiveChat                   -- libwizard: dont show proactive chat at all
 *      secondsTilProactiveChatAppears=3    -- default 60
 *  />
 * </proactive-chat>
 *
 */

const template = document.createElement('template');
template.innerHTML = `
    <style>${culturalcss}</style>
    <div id="culturaladvice-popup">
        <div id="culturaladvice-container" class="culturaladvice-initial culturaladvice-popup-hidden">
               
                <div class="title" style="float: left;">Cultural advice</div>
                <div id="culturaladvice-container-dismiss" style="float: right;">&times;</div>
                <div class="culturaladvice-wording" style="clear:both">
                <p>Aboriginal and Torres Strait Islander peoples are advised that our collections and sites may contain images, voices or names of persons now deceased. Information may be culturally sensitive for some individuals and communities.</p>
                <p style="text-align: right"><a href="#">Read more</a></p>    
                </div>
            </div>
        <div id="culturaladvice-tab" class="culturaladvice-tab-hidden">
                <span>Cultural advice</span>
        </div>
    </div>
`;
// template.innerHTML = `
//     <style>${askus.toString()}</style>
//     <div id="proactivechat">
//     <!-- Chat status -->
//         <div id="proactive-chat-status">
//             <div id="proactive-chat-online" data-testid="proactive-chat-online" style="display: none;" title="Click to open online chat">
//                 <svg id="proactive-chat-status-icon-online" focusable="false" viewBox="0 0 24 24" aria-hidden="true" id="chat-status-icon-online" data-testid="chat-status-icon-online"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></svg>
//             </div>
//            <div id="proactive-chat-offline" data-testid="proactive-chat-offline" style="display: none;" title="Chat currently offline">
//                 <svg id="proactive-chat-status-icon-offline" focusable="false" viewBox="0 0 24 24" aria-hidden="true" id="chat-status-icon-offline" data-testid="chat-status-icon-online"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></svg>
//             </div>
//         </div>
//         <!-- Proactive chat -->
//         <div id="proactive-chat-wrapper" data-testid="proactive-chat-wrapper" style="display: none">
//             <div id="proactive-chat" data-testid="proactive-chat">
//                 <div class="proactive-chat-text">
//                     <div class="title">Chat is online now</div>
//                     <div class="message">Library staff are here to assist.<br/>Would you like to chat?</div>
//                 </div>
//                 <div class="proactive-chat-left-button">
//                     <button id="proactive-chat-button-open" data-testid="proactive-chat-button-open" class="proactive-chat-button">Chat&nbsp;now</button>
//                 </div>
//                 <div class="proactive-chat-right-button">
//                     <button id="proactive-chat-button-close" data-testid="proactive-chat-button-close" class="proactive-chat-button">Maybe&nbsp;later</button>
//                 </div>
//             </div>
//         </div>
//     </div>
// `;

const CULTURAL_ADVICE_HIDDEN_COOKIE_NAME = 'UQ_CULTURAL_ADVICE';
const CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE = 'hidden';

class CulturalAdvice extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const secondsTilCAAppears = this.getAttribute('secondsTilCulturalAdviceAppears') || 5;
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));
        this.updateCADom(shadowDOM, secondsTilCAAppears);
        this.addButtonListeners(shadowDOM);
    }

    isCAHidden() {
        const hideCulturalAdvice = this.getAttribute('hideCulturalAdvice');
        return hideCulturalAdvice === 'true' || hideCulturalAdvice === '';
    }

    async updateCADom(shadowRoot, secondsTilCAAppears) {
        // const isCAHidden = this.isCAHidden();

        // const isPrimoPage = (hostname) => {
        //     var regExp = /(.*)exlibrisgroup.com/i;
        //     return 'search.library.uq.edu.au' === hostname || regExp.test(hostname);
        // };
        // const showCulturalAdvice = () => {
        //     shadowRoot.getElementById('cultural-advice-popup').classList.add('show');
        // };
        // const showCulturalAdviceWrapper = () => {
        //     shadowRoot.getElementById('cultural-advice-popup-wrapper').removeAttribute('style');
        // };
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
        shadowRoot.getElementById('culturaladvice-container-dismiss').addEventListener('click', dismissCA);
        shadowRoot.getElementById('culturaladvice-tab').addEventListener('click', showCA);
        if (cookieNotFound(CULTURAL_ADVICE_HIDDEN_COOKIE_NAME, CULTURAL_ADVICE_HIDDEN_COOKIE_VALUE)) {
            setTimeout(() => {
                shadowRoot.getElementById('culturaladvice-container').classList.remove('culturaladvice-popup-hidden');
            }, secondsTilCAAppears * 1000);
        } else {
            setTimeout(() => {
                shadowRoot.getElementById('culturaladvice-container').classList.add('culturaladvice-popup-hidden');
                shadowRoot.getElementById('culturaladvice-tab').classList.remove('culturaladvice-tab-hidden');
            }, secondsTilCAAppears * 1000);
        }
    }

    addButtonListeners(shadowDOM, isOnline) {
        // function navigateToReadMore() {
        //     window.open('https://support.my.uq.edu.au/app/library/contact', '_blank');
        // }
        // Chat status listeners
        // shadowDOM.getElementById('proactive-chat-online').addEventListener('click', openChat);
        // shadowDOM.getElementById('proactive-chat-offline').addEventListener('click', navigateToContactUs);
        // Proactive chat
        // function hideProactiveChatWrapper() {
        //     const pcWrapper = shadowDOM.getElementById('proactive-chat-wrapper');
        //     !!pcWrapper && pcWrapper.remove();
        // }
        // function closeProactiveChat() {
        //     shadowDOM.getElementById('proactive-chat').classList.remove('show');
        //     setTimeout(hideProactiveChatWrapper, 1000);
        //     //set cookie for 24 hours
        //     const date = new Date();
        //     date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
        //     setCookie(PROACTIVE_CHAT_HIDDEN_COOKIE_NAME, PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE, date);
        // }
        // shadowDOM.getElementById('proactive-chat-button-close').addEventListener('click', closeProactiveChat);
        // shadowDOM.getElementById('proactive-chat-button-open').addEventListener('click', openChat);
    }
}

export default CulturalAdvice;

import proactivecss from './css/askus.css';
import ApiAccess from '../ApiAccess/ApiAccess';
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
    <style>${proactivecss.toString()}</style>
    <div id="proactivechat" data-testid="proactivechat" class="proactive-chat">
        <!-- Proactive Chat minimised -->
        <div class="pcminimised">
            <div role="button" id="proactive-chat-online" class="pconline" data-analyticsid="chat-status-icon-online" style="display: none;" title="Click to open online chat">
                <svg class="pcOnlineIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></svg>
            </div>
           <div role="button" id="proactive-chat-offline" class="pcOffline" data-analyticsid="chat-status-icon-offline" style="display: none;" title="Chat currently closed" aria-label="Chat currently closed">
                <svg class="pcOfflineIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></svg>
            </div>
        </div>
        <!-- Proactive Chat larger dialog -->
        <div id="proactive-chat-wrapper"  class="pcwrapper" style="display: none">
            <div id="proactive-chat" class="pcopen">
                <div class="pcText">
                    <div class="pcTitle">Chat is live now</div>
                    <div class="pcMessage">Library staff are here to help.</div>
                </div>
                <div class="pcMinimisePopup">
                    <button id="proactive-chat-button-close" data-analyticsid="askus-proactive-chat-button-close" class="proactive-chat-small-button" title="Minimise this popup">
                        <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                        </svg>
                    </button>
                </div>
                <div class="pcOpenChat">
                    <button id="proactive-chat-button-open" data-analyticsid="askus-proactive-chat-button-open" class="proactive-chat-button">Chat now</button>
                </div>
            </div>
        </div>
    </div>
`;

const PROACTIVE_CHAT_HIDDEN_COOKIE_NAME = 'UQ_PROACTIVE_CHAT';
const PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE = 'hidden';

// CAForceHideMobile forces the proactive chat to not show if the Cultural Advice statement is showing.
// (Stops both windows overlapping)
// Handled by attribute "CAforceHideMobile" applied to component
// if attribute exists when time to show, also apply .forceHideMobile class to component.
let CAforceHideMobile = false;

class ProactiveChat extends HTMLElement {
    static get observedAttributes() {
        return ['caforcehidemobile'];
    }
    constructor() {
        super();
        // Add a shadow DOM
        const secondsTilProactiveChatAppears = this.getAttribute('secondsTilProactiveChatAppears') || 60;
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));
        this.updateAskusDOM(shadowDOM, secondsTilProactiveChatAppears);
        this.addButtonListeners(shadowDOM);
    }

    attributeChangedCallback(fieldName, oldValue, newValue) {
        const that = this;
        const awaitShadowDom = setInterval(() => {
            /* istanbul ignore next */
            if (!that.shadowRoot) {
                return;
            }

            clearInterval(awaitShadowDom);
            switch (fieldName) {
                case 'caforcehidemobile':
                    CAforceHideMobile = newValue === 'true' ? true : false;
                    break;
                /* istanbul ignore next  */
                default:
                    console.log(`unhandled attribute ${fieldName} received for ProactiveChat`);
            }
            // Change the attribs here?
            const proactiveChatElement = that.shadowRoot.getElementById('proactive-chat');
            if (CAforceHideMobile) {
                !!proactiveChatElement && proactiveChatElement.classList.add('ca-force-hide-mobile');
            } else {
                !!proactiveChatElement && proactiveChatElement.classList.remove('ca-force-hide-mobile');
            }
        }, 50);
    }

    isProactiveChatHidden() {
        const hideProactiveChat = this.getAttribute('hideProactiveChat');
        return hideProactiveChat === 'true' || hideProactiveChat === '';
    }

    async updateAskusDOM(shadowRoot, secondsTilProactiveChatAppears) {
        const isProactiveChatHidden = this.isProactiveChatHidden();

        const isPrimoPage = (hostname) => {
            var regExp = /(.*)exlibrisgroup.com/i;
            return 'search.library.uq.edu.au' === hostname || regExp.test(hostname);
        };
        const showProactiveChat = () => {
            const proactiveChatElement = shadowRoot.getElementById('proactive-chat');
            if (CAforceHideMobile) {
                !!proactiveChatElement && proactiveChatElement.classList.add('ca-force-hide-mobile');
            } else {
                !!proactiveChatElement && proactiveChatElement.classList.remove('ca-force-hide-mobile');
            }
            !!proactiveChatElement && proactiveChatElement.classList.add('show');
        };
        const showProactiveChatWrapper = () => {
            shadowRoot.getElementById('proactive-chat-wrapper').removeAttribute('style');
        };
        const api = new ApiAccess();
        await api.loadChatStatus().then((isOnline) => {
            if (!!isOnline) {
                // Chat status
                !isProactiveChatHidden && shadowRoot.getElementById('proactive-chat-online').removeAttribute('style');
                // Show the proactive chat if we're not in primo & they havent asked for it to be hidden
                if (
                    !isProactiveChatHidden &&
                    !isPrimoPage(window.location.hostname) &&
                    cookieNotFound(PROACTIVE_CHAT_HIDDEN_COOKIE_NAME, PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE)
                ) {
                    setTimeout(showProactiveChatWrapper, (secondsTilProactiveChatAppears - 1) * 1000);
                    setTimeout(showProactiveChat, secondsTilProactiveChatAppears * 1000);
                }
            } else {
                // Chat status
                !isProactiveChatHidden && shadowRoot.getElementById('proactive-chat-offline').removeAttribute('style');
            }
        });
    }

    addButtonListeners(shadowDOM, isOnline) {
        // Chat status
        function openChat() {
            window.open(
                'https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45',
                'chat',
                'toolbar=no, location=no, status=no, width=400, height=400',
            );
        }

        function navigateToContactUs() {
            window.open('https://support.my.uq.edu.au/app/library/contact', '_blank');
        }

        // Chat status listeners
        const proactiveChatElementOnline = shadowDOM.getElementById('proactive-chat-online');
        !!proactiveChatElementOnline && proactiveChatElementOnline.addEventListener('click', openChat);
        const proactiveChatElementOffline = shadowDOM.getElementById('proactive-chat-offline');
        !!proactiveChatElementOffline && proactiveChatElementOffline.addEventListener('click', navigateToContactUs);

        // Proactive chat
        function hideProactiveChatWrapper() {
            const pcWrapper = shadowDOM.getElementById('proactive-chat-wrapper');
            !!pcWrapper && pcWrapper.remove();
        }
        function closeProactiveChat() {
            const proactiveChatElement = shadowDOM.getElementById('proactive-chat');
            !!proactiveChatElement && proactiveChatElement.classList.remove('show');
            setTimeout(hideProactiveChatWrapper, 1000);
            //set cookie for 24 hours
            const date = new Date();
            date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
            setCookie(PROACTIVE_CHAT_HIDDEN_COOKIE_NAME, PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE, date, true);
        }

        const proactiveChatElementClose = shadowDOM.getElementById('proactive-chat-button-close');
        !!proactiveChatElementClose && proactiveChatElementClose.addEventListener('click', closeProactiveChat);
        const proactiveChatElementOpen = shadowDOM.getElementById('proactive-chat-button-open');
        !!proactiveChatElementOpen && proactiveChatElementOpen.addEventListener('click', openChat);
    }
}

export default ProactiveChat;

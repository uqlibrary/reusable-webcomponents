import proactivecss from './css/proactivechat.css';
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

const userPromptTemplate = document.createElement('template');
userPromptTemplate.innerHTML = `
    <style>${proactivecss.toString()}</style>
    <div id="proactivechat" data-testid="proactivechat" class="proactive-chat">
        <!-- Proactive Chat minimised -->
        <div class="pcminimised">
            <div role="button" id="proactive-chat-online" data-testid="proactive-chat-online" class="pconline" data-analyticsid="chat-status-icon-online" style="display: none;" title="Click to open online chat">
                <svg class="pcOnlineIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></svg>
            </div>
           <div role="button" id="proactive-chat-offline" class="pcOffline" data-analyticsid="chat-status-icon-offline" style="display: none;" title="Chat currently closed" aria-label="Chat currently closed">
                <svg class="pcOfflineIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></svg>
            </div>
        </div>
        <!-- Proactive Chat larger dialog -->
        <div id="proactive-chat-wrapper"  class="pcwrapper" style="display: none">
            <div id="proactive-chat" data-testid="popupIsOpen" class="openSubWrapper">
                <div class="pcText">
                    <div class="pcMessage">Need help?</div>
                </div>
                <button id="proactive-chat-button-close" data-analyticsid="askus-proactive-chat-button-close" data-testid="close-button" class="close-button" title="Minimise this popup">
                    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    </svg>
                </button>
                <div class="pcOpenChat">
                    <button id="proactive-chat-button-open" data-analyticsid="askus-proactive-chatbot-button-open" data-testid="popopen-button" class="proactive-chat-button">Ask Library Chatbot</button>
                </div>
                <div class="crmChatPrompt">
                    <button id="crmChatPrompt" data-analyticsid="askus-proactive-chat-button-open" class="crmchat-button" style="display: none">Chat with Library staff</button>
                    <button id="leaveAQuestionPrompt" data-analyticsid="askus-proactive-offline-leave-question" class="crmchat-button" style="display: none">Leave a question</button>
                </div>
            </div>
        </div>
    </div>
`;

const chatbotIframeTemplate = document.createElement('template');
chatbotIframeTemplate.innerHTML = `<div
    id="chatbot-wrapper"
    data-testid="chatbot-wrapper"
    class="chatbotWrapper"
    style="display: none"
>
    <div class="resizeHandleRepositionWrapper">
        <div class="buttonHolder">
            <div class="headerButton headerButtonCrm">
                <button id="openCrm" data-testid="openCrm">Person</button>
            </div>
            <div class="headerButton headerButtonClose">
                <button id="closeIframeButton" data-testid="closeIframeButton">Close</button>
            </div>
        </div>
        <iframe 
            id="chatbotIframe"
            src="https://copilotstudio.microsoft.com/environments/2a892934-221c-eaa4-9f1a-4790000854ca/bots/cr546_uqAssistGenAiChatBot/webchat?__version__=2"
            frameborder="0" 
        ></iframe>
        <p class="refCheck">Please confirm any references provided.</p>
    </div>
</div>`;

const PROACTIVE_CHAT_HIDDEN_COOKIE_NAME = 'UQ_PROACTIVE_CHAT';
const PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE = 'hidden';

// CAForceHideMobile forces the proactive chat to not show if the Cultural Advice statement is showing.
// (Stops both windows overlapping)
// Handled by attribute "CAforceHideMobile" applied to component
// if attribute exists when time to show, also apply .forceHideMobile class to component.
let CAforceHideMobile = false;
let ShowChatBot = false;

class ProactiveChat extends HTMLElement {
    static get observedAttributes() {
        return ['caforcehidemobile', 'showchatbot'];
    }
    constructor() {
        super();
        // Add a shadow DOM
        const secondsTilProactiveChatAppears = this.getAttribute('secondsTilProactiveChatAppears') || 60;
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the templates
        shadowDOM.appendChild(chatbotIframeTemplate.content.cloneNode(true));
        shadowDOM.appendChild(userPromptTemplate.content.cloneNode(true));
        this.updateAskusDOM(shadowDOM, secondsTilProactiveChatAppears);
        this.addButtonListeners(shadowDOM);

        this.chatbotHasAppeared = false;
        this.askUsStatus = null;
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
                case 'showchatbot':
                    ShowChatBot = newValue === 'true' ? true : false;
                    break;
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

            if (ShowChatBot) {
                const button = that.shadowRoot.getElementById('proactive-chat-button-open');
                !!button && button.click();
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
            if (!!this.chatbotHasAppeared) {
                return;
            }
            const proactiveChatElement = shadowRoot.getElementById('proactive-chat');
            if (CAforceHideMobile) {
                !!proactiveChatElement && proactiveChatElement.classList.add('ca-force-hide-mobile');
            } else {
                !!proactiveChatElement && proactiveChatElement.classList.remove('ca-force-hide-mobile');
            }
            !!proactiveChatElement && proactiveChatElement.classList.add('show');
        };
        const showProactiveChatWrapper = () => {
            if (!!this.chatbotHasAppeared) {
                return;
            }
            const wrapper = shadowRoot.getElementById('proactive-chat-wrapper');
            !!wrapper && wrapper.removeAttribute('style');
        };
        const api = new ApiAccess();
        const that = this;
        await api
            .loadChatStatus()
            .then((isOnline) => {
                if (!!isOnline) {
                    that.askUsStatus = 'online';
                    // Chat status
                    if (!isProactiveChatHidden) {
                        const onlineMinimisedButton = shadowRoot.getElementById('proactive-chat-online');
                        !!onlineMinimisedButton && onlineMinimisedButton.removeAttribute('style');
                    }
                    const onlineSecondaryOption = shadowRoot.getElementById('crmChatPrompt');
                    !!onlineSecondaryOption && onlineSecondaryOption.removeAttribute('style');
                } else {
                    // Chat status
                    that.askUsStatus = 'offline';
                    const offlineIcon = shadowRoot.getElementById('proactive-chat-offline');
                    !isProactiveChatHidden && !!offlineIcon && offlineIcon.removeAttribute('style');
                    const offlineSecondaryOption = shadowRoot.getElementById('leaveAQuestionPrompt');
                    !!offlineSecondaryOption && offlineSecondaryOption.removeAttribute('style');
                }
            })
            .then(() => {
                // set the timer delay for proactive chat if we're not in primo & they havent asked for it to be hidden
                if (
                    !isProactiveChatHidden &&
                    !isPrimoPage(window.location.hostname) &&
                    cookieNotFound(PROACTIVE_CHAT_HIDDEN_COOKIE_NAME, PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE)
                ) {
                    setTimeout(showProactiveChatWrapper, (secondsTilProactiveChatAppears - 1) * 1000);
                    setTimeout(showProactiveChat, secondsTilProactiveChatAppears * 1000);
                }
            });
    }

    addButtonListeners(shadowDOM, isOnline) {
        const that = this;
        function closeChatBotIframe() {
            const chatbotIframe = shadowDOM.getElementById('chatbot-wrapper');
            !!chatbotIframe && (chatbotIframe.style.display = 'none');
            const proactivechatArea = shadowDOM.getElementById('proactivechat');
            !!proactivechatArea && (proactivechatArea.style.display = 'block');
            if (that.askUsStatus === 'online') {
                // show the minimised button
                const onlineMinimisedButton = shadowDOM.getElementById('proactive-chat-online');
                !!onlineMinimisedButton && onlineMinimisedButton.removeAttribute('style');
                // make sure the proactive dialog is hidden
                const wrapper = shadowDOM.getElementById('proactive-chat-wrapper');
                !!wrapper && (wrapper.style.display = 'none');
            }
        }

        function openCrm() {
            // minimise chatbot iframe
            closeChatBotIframe();

            const productionDomain = 'www.library.uq.edu.au';
            const crmDomain =
                window.location.hostname === productionDomain ? 'support.my.uq.edu.au' : 'uqcurrent.crm.test.uq.edu.au';
            window.open(
                `https://${crmDomain}/app/chat/chat_launch_lib/p/45`,
                'chat',
                'toolbar=no, location=no, status=no, width=400, height=400',
            );
        }

        function openCrmChat() {
            window.open(
                'https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45',
                'chat',
                'toolbar=no, location=no, status=no, width=400, height=400',
            );
        }

        function openChatBotIframe() {
            that.chatbotHasAppeared = true;

            const proactivechatArea = shadowDOM.getElementById('proactivechat');
            !!proactivechatArea && (proactivechatArea.style.display = 'none');

            const minimisedOnlineButton = shadowDOM.getElementById('proactive-chat-online');
            !!minimisedOnlineButton && (minimisedOnlineButton.style.display = 'none');

            const chatbotIframe = shadowDOM.getElementById('chatbot-wrapper');
            if (!!chatbotIframe) {
                chatbotIframe.style.display = 'block';
            }
            const openCrmButton = shadowDOM.getElementById('openCrm');
            !!openCrmButton && openCrmButton.addEventListener('click', openCrm);
            const chatbotCloseButton = shadowDOM.getElementById('closeIframeButton');
            !!chatbotCloseButton && chatbotCloseButton.addEventListener('click', closeChatBotIframe);
        }

        function navigateToContactUs() {
            window.open('https://support.my.uq.edu.au/app/library/contact', '_blank');
        }
        const showProactiveChatDialog = () => {
            const wrapper = shadowDOM.getElementById('proactive-chat-wrapper');
            !!wrapper && wrapper.removeAttribute('style');

            const proactiveChatElement = shadowDOM.getElementById('proactive-chat');
            if (CAforceHideMobile) {
                !!proactiveChatElement && proactiveChatElement.classList.add('ca-force-hide-mobile');
            } else {
                !!proactiveChatElement && proactiveChatElement.classList.remove('ca-force-hide-mobile');
            }
            !!proactiveChatElement && proactiveChatElement.classList.add('show');
        };

        // Proactive chat
        function hideProactiveChatWrapper() {
            const pcWrapper = shadowDOM.getElementById('proactive-chat-wrapper');
            !!pcWrapper && (pcWrapper.style.display = 'none');
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

        // Chat status listeners
        const crmChatprompt = shadowDOM.getElementById('crmChatPrompt');
        !!crmChatprompt && crmChatprompt.addEventListener('click', openCrmChat);

        const proactiveChatElementOnline = shadowDOM.getElementById('proactive-chat-online');
        !!proactiveChatElementOnline && proactiveChatElementOnline.addEventListener('click', showProactiveChatDialog);
        !!proactiveChatElementOnline &&
            proactiveChatElementOnline.addEventListener('mouseover', showProactiveChatDialog);
        !!proactiveChatElementOnline && proactiveChatElementOnline.addEventListener('focus', showProactiveChatDialog);

        const proactiveChatElementOFFline = shadowDOM.getElementById('proactive-chat-offline');
        !!proactiveChatElementOFFline && proactiveChatElementOFFline.addEventListener('click', showProactiveChatDialog);
        !!proactiveChatElementOFFline &&
            proactiveChatElementOFFline.addEventListener('mouseover', showProactiveChatDialog);
        !!proactiveChatElementOFFline && proactiveChatElementOFFline.addEventListener('focus', showProactiveChatDialog);

        const proactiveChatElementClose = shadowDOM.getElementById('proactive-chat-button-close');
        !!proactiveChatElementClose && proactiveChatElementClose.addEventListener('click', closeProactiveChat);
        const proactiveChatWithBot = shadowDOM.getElementById('proactive-chat-button-open');
        !!proactiveChatWithBot && proactiveChatWithBot.addEventListener('click', openChatBotIframe);
        const proactiveleaveQuestion = shadowDOM.getElementById('leaveAQuestionPrompt');
        !!proactiveleaveQuestion && proactiveleaveQuestion.addEventListener('click', navigateToContactUs);
    }
}

export default ProactiveChat;

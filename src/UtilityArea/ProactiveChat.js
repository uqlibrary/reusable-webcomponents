import proactivecss from './css/proactivechat.css';
import ApiAccess from '../ApiAccess/ApiAccess';
import { cookieNotFound, setCookie } from '../helpers/cookie';
import { apiLocale } from '../ApiAccess/ApiAccess.locale';

/**
 * API
 *  <proactive-chat
 *      hideProactiveChat                   -- libwizard: dont show proactive chat at all
 *      secondsTilProactiveChatAppears=3    -- default 60
 *      display                             -- 'inline', for in body of page in drupal, or not present
 *  />
 * </proactive-chat>
 *
 */

const userPromptTemplate = document.createElement('template');
userPromptTemplate.innerHTML = `
    <style>${proactivecss.toString()}</style>
    <div id="proactivechat" data-testid="proactivechat" class="proactive-chat">
        <!-- Proactive Chat minimised -->
        <div id="minimised-buttons" class="pcminimised">
            <button id="proactive-chat-online" data-testid="proactive-chat-online" class="pconline" data-analyticsid="chat-status-icon-online-button" style="display: none;" title="Chat with us - see options" aria-label="Chat with us - see options">
                <svg class="pcOnlineIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.7999 17.3998H11.4L6.60007 20.9998V17.3998H4.20011C3.88185 17.3998 3.57663 17.2734 3.35159 17.0483C3.12655 16.8233 3.00012 16.5181 3.00012 16.1998V4.19998C3.00012 3.88173 3.12655 3.57651 3.35159 3.35147C3.57663 3.12643 3.88185 3 4.20011 3H19.7999C20.1182 3 20.4234 3.12643 20.6484 3.35147C20.8735 3.57651 20.9999 3.88173 20.9999 4.19998V16.1998C20.9999 16.5181 20.8735 16.8233 20.6484 17.0483C20.4234 17.2734 20.1182 17.3998 19.7999 17.3998Z" stroke="#19151C" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.59998 8.39989H17.3998" stroke="#19151C" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.59998 12H14.9999" stroke="#19151C" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
           <button id="proactive-chat-offline" data-testid="proactive-chat-offline" class="pcOffline" data-analyticsid="chat-status-icon-offline-button" style="display: none;" title="Chat with us - see options" aria-label="Chat with us - see options">
                <svg class="pcOfflineIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.7999 17.3998H11.4L6.60007 20.9998V17.3998H4.20011C3.88185 17.3998 3.57663 17.2734 3.35159 17.0483C3.12655 16.8233 3.00012 16.5181 3.00012 16.1998V4.19998C3.00012 3.88173 3.12655 3.57651 3.35159 3.35147C3.57663 3.12643 3.88185 3 4.20011 3H19.7999C20.1182 3 20.4234 3.12643 20.6484 3.35147C20.8735 3.57651 20.9999 3.88173 20.9999 4.19998V16.1998C20.9999 16.5181 20.8735 16.8233 20.6484 17.0483C20.4234 17.2734 20.1182 17.3998 19.7999 17.3998Z" stroke="#19151C" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.59998 8.39989H17.3998" stroke="#19151C" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.59998 12H14.9999" stroke="#19151C" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
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
                <div id="button-open-chatbot-iframe" class="pcOpenChat">
                    <button id="proactive-chat-button-open" data-analyticsid="askus-proactive-chatbot-button-open" data-testid="popopen-button" class="proactive-chat-button" aria-label="Ask Library Chat Bot a question">Ask Library Chatbot</button>
                </div>
                <div id="button-open-crm" class="crmChatPrompt">
                    <button id="crmChatPrompt" data-analyticsid="askus-proactive-chat-button-open" class="crmchat-button" style="display: none">Chat with Library staff</button>
                    <button id="leaveAQuestionPrompt" data-analyticsid="chat-status-icon-offline" class="crmchat-button" style="display: none" aria-label="No staff available to chat - Leave a question">Leave a question</button>
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
>
    <div class="resizeHandleRepositionWrapper">
        <div class="topBar">
            <h1>Library Chatbot</h1>
            <button id="closeIframeButton" data-testid="closeIframeButton" data-analyticsid="chatbot-iframe-close" aria-label="Close Chatbot">
                <!-- close "x" -->
                <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
            </button>
        </div>
        <iframe 
            id="chatbotIframe"
            data-testid="chatbot-iframe"
            frameborder="0" 
            title="Ask Library Chatbot a question"
        ></iframe>
        <div class="bottomBar">
            <p class="confirmAnswers">Please visit any links I provide to confirm my answers.</p>
            <p class="crmChat">
                Need more help?
                <button id="speakToPerson" data-analyticsid="chatbot-iframe-crm" data-testid="speakToPerson" style="display: none">Chat with Library staff now</button>
                <button id="leaveQuestion" data-analyticsid="chatbot-iframe-contact" data-testid="leaveQuestion" style="display: none">Staff unavailable - leave a question</button>
            </p>
        </div>
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
        this.displayType = this.getAttribute('display') || null;
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the userPromptTemplate
        shadowDOM.appendChild(userPromptTemplate.content.cloneNode(true));

        // copilot just shows a nasty error on app.library
        // only show the crm button
        if (this.isChatBotHiddenHere()) {
            const chatbotiframe = shadowDOM.querySelector('#proactivechat iframe');
            !!chatbotiframe && chatbotiframe.remove();

            const chatbotButton = shadowDOM.querySelector('#button-open-chatbot-iframe');
            !!chatbotButton && chatbotButton.remove();

            const crmButtonListWrapper = shadowDOM.querySelector('#button-open-crm');
            !!crmButtonListWrapper && (crmButtonListWrapper.style.marginBottom = '25px');

            const crmButtonList = shadowDOM.querySelectorAll('#button-open-crm button');
            !!crmButtonList && crmButtonList.forEach((b) => !!b && b.classList.add('proactive-chat-button'));
        }

        if (this.displayType === 'inline') {
            const proactiveChatElement = shadowDOM.getElementById('proactive-chat');
            !!proactiveChatElement && proactiveChatElement.classList.remove('ca-force-hide-mobile');
            !!proactiveChatElement && proactiveChatElement.classList.add('show');
            !!proactiveChatElement && proactiveChatElement.classList.add('displayinline');
            const wrapper = shadowDOM.getElementById('proactive-chat-wrapper');
            !!wrapper && wrapper.removeAttribute('style');
        }
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
            const minimisedButtonsElement = that.shadowRoot.getElementById('minimised-buttons');
            if (CAforceHideMobile) {
                !!proactiveChatElement && proactiveChatElement.classList.add('ca-force-hide-mobile');
                !!minimisedButtonsElement && minimisedButtonsElement.classList.add('ca-force-hide-mobile');
            } else {
                !!proactiveChatElement && proactiveChatElement.classList.remove('ca-force-hide-mobile');
                !!minimisedButtonsElement && minimisedButtonsElement.classList.remove('ca-force-hide-mobile');
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
            const onlineMinimisedButton = shadowRoot.getElementById('proactive-chat-online');
            !!onlineMinimisedButton && (onlineMinimisedButton.style.display = 'none');
            const offlineMinimisedButton = shadowRoot.getElementById('proactive-chat-offline');
            !!offlineMinimisedButton && (offlineMinimisedButton.style.display = 'none');
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
                // set the timer delay for proactive chat if we're not in primo & they haven't asked for it to be hidden
                if (
                    !isProactiveChatHidden &&
                    !isPrimoPage(window.location.hostname) &&
                    cookieNotFound(PROACTIVE_CHAT_HIDDEN_COOKIE_NAME, PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE)
                ) {
                    setTimeout(
                        showProactiveChatWrapper,
                        (secondsTilProactiveChatAppears === 0 ? 0 : secondsTilProactiveChatAppears - 1) * 1000,
                    );
                    setTimeout(showProactiveChat, secondsTilProactiveChatAppears * 1000);
                }
            });
    }

    addButtonListeners(shadowDOM, isOnline) {
        const that = this;
        function closeChatBotIframe() {
            const chatbotIframe = shadowDOM.getElementById('chatbot-wrapper');
            !!chatbotIframe && chatbotIframe.remove(); // deleting it rather than hiding it will force it to check for logout
            const proactivechatArea = shadowDOM.getElementById('proactivechat');
            !!proactivechatArea && (proactivechatArea.style.display = 'block');

            const minimisedButtonsElement = that.shadowRoot.getElementById('minimised-buttons');
            !!minimisedButtonsElement && (minimisedButtonsElement.style.display = 'inline');
            if (that.askUsStatus === 'online') {
                // show the minimised button
                const onlineMinimisedButton = shadowDOM.getElementById('proactive-chat-online');
                !!onlineMinimisedButton && onlineMinimisedButton.removeAttribute('style');
                // make sure the proactive dialog is hidden
                const wrapper = shadowDOM.getElementById('proactive-chat-wrapper');
                !!wrapper && (wrapper.style.display = 'none');
            }
        }

        function swapToCrm() {
            // minimise chatbot iframe
            closeChatBotIframe();

            openCrmChat();
        }

        function openCrmChat() {
            let accountDetails = null;
            const currentUserDetails = new ApiAccess().getAccountFromStorage();

            const accountIsSet =
                currentUserDetails.hasOwnProperty('account') &&
                !!currentUserDetails.account &&
                currentUserDetails.account.hasOwnProperty('id') &&
                !!currentUserDetails.account.id;
            if (!!accountIsSet) {
                accountDetails = currentUserDetails.account;
            }

            const params = [];
            !!accountDetails?.mail && params.push(`email=${accountDetails?.mail}`);
            !!accountDetails?.firstName && params.push(`name=${accountDetails?.firstName}`);
            // &subject=users+question is also available, but we don't know their question :(

            const productionDomain = 'www.library.uq.edu.au';
            const isTestEnvironment =
                window.location.hostname.startsWith('homepage-') || // LTS feature branches
                window.location.hostname === 'localhost' ||
                window.location.hostname.endsWith('.pantheonsite.io'); // drupal10 test sites
            const crmDomain = isTestEnvironment ? 'uqcurrent.crm.test.uq.edu.au' : 'support.my.uq.edu.au';
            let url = `https://${crmDomain}/app/chat/chat_launch_lib/p/45`;
            if (params.length > 0) {
                url = `${url}?${params.join('&')}`;
            }

            window.open(url, 'chat', 'toolbar=no, location=no, status=no, width=400, height=400');
        }

        function openChatBotIframe() {
            that.chatbotHasAppeared = true;

            if (that.displayType === 'inline') {
                const proactiveChatElement = document.querySelectorAll('proactive-chat:not([display="inline"])');
                !!proactiveChatElement &&
                    proactiveChatElement.length > 0 &&
                    proactiveChatElement[0].setAttribute('showchatbot', 'true');

                const minimisedButtonsElement = that.shadowRoot.getElementById('minimised-buttons');
                !!minimisedButtonsElement && (minimisedButtonsElement.style.display = 'none');
            } else {
                const proactivechatArea = shadowDOM.getElementById('proactivechat');
                !!proactivechatArea && (proactivechatArea.style.display = 'none');

                const minimisedOnlineButton = shadowDOM.getElementById('proactive-chat-online');
                !!minimisedOnlineButton && (minimisedOnlineButton.style.display = 'none');

                let chatbotWrapper = shadowDOM.getElementById('chatbot-wrapper');
                if (!!chatbotWrapper) {
                    chatbotWrapper.style.display = 'block';
                } else {
                    shadowDOM.appendChild(chatbotIframeTemplate.content.cloneNode(true));
                    chatbotWrapper = shadowDOM.getElementById('chatbot-wrapper');
                }

                // show chatbot source
                let chatbotSrc = 'https://www.library.uq.edu.au';
                if (window.location.hostname === 'localhost') {
                    chatbotSrc = 'http://localhost:2020'; // bring mock up to use locally
                } else if (
                    window.location.hostname === 'homepage-development.library.uq.edu.au' &&
                    window.location.pathname.startsWith('/feature-leadegroot')
                ) {
                    // dev - ITS dev env
                    chatbotSrc = `${window.location.protocol}//${window.location.hostname}/feature-leadegroot-1`;
                } else if (
                    window.location.hostname === 'homepage-development.library.uq.edu.au' &&
                    window.location.pathname.startsWith('/chatbot-testenv')
                ) {
                    // dev - ITS test env
                    chatbotSrc = `${window.location.protocol}//${window.location.hostname}/chatbot-testenv`;
                } else if (
                    window.location.hostname === 'homepage-staging.library.uq.edu.au' ||
                    window.location.hostname === 'app-testing.library.uq.edu.au' ||
                    window.location.hostname === 'web-staging.library.uq.edu.au' || // maybe iframe cross domain issue
                    window.location.hostname === 'sandbox-fryer.library.uq.edu.au' // ditto
                ) {
                    chatbotSrc = window.location.protocol + '//' + window.location.hostname;
                }
                let chatbotUrl = `${chatbotSrc}/chatbot.html`;
                const chatBotIframe = !!chatbotWrapper && chatbotWrapper.getElementsByTagName('iframe');
                const api = new ApiAccess();
                const waitOnStorage = setInterval(() => {
                    // sometimes it takes a moment before it is readable
                    const currentUserDetails = api.getAccountFromStorage();

                    const accountAvailable =
                        currentUserDetails.hasOwnProperty('account') &&
                        !!currentUserDetails.account &&
                        currentUserDetails.account.hasOwnProperty('id') &&
                        !!currentUserDetails.account.id;
                    if (!!accountAvailable) {
                        clearInterval(waitOnStorage);

                        chatbotUrl +=
                            '?' +
                            `name=${currentUserDetails.account.firstName}&email=${currentUserDetails.account.mail}`;
                        !!chatBotIframe && chatBotIframe.length > 0 && (chatBotIframe[0].src = chatbotUrl);
                    } else if (
                        !!currentUserDetails &&
                        currentUserDetails.hasOwnProperty('status') &&
                        currentUserDetails.status === apiLocale.USER_LOGGED_OUT
                    ) {
                        clearInterval(waitOnStorage);
                        !!chatBotIframe && chatBotIframe.length > 0 && (chatBotIframe[0].src = chatbotUrl);
                    }
                }, 200);

                const openCrmButton = shadowDOM.getElementById('speakToPerson');
                !!openCrmButton && openCrmButton.addEventListener('click', swapToCrm);
                const chatbotCloseButton = shadowDOM.getElementById('closeIframeButton');
                !!chatbotCloseButton && chatbotCloseButton.addEventListener('click', closeChatBotIframe);

                const proactiveleaveQuestion = shadowDOM.getElementById('leaveQuestion');
                !!proactiveleaveQuestion && proactiveleaveQuestion.addEventListener('click', navigateToContactUs);

                const elementId = that.askUsStatus === 'online' ? 'speakToPerson' : 'leaveQuestion';
                const minimisedButton = shadowDOM.getElementById(elementId);
                !!minimisedButton && (minimisedButton.style.display = 'inline');
            }
        }

        function navigateToContactUs() {
            window.open('https://support.my.uq.edu.au/app/library/contact', '_blank');
        }
        const showProactiveChatDialog = () => {
            const wrapper = shadowDOM.getElementById('proactive-chat-wrapper');
            !!wrapper && wrapper.removeAttribute('style');
            const onlineMinimisedButton = shadowDOM.getElementById('proactive-chat-online');
            !!onlineMinimisedButton && (onlineMinimisedButton.style.display = 'none');
            const offlineMinimisedButton = shadowDOM.getElementById('proactive-chat-offline');
            !!offlineMinimisedButton && (offlineMinimisedButton.style.display = 'none');

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
            const elementId = that.askUsStatus === 'online' ? 'proactive-chat-online' : 'proactive-chat-offline';
            const minimisedButton = shadowDOM.getElementById(elementId);
            !!minimisedButton && (minimisedButton.style.display = 'block');
        }

        // Chat status listeners
        const crmChatprompt = shadowDOM.getElementById('crmChatPrompt');
        !!crmChatprompt && crmChatprompt.addEventListener('click', openCrmChat);

        const proactiveChatElementOnline = shadowDOM.getElementById('proactive-chat-online');
        !!proactiveChatElementOnline && proactiveChatElementOnline.addEventListener('click', showProactiveChatDialog);

        const proactiveChatElementOFFline = shadowDOM.getElementById('proactive-chat-offline');
        !!proactiveChatElementOFFline && proactiveChatElementOFFline.addEventListener('click', showProactiveChatDialog);

        const proactiveChatElementClose = shadowDOM.getElementById('proactive-chat-button-close');
        !!proactiveChatElementClose && proactiveChatElementClose.addEventListener('click', closeProactiveChat);
        const proactiveChatWithBot = shadowDOM.getElementById('proactive-chat-button-open');
        !!proactiveChatWithBot && proactiveChatWithBot.addEventListener('click', openChatBotIframe);
        const proactiveleaveQuestion = shadowDOM.getElementById('leaveAQuestionPrompt');
        !!proactiveleaveQuestion && proactiveleaveQuestion.addEventListener('click', navigateToContactUs);
    }

    isChatBotHiddenHere() {
        return (
            // other condition here (none currently) - match in askus
            window.location.pathname === '/index-app-nochatbot.html' // test only
        );
    }
}

export default ProactiveChat;

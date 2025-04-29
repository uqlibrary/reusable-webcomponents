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

const crmLocationScript = 'uqcurrent.crm.test.uq.edu.au';
const crmLocationEmbed = 'uqcurrent--tst.widget.custhelp.com';

const userPromptTemplate = document.createElement('template');
userPromptTemplate.innerHTML = `
    <style>${proactivecss.toString()}</style>
    <div id="proactivechat" data-testid="proactivechat" class="proactive-chat">
        <!-- Proactive Chat minimised -->
        <div id="minimised-buttons" data-testid="minimised-buttons" class="pcminimised">
            <button id="proactive-chat-online" data-testid="proactive-chat-online" class="pconline svg-container" data-analyticsid="chat-status-icon-online-button" style="display: none;" title="Chat with us" aria-label="Chat with us">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <g id="icon/marketing/chat">
                        <path id="Vector" d="M26.3999 23.1997H15.2L8.80012 27.9997V23.1997H5.60016C5.17582 23.1997 4.76886 23.0312 4.46881 22.7311C4.16875 22.4311 4.00018 22.0241 4.00018 21.5998V5.59998C4.00018 5.17564 4.16875 4.76868 4.46881 4.46862C4.76886 4.16857 5.17582 4 5.60016 4H26.3999C26.8242 4 27.2312 4.16857 27.5312 4.46862C27.8313 4.76868 27.9999 5.17564 27.9999 5.59998V21.5998C27.9999 22.0241 27.8313 22.4311 27.5312 22.7311C27.2312 23.0312 26.8242 23.1997 26.3999 23.1997Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path id="Vector_2" d="M8.79999 11.1999H23.1998" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path id="Vector_3" d="M8.79999 16H19.9998" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                </svg>
            </button>
           <button id="proactive-chat-offline" data-testid="proactive-chat-offline" class="pcOffline" data-analyticsid="chat-status-icon-offline-button" style="display: none;" title="Chat with us" aria-label="Chat with us">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <g id="icon/marketing/chat">
                        <path id="Vector" d="M26.3999 23.1997H15.2L8.80012 27.9997V23.1997H5.60016C5.17582 23.1997 4.76886 23.0312 4.46881 22.7311C4.16875 22.4311 4.00018 22.0241 4.00018 21.5998V5.59998C4.00018 5.17564 4.16875 4.76868 4.46881 4.46862C4.76886 4.16857 5.17582 4 5.60016 4H26.3999C26.8242 4 27.2312 4.16857 27.5312 4.46862C27.8313 4.76868 27.9999 5.17564 27.9999 5.59998V21.5998C27.9999 22.0241 27.8313 22.4311 27.5312 22.7311C27.2312 23.0312 26.8242 23.1997 26.3999 23.1997Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path id="Vector_2" d="M8.79999 11.1999H23.1998" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path id="Vector_3" d="M8.79999 16H19.9998" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
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
                        <path d="M22 3.41 16.71 8.7 20 12h-8V4l3.29 3.29L20.59 2zM3.41 22l5.29-5.29L12 20v-8H4l3.29 3.29L2 20.59z"></path>
                    </svg>
                </button>
                <div id="button-open-chatbot-iframe" class="pcOpenChat">
                    <button id="proactive-chat-button-open" data-analyticsid="askus-proactive-chatbot-button-open" data-testid="popopen-button" class="open proactive-chat-button" aria-label="Ask Library Chat Bot a question">Ask Library Chatbot</button>
                </div>
                <div id="button-open-crm" class="crmChatPrompt">
                    <button id="crmChatPrompt" data-analyticsid="askus-proactive-chat-button-open" class="open crmchat-button" style="display: none"><span>Chat with Library staff</span></button>
                    <button id="leaveAQuestionPrompt" data-analyticsid="chat-status-icon-offline" class="open crmchat-button" style="display: none" aria-label="No staff available to chat - Leave a question"><span>Leave a question</span></button>
                </div>
            </div>
        </div>
    </div>
`;

const chatbotIframeTemplate = document.createElement('template');
chatbotIframeTemplate.innerHTML = `<div
    id="chatbot-wrapper"
    data-testid="chatbot-wrapper"
    class="chatbotIframeWrapper"
>
    <div class="resizeHandleRepositionWrapper">
        <div class="topBar">
            <h1>Library Chatbot</h1>
            <button id="closeIframeButton" data-testid="closeIframeButton" data-analyticsid="chatbot-iframe-close" aria-label="Close Chatbot">
                <!-- close "x" -->
                <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 3.41 16.71 8.7 20 12h-8V4l3.29 3.29L20.59 2zM3.41 22l5.29-5.29L12 20v-8H4l3.29 3.29L2 20.59z"></path>
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

function timeStamp() {
    // temp, for debugging
    const currentTime = new Date();
    return (
        currentTime.getHours() +
        ':' +
        String(currentTime.getMinutes()).padStart(2, '0') +
        ':' +
        String(currentTime.getSeconds()).padStart(2, '0')
    );
}

class ProactiveChat extends HTMLElement {
    static get observedAttributes() {
        return ['showchatbot', 'showcrmchat'];
    }
    constructor() {
        super();
        // Add a shadow DOM
        const secondsTilProactiveChatAppears = this.getAttribute('secondsTilProactiveChatAppears') || 60;
        this.displayType = this.getAttribute('display') || null;
        this.shadowDOM = this.attachShadow({ mode: 'open' });

        this.addHiderClassToDocument();

        // Render the userPromptTemplate
        this.shadowDOM.appendChild(userPromptTemplate.content.cloneNode(true));

        // only show the crm button?
        if (this.isChatBotHiddenHere()) {
            const chatbotiframe = this.shadowDOM.querySelector('#proactivechat iframe');
            !!chatbotiframe && chatbotiframe.remove();

            const chatbotButton = this.shadowDOM.querySelector('#button-open-chatbot-iframe');
            !!chatbotButton && chatbotButton.remove();

            const crmButtonListWrapper = this.shadowDOM.querySelector('#button-open-crm');
            !!crmButtonListWrapper && (crmButtonListWrapper.style.marginBottom = '25px');

            const crmButtonList = this.shadowDOM.querySelectorAll('#button-open-crm button');
            !!crmButtonList && crmButtonList.forEach((b) => !!b && b.classList.add('proactive-chat-button'));
        }

        if (this.displayType === 'inline') {
            const proactiveChatWebComponent = this.shadowDOM.querySelector('#proactive-chat');
            !!proactiveChatWebComponent && proactiveChatWebComponent.classList.add('show');
            !!proactiveChatWebComponent && proactiveChatWebComponent.classList.add('displayinline');
            const wrapper = this.shadowDOM.querySelector('#proactive-chat-wrapper');
            !!wrapper && wrapper.removeAttribute('style');
        } else {
            this.watchHeightChangeInCrm();
        }
        this.updateAskusDOM(secondsTilProactiveChatAppears);
        this.addButtonListeners();

        this.chatbotHasAppeared = false;
        console.log('1 chatbotHasAppeared =', this.chatbotHasAppeared);
        this.crmInlineChatHasAppeared = false;
        this.askUsStatus = null;

        const awaitIframeConstructor = setInterval(() => {
            const crmIframe = document.querySelector('iframe#chatInlay');
            console.log(timeStamp(), 'awaitIframeConstructor=', awaitIframeConstructor);
            if (!crmIframe) {
                return;
            }

            clearInterval(awaitIframeConstructor);

            // !!crmIframe && (crmIframe.style.height = 'calc(100% - 115px)');
            this.hideCrmChatIframe(crmIframe);
        }, 100);
    }

    attributeChangedCallback(fieldName, oldValue, newValue) {
        const that = this;
        const awaitShadowDom = setInterval(() => {
            /* istanbul ignore next */
            if (!that.shadowDOM) {
                return;
            }

            clearInterval(awaitShadowDom);

            if (fieldName === 'showchatbot' && newValue === 'true') {
                this.hideCrmChatIframe();

                const button = that.shadowDOM.querySelector('#proactive-chat-button-open');
                !!button && button.click();
            } else if (fieldName === 'showcrmchat' && newValue === 'true') {
                const chatbotCloseButton = that.shadowDOM.querySelector('#closeIframeButton');
                !!chatbotCloseButton && chatbotCloseButton.click();

                console.log(timeStamp(), 'auto click open of crm chat iframe');
                const button = that.shadowDOM.querySelector('#crmChatPrompt');
                !!button && button.click();
            }
        }, 50);
    }

    isProactiveChatDialogDefinedAsHidden() {
        const hideProactiveChat = this.getAttribute('hideProactiveChat');
        return hideProactiveChat === 'true' || hideProactiveChat === '';
    }

    hideCrmChatIframe() {
        const crmIframe = document.querySelector('iframe#chatInlay');
        // console.log(timeStamp(), 'hideCrmChatIframe (before)', crmIframe);
        if (!!crmIframe) {
            if (!crmIframe.classList.contains('visually-hidden')) {
                crmIframe.classList.add('visually-hidden');
                // console.log(timeStamp(), 'hideCrmChatIframe crm iframe - visually-hidden class added');
            } else {
                // console.log(timeStamp(), 'hideCrmChatIframe crm iframe already had visually-hidden class');
            }
        }
    }

    showCrmChatIframe() {
        const crmIframe = document.querySelector('#chatInlay');

        console.log(timeStamp(), 'showCrmChatIframe crmIframe=', crmIframe);
        if (!!crmIframe && !!crmIframe.classList.contains('visually-hidden')) {
            crmIframe.classList.remove('visually-hidden');
            console.log(timeStamp(), 'showCrmChatIframe crm iframe - visually-hidden class removed');
        } else {
            console.log(timeStamp(), 'showCrmChatIframe crm iframe did not have visually-hidden class');
        }
    }

    addHiderClassToDocument() {
        // add styling for iframe to main document, because thats where we add the iframe
        const styleSheet = document.createElement('style');
        // hide crm chat on load
        styleSheet.textContent = `
          .visually-hidden {
              position: absolute;
              top: auto;
              overflow: hidden;
              clip: rect(1px 1px 1px 1px); /* IE 6/7 */
              clip: rect(1px, 1px, 1px, 1px);
              width: 1px;
              height: 1px;
              white-space: nowrap;
          }`;
        // reduce rounded corners to meet UQ DS
        styleSheet.textContent += 'iframe#chatInlay { border-radius: 4px }';
        // add a white border so when the iframe minimised button is over the footer we can see it
        styleSheet.textContent += 'iframe#chatInlay:not(.visually-hidden) { border: thin solid white; z-index: 999; }';
        document.head.appendChild(styleSheet);
    }

    async updateAskusDOM(secondsTilProactiveChatAppears) {
        const isProactiveChatDialogDefinedAsHidden = this.isProactiveChatDialogDefinedAsHidden();

        const isPrimoPage = (hostname) => {
            var regExp = /(.*)exlibrisgroup.com/i;
            return 'search.library.uq.edu.au' === hostname || regExp.test(hostname);
        };
        const showProactiveChat = () => {
            if (!!this.chatbotHasAppeared || this.crmInlineChatHasAppeared) {
                return;
            }
            const proactiveChatWebComponent = this.shadowDOM.querySelector('#proactive-chat');
            !!proactiveChatWebComponent && proactiveChatWebComponent.classList.add('show');
        };
        const showProactiveChatWrapper = () => {
            if (!!this.chatbotHasAppeared || this.crmInlineChatHasAppeared) {
                return;
            }
            const wrapper = this.shadowDOM.querySelector('#proactive-chat-wrapper');
            !!wrapper && wrapper.removeAttribute('style');
            this.showMinimisedButton();
        };
        const api = new ApiAccess();
        const that = this;
        await api
            .loadChatStatus()
            .then((isOnline) => {
                if (!!isOnline) {
                    that.askUsStatus = 'online';
                    if (!isProactiveChatDialogDefinedAsHidden) {
                        const onlineMinimisedButton = that.shadowDOM.querySelector('#proactive-chat-online');
                        !!onlineMinimisedButton && onlineMinimisedButton.removeAttribute('style');
                    }
                    const onlineSecondaryOption = that.shadowDOM.querySelector('#crmChatPrompt');
                    !!onlineSecondaryOption && onlineSecondaryOption.removeAttribute('style');
                } else {
                    that.askUsStatus = 'offline';
                    const offlineIcon = that.shadowDOM.querySelector('#proactive-chat-offline');
                    !isProactiveChatDialogDefinedAsHidden && !!offlineIcon && offlineIcon.removeAttribute('style');
                    const offlineSecondaryOption = that.shadowDOM.querySelector('#leaveAQuestionPrompt');
                    !!offlineSecondaryOption && offlineSecondaryOption.removeAttribute('style');
                }
            })
            .then(() => {
                // set the timer delay for proactive chat if we're not in primo & they haven't asked for it to be hidden
                if (
                    !isProactiveChatDialogDefinedAsHidden &&
                    !isPrimoPage(window.location.hostname) &&
                    cookieNotFound(PROACTIVE_CHAT_HIDDEN_COOKIE_NAME, PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE)
                ) {
                    console.log(timeStamp(), 'will show proactive in a bit');
                    setTimeout(() => {
                        console.log('2 chatbotHasAppeared =', that.chatbotHasAppeared);
                        if (!that.chatbotHasAppeared) {
                            console.log('show now');
                            showProactiveChatWrapper();
                        } else {
                            console.log('whould have show n but chatbot was visible');
                        }
                    }, (secondsTilProactiveChatAppears === 0 ? 0 : secondsTilProactiveChatAppears - 1) * 1000);
                    setTimeout(showProactiveChat, secondsTilProactiveChatAppears * 1000);
                }
            });
    }

    showProactiveChatPromptDialog() {
        console.log('showProactiveChatPromptDialog');
        const proactivechatArea = this.shadowDOM.querySelector('#proactivechat');
        !!proactivechatArea && (proactivechatArea.style.display = 'block');
        console.log(timeStamp(), 'showProactiveChatPromptDialog');
    }

    hideProactiveChatPromptDialog() {
        const proactivechatArea = this.shadowDOM.querySelector('#proactivechat');
        !!proactivechatArea && (proactivechatArea.style.display = 'none');
    }

    addButtonListeners() {
        const that = this;

        function closeChatBotIframe(e, elementId = 'chatbot-wrapper') {
            const chatbotIframe = that.shadowDOM.querySelector(`#${elementId}`);
            !!chatbotIframe && chatbotIframe.remove(); // deleting it rather than hiding it will force it to check for logout
            that.showProactiveChatPromptDialog();

            that.showMinimisedButton();

            // make sure the proactive dialog is hidden
            const wrapper = that.shadowDOM.querySelector('#proactive-chat-wrapper');
            !!wrapper && (wrapper.style.display = 'none');
        }

        function swapToCrm() {
            // minimise chatbot iframe
            if (that.displayType !== 'inline') {
                closeChatBotIframe();
            }

            openCrmChatIframe();
        }

        function setChatbotIframeSrc() {
            let iframeSrc = 'https://www.library.uq.edu.au';
            if (window.location.hostname === 'localhost') {
                iframeSrc = 'http://localhost:2020'; // bring mock up to use locally
            } else if (
                window.location.hostname === 'homepage-development.library.uq.edu.au' &&
                window.location.pathname.startsWith('/feature-leadegroot')
            ) {
                // dev - ITS dev env
                iframeSrc = `${window.location.protocol}//${window.location.hostname}/feature-leadegroot-1`;
            } else if (
                window.location.hostname === 'homepage-development.library.uq.edu.au' &&
                window.location.pathname.startsWith('/chatbot-testenv')
            ) {
                // dev - ITS test env
                iframeSrc = `${window.location.protocol}//${window.location.hostname}/chatbot-testenv`;
            } else if (
                window.location.hostname === 'homepage-staging.library.uq.edu.au' ||
                window.location.hostname === 'app-testing.library.uq.edu.au' ||
                window.location.hostname === 'web-staging.library.uq.edu.au' || // maybe iframe cross domain issue
                window.location.hostname === 'sandbox-fryer.library.uq.edu.au' // ditto
            ) {
                iframeSrc = window.location.protocol + '//' + window.location.hostname;
            }
            return iframeSrc;
        }

        // we dont handle the "close" - its done by CRM
        function openCrmChatIframe() {
            console.log('openCrmChatIframe start');
            if (that.displayType === 'inline') {
                console.log('openCrmChatIframe inline');
                // find the corner chat instance on the page, not the inline one
                const proactiveChatWebComponent = document.querySelectorAll('proactive-chat:not([display="inline"])');
                if (!!proactiveChatWebComponent && proactiveChatWebComponent.length > 0) {
                    proactiveChatWebComponent[0].setAttribute('showcrmchat', 'true');
                    proactiveChatWebComponent[0].hasAttribute('showchatbot') &&
                        proactiveChatWebComponent[0].removeAttribute('showchatbot');
                }

                that.hideMinimisedButtons();
            } else {
                console.log('openCrmChatIframe corner');
                that.crmInlineChatHasAppeared = true;

                const dialogWrapper = that.shadowDOM.querySelector('#proactive-chat-wrapper');
                !!dialogWrapper && (dialogWrapper.style.display = 'none');

                that.showCrmChatIframe();
                that.hideMinimisedButtons();
            }
        }

        function openChatBotIframe() {
            console.log('openChatBotIframe start');
            that.chatbotHasAppeared = true;
            console.log('3 chatbotHasAppeared =', that.chatbotHasAppeared);

            if (that.displayType === 'inline') {
                // find the corner chat instance on the page, not the inline one
                const proactiveChatWebComponent = document.querySelectorAll('proactive-chat:not([display="inline"])');
                if (!!proactiveChatWebComponent && proactiveChatWebComponent.length > 0) {
                    proactiveChatWebComponent[0].setAttribute('showchatbot', 'true');
                    proactiveChatWebComponent[0].hasAttribute('showcrmchat') &&
                        proactiveChatWebComponent[0].removeAttribute('showcrmchat');
                }

                that.hideMinimisedButtons();
            } else {
                that.hideProactiveChatPromptDialog();
                that.hideCrmChatIframe();

                that.showMinimisedButton();

                let chatbotWrapper1 = that.shadowDOM.querySelector('#chatbot-wrapper');
                if (!!chatbotWrapper1) {
                    chatbotWrapper1.style.display = 'block';
                } else {
                    that.shadowDOM.appendChild(chatbotIframeTemplate.content.cloneNode(true));
                    chatbotWrapper1 = that.shadowDOM.querySelector('#chatbot-wrapper');
                }

                // show chatbot source
                let iframeSrc = setChatbotIframeSrc();
                let chatbotUrl = `${iframeSrc}/chatbot.html`;
                const chatBotIframe = !!chatbotWrapper1 && chatbotWrapper1.getElementsByTagName('iframe');
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

                const openCrmButton = that.shadowDOM.querySelector('#speakToPerson');
                !!openCrmButton && openCrmButton.addEventListener('click', swapToCrm);
                const chatbotCloseButton = that.shadowDOM.querySelector('#closeIframeButton');
                !!chatbotCloseButton && chatbotCloseButton.addEventListener('click', closeChatBotIframe);

                const proactiveleaveQuestion = that.shadowDOM.querySelector('#leaveQuestion');
                !!proactiveleaveQuestion && proactiveleaveQuestion.addEventListener('click', navigateToContactUs);

                const elementId = that.askUsStatus === 'online' ? 'speakToPerson' : 'leaveQuestion';
                const minimisedButton = that.shadowDOM.getElementById(elementId);
                !!minimisedButton && (minimisedButton.style.display = 'inline');
            }
        }

        function navigateToContactUs() {
            window.open('https://support.my.uq.edu.au/app/library/contact', '_blank');
        }
        const showProactiveChatDialog = () => {
            const wrapper = that.shadowDOM.querySelector('#proactive-chat-wrapper');
            !!wrapper && wrapper.removeAttribute('style');

            this.showMinimisedButton();

            const proactiveChatWebComponent = that.shadowDOM.querySelector('#proactive-chat');
            !!proactiveChatWebComponent && proactiveChatWebComponent.classList.add('show');
        };

        // Proactive chat
        function hideProactiveChatWrapper() {
            const pcWrapper = that.shadowDOM.querySelector('#proactive-chat-wrapper');
            !!pcWrapper && (pcWrapper.style.display = 'none');
        }
        function closeProactiveChat() {
            const proactiveChatWebComponent = that.shadowDOM.querySelector('#proactive-chat');
            !!proactiveChatWebComponent && proactiveChatWebComponent.classList.remove('show');
            setTimeout(hideProactiveChatWrapper, 1000);
            //set cookie for 24 hours
            const date = new Date();
            date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
            setCookie(PROACTIVE_CHAT_HIDDEN_COOKIE_NAME, PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE, date, true);

            that.showMinimisedButton();
        }

        // Chat status listeners
        const crmChatprompt = that.shadowDOM.querySelector('#crmChatPrompt');
        !!crmChatprompt && crmChatprompt.addEventListener('click', openCrmChatIframe);

        const proactiveChatWebComponentOnline = that.shadowDOM.querySelector('#proactive-chat-online');
        !!proactiveChatWebComponentOnline &&
            proactiveChatWebComponentOnline.addEventListener('click', showProactiveChatDialog);

        const proactiveChatWebComponentOFFline = that.shadowDOM.querySelector('#proactive-chat-offline');
        !!proactiveChatWebComponentOFFline &&
            proactiveChatWebComponentOFFline.addEventListener('click', showProactiveChatDialog);

        const proactiveChatWebComponentClose = that.shadowDOM.querySelector('#proactive-chat-button-close');
        !!proactiveChatWebComponentClose &&
            proactiveChatWebComponentClose.addEventListener('click', closeProactiveChat);
        const proactiveChatWithBot = that.shadowDOM.querySelector('#proactive-chat-button-open');
        !!proactiveChatWithBot && proactiveChatWithBot.addEventListener('click', openChatBotIframe);
        const proactiveleaveQuestion = that.shadowDOM.querySelector('#leaveAQuestionPrompt');
        !!proactiveleaveQuestion && proactiveleaveQuestion.addEventListener('click', navigateToContactUs);
    }

    hideMinimisedButtons() {
        const minimisedButtonsElement = this.shadowRoot.querySelector('#minimised-buttons');
        !!minimisedButtonsElement && (minimisedButtonsElement.style.display = 'none');
    }

    showMinimisedButton() {
        const minimisedButtonWrapper = this.shadowDOM.querySelector('#minimised-buttons');
        !!minimisedButtonWrapper && minimisedButtonWrapper.removeAttribute('style');
    }

    // is this a page that doesn't want chatbot showing?
    isChatBotHiddenHere() {
        return (
            // other condition here (none currently)
            window.location.pathname === '/index-app-nochatbot.html' // test only
        );
    }

    // we dont control the close of the CRM iframe, so watch for it to get small, and then show other buttons
    watchHeightChangeInCrm() {
        const awaitCrmIframeBody = setInterval(() => {
            const crmIframe = document.querySelector('iframe#chatInlay');
            console.log(timeStamp(), 'awaitCrmIframeBody crmIframe=', crmIframe);
            if (!crmIframe) {
                return;
            }
            clearInterval(awaitCrmIframeBody);

            // Set up interval to monitor height changes
            let previousHeight = null;
            setInterval(() => {
                const crmIframe = document.querySelector('iframe#chatInlay');
                // Get current height
                const currentHeight =
                    crmIframe.contentWindow.document.documentElement.scrollHeight ||
                    crmIframe.contentWindow.document.body.scrollHeight;
                // console.log(timeStamp(), 'currentHeight=', currentHeight);

                // Check if height is less than 50px
                if (currentHeight < 50 && previousHeight !== currentHeight) {
                    console.log(timeStamp(), 'Iframe height is now less than 50px:', currentHeight);
                    this.hideCrmChatIframe();
                    // this.showProactiveChatPromptDialog();
                    // show the minimised buttons

                    const dialogWrapper = this.shadowDOM.querySelector('#proactivechat');
                    !!dialogWrapper && (dialogWrapper.style.display = 'inline');

                    this.showMinimisedButton();
                }

                // Store current height for next comparison
                previousHeight = currentHeight;
            }, 100);
        }, 50);
    }

    attachCRMScriptToPage() {
        function getPathnameRoot(pathname) {
            const parts = pathname.split('/');
            if (parts.length < 3) {
                return '/';
            }

            const firstTwoLevels = parts.slice(1, 3);
            return '/' + firstTwoLevels.join('/') + '/';
        }
        function configFileLocation() {
            const assetsHostname = 'assets.library.uq.edu.au';
            const includeFilename = 'applications/proactive/config.js';

            if (window.location.host === 'localhost:8080') {
                return '/' + includeFilename;
            }

            if (window.location.href.startsWith(`https://${assetsHostname}/reusable-webcomponents-staging/`)) {
                // a test on staging branch gets staging version
                return assetsRoot + '/reusable-webcomponents-staging/' + includeFilename;
            }
            if (
                window.location.href.startsWith(`https://${assetsHostname}/reusable-webcomponents-development/master/`)
            ) {
                // a test on master branch gets master version
                return assetsRoot + '/reusable-webcomponents-development/master/' + includeFilename;
            }
            if (window.location.host === assetsHostname) {
                // a test on any other feature branch gets the feature branch
                return assetsRoot + getPathnameRoot(window.location.pathname) + includeFilename;
            }
            if (
                window.location.host === 'homepage-development.library.uq.edu.au' ||
                window.location.host === 'homepage-staging.library.uq.edu.au'
            ) {
                // a test on homepage gets staging version
                return assetsRoot + '/reusable-webcomponents-staging/' + includeFilename;
            }

            // production
            return `https://assets.library.uq.edu.au/reusable-webcomponents/${includeFilename}`;
        }

        // This loads the external JS file into the HTML head dynamically
        // Only load js if it has not been loaded before
        const scriptId = 'oit-loader';
        const scriptFound = document.getElementById(scriptId);
        /* istanbul ignore else */
        if (!scriptFound) {
            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.defer = true;
            script.id = scriptId;
            script.onload = function () {
                function fireChatInlayShowEvent() {
                    var showFn = function () {
                        window.oit.fire(
                            new window.oit.CustomEvent('inlay-oracle-chat-embedded-show', {
                                detail: { id: 'chatInlay' },
                            }),
                        );
                    };
                    setTimeout(showFn, 0);
                }
                function waitForChatInlay() {
                    if (window.oit.inlayIsLoaded('chatInlay')) {
                        fireChatInlayShowEvent();
                    } else {
                        document.addEventListener('inlay-oracle-chat-embedded-loaded', fireChatInlayShowEvent);
                    }
                }
                window.oit && window.oit.inlayIsLoaded
                    ? waitForChatInlay()
                    : document.addEventListener('oit-loaded', waitForChatInlay);
            };

            script.src = `https://${crmLocationScript}/s/oit/latest/common/v0/libs/oit/loader.js`;
            console.log('use config file at: ', configFileLocation());
            script.setAttribute('data-oit-config-url', configFileLocation());

            document.body.appendChild(script);
        }
    }

    connectedCallback() {
        // when this method has fired, the shadow dom is available
        console.log(timeStamp(), 'connectedCallback');

        let crmChatParams = [
            {
                hidden: false,
                name: 'FIRST_NAME',
                required: true,
            },
            {
                hidden: false,
                name: 'EMAIL',
                required: true,
            },
            {
                hidden: false,
                name: 'SUBJECT',
                required: true,
            },
        ];

        // wait on the account to come from storage (or empty) so we know if we can supply details
        const api = new ApiAccess();
        let millisecondsWait = 1000; // first time longer to give storage time to change from logged out to logged in
        console.log(timeStamp(), '0 millisecondsWait=', millisecondsWait);
        const waitOnStorage = setInterval(() => {
            console.log(timeStamp(), 'millisecondsWait=', millisecondsWait);
            // sometimes it takes a moment before it is readable
            const currentUserDetails = api.getAccountFromStorage();

            const accountAvailable =
                currentUserDetails.hasOwnProperty('account') &&
                !!currentUserDetails.account &&
                currentUserDetails.account.hasOwnProperty('id') &&
                !!currentUserDetails.account.id;
            if (!!accountAvailable) {
                clearInterval(waitOnStorage);

                // set account fields
                const firstNameIndex = crmChatParams.findIndex((param) => param.name === 'FIRST_NAME');
                crmChatParams[firstNameIndex].value = currentUserDetails.account.firstName.replace(/ /g, '&nbsp;');
                // crmChatParams[firstNameIndex].hidden = true;
                const emailIndex = crmChatParams.findIndex((param) => param.name === 'EMAIL');
                crmChatParams[emailIndex].value = currentUserDetails.account.mail;
                // crmChatParams[emailIndex].hidden = true;
                console.log(timeStamp(), 'accountAvailable waitOnStorage clone crmChatParams=', crmChatParams);
            } else if (
                !!currentUserDetails &&
                currentUserDetails.hasOwnProperty('status') &&
                currentUserDetails.status === apiLocale.USER_LOGGED_OUT
            ) {
                console.log(timeStamp(), 'NOT accountAvailable waitOnStorage clone not logged in');
                clearInterval(waitOnStorage);
                // use default "please fill in" settings
            }

            // from https://uqemployee.crm.test.uq.edu.au/s/oit/latest/ > inlays > embedded chat
            // https://community.oracle.com/customerconnect/discussion/552678/sample-file-for-chat-inlay-attribute-launch-form-fields
            const crmchatIncludeTemplate = document.createElement('template');

            const stringedParams = JSON.stringify(crmChatParams);
            console.log(timeStamp(), 'clone stringedParams=', stringedParams);
            crmchatIncludeTemplate.innerHTML = `<inlay-oracle-chat-embedded
                id="chatInlay"
                class="inlay"
                site-url="${crmLocationEmbed}"
                launch-form-fields=${stringedParams}
                inlay-hidden="true"
            >
            </inlay-oracle-chat-embedded>`;

            this.attachCRMScriptToPage();

            // attach crm inline chat to top level document root
            const clone = crmchatIncludeTemplate.content.cloneNode(true);
            console.log(timeStamp(), 'clone = ', clone);
            console.log(timeStamp(), 'clone window.document.body= ', window.document.body);
            window.document.body.appendChild(clone);
            console.log(timeStamp(), 'clone after');
            millisecondsWait = 200;
            console.log(timeStamp(), '! millisecondsWait=', millisecondsWait);
        }, millisecondsWait);
    }
}

export default ProactiveChat;

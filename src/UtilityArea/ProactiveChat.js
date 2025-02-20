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
            <button id="proactive-chat-online" data-testid="proactive-chat-online" class="pconline svg-container" data-analyticsid="chat-status-icon-online-button" style="display: none;" title="Chat with us - see options" aria-label="Chat with us - see options">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <g id="icon/marketing/chat">
                        <path id="Vector" d="M26.3999 23.1997H15.2L8.80012 27.9997V23.1997H5.60016C5.17582 23.1997 4.76886 23.0312 4.46881 22.7311C4.16875 22.4311 4.00018 22.0241 4.00018 21.5998V5.59998C4.00018 5.17564 4.16875 4.76868 4.46881 4.46862C4.76886 4.16857 5.17582 4 5.60016 4H26.3999C26.8242 4 27.2312 4.16857 27.5312 4.46862C27.8313 4.76868 27.9999 5.17564 27.9999 5.59998V21.5998C27.9999 22.0241 27.8313 22.4311 27.5312 22.7311C27.2312 23.0312 26.8242 23.1997 26.3999 23.1997Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path id="Vector_2" d="M8.79999 11.1999H23.1998" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path id="Vector_3" d="M8.79999 16H19.9998" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                </svg>
            </button>
           <button id="proactive-chat-offline" data-testid="proactive-chat-offline" class="pcOffline" data-analyticsid="chat-status-icon-offline-button" style="display: none;" title="Chat with us - see options" aria-label="Chat with us - see options">
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
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
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

// from https://uqemployee.crm.test.uq.edu.au/s/oit/latest/ > inlays > embedded chat
// https://community.oracle.com/customerconnect/discussion/552678/sample-file-for-chat-inlay-attribute-launch-form-fields
const crmchatIncludeTemplate = document.createElement('template');
// TODO dont forget to give a dynamic location!!
crmchatIncludeTemplate.innerHTML = `<inlay-oracle-chat-embedded
    id="chatInlay"
    class="inlay"
    site-url="${crmLocationEmbed}"
    inlay-hidden="true"
    data-oit-config-url="https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-leadegroot/applications/proactive/config.js"
    style="
        --oj-brand-color: #51247A;
    "
    launch-form-fields='[{
        "hidden": false,
        "name": "FIRST_NAME",
        "required": true
        }, {
        "hidden": false,
        "name": "EMAIL",
        "required": true,
        "value": "uqldegro@uq.edu.au"
      }, {
        "hidden": false,
        "name": "SUBJECT",
        "required": true
        }]'
>
</inlay-oracle-chat-embedded>`;

const chatbotIframeTemplate = document.createElement('template');
chatbotIframeTemplate.innerHTML = `<div
    id="chatbot-wrapper"
    data-testid="chatbot-wrapper"
    class="chatIframeWrapper"
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

let ShowChatBot = false;
let ShowCrmChat = false;

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
            const proactiveChatElement = this.shadowDOM.querySelector('#proactive-chat');
            !!proactiveChatElement && proactiveChatElement.classList.add('show');
            !!proactiveChatElement && proactiveChatElement.classList.add('displayinline');
            const wrapper = this.shadowDOM.querySelector('#proactive-chat-wrapper');
            !!wrapper && wrapper.removeAttribute('style');
        }
        this.updateAskusDOM(secondsTilProactiveChatAppears);
        this.addButtonListeners(this.shadowDOM);

        this.chatbotHasAppeared = false;
        this.askUsStatus = null;

        const awaitIframe = setInterval(() => {
            const crmIframe = document.querySelector('iframe#chatInlay');
            console.log('crmIframe=', crmIframe);
            if (!crmIframe) {
                return;
            }

            clearInterval(awaitIframe);

            // !!crmIframe && (crmIframe.style.height = 'calc(100% - 115px)');
            this.hideCrmChatIframe(crmIframe);
        }, 100);
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
                case 'showcrmchat':
                    ShowCrmChat = newValue === 'true' ? true : false;
                    break;
                /* istanbul ignore next  */
                default:
                    console.log(`unhandled attribute ${fieldName} received for ProactiveChat`);
            }
            // Change the attribs here?
            const proactiveChatElement = that.shadowRoot.querySelector('#proactive-chat');
            const minimisedButtonsElement = that.shadowRoot.querySelector('#minimised-buttons');

            if (ShowChatBot) {
                const button = that.shadowRoot.querySelector('#proactive-chat-button-open');
                !!button && button.click();
            }

            if (ShowCrmChat) {
                console.log('auto click open of crm chat iframe');
                const button = that.shadowRoot.querySelector('#crmChatPrompt');
                !!button && button.click();
            }
        }, 50);
    }

    isProactiveChatDialogDefinedAsHidden() {
        const hideProactiveChat = this.getAttribute('hideProactiveChat');
        return hideProactiveChat === 'true' || hideProactiveChat === '';
    }

    hideCrmChatIframe(crmIframe) {
        console.log('hideCrmChatIframe (before)', crmIframe);
        if (!!crmIframe && !crmIframe.classList.contains('visually-hidden')) {
            crmIframe.classList.add('visually-hidden');
            console.log('hideCrmChatIframe crm iframe - visually-hidden class added');
        } else {
            console.log('hideCrmChatIframe crm iframe already had visually-hidden class');
        }
    }

    showCrmChatIframe(crmIframe) {
        console.log('showCrmChatIframe');
        if (!!crmIframe && !!crmIframe.classList.contains('visually-hidden')) {
            crmIframe.classList.remove('visually-hidden');
            console.log('showCrmChatIframe crm iframe - visually-hidden class removed');
        } else {
            console.log('showCrmChatIframe crm iframe did not have visually-hidden class');
        }
    }

    addHiderClassToDocument() {
        // used to hide crm chat on load
        const styleSheet = document.createElement('style');
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
        document.head.appendChild(styleSheet);
    }

    async updateAskusDOM(secondsTilProactiveChatAppears) {
        const isProactiveChatDialogDefinedAsHidden = this.isProactiveChatDialogDefinedAsHidden();

        const isPrimoPage = (hostname) => {
            var regExp = /(.*)exlibrisgroup.com/i;
            return 'search.library.uq.edu.au' === hostname || regExp.test(hostname);
        };
        const showProactiveChat = () => {
            if (!!this.chatbotHasAppeared) {
                return;
            }
            const proactiveChatElement = this.shadowDOM.querySelector('#proactive-chat');
            !!proactiveChatElement && proactiveChatElement.classList.add('show');
        };
        const showProactiveChatWrapper = () => {
            if (!!this.chatbotHasAppeared) {
                return;
            }
            const wrapper = this.shadowDOM.querySelector('#proactive-chat-wrapper');
            !!wrapper && wrapper.removeAttribute('style');
            const onlineMinimisedButton = this.shadowDOM.querySelector('#proactive-chat-online');
            !!onlineMinimisedButton && (onlineMinimisedButton.style.display = 'none');
            const offlineMinimisedButton = this.shadowDOM.querySelector('#proactive-chat-offline');
            !!offlineMinimisedButton && (offlineMinimisedButton.style.display = 'none');
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
                    setTimeout(
                        showProactiveChatWrapper,
                        (secondsTilProactiveChatAppears === 0 ? 0 : secondsTilProactiveChatAppears - 1) * 1000,
                    );
                    setTimeout(showProactiveChat, secondsTilProactiveChatAppears * 1000);
                }
            });
    }

    showProactiveChatPromptDialog() {
        const proactivechatArea = this.shadowDOM.querySelector('#proactivechat');
        !!proactivechatArea && (proactivechatArea.style.display = 'block');
    }

    hideProactiveChatPromptDialog() {
        const proactivechatArea = this.shadowDOM.querySelector('#proactivechat');
        !!proactivechatArea && (proactivechatArea.style.display = 'none');
    }

    addButtonListeners(isOnline) {
        const that = this;

        function closeChatBotIframe(e, elementId = 'chatbot-wrapper') {
            const chatbotIframe = that.shadowDOM.querySelector(`#${elementId}`);
            !!chatbotIframe && chatbotIframe.remove(); // deleting it rather than hiding it will force it to check for logout
            that.showProactiveChatPromptDialog();

            const minimisedButtonsElement = that.shadowRoot.querySelector('#minimised-buttons');
            !!minimisedButtonsElement && (minimisedButtonsElement.style.display = 'inline');
            if (that.askUsStatus === 'online') {
                // show the minimised button
                const onlineMinimisedButton = that.shadowDOM.querySelector('#proactive-chat-online');
                !!onlineMinimisedButton && onlineMinimisedButton.removeAttribute('style');
                // make sure the proactive dialog is hidden
                const wrapper = that.shadowDOM.querySelector('#proactive-chat-wrapper');
                !!wrapper && (wrapper.style.display = 'none');
            }
        }

        function swapToCrm() {
            // minimise chatbot iframe
            closeChatBotIframe();

            openCrmChatIframe();
        }

        function getIframeSrc() {
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

        function openCrmChatIframe() {
            // if (that.displayType === 'inline') {
            //     console.log('inline detected');
            //     const crmChatIframe = document.querySelectorAll('proactive-chat:not([display="inline"])');
            //     !!crmChatIframe &&
            //     crmChatIframe.length > 0 &&
            //     crmChatIframe[0].setAttribute('showcrmchat', 'true');
            // } else {
            console.log('openCrmChatIframe');
            that.hideProactiveChatPromptDialog();
            console.log('openCrmChatIframe prompt hidden');
            const crmIframe = document.getElementById('chatInlay');
            that.showCrmChatIframe(crmIframe);
            console.log('openCrmChatIframe crm shows');
            // }

            const minimisedButtonsElement = that.shadowRoot.querySelector('#minimised-buttons');
            !!minimisedButtonsElement && (minimisedButtonsElement.style.display = 'none');
        }

        function openChatBotIframe() {
            that.chatbotHasAppeared = true;

            if (that.displayType === 'inline') {
                // find the corner chat instance on the page
                const proactiveChatElement = document.querySelectorAll('proactive-chat:not([display="inline"])');
                !!proactiveChatElement &&
                    proactiveChatElement.length > 0 &&
                    proactiveChatElement[0].setAttribute('showchatbot', 'true');

                const minimisedButtonsElement = that.shadowRoot.querySelector('#minimised-buttons');
                !!minimisedButtonsElement && (minimisedButtonsElement.style.display = 'none');
            } else {
                that.hideProactiveChatPromptDialog();

                const minimisedOnlineButton = that.shadowDOM.querySelector('#proactive-chat-online');
                !!minimisedOnlineButton && (minimisedOnlineButton.style.display = 'none');

                let chatbotWrapper1 = that.shadowDOM.querySelector('#chatbot-wrapper');
                if (!!chatbotWrapper1) {
                    chatbotWrapper1.style.display = 'block';
                } else {
                    that.shadowDOM.appendChild(chatbotIframeTemplate.content.cloneNode(true));
                    chatbotWrapper1 = that.shadowDOM.querySelector('#chatbot-wrapper');
                }

                // show chatbot source
                let iframeSrc = getIframeSrc();
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
            const onlineMinimisedButton = that.shadowDOM.querySelector('#proactive-chat-online');
            !!onlineMinimisedButton && (onlineMinimisedButton.style.display = 'none');
            const offlineMinimisedButton = that.shadowDOM.querySelector('#proactive-chat-offline');
            !!offlineMinimisedButton && (offlineMinimisedButton.style.display = 'none');

            const proactiveChatElement = that.shadowDOM.querySelector('#proactive-chat');
            !!proactiveChatElement && proactiveChatElement.classList.add('show');
        };

        // Proactive chat
        function hideProactiveChatWrapper() {
            const pcWrapper = that.shadowDOM.querySelector('#proactive-chat-wrapper');
            !!pcWrapper && (pcWrapper.style.display = 'none');
        }
        function closeProactiveChat() {
            const proactiveChatElement = that.shadowDOM.querySelector('#proactive-chat');
            !!proactiveChatElement && proactiveChatElement.classList.remove('show');
            setTimeout(hideProactiveChatWrapper, 1000);
            //set cookie for 24 hours
            const date = new Date();
            date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
            setCookie(PROACTIVE_CHAT_HIDDEN_COOKIE_NAME, PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE, date, true);
            const elementId = that.askUsStatus === 'online' ? 'proactive-chat-online' : 'proactive-chat-offline';
            const minimisedButton = that.shadowDOM.getElementById(elementId);
            !!minimisedButton && (minimisedButton.style.display = 'block');
        }

        // Chat status listeners
        const crmChatprompt = that.shadowDOM.querySelector('#crmChatPrompt');
        !!crmChatprompt && crmChatprompt.addEventListener('click', openCrmChatIframe);

        const proactiveChatElementOnline = that.shadowDOM.querySelector('#proactive-chat-online');
        !!proactiveChatElementOnline && proactiveChatElementOnline.addEventListener('click', showProactiveChatDialog);

        const proactiveChatElementOFFline = that.shadowDOM.querySelector('#proactive-chat-offline');
        !!proactiveChatElementOFFline && proactiveChatElementOFFline.addEventListener('click', showProactiveChatDialog);

        const proactiveChatElementClose = that.shadowDOM.querySelector('#proactive-chat-button-close');
        !!proactiveChatElementClose && proactiveChatElementClose.addEventListener('click', closeProactiveChat);
        const proactiveChatWithBot = that.shadowDOM.querySelector('#proactive-chat-button-open');
        !!proactiveChatWithBot && proactiveChatWithBot.addEventListener('click', openChatBotIframe);
        const proactiveleaveQuestion = that.shadowDOM.querySelector('#leaveAQuestionPrompt');
        !!proactiveleaveQuestion && proactiveleaveQuestion.addEventListener('click', navigateToContactUs);

        // // Function to handle height changes
        // function checkIframeHeight() {
        //         const crmIframe = document.querySelector('iframe#chatInlay');
        //         // Get current height
        //         const currentHeight = crmIframe.contentWindow.document.documentElement.scrollHeight ||
        //             crmIframe.contentWindow.document.body.scrollHeight;
        //         console.log('currentHeight=', currentHeight);
        //
        //         // Check if height is less than 50px
        //         if (currentHeight < 50 && previousHeight !== currentHeight) {
        //             console.log('Iframe height is now less than 50px:', currentHeight);
        //             that.hideCrmChatIframe()
        //         }
        //
        //         // Store current height for next comparison
        //         previousHeight = currentHeight;
        // }
        //
        // let previousHeight = null;

        const awaitIframe = setInterval(() => {
            const crmIframe = document.querySelector('iframe#chatInlay');
            console.log('awaitIframe crmIframe=', crmIframe);
            if (!crmIframe) {
                return;
            }
            clearInterval(awaitIframe);

            // Set up interval to monitor height changes
            let previousHeight = null;
            setInterval(() => {
                const crmIframe = document.querySelector('iframe#chatInlay');
                // Get current height
                const currentHeight =
                    crmIframe.contentWindow.document.documentElement.scrollHeight ||
                    crmIframe.contentWindow.document.body.scrollHeight;
                // console.log('currentHeight=', currentHeight);

                // Check if height is less than 50px
                if (currentHeight < 50 && previousHeight !== currentHeight) {
                    console.log('Iframe height is now less than 50px:', currentHeight);
                    that.hideCrmChatIframe(crmIframe);
                    that.showProactiveChatPromptDialog();
                }

                // Store current height for next comparison
                previousHeight = currentHeight;
            }, 100);
        }, 50);
    }

    // is this a page that doesnt want chatbot showing?
    isChatBotHiddenHere() {
        return (
            // other condition here (none currently)
            window.location.pathname === '/index-app-nochatbot.html' // test only
        );
    }

    loadScript() {
        const that = this;
        // This loads the external JS file into the HTML head dynamically
        // Only load js if it has not been loaded before
        const scriptId = 'oit-loader';
        const scriptFound = document.getElementById(scriptId);
        /* istanbul ignore else */
        if (!scriptFound) {
            const that = this;

            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.defer = true;
            // script.async = true;
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
            document.body.appendChild(script);
        }
    }

    connectedCallback() {
        console.log('connectedCallback');
        // when this method has fired, the shadow dom is available
        this.loadScript();

        // attach crm inline chat to top level document root
        const clone = crmchatIncludeTemplate.content.cloneNode(true);
        console.log('clone = ', clone);
        console.log('clone window.document.body= ', window.document.body);
        window.document.body.appendChild(clone);
        console.log('clone after');
    }
}

export default ProactiveChat;

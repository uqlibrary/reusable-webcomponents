import askus from './css/askus.css';
import ApiAccess from '../ApiAccess/ApiAccess';
import { cookieNotFound, setCookie } from '../helpers/cookie';
import { isBackTabKeyPressed, isEscapeKeyPressed, isTabKeyPressed } from '../helpers/keyDetection';

/**
 * API
 * <span slot="site-utilities">             -- tells uqsiteheader where to insert it in the dom
 *  <askus-button
 *      hideProactiveChat                   -- libwizard: dont show proactive chat at all
 *      nopaneopacity                       -- primo: dont put a background on it
 *      secondsTilProactiveChatAppears=3    -- default 60
 *  />
 * </span>
 *
 */

const template = document.createElement('template');
template.innerHTML = `
    <style>${askus.toString()}</style>
    <div id="askus">
    <!-- Chat status -->
        <div id="askus-chat-status">
            <div id="askus-chat-online" data-testid="askus-chat-online" style="display: none;" title="Click to open online chat">
                <svg id="askus-chat-status-icon-online" focusable="false" viewBox="0 0 24 24" aria-hidden="true" id="chat-status-icon-online" data-testid="chat-status-icon-online"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></svg>
            </div>
           <div id="askus-chat-offline" data-testid="askus-chat-offline" style="display: none;" title="Chat currently offline">
                <svg id="askus-chat-status-icon-offline" focusable="false" viewBox="0 0 24 24" aria-hidden="true" id="chat-status-icon-offline" data-testid="chat-status-icon-online"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></svg>
            </div>
        </div>
        <!-- Proactive chat -->
        <div id="askus-proactive-chat-wrapper" data-testid="askus-proactive-chat-wrapper" style="display: none">
            <div id="askus-proactive-chat" data-testid="askus-proactive-chat">
                <div class="askus-proactive-chat-text">
                    <div class="title">Chat is online now</div>
                    <div class="message">Library staff are here to assist.<br/>Would you like to chat?</div>
                </div>
                <div class="askus-proactive-chat-left-button">
                    <button id="askus-proactive-chat-button-open" data-testid="askus-proactive-chat-button-open" class="askus-proactive-chat-button">Chat&nbsp;now</button>
                </div>
                <div class="askus-proactive-chat-right-button">
                    <button id="askus-proactive-chat-button-close" data-testid="askus-proactive-chat-button-close" class="askus-proactive-chat-button">Maybe&nbsp;later</button>
                </div>
            </div>
        </div>
    </div>
`;

let initCalled;

const PROACTIVE_CHAT_HIDDEN_COOKIE_NAME = 'UQ_ASKUS_PROACTIVE_CHAT';
const PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE = 'hidden';

class ProactiveChat extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const secondsTilProactiveChatAppears = this.getAttribute('secondsTilProactiveChatAppears') || 60;
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // if (this.isPaneButtonOpacityDropRequested()) {
        //     // primo needs the opacity on the background turned off because it interacts weirdly with the Primo styles
        //     // add a class to the pane, and turn off the background colour on that class
        //     const pane = template.content.getElementById('askus-pane');
        //     !!pane && pane.classList.add('noOpacity');
        // }

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));
        this.updateAskusDOM(shadowDOM, secondsTilProactiveChatAppears);
        this.addButtonListeners(shadowDOM);

        // Bindings
        // this.updateAskusDOM = this.updateAskusDOM.bind(this);
        // this.addButtonListeners = this.addButtonListeners.bind(this);
        // this.isPaneButtonOpacityDropRequested = this.isPaneButtonOpacityDropRequested.bind(this);
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
            shadowRoot.getElementById('askus-proactive-chat').classList.add('show');
        };
        const showProactiveChatWrapper = () => {
            shadowRoot.getElementById('askus-proactive-chat-wrapper').removeAttribute('style');
        };
        const api = new ApiAccess();
        await api.loadChatStatus().then((isOnline) => {
            if (!!isOnline) {
                // Chat status
                // !isProactiveChatHidden && shadowRoot.getElementById('askus-chat-online').removeAttribute('style');
                // Show the proactive chat if we're not in primo & they havent asked for it to be hidden
                if (
                    !isProactiveChatHidden &&
                    !isPrimoPage(window.location.hostname) &&
                    cookieNotFound(PROACTIVE_CHAT_HIDDEN_COOKIE_NAME, PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE)
                ) {
                    setTimeout(showProactiveChatWrapper, secondsTilProactiveChatAppears * 1000 - 1000);
                    setTimeout(showProactiveChat, secondsTilProactiveChatAppears * 1000);
                }
            } else {
                // Chat disabled
                shadowRoot.getElementById('askus-chat-li').style.opacity = '0.6';
                shadowRoot.getElementById('askus-chat-link').removeAttribute('onclick');

                shadowRoot.getElementById('askus-phone-li').style.opacity = '0.6';
                shadowRoot.getElementById('askus-phone-link').removeAttribute('href');

                // Chat status
                !isProactiveChatHidden && shadowRoot.getElementById('askus-chat-offline').removeAttribute('style');
            }
        });

        // await api.loadOpeningHours().then((hours) => {
        //     // display opening hours in the askus widget
        //     const chatitem = shadowRoot.getElementById('askus-chat-time');
        //     !!hours && !!hours.chat && !!chatitem && (chatitem.innerHTML = hours.chat);

        //     const phoneitem = shadowRoot.getElementById('askus-phone-time');
        //     !!hours && !!hours.phone && !!phoneitem && (phoneitem.innerText = hours.phone);
        // });
    }

    addButtonListeners(shadowDOM, isOnline) {
        let askUsClosed = true;
        // function openAskusMenu() {
        //     askUsClosed = false;
        //     const askusMenu = shadowDOM.getElementById('askus-menu');
        //     !!askusMenu && (askusMenu.style.display = 'block');
        //     const askusPane = shadowDOM.getElementById('askus-pane');
        //     !!askusPane && (askusPane.style.display = 'block');

        //     function showDisplay() {
        //         !!askusMenu && askusMenu.classList.remove('closed-menu');
        //         !!askusPane && askusPane.classList.remove('closed-pane');
        //     }

        //     setTimeout(showDisplay, 100);
        //     document.onkeydown = function (e) {
        //         const evt = e || /* istanbul ignore next */ window.event;
        //         if (isEscapeKeyPressed(evt) && askUsClosed === false) {
        //             closeAskusMenu();
        //         }
        //     };
        // }

        // function closeAskusMenu() {
        //     askUsClosed = true;
        //     const askusMenu = shadowDOM.getElementById('askus-menu');
        //     const askusPane = shadowDOM.getElementById('askus-pane');

        //     !!askusMenu && askusMenu.classList.add('closed-menu');
        //     !!askusPane && askusPane.classList.add('closed-pane');

        //     function hideDisplay() {
        //         !!askusMenu && (askusMenu.style.display = 'none');
        //         !!askusPane && (askusPane.style.display = 'none');
        //     }

        //     setTimeout(hideDisplay, 500);
        // }

        // function handleAskUsButton() {
        //     const askusPane = shadowDOM.getElementById('askus-pane');
        //     !!askusPane && askusPane.addEventListener('click', handleMouseOut);
        //     openAskusMenu();
        // }

        // function handleMouseOut() {
        //     const askusPane = shadowDOM.getElementById('askus-pane');

        //     askUsClosed = !askUsClosed;
        //     !!askusPane && askusPane.removeEventListener('mouseleave', handleMouseOut);
        //     closeAskusMenu();
        // }

        // Attach a listener to the askus button
        // const askusButton = shadowDOM.getElementById('askus-button');
        // !!askusButton && askusButton.addEventListener('click', handleAskUsButton);

        // Chat status
        function openChat() {
            window.open(
                'https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45',
                'chat',
                'toolbar=no, location=no, status=no, width=400, height=400',
            );
        }

        // function navigateToContactUs() {
        //     window.open('https://support.my.uq.edu.au/app/library/contact', '_blank');
        // }

        // Chat status listeners
        // shadowDOM.getElementById('askus-chat-online').addEventListener('click', openChat);
        // shadowDOM.getElementById('askus-chat-offline').addEventListener('click', navigateToContactUs);

        // Proactive chat
        function hideProactiveChatWrapper() {
            const pcWrapper = shadowDOM.getElementById('askus-proactive-chat-wrapper');
            !!pcWrapper && pcWrapper.remove();
        }
        function closeProactiveChat() {
            shadowDOM.getElementById('askus-proactive-chat').classList.remove('show');
            setTimeout(hideProactiveChatWrapper, 1000);
            //set cookie for 24 hours
            const date = new Date();
            date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
            setCookie(PROACTIVE_CHAT_HIDDEN_COOKIE_NAME, PROACTIVE_CHAT_HIDDEN_COOKIE_VALUE, date);
        }
        shadowDOM.getElementById('askus-proactive-chat-button-close').addEventListener('click', closeProactiveChat);
        shadowDOM.getElementById('askus-proactive-chat-button-open').addEventListener('click', openChat);
        // in practice, cypress can't test the tab key :(
        /* istanbul ignore next */
        // shadowDOM.getElementById('askus-faq-li').addEventListener('keydown', function (e) {
        //     if (isBackTabKeyPressed(e)) {
        //         closeAskusMenu();
        //     }
        // });
        /* istanbul ignore next */
        // shadowDOM.getElementById('askus-menu-item-moreways').addEventListener('keydown', function (e) {
        //     if (isTabKeyPressed(e)) {
        //         closeAskusMenu();
        //     }
        // });
    }

    // isPaneButtonOpacityDropRequested() {
    //     // primo only provides the attributes in lower case :(
    //     const noPaneOpacity = this.getAttribute('nopaneopacity');
    //     return !!noPaneOpacity || noPaneOpacity === '';
    // }
}

export default ProactiveChat;

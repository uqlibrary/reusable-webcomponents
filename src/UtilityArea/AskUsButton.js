import askus from './css/askus.css';
import ApiAccess from '../ApiAccess/ApiAccess';
import { isBackTabKeyPressed, isEscapeKeyPressed, isTabKeyPressed } from '../helpers/keyDetection';

/**
 * API
 * <span slot="site-utilities">             -- tells uqsiteheader where to insert it in the dom
 *  <askus-button
 *      nopaneopacity                       -- primo: don't put a background on it
 *      hideProactiveChat                   -- libwizard, double ensure proactive chat doesnt appear!
 *  />
 * </span>
 *
 */

const template = document.createElement('template');
template.innerHTML = `
    <style>${askus.toString()}</style>
    <div id="askus">
        <!-- Button -->
        <button id="askus-button" data-analyticsid="askus-button" aria-label="AskUs contact options" part="button" title="AskUs contact options">
            <svg id="askus-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
            </svg>
            <div id="askus-label" part="label">AskUs</div>
        </button>
        <!-- Menu -->
        <div id="askus-menu" data-testid="askus-menu" data-analyticsid="askus-menu" class="closed-menu" style="display: none">
            <div style="text-align: center; padding-top: 0.5em; color: #595959; font-size: 0.9em;">All links open in a new window</div>
            <ul class="askus-menu-list" role="menu" >
                <!-- FAQ -->
                <li id="askus-faq-li" class="general" role="menuitem" aria-disabled="false">
                    <a tabindex="0" href="https://support.my.uq.edu.au/app/library/faqs" rel="noreferrer" data-analyticsid="askus-menu-faq" target="_blank">
                        <svg class="askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.41.21.75-.19.75-.45V6c-1.49-1.12-3.63-1.5-5.5-1.5zm3.5 14c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path></svg>
                        <span>FAQ</span>
                    </a>
                </li>
                <!-- Chat -->
                <li id="askus-chat-li" role="menuitem" aria-disabled="false">
                    <a tabindex="0" id="askus-chat-link" data-testid="askus-chat-link" data-analyticsid="askus-menu-chat" onclick="javascript: window.open('https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45', 'chat', 'toolbar=no, location=no, status=no, width=400, height=400');">
                        <svg class="interactiveContact MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path></svg>
                        <span class="interactiveContact">Chat</span>
                        <span class="chatTimes" data-testid="askus-chat-time"><span id="askus-chat-time"></span></span>
                    </a>
                </li>
                
                <!-- Email -->
                <li role="menuitem" class="general askus-email" aria-disabled="false">
                    <a tabindex="0" href="mailto:askus@library.uq.edu.au" data-analyticsid="askus-menu-email" target="_blank">
                        <svg class="askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
                        <span>Email</span>
                    </a>
                </li>
                
                <!-- Contact form -->
                <li role="menuitem" class="general" aria-disabled="false">
                    <a tabindex="0" href="https://support.my.uq.edu.au/app/library/contact" rel="noreferrer" data-analyticsid="askus-menu-contactform" target="_blank">
                        <svg class="askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></svg>
                        <span>Contact form</span>
                    </a>
                </li>
                
                <!-- CRM Chat -->
                <li id="askus-chat-li" class="general  askus-chat" role="menuitem" aria-disabled="false">
                    <span class="chatClosedTimes" tabindex="0" id="askus-chat-closed" data-testid="askus-chat-link" data-analyticsid="askus-menu-chat" onclick="javascript: window.open('https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45', 'chat', 'toolbar=no, location=no, status=no, width=400, height=400');">
                        <svg class="serviceWithHoursClosed askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path></svg>
                        <span class="serviceWithHours">Chat with staff</span>
                        <span class="closedLabel" style="display: none"><span id="askus-chat-closed-text" data-testid="askus-chat-closed">Closed</span></span>
                    </span>
                    <a class="chatOpenTimes" style="display: none" tabindex="0" id="askus-chat-link" data-testid="askus-chat-link" data-analyticsid="askus-menu-chat" onclick="javascript: window.open('https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45', 'chat', 'toolbar=no, location=no, status=no, width=400, height=400');">
                        <svg class="serviceWithHours askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path></svg>
                        <span class="serviceWithHours">Chat with staff</span>
                        <span class="chatTimes"><span id="askus-chat-time" data-testid="askus-chat-time"></span></span>
                    </a>
                </li>
                
                <!-- AIBot Chat -->
                <!-- IF PAGE HAS A PROACTIVE CHAT!!!!!! -->
                <li id="askus-aibot-li" data-testid="askus-aibot-li" class="askus-aibot" role="menuitem" style="display: none" aria-disabled="false">
                    <a tabindex="0" id="askus-aibot-button" data-testid="askus-aibot-button" data-analyticsid="askus-menu-aibot">
                        <svg viewBox="0 0 194 194" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_389_61)">
                                <circle cx="97" cy="97" r="97" fill="#51247A"></circle>
                                <path d="M144.411 137.906H93.353L64.1772 159.788V137.906H49.5894C48.6315 137.906 47.683 137.717 46.7981 137.351C45.9131 136.984 45.1091 136.447 44.4318 135.77C43.7545 135.092 43.2172 134.288 42.8506 133.403C42.4841 132.518 42.2954 131.57 42.2954 130.612V57.6726C42.2954 55.7381 43.0639 53.8829 44.4318 52.515C45.7996 51.1471 47.6549 50.3787 49.5894 50.3787H144.411C145.369 50.3787 146.317 50.5673 147.202 50.9339C148.087 51.3004 148.891 51.8377 149.568 52.515C150.246 53.1923 150.783 53.9964 151.149 54.8813C151.516 55.7663 151.705 56.7148 151.705 57.6726V130.612C151.705 131.57 151.516 132.518 151.149 133.403C150.783 134.288 150.246 135.092 149.568 135.77C148.891 136.447 148.087 136.984 147.202 137.351C146.317 137.717 145.369 137.906 144.411 137.906Z" stroke="white" stroke-width="6.0625" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M78.7749 108.73C83.9224 113.423 90.6372 116.025 97.603 116.025C104.569 116.025 111.284 113.423 116.431 108.73" stroke="white" stroke-width="6.0625" stroke-linecap="round" stroke-linejoin="round"></path>
                                <circle cx="76.7918" cy="80.8333" r="8.08333" fill="white"></circle>
                                <circle cx="117.208" cy="80.8333" r="8.08333" fill="white"></circle>
                            </g>
                            <defs>
                                <clipPath id="clip0_389_61">
                                    <rect width="194" height="194" fill="white"></rect>
                                </clipPath>
                            </defs>
                        </svg>                 
                        <span>Chatbot</span>
<!--                        <span class="aibotTimes"><span id="askus-aibot-time" data-testid="askus-aibot-time"></span></span>-->
                    </a>
                </li>

                <!-- Phone -->
                <li id="askus-phone-li" class="general askus-phone" role="menuitem" aria-disabled="false">
                    <span class="chatClosedTimes" id="askus-phone-closed" data-testid="askus-menu-phone" data-analyticsid="askus-menu-phone">
                        <svg class="serviceWithHoursClosed askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>
                        <span class="serviceWithHours">Phone</span>
                        <span class="closedLabel" style="display: none"><span id="askus-phone-closed-text" data-testid="askus-phone-closed">Closed</span></span>
                    </span>
                    <a class="chatOpenTimes" style="display: none" tabindex="0" id="askus-phone-link" href="https://web.library.uq.edu.au/contact-us" rel="noreferrer" data-testid="askus-menu-phone" data-analyticsid="askus-menu-phone" target="_blank">
                        <svg class="serviceWithHours askusListItem MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>
                        <span class="serviceWithHours">Phone</span>
                        <span class="chatTimes"><span id="askus-phone-time" data-testid="askus-phone-time"></span></span>
                    </a>
                </li>
            </ul>
            <!-- More ways -->
            <p id="askus-contact-moreways" class="moreWays">
                <a tabindex="0" href="https://web.library.uq.edu.au/contact-us" rel="noreferrer" data-analyticsid="askus-menu-moreways" target="_blank">
                    <span>More ways to contact us</span>
                </a>
            </p>
            
        </div>
    </div>
    <!-- Screen wrapper -->
    <div id="askus-pane" data-testid="askus-pane" aria-hidden="true" class=closed-pane style="display: none" />
`;

class AskUsButton extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        if (this.isPaneButtonOpacityDropRequested()) {
            // primo needs the opacity on the background turned off because it interacts weirdly with the Primo styles
            // add a class to the pane, and turn off the background colour on that class
            const pane = template.content.getElementById('askus-pane');
            !!pane && pane.classList.add('noOpacity');
        }

        // // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));
        this.updateAskusDOM(shadowDOM);
        this.addButtonListeners(shadowDOM);

        // Bindings
        this.updateAskusDOM = this.updateAskusDOM.bind(this);
        this.addButtonListeners = this.addButtonListeners.bind(this);
        this.isPaneButtonOpacityDropRequested = this.isPaneButtonOpacityDropRequested.bind(this);
        this.isProactiveChatElementHidden = this.isProactiveChatElementHidden.bind(this);
    }

    async updateAskusDOM(shadowRoot) {
        // if proactive chat doesnt exist on the current page, dont provide a chatbot link
        const stopCheckingAfter = 20;
        let loopNumber = 0;
        const watchForProactiveChat = setInterval(() => {
            if (this.isProactiveChatElementHidden()) {
                clearInterval(watchForProactiveChat);
            } else {
                const proactiveChatElement = document.getElementsByTagName('proactive-chat');
                if (!!proactiveChatElement) {
                    const aibotLink = shadowRoot.getElementById('askus-aibot-li');
                    !!aibotLink && (aibotLink.style.display = 'list-item');

                    clearInterval(watchForProactiveChat);
                }
                if (loopNumber > stopCheckingAfter) {
                    // give up after a while
                    clearInterval(watchForProactiveChat);
                }
            }
            loopNumber++;
        }, 100);

        const api = new ApiAccess();
        await api.loadChatStatus().then((isOnline) => {
            if (!!isOnline) {
                // hide .chatClosedTimes
                const chatClosedTimes = shadowRoot.querySelectorAll('.chatClosedTimes');
                !!chatClosedTimes &&
                    chatClosedTimes.forEach((c) => {
                        c.style.display = 'none';
                        const wrappingListItemParent = !!c && c.parentElement;
                        !!wrappingListItemParent &&
                            !!wrappingListItemParent.classList.contains('closed') &&
                            wrappingListItemParent.classList.remove('closed');
                    });

                // remove display none from .chatOpenTimes
                const chatOpenTimes = shadowRoot.querySelectorAll('.chatOpenTimes');
                !!chatOpenTimes && chatOpenTimes.forEach((s) => (s.style.display = ''));

                // adding times to .chatOpenTimes is done from loadOpeningHours
            } else {
                // Chat is closed for the day

                // remove display none from 'closed' div
                const closedLabels = shadowRoot.querySelectorAll('.closedLabel');
                !!closedLabels &&
                    closedLabels.forEach((s) => {
                        s.style.display = '';
                        const wrappingListItemParent = !!s && s.parentElement?.parentElement;
                        !!wrappingListItemParent &&
                            !wrappingListItemParent.classList.contains('closed') &&
                            wrappingListItemParent.classList.add('closed');
                    });

                // make icons red
                const icons = shadowRoot.querySelectorAll('svg.serviceWithHoursClosed');
                !!icons && icons.forEach((l) => (l.style.fill = '#c40000'));
            }
        });

        await api.loadOpeningHours().then((hours) => {
            // display opening hours in the askus widget
            const chatitem = shadowRoot.getElementById('askus-chat-time');
            !!hours && !!hours.chat && !!chatitem && (chatitem.innerHTML = `${hours.chat} today`);

            const phoneitem = shadowRoot.getElementById('askus-phone-time');
            !!hours && !!hours.phone && !!phoneitem && (phoneitem.innerText = `${hours.phone} today`);
        });
    }

    addButtonListeners(shadowDOM, isOnline) {
        let askUsClosed = true;
        function openAskusMenu() {
            askUsClosed = false;
            const askusMenu = shadowDOM.getElementById('askus-menu');
            !!askusMenu && (askusMenu.style.display = 'block');
            const askusPane = shadowDOM.getElementById('askus-pane');
            !!askusPane && (askusPane.style.display = 'block');

            function showDisplay() {
                !!askusMenu && askusMenu.classList.remove('closed-menu');
                !!askusPane && askusPane.classList.remove('closed-pane');
            }

            setTimeout(showDisplay, 100);
            document.onkeydown = function (e) {
                const evt = e || /* istanbul ignore next */ window.event;
                if (isEscapeKeyPressed(evt) && askUsClosed === false) {
                    closeAskusMenu();
                }
            };
        }

        function closeAskusMenu() {
            askUsClosed = true;
            const askusMenu = shadowDOM.getElementById('askus-menu');
            const askusPane = shadowDOM.getElementById('askus-pane');

            !!askusMenu && askusMenu.classList.add('closed-menu');
            !!askusPane && askusPane.classList.add('closed-pane');

            function hideDisplay() {
                !!askusMenu && (askusMenu.style.display = 'none');
                !!askusPane && (askusPane.style.display = 'none');
            }

            setTimeout(hideDisplay, 500);
        }

        function handleAskUsButton() {
            const askusPane = shadowDOM.getElementById('askus-pane');
            !!askusPane && askusPane.addEventListener('click', handleMouseOut);
            openAskusMenu();
        }

        function handleMouseOut() {
            const askusPane = shadowDOM.getElementById('askus-pane');

            askUsClosed = !askUsClosed;
            !!askusPane && askusPane.removeEventListener('mouseleave', handleMouseOut);
            closeAskusMenu();
        }

        // Attach a listener to the askus button
        const askusButton = shadowDOM.getElementById('askus-button');
        !!askusButton && askusButton.addEventListener('click', handleAskUsButton);

        function openProactiveChatBotIframe() {
            const proactiveChatElement = document.getElementsByTagName('proactive-chat');
            !!proactiveChatElement &&
                proactiveChatElement.length > 0 &&
                proactiveChatElement[0].setAttribute('showchatbot', 'true');

            closeAskusMenu();
        }

        // Attach a listener to the chatbot button
        const chatbotButton = shadowDOM.getElementById('askus-aibot-button');
        !!chatbotButton && chatbotButton.addEventListener('click', openProactiveChatBotIframe);

        // Chat status
        function openChat() {
            window.open(
                'https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45',
                'chat',
                'toolbar=no, location=no, status=no, width=400, height=400',
            );
        }
        /* istanbul ignore next */
        shadowDOM.getElementById('askus-faq-li').addEventListener('keydown', function (e) {
            if (isBackTabKeyPressed(e)) {
                closeAskusMenu();
            }
        });
        /* istanbul ignore next */
        shadowDOM.getElementById('askus-contact-moreways').addEventListener('keydown', function (e) {
            if (isTabKeyPressed(e)) {
                closeAskusMenu();
            }
        });
    }

    isPaneButtonOpacityDropRequested() {
        // primo only provides the attributes in lower case :(
        const noPaneOpacity = this.getAttribute('nopaneopacity');
        return !!noPaneOpacity || noPaneOpacity === '';
    }

    isProactiveChatElementHidden() {
        const hideProactiveChat = this.getAttribute('hideproactivechat');
        return !!hideProactiveChat || hideProactiveChat === '';
    }
}

export default AskUsButton;

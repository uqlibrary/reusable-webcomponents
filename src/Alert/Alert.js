import styles from './css/main.css';
import overrides from './css/overrides.css';
import { cookieNotFound, getCookieValue, setCookie } from '../helpers/cookie';
import { sendClickToGTM } from '../helpers/gtmHelpers';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles.toString()}</style>
  <style>${overrides.toString()}</style>
  <div id="alert" class="alert alert--default" role="alert" data-id="">
        <div id="alert-container" class="alert__container">
            <div id="alert-icon" data-testid="alert-icon" class="alert-icon"></div>
            <div class="alert__message">
                <b id="alert-title" data-testid="alert-title" class="alert-title"></b>
                <span id="alert-message" data-testid="alert-message"></span>
            </div>
            <a id="alert-action-desktop" data-testid="alert-action-desktop" tabindex="0" data-analyticsid="alert-visit-link-desktop">Button label</a>
        </div>
        <div role="button" id="alert-action-mobile" data-testid="alert-action-mobile" title="button title" tabindex="0" data-analyticsid="alert-visit-link-mobile">Button label</div>
        <a id="alert-close" data-analyticsid="alert-close" data-testid="alert-close" role="button" aria-label="Dismiss this alert for 24 hours" href="javascript:void(0)" class="alert__close">
            <svg focusable="false" viewBox="0 0 24 24" aria-label="Dismiss this alert for 24 hours" ><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
        </a>
    </div>
`;

let initCalled;

class Alert extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });
        this.loadAlert(shadowDOM);

        // Bindings
        this.loadAlert = this.loadAlert.bind(this);
        this.addListeners = this.addListeners.bind(this);
    }

    loadAlert(shadowDOM) {
        const loadAlertFields = setInterval(() => {
            const id = this.getAttribute('id');
            /* istanbul ignore if  */
            if (!id) {
                return;
            }
            clearInterval(loadAlertFields);

            const priorityTypeDefault = 'info';
            let priorityType = this.getAttribute('prioritytype');
            // temporarily account for old values for maximum compatibility
            if (priorityType == '0') {
                priorityType = 'info';
            } else if (priorityType == '1') {
                priorityType = 'urgent';
            } else {
                // this check should remain
                priorityType = ['info', 'urgent', 'extreme'].includes(priorityType)
                    ? priorityType
                    : priorityTypeDefault;
            }
            const message = this.getAttribute('alertmessage');
            const title = this.getAttribute('alerttitle');

            const ariaLabels = {
                info: 'Alert.',
                urgent: 'Important alert.',
                extreme: 'Very important alert.',
            };

            // Get links or 'permanent' from the message and return a clean message
            let canclose = true;
            let linkLabel = null;
            let linkUrl = null;
            const linkRegex = !!message && message.match(/\[([^\]]+)\]\(([^)]+)\)/);
            let cleanMessage = !!message && message;

            if (!!linkRegex && linkRegex.length === 3) {
                cleanMessage = !!cleanMessage && cleanMessage.replace(linkRegex[0], '').replace('  ', ' ');
                linkUrl = linkRegex[2];
                linkLabel = linkRegex[1];
            }

            if (!!message && message.indexOf('[permanent]') > 0) {
                cleanMessage = cleanMessage.replace('[permanent]', '');
                canclose = false;
            }
            cleanMessage = !!cleanMessage && cleanMessage.length > 0 ? cleanMessage.trim() : cleanMessage;

            // Render the template
            shadowDOM.appendChild(template.content.cloneNode(true));

            // Assign the values
            shadowDOM.getElementById('alert-title').innerText =
                !!title && title.length > 0 ? title.trim() : 'No title supplied';
            shadowDOM.getElementById('alert-message').innerText = cleanMessage || 'No message supplied';
            shadowDOM.getElementById('alert').classList.add(priorityType);
            shadowDOM.getElementById('alert').setAttribute('data-testid', 'alert-' + id);
            shadowDOM.getElementById('alert').setAttribute('aria-label', ariaLabels[priorityType]);

            // Show or hide the close button and assign the function to do so
            if (!!canclose) {
                const closeAlert = () => {
                    shadowDOM.getElementById('alert').style.display = 'none';
                    const alertHiddenCookieID = 'UQ_ALERT_' + id;
                    const alertCookieHidddenValue = 'hidden';

                    function alertNotHidden(cookieId, cookieValue) {
                        return cookieNotFound(cookieId, cookieValue);
                    }

                    /* istanbul ignore else  */
                    if (alertNotHidden(alertHiddenCookieID, alertCookieHidddenValue)) {
                        //set cookie for 24 hours
                        const date = new Date();
                        date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
                        setCookie(alertHiddenCookieID, alertCookieHidddenValue, date);
                    }
                };
                let alertClose = shadowDOM.getElementById('alert-close');
                !!alertClose && alertClose.addEventListener('click', closeAlert);
            } else {
                let alertClose = shadowDOM.getElementById('alert-close');
                !!alertClose && alertClose.remove();
            }

            // Show or hide the action button and attach the function to do so
            if (!!linkLabel && !!linkUrl) {
                const navigateToUrl = () => {
                    window.location.href = linkUrl;
                };
                shadowDOM.getElementById('alert-action-desktop').innerText = linkLabel;
                shadowDOM.getElementById('alert-action-desktop').setAttribute('href', linkUrl);

                shadowDOM.getElementById('alert-action-mobile').setAttribute('title', linkLabel);
                shadowDOM.getElementById('alert-action-mobile').innerText = linkLabel;
                shadowDOM.getElementById('alert-action-mobile').addEventListener('click', navigateToUrl);
            } else {
                shadowDOM.getElementById('alert-action-desktop').remove();
                shadowDOM.getElementById('alert-action-mobile').remove();
            }
        }, 300);
    }
    addListeners(shadowDOM) {
        const links = shadowDOM.querySelectorAll('a');
        !!links && links.length > 0 && links.forEach((l) => l.addEventListener('click', (e) => sendClickToGTM(e)));
    }
}

export default Alert;

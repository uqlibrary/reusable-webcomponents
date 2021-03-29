import styles from './css/main.css';
import icons from './css/icons.css';
import overrides from './css/overrides.css';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles.toString()}</style>
  <style>${icons.toString()}</style>
  <style>${overrides.toString()}</style>
  <div id="alert" class="alert alert--default" role="alert" data-id="">
        <div id="alert-container" class="alert__container">
            <div id="alert-icon"></div>
            <div class="alert__message">
                <b id="alert-title"></b> - <span id="alert-message"></span>
            </div>
            <div role="button" id="alert-action-desktop" title="button title" tabindex="0">Button label</div>
        </div>
        <div role="button" id="alert-action-mobile" title="button title" tabindex="0">Button label</div>
        <a id="alert-close" role="button" title="Close this alert" href="javascript:void(0)" class="alert__close">&times;</a>
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
        this.loadJS = this.loadJS.bind(this);
    }

    loadAlert(shadowDOM) {
        const icons = {
            0: '<svg viewBox="0 0 24 24" aria-hidden="false" id="info-outline-icon" aria-label="Alert."><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>',
            1: '<svg viewBox="0 0 24 24" aria-hidden="false" id="warning-icon" aria-label="Important alert."><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>',
        };

        const loadAlertFields = setInterval(() => {
            const title = this.getAttribute('alerttitle');
            const message = this.getAttribute('alertmessage');
            const alerttype = this.getAttribute('alerttype');
            const id = this.getAttribute('id');

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

            // Render the template
            shadowDOM.appendChild(template.content.cloneNode(true));

            // Assign the values
            shadowDOM.getElementById('alert-title').innerText = title || 'No title supplied';
            shadowDOM.getElementById('alert-message').innerText = cleanMessage || 'No message supplied';
            shadowDOM.getElementById('alert-icon').innerHTML = icons[alerttype];
            shadowDOM.getElementById('alert').classList.add(alerttype === '0' ? 'info' : 'warning');
            shadowDOM.getElementById('alert').setAttribute('data-testid', 'alert-' + id);

            // Show or hide the close button and assign the function to do so
            if (!!canclose) {
                const closeAlert = () => {
                    shadowDOM.getElementById('alert').style.display = 'none';
                };
                shadowDOM.getElementById('alert-close').addEventListener('click', closeAlert);
            } else {
                shadowDOM.getElementById('alert-close').remove();
            }

            // Show or hide the action button and attach the function to do so
            if (!!linkLabel && !!linkUrl) {
                const navigateToUrl = () => {
                    window.location.href = linkUrl;
                };

                shadowDOM.getElementById('alert-container').classList.add('clickable');
                shadowDOM.getElementById('alert-container').addEventListener('click', navigateToUrl);
                shadowDOM
                    .getElementById('alert-container')
                    .setAttribute('data-testid', 'alert-' + id + '-message-button');

                shadowDOM.getElementById('alert-action-desktop').setAttribute('title', linkLabel);
                shadowDOM.getElementById('alert-action-desktop').innerText = linkLabel;
                shadowDOM.getElementById('alert-action-desktop').addEventListener('click', navigateToUrl);
                shadowDOM
                    .getElementById('alert-action-desktop')
                    .setAttribute('data-testid', 'alert-' + id + '-action-button');

                shadowDOM.getElementById('alert-action-mobile').setAttribute('title', linkLabel);
                shadowDOM.getElementById('alert-action-mobile').innerText = linkLabel;
                shadowDOM.getElementById('alert-action-mobile').addEventListener('click', navigateToUrl);
                shadowDOM
                    .getElementById('alert-action-mobile')
                    .setAttribute('data-testid', 'alert-' + id + '-action-button');
            } else {
                shadowDOM.getElementById('alert-action-desktop').remove();
                shadowDOM.getElementById('alert-action-mobile').remove();
            }

            if (!!title) {
                clearInterval(loadAlertFields);
            }
        }, 300);
    }

    loadJS() {
        // This loads the external JS file into the HTML head dynamically
        //Only load js if it has not been loaded before (tracked by the initCalled flag)
        if (!initCalled) {
            //Dynamically import the JS file and append it to the document header
        }
    }

    connectedCallback() {
        this.loadJS();
    }
}

export default Alert;

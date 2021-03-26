import styles from './css/overrides.css';
import ApiAccess from '../ApiAccess/ApiAccess';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <div role="region" aria-label="UQ Library Alerts" data-testid="alert-wrapper" id="alert-wrapper">
    </div>
`;

let initCalled;

class Alerts extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));
        this.updateAlertListDom(shadowDOM);

        // Bindings
        this.loadJS = this.loadJS.bind(this);
    }

    async updateAlertListDom(shadowRoot) {
        await new ApiAccess().loadAlerts().then((alerts) => {
            const alertParent = document.querySelector('alert-list');
            const shadowDOM = (!!alertParent && alertParent.shadowRoot) || false;
            const alertWrapper = !!shadowDOM && shadowDOM.getElementById('alert-wrapper');
            if (!!alertWrapper && !!alerts && alerts.length > 0) {
                // loop through alerts
                alerts.forEach((alertData) => {
                    const alert = document.createElement('alert');
                    if (!!alert) {
                        !!alertData.id && alert.setAttribute('id', alertData.id);
                        // may want to do more parsing of body here?
                        !!alertData.body && alert.setAttribute('body', alertData.body);
                        !!alertData.title && alert.setAttribute('title', alertData.title);
                        !!alertData.urgent && alert.setAttribute('urgent', alertData.urgent);
                    }
                    alertWrapper.appendChild(alert);
                });
            }
        });
    }

    loadJS(hideAskUs, hideMyLibrary) {
        // This loads the external JS file into the HTML head dynamically
        //Only load js if it has not been loaded before (tracked by the initCalled flag)
        if (!initCalled) {
            //Dynamically import the JS file and append it to the document header
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function () {
                //Code to execute after the library has been downloaded parsed and processed by the browser starts here :)
                initCalled = true;
            };

            //Specify the location of the ITS DS JS file
            script.src = 'alert-list.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    }

    connectedCallback() {
        this.loadJS();
    }
}

export default Alerts;

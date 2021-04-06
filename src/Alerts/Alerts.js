import styles from './css/overrides.css';
import ApiAccess from '../ApiAccess/ApiAccess';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <div role="region" aria-label="UQ Library Alerts" data-testid="alerts">
        <div style="width: 100%" data-testid="alerts-wrapper" id="alerts-wrapper">
        </div>
    </div>
`;

let initCalled;

class Alerts extends HTMLElement {
    constructor() {
        super();

        const alertsDismissed = document.cookie.indexOf("UQL-Hide-Alerts=1") >= 0;
        if (!!alertsDismissed) {
            return;
        }

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
            const alertWrapper = !!shadowDOM && shadowDOM.getElementById('alerts-wrapper');
            if (!!alertWrapper && !!alerts && alerts.length > 0) {
                // loop through alerts
                alerts.forEach((alertData) => {
                    const alert = document.createElement('uq-alert');

                    // if the alert-list is inserted twice, all the elements will be inserted in the first instance. Weird.
                    // so go into the shadow dom of the first instance and look to see if the id exists
                    const alertList = document.querySelector('alert-list');
                    const shadowDOM = (!!alertList && alertList.shadowRoot) || false;
                    const alertExists = !!shadowDOM && !!alertData && shadowDOM.querySelector(`#alert-${alertData.id}`);
                    if (!!alert && !alertExists) {
                        !!alertData.id && alert.setAttribute('id', `alert-${alertData.id}`);
                        !!alertData.body && alert.setAttribute('alertmessage', alertData.body);
                        !!alertData.title && alert.setAttribute('alerttitle', alertData.title);
                        const alertIconIndex = !!alertData.urgent && alertData.urgent === 1 ? '1' : '0';
                        alert.setAttribute('alerttype', alertIconIndex);
                        alertWrapper.appendChild(alert);
                    }
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

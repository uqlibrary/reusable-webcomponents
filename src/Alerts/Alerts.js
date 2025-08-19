import styles from './css/overrides.css';
import ApiAccess from '../ApiAccess/ApiAccess';
import UserAccount from '../ApiAccess/UserAccount';
import { apiLocale } from '../ApiAccess/ApiAccess.locale';
import { authLocale } from '../UtilityArea/auth.locale';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <div role="region" aria-label="UQ Library Alerts">
        <div style="width: 100%" data-testid="alerts-wrapper" id="alerts-wrapper">
        </div>
    </div>
`;

class Alerts extends HTMLElement {
    constructor() {
        super();

        this.system = this.getAttribute('system');
    }

    static get observedAttributes() {
        return ['system'];
    }

    connectedCallback() {
        // because the system attribute is sometimes set via javascript, not inline on an element, we have to give
        // a short delay to allow that next line of js to be reached
        const shortDelayForAttributes = setInterval(() => {
            clearInterval(shortDelayForAttributes);

            const shadowDOM = this.attachShadow({ mode: 'open' });

            shadowDOM.appendChild(template.content.cloneNode(true));
            this.updateAlertListDom(shadowDOM, this.system);
        }, 50);
    }

    attributeChangedCallback(fieldName, oldValue, newValue) {
        if (fieldName === 'system') {
            this.system = newValue;
        } else {
            console.log(`unhandled attribute ${fieldName} received for Alerts`);
        }
    }

    async updateAlertListDom(shadowRoot, system) {
        const alertParent = document.querySelector('alert-list');
        const shadowDOM = !!alertParent && alertParent.shadowRoot;
        const alertWrapper = !!shadowDOM && shadowDOM.getElementById('alerts-wrapper');
        await new ApiAccess()
            .loadAlerts(system)
            .then((alerts) => {
                /* istanbul ignore else  */
                if (!!alertWrapper && !!alerts && alerts.length > 0) {
                    // loop through alerts
                    alerts.forEach((alertData) => {
                        const alert = document.createElement('uq-alert');

                        // if the alert-list is inserted twice, all the elements will be inserted in the first instance. Weird.
                        // so go into the shadow dom of the first instance and look to see if the id exists
                        const alertList = document.querySelector('alert-list');
                        const shadowDOM = !!alertList && alertList.shadowRoot;
                        const alertExists =
                            !!shadowDOM && !!alertData && shadowDOM.querySelector(`#alert-${alertData.id}`);
                        /* istanbul ignore else  */
                        if (!!alert && !alertExists) {
                            !!alertData.id && alert.setAttribute('id', `alert-${alertData.id}`);
                            !!alertData.body && alert.setAttribute('alertmessage', alertData.body);
                            !!alertData.title && alert.setAttribute('alerttitle', alertData.title);
                            const alertIconIndex = (!!alertData && alertData.priority_type) || 'info';
                            alert.setAttribute('prioritytype', alertIconIndex);
                            if (document.cookie.indexOf('UQ_ALERT_' + alert.id + '=hidden') <= -1) {
                                alertWrapper.appendChild(alert);
                            }
                        }
                    });
                }
            })
            .then(() => {
                new UserAccount().get().then((accountData) => {
                    if (
                        !!accountData &&
                        accountData?.hasOwnProperty('status') &&
                        accountData?.status === apiLocale.USER_LOGGED_IN &&
                        accountData?.account?.hasOwnProperty('masqueradingId') &&
                        accountData?.account?.masqueradingId !== accountData?.account?.id
                    ) {
                        const currentPageLink = window.location.href;
                        const endMasqueradeLink = `${authLocale.AUTH_URL_LOGOUT}${window.btoa(currentPageLink)}`;

                        // they are masquerading
                        const alert = document.createElement('uq-alert');
                        alert.setAttribute('id', `masquerade-notice`);
                        alert.setAttribute('alerttitle', 'Masquerade in place:');
                        alert.setAttribute('prioritytype', 'urgent');

                        const displayMessage = `${accountData.account.masqueradingId} masquerading as ${accountData.account.name} (${accountData.account.id})`;
                        const undismissable = ` [permanent]`;
                        const endMasqueradeButtonLabel = 'End masquerade';
                        const endMasqueradeControl =
                            ' [' + endMasqueradeButtonLabel + ']' + '(' + endMasqueradeLink + ')';
                        alert.setAttribute('alertmessage', displayMessage + endMasqueradeControl + undismissable);

                        alertWrapper.prepend(alert);
                    }
                });
            });
    }
}

export default Alerts;

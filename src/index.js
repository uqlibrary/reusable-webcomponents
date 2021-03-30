import Alerts from './Alerts/Alerts';
import ApiAccess from './ApiAccess/ApiAccess.js';
import AskUsButton from './UtilityArea/AskUsButton.js';
import AuthButton from './UtilityArea/AuthButton.js';
import MyLibraryButton from './UtilityArea/MyLibraryButton.js';
import ConnectFooter from './ConnectFooter/ConnectFooter.js';
import UQHeader from './UQHeader/UQHeader.js';
import UQSiteHeader from './UQSiteHeader/UQSiteHeader.js';
import UQFooter from './UQFooter/UQFooter.js';
import Alert from './Alert/Alert.js';
import gtm from './GTM/gtm.js';

// Import mock data if required
if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
    console.log('include mock data');
    require('../mock/MockApi');
}

customElements.define('alert-list', Alerts);
customElements.define('api-access', ApiAccess);
customElements.define('askus-button', AskUsButton);
customElements.define('auth-button', AuthButton);
customElements.define('mylibrary-button', MyLibraryButton);
customElements.define('connect-footer', ConnectFooter);
customElements.define('uq-header', UQHeader);
customElements.define('uq-site-header', UQSiteHeader);
customElements.define('uq-footer', UQFooter);
customElements.define('uq-alert', Alert);
customElements.define('uq-gtm', gtm);

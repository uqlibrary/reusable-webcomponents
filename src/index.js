import ApiAccess from './ApiAccess/ApiAccess';
import AskUsButton from './UtilityArea/AskUsButton';
import AuthButton from './UtilityArea/AuthButton';
import ConnectFooter from './ConnectFooter/ConnectFooter';
import UQHeader from './UQHeader/UQHeader.js';
import UQSiteHeader from './UQSiteHeader/UQSiteHeader.js';
import UQFooter from './UQFooter/UQFooter.js';

// Import mock data if required
if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
    console.log('include mock data');
    require('../mock/MockApi');
}


customElements.define('api-access', ApiAccess);
customElements.define('askus-button', AskUsButton);
customElements.define('auth-button', AuthButton);
customElements.define('connect-footer', ConnectFooter);
customElements.define('uq-header', UQHeader);
customElements.define('uq-site-header', UQSiteHeader);
customElements.define('uq-footer', UQFooter);

import ApiAccess from '../src/ApiAccess/ApiAccess';
import AskUsButton from '../src/UtilityArea/AskUsButton';
import AuthButton from '../src/UtilityArea/AuthButton';
import MyLibraryButton from '../src/UtilityArea/MyLibraryButton';
import ConnectFooter from '../src/ConnectFooter/ConnectFooter';
import UQHeader from '../src/UQHeader/UQHeader.js';
import UQSiteHeader from '../src/UQSiteHeader/UQSiteHeader.js';
import UQFooter from '../src/UQFooter/UQFooter.js';

// Import mock data if required
if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
    console.log('include mock data');
    require('../mock/MockApi');
}

customElements.define('api-access', ApiAccess);
customElements.define('askus-button', AskUsButton);
customElements.define('auth-button', AuthButton);
customElements.define('mylibrary-button', MyLibraryButton);
customElements.define('connect-footer', ConnectFooter);
customElements.define('uq-header', UQHeader);
customElements.define('uq-site-header', UQSiteHeader);
customElements.define('uq-footer', UQFooter);

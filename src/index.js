import MockApi from '../mock/MockApi';
import ApiAccess from './ApiAccess/ApiAccess';
import AuthButton from './AuthButton/AuthButton';
import ConnectFooter from './ConnectFooter/ConnectFooter';
import UQHeader from './UQHeader/UQHeader.js';
import UQSiteHeader from './UQSiteHeader/UQSiteHeader.js';
import UQFooter from './UQFooter/UQFooter.js';

// Import mock data if required
console.log('process = ', process);
console.log('process.env = ', process.env);
console.log('process.title = ', process.title);
console.log('process.env.USE_MOCK = ', process.env.USE_MOCK);
console.log('process.env.NODE_ENV = ', process.env.NODE_ENV);
console.log('process.env.BRANCH = ', process.env.BRANCH);
if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
    console.log('include mock');
    require('../mock/MockApi');
}


customElements.define('api-access', ApiAccess);
customElements.define('auth-button', AuthButton);
customElements.define('connect-footer', ConnectFooter);
customElements.define('uq-header', UQHeader);
customElements.define('uq-site-header', UQSiteHeader);
customElements.define('uq-footer', UQFooter);

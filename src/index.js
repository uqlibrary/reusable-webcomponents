// deliberate use of var as this needs to run on old browsers
var supportsCustomElements = 'customElements' in window;
if (!supportsCustomElements) {
    var bodyblock = document.querySelector('body');
    !!bodyblock && (bodyblock.style.textAlign = 'center');
    !!bodyblock && (bodyblock.style.padding = '16px');

    var upgradeDiv = document.createElement('div');

    var contentText = "Your browser is too old - some aspects of our site won't work. ";
    var contentNode = !!contentText && document.createTextNode(contentText);
    !!upgradeDiv && !!contentNode && upgradeDiv.appendChild(contentNode);

    var anchor = document.createElement('a');
    !!anchor && (anchor.href = 'https://browser-update.org/update-browser.html');
    !!anchor && (anchor.target = '_blank');
    var linkText = 'Please upgrade';
    var linkTextNode = !!linkText && document.createTextNode(linkText);
    !!anchor && !!linkTextNode && anchor.appendChild(linkTextNode);
    !!upgradeDiv && !!anchor && upgradeDiv.appendChild(anchor);

    var firstElement = document.body.children[0];
    !!firstElement && !!upgradeDiv && document.body.insertBefore(upgradeDiv, firstElement);

    process.exit(0);
}

import Alert from './Alert/Alert';
import Alerts from './Alerts/Alerts';
import ApiAccess from './ApiAccess/ApiAccess';
import ProactiveChat from './UtilityArea/ProactiveChat';
import AuthButton from './UtilityArea/AuthButton';
import gtm from './GTM/gtm';
import SearchPortal from './SearchPortal/SearchPortal.js';
import SecureCollection from './SecureCollection/SecureCollection.js';
import UQFooter from './UQFooter/UQFooter';
import UQHeader from './UQHeader/UQHeader';
import UQSiteHeader from './UQSiteHeader/UQSiteHeader';
import CulturalAdvice from './CulturalAdvice/CulturalAdvice.js';

/* istanbul ignore else  */
if (process.env.USE_MOCK) {
    // Import mock data if required
    console.log('include mock data');
    require('../mock/MockApi');
}

customElements.define('alert-list', Alerts);
customElements.define('api-access', ApiAccess);
customElements.define('proactive-chat', ProactiveChat);
customElements.define('auth-button', AuthButton);
customElements.define('search-portal', SearchPortal);
customElements.define('secure-collection', SecureCollection);
customElements.define('uq-alert', Alert);
customElements.define('uq-footer', UQFooter);
customElements.define('uq-gtm', gtm);
customElements.define('uq-header', UQHeader);
customElements.define('uq-site-header', UQSiteHeader);
customElements.define('cultural-advice', CulturalAdvice);

import Alert from './Alert/Alert';
import Alerts from './Alerts/Alerts';
import ApiAccess from './ApiAccess/ApiAccess';
import AskUsButton from './UtilityArea/AskUsButton';
import AuthButton from './UtilityArea/AuthButton';
import ConnectFooter from './ConnectFooter/ConnectFooter';
import gtm from './GTM/gtm';
import MyLibraryButton from './UtilityArea/MyLibraryButton';
import Training from './Training/Training';
import TrainingDetail from './Training/TrainingDetail';
import TrainingFilter from './Training/TrainingFilter';
import TrainingList from './Training/TrainingList';
import UQFooter from './UQFooter/UQFooter';
import UQHeader from './UQHeader/UQHeader';
import UQSiteHeader from './UQSiteHeader/UQSiteHeader';

/* istanbul ignore else  */
if (process.env.USE_MOCK) {
    // Import mock data if required
    console.log('include mock data');
    require('../mock/MockApi');
}

customElements.define('alert-list', Alerts);
customElements.define('api-access', ApiAccess);
customElements.define('askus-button', AskUsButton);
customElements.define('auth-button', AuthButton);
customElements.define('connect-footer', ConnectFooter);
customElements.define('library-training', Training);
customElements.define('mylibrary-button', MyLibraryButton);
customElements.define('training-detail', TrainingDetail);
customElements.define('training-filter', TrainingFilter);
customElements.define('training-list', TrainingList);
customElements.define('uq-alert', Alert);
customElements.define('uq-footer', UQFooter);
customElements.define('uq-gtm', gtm);
customElements.define('uq-header', UQHeader);
customElements.define('uq-site-header', UQSiteHeader);

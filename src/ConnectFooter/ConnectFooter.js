import styles from './css/overrides.css';
import { default as footerlocale } from './connectfooter.locale';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <div data-analyticsid="connect-footer" id="connect-footer" class="connect-footer connectfooter-wrapper griditem griditem12" data-gtm-category="Footer">
        <div class="uq-footer__container connectfooter-wrapper2 griditem griditem12">
            <div class="connectfooter-wrapper3">
                <div class="layout-card">
                <p data-testid="connect-footer-social-heading">Library footer with social / giving options - details to be determined.</p>
                </div>
            </div>
        </div>
    </div>
`;

let initCalled;

class ConnectFooter extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));
    }
}

export default ConnectFooter;

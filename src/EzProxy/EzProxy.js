import mainStyles from './css/main.css';
import customStyles from './css/overrides.css';

/*
 * usage:
 *  <ez-proxy></ez-proxy>
 *  <ez-proxy copy-only></ez-proxy>
 *
 */

const template = document.createElement('template');
template.innerHTML = `
    <style>
        ${mainStyles.toString()}
        ${customStyles.toString()}
    </style>
    <div id="ez-proxy" class="uq-grid">
        <fieldset class="uq-grid__col--5">
            <input type="url" placeholder="DOI or URL" id="ez-proxy-input" />
            <textarea id="ez-proxy-url-display-area" class="hidden"></textarea>
            <button id="ez-proxy-create-link-button" class="uq-button hidden">Create Link</button>
            <button id="ez-proxy-create-new-link-button" class="uq-button hidden">Create New Link</button>
            <button id="ez-proxy-test-link-button" class="uq-button hidden">Test Link</button>
            <button id="ez-proxy-copy-link-button" class="uq-button hidden">Copy Link</button>
            <button id="ez-proxy-redirect-button" class="uq-button hidden">Go</button>
        </fieldset>
    </div>
`;

class EzProxy extends HTMLElement {
    constructor() {
        super();

        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));

    }

    isCopyOnly() {
        return this.getAttribute('copy-only') !== null;
    }

}

export default EzProxy;

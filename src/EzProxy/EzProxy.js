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
        ${customStyles.toString()}
    </style>
    <div id="ez-proxy">
        <fieldset>
            <input type="url" placeholder="DOI or URL" id="ez-proxy-input" />
            <textarea id="ez-proxy-url-display-area"></textarea>
            <button id="ez-proxy-create-link-button">Create Link</button>
            <button id="ez-proxy-create-new-link-button">Create New Link</button>
            <button id="ez-proxy-test-link-button">Test Link</button>
            <button id="ez-proxy-copy-link-button">Copy Link</button>
            <button id="ez-proxy-redirect-button">Go</button>
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

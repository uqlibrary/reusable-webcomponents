import styles from './css/overrides.css';
import { default as footerlocale } from './connectfooter.locale';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <div data-testid="connect-footer" id="connect-footer" class="connect-footer connectfooter-wrapper griditem griditem12" data-gtm-category="Footer">
        <div class="uq-footer__container connectfooter-wrapper2 griditem griditem12">
            <div class="connectfooter-wrapper3">
                <div class="layout-card">
                    <div class="gridcontainer flexstart justifyxscenter" data-testid="connect-footer" id="connect-footer-block">
                        <div class="navigation griditem griditem12 gridmd4">
                            <ul id="footer-menu" data-testid="connect-footer-menu" class="footerMenu">
                            </ul>
                        </div>
                    <div class="contacts griditem griditem12 gridmd4">
                        <div class="gridcontainer">
                            <div class="griditem gridxsauto">
                                <h3 data-testid="connect-footer-social-heading" class="typography typographyh6"></h3>
                            </div>
                        </div>
                        <div class="buttons gridcontainer spacingxs1">
                            <!-- social buttons -->
                        </div>
                        <div class="internalLinks">
                        </div>
                    </div>
                    <div class="givingWrapper griditem griditem12 gridmd4">
                        <div class="gridcontainer MuiGrid-spacing-xs-2">
                        <!-- giving buttons -->
                        </div>
                    </div>
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

        this.updateFooterMenuFromJson();

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        // Bindings
        this.updateFooterMenuFromJson = this.updateFooterMenuFromJson.bind(this);
        this.createLink = this.createLink.bind(this);
        this.createFooterGivingButtonEntry = this.createFooterGivingButtonEntry.bind(this);
        this.createFooterSocialButtonEntry = this.createFooterSocialButtonEntry.bind(this);
        this.createSeparatorForFooterMenu = this.createSeparatorForFooterMenu.bind(this);
        this.socialButtonIdentifier = this.socialButtonIdentifier.bind(this);
        this.internalButtonIdentifier = this.internalButtonIdentifier.bind(this);
        this.givingButtonIdentifier = this.givingButtonIdentifier.bind(this);
    }

    updateFooterMenuFromJson() {
        const footerMenu = template.content.getElementById('footer-menu');
        footerlocale.connectFooter.internalLinks.forEach((button, index) => {
            /* istanbul ignore else */
            if (!template.content.getElementById(this.internalButtonIdentifier(index))) {
                const internalLink = this.createLink(
                    button.dataTestid,
                    button.linkTo || /* istanbul ignore next */ '',
                    button.linklabel || /* istanbul ignore next */ '',
                );

                const internalItem = document.createElement('li');
                !!internalItem && internalItem.setAttribute('id', this.internalButtonIdentifier(index));
                !!internalItem && internalItem.appendChild(internalLink);

                const separator = this.createSeparatorForFooterMenu(index);
                !!internalItem && !!separator && internalItem.appendChild(separator);

                !!internalItem && footerMenu.appendChild(internalItem);
            }
        });

        const contactsheader = template.content.querySelector('.contacts h3');
        !!contactsheader && (contactsheader.innerHTML = footerlocale.connectFooter.buttonSocialHeader);

        const socialbuttonContainer = template.content.querySelector('.contacts .buttons');
        !!socialbuttonContainer &&
            footerlocale.connectFooter.buttonSocial.forEach((button, index) => {
                /* istanbul ignore else */
                if (!template.content.getElementById(this.socialButtonIdentifier(index))) {
                    const container = this.createFooterSocialButtonEntry(button, index);
                    !!container && socialbuttonContainer.appendChild(container);
                }
            });

        const givingbuttonsContainer = template.content.querySelector('.givingWrapper div');
        !!givingbuttonsContainer &&
            footerlocale.connectFooter.givingLinks.map((button, index) => {
                /* istanbul ignore else */
                if (!template.content.getElementById(this.givingButtonIdentifier(index))) {
                    const container = this.createFooterGivingButtonEntry(button, index);
                    !!container && givingbuttonsContainer.appendChild(container);
                }
            });
    }

    createFooterGivingButtonEntry(button, index) {
        const linkLabel = document.createTextNode(button.label);

        const link = document.createElement('a');
        !!link && (link.href = button.linkTo);
        !!link && (link.className = 'buttonBase button buttonContained givingButtonClass buttonFullWidth');
        !!link && (link.tabIndex = '0');
        !!link && (link.type = 'button');
        !!link && link.setAttribute('data-testid', button.dataTestid);
        !!link && !!linkLabel && link.appendChild(linkLabel);

        const ripplespan = document.createElement('span');
        !!ripplespan && (ripplespan.className = 'touchRipple');

        const container = document.createElement('div');
        !!container && (container.className = 'givingBlock griditem griditem12');
        !!container && (container.id = this.givingButtonIdentifier(index));
        !!container && !!link && container.appendChild(link);
        !!container && !!ripplespan && container.appendChild(ripplespan);
        return container;
    }

    createFooterSocialButtonEntry(button, index) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        !!path && path.setAttribute('d', button.iconPath);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        !!svg && svg.setAttribute('class', 'svgIcon');
        !!svg && svg.setAttribute('focusable', 'false');
        !!svg && svg.setAttribute('viewBox', '0 0 24 24');
        !!svg && svg.setAttribute('ariaHidden', 'true');
        !!svg && !!path && svg.appendChild(path);

        const span = document.createElement('span');
        !!span && (span.className = 'buttonLabel');
        !!span && !!svg && span.appendChild(svg);

        const ripplespan = document.createElement('span');
        !!ripplespan && (ripplespan.className = 'touchRipple');

        const link = document.createElement('a');
        !!link && (link.href = button.linkTo);
        !!link && (link.target = '_blank');
        !!link && (link.className = 'buttonBase button socialButtonClass buttonContained buttonContainedPrimary');
        !!link && (link.tabIndex = '0');
        !!link && (link.type = 'button');
        !!link && (link.ariaLabel = button.linkMouseOver);
        !!link && link.setAttribute('data-testid', button.dataTestid);
        !!link && (link.id = this.socialButtonIdentifier(index));
        !!link && (link.title = button.linkMouseOver);
        !!link && !!span && link.appendChild(span);
        !!link && !!ripplespan && link.appendChild(ripplespan);

        const container = document.createElement('div');
        !!container && (container.className = 'griditem gridxsauto');
        !!container && (container.id = `buttonSocial-${index}`);
        !!container && !!link && container.appendChild(link);
        return container;
    }

    createSeparatorForFooterMenu(index) {
        const separator = document.createElement('span');
        !!separator && separator.setAttribute('class', 'separator');
        !!separator && separator.setAttribute('data-testid', `connect-internal-separator-${index}`);
        !!separator && (separator.textContent = ' | ');
        return separator;
    }

    createLink(datatestid, href, linktext) {
        const link = document.createElement('a');
        !!datatestid && !!link && link.setAttribute('data-testid', datatestid);
        !!href && !!link && link.setAttribute('href', href);

        const textOfLink = !!linktext && document.createTextNode(linktext);
        !!link && !!textOfLink && link.appendChild(textOfLink);

        return link;
    }

    socialButtonIdentifier(index) {
        return `socialbutton-${index}`;
    }

    internalButtonIdentifier(index) {
        return `internalbutton-${index}`;
    }

    givingButtonIdentifier(index) {
        return `givingbutton-${index}`;
    }
}

export default ConnectFooter;

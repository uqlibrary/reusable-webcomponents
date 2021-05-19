import styles from './css/overrides.css';
import { default as menuLocale } from '../locale/menu';
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
                                <h3 class="typography typographyh6">Connect with us</h3>
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
    }

    updateFooterMenuFromJson() {
        const footerMenu = template.content.getElementById('footer-menu');
        if (!document.querySelector('#footermenu-home')) {
            const homelink = this.createLink(
                'footermenu-homepage',
                menuLocale.menuhome.linkTo || '',
                menuLocale.menuhome.primaryText || '',
            );

            const homeMenuItem = document.createElement('li');
            homeMenuItem.setAttribute('id', '#footermenu-home');
            homeMenuItem.appendChild(homelink);

            const separator = this.createSeparatorForFooterMenu();
            homeMenuItem.appendChild(separator);

            footerMenu.appendChild(homeMenuItem);
        }

        menuLocale.publicmenu.forEach((linkProperties, index) => {
            if (!document.querySelector(`#footermenu-${index}`)) {
                const menuItem = this.createFooterMenuEntry(linkProperties, index);

                footerMenu.appendChild(menuItem);
            }
        });

        const contactsheader = template.content.querySelector('.contacts h3');
        !!contactsheader && (contactsheader.innerHTML = footerlocale.connectFooter.buttonSocialHeader);

        const socialbuttonContainer = template.content.querySelector('.contacts .buttons');
        footerlocale.connectFooter.buttonSocial.forEach((button, index) => {
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
            !!link && (link.id = `socialbutton-${index}`);
            !!link && (link.title = button.linkMouseOver);
            !!link && !!span && link.appendChild(span);
            !!link && !!ripplespan && link.appendChild(ripplespan);

            const container = document.createElement('div');
            !!container && (container.className = 'griditem gridxsauto');
            !!container && (container.id = `buttonSocial-${index}`);
            !!container && !!link && container.appendChild(link);

            !!socialbuttonContainer && !!container && socialbuttonContainer.appendChild(container);
        });

        const internalbuttonsContainer = template.content.querySelector('.contacts .internalLinks');
        footerlocale.connectFooter.internalLinks.forEach((button, index) => {
            const linkLabel = document.createTextNode(button.linklabel);

            const link = document.createElement('a');
            !!link && (link.href = button.linkTo);
            !!link && link.setAttribute('data-testid', button.dataTestid);
            !!link && !!linkLabel && link.appendChild(linkLabel);

            const linkLabelSpan = document.createTextNode(' |  ');
            const span = document.createElement('span');
            index < footerlocale.connectFooter.internalLinks.length - 1 &&
                !!span &&
                !!linkLabelSpan &&
                span.appendChild(linkLabelSpan);

            const container = document.createElement('span');
            !!container && !!link && container.appendChild(link);
            !!container && !!span && container.appendChild(span);

            !!internalbuttonsContainer && !!container && internalbuttonsContainer.appendChild(container);
        });

        const givingbuttonsContainer = template.content.querySelector('.givingWrapper div');
        footerlocale.connectFooter.givingLinks.map((button, index) => {
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
            !!container && !!link && container.appendChild(link);
            !!container && !!ripplespan && container.appendChild(ripplespan);

            !!givingbuttonsContainer && !!container && givingbuttonsContainer.appendChild(container);
        });
    }

    createFooterMenuEntry(linkProperties, index) {
        const menulink = this.createLink(
            linkProperties.dataTestid || '',
            linkProperties.linkTo || '',
            linkProperties.primaryText || '',
        );

        const menuItem = document.createElement('li');
        menuItem.setAttribute('id', `#footermenu-${index}`);
        menuItem.appendChild(menulink);

        const separator = this.createSeparatorForFooterMenu();
        menuItem.appendChild(separator);
        return menuItem;
    }

    createSeparatorForFooterMenu() {
        const separator = document.createElement('span');
        separator.setAttribute('class', 'separator');
        separator.textContent = ' | ';
        return separator;
    }

    createLink(datatestid, href, linktext) {
        const homelink = document.createElement('a');
        homelink.setAttribute('data-testid', datatestid);
        homelink.setAttribute('href', href);
        const textOfLink = document.createTextNode(linktext);
        homelink.appendChild(textOfLink);
        return homelink;
    }
}

export default ConnectFooter;

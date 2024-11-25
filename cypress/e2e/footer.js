/// <reference types="cypress" />

describe('UQ Footer', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
        cy.setCookie('UQ_PROACTIVE_CHAT', 'hidden');
        cy.visit('http://localhost:8080');
    });
    context('Footer', () => {
        it('Footer is visible without interaction at 1280px wide', () => {
            cy.viewport(1280, 900);
            cy.get('uq-footer')
                .shadow()
                .find('footer.uq-footer')
                .should(
                    'contain',
                    'UQ acknowledges the Traditional Owners and their custodianship of the lands on which UQ is situated.',
                );
            // cy.get('connect-footer')
            //     .shadow()
            //     .find('[data-testid="connect-footer-social-heading"]')
            //     .should('exist')
            //     .and('contain', 'Library footer');
        });

        it('Footer menu  is correct on desktop', () => {
            cy.viewport(1280, 900);
            // cy.get('connect-footer').shadow().find('[data-testid="connect-footer-social-heading"]').scrollIntoView();
            cy.waitUntil(() =>
                cy
                    .get('uq-footer')
                    .shadow()
                    .find('[data-testid="footer-desktop-nav"] > ul')
                    .should('exist')
                    .should('be.visible'),
            );
            cy.get('uq-footer')
                .shadow()
                .find('[data-testid="footer-desktop-nav"] > ul')
                .children()
                .should('have.length', 5);

            cy.get('uq-footer')
                .shadow()
                .find('[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:first-child h2')
                .should('exist')
                .should('be.visible')
                .contains('Media');
            cy.get('uq-footer')
                .shadow()
                .find(
                    '[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:first-child .uq-footer__navigation-level-2 li',
                )
                .its('length')
                .should('be.gt', 2); // while the length varies, we're always going to have some!

            let listIndex = 2;
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:nth-child(${listIndex}) h2`)
                .should('exist')
                .should('be.visible')
                .contains('Working at UQ');
            cy.get('uq-footer')
                .shadow()
                .find(
                    `[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:nth-child(${listIndex}) .uq-footer__navigation-level-2 li`,
                )
                .its('length')
                .should('be.gt', 2); // while the length varies, we're always going to have some!

            listIndex++;
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:nth-child(${listIndex}) h2`)
                .should('exist')
                .should('be.visible')
                .contains('Current students');
            cy.get('uq-footer')
                .shadow()
                .find(
                    `[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:nth-child(${listIndex}) .uq-footer__navigation-level-2 li`,
                )
                .its('length')
                .should('be.gt', 2); // while the length varies, we're always going to have some!

            listIndex++;
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:nth-child(${listIndex}) h2`)
                .should('exist')
                .should('be.visible')
                .contains('Library');
            cy.get('uq-footer')
                .shadow()
                .find(
                    `[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:nth-child(${listIndex}) .uq-footer__navigation-level-2 li`,
                )
                .its('length')
                .should('be.gt', 2); // while the length varies, we're always going to have some!

            listIndex++;
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:nth-child(${listIndex}) h2`)
                .should('exist')
                .should('be.visible')
                .contains('Contact');
            cy.get('uq-footer')
                .shadow()
                .find(
                    `[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:nth-child(${listIndex}) .uq-footer__navigation-level-2 li`,
                )
                .its('length')
                .should('be.gt', 2); // while the length varies, we're always going to have some!
        });

        it('Footer menu  is correct on mobile', () => {
            cy.viewport(320, 480);
            // cy.get('connect-footer').shadow().find('[data-testid="connect-footer-social-heading"]').scrollIntoView();
            cy.waitUntil(() =>
                cy.get('uq-footer').shadow().find('[data-testid="footer-mobile-nav"] > ul').should('exist'),
            );
            cy.get('uq-footer')
                .shadow()
                .find('[data-testid="footer-mobile-nav"] > ul')
                .children()
                .should('have.length', 5);

            let listIndex = 0;
            // menu is not open
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="mobile-child-list-${listIndex}"]`)
                .should('exist')
                .should('have.css', 'height', '0px');
            // open menu
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="button-menu-toggle-${listIndex}"]`)
                .should('exist')
                .should('be.visible')
                .contains('Media')
                .click();
            // menu is open
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="mobile-child-list-${listIndex}"]`)
                .should('exist')
                .should('be.visible')
                .should('not.have.css', 'height', '0px');
            // menu has some children
            cy.waitUntil(() =>
                cy
                    .get('uq-footer')
                    .shadow()
                    .find(`[data-testid="menu-toggle-${listIndex}"] .uq-footer__navigation-level-2 li`)
                    .should('exist'),
            );
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="menu-toggle-${listIndex}"] .uq-footer__navigation-level-2 li`)
                .its('length')
                .should('be.gt', 2); // while the length varies, we're always going to have some!

            listIndex++;
            // menu is not open
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="mobile-child-list-${listIndex}"]`)
                .should('exist')
                .should('have.css', 'height', '0px');
            // open menu
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="button-menu-toggle-${listIndex}"]`)
                .should('exist')
                .should('be.visible')
                .contains('Working at UQ')
                .click();
            // menu is open
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="mobile-child-list-${listIndex}"]`)
                .should('exist')
                .should('be.visible')
                .should('not.have.css', 'height', '0px');
            // menu has some children
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="menu-toggle-${listIndex}"] .uq-footer__navigation-level-2 li`)
                .its('length')
                .should('be.gt', 2); // while the length varies, we're always going to have some!

            listIndex++;
            // menu is not open
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="mobile-child-list-${listIndex}"]`)
                .should('exist')
                .should('have.css', 'height', '0px');
            // open menu
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="button-menu-toggle-${listIndex}"]`)
                .should('exist')
                .should('be.visible')
                .contains('Current students')
                .click();
            // menu is open
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="mobile-child-list-${listIndex}"]`)
                .should('exist')
                .should('be.visible')
                .should('not.have.css', 'height', '0px');
            // menu has some children
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="menu-toggle-${listIndex}"] .uq-footer__navigation-level-2 li`)
                .its('length')
                .should('be.gt', 2); // while the length varies, we're always going to have some!

            listIndex++;
            // menu is not open
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="mobile-child-list-${listIndex}"]`)
                .should('exist')
                .should('have.css', 'height', '0px');
            // open menu
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="button-menu-toggle-${listIndex}"]`)
                .should('exist')
                .should('be.visible')
                .contains('Library')
                .click();
            // menu is open
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="mobile-child-list-${listIndex}"]`)
                .should('exist')
                .should('be.visible')
                .should('not.have.css', 'height', '0px');
            // menu has some children
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="menu-toggle-${listIndex}"] .uq-footer__navigation-level-2 li`)
                .its('length')
                .should('be.gt', 2); // while the length varies, we're always going to have some!

            listIndex++;
            // menu is not open
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="mobile-child-list-${listIndex}"]`)
                .should('exist')
                .should('have.css', 'height', '0px');
            // open menu
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="button-menu-toggle-${listIndex}"]`)
                .should('exist')
                .should('be.visible')
                .contains('Contact')
                .click();
            // menu is open
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="mobile-child-list-${listIndex}"]`)
                .should('exist')
                .should('be.visible')
                .should('not.have.css', 'height', '0px');
            // menu has some children
            cy.get('uq-footer')
                .shadow()
                .find(`[data-testid="menu-toggle-${listIndex}"] .uq-footer__navigation-level-2 li`)
                .its('length')
                .should('be.gt', 2); // while the length varies, we're always going to have some!
        });

        it('Footer passes accessibility on desktop', () => {
            cy.viewport(1280, 900);
            cy.injectAxe();
            cy.wait(1000);
            cy.checkA11y('uq-footer', {
                reportName: 'Footer',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                rules: {
                    'link-in-text-block': { enabled: false }, // the link styling is centrally mandated :(
                },
            });
        });

        it('Footer passes accessibility on mobile', () => {
            cy.viewport(320, 480);
            cy.injectAxe();
            cy.wait(1000);
            cy.checkA11y('uq-footer', {
                reportName: 'Footer',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                rules: {
                    'link-in-text-block': { enabled: false }, // the link styling is centrally mandated :(
                },
            });
        });

        it('Mobile-width Footer drop down menus work properly', () => {
            const libraryMenuPlacement = '3'; // The "Library" item is the 4th submenu (zero indexed)
            const librarySubmenuButton = `[data-testid="button-menu-toggle-${libraryMenuPlacement}"]`;
            const otherMenuPlacement = '4';
            const otherSubmenuButton = `[data-testid="button-menu-toggle-${otherMenuPlacement}"]`;

            const findLibrarySubmenuButton = () => cy.get('uq-footer').shadow().find(librarySubmenuButton);

            const assertLibrarySubmenuVisibility = (visible) => {
                const visibilityStatement = !!visible ? 'be.visible' : 'not.be.visible';
                findLibrarySubmenuButton().parent().find('ul').should(visibilityStatement);
            };

            const toggleLibrarySubmenu = () => findLibrarySubmenuButton().click();

            cy.viewport(320, 480);
            findLibrarySubmenuButton().scrollIntoView();

            // the Library menu item is initially closed
            assertLibrarySubmenuVisibility(false);

            // open the Library menu item
            toggleLibrarySubmenu();
            assertLibrarySubmenuVisibility(true);

            // open another menu item and Library menu item closes
            cy.get('uq-footer').shadow().find(otherSubmenuButton).click();
            cy.get('uq-footer').shadow().find(otherSubmenuButton).parent().find('ul').should('be.visible');
            assertLibrarySubmenuVisibility(false);

            // open the Library menu item and other menu item closes
            toggleLibrarySubmenu();
            cy.get('uq-footer').shadow().find(otherSubmenuButton).parent().find('ul').should('not.be.visible');
            assertLibrarySubmenuVisibility(true);

            // the Library menu item closes on toggle
            toggleLibrarySubmenu();
            assertLibrarySubmenuVisibility(false);
        });
    });
});

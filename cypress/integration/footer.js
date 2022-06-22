/// <reference types="cypress" />

describe('UQ Footer', () => {
    beforeEach(() => {
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
            cy.get('connect-footer')
                .shadow()
                .find('[data-testid="connect-footer-social-heading"]')
                .should('contain', 'Connect with the Library');
        });

        it('Footer passes accessibility', () => {
            cy.viewport(1280, 900);
            cy.injectAxe();
            cy.wait(1000);
            cy.checkA11y('uq-footer', {
                reportName: 'Footer',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
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

        it('Connect Footer items display with separator at mobile-width', () => {
            cy.viewport(320, 480);

            cy.get('connect-footer').shadow().find('[data-testid="connect-footer-menu"]').scrollIntoView();
            cy.get('connect-footer').shadow().find('[data-testid="connect-internal-separator-0"]').should('be.visible');

            cy.viewport(1280, 900);

            cy.get('connect-footer')
                .shadow()
                .find('[data-testid="connect-internal-separator-0"]')
                .should('exist')
                .should('not.be.visible');
        });
    });
});

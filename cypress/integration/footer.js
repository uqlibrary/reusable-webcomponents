/// <reference types="cypress" />

describe('UQ Footer', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
        cy.injectAxe();
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
        });

        it('Footer passes accessibility', () => {
            cy.viewport(1280, 900);
            cy.checkA11y('uq-footer', {
                reportName: 'Footer',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('Mobile-width Footer drop down menus work properly', () => {
            const libraryMenuPlacement = '3'; // The "Library" item is the 4th submenu (zero indexed)
            const librarySubmenuButton = `[data-testid="button-menu-toggle-${libraryMenuPlacement}"]`;

            const findLibrarySubmenuButton = () => cy.get('uq-footer').shadow().find(librarySubmenuButton);

            const assertLibrarySubmenuVisibility = (visible) => {
                const visibilityStatement = !!visible ? 'be.visible' : 'not.be.visible';
                findLibrarySubmenuButton().parent().find('ul').should(visibilityStatement);
            };

            const toggleLibrarySubmenu = () => findLibrarySubmenuButton().click();

            cy.viewport(320, 480);
            findLibrarySubmenuButton().scrollIntoView();
            assertLibrarySubmenuVisibility(false);

            toggleLibrarySubmenu();
            assertLibrarySubmenuVisibility(true);

            toggleLibrarySubmenu();
            assertLibrarySubmenuVisibility(false);
        });
    });
});

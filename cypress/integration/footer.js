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
            const librarySubmenuVisible = (visible) => {
                const visibilityStatement = !!visible ? 'be.visible' : 'not.be.visible';
                cy.get('uq-footer')
                    .shadow()
                    .find('[data-testid="button-menu-toggle-3"]')
                    .parent()
                    .find('ul')
                    .should(visibilityStatement);
            };

            cy.viewport(320, 480);
            const libraryButton = cy
                .get('uq-footer')
                .shadow()
                // #3 is Library section
                .find('[data-testid="button-menu-toggle-3"]');
            cy.get('uq-footer').shadow().find('[data-testid="button-menu-toggle-3"]').scrollIntoView();
            librarySubmenuVisible(false);
            cy.get('uq-footer').shadow().find('[data-testid="button-menu-toggle-3"]').click();
            librarySubmenuVisible(true);
            cy.get('uq-footer').shadow().find('[data-testid="button-menu-toggle-3"]').click();
            librarySubmenuVisible(false);
            cy.log('DONE!');
        });
    });
});

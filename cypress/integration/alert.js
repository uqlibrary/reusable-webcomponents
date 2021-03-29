/// <reference types="cypress" />

describe('Alert', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
        cy.injectAxe();
    });
    context('Alert', () => {
        it('Alert is visible without interaction at 1280', () => {
            cy.viewport(1280, 900);
            cy.get('uq-alert').should('have.length', 2);

            // cy.get('uq-alert')[0]
            //     .shadow()
            //     .find('uq-alert')
            //     .should(
            //         'contain',
            //         'This is an alert.',
            //     );
        });

        // it('Footer passes accessibility', () => {
        //     cy.viewport(1280, 900);
        //     cy.checkA11y('uq-footer', {
        //         reportName: 'Footer',
        //         scopeName: 'Accessibility',
        //         includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        //     });
        // });
    });
});

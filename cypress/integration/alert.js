/// <reference types="cypress" />

describe('Alert', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
        cy.injectAxe();
    });
    context('Alert', () => {
        it('Alert is visible without interaction at 1280', () => {
            cy.viewport(1280, 900);
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 2);

            cy.get('alert-list')
                .shadow()
                .find('uq-alert[id="1"]')
                .shadow()
                .find('#alert-title')
                .should('have.text', 'This is an alert');

            cy.get('alert-list')
                .shadow()
                .find('uq-alert[id="1"]')
                .shadow()
                .find('#alert-action-desktop')
                .should('have.text', 'Action button label');

            cy.get('alert-list').shadow().find('uq-alert[id="1"]').shadow().find('#alert-close').click();

            cy.get('alert-list')
                .shadow()
                .find('uq-alert[id="1"]')
                .shadow()
                .find('#alert')
                .should('have.css', 'display', 'none');

            cy.get('alert-list')
                .shadow()
                .find('uq-alert[id="2"]')
                .shadow()
                .find('#alert-title')
                .should('have.text', 'This is a permanent urgent alert');
        });

        it('Alert passes accessibility', () => {
            cy.viewport(1280, 900);
            cy.checkA11y('uq-alert[id="1"]', {
                reportName: 'Alert',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.checkA11y('uq-alert[id="2"]', {
                reportName: 'Alert',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});

/// <reference types="cypress" />

describe('Alert', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });
    context('Alert', () => {
        it('Alert is visible without interaction at 1280', () => {
            cy.viewport(1280, 900);
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 2);

            cy.get('alert-list')
                .shadow()
                .find('uq-alert[id="alert-1"]')
                .shadow()
                .find('#alert-title')
                .should('have.text', 'This is an alert');

            cy.get('alert-list')
                .shadow()
                .find('uq-alert[id="alert-1"]')
                .shadow()
                .find('#alert-action-desktop')
                .should('have.text', 'Action button label');

            cy.get('alert-list').shadow().find('uq-alert[id="alert-1"]').shadow().find('#alert-close').click();

            cy.get('alert-list')
                .shadow()
                .find('uq-alert[id="alert-1"]')
                .shadow()
                .find('#alert')
                .should('have.css', 'display', 'none');

            cy.get('alert-list')
                .shadow()
                .find('uq-alert[id="alert-2"]')
                .shadow()
                .find('#alert-title')
                .should('have.text', 'This is a permanent urgent alert');
        });

        it('Alert is hidden if clicked to dismiss', () => {
            cy.viewport(1280, 900);
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 2);
            cy.get('alert-list').shadow().find('uq-alert[id="alert-1"]').shadow().find('#alert-close').click();
            cy.reload(true);
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 1);
        });

        it('Alert is hidden if cookie is set to hide it', () => {
            cy.viewport(1280, 900);
            cy.setCookie('UQ_ALERT_alert-1', 'hidden');
            cy.visit('http://localhost:8080');
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 1);
        });

        it('Alert passes accessibility', () => {
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.get('alert-list')
                .shadow()
                .find('uq-alert[id="alert-1"]')
                .shadow()
                .find('div#alert')
                .checkA11y('alert-list', {
                    reportName: 'Alert',
                    scopeName: 'Accessibility',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            cy.get('alert-list')
                .shadow()
                .find('uq-alert[id="alert-2"]')
                .shadow()
                .find('div#alert')
                .checkA11y('alert-list', {
                    reportName: 'Alert',
                    scopeName: 'Accessibility',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
        });
    });
});

/// <reference types="cypress" />

describe('Alert', () => {
    context('Alert', () => {
        it('Alert is visible without interaction at 1280', () => {
            cy.visit('http://localhost:8080');
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

        it('Alert passes accessibility', () => {
            cy.visit('http://localhost:8080');
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

        it('Alert is hidden if clicked to dismiss', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 2);
            cy.get('alert-list').shadow().find('uq-alert[id="alert-1"]').shadow().find('#alert-close').click();
            cy.reload(true);
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 1);
        });

        it('Alert is hidden if cookie is set to hide it', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.setCookie('UQ_ALERT_alert-1', 'hidden');
            cy.visit('http://localhost:8080');
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 1);
        });

        it('Alert with no param displays correctly', () => {
            cy.visit('http://localhost:8080/src/Alert/test-empty-alert.html');
            cy.viewport(1280, 900);
            cy.get('uq-alert').shadow().find('#alert').find('#alert-title').contains('No title supplied');
            cy.get('uq-alert').shadow().find('#alert').find('#alert-message').contains('No message supplied');
        });

        it('Duplicating the alerts element does not give a second set of alerts', () => {
            cy.visit('http://localhost:8080/src/Alerts/test-multiple-alerts-dont-duplicate.html');
            cy.viewport(1280, 900);

            // we get 2 alert lists
            cy.get('.multipleAlerts alert-list').should('have.length', 2);

            // first one has the alerts
            cy.get('.multipleAlerts alert-list').first().shadow().find('[data-testid="alerts"]').should('exist');
            cy.get('.multipleAlerts alert-list')
                .first()
                .shadow()
                .find('[data-testid="alerts-wrapper"]')
                .should('exist');
            cy.get('.multipleAlerts alert-list')
                .first()
                .shadow()
                .find('[data-testid="alerts-wrapper"]')
                .find('uq-alert')
                .should('have.length', 2);
            // second does not have any alerts
            cy.get('.multipleAlerts alert-list').first().next().shadow().find('[data-testid="alerts"]').should('exist');
            cy.get('.multipleAlerts alert-list')
                .first()
                .next()
                .shadow()
                .find('[data-testid="alerts-wrapper"]')
                .children()
                .should('have.length', 0);
        });
    });
});

/// <reference types="cypress" />

const INFO = 1;
const URGENT = 4;
const EXTREME = 5;

describe('Alert', () => {
    context('Alert', () => {
        it('Alert is visible without interaction at 1280', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 3);

            cy.get('alert-list')
                .shadow()
                .find(`uq-alert[id="alert-${INFO}"]`)
                .shadow()
                .find('#alert-title')
                .should('contain', 'This is an info alert')
                .should('not.contain', 'primo') // the system-specific alerts dont appear on this system-unspecified page
                .should('not.contain', 'drupal');

            cy.get('alert-list')
                .shadow()
                .find(`uq-alert[id="alert-${INFO}"]`)
                .shadow()
                .find('#alert-action-desktop')
                .should('have.text', 'Alert 1 button label');

            cy.get('alert-list').shadow().find(`uq-alert[id="alert-${INFO}"]`).shadow().find('#alert-close').click();

            cy.get('alert-list')
                .shadow()
                .find(`uq-alert[id="alert-${INFO}"]`)
                .shadow()
                .find('#alert')
                .should('have.css', 'display', 'none');

            cy.get('alert-list')
                .shadow()
                .find(`uq-alert[id="alert-${URGENT}"]`)
                .shadow()
                .find('#alert-title')
                .should('contain', 'This is a permanent urgent alert')
                .should('not.contain', 'primo')
                .should('not.contain', 'drupal');
        });

        it('Alert passes accessibility', () => {
            cy.visit('http://localhost:8080');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.get('alert-list')
                .shadow()
                .find(`uq-alert[id="alert-${INFO}"]`)
                .shadow()
                .find('div#alert')
                .checkA11y('alert-list', {
                    reportName: 'Alert',
                    scopeName: 'Accessibility',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            cy.get('alert-list')
                .shadow()
                .find(`uq-alert[id="alert-${INFO}"]`)
                .shadow()
                .find('div#alert')
                .should('have.attr', 'aria-label', 'Alert.');
            cy.get('alert-list')
                .shadow()
                .find(`uq-alert[id="alert-${URGENT}"]`)
                .shadow()
                .find('div#alert')
                .checkA11y('alert-list', {
                    reportName: 'Alert',
                    scopeName: 'Accessibility',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            cy.get('alert-list')
                .shadow()
                .find(`uq-alert[id="alert-${URGENT}"]`)
                .shadow()
                .find('div#alert')
                .should('have.attr', 'aria-label', 'Important alert.');
            cy.get('alert-list')
                .shadow()
                .find(`uq-alert[id="alert-${EXTREME}"]`)
                .shadow()
                .find('div#alert')
                .should('have.attr', 'aria-label', 'Very important alert.');
        });

        it('Alert is hidden if clicked to dismiss', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 3);
            cy.get('alert-list').shadow().find(`uq-alert[id="alert-${INFO}"]`).shadow().find('#alert-close').click();
            cy.reload(true);
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 2);
        });

        it('Alert is hidden if cookie is set to hide it', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.setCookie('UQ_ALERT_alert-1', 'hidden');
            cy.visit('http://localhost:8080');
            cy.get('alert-list').shadow().find('uq-alert').should('have.length', 2);
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
            cy.get('.multipleAlerts alert-list')
                .first()
                .shadow()
                .find('[aria-label="UQ Library Alerts"]')
                .should('exist');
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
            cy.get('.multipleAlerts alert-list')
                .first()
                .next()
                .shadow()
                .find('[aria-label="UQ Library Alerts"]')
                .should('exist');
            cy.get('.multipleAlerts alert-list')
                .first()
                .next()
                .shadow()
                .find('[data-testid="alerts-wrapper"]')
                .children()
                .should('have.length', 0);
        });

        it('Alert link out works', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.wait(1500);
            cy.intercept('GET', 'http://www.example.com', {
                statusCode: 200,
                body: 'it worked!',
            });
            cy.get('alert-list')
                .shadow()
                .find(`uq-alert[id="alert-${INFO}"]`)
                .shadow()
                .find('#alert-action-desktop')
                .click();
            cy.get('body').contains('it worked!');
        });

        it('No alerts show when Alerts api doesnt load; page otherwise correct', () => {
            cy.visit('http://localhost:8080?user=errorUser');
            cy.viewport(1280, 900);
            cy.wait(1500);
            cy.get('alert-list').shadow().find('[data-testid="alerts-wrapper"]').children().should('have.length', 0);

            // some things on the page look right
            cy.get('uq-header').shadow().find('[data-testid="uq-header-search-button"]').should('be.visible');
            cy.get('uq-site-header').shadow().find('[data-testid="site-title"]').contains('Library Test');
        });
    });
});

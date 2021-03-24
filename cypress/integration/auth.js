/// <reference types="cypress" />

describe('Auth button', () => {
    context('Auth button', () => {
        it('logged in user sees a "Log out" button', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.injectAxe();
            cy.checkA11y('auth-button', {
                reportName: 'Auth Loggedin',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.get('uq-site-header').find('auth-button').should('exist');
            cy.get('auth-button').shadow().find('#auth-log-out-label').should('contain', 'Log out');
        });

        it('logged out user sees a "Log in" button"', () => {
            cy.visit('http://localhost:8080/?user=public');
            cy.viewport(1280, 900);
            cy.injectAxe();
            cy.checkA11y('auth-button', {
                reportName: 'Auth Loggedout',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.get('uq-site-header').find('auth-button').should('exist');
            cy.get('auth-button').shadow().find('#auth-log-in-label').should('contain', 'Log in');
        });

    });
});

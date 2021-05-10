/// <reference types="cypress" />
import uqrdav10 from '../../mock/data/account';
import ApiAccess from '../../src/ApiAccess/ApiAccess';

describe('Auth button', () => {
    context('Auth button', () => {
        it('logged in user sees a "Log out" button', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.injectAxe();
            cy.checkA11y('auth-button', {
                reportName: 'Auth Loggedin',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.get('uq-site-header').find('auth-button').should('exist');
            cy.get('auth-button').shadow().find('#auth-log-out-label').should('contain', 'Log out');
        });

        it('another logged in user sees a "Log out" button', () => {
            cy.visit('http://localhost:8080/?user=s1111111');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.get('uq-site-header').find('auth-button').should('exist');
            cy.get('auth-button').shadow().find('#auth-log-out-label').should('contain', 'Log out');
        });

        it('logged out user sees a "Log in" button"', () => {
            cy.visit('http://localhost:8080/?user=public');
            cy.viewport(1280, 900);
            cy.injectAxe();
            cy.wait(100);
            cy.checkA11y('auth-button', {
                reportName: 'Auth Loggedout',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.get('uq-site-header').find('auth-button').should('exist');
            cy.get('auth-button').shadow().find('#auth-log-in-label').should('contain', 'Log in');
        });

        // this should probably be done in jest instead?
        async function checkStorage() {
            await new ApiAccess().getAccount().then((newAccount) => {
                // dummy get
                cy.get('auth-button').eq(newAccount, false);
                cy.get('auth-button').eq(sessionStorage.length, 0);
            });
        }

        it('account with out of date session storage is not used', () => {
            const store = new ApiAccess();
            store.storeAccount(uqrdav10, -24);

            checkStorage();
        });
    });
});

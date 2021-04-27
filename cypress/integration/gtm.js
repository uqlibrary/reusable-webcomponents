/// <reference types="cypress" />
import gtm from "../../src/GTM/gtm";

describe('GTM', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
        cy.injectAxe();
        cy.intercept('GET', 'https://www.googletagmanager.com/gtm.js', (req) => {
            expect(req.url).to.contain('ABC123');
            req.reply(200, );
        }).as('gtm');
        cy.intercept('GET', 'https://www.googletagmanager.com/ns.html', (req) => {
            expect(req.url).to.contain('ABC123');
            req.reply(200, );
        }).as('gtmns');
    });
    context('GTM', () => {
        it('uq-gtm component starts with null gtm value until attr set', () => {
            cy.viewport(1280, 900);
            // No attributed on load
            cy.get('uq-gtm').should('not.have.attr', 'gtm');

            // Now inject the atttribute as load.js would
            cy.window().then(win => {
                const gtmElement = win.document.getElementsByTagName('uq-gtm');
                gtmElement[0].setAttribute('gtm', 'ABC123');
            });
            // Checks that it tried to call the gtm APIs and got a mocked response
            cy.wait('@gtm').its('response.statusCode').should('equal', 200)
            cy.wait('@gtmns').its('response.statusCode').should('equal', 200)
            // The DOM element should have the right attribute
            cy.get('uq-gtm').should('have.attr', 'gtm', 'ABC123');

        });
    });
});

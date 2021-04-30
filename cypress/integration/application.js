/// <reference types="cypress" />

describe('Dummy Application', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/index-via-js.html');
        cy.injectAxe();
    });
    context('Works as expected', () => {
        it('Javascript calls act correctly', () => {
            cy.viewport(1280, 900);
            // applications/testing can remove the Library entry from the global menu
            cy.get('uq-header').shadow().find('div.nav-global').find('#menu-item-library').should('not.exist');
            // applications/testing has a skip nav button
            cy.get('uq-header').shadow().find('button[data-testid="skip-nav"]').should('exist');
            // has an askus button
            cy.get('askus-button').shadow().find('button[data-testid="askus-button"]').should('exist');
            // has a mylibrary button
            cy.get('mylibrary-button').shadow().find('button[data-testid="mylibrary-button"]').should('exist');
            // has an auth button
            cy.get('auth-button').shadow().find('button[data-testid="auth-button-logout"]').should('exist');
            // has a mega menu
            // the menu appears on click
            cy.get('uq-site-header').shadow().find('nav#jsNav').should('be.visible');
            // and has the correct children
            cy.get('uq-site-header').shadow().find('nav#jsNav').find('ul').should('have.length', 7); // should we drive this number from the json?
        });
    });
});

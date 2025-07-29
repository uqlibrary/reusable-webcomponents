/// <reference types="cypress" />

describe('VPN', () => {
    context('VPN', () => {
        it('user is warned they need vpn when an api completely fails', () => {
            // note this is only done on dev servers
            cy.visit('http://localhost:8080/?user=errorUser');
            cy.viewport(1280, 900);

            cy.waitUntil(() => cy.get('[data-testid="vpn-needed-toast"]').should('exist'));
            cy.get('[data-testid="vpn-needed-toast"]')
                .should('be.visible')
                .should('have.css', 'background-color', 'rgb(214, 41, 41)');
        });
        it('when no error, no warning', () => {
            // note this is only done on dev servers
            cy.visit('http://localhost:8080/');
            cy.viewport(1280, 900);

            cy.get('[data-testid="vpn-needed-toast"]').should('not.exist');
        });
    });
});

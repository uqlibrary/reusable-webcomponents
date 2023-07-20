/// <reference types="cypress" />

describe('Skip nav', () => {
    context('Skip Menu Accessibility', () => {
        it('Skip menu passes accessibility', () => {
            cy.visit('http://localhost:8080');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.get('uq-header').shadow().find('#skip-nav').focus();
            cy.wait(1000);
            cy.checkA11y('uq-header', {
                reportName: 'Skip Nav',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
    context('Skip Menu off', () => {
        it('No Skip works as expected', () => {
            cy.visit('http://localhost:8080/index-noauth-nomenu-noskip.html');
            cy.viewport(1280, 900);
            cy.get('uq-header').shadow().find('#skip-nav').should('not.be.visible');
        });
    });
    context('Skip Menu on', () => {
        it('Skip works as expected', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.get('uq-header').shadow().find('button[data-testid="skip-nav"]').focus().click();
            cy.wait(100);
            cy.focused().should('have.attr', 'id', 'skiptohere');
        });
    });
});

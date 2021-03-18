/// <reference types="cypress" />

describe('AskUs menu', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
        cy.injectAxe();
    });
    context('ASkUs Menu', () => {
        it('Appears as expected', () => {
            cy.viewport(1280, 900);
            cy.get('uq-site-header').find('askus-button').should('exist');
            cy.get('askus-button').shadow().find('div#askus').should('contain', 'AskUs');
            cy.get('askus-button').shadow().find('button#askus-button').click();
            cy.wait(500);
            cy.get('askus-button').shadow().find('ul.askus-menu-list').find('li').should('have.length', 6);
        });

        it('AskUs passes accessibility', () => {
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('button#askus-button').click();
            cy.wait(500);
            cy.checkA11y('askus-button', {
                reportName: 'AskUs',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});

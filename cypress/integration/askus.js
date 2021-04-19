/// <reference types="cypress" />

describe('AskUs menu', () => {
    context('AskUs Menu', () => {
        it('Appears as expected', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('uq-site-header').find('askus-button').should('exist');
            cy.get('askus-button').shadow().find('div#askus').should('contain', 'AskUs');
            cy.get('askus-button').shadow().find('button#askus-button').click();
            cy.wait(500);
            cy.get('askus-button').shadow().find('ul.askus-menu-list').find('li').should('have.length', 6);

            cy.get('askus-button').shadow().find('#askus-chat-online').should('exist');
            cy.get('askus-button').shadow().find('#askus-chat-online').should('not.have.css', 'display', 'none');
            cy.get('askus-button').shadow().find('#askus-chat-offline').should('have.css', 'display', 'none');
        });

        it('AskUs passes accessibility', () => {
            cy.visit('http://localhost:8080');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('button#askus-button').click();
            cy.wait(500);
            cy.checkA11y('askus-button', {
                reportName: 'AskUs',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('Can hide proactive chat button', () => {
            cy.visit('http://localhost:8080/index-noauth-nomenu-noskip.html');
            cy.viewport(1280, 900);
            cy.get('uq-site-header').find('askus-button').should('exist');
            cy.wait(500);
            cy.get('askus-button').shadow().find('#askus-chat-online').should('exist');
            cy.get('askus-button').shadow().find('#askus-chat-online').should('have.css', 'display', 'none');
            cy.get('askus-button').shadow().find('#askus-chat-offline').should('exist');
            cy.get('askus-button').shadow().find('#askus-chat-offline').should('have.css', 'display', 'none');
        });
    });
});

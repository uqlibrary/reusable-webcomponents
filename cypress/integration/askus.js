/// <reference types="cypress" />

describe('AskUs menu', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
        cy.injectAxe();
    });
    context('AskUs Menu', () => {
        it('Appears as expected', () => {
            cy.viewport(1280, 900);
            cy.wait(100);
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

    context('Proactive chat', () => {

        it('Appears as expected', () => {
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('#askus-proactive-chat').should('not.be.visible');
            cy.wait(1500);
            cy.get('askus-button').shadow().find('div#askus-proactive-chat').should('have.class', 'show');
        });

        //TODO: Add tests that mock the window.location.hostname to check primo functionality
        // it('Does not appear as expected on search.library.uq.edu.au', () => {
        //     // cy.window().then(win => win.location.hostname = 'search.library.uq.edu.au');
        //     cy.window().then(win => console.log(win.location.hostname));
        //     // cy.state('window').location.hostname = 'search.library.uq.edu.au';
        //     cy.viewport(1280, 900);
        //     cy.get('askus-button').shadow().find('#askus-proactive-chat').should('not.be.visible');
        // });

        it('Proactive chat passes accessibility', () => {
            cy.viewport(1280, 900);
            cy.wait(1500);
            cy.checkA11y('askus-button', {
                reportName: 'Proactive chat',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});

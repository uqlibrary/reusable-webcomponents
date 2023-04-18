/// <reference types="cypress" />

describe('AskUs menu', () => {
    context('AskUs Menu', () => {
        it('Appears as expected', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.get('uq-site-header').find('askus-button').should('exist');
            cy.get('askus-button').shadow().find('div#askus').should('contain', 'AskUs');
            cy.get('askus-button').shadow().find('button#askus-button').click();
            cy.wait(500);
            cy.get('askus-button').shadow().find('ul.askus-menu-list').find('li').should('have.length', 6);

            cy.get('proactive-chat').shadow().find('#proactive-chat-online').should('exist');
            cy.get('proactive-chat').shadow().find('#proactive-chat-online').should('not.have.css', 'display', 'none');
            cy.get('proactive-chat').shadow().find('#proactive-chat-offline').should('have.css', 'display', 'none');
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

        it('Askus Pane Opacity can be removed, as needed for Primo', () => {
            cy.visit('http://localhost:8080/index-primo.html');
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('button#askus-button').click();
            cy.get('askus-button').shadow().find('div#askus-pane').should('have.class', 'noOpacity');
        });

        it('Pressing esc closes the askus menu', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('button#askus-button').click();
            cy.wait(500);
            cy.get('askus-button').shadow().find('div#askus-menu').should('be.visible');
            cy.get('body').type('{enter}', { force: true });
            cy.wait(500);
            cy.get('askus-button').shadow().find('div#askus-menu').should('be.visible');
            cy.get('body').type('{esc}', { force: true });
            cy.wait(500);
            cy.get('askus-button').shadow().find('div#askus-menu').should('not.be.visible');
        });
        it('Clicking the pane closes the askus menu', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('button#askus-button').click();
            cy.wait(500);
            cy.get('askus-button').shadow().find('div#askus-menu').should('be.visible');
            cy.get('askus-button').shadow().find('div#askus-pane').click();
            cy.wait(500);
            cy.get('askus-button').shadow().find('div#askus-menu').should('not.be.visible');
        });

        it('Randomly chosen entry in askus dialog has a link', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('button#askus-button').click();
            cy.get('askus-button')
                .shadow()
                .contains('More ways to contact us')
                .should('have.attr', 'href', 'https://web.library.uq.edu.au/contact-us');
        });
        it('Displays as offline when chat status api is 403', () => {
            cy.visit('http://localhost:8080/?user=errorUser');
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('#askus-chat-time').should('exist').should('have.value', '');
            cy.get('askus-button').shadow().find('#askus-phone-time').should('exist').should('have.value', '');
        });
    });
});

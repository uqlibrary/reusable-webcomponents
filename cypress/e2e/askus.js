/// <reference types="cypress" />

function openAskusPopup() {
    cy.get('askus-button').shadow().find('[aria-label="AskUs contact options"]').should('contain', 'AskUs').click();
}

describe('AskUs menu', () => {
    context('AskUs Menu', () => {
        it('Appears as expected', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.get('uq-site-header').find('askus-button').should('exist');
            openAskusPopup();
            cy.wait(500);
            cy.get('askus-button').shadow().find('ul.askus-menu-list').find('li').should('have.length', 6);
        });

        it('AskUs passes accessibility', () => {
            cy.visit('http://localhost:8080');
            cy.injectAxe();
            cy.viewport(1280, 900);
            openAskusPopup();
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
            openAskusPopup();
            cy.get('askus-button').shadow().find('[data-testid="askus-pane"]').should('have.class', 'noOpacity');
        });

        it('Pressing esc closes the askus menu', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            openAskusPopup();
            cy.wait(500);
            cy.get('askus-button').shadow().find('[data-testid="askus-menu"]').should('be.visible');
            cy.get('body').type('{enter}', { force: true });
            cy.wait(500);
            cy.get('askus-button').shadow().find('[data-testid="askus-menu"]').should('be.visible');
            cy.get('body').type('{esc}', { force: true });
            cy.wait(500);
            cy.get('askus-button').shadow().find('[data-testid="askus-menu"]').should('not.be.visible');
        });
        it('Clicking the pane closes the askus menu', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            openAskusPopup();
            cy.wait(500);
            cy.get('askus-button').shadow().find('[data-testid="askus-menu"]').should('be.visible');
            cy.get('askus-button').shadow().find('[data-testid="askus-pane"]').click();
            cy.wait(500);
            cy.get('askus-button').shadow().find('[data-testid="askus-menu"]').should('not.be.visible');
        });

        it('Randomly chosen entry in askus dialog has a link', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            openAskusPopup();
            cy.get('askus-button')
                .shadow()
                .contains('More ways to contact us')
                .should('have.attr', 'href', 'https://web.library.uq.edu.au/contact-us');
        });
        it('Displays as offline when chat status api is 403', () => {
            cy.visit('http://localhost:8080/?user=errorUser');
            cy.injectAxe();
            cy.viewport(1280, 900);
            openAskusPopup();
            cy.get('askus-button')
                .shadow()
                .find('[data-testid="askus-chat-link"]')
                .should('exist')
                .should('have.value', '');
            cy.get('askus-button')
                .shadow()
                .find('[data-testid="askus-chat-time"]')
                .should('exist')
                .should('have.value', '');
        });
        it('Displays as offline after hours', () => {
            cy.visit('http://localhost:8080/?user=s1111111&chatstatusoffline=true');
            cy.injectAxe();
            cy.viewport(1280, 900);
            openAskusPopup();
            cy.wait(500);
            cy.checkA11y('askus-button', {
                reportName: 'AskUs',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.get('askus-button')
                .shadow()
                .find('[data-testid="askus-chat-link"]')
                .should('exist')
                .should('have.value', '');
            cy.get('askus-button')
                .shadow()
                .find('[data-testid="askus-phone-time"]')
                .should('exist')
                .should('have.value', '');
        });
    });
});

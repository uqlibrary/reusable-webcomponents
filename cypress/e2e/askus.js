/// <reference types="cypress" />

function openAskusPopup() {
    cy.get('askus-button').shadow().find('[aria-label="AskUs contact options"]').should('contain', 'AskUs').click();
}

describe('AskUs menu', () => {
    context('is accessible', () => {
        it('before opening', () => {
            cy.visit('http://localhost:8080');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.wait(500);
            cy.checkA11y('askus-button', {
                reportName: 'AskUs initial',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('when open', () => {
            cy.visit('http://localhost:8080');
            cy.injectAxe();
            cy.viewport(1280, 900);
            openAskusPopup();
            cy.wait(500);
            cy.checkA11y('askus-button', {
                reportName: 'AskUs open',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('when offline', () => {
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
        });
    });

    context('functionality', () => {
        it('Appears as expected', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.get('uq-site-header').find('askus-button').should('exist');
            openAskusPopup();
            cy.wait(500);
            cy.get('askus-button').shadow().find('ul.askus-menu-list').find('li').should('have.length', 6);
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
            cy.viewport(1280, 900);
            openAskusPopup();
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

        it('Navigates to CRM from "Chat with staff" button', () => {
            cy.visit('http://localhost:8080/', {
                onBeforeLoad(win) {
                    cy.stub(win, 'open');
                },
            });

            openAskusPopup();

            cy.get('askus-button').shadow().find('a:contains("Chat with staff")').click();

            // Assert that window.open was called
            cy.window().its('open').should('be.called');
        });

        it('AI chatbot iframe opens from askus button click', () => {
            cy.visit('http://localhost:8080/');
            cy.viewport(1280, 900);
            openAskusPopup();

            cy.get('askus-button').shadow().find('[data-testid="askus-aibot-button"]').should('exist').click();

            // let the iframe finish drawing
            cy.wait(4000);

            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="chatbot-wrapper"]')
                .should('exist')
                .should('be.visible');
            // well, at least we know the iframe appears on the page!
        });

        it('when chatbot is known to be broken, the patron only gets a link to CRM chat', () => {
            cy.visit('http://localhost:8080/index-app-nochatbot.html');
            cy.viewport(1280, 900);
            openAskusPopup();

            cy.get('askus-button')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="askus-aibot-button"]').should('exist').should('not.be.visible');
                });
        });
    });
});

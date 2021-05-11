/// <reference types="cypress" />

//TODO: Need to stub the mock API response to test chat offline etc.

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

        it('On primo it doesnt show the blanking pane', () => {
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
            cy.get('body').type('{enter}', { force: true })
            cy.wait(500);
            cy.get('askus-button').shadow().find('div#askus-menu').should('be.visible');
            cy.get('body').type('{esc}', { force: true })
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

        it('Navigates to contact from askus menu', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('button#askus-button').click();
            cy.get('askus-button').shadow().find('a[data-testid="askus-menu-moreways"').should("have.attr", "href", "https://web.library.uq.edu.au/contact-us");
        });

        it('Navigates to contact from offline chat icon', () => {
            cy.visit('http://localhost:8080?chatstatusoffline=true');
            cy.viewport(1280, 900);
            cy.wait(1500);
            cy.intercept('GET', 'https://support.my.uq.edu.au/app/library/contact', {
                statusCode: 200,
                body: 'it worked!',
            })
            cy.get('askus-button').shadow().find('div#askus-chat-offline').click();
            cy.get('body').contains('it worked!');
        });
    });

    context('Proactive chat', () => {
        it('Appears as expected', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('#askus-proactive-chat').should('not.be.visible');
            cy.wait(1500);
            cy.get('askus-button').shadow().find('div#askus-proactive-chat').should('have.class', 'show');
        });

        it('Proactive chat passes accessibility', () => {
            cy.visit('http://localhost:8080');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.wait(1500);
            cy.checkA11y('askus-button', {
                reportName: 'Proactive chat',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('Can hide proactive chat button', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('#askus-proactive-chat').should('not.be.visible');
            cy.get('askus-button').shadow().find('div#askus-proactive-chat').should('not.have.class', 'show');
            cy.getCookie('UQ_ASKUS_PROACTIVE_CHAT').should('not.exist');
            cy.wait(1500);
            cy.get('askus-button').shadow().find('div#askus-proactive-chat').should('have.class', 'show');
            cy.get('askus-button').shadow().find('button#askus-proactive-chat-button-close').click();
            cy.getCookie('UQ_ASKUS_PROACTIVE_CHAT').should('have.property', 'value', 'hidden');
            cy.get('askus-button').shadow().find('#askus-proactive-chat-wrapper').should('not.exist');

            cy.visit('http://localhost:8080');
            cy.getCookie('UQ_ASKUS_PROACTIVE_CHAT').should('have.property', 'value', 'hidden');
            cy.wait(1500);
            cy.get('askus-button').shadow().find('div#askus-proactive-chat').should('not.have.class', 'show');

        });

        it('Can open chat window', () => {
            cy.visit('http://localhost:8080', {
                onBeforeLoad(win) {
                    cy.stub(win, 'open');
                },
            });
            cy.viewport(1280, 900);
            cy.get('askus-button').shadow().find('#askus-proactive-chat').should('not.be.visible');
            cy.get('askus-button').shadow().find('div#askus-proactive-chat').should('not.have.class', 'show');
            cy.getCookie('UQ_ASKUS_PROACTIVE_CHAT').should('not.exist');
            cy.wait(1500);
            cy.get('askus-button').shadow().find('div#askus-proactive-chat').should('have.class', 'show');
            cy.get('askus-button').shadow().find('button#askus-proactive-chat-button-open').click();
            cy.window().its('open').should('be.called');
        });
    });
});

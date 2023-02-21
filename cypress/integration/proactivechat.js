describe('Proactive Chat', () => {
    context('Proactive chat', () => {
        it('Appears as expected', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('proactive-chat').shadow().find('#proactive-chat').should('not.be.visible');
            cy.wait(1500);
            cy.get('proactive-chat').shadow().find('div#proactive-chat').should('have.class', 'show');
        });

        it('Proactive chat passes accessibility', () => {
            cy.visit('http://localhost:8080');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.wait(1500);
            cy.checkA11y('proactive-chat', {
                reportName: 'Proactive chat',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('Can hide proactive chat button', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('proactive-chat').shadow().find('#proactive-chat').should('not.be.visible');
            cy.get('proactive-chat').shadow().find('div#proactive-chat').should('not.have.class', 'show');
            cy.getCookie('UQ_PROACTIVE_CHAT').should('not.exist');
            cy.wait(1500);
            cy.get('proactive-chat').shadow().find('div#proactive-chat').should('have.class', 'show');
            cy.get('proactive-chat').shadow().find('button#proactive-chat-button-close').click();
            cy.getCookie('UQ_PROACTIVE_CHAT').should('have.property', 'value', 'hidden');
            cy.get('proactive-chat').shadow().find('#proactive-chat-wrapper').should('not.exist');

            cy.visit('http://localhost:8080');
            cy.getCookie('UQ_PROACTIVE_CHAT').should('have.property', 'value', 'hidden');
            cy.wait(1500);
            cy.get('proactive-chat').shadow().find('div#proactive-chat').should('not.have.class', 'show');
        });

        it('Can open chat window', () => {
            cy.visit('http://localhost:8080', {
                onBeforeLoad(win) {
                    cy.stub(win, 'open');
                },
            });
            cy.viewport(1280, 900);
            cy.get('proactive-chat').shadow().find('#proactive-chat').should('not.be.visible');
            cy.get('proactive-chat').shadow().find('div#proactive-chat').should('not.have.class', 'show');
            cy.getCookie('UQ_PROACTIVE_CHAT').should('not.exist');
            cy.wait(1500);
            cy.get('proactive-chat').shadow().find('div#proactive-chat').should('have.class', 'show');
            cy.get('proactive-chat').shadow().find('button#proactive-chat-button-open').click();
            cy.window().its('open').should('be.called');
        });

        it('Navigates to contact from offline proactive chat icon', () => {
            cy.visit('http://localhost:8080?chatstatusoffline=true', {
                onBeforeLoad(win) {
                    cy.stub(win, 'open');
                },
            });
            cy.viewport(1280, 900);
            cy.wait(1500);
            cy.get('proactive-chat').shadow().find('div#proactive-chat-offline').click();
            cy.window().its('open').should('be.called');
        });

        it('Displays as offline when chat status api is 403', () => {
            cy.visit('http://localhost:8080/?user=errorUser');
            cy.viewport(1280, 900);
            cy.get('proactive-chat').shadow().find('#proactive-chat-online').should('exist');
            cy.get('proactive-chat').shadow().find('#proactive-chat-online').should('have.css', 'display', 'none');
            cy.get('proactive-chat').shadow().find('#proactive-chat-offline').should('exist');
            cy.get('proactive-chat').shadow().find('#proactive-chat-offline').should('not.have.css', 'display', 'none');
            cy.get('askus-button').shadow().find('#askus-chat-time').should('exist');
            cy.get('askus-button').shadow().find('#askus-chat-time').should('have.value', '');
            cy.get('askus-button').shadow().find('#askus-phone-time').should('exist');
            cy.get('askus-button').shadow().find('#askus-phone-time').should('have.value', '');
        });
    });
});

describe('Cultural Advice', () => {
    context('Popup', () => {
        it('Appears as expected', () => {
            cy.visit('http://localhost:8080/index-culturaladvice.html');
            cy.viewport(1280, 900);
            cy.get('cultural-advice-popup').shadow().find('#culturaladvice-container').should('be.visible');
            cy.wait(1500);
            cy.get('proactive-chat').shadow().find('div#proactive-chat').should('have.class', 'show');
        });

        it('Cultural Advice passes accessibility', () => {
            cy.visit('http://localhost:8080/index-culturaladvice.html');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.wait(1500);
            cy.checkA11y('cultural-advice-popup', {
                reportName: 'Cultural Advice Popup',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('Can hide and show cultural advice', () => {
            cy.visit('http://localhost:8080/index-culturaladvice.html');
            cy.viewport(1280, 900);
            cy.get('cultural-advice-popup').shadow().find('#culturaladvice-container').should('be.visible');
            cy.get('cultural-advice-popup').shadow().find('#culturaladvice-tab').should('not.be.visible');
            // cy.get('proactive-chat').shadow().find('div#proactive-chat').should('not.have.class', 'show');
            cy.getCookie('UQ_CULTURAL_ADVICE').should('not.exist');
            cy.wait(1500);
            cy.get('cultural-advice-popup').shadow().find('span#culturaladvice-container-dismiss').click();
            cy.getCookie('UQ_CULTURAL_ADVICE').should('have.property', 'value', 'hidden');
            cy.get('cultural-advice-popup').shadow().find('#culturaladvice-container').should('not.be.visible');
            cy.get('cultural-advice-popup').shadow().find('#culturaladvice-tab').should('be.visible');
            cy.get('cultural-advice-popup').shadow().find('#culturaladvice-tab').click();
            cy.wait(1000);
            cy.get('cultural-advice-popup').shadow().find('#culturaladvice-container').should('be.visible');
            cy.get('cultural-advice-popup').shadow().find('#culturaladvice-tab').should('not.be.visible');
        });
    });
});

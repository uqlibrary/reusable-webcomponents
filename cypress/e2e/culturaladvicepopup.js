function openCulturalAdvicePopup() {
    cy.get('cultural-advice-popup').shadow().find('[data-testid="culturaladvice-tab"]').should('be.visible').click();
}

function closeCulturalAdvicePopup() {
    cy.get('cultural-advice-popup').shadow().find('button[title="close cultural advice"]').click();
}

function assertCulturalAdvicePopupClosed() {
    cy.get('cultural-advice-popup').shadow().find('[data-testid="culturaladvice-container"]').should('not.be.visible');
    cy.get('cultural-advice-popup').shadow().find('[data-testid="culturaladvice-tab"]').should('be.visible');
}

function assertCulturalAdvicePopupOpen() {
    cy.get('cultural-advice-popup').shadow().find('[data-testid="culturaladvice-container"]').should('be.visible');
    cy.get('cultural-advice-popup').shadow().find('[data-testid="culturaladvice-tab"]').should('not.be.visible');
}

function assertProactiveChatVisibility(isVisible) {
    if (!!isVisible) {
        cy.get('proactive-chat')
            .shadow()
            .find('button:contains("Chat with Library staff")')
            .parent()
            .parent()
            .should('have.class', 'show');
    } else {
        cy.get('proactive-chat').shadow().find('button:contains("Chat with Library staff")').should('not.be.visible');
    }
}

describe('Cultural Advice', () => {
    context('Popup', () => {
        beforeEach(() => {
            cy.visit('http://localhost:8080/index.html');
        });
        it('is accessible on the desktop', () => {
            cy.viewport(1280, 900);
            // assertCulturalAdvicePopupOpen();
            // cy.wait(1500);
            // // because this is desktop width, proactive chat is visible
            // assertProactiveChatVisibility(true);

            cy.injectAxe();
            cy.checkA11y('cultural-advice-v2', {
                reportName: 'Cultural Advice Popup',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('is accessible on mobile', () => {
            cy.viewport(320, 480);
            // assertCulturalAdvicePopupOpen();
            // cy.wait(1500);
            // // because this is mobile width, proactive chat is not visible
            // assertProactiveChatVisibility(false);

            cy.injectAxe();
            cy.checkA11y('cultural-advice-v2', {
                reportName: 'Cultural Advice Popup',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        // it('Can hide and show cultural advice', () => {
        //     cy.viewport(1280, 900);
        //     assertCulturalAdvicePopupOpen();
        //     cy.getCookie('UQ_CULTURAL_ADVICE').should('not.exist');

        //     cy.wait(1500);
        //     closeCulturalAdvicePopup();
        //     cy.getCookie('UQ_CULTURAL_ADVICE').should('have.property', 'value', 'hidden');
        //     assertCulturalAdvicePopupClosed();

        //     openCulturalAdvicePopup();
        //     cy.wait(1000);
        //     assertCulturalAdvicePopupOpen();
        // });
    });
});

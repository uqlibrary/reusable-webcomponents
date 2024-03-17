function assertPopupIsHidden() {
    cy.get('proactive-chat')
        .shadow()
        .find('button:contains("Maybe later")')
        .parent()
        .parent()
        .should('not.be.visible')
        .should('not.have.class', 'show');
}

function assertPopupIsOpen() {
    cy.get('proactive-chat')
        .shadow()
        .find('button:contains("Maybe later")')
        .parent()
        .parent()
        .should('be.visible')
        .should('have.class', 'show');
    // blue 'open chat popup' button is present
    cy.get('proactive-chat')
        .shadow()
        .find('button:contains("Chat now")')
        .should('have.css', 'background-color', 'rgb(35, 119, 203)');
    // grey 'maybe later' (minimise popup) button is present
    cy.get('proactive-chat')
        .shadow()
        .find('button:contains("Maybe later")')
        .should('have.css', 'background-color', 'rgb(204, 204, 204)');
}

function minimiseChatPopup() {
    cy.get('proactive-chat').shadow().find('button:contains("Maybe later")').should('exist').click();
}

function assertHideChatCookieisSet() {
    cy.getCookie('UQ_PROACTIVE_CHAT').should('have.property', 'value', 'hidden');
}

describe('Proactive Chat', () => {
    context('Proactive chat', () => {
        it('Appears popped open on user first visit', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            // initially the proactive chat popup is minimised
            // (for users who know what they want don't need to see it - a little hesitation and maybe they want assistance)
            assertPopupIsHidden();

            // manually wait
            cy.wait(1500);

            // now the popup is open (simulate user first visit, no "hide" cookie present)
            assertPopupIsOpen();
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
            assertPopupIsHidden(); // the popup only displays after a delay

            cy.getCookie('UQ_PROACTIVE_CHAT').should('not.exist');
            cy.wait(1500);
            assertPopupIsOpen();

            minimiseChatPopup();
            assertHideChatCookieisSet();
            assertPopupIsHidden();

            // reload the page and, because of the cookie, the popup doesn't appear
            cy.visit('http://localhost:8080');
            assertHideChatCookieisSet();
            cy.wait(1500);
            assertPopupIsHidden();
            // "offline Minimised" button is hodden
            cy.get('proactive-chat')
                .shadow()
                .find('[title="Chat currently closed"]')
                .should('exist')
                .should('not.be.visible')
                .should('have.css', 'display', 'none');
            // "online Minimised" button is visible
            cy.get('proactive-chat')
                .shadow()
                .find('[title="Click to open online chat"]')
                .should('exist')
                .should('be.visible')
                .should('not.have.css', 'display', 'none')
                .should('have.css', 'background-color', 'rgb(0, 114, 0)')
                .parent()
                .should('have.css', 'right', '16px');
        });

        it('Can open chat window', () => {
            cy.visit('http://localhost:8080', {
                onBeforeLoad(win) {
                    cy.stub(win, 'open');
                },
            });
            cy.viewport(1280, 900);
            assertPopupIsHidden();

            cy.getCookie('UQ_PROACTIVE_CHAT').should('not.exist');
            cy.wait(1500);
            assertPopupIsOpen();
            cy.get('proactive-chat').shadow().find('button:contains("Chat now")').should('exist').click();
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
            cy.get('proactive-chat').shadow().find('[title="Chat currently closed"]').click();
            cy.window().its('open').should('be.called');
        });

        it('Displays as offline when chat status api is 403', () => {
            cy.visit('http://localhost:8080/?user=errorUser');
            cy.viewport(1280, 900);

            // "online Minimised" button is hidden
            cy.get('proactive-chat')
                .shadow()
                .find('[title="Click to open online chat"]')
                .should('exist')
                .should('not.be.visible')
                .should('have.css', 'display', 'none');
            // "offline Minimised" button shows
            cy.get('proactive-chat')
                .shadow()
                .find('[title="Chat currently closed"]')
                .should('exist')
                .should('be.visible')
                .should('not.have.css', 'display', 'none')
                .should('have.css', 'background-color', 'rgb(196, 0, 0)')
                .parent()
                .should('have.css', 'right', '16px');
        });
    });
});

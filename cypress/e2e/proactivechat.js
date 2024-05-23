function assertPopupIsHidden() {
    cy.get('proactive-chat')
        .shadow()
        .find('[data-testid="close-button"]')
        .parent()
        .should('not.be.visible')
        .should('not.have.class', 'show');
}

function assertPopupIsOpen() {
    cy.get('proactive-chat')
        .shadow()
        .find('button:contains("Ask Library Chatbot")')
        .parent()
        .parent()
        .should('be.visible')
        .should('have.class', 'show');
    // blue 'open chat popup' button is present
    cy.get('proactive-chat')
        .shadow()
        .find('button:contains("Ask Library Chatbot")')
        .should('have.css', 'background-color', 'rgb(35, 119, 203)');
}

function minimiseChatPopup() {
    cy.get('proactive-chat').shadow().find('[data-testid="close-button"]').should('exist').click();
}

function assertHideChatCookieisSet() {
    cy.getCookie('UQ_PROACTIVE_CHAT').should('have.property', 'value', 'hidden');
}

describe('Proactive Chat', () => {
    context('Proactive chat', () => {
        it('will load popped open on user first visit', () => {
            cy.visit('http://localhost:8080/index-chat-fast.html');
            cy.viewport(1280, 900);

            // manually wait
            cy.wait(100);

            // now the popup is open (simulate user first visit, no "hide" cookie present)
            assertPopupIsOpen();
        });

        context('Proactive chat passes accessibility', () => {
            it('green minimised', () => {
                cy.visit('http://localhost:8080/index-chat-slow.html');
                cy.injectAxe();
                cy.viewport(1280, 900);
                cy.checkA11y('proactive-chat', {
                    reportName: 'Proactive chat green icon',
                    scopeName: 'Accessibility',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('red offline', () => {
                cy.visit('http://localhost:8080?chatstatusoffline=true');
                cy.injectAxe();
                cy.viewport(1280, 900);
                cy.waitUntil(() =>
                    cy.get('proactive-chat').shadow().find('[title="Chat currently closed"]').should('exist'),
                );
                cy.checkA11y('proactive-chat', {
                    reportName: 'Proactive chat red icon',
                    scopeName: 'Accessibility',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('proactive chat open', () => {
                cy.visit('http://localhost:8080/index-chat-fast.html');
                cy.injectAxe();
                cy.viewport(1280, 900);
                cy.checkA11y('proactive-chat', {
                    reportName: 'Proactive chat proactive chat open',
                    scopeName: 'Accessibility',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
        });

        it('Can hide proactive chat button', () => {
            cy.visit('http://localhost:8080/index-chat-fast.html');
            cy.viewport(1280, 900);

            cy.getCookie('UQ_PROACTIVE_CHAT').should('not.exist');

            // manually wait
            cy.wait(100);
            assertPopupIsOpen();

            minimiseChatPopup();
            assertHideChatCookieisSet();
            assertPopupIsHidden();

            // reload the page and, because of the cookie, the popup doesn't appear
            cy.visit('http://localhost:8080');
            assertHideChatCookieisSet();
            cy.wait(1500); //give it a long time to confirm
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

        it('Navigates to CRM from "Chat with Library staff" button', () => {
            cy.visit('http://localhost:8080/index-chat-fast.html', {
                onBeforeLoad(win) {
                    cy.stub(win, 'open');
                },
            });

            cy.get('proactive-chat').shadow().find('button:contains("Chat with Library staff")').click();

            // Assert that window.open was called
            cy.window().its('open').should('be.called');
        });

        it('Navigates to CRM from iframe "Person" button', () => {
            // Stub the window.open method
            cy.visit('http://localhost:8080/index-chat-slow.html', {
                onBeforeLoad(win) {
                    cy.stub(win, 'open');
                },
            });

            cy.viewport(1280, 900);
            cy.get('proactive-chat').shadow().find('[data-testid="proactive-chat-online"]').should('exist').click();

            // can see iframe
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="chatbot-wrapper"]')
                .should('exist')
                .should('be.visible');

            // can click "person" button
            cy.get('proactive-chat').shadow().find('[data-testid="openCrm"]').should('exist').click();

            // Assert that window.open was called
            cy.window().its('open').should('be.called');
        });

        it('AI chatbot iframe opens from proactive dialog', () => {
            cy.visit('http://localhost:8080/index-chat-fast.html');
            cy.viewport(1280, 900);

            cy.getCookie('UQ_PROACTIVE_CHAT').should('not.exist');

            // manually wait
            cy.wait(100);

            assertPopupIsOpen();
            cy.get('proactive-chat').shadow().find('button:contains("Ask Library Chatbot")').should('exist').click();

            // let the iframe finish drawing
            cy.wait(4000);

            cy.get('proactive-chat').shadow().find('[data-testid="chatbot-wrapper"]').should('exist'); // well, at least we know the iframe reaches the page!

            // can close iframe
            cy.get('proactive-chat').shadow().find('[data-testid="closeIframeButton"]').should('exist').click();
            // once the chatbot is closed, the minimised icon appears
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="proactive-chat-online"]')
                .should('exist')
                .should('be.visible');
        });

        it('AI chatbot iframe opens from minimised button and close button works properly', () => {
            // delay the proactive apearance so we can reliably click on the green button
            cy.visit('http://localhost:8080/index-chat-slow.html');
            cy.viewport(1280, 900);
            cy.get('proactive-chat').shadow().find('[data-testid="proactive-chat-online"]').should('exist').click();

            // can see iframe
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="chatbot-wrapper"]')
                .should('exist')
                .should('be.visible');

            // can close iframe
            cy.get('proactive-chat').shadow().find('[data-testid="closeIframeButton"]').should('exist').click();
            // once the chatbot is closed, the minimised icon appears
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="proactive-chat-online"]')
                .should('exist')
                .should('be.visible');

            // iframe now hidden, showing the close button works
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="chatbot-wrapper"]')
                .should('exist')
                .should('not.be.visible');

            // can reopen iframe
            cy.get('proactive-chat').shadow().find('[data-testid="proactive-chat-online"]').should('exist').click();
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="chatbot-wrapper"]')
                .should('exist')
                .should('be.visible');
        });

        it('Navigates to chatbot from offline proactive chat icon', () => {
            cy.visit('http://localhost:8080?chatstatusoffline=true');
            cy.viewport(1280, 900);
            cy.wait(1500);
            cy.get('proactive-chat').shadow().find('[title="Chat currently closed"]').click();

            // can see iframe
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="chatbot-wrapper"]')
                .should('exist')
                .should('be.visible');
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

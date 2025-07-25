import { COLOUR_UQ_PURPLE } from '../../src/UtilityArea/helpers';
const COLOUR_UQ_GREY300 = 'rgb(117, 115, 119)';

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
        .should('have.css', 'background-color', COLOUR_UQ_PURPLE);
}

function minimiseChatPopup() {
    cy.get('proactive-chat').shadow().find('[data-testid="close-button"]').should('exist').click();
}

function assertHideChatCookieisSet() {
    cy.getCookie('UQ_PROACTIVE_CHAT').should('have.property', 'value', 'hidden');
}

describe('Proactive Chat', () => {
    it('will proactively open on user first visit (when "hide" cookie is not set)', () => {
        cy.visit('http://localhost:8080/index-chat-fast.html');
        cy.viewport(1280, 900);

        // manually wait
        cy.wait(100);

        // now the popup is open (simulate user first visit, no "hide" cookie present)
        assertPopupIsOpen();
    });

    context('Proactive chat passes accessibility', () => {
        it('online minimised', () => {
            cy.visit('http://localhost:8080/index-chat-slow.html');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.checkA11y('proactive-chat', {
                reportName: 'Proactive chat green icon',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('offline minimised', () => {
            cy.visit('http://localhost:8080/index-chat-slow.html?chatstatusoffline=true');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.waitUntil(() =>
                cy.get('proactive-chat').shadow().find('[data-testid="proactive-chat-offline"]').should('exist'),
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

            cy.get('proactive-chat')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="popopen-button"]').focus();
                    cy.waitUntil(() =>
                        cy
                            .get('[data-testid="popopen-button"]')
                            .should('have.css', 'background-color', 'rgb(81, 36, 122)'),
                    );
                });
            cy.checkA11y('proactive-chat', {
                reportName: 'Proactive chat proactive chat hover',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('proactive chat open after hours', () => {
            cy.visit('http://localhost:8080/index-chat-fast.html?chatstatusoffline=true');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.checkA11y('proactive-chat', {
                reportName: 'Proactive chat proactive chat open',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('iframe open', () => {
            cy.visit('http://localhost:8080/index-chat-fast.html');
            cy.injectAxe();
            cy.viewport(1280, 900);

            // cy.get('proactive-chat').shadow().find('[data-testid="proactive-chat-online"]').should('exist').click();
            cy.waitUntil(() =>
                cy
                    .get('proactive-chat')
                    .shadow()
                    .find('[data-testid="popopen-button"]')
                    .should('exist')
                    .should('be.visible'),
            );
            cy.get('proactive-chat').shadow().find('[data-testid="popopen-button"]').click();

            // can see iframe
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="chatbot-wrapper"]')
                .should('exist')
                .should('be.visible');

            cy.checkA11y('proactive-chat', {
                reportName: 'Proactive chat proactive chat open',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('iframe open after hours', () => {
            cy.visit('http://localhost:8080/index-chat-fast.html?chatstatusoffline=true');
            cy.injectAxe();
            cy.viewport(1280, 900);

            // cy.get('proactive-chat').shadow().find('[data-testid="proactive-chat-online"]').should('exist').click();
            cy.waitUntil(() =>
                cy
                    .get('proactive-chat')
                    .shadow()
                    .find('[data-testid="popopen-button"]')
                    .should('exist')
                    .should('be.visible'),
            );
            cy.get('proactive-chat').shadow().find('[data-testid="popopen-button"]').click();

            // can see iframe
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="chatbot-wrapper"]')
                .should('exist')
                .should('be.visible');

            cy.checkA11y('proactive-chat', {
                reportName: 'Proactive chat proactive chat open',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });

    context('when online', () => {
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
            cy.visit('http://localhost:8080/index-chat-fast.html');
            assertHideChatCookieisSet();
            cy.wait(500); // give it time to appear if its going to
            assertPopupIsHidden();
            // "online Minimised" button is visible
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="proactive-chat-online"]')
                .should('exist')
                .should('be.visible')
                .should('not.have.css', 'display', 'none')
                .should('have.css', 'background-color', COLOUR_UQ_PURPLE)
                .parent()
                .should('have.css', 'right', '16px');
            // "offline Minimised" button is hidden. Well duh, but just checking
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="proactive-chat-offline"]')
                .should('exist')
                .should('not.be.visible')
                .should('have.css', 'display', 'none');
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
            cy.waitUntil(() =>
                cy
                    .get('proactive-chat')
                    .shadow()
                    .find('[data-testid="popopen-button"]')
                    .should('exist')
                    .should('be.visible'),
            );
            cy.get('proactive-chat').shadow().find('[data-testid="popopen-button"]').click();

            // can see iframe
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="chatbot-wrapper"]')
                .should('exist')
                .should('be.visible');

            // can click "person" button
            cy.get('proactive-chat').shadow().find('[data-testid="speakToPerson"]').should('exist').click();

            // Assert that window.open was called
            cy.window().its('open').should('be.called');
        });

        it('AI chatbot iframe opens from proactive dialog for logged in user', () => {
            cy.visit('http://localhost:8080/index-chat-fast.html');
            cy.viewport(1280, 900);

            cy.getCookie('UQ_PROACTIVE_CHAT').should('not.exist');

            // manually wait
            cy.wait(100);

            assertPopupIsOpen();
            cy.get('proactive-chat').shadow().find('button:contains("Ask Library Chatbot")').should('exist').click();

            // let the iframe finish drawing
            cy.wait(4000);

            cy.get('proactive-chat')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="chatbot-wrapper"]').should('exist'); // well, at least we know the iframe reaches the page!

                    // logged in user is correctly attached to the page
                    cy.get('[data-testid="chatbot-iframe"]')
                        .should('exist')
                        .should(
                            'have.attr',
                            'src',
                            'http://localhost:2020/chatbot.html?name=Vanilla&email=vanilla@example.uq.edu.au',
                        );

                    // can close iframe
                    cy.get('[data-testid="closeIframeButton"]').should('exist').click();
                    // once the chatbot is closed, the minimised icon appears
                    cy.get('[data-testid="proactive-chat-online"]').should('exist').should('be.visible');

                    // can reopen iframe
                    cy.get('[data-testid="proactive-chat-online"]').should('exist').click();
                    cy.get('[data-testid="popopen-button"]').should('exist').click();
                    cy.get('[data-testid="chatbot-wrapper"]').should('exist').should('be.visible');
                });
        });

        it('AI chatbot iframe opens from proactive dialog for logged out user', () => {
            cy.visit('http://localhost:8080/index-chat-fast.html?user=public');
            cy.viewport(1280, 900);

            cy.getCookie('UQ_PROACTIVE_CHAT').should('not.exist');

            // manually wait
            cy.wait(100);

            assertPopupIsOpen();
            cy.get('proactive-chat')
                .shadow()
                .within(() => {
                    cy.get('button:contains("Ask Library Chatbot")').should('exist').click();

                    // let the iframe finish drawing
                    cy.wait(4000);

                    cy.get('[data-testid="chatbot-wrapper"]').should('exist'); // well, at least we know the iframe reaches the page!

                    // logged in user is correctly attached to the page
                    cy.get('[data-testid="chatbot-iframe"]')
                        .should('exist')
                        .should('have.attr', 'src', 'http://localhost:2020/chatbot.html'); // logged out so no user params
                });
        });

        it('minimised button focus opens proactive dialog', () => {
            // delay the proactive apearance so we can reliably click on the green button
            cy.visit('http://localhost:8080/index-chat-slow.html');
            cy.viewport(1280, 900);

            // proactive dialog is hidden
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="popupIsOpen"]')
                .should('exist')
                .should('not.be.visible');

            // this doesnt really test the mousover :( tried focus as proxy for mouseover and it couldnt focus :(
            cy.get('proactive-chat').shadow().find('[data-testid="proactive-chat-online"] svg').should('exist').click();

            // now proactive dialog shows
            cy.get('proactive-chat').shadow().find('[data-testid="popupIsOpen"]').should('exist').should('be.visible');
        });
    });

    context('when offline', () => {
        it('Navigates to chatbot when offline', () => {
            cy.visit('http://localhost:8080/index-chat-slow.html?chatstatusoffline=true');
            cy.viewport(1280, 900);

            // click minimised icon
            cy.get('proactive-chat').shadow().find('[data-testid="proactive-chat-offline"]').click();
            // click "ask library chatbot" button
            cy.get('proactive-chat').shadow().contains('button', 'Ask Library Chatbot').should('exist').click();

            // can see iframe
            cy.get('proactive-chat')
                .shadow()
                .find('[data-testid="chatbot-wrapper"]')
                .should('exist')
                .should('be.visible');
        });

        it('Navigates to contact us from proactive "Leave a question" button when offline', () => {
            cy.visit('http://localhost:8080/index-chat-fast.html?chatstatusoffline=true', {
                onBeforeLoad(win) {
                    cy.stub(win, 'open');
                },
            });

            cy.get('proactive-chat').shadow().find('button:contains("Leave a question")').click();

            // Assert that window.open was called
            cy.window().its('open').should('be.called');
        });

        it('Navigates to contact us from iframe "Leave a question" button when offline', () => {
            cy.visit('http://localhost:8080/index-chat-fast.html?chatstatusoffline=true', {
                onBeforeLoad(win) {
                    cy.stub(win, 'open');
                },
            });

            cy.getCookie('UQ_PROACTIVE_CHAT').should('not.exist');

            // manually wait
            cy.wait(100);

            assertPopupIsOpen();
            cy.get('proactive-chat').shadow().find('button:contains("Ask Library Chatbot")').should('exist').click();

            // let the iframe finish drawing
            cy.wait(4000);

            cy.get('proactive-chat').shadow().find('button:contains("Staff unavailable - leave a question")').click();

            // Assert that window.open was called
            cy.window().its('open').should('be.called');
        });
    });

    it('Displays as offline when chat status api is 403', () => {
        cy.visit('http://localhost:8080/index-chat-slow.html?user=errorUser');
        cy.viewport(1280, 900);

        // "online Minimised" button is hidden
        cy.get('proactive-chat')
            .shadow()
            .find('[data-testid="proactive-chat-online"]')
            .should('exist')
            .should('not.be.visible')
            .should('have.css', 'display', 'none');
        // "offline Minimised" button shows
        cy.get('proactive-chat')
            .shadow()
            .find('[data-testid="proactive-chat-offline"]')
            .should('exist')
            .should('be.visible')
            .should('not.have.css', 'display', 'none')
            .should('have.css', 'background-color', COLOUR_UQ_GREY300)
            .parent()
            .should('have.css', 'right', '16px');
    });

    context('when inserting proactive chat within the body of the page', () => {
        it('should load crm correctly', () => {
            cy.visit('http://localhost:8080/index-drupalcontactus.html', {
                onBeforeLoad(win) {
                    cy.stub(win, 'open');
                },
            });

            cy.get('proactive-chat[display="inline"]')
                .shadow()
                .find('button:contains("Chat with Library staff")')
                .click();

            // Assert that window.open was called
            cy.window().its('open').should('be.called');
        });
        it('should load chatbot correctly', () => {
            cy.visit('http://localhost:8080/index-drupalcontactus.html');
            cy.viewport(1280, 900);

            cy.getCookie('UQ_PROACTIVE_CHAT').should('not.exist');

            // manually wait
            cy.wait(100);

            assertPopupIsOpen();
            cy.get('proactive-chat[display="inline"]')
                .shadow()
                .find('button:contains("Ask Library Chatbot")')
                .should('exist')
                .click();

            // let the iframe finish drawing
            cy.wait(4000);

            cy.get('proactive-chat:not([display="inline"])')
                .shadow()
                .find('[data-testid="chatbot-wrapper"]')
                .should('exist'); // well, at least we know the iframe reaches the page!

            // can close iframe
            cy.get('proactive-chat:not([display="inline"])')
                .shadow()
                .find('[data-testid="closeIframeButton"]')
                .should('exist')
                .click();
            // once the chatbot is closed, the minimised icon appears
            cy.get('proactive-chat:not([display="inline"])')
                .shadow()
                .find('[data-testid="proactive-chat-online"]')
                .should('exist')
                .should('be.visible');
        });
        it('should handle after hours', () => {
            cy.visit('http://localhost:8080/index-drupalcontactus.html?chatstatusoffline=true', {
                onBeforeLoad(win) {
                    cy.stub(win, 'open');
                },
            });
            cy.viewport(1280, 900);

            cy.get('proactive-chat[display="inline"]').shadow().find('button:contains("Leave a question")').click();

            // Assert that window.open was called
            cy.window().its('open').should('be.called');
        });
    });
    context('when chatbot is known to be unavailable', () => {
        it('gives a link to CRM chat when askus is online', () => {
            cy.visit('http://localhost:8080/index-app-nochatbot.html');
            cy.viewport(1280, 900);
            // manually wait
            cy.wait(100);

            cy.get('proactive-chat')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="proactive-chat-online"]').should('exist').click();
                    cy.waitUntil(() => cy.get('button:contains("Chat with Library staff")').should('exist'));
                    cy.get('button:contains("Chat with Library staff")').should(
                        'have.css',
                        'background-color',
                        COLOUR_UQ_PURPLE,
                    );

                    cy.get('button:contains("Ask Library Chatbot")').should('not.exist');
                });
        });
        it('gives a link to CRM contact form when askus is offline', () => {
            cy.visit('http://localhost:8080/index-app-nochatbot.html?chatstatusoffline=true');
            cy.viewport(1280, 900);
            // manually wait
            cy.wait(100);

            cy.get('proactive-chat')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="proactive-chat-offline"]').should('exist').click();
                    cy.waitUntil(() => cy.get('button:contains("Leave a question")').should('exist'));
                    cy.get('button:contains("Leave a question")').should(
                        'have.css',
                        'background-color',
                        COLOUR_UQ_PURPLE,
                    );

                    cy.get('button:contains("Ask Library Chatbot")').should('not.exist');
                });
        });
    });
});

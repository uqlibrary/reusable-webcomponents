describe('EzProxy', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });

    context('default mode', () => {
        it('shows expected elements on load', () => {
            cy.get('ez-proxy:not([redirectonly])')
                .should('exist')
                .scrollIntoView()
                .shadow()
                .find('#ez-proxy')
                .within(() => {
                    cy.get('#ez-proxy-input').should('exist').should('be.visible');
                    cy.get('#ez-proxy-create-link-button').should('exist').should('be.visible');
                    cy.get('#ez-proxy-copy-link-buttons').should('exist').should('not.be.visible');
                    cy.get('#ez-proxy-redirect-button').should('exist').should('not.be.visible');
                });
        });

        it('shows expected elements on creating a link', () => {
            cy.get('ez-proxy:not([redirectonly])')
                .should('exist')
                .shadow()
                .find('#ez-proxy')
                .within(() => {
                    cy.get('#ez-proxy-input').type('https://www.google.com/{enter}');
                    cy.get('#ez-proxy-create-link-button').should('exist').should('not.be.visible');
                    cy.get('#ez-proxy-copy-link-buttons').should('exist').should('be.visible');
                });
        });

        it('calls command to copy the generated URL to the clipboard on clicking copy button', () => {
            cy.document().then((doc) => {
                cy.stub(doc, 'execCommand');
            });
            cy.get('ez-proxy:not([redirectonly])')
                .should('exist')
                .shadow()
                .find('#ez-proxy')
                .within(() => {
                    cy.get('#ez-proxy-input').should('exist').type('https://www.google.com/');
                    cy.get('#ez-proxy-create-link-button').click();
                    cy.get('#ez-proxy-url-display-area').should(
                        'have.value',
                        'https://ezproxy.library.uq.edu.au/login?url=https://www.google.com/',
                    );
                    cy.get('#ez-proxy-copy-link-button').should('exist').click();
                });
            cy.document().its('execCommand').should('be.calledOnceWith', 'copy');
        });

        it('resets view on clicking button to create new link', () => {
            cy.get('ez-proxy:not([redirectonly])')
                .should('exist')
                .shadow()
                .find('#ez-proxy')
                .within(() => {
                    cy.get('#ez-proxy-input').should('exist').type('https://www.google.com/');
                    cy.get('#ez-proxy-create-link-button').click();
                    cy.get('#ez-proxy-url-display-area').should(
                        'have.value',
                        'https://ezproxy.library.uq.edu.au/login?url=https://www.google.com/',
                    );
                    cy.get('#ez-proxy-create-new-link-button').should('exist').click();
                    cy.get('#ez-proxy-input').should('exist').should('be.visible');
                    cy.get('#ez-proxy-create-link-button').should('exist').should('be.visible');
                    cy.get('#ez-proxy-copy-link-buttons').should('exist').should('not.be.visible');
                    cy.get('#ez-proxy-redirect-button').should('exist').should('not.be.visible');
                });
        });
    });

    context('redirect-only mode', () => {
        it('shows expected elements on load', () => {
            cy.get('ez-proxy[redirectonly]')
                .should('exist')
                .shadow()
                .find('#ez-proxy')
                .within(() => {
                    cy.get('#ez-proxy-input').should('exist').should('be.visible');
                    cy.get('#ez-proxy-create-link-button').should('exist').should('not.be.visible');
                    cy.get('#ez-proxy-copy-link-buttons').should('exist').should('not.be.visible');
                    cy.get('#ez-proxy-redirect-button').should('exist').should('be.visible');
                });
        });

        it('opens a new window on submitting valid input', () => {
            cy.window().then((win) => {
                cy.stub(win, 'open').callsFake(() => ({ focus: () => {} }));
            });
            cy.get('ez-proxy[redirectonly]')
                .should('exist')
                .shadow()
                .find('#ez-proxy')
                .within(() => {
                    cy.get('#ez-proxy-input').should('exist').type('https://www.uq.edu.au/{enter}');
                });
            cy.window()
                .its('open')
                .should('be.calledOnceWith', 'https://ezproxy.library.uq.edu.au/login?url=https://www.uq.edu.au/');
        });
    });

    // Doesn't seem to be working
    it.skip('is accessible', () => {
        cy.injectAxe();
        cy.viewport(1280, 900);
        cy.get('ez-proxy[redirectonly]')
            .shadow()
            .find('#ez-proxy')
            .checkA11y('#ez-proxy', {
                reportName: 'EzProxy redirect-only',
                scopeName: 'on load',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
    });
});

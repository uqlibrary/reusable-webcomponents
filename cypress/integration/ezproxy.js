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

        it('opens generated URL in a new window on clicking the test button', () => {
            cy.window().then((win) => {
                cy.stub(win, 'open').callsFake(() => ({ focus: () => {} }));
            });
            cy.get('ez-proxy:not([redirectonly])')
                .should('exist')
                .shadow()
                .find('#ez-proxy')
                .within(() => {
                    cy.get('#ez-proxy-input').type('https://www.google.com/');
                    cy.get('#ez-proxy-create-link-button').click();
                    cy.get('#ez-proxy-test-link-button').should('exist').should('be.visible').click();
                });
            cy.window()
                .its('open')
                .should('be.calledOnceWith', 'https://ezproxy.library.uq.edu.au/login?url=https://www.google.com/');
        });

        it('calls command to copy the generated URL to the clipboard on clicking copy button', () => {
            cy.document().then((doc) => {
                cy.stub(doc, 'execCommand').callsFake(() => true);
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
                    cy.get('#ez-proxy-copy-status')
                        .should('exist')
                        .as('toast')
                        .should('be.visible')
                        .should('have.text', 'URL copied successfully');
                    cy.wait(4000); // wait for toast to disappear
                    cy.get('@toast').should('not.be.visible');
                });
            cy.document().its('execCommand').should('be.calledOnceWith', 'copy');
        });

        it('shows expected error messages for ill-formed URLs', () => {
            cy.get('ez-proxy:not([redirectonly])')
                .should('exist')
                .shadow()
                .find('#ez-proxy')
                .within(() => {
                    cy.get('#ez-proxy-input').should('exist').as('inputField').type('blah');
                    cy.get('#ez-proxy-create-link-button').as('createLinkButton').click();
                    cy.get('#ez-proxy-input-error')
                        .should('exist')
                        .should('be.visible')
                        .as('inputError')
                        .should('have.text', 'Invalid URL. Please add the protocol ie: http://, https://');

                    cy.get('@inputField').type('{selectall}http:/www.example.com');
                    cy.get('@createLinkButton').click();
                    cy.get('@inputError').should('have.text', 'Invalid URL.');
                });
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

        it('removes ezyproxy-fied parts from hostname', () => {
            cy.get('ez-proxy:not([redirectonly])')
                .should('exist')
                .shadow()
                .find('#ez-proxy')
                .within(() => {
                    cy.get('#ez-proxy-input')
                        .should('exist')
                        .type(
                            'http://www.sciencedirect.com.ezproxy.library.uq.edu.au/science/article/pii/S1744388116300159',
                        );
                    cy.get('#ez-proxy-create-link-button').click();
                    cy.get('#ez-proxy-url-display-area').should(
                        'have.value',
                        'https://ezproxy.library.uq.edu.au/login?url=http://www.sciencedirect.com/science/article/pii/S1744388116300159',
                    );
                });
        });

        it('creates doi.org URLs from DOIs as expected', () => {
            cy.get('ez-proxy:not([redirectonly])')
                .should('exist')
                .shadow()
                .find('#ez-proxy')
                .within(() => {
                    cy.get('#ez-proxy-input').should('exist').type('10.1016/S2214-109X(21)00061-9');
                    cy.get('#ez-proxy-create-link-button').click();
                    cy.get('#ez-proxy-url-display-area').should(
                        'have.value',
                        'https://ezproxy.library.uq.edu.au/login?url=https://dx.doi.org/10.1016/S2214-109X(21)00061-9',
                    );
                });
        });

        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1280, 900);

            cy.checkA11y('ez-proxy[redirectonly]', {
                reportName: 'EzProxy redirect-only',
                scopeName: 'on load',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
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

        it('shows error if no input was provided', () => {
            cy.get('ez-proxy[redirectonly]')
                .should('exist')
                .shadow()
                .find('#ez-proxy')
                .within(() => {
                    cy.get('#ez-proxy-redirect-button').should('exist').click();
                    cy.get('#ez-proxy-input-error')
                        .should('exist')
                        .should('be.visible')
                        .should('have.text', 'Please enter a URL');
                });
        });

        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.checkA11y('ez-proxy:not([redirectonly])', {
                reportName: 'EzProxy copy',
                scopeName: 'on load',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});

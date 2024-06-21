describe('OpenAthens', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
        // hide CA Popup by default.
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    context('default mode', () => {
        it('shows expected elements on load', () => {
            cy.get('open-athens[create-link]')
                .should('exist')
                .scrollIntoView()
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-input"]').should('exist').should('be.visible');
                    cy.get('[data-testid="open-athens-create-link-button"]').should('exist').should('be.visible');
                    cy.get('[data-testid="open-athens-copy-options"]').should('exist').should('not.be.visible');
                    cy.get('[data-testid="open-athens-redirect-button"]').should('exist').should('not.be.visible');
                });
        });

        it('shows expected elements on creating a link', () => {
            cy.get('open-athens[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-input"]').type('https://www.google.com/{enter}');
                    cy.get('[data-testid="open-athens-create-link-button"]').should('exist').should('not.be.visible');
                    cy.get('[data-testid="open-athens-copy-options"]').should('exist').should('be.visible');
                });
        });

        it.skip('opens generated URL in a new window on clicking the test button', () => {
            cy.window().then((win) => {
                cy.stub(win, 'open').callsFake(() => ({ focus: () => {} }));
            });
            cy.get('open-athens[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-input"]').type('https://www.google.com/');
                    cy.get('[data-testid="open-athens-create-link-button"]').click();
                    cy.get('[data-testid="open-athens-test-link-button"]').should('exist').should('be.visible').click();
                });
            cy.window()
                .its('open')
                .should(
                    'be.calledOnceWith',
                    'https://go.openathens.net/redirector/uq.edu.au?url=https%3A%2F%2Fwww.google.com/',
                );
        });

        const copyAndToast = (toastMessage) => {
            cy.get('open-athens[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-input"]').should('exist').type('https://www.google.com/');
                    cy.get('[data-testid="open-athens-create-link-button"]').click();
                    cy.get('[data-testid="open-athens-url-display-area"]').should(
                        'have.value',
                        'https://go.openathens.net/redirector/uq.edu.au?url=https%3A%2F%2Fwww.google.com/',
                    );
                    cy.get('[data-testid="open-athens-copy-options"]').should('not.have.class', 'hidden');
                    cy.get('[data-testid="open-athens-copy-link-button"]').should('be.visible').click();
                    cy.get('[data-testid="open-athens-copy-status"]')
                        .should('exist')
                        .as('toast')
                        .should('be.visible')
                        .should('have.text', toastMessage);
                    cy.wait(4000); // wait for toast to disappear
                    cy.get('@toast').should('not.be.visible');
                });
        };

        it.skip('uses clipboard API command to copy the generated URL to the clipboard on clicking copy button', () => {
            cy.window().then((win) => {
                if (!!win.navigator?.clipboard?.writeText) {
                    cy.spy(win.navigator.clipboard, 'writeText').as('writeText');
                    copyAndToast('URL copied successfully');
                    cy.get('@writeText').should('be.calledOnce');
                } else {
                    cy.log('This browser does not support clipboard API command.');
                    cy.document().then((doc) => {
                        cy.stub(doc, 'execCommand')
                            .callsFake(() => true)
                            .as('execCommand');
                        copyAndToast('URL copied successfully');
                        cy.get('@execCommand').should('be.calledOnce');
                    });
                }
            });
        });

        const replaceWriteText = (replacement = false) => {
            let writeText;
            cy.window().then((win) => {
                if (win.navigator?.clipboard?.writeText) {
                    writeText = win.navigator.clipboard.writeText;
                    win.navigator.clipboard.writeText = replacement;
                } else {
                    win.navigator.clipboard = {
                        ...win.navigator?.clipboard,
                        writeText: replacement,
                    };
                }
            });
            return writeText;
        };

        it.skip('uses legacy command to copy the generated URL to the clipboard on clicking copy button', () => {
            cy.document().then((doc) => {
                cy.stub(doc, 'execCommand')
                    .callsFake(() => true)
                    .as('execCommand');
            });
            const writeText = replaceWriteText();
            copyAndToast('URL copied successfully');
            cy.get('@execCommand').should('be.calledOnceWith', 'copy');
            if (writeText) {
                cy.window().then((win) => {
                    win.navigator.clipboard.writeText = writeText;
                });
            }
        });

        it.skip('shows expected error messages when copy mechanisms fail - 1 of 3', () => {
            let execCommand;
            cy.document().then((doc) => {
                execCommand = doc.execCommand;
                doc.execCommand = false;
            });
            const writeText = replaceWriteText();
            copyAndToast('Copy function not available in this web browser');
            cy.document().then((doc) => {
                doc.execCommand = execCommand;
            });
            cy.window().then((win) => {
                if (writeText) {
                    win.navigator.clipboard.writeText = writeText;
                }
            });
        });

        it.skip('shows expected error messages when copy mechanisms fail - 2 of 3', () => {
            cy.document().then((doc) => {
                cy.stub(doc, 'execCommand')
                    .callsFake(() => false)
                    .as('execCommand');
            });
            const writeText = replaceWriteText();
            copyAndToast('Unable to copy URL');
            cy.get('@execCommand').should('be.calledOnceWith', 'copy');
            cy.window().then((win) => {
                if (writeText) {
                    win.navigator.clipboard.writeText = writeText;
                }
            });
        });

        it.skip('shows expected error messages when copy mechanisms fail - 3 of 3', () => {
            const writeText = replaceWriteText(() => {
                throw DOMException('fail');
            });
            copyAndToast('An error occurred while copying the URL');
            cy.window().then((win) => {
                win.navigator.clipboard.writeText = writeText;
            });
        });

        it('shows expected error messages for ill-formed URLs', () => {
            cy.get('open-athens[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-input"]').should('exist').as('inputField').type('blah');
                    cy.get('[data-testid="open-athens-create-link-button"]').as('createLinkButton').click();
                    cy.get('[data-testid="open-athens-input-error"]')
                        .should('exist')
                        .should('be.visible')
                        .as('inputError')
                        .should('have.text', 'Invalid URL. Please add the protocol ie: http://, https://');

                    cy.get('@inputField').type('{selectall}http:/www.example.com');
                    cy.get('@createLinkButton').click();
                    cy.get('@inputError').should('have.text', 'Invalid URL.');
                });
        });

        it.skip('resets view on clicking button to create new link', () => {
            cy.get('open-athens[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-input"]').should('exist').type('https://www.google.com/');
                    cy.get('[data-testid="open-athens-create-link-button"]').click();
                    cy.get('[data-testid="open-athens-url-display-area"]').should(
                        'have.value',
                        'https://go.openathens.net/redirector/uq.edu.au?url=https%3A%2F%2Fwww.google.com/',
                    );
                    cy.get('[data-testid="open-athens-create-new-link-button"]').should('exist').click();
                    cy.get('[data-testid="open-athens-input"]').should('exist').should('be.visible');
                    cy.get('[data-testid="open-athens-create-link-button"]').should('exist').should('be.visible');
                    cy.get('[data-testid="open-athens-copy-options"]').should('exist').should('not.be.visible');
                    cy.get('[data-testid="open-athens-redirect-button"]').should('exist').should('not.be.visible');
                });
        });

        it.skip('removes ezyproxy-fied parts from hostname', () => {
            cy.get('open-athens[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-input"]')
                        .should('exist')
                        .type(
                            'http://www.sciencedirect.com.ezproxy.library.uq.edu.au/science/article/pii/S1744388116300159',
                        );
                    cy.get('[data-testid="open-athens-create-link-button"]').click();
                    cy.get('[data-testid="open-athens-url-display-area"]').should(
                        'have.value',
                        'https://go.openathens.net/redirector/uq.edu.au?url=http://www.sciencedirect.com/science/article/pii/S1744388116300159',
                    );
                });
        });

        it.skip('creates doi.org URLs from DOIs as expected', () => {
            cy.get('open-athens[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-input"]').should('exist').type('10.1016/S2214-109X(21)00061-9');
                    cy.get('[data-testid="open-athens-create-link-button"]').click();
                    cy.get('[data-testid="open-athens-url-display-area"]').should(
                        'have.value',
                        'https://go.openathens.net/redirector/uq.edu.au?url=https%3A%2F%2Fdx.doi.org/10.1016/S2214-109X(21)00061-9',
                    );
                });
        });

        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1280, 900);

            cy.checkA11y('open-athens:not([create-link])', {
                reportName: 'OpenAthens redirect-only',
                scopeName: 'on load',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });

    context('redirect-only mode', () => {
        it('shows expected elements on load', () => {
            cy.get('open-athens:not([create-link])')
                .should('exist')
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-input"]').should('exist').should('be.visible');
                    cy.get('[data-testid="open-athens-create-link-button"]').should('exist').should('not.be.visible');
                    cy.get('[data-testid="open-athens-copy-options"]').should('exist').should('not.be.visible');
                    cy.get('[data-testid="open-athens-redirect-button"]').should('exist').should('be.visible');
                });
        });

        it.skip('opens a new window on submitting valid input', () => {
            cy.window().then((win) => {
                cy.stub(win, 'open').callsFake(() => ({ focus: () => {} }));
            });
            cy.get('open-athens:not([create-link])')
                .should('exist')
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-input"]').should('exist').type('https://www.uq.edu.au/{enter}');
                });
            cy.window()
                .its('open')
                .should(
                    'be.calledOnceWith',
                    'https://go.openathens.net/redirector/uq.edu.au?url=https%3A%2F%2Fwww.uq.edu.au/',
                );
        });

        it('shows error if no input was provided', () => {
            cy.get('open-athens:not([create-link])')
                .should('exist')
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-redirect-button"]').should('exist').click();
                    cy.get('[data-testid="open-athens-input-error"]')
                        .should('exist')
                        .should('be.visible')
                        .should('have.text', 'Please enter a URL');
                });
        });

        it('clears the field on clicking the clear button', () => {
            cy.get('open-athens:not([create-link])')
                .should('exist')
                .shadow()
                .find('[data-testid="open-athens"]')
                .within(() => {
                    cy.get('[data-testid="open-athens-input"]').should('exist').type('https://www.uq.edu.au/');
                    cy.get('[data-testid="open-athens-input-clear-button"]').should('exist').click();
                    cy.get('[data-testid="open-athens-input"]').should('be.empty');
                });
        });

        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.checkA11y('open-athens[create-link]', {
                reportName: 'OpenAthens copy',
                scopeName: 'on load',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});

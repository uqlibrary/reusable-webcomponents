describe('EzProxy', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });

    context('default mode', () => {
        it('shows expected elements on load', () => {
            cy.get('ez-proxy[create-link]')
                .should('exist')
                .scrollIntoView()
                .shadow()
                .find('[data-testid="ez-proxy"]')
                .within(() => {
                    cy.get('[data-testid="ez-proxy-input"]').should('exist').should('be.visible');
                    cy.get('[data-testid="ez-proxy-create-link-button"]').should('exist').should('be.visible');
                    cy.get('[data-testid="ez-proxy-copy-link-buttons"]').should('exist').should('not.be.visible');
                    cy.get('[data-testid="ez-proxy-redirect-button"]').should('exist').should('not.be.visible');
                });
        });

        it('shows expected elements on creating a link', () => {
            cy.get('ez-proxy[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="ez-proxy"]')
                .within(() => {
                    cy.get('[data-testid="ez-proxy-input"]').type('https://www.google.com/{enter}');
                    cy.get('[data-testid="ez-proxy-create-link-button"]').should('exist').should('not.be.visible');
                    cy.get('[data-testid="ez-proxy-copy-link-buttons"]').should('exist').should('be.visible');
                });
        });

        it('opens generated URL in a new window on clicking the test button', () => {
            cy.window().then((win) => {
                cy.stub(win, 'open').callsFake(() => ({ focus: () => {} }));
            });
            cy.get('ez-proxy[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="ez-proxy"]')
                .within(() => {
                    cy.get('[data-testid="ez-proxy-input"]').type('https://www.google.com/');
                    cy.get('[data-testid="ez-proxy-create-link-button"]').click();
                    cy.get('[data-testid="ez-proxy-test-link-button"]').should('exist').should('be.visible').click();
                });
            cy.window()
                .its('open')
                .should('be.calledOnceWith', 'https://ezproxy.library.uq.edu.au/login?url=https://www.google.com/');
        });

        const copyAndToast = (toastMessage) => {
            cy.get('ez-proxy[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="ez-proxy"]')
                .within(() => {
                    cy.get('[data-testid="ez-proxy-input"]').should('exist').type('https://www.google.com/');
                    cy.get('[data-testid="ez-proxy-create-link-button"]').click();
                    cy.get('[data-testid="ez-proxy-url-display-area"]').should(
                        'have.value',
                        'https://ezproxy.library.uq.edu.au/login?url=https://www.google.com/',
                    );
                    cy.get('[data-testid="ez-proxy-copy-link-button"]').should('exist').click();
                    cy.get('[data-testid="ez-proxy-copy-status"]')
                        .should('exist')
                        .as('toast')
                        .should('be.visible')
                        .should('have.text', toastMessage);
                    cy.wait(4000); // wait for toast to disappear
                    cy.get('@toast').should('not.be.visible');
                });
        };

        it('uses clipboard API command to copy the generated URL to the clipboard on clicking copy button', () => {
            let readText;
            cy.window().then((win) => {
                if ((readText = win.navigator?.clipboard?.readText)) {
                    cy.spy(win.navigator.clipboard, 'readText').as('readText');
                } else {
                    cy.log('This browser does not support clipboard API command.');
                    cy.document().then((doc) => {
                        cy.stub(doc, 'execCommand')
                            .callsFake(() => true)
                            .as('execCommand');
                    });
                }
            });
            copyAndToast('URL copied successfully');
            if (readText) {
                cy.window().then((win) => {
                    cy.get('@readText').should('be.calledOnce');
                });
            }
        });

        const replaceReadText = (replacement = false) => {
            let readText;
            cy.window().then((win) => {
                if (win.navigator?.clipboard?.readText) {
                    readText = win.navigator.clipboard.readText;
                    win.navigator.clipboard.readText = replacement;
                } else {
                    win.navigator.clipboard = {
                        ...win.navigator?.clipboard,
                        readText: replacement,
                    };
                }
            });
            return readText;
        };

        it('uses legacy command to copy the generated URL to the clipboard on clicking copy button', () => {
            cy.document().then((doc) => {
                cy.stub(doc, 'execCommand')
                    .callsFake(() => true)
                    .as('execCommand');
            });
            const readText = replaceReadText();
            copyAndToast('URL copied successfully');
            cy.get('@execCommand').should('be.calledOnceWith', 'copy');
            cy.window().then((win) => {
                if (readText) {
                    win.navigator.clipboard.readText = readText;
                }
            });
        });

        it('shows expected error messages when copy mechanisms fail - 1 of 3', () => {
            let execCommand;
            cy.document().then((doc) => {
                execCommand = doc.execCommand;
                doc.execCommand = false;
            });
            const readText = replaceReadText();
            copyAndToast('Copy function not available in this web browser');
            cy.document().then((doc) => {
                doc.execCommand = execCommand;
            });
            cy.window().then((win) => {
                if (readText) {
                    win.navigator.clipboard.readText = readText;
                }
            });
        });

        it('shows expected error messages when copy mechanisms fail - 2 of 3', () => {
            cy.document().then((doc) => {
                cy.stub(doc, 'execCommand')
                    .callsFake(() => false)
                    .as('execCommand');
            });
            const readText = replaceReadText();
            copyAndToast('Unable to copy URL');
            cy.get('@execCommand').should('be.calledOnceWith', 'copy');
            cy.window().then((win) => {
                if (readText) {
                    win.navigator.clipboard.readText = readText;
                }
            });
        });

        it('shows expected error messages when copy mechanisms fail - 3 of 3', () => {
            const readText = replaceReadText(() => {
                throw DOMException('fail');
            });
            copyAndToast('An error occurred while copying the URL');
            cy.window().then((win) => {
                win.navigator.clipboard.readText = readText;
            });
        });

        it('shows expected error messages for ill-formed URLs', () => {
            cy.get('ez-proxy[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="ez-proxy"]')
                .within(() => {
                    cy.get('[data-testid="ez-proxy-input"]').should('exist').as('inputField').type('blah');
                    cy.get('[data-testid="ez-proxy-create-link-button"]').as('createLinkButton').click();
                    cy.get('[data-testid="ez-proxy-input-error"]')
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
            cy.get('ez-proxy[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="ez-proxy"]')
                .within(() => {
                    cy.get('[data-testid="ez-proxy-input"]').should('exist').type('https://www.google.com/');
                    cy.get('[data-testid="ez-proxy-create-link-button"]').click();
                    cy.get('[data-testid="ez-proxy-url-display-area"]').should(
                        'have.value',
                        'https://ezproxy.library.uq.edu.au/login?url=https://www.google.com/',
                    );
                    cy.get('[data-testid="ez-proxy-create-new-link-button"]').should('exist').click();
                    cy.get('[data-testid="ez-proxy-input"]').should('exist').should('be.visible');
                    cy.get('[data-testid="ez-proxy-create-link-button"]').should('exist').should('be.visible');
                    cy.get('[data-testid="ez-proxy-copy-link-buttons"]').should('exist').should('not.be.visible');
                    cy.get('[data-testid="ez-proxy-redirect-button"]').should('exist').should('not.be.visible');
                });
        });

        it('removes ezyproxy-fied parts from hostname', () => {
            cy.get('ez-proxy[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="ez-proxy"]')
                .within(() => {
                    cy.get('[data-testid="ez-proxy-input"]')
                        .should('exist')
                        .type(
                            'http://www.sciencedirect.com.ezproxy.library.uq.edu.au/science/article/pii/S1744388116300159',
                        );
                    cy.get('[data-testid="ez-proxy-create-link-button"]').click();
                    cy.get('[data-testid="ez-proxy-url-display-area"]').should(
                        'have.value',
                        'https://ezproxy.library.uq.edu.au/login?url=http://www.sciencedirect.com/science/article/pii/S1744388116300159',
                    );
                });
        });

        it('creates doi.org URLs from DOIs as expected', () => {
            cy.get('ez-proxy[create-link]')
                .should('exist')
                .shadow()
                .find('[data-testid="ez-proxy"]')
                .within(() => {
                    cy.get('[data-testid="ez-proxy-input"]').should('exist').type('10.1016/S2214-109X(21)00061-9');
                    cy.get('[data-testid="ez-proxy-create-link-button"]').click();
                    cy.get('[data-testid="ez-proxy-url-display-area"]').should(
                        'have.value',
                        'https://ezproxy.library.uq.edu.au/login?url=https://dx.doi.org/10.1016/S2214-109X(21)00061-9',
                    );
                });
        });

        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1280, 900);

            cy.checkA11y('ez-proxy:not([create-link])', {
                reportName: 'EzProxy redirect-only',
                scopeName: 'on load',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });

    context('redirect-only mode', () => {
        it('shows expected elements on load', () => {
            cy.get('ez-proxy:not([create-link])')
                .should('exist')
                .shadow()
                .find('[data-testid="ez-proxy"]')
                .within(() => {
                    cy.get('[data-testid="ez-proxy-input"]').should('exist').should('be.visible');
                    cy.get('[data-testid="ez-proxy-create-link-button"]').should('exist').should('not.be.visible');
                    cy.get('[data-testid="ez-proxy-copy-link-buttons"]').should('exist').should('not.be.visible');
                    cy.get('[data-testid="ez-proxy-redirect-button"]').should('exist').should('be.visible');
                });
        });

        it('opens a new window on submitting valid input', () => {
            cy.window().then((win) => {
                cy.stub(win, 'open').callsFake(() => ({ focus: () => {} }));
            });
            cy.get('ez-proxy:not([create-link])')
                .should('exist')
                .shadow()
                .find('[data-testid="ez-proxy"]')
                .within(() => {
                    cy.get('[data-testid="ez-proxy-input"]').should('exist').type('https://www.uq.edu.au/{enter}');
                });
            cy.window()
                .its('open')
                .should('be.calledOnceWith', 'https://ezproxy.library.uq.edu.au/login?url=https://www.uq.edu.au/');
        });

        it('shows error if no input was provided', () => {
            cy.get('ez-proxy:not([create-link])')
                .should('exist')
                .shadow()
                .find('[data-testid="ez-proxy"]')
                .within(() => {
                    cy.get('[data-testid="ez-proxy-redirect-button"]').should('exist').click();
                    cy.get('[data-testid="ez-proxy-input-error"]')
                        .should('exist')
                        .should('be.visible')
                        .should('have.text', 'Please enter a URL');
                });
        });

        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.checkA11y('ez-proxy[create-link]', {
                reportName: 'EzProxy copy',
                scopeName: 'on load',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});

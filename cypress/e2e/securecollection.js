/// <reference types="cypress" />

describe('Secure Collection', () => {
    context('Secure Collection', () => {
        it('Secure Collection passes accessibility', () => {
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=bomdata&file=abcdef.zip',
            );
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.get('secure-collection').shadow().find('[data-testid="hero-text"]');
            cy.checkA11y('secure-collection', {
                reportName: 'Secure Collection',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('a link to a non existant resource says so', () => {
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=collection&file=doesntExist',
            );
            cy.viewport(1300, 1000);
            cy.get('secure-collection')
                .shadow()
                .within(() => {
                    cy.get('h1').contains('Secure collection');
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains(
                        'This file does not exist or is unavailable.',
                    );
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains(
                        'Please check the link you have used.',
                    );
                });
        });
        it('when the html is called with no parameters it says so', () => {
            cy.visit('http://localhost:8080/src/applications/securecollection/demo.html');
            cy.viewport(1300, 1000);
            cy.get('secure-collection')
                .shadow()
                .within(() => {
                    cy.get('h1').contains('Secure collection');
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains(
                        'This file does not exist or is unavailable.',
                    );
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains(
                        'Please check the link you have used.',
                    );
                });
        });

        it('a link that returns an error from the api says so', () => {
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=public&collection=api&file=fails',
            );
            cy.viewport(1300, 1000);
            cy.get('secure-collection')
                .shadow()
                .within(() => {
                    cy.get('h1').contains('Secure collection');
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains('System temporarily unavailable');
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains(
                        "We're working on the issue and will have service restored as soon as possible. Please try again later.",
                    );
                });
        });

        it('a link that requires a Statutory Copyright statement does so (logged in users only)', () => {
            cy.intercept('GET', 'https://files.library.uq.edu.au/secure/coursebank/111111111*', {
                statusCode: 200,
                body: 'user receives a coursebank file',
            });
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=coursebank&file=111111111111111.pdf',
            );
            cy.viewport(1300, 1000);
            cy.get('secure-collection')
                .shadow()
                .within(() => {
                    cy.get('h1').contains('Secure collection');
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains('Warning');
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains(
                        'This material has been reproduced and communicated to you by or on behalf of The',
                    );
                    cy.get('[data-testid="standard-card-copyright-notice"]')
                        .find('[data-testid="fileExtension"]')
                        .contains('Save the file with a name ending in')
                        .find('b')
                        .contains('.pdf');
                    cy.get('[data-testid="secure-collection-statutory-copyright-download-link"]')
                        // I dont think this keypair updates locally
                        .should(
                            'have.attr',
                            'href',
                            'https://files.library.uq.edu.au/secure/coursebank/111111111111111.pdf?Expires=1621060025&Signature=longString&Key-Pair-Id=APKAJNDQICYW445PEOSA',
                        );
                    cy.get('[data-testid="secure-collection-file-extension"]').contains('pdf');

                    cy.get('[data-testid="secure-collection-statutory-copyright-download-link"]').click();
                });
            cy.get('body').contains('user receives a coursebank file');
        });

        it('a link that does not have a file extension doesnt display the file extension hint to the user (loggedin user only)', () => {
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=coursebank&file=2222222',
            );
            cy.viewport(1300, 1000);
            cy.get('secure-collection')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains('Warning');
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains(
                        'The material in this communication may be subject to copyright under the Act',
                    );
                    cy.get('[data-testid="standard-card-copyright-notice"]')
                        .find('[data-testid="fileExtension"]')
                        .should('not.exist');
                });
        });

        it('a link that requires a Commercial Copyright statement does so (logged in user only)', () => {
            cy.intercept('GET', 'https://files.library.uq.edu.au/secure/bomdata/abcdef.zip*', {
                // statusCode: 200,
                body: 'user receives a bom zip',
            });
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=bomdata&file=abcdef.zip',
            );
            cy.viewport(1300, 1000);
            cy.get('secure-collection')
                .shadow()
                .within(() => {
                    cy.get('h1').contains('Secure collection');
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains('WARNING');
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains(
                        'This file is provided to support teaching and learning for the staff and students of',
                    );
                    cy.get('[data-testid="standard-card-copyright-notice"]')
                        .find('[data-testid="fileExtension"]')
                        .contains('Save the file with a name ending in')
                        .find('b')
                        .contains('.zip');
                    cy.get('[data-testid="secure-collection-commercial-copyright-download-link"]')
                        // I dont think this keypair updates locally
                        .should(
                            'have.attr',
                            'href',
                            'https://files.library.uq.edu.au/secure/bomdata/abcdef.zip?Expires=1621060025&Signature=longString&Key-Pair-Id=APKAJNDQICYW445PEOSA',
                        )
                        .click();
                });
            cy.get('body').contains('user receives a bom zip');
        });

        it('a link that is missing the appropriate parameters displays a missing page', () => {
            cy.visit('http://localhost:8080/src/applications/securecollection/demo.html');
            cy.viewport(1300, 1000);
            cy.get('secure-collection')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="standard-card-copyright-notice"]')
                        .find('h2')
                        .contains('This file does not exist or is unavailable.');
                    cy.get('[data-testid="secure-collection"] p').contains('Please check the link you have used.');
                });
        });

        it('a link that requires certain user types will give an error', () => {
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=emcommunity&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_EMuser.pdf',
            );
            cy.viewport(1300, 1000);
            cy.get('secure-collection')
                .shadow()
                .within(() => {
                    cy.get('h1').contains('Secure collection');
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains(
                        'Access to this file is only available to UQ staff and students',
                    );
                    cy.get('[data-testid="standard-card-copyright-notice"]').contains('If you have another UQ account');
                });
        });

        // code detects test mode (localhost and mode=manualRedirect) to not do the actual redirect.
        // this lets us a) check the link works and
        // b) something weird is happening in coverage that if we redirect then no coverage is measured, so we get
        // around that
        it('a resource that requires login can have the login redirect link clicked', () => {
            cy.intercept(/auth.library.uq.edu.au/, 'auth pages that forces the user to login');
            cy.intercept(/loginuserpass/, 'auth pages that forces the user to login');
            cy.intercept('GET', '/idp/module.php', {
                // https://auth.uq.edu.au/idp/module.php/core/loginuserpass.php?AuthState=&etc
                statusCode: 200,
                body: 'auth pages that forces the user to login',
            });

            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=public&mode=manualRedirect&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf',
            );
            cy.get('secure-collection')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="secure-collection-auth-redirector"]').click();
                });
            cy.viewport(1300, 1000);
            cy.get('body').contains('auth pages that forces the user to login');
        });

        it('a resource that requires login will redirect to auth for the public user', () => {
            cy.intercept(/auth.library.uq.edu.au/, 'auth pages that forces the user to login');
            cy.intercept(/loginuserpass/, 'auth pages that forces the user to login');
            cy.intercept('GET', '/idp/module.php', {
                // https://auth.uq.edu.au/idp/module.php/core/loginuserpass.php?AuthState=&etc
                statusCode: 200,
                body: 'auth pages that forces the user to login',
            });
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=public&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf',
            );
            cy.viewport(1300, 1000);
            cy.wait(500);
            cy.get('body').contains('auth pages that forces the user to login');
        });

        it('a resource that requires login will redirect to the resource for a logged in user', () => {
            cy.intercept(
                /secure\/exams\/2018\/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf/,
                'I am a exam file resource delivered to the user',
            );
            cy.intercept('GET', '/secure/exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf', {
                statusCode: 200,
                body: 'I am a exam file resource delivered to the user',
            });
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf',
            );
            cy.viewport(1300, 1000);
            cy.wait(500);
            cy.get('body').contains('I am a exam file resource delivered to the user');
        });

        it('a link that downloads can have the "download" button clicked', () => {
            cy.intercept(/coursebank\/22222222222.pdf/, 'I am file resource A delivered to the user');
            cy.intercept('GET', '/coursebank/22222222222.pdf', {
                statusCode: 200,
                body: 'I am a file resource delivered to the user',
            });
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=public&mode=manualRedirect&collection=coursebank&file=22222222222.pdf',
            );
            cy.viewport(1300, 1000);
            cy.get('secure-collection')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="secure-collection-resource-redirector"]').click();
                });
            cy.get('body').contains('I am file resource A delivered to the user');
        });

        it('a link that downloads will redirect to the resource', () => {
            const interceptContent = 'I am file resource B delivered to the user';
            cy.intercept(/secure\/exams\/phil1010.pdf/, interceptContent);
            cy.intercept('GET', '/secure/exams/phil1010.pdf', {
                statusCode: 200,
                body: interceptContent,
            });
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=exams&file=phil1010.pdf',
            );
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('body').should('have.length.greaterThan', 0));
            cy.get('body').contains(interceptContent);
        });

        it('a link that does not require acknowledgement will redirect to the file (logged in user only)', () => {
            const interceptContent = 'I am file resource C delivered to the user';
            cy.intercept(
                /secure\/thomson\/classic_legal_texts\/Thynne_Accountability_And_Control.pdf/,
                interceptContent,
            );
            cy.intercept('GET', '/secure/thomson/classic_legal_texts/Thynne_Accountability_And_Control.pdf', {
                // 'https://files.library.uq.edu.au/secure/thomson/classic_legal_texts/Thynne_Accountability_And_Control.pdf?Expires=1621380128&Signature=longstring&Key-Pair-Id=APKAJNDQICYW445PEOSA',
                statusCode: 200,
                body: interceptContent,
            });
            cy.visit(
                'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=thomson&file=classic_legal_texts/Thynne_Accountability_And_Control.pdf',
            );
            cy.viewport(1300, 1000);
            // then check redirection
            cy.waitUntil(() => cy.get('body').should('have.length.greaterThan', 0));
            cy.get('body').contains(interceptContent);
        });
    });
});

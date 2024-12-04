/// <reference types="cypress" />

describe('Dummy Application', () => {
    context('Works as expected', () => {
        it('Where javascript is used to alter the base html acts correctly', () => {
            cy.visit('http://localhost:8080/index.html');
            cy.viewport(1280, 900);
            // applications/testing has a skip nav button
            cy.get('uq-header').shadow().find('button[data-testid="skip-nav"]').should('exist');
            // has an auth button
            cy.get('auth-button').shadow().find('button:contains("Log out")').should('exist');
            // // has a mega menu
            // // the menu appears on click
            // cy.get('uq-site-header').shadow().find('nav[aria-label="Site navigation"]').should('be.visible');
            // // and has the correct children
            // cy.get('uq-site-header')
            //     .shadow()
            //     .find('nav[aria-label="Site navigation"]')
            //     .find('ul')
            //     .should('have.length', 7); // length of the megamenu .json
        });
    });

    function hasUqHeader() {
        cy.get('uq-header').shadow().find('[data-testid="uq-header-logo-large-link"]').should('exist');
    }

    function hasCulturalAdvice() {
        cy.get('cultural-advice-v2').shadow().find('[data-testid="cultural-advice-statement"]').should('exist');
    }

    function hasNoUqHeader() {
        cy.get('uq-header').should('not.exist');
    }

    function hasUqSiteHeader(sitesearchurl = 'https://www.library.uq.edu.au/') {
        cy.get('uq-site-header')
            .shadow()
            .find('div.uq-site-header')
            .find('a[data-testid="site-title"]')
            .should('have.attr', 'href')
            .and('include', sitesearchurl);
    }

    function hasNoUqSiteHeader() {
        cy.get('uq-site-header').should('not.exist');
    }

    function hasNoProactiveChat() {
        cy.get('proactive-chat').should('not.exist');
    }

    function proactiveChatLoadsAsIcon() {
        cy.get('proactive-chat')
            .shadow()
            .within(() => {
                cy.get('[data-testid="proactive-chat-online"]').should('exist').should('be.visible');
                cy.get('[data-testid="proactive-chat-offline"]').should('exist').should('not.be.visible');
                cy.get('button:contains("Ask Library Chatbot")').should('exist').should('not.be.visible');
                cy.get('button:contains("Leave a question")').should('exist').should('not.be.visible');
                cy.get('[data-testid="close-button"]').should('exist').should('not.be.visible');

                // proactive chat opens on click
                cy.get('[data-testid="proactive-chat-online"]').click();
                cy.get('button:contains("Ask Library Chatbot")').should('be.visible');
                // and closes
                cy.get('[data-testid="close-button"]').should('be.visible').click();
                cy.get('button:contains("Ask Library Chatbot")').should('not.be.visible');
                cy.get('[data-testid="close-button"]').should('not.be.visible');
            });
    }

    function hasNoAuthButton() {
        cy.get('auth-button').should('not.exist');
    }

    function hasAnAlert() {
        cy.get('alert-list')
            .shadow()
            .find('uq-alert')
            .shadow()
            .find('[data-testid="alert-alert-1"]')
            .should('exist')
            .and('contain', 'This is the message');
        // none of these test systems are primo, so this alert wont appear on any of them
        cy.get('alert-list')
            .shadow()
            .find('uq-alert')
            .shadow()
            .find('[data-testid="alert-alert-2"]')
            .should('not.exist');
        cy.get('alert-list')
            .shadow()
            .find('uq-alert')
            .shadow()
            .find('[data-testid="alert-alert-1-action-button"]')
            .should('exist')
            .should('contain', 'Action button label')
            .should('be.visible'); // not occluded by close button
    }

    function hasNoAlerts() {
        cy.get('alert-list').should('not.exist');
    }

    // function hasConnectFooter() {
    //     cy.get('connect-footer')
    //         .shadow()
    //         .find('[data-testid="connect-footer-social-heading"]')
    //         .should('exist')
    //         .and('contain', 'Library footer');
    // }
    //
    // function hasNoConnectFooter() {
    //     cy.get('connect-footer').should('not.exist');
    // }

    function hasUqFooter() {
        cy.get('uq-footer')
            .shadow()
            .find('.uq-footer__acknowledgement a.uq-footer__link')
            .should('exist')
            .and('contain', 'Reconciliation at UQ');
    }

    function hasNoUqFooter() {
        cy.get('uq-footer').should('not.exist');
    }

    function hasAuthButton(username = 'User, Vanilla') {
        cy.get('auth-button')
            .shadow()
            .find('[data-testid="username-area-label"]')
            .should('exist')
            .and('contain', username);
    }

    function hasCulturalAdviceBanner() {
        cy.waitUntil(() =>
            cy
                .get('cultural-advice-v2')
                .shadow()
                .find('.culturaladvicev2')
                .should('exist')
                .should('be.visible')
                .contains('The Library is custodian of'),
        );
    }

    context('app.library.uq.edu.au works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/uqlapp/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            proactiveChatLoadsAsIcon();
            hasAuthButton();

            hasAnAlert();

            // hasConnectFooter();
            hasUqFooter();
        });
    });

    context('Shared works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/shared/demo-randompage.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasNoAuthButton();
            hasNoProactiveChat();

            hasAnAlert();

            // hasNoConnectFooter();

            hasUqFooter();
        });
    });

    context('Rightnow works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/rightnow/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            proactiveChatLoadsAsIcon();
            hasNoAuthButton();

            hasAnAlert();

            // hasConnectFooter();

            hasUqFooter();
        });
    });

    // Primo has no load.js file so is not tested here

    // note that the load.js file calls the live minimal file :(
    context('LibWizard works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/libwizard/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasNoAuthButton();
            hasNoProactiveChat();

            hasNoAlerts();

            // hasNoConnectFooter();

            hasNoUqFooter();
        });
    });

    context('Springshare Guides works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/libguides/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();
            // the guides built in bookmark has been removed
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    // the breadcrumbs has all the children from the guides demo page
                    cy.get('div.uq-site-header nav ol').children().should('have.length', 6);
                    cy.get('div.uq-site-header nav ol li:nth-child(3) a')
                        .should('have.attr', 'href', `https://guides.library.uq.edu.au/`)
                        .contains('Guides')
                        .should('have.css', 'text-decoration-line', 'underline');
                    cy.get('div.uq-site-header nav ol li:nth-child(4) a')
                        .should('have.attr', 'href', `https://guides.library.uq.edu.au/how-to-find`)
                        .contains('How to find')
                        .should('have.css', 'text-decoration-line', 'underline');
                    cy.get('div.uq-site-header nav ol li:nth-child(5) a')
                        .should(
                            'have.attr',
                            'href',
                            `https://guides.library.uq.edu.au/how-to-find/evidence-based-practice`,
                        )
                        .contains('Evidence-based practice in health sciences')
                        .should('have.css', 'text-decoration-line', 'underline');
                    // that last not-a-link does not have an underline
                    cy.get('div.uq-site-header nav ol li:nth-child(6) span')
                        .contains('Introduction')
                        .should('not.have.css', 'text-decoration-line', 'underline');
                    // guides built in breadcrumb has been removed
                    cy.get('#s-lib-bc').should('not.exist');
                });

            proactiveChatLoadsAsIcon();
            hasAuthButton();

            hasAnAlert();

            // hasConnectFooter();

            hasUqFooter();
        });
    });

    context('Springshare Cal works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/libcal/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            proactiveChatLoadsAsIcon();
            hasNoAuthButton();

            hasAnAlert();

            // hasConnectFooter();

            hasUqFooter();
        });
    });

    context('Drupal works as expected', () => {
        it('Sample page load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/drupal/demo.html');
            cy.viewport(1280, 900);

            //hasNoUqHeader(); // drupal supplies that

            hasCulturalAdvice();

            // we use the drupal utility bar instead of our uq-site-header and inject our auth button into it
            hasAuthButton();

            hasAnAlert();
            // a drupal specific alert appears
            cy.get('alert-list')
                .shadow()
                .find('uq-alert')
                .shadow()
                .find('[data-testid="alert-alert-3"]')
                .should('exist')
                .should('contain', 'This is the message');

            // hasNoConnectFooter();

            proactiveChatLoadsAsIcon();

            hasNoUqFooter(); // drupal supplies that

            // simple check that the components exist, now that we are splitting them out from the main reusable.min file
            cy.get('open-athens')
                .shadow()
                .find('fieldset input')
                .should('have.attr', 'placeholder')
                .and('include', 'DOI or URL');
            cy.get('library-training')
                .shadow()
                .find('training-filter')
                .shadow()
                .find('h3')
                .and('contain', 'Filter events');
        });
        it('does not have any web components on a specifically named Drupal page', () => {
            cy.visit('http://localhost:8080/src/applications/drupal/pageWithoutComponents.html');
            cy.viewport(1280, 900);

            hasNoUqHeader();

            hasNoUqSiteHeader();

            hasNoAlerts();

            // hasNoConnectFooter();

            hasNoUqFooter();
        });
    });

    context('Auth works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/auth/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            proactiveChatLoadsAsIcon();
            hasNoAuthButton();

            hasAnAlert();

            hasUqFooter();
        });
    });

    context('Atom works as expected', () => {
        function assert_homepage_link_is_to_uq() {
            // the big-icon homepage link has been changed from a fryer link to the uq homepage
            cy.get('#logo').should('exist').should('have.attr', 'href', 'https://www.uq.edu.au/');
        }

        function assert_has_book_now_link() {
            // there is a "book now" type link in the sidebar
            const bookingUrl = 'https://calendar.library.uq.edu.au/reserve/spaces/reading-room';
            cy.get('#context-menu')
                .parent()
                .find('[data-testid="booknowLink"] a')
                .should('exist')
                .should('have.attr', 'href', bookingUrl);
        }

        it('Sample home page load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/atom/demo-homepage.html');
            cy.viewport(1280, 900);

            assert_homepage_link_is_to_uq();

            hasCulturalAdviceBanner();
        });

        it('Sample detail page load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/atom/demo-detailpage.html');
            cy.viewport(1280, 900);

            assert_homepage_link_is_to_uq();

            assert_has_book_now_link();

            hasCulturalAdviceBanner();

            // has cultural advice banner
            cy.get('.culturalAdviceBanner')
                .should('exist')
                .contains('Aboriginal and Torres Strait Islander people are warned that');
        });

        it('Sample list page load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/atom/demo-listpage.html');
            cy.viewport(1280, 900);
            assert_homepage_link_is_to_uq();
            hasCulturalAdviceBanner();

            // has cultural advice indicator, only on CA entries
            cy.get('#content article')
                .children()
                .each((el, index) => {
                    switch (index) {
                        case 0:
                            cy.wrap(el)
                                .find('.title a')
                                .contains(
                                    'Submisions to the Queensland State Government for equality of wages and working conditions for Aborigines in the pastoral industry',
                                );
                            cy.wrap(el).find('.culturalAdviceMark').should('exist');
                            break;
                        case 1:
                            cy.wrap(el)
                                .find('.title a')
                                .contains(
                                    'Briefing material : Commonwealth Games Act, street march ban, award wages on reserves.',
                                );
                            cy.wrap(el).find('.culturalAdviceMark').should('not.exist');
                            break;
                        case 2:
                            cy.wrap(el).find('.title a').contains('Terrible wages discrimination, [1967]');
                            cy.wrap(el).find('.culturalAdviceMark').should('exist');
                            break;
                        case 3:
                            cy.wrap(el).find('.title a').contains('Cherbourgh settlement, Thursday March 24, 1966');
                            cy.wrap(el).find('.culturalAdviceMark').should('not.exist');
                    }
                });
        });
    });

    context('espace displays as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/espace/example.html');
            cy.viewport(1450, 900);

            // hasUqHeader();
            //
            // hasUqSiteHeader('https://espace.library.uq.edu.au/');
            //
            // hasAuthButton();

            hasAnAlert();

            // hasNoUqFooter();
        });
    });
});

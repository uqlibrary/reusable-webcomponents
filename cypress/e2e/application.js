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
            hasCulturalAdviceBanner();
        });
    });

    function hasUqHeader() {
        cy.get('uq-header').shadow().find('[data-testid="uq-header-logo-large-link"]').should('exist');
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
            .find('[data-testid="footer-acknowledgement-link"]')
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
                .get('cultural-advice')
                .shadow()
                .find('.culturaladvice')
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
            hasCulturalAdviceBanner();

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
        it('homepage is correct', () => {
            cy.visit('http://localhost:8080/src/applications/libguides/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasCulturalAdviceBanner();

            proactiveChatLoadsAsIcon();
            hasAuthButton();

            hasAnAlert();

            // hasConnectFooter();

            hasUqFooter();
        });
        it('detail page with hero and accordion handler works', () => {
            cy.visit('http://localhost:8080/src/applications/libguides/demo-landing.html');
            cy.viewport(1280, 900);
            // the guides built in breadcrumb has been removed
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    // the breadcrumbs has all the children from the guides demo page
                    cy.get('div.uq-site-header nav ol').children().should('have.length', 4);
                    cy.get('div.uq-site-header nav ol li:nth-child(3) a')
                        .should('have.attr', 'href', `https://guides.library.uq.edu.au/`)
                        .contains('Guides')
                        .should('have.css', 'text-decoration-line', 'underline');
                    // cy.get('div.uq-site-header nav ol li:nth-child(4) a')
                    //     .should('have.attr', 'href', `https://guides.library.uq.edu.au/how-to-find`)
                    //     .contains('How to find')
                    //     .should('have.css', 'text-decoration-line', 'underline');
                    // cy.get('div.uq-site-header nav ol li:nth-child(5) a')
                    //     .should(
                    //         'have.attr',
                    //         'href',
                    //         `https://guides.library.uq.edu.au/how-to-find/evidence-based-practice`,
                    //     )
                    //     .contains('Evidence-based practice in health sciences')
                    //     .should('have.css', 'text-decoration-line', 'underline');
                    // that last not-a-link does not have an underline
                    cy.get('div.uq-site-header nav ol li:nth-child(4) a')
                        .contains('Referencing')
                        .should('not.have.css', 'text-decoration-line', 'underline');
                    // guides built in breadcrumb has been removed
                    cy.get('#s-lib-bc').should('not.exist');
                });

            // detail hero image loads
            cy.waitUntil(() => cy.get('[data-testid="hero-text"]').should('exist').should('be.visible'));

            // confirm the onload closes the accordions
            cy.waitUntil(() => cy.get('button[data-testid="research-accordion-button"]').should('exist'));
            cy.waitUntil(() =>
                cy.get('button[data-testid="research-accordion-button"]').should('have.attr', 'aria-expanded', 'false'),
            );
            cy.get('[data-testid="research-accordion-panel"]').should('exist').should('not.be.visible');

            // confirm we can click a button to open an accordion
            cy.get('button[data-testid="research-accordion-button"]').click();
            cy.waitUntil(() =>
                cy.get('button[data-testid="research-accordion-button"]').should('have.attr', 'aria-expanded', 'true'),
            );
            cy.get('[data-testid="research-accordion-panel"]').should('exist').should('be.visible');

            // confirm we can click a button to close an accordion
            cy.get('button[data-testid="research-accordion-button"]').click();
            cy.waitUntil(() =>
                cy.get('button[data-testid="research-accordion-button"]').should('have.attr', 'aria-expanded', 'false'),
            );
            cy.get('[data-testid="research-accordion-panel"]').should('exist').should('not.be.visible');
        });
        // hero is set in the hompage template - test in e2e
        context('homepage layout', () => {
            it('is laid out correctly at mobile size', () => {
                cy.visit('http://localhost:8080/src/applications/libguides/demo.html');
                cy.viewport(320, 480);
                cy.get('cultural-advice').should('exist').scrollIntoView();
                // let firstItemTop;
                // let firstItemLeft;
                // cy.get('[data-testid="hero-image"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         firstItemTop = $el.position().top;
                //         firstItemLeft = $el.position().left;
                //     });
                // cy.get('[data-testid="hero-words-words-wrapper"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         const secondItemTop = $el.position().top;
                //         const secondItemLeft = $el.position().left;
                //
                //         // at mobile size, the image (first) and words (second) are stacked vertically
                //         expect(secondItemTop).to.be.greaterThan(firstItemTop);
                //         expect(secondItemLeft).to.equal(firstItemLeft);
                //     });
            });
            it('is laid out correctly at tablet size', () => {
                cy.visit('http://localhost:8080/src/applications/libguides/demo.html');
                cy.viewport(840, 900);
                cy.get('cultural-advice').should('exist').scrollIntoView();
                // let firstItemTop;
                // let firstItemLeft;
                // cy.get('[data-testid="hero-image"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         firstItemTop = $el.position().top;
                //         firstItemLeft = $el.position().left;
                //     });
                // cy.get('[data-testid="hero-words-words-wrapper"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         const secondItemTop = $el.position().top;
                //         const secondItemLeft = $el.position().left;
                //
                //         // at tablet size, the image (first) and words (second) are stacked vertically
                //         expect(secondItemTop).to.be.greaterThan(firstItemTop);
                //         expect(secondItemLeft).to.equal(firstItemLeft);
                //     });
            });
            it('is laid out correctly at narrow desktop size', () => {
                cy.visit('http://localhost:8080/src/applications/libguides/demo.html');
                cy.viewport(905, 800);
                cy.get('cultural-advice').should('exist').scrollIntoView();
                // let firstItemTop;
                // let firstItemLeft;
                // cy.get('[data-testid="hero-image"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         firstItemTop = $el.position().top;
                //         firstItemLeft = $el.position().left;
                //     });
                // cy.get('[data-testid="hero-words-words-wrapper"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         const secondItemTop = $el.position().top;
                //         const secondItemLeft = $el.position().left;
                //
                //         // at narrow desktop, hero image (first) sits to the right of the words (second)
                //         expect(secondItemTop - firstItemTop).to.be.lessThan(1);
                //         expect(secondItemTop - firstItemTop).to.be.greaterThan(-1);
                //         expect(firstItemLeft).to.be.greaterThan(secondItemLeft);
                //     });
            });
            it('is laid out correctly at desktop size', () => {
                cy.visit('http://localhost:8080/src/applications/libguides/demo.html');
                cy.viewport(1280, 900);
                cy.get('cultural-advice').should('exist').scrollIntoView();
                // let firstItemTop;
                // let firstItemLeft;
                // cy.get('[data-testid="hero-image"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         firstItemTop = $el.position().top;
                //         firstItemLeft = $el.position().left;
                //     });
                // cy.get('[data-testid="hero-words-words-wrapper"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         const secondItemTop = $el.position().top;
                //         const secondItemLeft = $el.position().left;
                //
                //         // at desktop, hero image (first) sits to the right of the words (second)
                //         expect(secondItemTop - firstItemTop).to.be.lessThan(1);
                //         expect(secondItemTop - firstItemTop).to.be.greaterThan(-1);
                //         expect(secondItemLeft).to.be.lessThan(firstItemLeft);
                //     });
            });
        });
    });

    context('Springshare Cal works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/libcal/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            // the breadcrumbs are moved from the springshare location into our uq-site-header
            const nav = cy
                .get('uq-site-header')
                .shadow()
                .find('[data-testid="breadcrumb_nav"]')
                .should('exist')
                .children()
                .should('have.length', 5);

            proactiveChatLoadsAsIcon();
            hasNoAuthButton();
            hasCulturalAdviceBanner();

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

            hasCulturalAdviceBanner();

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

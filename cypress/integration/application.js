/// <reference types="cypress" />

describe('Dummy Application', () => {
    context('Works as expected', () => {
        it('Where javascript is used to alter the base html acts correctly', () => {
            cy.visit('http://localhost:8080/index-via-js.html');
            cy.injectAxe();
            cy.viewport(1280, 900);
            // (Library link not currently in header)
            // // applications/testing can remove the Library entry from the global menu
            // cy.get('uq-header').shadow().find('div.nav-global').find('#menu-item-library').should('not.exist');
            // applications/testing has a skip nav button
            cy.get('uq-header').shadow().find('button[data-testid="skip-nav"]').should('exist');
            // has an askus button
            cy.get('askus-button').shadow().find('button[data-testid="askus-button"]').should('exist');
            // has an auth button
            cy.get('auth-button').shadow().find('button[data-testid="auth-button-logout"]').should('exist');
            // has a mega menu
            // the menu appears on click
            cy.get('uq-site-header').shadow().find('nav[data-testid="uq-site-header-megamenu"]').should('be.visible');
            // and has the correct children
            cy.get('uq-site-header')
                .shadow()
                .find('nav[data-testid="uq-site-header-megamenu"]')
                .find('ul')
                .should('have.length', 7); // length of the megamenu .json
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

    function hasMegaMenu() {
        cy.get('uq-site-header')
            .shadow()
            .find('li[data-testid="menu-group-item-0"]')
            .should('exist')
            .contains('Library services');
    }

    function hasNoMegaMenu() {
        cy.get('uq-site-header').shadow().find('li[data-testid="menu-group-item-0"]').should('not.exist');
    }

    function hasAskusButton() {
        cy.get('askus-button').shadow().find('button[data-testid="askus-button"]').should('exist');
    }

    function hasNoAskusButton() {
        cy.get('askus-button').should('not.exist');
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
    }

    function hasNoAlerts() {
        cy.get('alert-list').should('not.exist');
    }

    function hasConnectFooter() {
        cy.get('connect-footer')
            .shadow()
            .find('[data-testid="connect-footer-social-heading"]')
            .should('exist')
            .and('contain', 'Connect with the Library');
    }

    function hasNoConnectFooter() {
        cy.get('connect-footer').should('not.exist');
    }

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
            .find('button[data-testid="account-option-button')
            .should('exist')
            .and('contain', username);
    }

    // these tests check that the application load.js files load properly and that each application has only the expected inclusions

    context('Studenthub works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/studenthub/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasNoMegaMenu();

            hasAskusButton();
            hasNoAuthButton();

            hasAnAlert();

            hasConnectFooter();
            hasUqFooter();
        });
    });

    context('app.library.uq.edu.au works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/uqlapp/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasNoMegaMenu();

            hasAskusButton();
            hasAuthButton();

            hasAnAlert();

            hasConnectFooter();
            hasUqFooter();
        });
    });

    context('Shared works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/shared/demo-ezproxy.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasNoMegaMenu();

            hasNoAskusButton();
            hasNoAuthButton();

            hasAnAlert();

            hasNoConnectFooter();

            hasUqFooter();
        });
    });

    context('Rightnow works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/rightnow/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasMegaMenu();

            hasAskusButton();
            hasNoAuthButton();

            hasAnAlert();

            hasConnectFooter();

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

            hasNoMegaMenu();

            hasAskusButton();
            hasNoAuthButton();

            hasNoAlerts();

            hasNoConnectFooter();

            hasNoUqFooter();
        });
    });

    context('Lib Guides works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/libguides/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasNoMegaMenu();

            hasNoAskusButton();
            hasNoAuthButton();

            hasAnAlert();

            hasConnectFooter();

            hasUqFooter();
        });
    });

    context('Lib Cal works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/libcal/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasNoMegaMenu();

            hasNoAskusButton();
            hasNoAuthButton();

            hasAnAlert();

            hasConnectFooter();

            hasUqFooter();
        });
    });

    context('Drupal works as expected', () => {
        it('Sample page load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/drupal/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasMegaMenu();

            hasAskusButton();
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

            hasConnectFooter();

            hasUqFooter();

            // simple check that the components exist, now that we are splitting them out from the main reusable.min file
            cy.get('search-portal').shadow().find('h2').should('contain', 'Library Search');
            cy.get('ez-proxy')
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

            hasNoConnectFooter();

            hasNoUqFooter();
        });
    });

    context('Auth works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/auth/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasNoMegaMenu();

            hasAskusButton();
            hasNoAuthButton();

            hasAnAlert();

            hasUqFooter();
        });
    });

    context('changing properties as will be required by eSpace works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/espace/example.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader('https://espace.library.uq.edu.au/');

            hasNoMegaMenu();

            hasNoAskusButton();
            hasAuthButton();

            hasAnAlert();

            hasNoUqFooter();
        });
    });
});

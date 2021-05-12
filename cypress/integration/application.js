/// <reference types="cypress" />

describe('Dummy Application', () => {
    context('Works as expected', () => {
        it('Javascript calls act correctly', () => {
            cy.visit('http://localhost:8080/index-via-js.html');
            cy.injectAxe();
            cy.viewport(1280, 900);
            // applications/testing can remove the Library entry from the global menu
            cy.get('uq-header').shadow().find('div.nav-global').find('#menu-item-library').should('not.exist');
            // applications/testing has a skip nav button
            cy.get('uq-header').shadow().find('button[data-testid="skip-nav"]').should('exist');
            // has an askus button
            cy.get('askus-button').shadow().find('button[data-testid="askus-button"]').should('exist');
            // has a mylibrary button
            cy.get('mylibrary-button').shadow().find('button[data-testid="mylibrary-button"]').should('exist');
            // has an auth button
            cy.get('auth-button').shadow().find('button[data-testid="auth-button-logout"]').should('exist');
            // has a mega menu
            // the menu appears on click
            cy.get('uq-site-header').shadow().find('nav#jsNav').should('be.visible');
            // and has the correct children
            cy.get('uq-site-header').shadow().find('nav#jsNav').find('ul').should('have.length', 7); // should we drive this number from the json?
        });
    });

    function hasUqHeader() {
        cy.get('uq-header')
            .shadow()
            .find('header[data-testid="uq-header"]')
            .find('div.nav-global')
            .find('#menu-item-library')
            .should('not.exist');
    }

    function hasUqSiteHeader(sitesearchurl = 'https://www.library.uq.edu.au/') {
        cy.get('uq-site-header')
            .shadow()
            .find('div.uq-site-header')
            .find('a[data-testid="site-title"]')
            .should('have.attr', 'href')
            .and('include', sitesearchurl);
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
    }

    function hasNoAlerts() {
        cy.get('alert-list').should('not.exist');
    }

    function hasConnectFooter() {
        cy.get('connect-footer')
            .shadow()
            .find('ul[data-testid="connect-footer-menu"]')
            .should('exist')
            .and('contain', 'Library home');
    }

    function hasNoConnectFooter() {
        cy.get('connect-footer').should('not.exist');
    }

    function hasUqFooter() {
        cy.get('uq-footer')
            .shadow()
            .find('a.uq-footer__acknowledgement__link')
            .should('exist')
            .and('contain', 'Reconciliation statement');
    }

    function hasNoUqFooter() {
        cy.get('uq-footer').should('not.exist');
    }

    function hasAuthButton() {
        cy.get('auth-button')
            .shadow()
            .find('button[data-testid="auth-button-logout')
            .should('exist')
            .and('contain', 'Log out');
    }

    function hasMyLibraryButton() {
        cy.get('mylibrary-button')
            .shadow()
            .find('button[data-testid="mylibrary-button')
            .should('exist')
            .and('contain', 'MyLibrary');
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

    context('Uqlapp works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/uqlapp/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasNoMegaMenu();

            hasAskusButton();
            hasAuthButton();
            hasMyLibraryButton();

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

    context('Omeka works as expected', () => {
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/omeka/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasNoMegaMenu();

            hasAskusButton();
            hasNoAuthButton();

            hasAnAlert();

            hasNoConnectFooter();

            hasUqFooter();
        });
    });

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
        it('Javascript load works correctly', () => {
            cy.visit('http://localhost:8080/src/applications/drupal/demo.html');
            cy.viewport(1280, 900);

            hasUqHeader();

            hasUqSiteHeader();

            hasMegaMenu();

            hasAskusButton();
            hasAuthButton();
            hasMyLibraryButton();

            hasAnAlert();

            hasConnectFooter();

            hasUqFooter();
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

    context('eSpace works as expected', () => {
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

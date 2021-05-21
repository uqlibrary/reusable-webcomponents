/// <reference types="cypress" />

describe('UQ Header', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });
    context('Header', () => {
        it('Header is visible without interaction at 1280', () => {
            cy.viewport(1280, 900);
            cy.get('uq-header').shadow().find('div.nav-global').find('.search-toggle__button').should('be.visible');
            cy.get('uq-header').shadow().find('div.nav-global').find('div.logo').should('be.visible');
            cy.get('uq-header')
                .shadow()
                .find('div.nav-global')
                .find('nav.menu-global ul')
                .find('li')
                .should('have.length', 9);
            cy.get('uq-header')
                .shadow()
                .find('div.nav-global')
                .find('nav.menu-global ul')
                .should('be.visible')
                .find('li')
                .should('have.length', 9);

            cy.get('uq-header').shadow().find('div.nav-global').find('.search-toggle__button').click();
            cy.wait(1200);
            cy.get('uq-header').shadow().find('div.nav-search').should('be.visible');
            cy.get('uq-header').shadow().find('div.nav-search').should('contain', 'What are you looking for?');
            cy.get('uq-header')
                .shadow()
                .find('div.nav-search')
                .should('contain', 'Search this website (library.uq.edu.au)');
            cy.get('uq-header').shadow().find('div.nav-search').find('input.search-query__submit').should('be.visible');
            cy.get('uq-header').shadow().find('div.nav-search').find('input#edit-as_sitesearch-off.form-radio').click();
        });

        it('Header passes accessibility', () => {
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.checkA11y('uq-header', {
                reportName: 'Header',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('Responsive Menu opens', () => {
            cy.viewport(768, 1024);

            // the reponsive button exists
            cy.get('uq-site-header')
                .shadow()
                .find('button[data-testid="uq-site-header__navigation-toggle"]')
                .should('be.visible');

            // allow time for menu and ITS script to load
            cy.wait(200);
            // open the menu
            cy.get('uq-site-header')
                .shadow()
                .find('button[data-testid="uq-site-header__navigation-toggle"]')
                .trigger('click');
            // the menu appears on click
            cy.get('uq-site-header').shadow().find('nav#jsNav').should('be.visible');
            // and has the correct children
            cy.get('uq-site-header').shadow().find('nav#jsNav').find('ul').should('have.length', 7); // should we drive this number from the json?
            // a child shows in the menu
            cy.get('uq-site-header').shadow().find('li[data-testid="menu-group-item-0"]').should('be.visible');
            // but its first child is hidden
            cy.get('uq-site-header')
                .shadow()
                .find('li[data-testid="menu-group-services-link-0"]')
                .should('not.be.visible');
            // click open its down arrow button
            cy.get('uq-site-header').shadow().find('span[data-testid="menu-group-item-0-open"]').click();
            // now the first child is visible
            cy.get('uq-site-header').shadow().find('li[data-testid="menu-group-services-link-0"]').should('be.visible');
        });

        it('Desktop menu opens', () => {
            cy.viewport(1280, 900);

            // mobile button is hidden
            cy.get('uq-site-header')
                .shadow()
                .find('[data-testid="uq-site-header__navigation-toggle"]')
                .should('not.be.visible');

            // allow time for menu and ITS script to load
            cy.wait(200);
            // first item in menu is found
            cy.get('uq-site-header').shadow().find('nav#jsNav').should('be.visible');
            // but its first child is hidden
            cy.get('uq-site-header')
                .shadow()
                .find('li[data-testid="menu-group-services-link-0"]')
                .should('not.be.visible');
            // hover over the first item
            cy.get('uq-site-header').shadow().find('a[data-testid="menu-group-item-0-link"]').trigger('mouseenter');
            // now the first child is visible
            cy.get('uq-site-header').shadow().find('li[data-testid="menu-group-services-link-0"]').should('be.visible');
        });
    });
});

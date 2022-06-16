/// <reference types="cypress" />

describe('UQ Header', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });
    context('Header', () => {
        it('UQ Header operates as expected', () => {
            cy.viewport(1280, 900);
            cy.get('uq-header')
                .shadow()
                .within(() => {
                    // UQ logo is visible
                    cy.get('[data-testid="uq-header-logo"]').should('be.visible');

                    // top right nav exists
                    cy.get('[data-testid="uq-header-secondary-nav"]').find('li').should('have.length', 5);

                    // secondary nav exists
                    cy.get('[data-testid="uq-header-primary-nav"]').find('li').should('have.length', 4);

                    // Site Search accordion toggles correctly
                    cy.get('[data-testid="uq-header-search-button"]').should('be.visible');
                    cy.get('.uq-header__search-query-input').should('not.be.visible');
                    cy.get('[data-testid="uq-header-search-button"]').click();
                    cy.wait(1200);
                    cy.get('.uq-header__search-query-input').should('exist').should('be.visible');
                    cy.get('[data-testid="uq-header-search-input"]').should('exist').should('be.visible');
                    cy.get('input[placeholder="Search by keyword"]').should('exist').should('be.visible');
                    cy.get('[data-testid="uq-header-search-label-library"]').should(
                        'contain',
                        'Search this website (library.uq.edu.au)',
                    );
                    cy.get('[data-testid="uq-header-search-submit"]').should('be.visible');
                    cy.get('[data-testid="uq-header-search-button"]').click();
                    cy.get('.uq-header__search-query-input').should('not.be.visible');
                });
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

        it('Responsive Menu operates as expected', () => {
            function mobileMenuIsHidden() {
                cy.get('uq-site-header')
                    .shadow()
                    .find('nav[data-testid="uq-site-header-megamenu"] > ul:first-child')
                    .should('exist')
                    .should('not.be.visible');
                cy.get('uq-site-header').shadow().find('li[data-testid="menu-group-item-0"]').should('not.be.visible');
            }
            function toggleTheMobileMenuButton() {
                cy.get('uq-header').shadow().find('button[data-testid="mobile-menu-toggle-button"]').trigger('click');
            }

            cy.viewport(768, 1024);

            // allow time for menu and ITS script to load
            cy.wait(200);

            mobileMenuIsHidden();

            // open the menu
            cy.get('uq-header').shadow().find('[data-testid="mobile-menu-toggle-button"]').should('be.visible');

            toggleTheMobileMenuButton();

            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    function otherItemsAreVisible(isVisible = true) {
                        const visibility = isVisible ? 'be.visible' : 'not.be.visible';
                        cy.get('[data-testid="menu-group-item-6"]').should(visibility);
                        cy.get('.uq-site-header__navigation__list__first-permanent-child').should(visibility);
                    }

                    // the menu appears on click
                    cy.get('[data-testid="uq-site-header-megamenu"]').should('be.visible');
                    otherItemsAreVisible();
                    cy.get('.uq-site-header__navigation__list__first-permanent-child').should('be.visible');

                    // and has the correct children
                    cy.get('[data-testid="uq-site-header-megamenu"]').find('ul').should('have.length', 7);
                    // a child shows in the menu
                    cy.get('li[data-testid="menu-group-item-0"]').should('be.visible');
                    // but its first child is hidden
                    cy.get('li[data-testid="menu-group-services-link-0"]').should('not.be.visible');

                    otherItemsAreVisible();

                    // click open its down arrow button
                    cy.get('button[data-testid="menu-group-item-0-open"]').click();
                    // now the first child is visible
                    cy.get('li[data-testid="menu-group-services-link-0"]').should('be.visible');

                    otherItemsAreVisible(false);

                    // click the close button
                    cy.get('[data-testid="uq-site-header__navigation__list--close-0"]').should('be.visible').click();
                    // children are hidden again
                    cy.get('li[data-testid="menu-group-services-link-0"]').should('not.be.visible');

                    otherItemsAreVisible();

                    cy.get('[data-testid="uq-header-study-link-mobile"]').should('be.visible').and('contain', 'Study');
                    cy.get('[data-testid="uq-header-home-link-mobile"]').should('be.visible').and('contain', 'UQ home');
                });
            // close the mobile menu
            toggleTheMobileMenuButton();

            mobileMenuIsHidden();
        });

        it('Desktop menu can open', () => {
            cy.viewport(1280, 900);

            // mobile button is hidden
            cy.get('uq-header').shadow().find('[data-testid="mobile-menu-toggle-button"]').should('not.be.visible');

            // allow time for menu and ITS script to load
            cy.wait(200);
            // first item in menu is found
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="uq-site-header-megamenu"]').should('be.visible');
                    // but its first child is hidden
                    cy.get('li[data-testid="menu-group-services-link-0"]').should('not.be.visible');
                    // hover over the first item
                    cy.get('a[data-testid="menu-group-item-0-link"]').trigger('mouseenter');
                    // now the first child is visible
                    cy.get('li[data-testid="menu-group-services-link-0"]').should('be.visible');

                    cy.get('[data-testid="uq-header-study-link-mobile"]').should('not.be.visible');
                    cy.get('[data-testid="uq-header-home-link-mobile"]').should('not.be.visible');
                });
        });

        it('the menu draws properly on device rotation', () => {
            cy.viewport(1024, 768); // ipad landscape
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="mega-menu-container"]')
                        .should('exist')
                        .invoke('css', 'height')
                        .then((str) => parseInt(str))
                        .should('be.lt', 90); // the menu does not wrap

                    cy.viewport(768, 1024); // ipad portrait

                    cy.wait(500); // use waitUntil when it is available
                });
            cy.get('uq-header').shadow().find('[data-testid="mobile-menu-toggle-button"]').should('exist').click();
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.viewport(1024, 768); // ipad landscape
                    cy.wait(500);
                    cy.get('[data-testid="mega-menu-container"]')
                        .should('exist')
                        .invoke('css', 'height')
                        .then((str) => parseInt(str))
                        .should('be.lt', 90); // the menu does not wrap
                });
        });
    });
});

/// <reference types="cypress" />

import { getHomepageLink } from '../../src/helpers/access';

describe('UQ Header', () => {
    context('Helpers', () => {
        function expectHomePageOfLinkIs(currentUrl, expectedHomepage) {
            const currentUrlParts = new URL(currentUrl);
            const loggedoutHomepageLink = getHomepageLink(
                currentUrlParts.hostname,
                currentUrlParts.protocol,
                currentUrlParts.port,
                currentUrlParts.pathname,
            );
            expect(loggedoutHomepageLink).to.be.equal(expectedHomepage);
        }

        it('should generate the correct homepage links', () => {
            expectHomePageOfLinkIs(
                'https://www.library.uq.edu.au/learning-resources?coursecode=PHYS1001&campus=St%20Lucia&semester=Semester%201%202023',
                'https://www.library.uq.edu.au',
            );

            expectHomePageOfLinkIs(
                'https://homepage-development.library.uq.edu.au/master/#/admin/masquerade',
                'https://homepage-development.library.uq.edu.au/master/#/',
            );

            expectHomePageOfLinkIs(
                'https://homepage-staging.library.uq.edu.au/learning-resources?coursecode=FREN1020&campus=St%20Lucia&semester=Semester%202%202023',
                'https://homepage-staging.library.uq.edu.au',
            );

            expectHomePageOfLinkIs('https://app.library.uq.edu.au/#/membership/admin', 'https://app.library.uq.edu.au');

            expectHomePageOfLinkIs(
                'http://localhost:8080/#keyword=;campus=;weekstart=',
                'http://localhost:8080/?user=public',
            );
        });
    });
    context('Header', () => {
        beforeEach(() => {
            cy.visit('http://localhost:8080');
        });
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
                    cy.get('[data-testid="uq-header-primary-nav"]')
                        .find('li')
                        .parent()
                        .children()
                        .its('length')
                        .should('be.gt', 0);

                    // Site Search accordion toggles correctly
                    cy.get('[data-testid="uq-header-search-button"]').should('be.visible');
                    cy.get('.uq-header__search-query-input').should('not.be.visible');
                    cy.get('[data-testid="uq-header-search-button"]').click();
                    cy.wait(1200);
                    cy.get('.uq-header__search-query-input').should('exist').should('be.visible');
                    cy.get('[data-testid="uq-header-search-input"]').should('exist').should('be.visible');
                    cy.get('input[placeholder="Search by keyword"]').should('exist').should('be.visible');
                    cy.get('[data-testid="uq-header-search-input-as-sitesearch"]')
                        .should('exist')
                        .should('not.be.visible');
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

        it('Site-header has expected items', () => {
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="root-link"]')
                        .should('exist')
                        .contains('UQ home')
                        .should('have.attr', 'href')
                        .and('include', 'https://uq.edu.au/');
                    cy.get('[data-testid="site-title"]')
                        .should('exist')
                        .contains('Library')
                        .should('have.attr', 'href')
                        .and('include', 'https://www.library.uq.edu.au/');
                    cy.get('[data-testid="subsite-title"]').should('not.exist');
                });
        });

        it('Breadcrumbs in Responsive show the correct item', () => {
            cy.viewport(650, 1024);
            // both items show
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="root-link"]').should('exist').should('be.visible').contains('UQ home');
                    cy.get('[data-testid="site-title"]').should('exist').should('be.visible').contains('Library Test');
                });
            cy.viewport(590, 1024);
            // both items show
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="root-link"]').should('exist').should('be.visible').contains('UQ home');
                    cy.get('[data-testid="site-title"]').should('exist').should('not.be.visible');
                });
        });

        it.skip('Responsive Menu operates as expected', () => {
            function mobileMenuIsHidden() {
                cy.get('uq-site-header')
                    .shadow()
                    .find('nav[aria-label="Site navigation"] > ul:first-child')
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
                    cy.get('[aria-label="Site navigation"]').should('be.visible');
                    otherItemsAreVisible();
                    cy.get('.uq-site-header__navigation__list__first-permanent-child').should('be.visible');

                    // and has the correct children
                    cy.get('[aria-label="Site navigation"]').find('ul').should('have.length', 7);
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

        it.skip('Desktop menu can open', () => {
            cy.viewport(1280, 900);

            // mobile button is hidden
            cy.get('uq-header').shadow().find('[data-testid="mobile-menu-toggle-button"]').should('not.be.visible');

            // allow time for menu and ITS script to load
            cy.wait(200);
            // first item in menu is found
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[aria-label="Site navigation"]').should('be.visible');
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
    });
});

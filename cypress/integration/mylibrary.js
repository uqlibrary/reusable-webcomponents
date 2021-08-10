/// <reference types="cypress" />

import ApiAccess from '../../src/ApiAccess/ApiAccess';

describe('My Library menu', () => {
    beforeEach(() => {
        // whenever we change users in the same tab we have to clear local storage or it will pick up the previous user :(
        new ApiAccess().removeAccountStorage();
    });
    context('My Library Menu', () => {
        it('Mylibrary not available to logged out user', () => {
            cy.visit('http://localhost:8080?user=public');
            cy.viewport(1280, 900);
            cy.wait(100);
            // the page is valid: it contains the correct header
            cy.get('uq-site-header').shadow().find('#site-title').should('contain', 'Library');
            // but because they are logged out, it does not contain a mylibrary button
            // (mylibrary root has no children)
            cy.get('uq-site-header')
                .find('span[slot="site-utilities"] #mylibrarystub')
                .find('mylibrary-button')
                .should('not.exist');
        });

        it('My Library passes accessibility', () => {
            cy.visit('http://localhost:8080?user=vanilla');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.get('uq-site-header').find('span[slot="site-utilities"] mylibrary-button').should('exist');
            cy.get('uq-site-header')
                .find('span[slot="site-utilities"] mylibrary-button')
                .shadow()
                .find('button#mylibrary-button')
                .click();
            cy.wait(500);
            cy.get('uq-site-header')
                .find('span[slot="site-utilities"] mylibrary-button')
                .shadow()
                .find('#mylibrary-menu.closed-menu')
                .should('not.exist');
            cy.checkA11y('uq-site-header', {
                reportName: 'My Library',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('Admin gets admin entries', () => {
            cy.visit('http://localhost:8080?user=uqstaff');
            cy.viewport(1280, 900);
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('div#mylibrary')
                .should('contain', 'MyLibrary');
            cy.get('uq-site-header').find('mylibrary-button').shadow().find('button#mylibrary-button').click();
            cy.wait(500);
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('ul.mylibrary-menu-list')
                .find('li')
                .should('have.length', 11);
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('li[data-testid="mylibrary-masquerade"]')
                .should('exist')
                .contains('Masquerade');
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('li[data-testid="alerts-admin"]')
                .should('exist')
                .contains('Website alerts');
        });

        it('Researcher gets espace but not admin entries', () => {
            cy.visit('http://localhost:8080?user=s1111111');
            cy.viewport(1280, 900);
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('div#mylibrary')
                .should('contain', 'MyLibrary');
            cy.get('uq-site-header').find('mylibrary-button').shadow().find('button#mylibrary-button').click();
            cy.wait(500);
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('ul.mylibrary-menu-list')
                .find('li')
                .should('have.length', 9);
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('li[data-testid="mylibrary-espace"]')
                .contains('eSpace dashboard');
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('li[data-testid="mylibrary-masquerade"]')
                .should('not.exist');
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('li[data-testid="alerts-admin"]')
                .should('not.exist');
        });

        it('non-Researcher gets neither espace nor admin entries', () => {
            cy.visit('http://localhost:8080?user=s3333333');
            cy.viewport(1280, 900);
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('div#mylibrary')
                .should('contain', 'MyLibrary');
            cy.get('uq-site-header').find('mylibrary-button').shadow().find('button#mylibrary-button').click();
            cy.wait(500);
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('ul.mylibrary-menu-list')
                .find('li')
                .should('have.length', 8);
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('li[data-testid="mylibrary-masquerade"]')
                .should('not.exist');
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('li[data-testid="alerts-admin"]')
                .should('not.exist');
            cy.get('uq-site-header')
                .find('mylibrary-button')
                .shadow()
                .find('li[data-testid="mylibrary-espace"]')
                .should('not.exist');
        });

        it('Pressing esc closes the mylibrary menu', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('mylibrary-button').shadow().find('button#mylibrary-button').click();
            cy.wait(500);
            cy.get('mylibrary-button').shadow().find('div#mylibrary-menu').should('be.visible');
            cy.get('body').type('{enter}', { force: true });
            cy.wait(500);
            cy.get('mylibrary-button').shadow().find('div#mylibrary-menu').should('be.visible');
            cy.get('body').type('{esc}', { force: true });
            cy.wait(500);
            cy.get('mylibrary-button').shadow().find('div#mylibrary-menu').should('not.be.visible');
        });

        it('Clicking the pane closes the mylibrary menu', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.get('mylibrary-button').shadow().find('button#mylibrary-button').click();
            cy.wait(500);
            cy.get('mylibrary-button').shadow().find('div#mylibrary-menu').should('be.visible');
            cy.get('mylibrary-button').shadow().find('div#mylibrary-pane').click();
            cy.wait(500);
            cy.get('mylibrary-button').shadow().find('div#mylibrary-menu').should('not.be.visible');
        });

        it('Navigates to page from mylibrary menu', () => {
            cy.visit('http://localhost:8080?user=s1111111');
            cy.viewport(1280, 900);
            cy.wait(1500);
            cy.intercept('GET', 'https://support.my.uq.edu.au/app/library/feedback', {
                statusCode: 200,
                body: 'user is on library feedback page',
            });
            cy.get('mylibrary-button').shadow().find('button#mylibrary-button').click();
            cy.wait(500);
            cy.get('mylibrary-button').shadow().find('[data-testid="mylibrary-menu-feedback"]').should('be.visible');
            cy.get('mylibrary-button').shadow().find('[data-testid="mylibrary-menu-feedback"]').click();
            cy.get('body').contains('user is on library feedback page');
        });
    });
});

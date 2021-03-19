/// <reference types="cypress" />

describe('Skip nav', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
        cy.injectAxe();
    });
    context('Skip Menu', () => {
        it('Appears as expected', () => {
            cy.viewport(1280, 900);
            cy.get('uq-header')
                .shadow()
                .find('#skip-nav')
                .then(($target) => {
                    return $target[0].getBoundingClientRect().y;
                })
                .should((coords) => {
                    expect(coords).to.eq(-50);
                });

            cy.get('uq-header').shadow().find('#skip-nav').focus();
            cy.wait(1000);
            cy.get('uq-header')
                .shadow()
                .find('#skip-nav')
                .then(($target) => {
                    return $target[0].getBoundingClientRect().y;
                })
                .should((coords) => {
                    expect(coords).to.eq(0);
                });
            cy.get('uq-header').shadow().find('#skip-nav').should('contain', 'Skip to site content');
        });

        it('AskUs passes accessibility', () => {
            cy.viewport(1280, 900);
            cy.get('uq-header').shadow().find('#skip-nav').focus();
            cy.wait(1000);
            cy.checkA11y('uq-header', {
                reportName: 'Skip Nav',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});

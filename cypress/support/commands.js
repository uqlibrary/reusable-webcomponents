// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('typeTab', (shiftKey, ctrlKey) => {
    cy.focused().trigger('keydown', {
        keyCode: 9,
        which: 9,
        shiftKey: shiftKey,
        ctrlKey: ctrlKey,
    });
});

// from https://github.com/cypress-io/cypress/issues/877#issuecomment-490504922
Cypress.Commands.add('isNotInViewport', (element) => {
    cy.get(element).then(($el) => {
        const bottom = Cypress.$(cy.state('window')).height();
        const rect = $el[0].getBoundingClientRect();

        expect(rect.top).to.be.greaterThan(bottom);
        expect(rect.bottom).to.be.greaterThan(bottom);
        expect(rect.top).to.be.greaterThan(bottom);
        expect(rect.bottom).to.be.greaterThan(bottom);
    });
});

Cypress.Commands.add('isInViewport', (element) => {
    cy.get(element).then(($el) => {
        const bottom = Cypress.$(cy.state('window')).height();
        const rect = $el[0].getBoundingClientRect();

        expect(rect.top).not.to.be.greaterThan(bottom);
        expect(rect.bottom).not.to.be.greaterThan(bottom);
        expect(rect.top).not.to.be.greaterThan(bottom);
        expect(rect.bottom).not.to.be.greaterThan(bottom);
    });
});

Cypress.Commands.add('getIframeBodyInShadow', (iframeSelector, webComponentName = 'proactive-chat') => {
    // Get the iframe > document > body
    // and retry until the body element is not empty
    return (
        cy
            .get(webComponentName)
            .shadow()
            .find(iframeSelector)
            .should('exist')
            .its('0.contentDocument.body')
            .should('exist')
            .should('not.be.empty')
            // wraps "body" DOM element to allow
            // chaining more Cypress commands, like ".find(...)"
            .then(cy.wrap)
    );
});

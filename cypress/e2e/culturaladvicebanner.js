describe('Cultural Advice', () => {
    context('banner', () => {
        beforeEach(() => {
            cy.visit('http://localhost:8080/index.html');
        });
        it('is accessible on the desktop', () => {
            cy.viewport(1280, 900);
            cy.waitUntil(() => cy.get('cultural-advice').shadow().find('[data-testid="cultural-advice-statement"]'));
            cy.get('cultural-advice').shadow().find('[data-testid="cultural-advice-statement"]').contains('custodian');

            cy.injectAxe();
            cy.checkA11y('cultural-advice', {
                reportName: 'Cultural Advice Popup',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('is accessible on mobile', () => {
            cy.viewport(320, 480);
            cy.waitUntil(() => cy.get('cultural-advice').shadow().find('[data-testid="cultural-advice-statement"]'));
            cy.get('cultural-advice').shadow().find('[data-testid="cultural-advice-statement"]').contains('custodian');

            cy.injectAxe();
            cy.checkA11y('cultural-advice', {
                reportName: 'Cultural Advice Popup',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});

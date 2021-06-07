import { searchPortalLocale } from '../../src/SearchPortal/searchPortal.locale';

describe('Search Portal', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    /**
     * different search types have a different number of links in the footer area
     * @param numLinks
     */
    function hasCorrectNumberOfFooterLinks(numLinks) {
        cy.get('div[data-testid="primo-search-links"]').find('div').its('length').should('eq', numLinks);
    }

    context('Search Portal', () => {
        it('the search dropdown has the expected children', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="primo-search"]').contains('Search');
                    cy.wait(1000);

                    // on first load, the library drop down displays "Library"
                    cy.get('div[data-testid="primo-search-select"]').contains('Library');
                    hasCorrectNumberOfFooterLinks(4);

                    // there are the correct number of options in the search dropdown
                    cy.get('div[data-testid="primo-search-select"]').click();
                    cy.get('li[data-testid="primo-search-item-0"]').parent().find('li').its('length').should('eq', 9);
                });
        });

        it('Search Portal accessibility', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('div[data-testid="primo-search"]').contains('Search');
                    cy.log('Primo Search - as at initial load');
                    // cy.checkA11y('div[data-testid="primo-search"]', {
                    cy.checkA11y('search-portal', {
                        reportName: 'Search Portal',
                        scopeName: 'Pristine',
                        includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                    });
                    cy.get('input[data-testid="primo-search-autocomplete-input"]').wait(1000).type('beard', 100);
                    cy.get('ul[data-testid="primo-search-autocomplete-listbox"]').wait(1000).contains('beard');
                    cy.log('Primo Search - with autosuggestions present');
                    cy.checkA11y('search-portal', {
                        reportName: 'Search Portal',
                        scopeName: 'Options list',
                        includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                    });
                });
        });

        it('Books search should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="primo-search"]').contains('Search');
                    cy.wait(1000);
                    // main library search (choose Books)
                    cy.get('div[data-testid="primo-search-select"]').click();
                    cy.get('li[data-testid="primo-search-item-1"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('Books');

                    hasCorrectNumberOfFooterLinks(4);

                    // typing in the text area shows the correct entries from the api
                    cy.get('button[data-testid="primo-search-autocomplete-voice-clear"]').click();
                    cy.get('input[data-testid="primo-search-autocomplete-input"]').type('beard', 100);
                    // cy.wait(2000); // wait for api
                    cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 10);

                    // clear 'X' button works
                    cy.get('[data-testid="primo-search-autocomplete-voice-clear"]').click();
                    cy.get('input[data-testid="primo-search-autocomplete-input"]').should('have.value', '');
                    cy.get('ul[data-testid="primo-search-autocomplete-listbox"]').should('not.exist');
                });
        });

        it('Journal articles search should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="primo-search"]').contains('Search');
                    cy.wait(1000);
                    // main library search (choose Journal articles)
                    cy.get('div[data-testid="primo-search-select"]').click();
                    cy.get('li[data-testid="primo-search-item-2"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('Journal articles');

                    hasCorrectNumberOfFooterLinks(4);

                    // typing in the text area shows the correct entries from the api
                    cy.get('button[data-testid="primo-search-autocomplete-voice-clear"]').click();
                    cy.get('input[data-testid="primo-search-autocomplete-input"]').type('beard', 100);
                    cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 10);
                });
        });

        it('Databases should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="primo-search"]').contains('Search');
                    cy.wait(1000);
                    cy.get('div[data-testid="primo-search-select"]').click();
                    cy.get('li[data-testid="primo-search-item-6"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('Databases');

                    hasCorrectNumberOfFooterLinks(2);

                    //  no suggestion api available
                    cy.get('button[data-testid="primo-search-autocomplete-voice-clear"]').click();
                    cy.get('input[data-testid="primo-search-autocomplete-input"]').type('history', 100);
                    cy.get('ul[data-testid="primo-search-autocomplete-listbox"]').should('not.exist');
                });
        });

        it('Exams should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="primo-search"]').contains('Search');
                    cy.wait(1000);
                    // exams occurs in the dropdown
                    cy.get('div[data-testid="primo-search-select"]').click();
                    cy.get('li[data-testid="primo-search-item-7"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('exam paper');

                    hasCorrectNumberOfFooterLinks(1);
                    // the link in the single footer should go to an 'exams' result
                    cy.get('div[data-testid="primo-search-links-6"] a')
                        .should('have.attr', 'href')
                        .and('include', 'exams');

                    // typing in the exams text area shows the correct entries from the api
                    cy.get('button[data-testid="primo-search-autocomplete-voice-clear"]').click();
                    cy.get('input[data-testid="primo-search-autocomplete-input"]').type('PHIL', 100);
                    cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 3);
                });
        });

        it('Course resources should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="primo-search"]').contains('Search');
                    cy.wait(1000);
                    // course resources occurs in the dropdown
                    cy.get('div[data-testid="primo-search-select"]').click();
                    cy.get('li[data-testid="primo-search-item-8"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('Course reading lists');

                    hasCorrectNumberOfFooterLinks(1);
                    // the link in the single footer should go to a 'talis' result
                    cy.get('div[data-testid="primo-search-links-7"] a')
                        .should('have.attr', 'href')
                        .and('include', 'talis.com');

                    // typing in the course resources text area shows the correct entries from the api
                    cy.get('input[data-testid="primo-search-autocomplete-input"]').type('PHIL', 100);
                    cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 3);
                });
        });

        it('When the search type is changed the search sugestions reload', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="primo-search"]').contains('Search');
                    cy.wait(1000);

                    // Library search
                    const searchTerm = 'beard';
                    cy.get('input[data-testid="primo-search-autocomplete-input"]').type(searchTerm, 100);
                    cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 10);

                    cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                        .find('li')
                        .first()
                        .find('a')
                        .should('have.attr', 'href')
                        .and('match', /rtype,exclude,reviews,lk/); // look for the part that is specific to the Library search

                    // change to a different search type
                    cy.get('div[data-testid="primo-search-select"]').click();
                    cy.get('li[data-testid="primo-search-item-1"]').click(); // books
                    cy.wait(1000); // it never takes this long locally!
                    cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                        .find('li')
                        .first()
                        .find('a')
                        .should('have.attr', 'href')
                        .and('match', /facet=rtype,include,books/); // look for the part that is specific to the Book search
                });
        });

        it('When the user clicks elsewhere on the page the Search type dropdown will close', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="primo-search"]').contains('Search');
                    cy.wait(1000);

                    // open the search type dropdown
                    cy.get('div[data-testid="primo-search-select"]').click();
                    // the dropdown is open
                    cy.get('[data-testid="portal-type-selector"]').should('not.have.class', 'hidden');
                });
            // click somewhere on the page outside the dropdown
            cy.get('[data-testid="random-page-element"]').click();
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="portal-type-selector"]').should('have.class', 'hidden');
                });
        });
    });
});

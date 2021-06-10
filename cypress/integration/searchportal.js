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
        cy.get('div[data-testid="search-portal-links"]').find('div').its('length').should('eq', numLinks);
    }

    context('Search Portal', () => {
        it('the search dropdown has the expected children', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="search-portal"]').contains('Search');
                    cy.wait(1000);

                    // on first load, the library drop down displays "Library"
                    cy.get('[data-testid="search-portal-type-select"]').contains('Library');
                    hasCorrectNumberOfFooterLinks(4);

                    // there are the correct number of options in the search dropdown
                    cy.get('div[data-testid="search-type-selector"]')
                        .parent()
                        .find('button')
                        .its('length')
                        .should('eq', 9);
                });
        });

        it('Search Portal accessibility', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('div[data-testid="search-portal"]').contains('Search');
                    cy.log('Primo Search - as at initial load');
                    // cy.checkA11y('div[data-testid="search-portal"]', {
                    cy.checkA11y('search-portal', {
                        reportName: 'Search Portal',
                        scopeName: 'Pristine',
                        includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                    });
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').wait(1000).type('beard');
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]').wait(1000).contains('beard');
                    cy.log('Primo Search - with autosuggestions present');
                    cy.checkA11y('search-portal', {
                        reportName: 'Search Portal',
                        scopeName: 'Options list',
                        includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                    });
                });
        });
        //
        it('Books search should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="search-portal"]').contains('Search');
                    // main library search (choose Books)
                    cy.get('[data-testid="search-portal-type-select"]').click();
                    cy.get('button[data-testid="search-portal-type-select-item-1"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('Books');

                    hasCorrectNumberOfFooterLinks(4);

                    // typing in the text area shows the correct entries from the api
                    cy.get('button[data-testid="search-portal-autocomplete-voice-clear"]').click();
                    // force is required because otherwise it sometimes thinks the text field is disabled when the width of the search type dropdown has changed after search type selection
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').type('beard', { force: true });
                    // cy.wait(2000); // wait for api
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 10);

                    // clear 'X' button works
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').should('have.value', 'beard');
                    cy.get('[data-testid="search-portal-autocomplete-voice-clear"]').click();
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').should('have.value', '');
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]').should('not.exist');
                });
        });

        it('Journal articles search should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="search-portal"]').contains('Search');
                    cy.wait(1000);
                    // main library search (choose Journal articles)
                    cy.get('[data-testid="search-portal-type-select"]').click();
                    cy.get('button[data-testid="search-portal-type-select-item-2"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('Journal articles');

                    hasCorrectNumberOfFooterLinks(4);

                    // typing in the text area shows the correct entries from the api
                    cy.get('button[data-testid="search-portal-autocomplete-voice-clear"]').click();
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').type('beard', { force: true });
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 10);

                    // the user clicks the button to load the search
                    // cy.intercept('GET', 'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,beard&tab=61uq_all&search_scope=61UQ_All&sortby=rank&vid=61UQ&offset=0&facet=rtype,include,articles', {
                    //     statusCode: 200,
                    //     body: 'user is on a Primo result page',
                    // });
                    // cy.get('button[data-testid="search-portal-submit"]').click();
                    // cy.get('body').contains('user is on a Primo result page');
                });
        });

        it('Databases should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="search-portal"]').contains('Search');
                    cy.wait(1000);
                    cy.get('[data-testid="search-portal-type-select"]').click();
                    cy.get('button[data-testid="search-portal-type-select-item-6"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('Databases');

                    hasCorrectNumberOfFooterLinks(2);

                    //  no suggestion api available
                    cy.get('button[data-testid="search-portal-autocomplete-voice-clear"]').click();
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').type('history', { force: true });
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]').should('not.exist');
                });
        });

        it('Exams should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="search-portal"]').contains('Search');
                    cy.wait(1000);
                    // exams occurs in the dropdown
                    cy.get('[data-testid="search-portal-type-select"]').click();
                    cy.get('button[data-testid="search-portal-type-select-item-7"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('exam paper');

                    hasCorrectNumberOfFooterLinks(1);
                    // the link in the single footer should go to an 'exams' result
                    cy.get('div[data-testid="search-portal-links-6"] a')
                        .should('have.attr', 'href')
                        .and('include', 'exams');

                    // typing in the exams text area shows the correct entries from the api
                    cy.get('button[data-testid="search-portal-autocomplete-voice-clear"]').click();
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').type('PHIL', { force: true });
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 3);

                    // check the link is as expected, but don't check the link out - because the exam link diverts to auth it is reliant on outside :(
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                        .find('li')
                        .first()
                        .find('a')
                        .should('have.attr', 'href')
                        .and('match', /https:\/\/www.library.uq.edu.au\/exams\/papers.php\?stub=/);

                    // the user clicks the first result to load the search - exam links divert to auth! Apparently cypress works on the redirected-to link, not where we send them
                    // https://auth.uq.edu.au/idp/module.php/core/loginuserpass.php?AuthState=&etc
                    // cy.intercept('GET', '/idp/module.php', {
                    //     statusCode: 200,
                    //     body: 'user is on an Exams result page via auth',
                    // });
                    // cy.get('li[data-testid="search-portal-autocomplete-option-1"] a').click();
                    // cy.get('body').contains('user is on an Exams result page');
                });
        });

        it('Course resources should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="search-portal"]').contains('Search');
                    cy.wait(1000);
                    // course resources occurs in the dropdown
                    cy.get('[data-testid="search-portal-type-select"]').click();
                    cy.get('button[data-testid="search-portal-type-select-item-8"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('Course reading lists');

                    hasCorrectNumberOfFooterLinks(1);
                    // the single link in the footer should go to a 'talis' result
                    cy.get('div[data-testid="search-portal-links-7"] a')
                        .should('have.attr', 'href')
                        .and('include', 'talis.com');

                    // typing in the course resources text area shows the correct entries from the mock api
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').type('PHIL', { force: true });
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 3);

                    // // cy.intercept('GET', 'https://uq.rl.talis.com/search.html?q=PHIL1013', {
                    // cy.intercept('GET', '/search.html?q=PHIL1013', {
                    //     // statusCode: 200,
                    //     body: 'user is on a Talis result page',
                    // });
                    // cy.get('li[data-testid="search-portal-autocomplete-option-1"] a').click();
                    // cy.get('body').contains('user is on a Talis result page');
                });
        });

        it('When the search type is changed the search sugestions reload', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="search-portal"]').contains('Search');
                    cy.wait(1000);

                    // load a search against the Library search type
                    const searchTerm = 'beard';
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').type(searchTerm, { force: true });
                    // there will be 10 search suggestions
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 10);

                    // and the suggestion on the first link will be a library-type link
                    // cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                    //     .find('li')
                    //     .first()
                    //     .find('a')
                    //     .should('have.attr', 'href')
                    //     .and('match', /rtype,exclude,reviews,lk/); // look for the part that is specific to the Library search

                    // change to a different search type
                    // cy.get('[data-testid="search-portal-type-select"]').focus();
                    cy.get('[data-testid="search-portal-type-select"]').focus().click();
                    // the suggestion list will close
                    // cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                    //     .find('li')
                    //     .its('length')
                    //     .should('eq', 10);

                    // cy.get('button[data-testid="search-portal-type-select-item-1"]').click(); // books
                    // cy.wait(1000); // it never takes this long locally!
                    //
                    // // the search will reload automatically and have book-type links now
                    // cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                    //     .find('li')
                    //     .first()
                    //     .find('a')
                    //     .should('have.attr', 'href')
                    //     .and('match', /facet=rtype,include,books/); // look for the part that is specific to the Book search
                });
        });

        it('When the user clicks elsewhere on the page the search type dropdown will close', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.wait(1000);

                    // open the search type dropdown
                    cy.get('[data-testid="search-portal-type-select"]').click();
                    // the dropdown is open
                    cy.get('[data-testid="portal-type-selector"]').should('not.have.class', 'hidden');
                });
            // click somewhere on the page outside the Search type dropdown
            cy.get('[data-testid="random-page-element"]').click();
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="portal-type-selector"]').should('have.class', 'hidden');
                });
        });

        it('When the user clicks elsewhere on the page the suggestion dropdown will close', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.wait(1000);

                    // type a search query
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').type('beard', { force: true });
                    // the dropdown is open
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 10);
                });
            // click somewhere on the page outside the Search type dropdown
            cy.get('[data-testid="random-page-element"]').click();
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]').should('not.exist');
                });
        });

        it('the user can click on any part of the search type selector', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.wait(1000);

                    // type a search query
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').type('beard', { force: true });
                    // the dropdown is open
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 10);

                    // click on the lowest level item of the search type display label
                    // we cant test portaltype-current-icon because it is covered by its owning svg, but sometimes the user does click on that!
                    cy.get('[data-testid="portaltype-current-svg"]').click();
                    // the dropdown is open
                    cy.get('[data-testid="portal-type-selector"]').should('not.have.class', 'hidden');
                    // select Books
                    cy.get('button[data-testid="search-portal-type-select-item-1"]').click();
                    // the dropdown is closed
                    cy.get('[data-testid="portal-type-selector"]').should('have.class', 'hidden');
                    // the search results reload
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 10);

                    // click on the button item of the search type display label
                    cy.get('[data-testid="search-portal-type-select"]').click();
                    // the dropdown is open
                    cy.get('[data-testid="portal-type-selector"]').should('not.have.class', 'hidden');
                    cy.get('button[data-testid="search-portal-type-select-item-2"]').click();
                    cy.get('[data-testid="portal-type-selector"]').should('have.class', 'hidden');
                    // the search results reload
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 10);

                    // click on the wrapper item of the search type display label
                    cy.get('[data-testid="portaltype-current-wrapper"]').click();
                    // the dropdown is open
                    cy.get('[data-testid="portal-type-selector"]').should('not.have.class', 'hidden');
                    cy.get('button[data-testid="search-portal-type-select-item-3"]').click();
                    cy.get('[data-testid="portal-type-selector"]').should('have.class', 'hidden');
                    // the search results reload
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]')
                        .find('li')
                        .its('length')
                        .should('eq', 10);
                });
        });

        it("the user's search type selection is remembered", () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="search-portal-type-select"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('Library');
                    cy.get('button[data-testid="search-portal-type-select-item-2"]').click();
                    cy.get('[data-testid="portaltype-current-label"]').contains('Journal articles');
                });
            // open a new window and the search type is saved
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="portaltype-current-label"]').contains('Journal articles');
                });
        });

        it('a repeating string returns no results', () => {
            cy.viewport(1300, 1000);
            cy.get('search-portal')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="search-portal"]').contains('Search');
                    cy.wait(1000);

                    // enter a repeating string
                    cy.get('input[data-testid="search-portal-autocomplete-input"]').type('DDDDD', { force: true });
                    cy.get('ul[data-testid="search-portal-autocomplete-listbox"]').should('not.exist');
                });
        });
    });
});

/// <reference types="cypress" />

const DOWN_ARROW_KEYCODE = 40;
const ESCAPE_KEYCODE = 27;
const RETURN_KEYCODE = 13;
const TAB_KEYCODE = 9;
const UP_ARROW_KEYCODE = 38;

describe('Training', () => {
    function openTheByWeekDropdown() {
        cy.get('[data-testid="training-filter-week-list"]').should('have.class', 'hidden');
        cy.waitUntil(() => cy.get('button:contains("By week")').should('be.visible'));
        // the 'enter' key click is simply not working right here on newer cypress, so we lose that keyboard check :(
        // cy.get('[data-testid="training-filter-week-container"]').type('{enter}', { force: true });
        cy.get('button:contains("By week")').parent().click();
        cy.get('[data-testid="training-filter-week-list"]').should('not.have.class', 'hidden');
        cy.get('[data-testid="training-filter-week-list"]').find('button').should('length', 15);
    }

    function openTheByCampusDropdown() {
        cy.get('[data-testid="training-filter-campus-list"]').should('exist').should('have.class', 'hidden');
        cy.waitUntil(() => cy.get('button:contains("By campus")').should('be.visible'));
        // a enter-key click on the campus parent opens the dropdown
        // the 'enter' key click is simply not working right here on newer cypress, so we lose that keyboard check :(
        // cy.get('[data-testid="training-filter-campus-container"]').type('{enter}', { force: true });
        cy.get('button:contains("By campus")').parent().click();
        cy.get('[data-testid="training-filter-campus-list"]').should('not.have.class', 'hidden');
        cy.get('[data-testid="training-filter-campus-list"]').find('button').should('length', 3);
    }

    context('Filter component keyboard navigation', () => {
        // if first test fails, first run again
        // a fail is common immediately after this file is saved. Odd.
        // it can also fail if you have put your cursor in the Developer Tools Console
        it('user can use the arrow keys to navigate up and down the campus dropdown', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            openTheByCampusDropdown();

                            // arrow up and down robustly working (its actually easy to muck this up, so leave it, despite it seeming ovrekill)
                            cy.get('[data-testid="training-filter-campus-label"]')
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-campus-select-0"]').should('have.focus');
                                })
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-campus-select-1"]').should('have.focus');
                                })
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-campus-select-2"]').should('have.focus');
                                })

                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-campus-select-0"]')
                                        // this is actually not expected, but its harmless, so I havent tried to debug it
                                        .should('have.focus');
                                });

                            cy.get('[data-testid="training-filter-campus-select-2"]')
                                .trigger('keydown', {
                                    keyCode: UP_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-campus-select-1"]').should('have.focus');
                                })
                                .trigger('keydown', {
                                    keyCode: UP_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-campus-select-0"]').should('have.focus');
                                })
                                .trigger('keydown', {
                                    keyCode: UP_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    // and we are back on the parent campus button
                                    cy.get('[data-testid="training-filter-campus-container"]').should('have.focus');
                                });
                        });
                });
        });
        it('the user can use the keyboard to navigate the keyword field', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            // can clear text with the escape key
                            cy.get('[data-testid="training-filter-keyword-entry"]').should('exist').type('e');
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=e;campus=;weekstart=',
                            );
                            cy.get('[data-testid="training-filter-keyword-entry"]').type('{esc}', { force: true });
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=',
                            );
                        });
                });
        });
        it('the user can use the keyboard for the keyword clear button', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=',
                            );
                            cy.get('[data-testid="training-filter-keyword-entry"]').type('e');
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=e;campus=;weekstart=',
                            );
                            cy.get('[data-testid="training-filter-keyword-entry"]').should('have.focus');
                            // can clear text with 'enter' click on the clear button
                            cy.get('[data-testid="training-filter-clear-keyword"]')
                                .type('{enter}', { force: true })
                                .then((e) => {
                                    cy.url().should(
                                        'eq',
                                        'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=',
                                    );
                                });
                        });
                });
        });
        it.skip('the user can tab from the keyword entry field to the keyword clear button', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            // can clear text with 'enter' click on the clear button
                            cy.get('[data-testid="training-filter-keyword-entry"]');
                            cy.get('[data-testid="training-filter-keyword-entry"]').should('have.focus');
                            cy.log('about to tab');
                            cy.get('[data-testid="training-filter-keyword-entry"]')
                                // the 'typeTab' command in the commands.js doesnt seem to work inside the shadowdom :(
                                .trigger('keydown', { keyCode: TAB_KEYCODE })
                                .then((e) => {
                                    cy.log('after tab');
                                    cy.get('[data-testid="training-filter-clear-keyword"]').should('have.focus');
                                });
                        });
                });
        });
        it('using the keyboard to open and close the campus dropdown works', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            openTheByCampusDropdown();

                            cy.log('close campus dropdown');
                            cy.get('[data-testid="training-filter-campus-container"]').type('{esc}', { force: true });
                            cy.get('[data-testid="training-filter-campus-list"]').should('have.class', 'hidden');
                        });
                });
        });
        it.skip('user can tab from campus dropdown button to week dropdown button', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-campus-dropdown"]')
                                // cy.get('[data-testid="training-filter-campus-container"] span')
                                // cy.get('[data-testid="training-filter-campus-container"]')
                                // cy.get('[data-testid="training-filter-campus-label"]')
                                // cy.get('[id="campushoverblock"]')
                                .should('exist')
                                .wait(1500)
                                .trigger('keydown', {
                                    keyCode: TAB_KEYCODE,
                                    force: true,
                                })
                                .then((e) => {
                                    // cy.get('[data-testid="training-filter-week-dropdown"]').should('have.focus');
                                    // cy.get('[data-testid="training-filter-week-container"]').should('have.focus');
                                    // cy.get('[data-testid="training-filter-week-container"] span').should('have.focus');
                                    // cy.get('[id="weekhoverblock"]').should('have.focus');
                                    cy.get('[data-testid="training-filter-week-label"]').should('have.focus');
                                });
                        });
                });
        });

        it('user can use the arrow keys to navigate up and down the week dropdown', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            openTheByWeekDropdown();
                            // arrow up and down robustly working
                            // (its actually easy to muck this up, so leave it, despite it seeming overkill)
                            cy.get('[data-testid="training-filter-week-label"]')
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-0"]').should('have.focus');
                                });

                            cy.get('[data-testid="training-filter-select-week-0"]')
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-1"]').should('have.focus');
                                })
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-2"]').should('have.focus');
                                })
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-3"]').should('have.focus');
                                })

                                // now check the up arrow key
                                .trigger('keydown', {
                                    keyCode: UP_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-2"]').should('have.focus');
                                })
                                .trigger('keydown', {
                                    keyCode: UP_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-1"]').should('have.focus');
                                })
                                .trigger('keydown', {
                                    keyCode: UP_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-0"]').should('have.focus');
                                })
                                .trigger('keydown', {
                                    keyCode: UP_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    // and we are back on the parent week button
                                    cy.get('[data-testid="training-filter-week-container"]').should('have.focus');
                                });

                            // final entry in dropdown doesnt arrow further
                            cy.get('[data-testid="training-filter-select-week-14"]')
                                .focus()
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-14"]').should('have.focus');
                                });
                        });
                });
        });
        it('using the keyboard to open and close the week dropdown works', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            // a enter-key click on the week parent opens the dropdown
                            cy.get('[data-testid="training-filter-week-list"]')
                                .should('exist')
                                .should('have.class', 'hidden');
                            openTheByWeekDropdown();

                            cy.log('close week dropdown');
                            cy.get('[data-testid="training-filter-week-container"]').type('{esc}', { force: true });
                            cy.get('[data-testid="training-filter-week-list"]').should('have.class', 'hidden');
                        });
                });
        });
        it.skip('user can back tab from the week dropdown button to the campus dropdown button', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-week-container"]')
                                .should('exist')
                                .focus()
                                .trigger('keydown', {
                                    keyCode: TAB_KEYCODE,
                                    shift: true,
                                    force: true,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-campus-container"]').should('have.focus');
                                });
                        });
                });
            cy.get('body').contains('Training widget demo'); // dummy test - sometimes cypress seems to return true on a test even though it actually fails if there is no test after it :(
        });

        it('the campus dropdown closes when the user clicks escape', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            openTheByCampusDropdown();
                        });
                });

            // click escape
            cy.get('body').type('{esc}', { force: true });

            // campus dropdown is closed
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-campus-list"]').should('have.class', 'hidden');
                        });
                });
        });

        it('the week dropdown closes when the user clicks escape', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            openTheByWeekDropdown();
                        });
                });

            // click escape
            cy.get('body').type('{esc}', { force: true });

            // week dropdown is closed
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-week-list"]').should('have.class', 'hidden');
                        });
                });
        });
    });

    context('Miscellaneous checks', () => {
        it('Passes accessibility', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.checkA11y('library-training:not([hide-filter])', {
                reportName: 'Training widget',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('hides filter and category title on attributes set', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[hide-filter]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter').should('not.exist');
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .find('.uq-card__header h3')
                        .should('have.class', 'visually-hidden');
                });
        });
    });

    context('List component', () => {
        it('toggles full list of rows on button click', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .find('.uq-card.has-more-events')
                        .first()
                        .as('expandableList')
                        .within(() => {
                            cy.get('.uq-accordion__item:nth-of-type(5)').should('be.visible');
                            cy.get('.uq-accordion__item:nth-of-type(6)').should('not.be.visible');
                            cy.get('@expandableList')
                                .find('[data-testid="training-events-toggle-full-list"]')
                                .as('toggleButton')
                                .click();
                            // accordion expands and extra items are visible
                            cy.get('.uq-accordion__item:nth-of-type(6)').should('be.visible');
                            // the 'show less' button exists but is off screen
                            cy.get('@toggleButton').should('be.visible');
                            cy.get('@toggleButton').should('have.text', 'Show less');
                            cy.isNotInViewport('[data-testid="training-events-toggle-full-list"]');
                            // scroll down to the 'show less' button
                            cy.get('[data-testid="training-events-toggle-full-list"]').scrollIntoView();
                            cy.isInViewport('[data-testid="training-events-toggle-full-list"]'); // 'show less' button
                            // click the 'show less' button to close the acccordion
                            cy.get('@toggleButton').should('have.text', 'Show less').click();
                            cy.get('@toggleButton').should('have.text', 'Show more');
                            // the accordion is closed and we have scrolled back to the top of the section
                            cy.get('.uq-accordion__item:nth-of-type(6)').should('not.be.visible');
                            cy.isInViewport('[data-testid="category-top-0"]'); // top of section
                        });
                });
        });
        it('shows a multi day event', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .as('trainingList')
                        .within(() => {
                            cy.get('[data-testid="event-dateRange-3462236"]')
                                .should('exist')
                                .should('be.visible')
                                .scrollIntoView();
                            cy.get('[data-testid="event-dateRange-3462236"] time:first-child').contains('1 Jun');
                            cy.get('[data-testid="event-dateRange-3462236"] time:last-child').contains('3 Jun');
                        });
                });
        });
    });

    context('Details component', () => {
        it('loads basic training details', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .as('trainingList')
                        .within(() => {
                            cy.get('#training-list')
                                .should('exist')
                                .get('[data-testid="training-event-detail-toggle-3428487"]')
                                .click();
                        });
                });
            cy.get('@trainingList').within(() => {
                cy.get('[data-testid="training-event-detail-3428487"]')
                    .should('exist')
                    .should('be.visible')
                    .children('training-detail')
                    .shadow()
                    .within(() => {
                        cy.get('[data-testid="training-details-location-details"]').should('have.text', 'Online, Zoom');
                    });
            });
        });

        it('the places remaining text is always correct', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-event-detail-toggle-3455330"]').click(); // open detail item
                            cy.get('[data-testid="training-event-detail-3455330"]')
                                .should('exist')
                                .should('be.visible')
                                .children('training-detail')
                                .shadow()
                                .within(() => {
                                    cy.get('#bookingText').should('have.text', 'Booking is not required');
                                });
                            cy.get('[data-testid="training-event-detail-toggle-3437655"]').click(); // open detail item
                            cy.get('[data-testid="training-event-detail-3437655"]')
                                .should('exist')
                                .should('be.visible')
                                .children('training-detail')
                                .shadow()
                                .within(() => {
                                    cy.get('#bookingText').should('have.text', 'Class is full. Register for waitlist');
                                });
                            cy.get('[data-testid="training-event-detail-toggle-3428487"]').click(); // open detail item
                            cy.get('[data-testid="training-event-detail-3428487"]')
                                .should('exist')
                                .should('be.visible')
                                .children('training-detail')
                                .shadow()
                                .within(() => {
                                    cy.get('#bookingText').should('have.text', 'Places still available');
                                });
                        });
                });
        });

        it('has correct details for em user with st lucia training and non-booking course', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('training-detail[data-testid="training-event-detail-content-2824657"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="training-details"]').contains(
                        'At the end of this session, class participants will be able to',
                    );
                    cy.get('[data-testid="training-details-full-date"]').contains('Tuesday 24 November 2020');
                    cy.get('[data-testid="training-details-start-time"]').contains('10am');
                    cy.get('[data-testid="training-details-end-time"]').contains('11.30am');
                    cy.get('[data-testid="training-details-location-details"] a').contains(
                        'St Lucia, Duhig Tower (2), 02-D501',
                    );
                    cy.get('[data-testid="training-details-location-details"] a').should(
                        'have.attr',
                        'href',
                        'https://maps.uq.edu.au/?zoom=19&campusId=406&lat=-27.4966319&lng=153.0144148&zLevel=1',
                    );
                    cy.get('[data-testid="training-details-booking-text"]').contains('Booking is not required');
                    cy.get('[data-testid="training-details-registrationBlockForNonUQ"] h5').should('exist');
                    cy.get('[data-testid="training-details-registrationBlockForNonUQ"] h5').contains(
                        'Library member registration (for non-UQ staff and students)',
                    );
                    cy.get('[data-testid="training-details-registrationBlockForNonUQ"] a').contains('@library'); // a library email address
                    cy.get('[data-testid="training-details-registrationBlockForNonUQ"] a')
                        .should('have.attr', 'href')
                        .then((href) => {
                            expect(href).to.have.string('Expression of interest for event');
                            expect(href).to.have.string('like to participate in the following training event');
                            expect(href).to.have.string('Event Id: 2824657');
                            expect(href).to.have.string('Event Title: Excel: Introduction to Spreadsheets');
                            expect(href).to.have.string(
                                'Event Date: Tuesday 24 November 2020 at 10am (2020-11-24T10:00:00+10:00)',
                            );
                            expect(href).to.have.string('Name: Lea de Groot');
                        });
                });
        });

        it('has correct details for uq user with toowoomba training and bookable course can visit studenthub', () => {
            const stub = cy.stub().as('open');
            cy.on('window:before:load', (win) => {
                cy.stub(win, 'open').callsFake(stub);
            });
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('training-detail[data-testid="training-event-detail-content-3455330"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="training-details-location-details"] a').contains('Toowoomba Rural Clinic');
                    cy.get('[data-testid="training-details-location-details"] a').should(
                        'have.attr',
                        'href',
                        'https://www.google.com/maps/search/?api=1&query=Toowoomba%20Rural%20Clinical%20School%2C%20152%20West%20Street%2C%20South%20Toowoomba%20QLD%2C%20Australia',
                    );
                    cy.get('[data-testid="training-details-booking-text"]').contains('Places still available');
                    cy.get('[data-testid="training-details-registrationBlockForNonUQ"]').should('not.be.visible');
                    cy.get('button[data-testid="training-details-book-training-button"]').should('exist').click();
                });
            cy.get('@open').should(
                'have.been.calledOnceWithExactly',
                'https://studenthub.uq.edu.au/students/events/detail/3455330',
            );
        });

        it('has correct details for logged out user with unidentifiable location and full course', () => {
            const stub = cy.stub().as('open');
            cy.on('window:before:load', (win) => {
                cy.stub(win, 'open').callsFake(stub);
            });
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('training-detail[data-testid="training-event-detail-content-3455331"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="training-details-location-details"]').contains('Townsville');
                    cy.get('[data-testid="training-details-location-details"] a').should('not.exist');
                    cy.get('[data-testid="training-details-booking-text"]').contains(
                        'Class is full. Register for waitlist.',
                    );
                    cy.get('[data-testid="training-details-registrationBlockForNonUQ"]').should('be.visible');
                    cy.get('button[data-testid="training-details-book-training-button"]').should('exist').click();
                });

            cy.get('@open').should(
                'have.been.calledOnceWithExactly',
                'https://studenthub.uq.edu.au/students/events/detail/3455331',
            );
        });
        it('shows a multi day event', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .as('trainingList')
                        .within(() => {
                            cy.get('#training-list')
                                .should('exist')
                                .get('[data-testid="training-event-detail-toggle-3462236"]')
                                .click();

                            cy.get('training-detail[data-testid="training-event-detail-content-3462236"]')
                                .should('exist')
                                .scrollIntoView()
                                .shadow()
                                .within(() => {
                                    cy.get('[data-testid="training-details-location-details"]').contains(
                                        'Online, Zoom',
                                    );
                                    cy.get('[data-testid="training-details-full-date"]')
                                        .should('exist')
                                        .should('be.visible')
                                        .contains('Tuesday 1 June 2021 - Thursday 3 June 2021');
                                    cy.get('[data-testid="training-details-start-time"]')
                                        .should('exist')
                                        .should('be.visible')
                                        .contains('10am');
                                    cy.get('[data-testid="training-details-end-time"]')
                                        .should('exist')
                                        .should('be.visible')
                                        .contains('4pm');
                                });
                        });
                });
        });

        it('Correct error shows when an empty result is return by Training api', () => {
            cy.visit('http://localhost:8080/index-training.html?user=emptyUser');
            cy.viewport(1280, 900);
            cy.waitUntil(() => cy.get('library-training[id="test-with-filter"]').should('exist'));
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="training-no-data-message"]').contains(
                        'No classes scheduled; check back soon.',
                    );
                });
        });

        it('Correct error shows when Training api doesnt load', () => {
            cy.visit('http://localhost:8080/index-training.html?user=errorUser');
            cy.viewport(1280, 900);
            cy.waitUntil(() => cy.get('library-training[id="test-with-filter"]').should('exist'));
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="training-api-error-message"]').contains(
                        'Something went wrong. Please refresh the page to see upcoming courses.',
                    );
                });
        });
    });

    context('Training filters', () => {
        const uqpurple = 'rgb(81, 36, 122)'; // #51247a
        it('Training filter is accessible', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-header"]').contains('Filter events');
                            cy.get('[data-testid="training-filter-keyword-label"]').contains('By keyword');
                            cy.get('[data-testid="training-filter-campus-label"]').contains('By campus');
                            cy.get('[data-testid="training-filter-week-label"]').contains('By week');
                        });
                });
            cy.wait(1000);
            cy.checkA11y('uq-header', {
                reportName: 'Training Filter',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('user can select a chip and it will filter correctly, simple example', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('h4:first-child').should(
                                'contain',
                                'Python with Spyder: Introduction to Data Science',
                            );
                        });
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            // this test is dependent on the chips currently in the system
                            cy.get('.quicklinks button').contains('Excel').click();
                        });
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('h4:first-child').should('contain', 'Excel: processing data');
                        });
                });
        });
        it('user can select a chip and it will filter correctly, example with space to remove', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('h4:first-child').should(
                                'contain',
                                'Python with Spyder: Introduction to Data Science',
                            );
                        });
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            // this test is dependent on the chips currently in the system
                            cy.get('.quicklinks button').contains('Creating a Structured Thesis').click();
                        });
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('h4:first-child').should('contain', 'Word: Creating a Structured Thesis (CaST)');
                        });
                });
        });
        it('user can enter a keyword', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-keyword-entry"]')
                                .type('excel')
                                .should('have.value', 'excel');
                            // the placeholder has moved up, proxied by "color has changed"
                            cy.get('[data-testid="training-filter-keyword-label"]').should(
                                'have.css',
                                'color',
                                uqpurple,
                            );

                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=excel;campus=;weekstart=',
                            );

                            // the user can use the escape key to clear the input field
                            cy.get('[data-testid="training-filter-keyword-entry"]').type('{esc}', { force: true });
                            cy.get('[data-testid="training-filter-keyword-entry"]').should('have.value', '');
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=',
                            );
                        });
                });
        });
        it('user can select a campus', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-campus-label"]').click();
                            cy.get('[data-testid="training-filter-campus-select-2"]').click();
                            cy.get('[data-testid="training-filter-campus-container"]').contains('St Lucia');
                            // the placeholder has moved up, proxied by "color has changed"
                            cy.get('[data-testid="training-filter-campus-label"]').should(
                                'have.css',
                                'color',
                                uqpurple,
                            );
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=;campus=St%2520Lucia;weekstart=',
                            );

                            cy.get('[data-testid="training-filter-campus-label"]').click();
                            cy.get('[data-testid="training-filter-campus-select-0"]').click();
                            cy.get('[data-testid="training-filter-campus-container"]').contains('All locations');
                            // the placeholder has moved up, proxied by "color has changed"
                            cy.get('[data-testid="training-filter-campus-label"]').should(
                                'have.css',
                                'color',
                                uqpurple,
                            );
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=;campus=all;weekstart=',
                            );
                        });
                });
        });
        it('user can clear campus selector field', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-campus-label"]').click();
                            cy.get('[data-testid="training-filter-campus-list"]')
                                .find('button')
                                .its('length')
                                .should('eq', 3);
                        });
                });
            // click somewhere on the page outside the campus type dropdown
            cy.get('[data-testid="random-page-element"]').click();
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-campus-list"]').should('have.class', 'hidden');
                        });
                });
        });
        it('user can select a week', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-week-label"]').click();

                            cy.get('[data-testid="training-filter-select-week-0"]').click();
                            cy.get('[data-testid="training-filter-week-container"]').should('contain', 'All available');
                            // the placeholder has moved up, proxied by "color has changed"
                            cy.get('[data-testid="training-filter-week-label"]').should('have.css', 'color', uqpurple);

                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=all',
                            );
                        });
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-event-detail-toggle-3428487"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('Python with Spyder: Introduction to Data Science');
                            cy.get('[data-testid="training-event-detail-toggle-3437655"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('Premiere Pro: Video Editing Basics');
                            cy.get('[data-testid="training-event-detail-toggle-3455330"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('UQ R User Group (UQRUG)');
                            cy.get('[data-testid="training-event-detail-toggle-3437656"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('NVivo: Next Steps');
                            cy.get('[data-testid="training-event-detail-toggle-3437658"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('Introduction to Adobe Illustrator');

                            cy.get('[data-testid="training-event-detail-toggle-3462236"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('Preparing to use an online invigilated/supervised examination');

                            cy.get('[data-testid="training-event-detail-toggle-3411674"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('Managing sensitive data');
                            cy.get('[data-testid="training-event-detail-toggle-3450085"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('Publishing your datasets with UQRDM');
                            cy.get('[data-testid="training-event-detail-toggle-2891495"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('Introduction to Digital Research Notebook (LabArchives)');
                            cy.get('[data-testid="training-event-detail-toggle-2890738"]')
                                .should('exist')
                                .should('be.visible')
                                .contains(
                                    'UQRDM for research students - how to use it to help with managing research data',
                                );
                            cy.get('[data-testid="training-event-detail-toggle-3415855"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('UQRDM Q&A session');
                        });
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-week-label"]').click();
                            cy.get('[data-testid="training-filter-select-week-10"]').click();
                            cy.get('[data-testid="training-filter-week-container"]').should(
                                'contain',
                                '2 Aug - 8 Aug ',
                            );
                            // the placeholder has moved up, proxied by "color has changed"
                            cy.get('[data-testid="training-filter-week-label"]').should('have.css', 'color', uqpurple);
                        });
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            // no events show for this date
                            cy.get('[data-testid="training-list"]').should('exist').children().should('have.length', 0);
                        });

                    // test that chaging dates shows the right items
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=2021-08-02',
                            );
                        });

                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-week-label"]').click();
                            cy.get('[data-testid="training-filter-select-week-4"]').click();
                            cy.get('[data-testid="training-filter-week-container"]').should(
                                'contain',
                                '21 June - 27 June',
                            );
                        });
                    cy.get('training-list')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            // many hidden
                            cy.get('[data-testid="training-event-detail-toggle-3428487"]').should('not.exist'); // Python with Spyder: Introduction to Data Science
                            cy.get('[data-testid="training-event-detail-toggle-3437655"]').should('not.exist'); // 'Premiere Pro: Video Editing Basics');
                            cy.get('[data-testid="training-event-detail-toggle-3455330"]').should('not.exist'); // 'UQ R User Group (UQRUG)');
                            cy.get('[data-testid="training-event-detail-toggle-3437656"]').should('not.exist'); // 'NVivo: Next Steps');
                            cy.get('[data-testid="training-event-detail-toggle-3437658"]').should('not.exist'); // 'Introduction to Adobe Illustrator');
                            // others appear
                            cy.get('[data-testid="training-event-detail-toggle-3450064"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('Kaltura Capture: Desktop Recording software');
                            cy.get('[data-testid="training-event-detail-toggle-3450065"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('R data manipulation with RStudio and dplyr: introduction');
                            cy.get('[data-testid="training-event-detail-toggle-3450066"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('Word: Creating a Structured Thesis (CaST)');
                            cy.get('[data-testid="training-event-detail-toggle-3450067"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('Python with Spyder: Introduction to Data Science');
                            cy.get('[data-testid="training-event-detail-toggle-3430859"]')
                                .should('exist')
                                .should('be.visible')
                                .contains('EndNote 20: getting started');

                            cy.get('[data-testid="training-event-detail-toggle-3462236"]').should('not.exist'); // 'Preparing to use an online invigilated/supervised examination');

                            cy.get('[data-testid="training-event-detail-toggle-3411674"]').should('not.exist'); // 'Managing sensitive data');
                            cy.get('[data-testid="training-event-detail-toggle-3450085"]').should('not.exist'); // 'Publishing your datasets with UQRDM');
                            cy.get('[data-testid="training-event-detail-toggle-2891495"]').should('not.exist'); // 'Introduction to Digital Research Notebook (LabArchives)');
                            cy.get('[data-testid="training-event-detail-toggle-2890738"]')
                                .should('exist')
                                .should('be.visible')
                                .contains(
                                    'UQRDM for research students - how to use it to help with managing research data',
                                );
                            cy.get('[data-testid="training-event-detail-toggle-3415855"]').should('not.exist'); // 'UQRDM Q&A session');
                        });
                });
        });
        it('user can clear week selector field', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-week-label"]').click();
                            cy.get('[data-testid="training-filter-week-list"]').should('not.have.class', 'hidden');
                            cy.get('[data-testid="training-filter-week-list"]')
                                .find('button')
                                .its('length')
                                .should('eq', 15);
                        });
                });
            // click somewhere on the page outside the week type dropdown
            cy.get('[data-testid="random-page-element"]').click();
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-week-list"]').should('have.class', 'hidden');
                        });
                });
        });
        it('user can select multiple elements', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            const weekDropdown = '[data-testid="training-filter-select-week-0"]';
                            const campusDropdown = '[data-testid="training-filter-campus-select-0"]';

                            // the two dropdowns wont be open at the same time
                            cy.get('[data-testid="training-filter-week-label"]').click(); // open the week list
                            cy.get(weekDropdown).should('be.visible'); // week list shows
                            cy.get(campusDropdown).should('not.be.visible'); // campus list is closed

                            cy.get('[data-testid="training-filter-campus-label"]').click(); // open the campus list
                            cy.get(campusDropdown).should('be.visible'); // campus list is open
                            cy.get(weekDropdown).should('not.be.visible'); // week list has closed

                            cy.get('[data-testid="training-filter-week-label"]').click(); // reopen the week list
                            cy.get(weekDropdown).should('be.visible'); // campus list has closed
                            cy.get(campusDropdown).should('not.be.visible'); // week list is open
                            cy.get('[data-testid="training-filter-select-week-0"]').click(); // select a week for the next step of the test

                            cy.get('[data-testid="training-filter-campus-label"]').click();
                            cy.get('[data-testid="training-filter-campus-select-0"]').click();

                            cy.get('[data-testid="training-filter-popular-events-Excel"]').click();

                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=Excel;campus=all;weekstart=all',
                            );
                        });
                });
        });
        it('user can clear other fields', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            cy.get('[data-testid="training-filter-popular-events-Excel"]').click();
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=Excel;campus=;weekstart=',
                            );
                            cy.get('[data-testid="training-filter-clear-keyword"]').click();
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=',
                            );
                        });
                });
        });
        it('clears a bookmarked url', () => {
            // what is displayed must match the filter, so any param that dont match the filter settings should be cleared
            // (future possibility to allow bookmarked urls?)
            cy.visit('http://localhost:8080/index-training.html#keyword=Excel;campus=Gatton;weekstart=all');
            cy.viewport(1280, 900);
            cy.url().should('eq', 'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=');
        });
        it('sends to GTM', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 1280);
            cy.get('library-training[id="test-with-filter"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('training-filter')
                        .should('exist')
                        .shadow()
                        .within(() => {
                            expect(window.dataLayer).to.be.undefined;
                            cy.window().then((win) => {
                                expect(win.dataLayer).to.be.undefined;
                            });
                            cy.get('[data-testid="training-filter-keyword-entry"]').should('exist');
                            cy.get('[data-testid="training-filter-keyword-entry"]').type('e');
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=e;campus=;weekstart=',
                            );
                        });
                });
            // click away from the keyword input field, because that is when we send the keyword
            cy.get('[data-testid="random-page-element"]').click();
            cy.window().its('dataLayer').should('have.length', 1);
        });
    });
});

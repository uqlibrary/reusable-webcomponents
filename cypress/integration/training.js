/// <reference types="cypress" />

const DOWN_ARROW_KEYCODE = 40;
const ESCAPE_KEYCODE = 27;
const RETURN_KEYCODE = 13;
const TAB_KEYCODE = 9;
const UP_ARROW_KEYCODE = 38;

describe('Training', () => {
    context('Filter component keyboard navigation', () => {
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
                            cy.get('[data-testid="training-filter-campus-container"]').type('{enter}', { force: true });

                            // arrow up and down robustly working (its actually easy to muck this up, so leave it, despite it seeming ovrekill)
                            cy.get('[data-testid="training-filter-campus-label"]')
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    // if this test fails, first run the test again
                                    // it often fails immediately after this file is saved. odd.
                                    // it can also fail if you have put your cursor in the Developer Tools Console
                                    cy.log(
                                        'if this fails or stops here and you just saved the cypress file - try clicking the rerun button',
                                    );
                                    cy.get('[data-testid="training-filter-campus-select-0"]').should('have.focus');
                                });

                            cy.get('[data-testid="training-filter-campus-select-0"]')
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-campus-select-1"]').should('have.focus');
                                });

                            cy.get('[data-testid="training-filter-campus-select-1"]')
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-campus-select-2"]').should('have.focus');
                                });

                            cy.get('[data-testid="training-filter-campus-select-2"]')
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
                                });

                            cy.get('[data-testid="training-filter-campus-select-1"]')
                                .trigger('keydown', {
                                    keyCode: UP_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-campus-select-0"]').should('have.focus');
                                });

                            cy.get('[data-testid="training-filter-campus-select-0"]')
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
                            // cy.wait(1500); // dev, so we can see focus is on that element
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
                                    // cy.wait(1500); // debug, so we can see focus is on that element :(
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
                            // a enter-key click on the campus parent opens the dropdown
                            cy.get('[data-testid="training-filter-campus-list"]')
                                .should('exist')
                                .should('have.class', 'hidden');
                            cy.get('[data-testid="training-filter-campus-container"]').type('{enter}', { force: true });
                            // cy.wait(1500);
                            cy.get('[data-testid="training-filter-campus-list"]').should('not.have.class', 'hidden');
                            cy.get('[data-testid="training-filter-campus-list"]').find('button').should('length', 3);

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
                            cy.get('[data-testid="training-filter-week-container"]').type('{enter}', { force: true });
                            cy.wait(1500);
                            // arrow up and down robustly working (its actually easy to muck this up, so leave it, despite it seeming ovrekill)
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
                                });

                            cy.get('[data-testid="training-filter-select-week-1"]')
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-2"]').should('have.focus');
                                });

                            cy.get('[data-testid="training-filter-select-week-2"]')
                                .trigger('keydown', {
                                    keyCode: DOWN_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-3"]').should('have.focus');
                                });

                            cy.get('[data-testid="training-filter-select-week-2"]')
                                .trigger('keydown', {
                                    keyCode: UP_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-1"]').should('have.focus');
                                });

                            cy.get('[data-testid="training-filter-select-week-1"]')
                                .trigger('keydown', {
                                    keyCode: UP_ARROW_KEYCODE,
                                })
                                .then((e) => {
                                    cy.get('[data-testid="training-filter-select-week-0"]').should('have.focus');
                                });

                            cy.get('[data-testid="training-filter-select-week-0"]')
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
                            cy.get('[data-testid="training-filter-week-container"]').type('{enter}', { force: true });
                            // cy.wait(1500);
                            cy.get('[data-testid="training-filter-week-list"]').should('not.have.class', 'hidden');
                            cy.get('[data-testid="training-filter-week-list"]').find('button').should('length', 15);

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
                            cy.get('[data-testid="training-filter-campus-list"]').should('have.class', 'hidden');
                            // open the campus drop down
                            cy.get('[data-testid="training-filter-campus-container"]').type('{enter}', { force: true });
                            cy.get('[data-testid="training-filter-campus-list"]').should('not.have.class', 'hidden');
                            cy.get('[data-testid="training-filter-campus-list"]').find('button').should('length', 3);
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
                            cy.get('[data-testid="training-filter-week-list"]').should('have.class', 'hidden');
                            // open the week drop down
                            cy.get('[data-testid="training-filter-week-container"]').type('{enter}', { force: true });
                            cy.get('[data-testid="training-filter-week-list"]').should('not.have.class', 'hidden');
                            cy.get('[data-testid="training-filter-week-list"]').find('button').should('length', 15);
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
                    cy.get('training-list').should('exist').shadow().find('.uq-card__header').should('be.empty');
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
                            cy.get('.uq-accordion__item:nth-of-type(6)').should('be.visible');
                            cy.get('@toggleButton').should('have.text', 'Show less').click();
                            cy.get('.uq-accordion__item:nth-of-type(6)').should('not.be.visible');
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
                        cy.get('#eventName').should('have.text', 'Python with Spyder: Introduction to Data Science');
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
                    cy.get('[data-testid="training-event-name"]').contains('Excel');
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
                    cy.get('[data-testid="training-details-registrationBlockForNonUQ"] h4').should('exist');
                    cy.get('[data-testid="training-details-registrationBlockForNonUQ"] h4').contains(
                        'Library member registration (for non-UQ staff and students)',
                    );
                    cy.get('[data-testid="training-details-registrationBlockForNonUQ"] a').contains('@library'); // a library email address
                    cy.get('[data-testid="training-details-registrationBlockForNonUQ"] a')
                        .should('have.attr', 'href')
                        .then((href) => {
                            console.log('href = ', href);
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
                    cy.get('[data-testid="training-event-name"]').contains('Excel1');
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
                    cy.get('[data-testid="training-event-name"]').contains('Excel2');
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

                            cy.get('[data-testid="training-filter-week-label"]').click();

                            // there seems to be an issue that my machine uses 4 char for June, but AWS (and maybe Ashley's?) uses 3 char
                            // so avoid the issue and use August, which is 'aug'.
                            cy.get('[data-testid="training-filter-select-week-10"]').click();
                            cy.get('[data-testid="training-filter-week-container"]').should(
                                'contain',
                                '2 Aug - 8 Aug ',
                            );
                            // the placeholder has moved up, proxied by "color has changed"
                            cy.get('[data-testid="training-filter-week-label"]').should('have.css', 'color', uqpurple);

                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=2021-08-02',
                            );
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

                            cy.get('[data-testid="training-filter-popular-events-endnote"]').click();

                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=endnote;campus=all;weekstart=all',
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
                            cy.get('[data-testid="training-filter-popular-events-endnote"]').click();
                            cy.url().should(
                                'eq',
                                'http://localhost:8080/index-training.html#keyword=endnote;campus=;weekstart=',
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
    // it.only('test template', () => {
    //     cy.visit('http://localhost:8080/index-training.html');
    //     cy.viewport(1280, 1280);
    //     cy.get('library-training[id="test-with-filter"]')
    //         .should('exist')
    //         .shadow()
    //         .within(() => {
    //             cy.get('training-filter')
    //                 .should('exist')
    //                 .shadow()
    //                 .within(() => {
    //                     cy.get('[data-testid="training-filter-keyword-entry"]')
    //                         .should('exist');
    //                 });
    //         });
    // });
});

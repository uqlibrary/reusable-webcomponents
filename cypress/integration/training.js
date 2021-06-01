/// <reference types="cypress" />

describe('Training', () => {
    context('Training details', () => {
        it('Basic training details loads', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('training-detail[data-testid="2824657"]').shadow().find('h3').contains('Excel');
        });
        it('Training passes accessibility', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.get('training-detail[data-testid="2824657"]').shadow();
            cy.wait(1000);
            cy.checkA11y('uq-header', {
                reportName: 'Training Detail',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('Training has correct details for em user with st lucia training and non-booking course', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('training-detail[data-testid="2824657"]')
                .should('exist')
                .shadow()
                .within((block) => {
                    cy.get('h3').contains('Excel');
                    cy.get('[data-testid="eventDetails"]').contains(
                        'At the end of this session, class participants will be able to',
                    );
                    cy.get('[data-testid="fullDate"]').contains('Tuesday, 24 November 2020');
                    cy.get('[data-testid="startTime"]').contains('10:00 am');
                    cy.get('[data-testid="endTime"]').contains('11:30 am');
                    cy.get('[data-testid="locationdetails"] a').contains('St Lucia, Duhig Tower (2), 02-D501');
                    cy.get('[data-testid="locationdetails"] a').should(
                        'have.attr',
                        'href',
                        'https://maps.uq.edu.au/?zoom=19&campusId=406&lat=-27.4966319&lng=153.0144148&zLevel=1',
                    );
                    cy.get('[data-testid="bookingText"]').contains('Booking is not required');
                    cy.get('[data-testid="registrationBlockForNonUQ"] h4').should('exist');
                    cy.get('[data-testid="registrationBlockForNonUQ"] h4').contains(
                        'Library member registration (for non-UQ staff and students)',
                    );
                    cy.get('[data-testid="registrationBlockForNonUQ"] a').contains('@library'); // a library email address
                    cy.get('[data-testid="registrationBlockForNonUQ"] a')
                        .should('have.attr', 'href')
                        .then((href) => {
                            console.log('href = ', href);
                            expect(href).to.have.string('Expression of interest for event');
                            expect(href).to.have.string('like to participate in the following training event');
                            expect(href).to.have.string('Event Id: 2824657');
                            expect(href).to.have.string('Event Title: Excel: Introduction to Spreadsheets');
                            expect(href).to.have.string(
                                'Event Date: Tuesday, 24 November 2020 at 10:00 am (2020-11-24T10:00:00+10:00)',
                            );
                            expect(href).to.have.string('Name: Lea de Groot');
                        });
                });
        });
        it('Training has correct details for uq user with toowoomba training and bookable course can visit studenthub', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.intercept('GET', 'https://studenthub.uq.edu.au/students/events/detail/3455330', {
                statusCode: 200,
                body: 'User now on studenthub page',
            });
            cy.get('training-detail[data-testid="3455330"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('h3').contains('Excel1');
                    cy.get('[data-testid="locationdetails"] a').contains('Toowoomba Rural Clinic');
                    cy.get('[data-testid="locationdetails"] a').should(
                        'have.attr',
                        'href',
                        'https://www.google.com/maps/search/?api=1&query=Toowoomba%20Rural%20Clinical%20School%2C%20152%20West%20Street%2C%20South%20Toowoomba%20QLD%2C%20Australia',
                    );
                    cy.get('[data-testid="bookingText"]').contains('Places still available');
                    cy.get('[data-testid="registrationBlockForNonUQ"]').should('not.be.visible');
                    cy.get('button[data-testid="bookTraining"]').should('exist').click();
                });
            cy.get('body').contains('User now on studenthub page');
        });
        it('Training has correct details for logged out user with unidentifiable location and full course', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('training-detail[data-testid="3455331"]')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('h3').contains('Excel2');
                    cy.get('[data-testid="locationdetails"]').contains('Townsville');
                    cy.get('[data-testid="locationdetails"] a').should('not.exist');
                    cy.get('[data-testid="bookingText"]').contains('Class is full. Register for waitlist.');
                    cy.get('[data-testid="registrationBlockForNonUQ"]').should('not.be.visible');
                });
        });
    });
    context('Training filters', () => {
        const uqpurple = 'rgb(81, 36, 122)'; // #51247a
        it('Training filter is accessible', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.injectAxe();
            cy.viewport(1280, 900);
            cy.get('training-filter')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="training-filter-header"]').contains('Filter events');
                    cy.get('[data-testid="keywordhover"]').contains('By keyword');
                    cy.get('[data-testid="campushover"]').contains('By campus');
                    cy.get('[data-testid="weekhover"]').contains('By week');
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
            cy.get('training-filter')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="inputKeyword"]').type('excel').should('have.value', 'excel');
                    // the placeholder has moved up, proxied by "color has changed"
                    cy.get('[data-testid="keywordhover"]').should('have.css', 'color', uqpurple);

                    cy.url().should(
                        'eq',
                        'http://localhost:8080/index-training.html#keyword=excel;campus=;weekstart=;online=false',
                    );
                });
        });
        it('user can select a campus', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('training-filter')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="campushover"]').click();
                    cy.get('[data-testid="StLucia"]').click();
                    cy.get('[data-testid="campusOpener"]').contains('St Lucia');
                    // the placeholder has moved up, proxied by "color has changed"
                    cy.get('[data-testid="campushover"]').should('have.css', 'color', uqpurple);
                    cy.url().should(
                        'eq',
                        'http://localhost:8080/index-training.html#keyword=;campus=St%2520Lucia;weekstart=;online=false',
                    );

                    cy.get('[data-testid="campushover"]').click();
                    cy.get('[data-testid="Alllocations"]').click();
                    cy.get('[data-testid="campusOpener"]').contains('All locations');
                    // the placeholder has moved up, proxied by "color has changed"
                    cy.get('[data-testid="campushover"]').should('have.css', 'color', uqpurple);
                    cy.url().should(
                        'eq',
                        'http://localhost:8080/index-training.html#keyword=;campus=all;weekstart=;online=false',
                    );
                });
        });
        it('user can select a week', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('training-filter')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="weekhover"]').click();

                    cy.get('[data-testid="allavailable"]').click();
                    cy.get('[data-testid="weekOpener"]').should('contain', 'All available');
                    // the placeholder has moved up, proxied by "color has changed"
                    cy.get('[data-testid="weekhover"]').should('have.css', 'color', uqpurple);

                    cy.url().should(
                        'eq',
                        'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=all;online=false',
                    );

                    cy.get('[data-testid="weekhover"]').click();

                    cy.get('[data-testid="27may-2june"]').click();
                    cy.get('[data-testid="weekOpener"]').should('contain', '27 May - 2 June ');
                    // the placeholder has moved up, proxied by "color has changed"
                    cy.get('[data-testid="weekhover"]').should('have.css', 'color', uqpurple);

                    cy.url().should(
                        'eq',
                        'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=20210527;online=false',
                    );
                });
        });
        it('user can select multiple elements', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('training-filter')
                .should('exist')
                .shadow()
                .within(() => {
                    const weekDropdown = '[data-testid="allavailable"]';
                    const campusDropdown = '[data-testid="Alllocations"]';

                    // the two dropdowns wont be open at the same time
                    cy.get('[data-testid="weekhover"]').click(); // open the week list
                    cy.get(weekDropdown).should('be.visible'); // week list shows
                    cy.get(campusDropdown).should('not.be.visible'); // campus list is closed

                    cy.get('[data-testid="campushover"]').click(); // open the campus list
                    cy.get(campusDropdown).should('be.visible'); // campus list is open
                    cy.get(weekDropdown).should('not.be.visible'); // week list has closed

                    cy.get('[data-testid="weekhover"]').click(); // reopen the week list
                    cy.get(weekDropdown).should('be.visible'); // campus list has closed
                    cy.get(campusDropdown).should('not.be.visible'); // week list is open
                    cy.get('[data-testid="allavailable"]').click(); // select a week for the next step of the test

                    cy.get('[data-testid="campushover"]').click();
                    cy.get('[data-testid="Alllocations"]').click();

                    cy.get('[data-testid="endnote"]').click();

                    cy.get('[data-testid="onlineonly"]').click();

                    cy.url().should(
                        'eq',
                        'http://localhost:8080/index-training.html#keyword=endnote;campus=all;weekstart=all;online=true',
                    );
                });
        });
        it('user can clear fields', () => {
            cy.visit('http://localhost:8080/index-training.html');
            cy.viewport(1280, 900);
            cy.get('training-filter')
                .should('exist')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="endnote"]').click();
                    cy.url().should(
                        'eq',
                        'http://localhost:8080/index-training.html#keyword=endnote;campus=;weekstart=;online=false',
                    );
                    cy.get('[data-testid="clearKeyword"]').click();
                    cy.url().should('eq', 'http://localhost:8080/index-training.html#');

                    cy.get('[data-testid="onlineonly"]').click();
                    cy.url().should(
                        'eq',
                        'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=;online=true',
                    );
                    cy.get('[data-testid="onlineonly"]').click();
                    cy.url().should('eq', 'http://localhost:8080/index-training.html#');
                });
        });
    });
});

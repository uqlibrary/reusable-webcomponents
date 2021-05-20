/// <reference types="cypress" />
import uqrdav10 from '../../mock/data/account';
import ApiAccess from '../../src/ApiAccess/ApiAccess';
import { apiLocale } from '../../src/ApiAccess/ApiAccess.locale';

describe('Auth button', () => {
    context('Auth button', () => {
        it('logged in user sees a "Log out" button', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.injectAxe();
            cy.checkA11y('auth-button', {
                reportName: 'Auth Loggedin',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.get('uq-site-header').find('auth-button').should('exist');
            cy.get('auth-button').shadow().find('#auth-log-out-label').should('contain', 'Log out');
        });

        it('`overwriteasloggedout` attribute always show them as logged out', () => {
            cy.visit('http://localhost:8080/index-primo.html');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.get('auth-button').shadow().find('#auth-log-in-label').should('contain', 'Log in');
        });

        it('another logged in user sees a "Log out" button', () => {
            cy.visit('http://localhost:8080/?user=s1111111');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.get('uq-site-header').find('auth-button').should('exist');
            cy.get('auth-button').shadow().find('#auth-log-out-label').should('contain', 'Log out');
        });

        it('logged out user sees a "Log in" button"', () => {
            cy.visit('http://localhost:8080/?user=public');
            cy.viewport(1280, 900);
            cy.injectAxe();
            cy.wait(100);
            cy.checkA11y('auth-button', {
                reportName: 'Auth Loggedout',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.get('uq-site-header').find('auth-button').should('exist');
            cy.get('auth-button').shadow().find('#auth-log-in-label').should('contain', 'Log in');
        });

        it('account with out of date session storage is not used', () => {
            const store = new ApiAccess();
            store.storeAccount(uqrdav10, -24);

            checkStorage();

            let testValid = false;
            async function checkStorage() {
                await new ApiAccess().getAccount().then((newAccount) => {
                    expect(newAccount).to.be.equal(false);
                    expect(sessionStorage.length).to.be.equal(0);
                    testValid = true;
                });
            }

            const checkTestHappened = setInterval(() => {
                clearInterval(checkTestHappened);
                // just a paranoia check that the above test inside an await actually happened. 50 ms was not enough!
                expect(testValid).to.be.equal(true);
            }, 1000);
        });

        it('does not call a tokenised api if the cookies arent available', () => {
            cy.clearCookie(apiLocale.SESSION_COOKIE_NAME);
            cy.clearCookie(apiLocale.SESSION_USER_GROUP_COOKIE_NAME);

            let testValid = false;
            async function checkCookies() {
                await new ApiAccess().loadAuthorApi().then((result) => {
                    expect(result).to.be.equal(false);
                    expect(sessionStorage.length).to.be.equal(0);
                    testValid = true;
                });
            }
            checkCookies();

            const checkTestHappened = setInterval(() => {
                clearInterval(checkTestHappened);
                // just a paranoia check that the above test inside an await actually happened.
                expect(testValid).to.be.equal(true);
            }, 1000);
        });
    });
});

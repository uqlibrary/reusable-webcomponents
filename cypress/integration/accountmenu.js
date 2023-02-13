/// <reference types="cypress" />
import uqrdav10, { accounts } from '../../mock/data/account';
import ApiAccess from '../../src/ApiAccess/ApiAccess';
import { apiLocale } from '../../src/ApiAccess/ApiAccess.locale';
import { authLocale } from '../../src/UtilityArea/auth.locale';

function assertLogoutButtonVisible(expected = true) {
    if (expected) {
        cy.get('auth-button').shadow().find('button:contains("Log out")').should('be.visible');
    } else {
        cy.get('auth-button').shadow().find('button:contains("Log out")').should('not.be.visible');
    }
}

function openAccountDropdown() {
    cy.get('auth-button').shadow().find('[data-testid="account-option-button"]').click();
    cy.wait(500);
}

function assertUserHasStandardMyLibraryOptions() {
    cy.get('li a[data-testid="mylibrary-menu-borrowing"]').should('exist').contains('Library account');
    cy.get('li a[data-testid="mylibrary-menu-course-resources"]').should('exist').contains('Learning resources');
    cy.get('li a[data-testid="mylibrary-menu-print-balance"]').should('exist').contains('Print balance');
    cy.get('li a[data-testid="mylibrary-menu-room-bookings"]').should('exist').contains('Book a room or desk');
    cy.get('li a[data-testid="mylibrary-menu-saved-items"]').should('exist').contains('Favourites');
    cy.get('li a[data-testid="mylibrary-menu-feedback"]').should('exist').contains('Feedback');
    cy.get('ul[data-testid="mylibrary-menu-list-public"]').should('exist').children().its('length').should('be.gte', 6);
}

function assertUserHasMasquerade(expected) {
    if (!!expected) {
        cy.get('li[data-testid="mylibrary-masquerade"]').should('exist').contains('Masquerade');
    } else {
        cy.get('li[data-testid="mylibrary-masquerade"]').should('not.exist');
    }
}

function assertUserHasAlertsAdmin(expected) {
    if (!!expected) {
        cy.get('li[data-testid="alerts-admin"]').should('exist').contains('Website alerts');
    } else {
        cy.get('li[data-testid="alerts-admin"]').should('not.exist');
    }
}

function assertUserHasSpotlightAdmin(expected) {
    if (!!expected) {
        cy.get('li[data-testid="spotlights-admin"]').should('exist').contains('Website spotlights');
    } else {
        cy.get('li[data-testid="spotlights-admin"]').should('not.exist');
    }
}

function assertUserHasTestTagAdmin(expected) {
    if (!!expected) {
        cy.get('li[data-testid="testTag-admin"]').should('exist').contains('Test and Tag');
    } else {
        cy.get('li[data-testid="testTag-admin"]').should('not.exist');
    }
}

function assertUserHasPromoPanelAdmin(expected) {
    if (!!expected) {
        cy.get('li[data-testid="promopanel-admin"]').should('exist').contains('Promo panels');
    } else {
        cy.get('li[data-testid="promopanel-admin"]').should('not.exist');
    }
}

function assertUserHasEspaceDashboard(expected) {
    if (!!expected) {
        cy.get('li[data-testid="mylibrary-espace"]').should('exist').contains('UQ eSpace dashboard');
    } else {
        cy.get('li[data-testid="mylibrary-espace"]').should('not.exist');
    }
}

function assertNameIsDisplayedOnAccountOptionsButtonCorrectly(userName, displayName) {
    cy.visit('http://localhost:8080/?user=' + userName);
    cy.wait(100);
    cy.get('uq-site-header').find('auth-button').should('exist');
    cy.get('auth-button').shadow().find('[data-testid="username-area-label"]').should('contain', displayName);
}

function assertUserSeesNOAdminOptions() {
    assertUserHasMasquerade(false);
    assertUserHasAlertsAdmin(false);
    assertUserHasSpotlightAdmin(false);
    assertUserHasPromoPanelAdmin(false)
    assertUserHasTestTagAdmin(false);
    // the admin block has been removed so we dont see the admin border
    cy.get('[data-testid="admin-options"]').should('not.exist');
}

describe('Account menu button', () => {
    context('Account menu button', () => {
        it('logged out user sees a "Log in" button" and widget is accessible', () => {
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
            cy.get('auth-button').shadow().find('[data-testid="auth-button-login-label"]').should('contain', 'Log in');
        });

        it('logged in user account button widget is accessible', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.get('uq-site-header').find('auth-button').should('exist');
            cy.injectAxe();
            cy.checkA11y('auth-button', {
                reportName: 'Account Loggedin',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            openAccountDropdown();
            cy.wait(500);
            cy.checkA11y('auth-button', {
                reportName: 'Account Loggedin Dialog Open',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('`overwriteasloggedout` attribute always show them as logged out', () => {
            cy.visit('http://localhost:8080/index-primo.html');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.get('auth-button').shadow().find('[data-testid="auth-button-login-label"]').should('contain', 'Log in');
        });

        it('Navigates to login page', () => {
            cy.intercept(/loginuserpass/, 'user visits login page'); // from https://auth.uq.edu.au/idp/module.php/core/loginuserpass.php?&etc
            cy.intercept('GET', authLocale.AUTH_URL_LOGIN, {
                statusCode: 200,
                body: 'user visits login page',
            });

            cy.visit('http://localhost:8080/?user=public');
            cy.viewport(1280, 900);
            cy.wait(100);
            cy.get('uq-site-header').find('auth-button').should('exist');
            cy.get('auth-button').shadow().find('[data-testid="auth-button-login-label"]').should('contain', 'Log in');

            cy.wait(1500);
            cy.get('auth-button').shadow().find('[data-testid="auth-button-login"]').click();
            cy.get('body').contains('user visits login page');
        });

        it('Navigates to logout page', () => {
            assertNameIsDisplayedOnAccountOptionsButtonCorrectly('s1111111', 'Undergraduate, John');
            cy.intercept(/localhost/, 'user visits logout page');
            cy.intercept('GET', authLocale.AUTH_URL_LOGOUT, {
                statusCode: 200,
                body: 'user visits logout page',
            });
            cy.get('auth-button').shadow().find('[data-testid="account-option-button"]').click();
            cy.get('auth-button').shadow().find('button:contains("Log out")').click();

            cy.get('body').contains('user visits logout page');
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

            setTimeout(() => {
                // just a paranoia check that the above test inside an await actually happened. 50 ms was not enough!
                expect(testValid).to.be.equal(true);
            }, 1000);
        });

        it('does not call a tokenised api if the cookies arent available', () => {
            cy.clearCookie(apiLocale.SESSION_COOKIE_NAME);
            cy.clearCookie(apiLocale.SESSION_USER_GROUP_COOKIE_NAME);

            const api = new ApiAccess();
            api.removeAccountStorage();

            let testValid = false;
            async function checkCookies() {
                await new ApiAccess().loadAuthorApi().then((result) => {
                    expect(result).to.be.equal(false);
                    expect(sessionStorage.length).to.be.equal(0);
                    testValid = true;
                });
            }
            checkCookies();

            setTimeout(() => {
                // just a paranoia check that the above test inside an await actually happened.
                expect(testValid).to.be.equal(true);
            }, 5500);
        });

        it('user with expired stored session is not logged in', () => {
            const store = new ApiAccess();
            store.storeAccount(accounts.s1111111, -24); // put info in the session storage
            // console.log('sessionStorage: ', sessionStorage.getItem('userAccount'));

            assertNameIsDisplayedOnAccountOptionsButtonCorrectly('s1111111', 'Undergraduate, John');
        });

        it('user with a short name will show their complete name on the Log Out button', () => {
            assertNameIsDisplayedOnAccountOptionsButtonCorrectly('emfryer', 'User, Fryer');
            cy.get('auth-button')
                .shadow()
                .find('button:contains("Log out")')
                .should('have.attr', 'aria-label', 'Log out');
        });
        it('user with a long length name will show their last name with initial on the Log Out button', () => {
            assertNameIsDisplayedOnAccountOptionsButtonCorrectly(
                'digiteamMember',
                'C STAFF MEMBER WITH MEGA REALLY TRULY STUPENDOUSLY LONG NAME',
            );
        });
        it('user who uses a single name will not show the "." as a surname', () => {
            assertNameIsDisplayedOnAccountOptionsButtonCorrectly('emhonorary', 'Honorary');
        });

        it('Pressing esc closes the account menu', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            openAccountDropdown();
            assertLogoutButtonVisible();
            cy.get('body').type('{enter}', { force: true });
            cy.wait(500);
            assertLogoutButtonVisible();
            cy.get('body').type('{esc}', { force: true });
            cy.wait(500);
            assertLogoutButtonVisible(false);
        });

        it('Clicking the pane closes the account menu', () => {
            cy.visit('http://localhost:8080');
            cy.viewport(1280, 900);
            openAccountDropdown();
            assertLogoutButtonVisible();
            cy.get('body').click(0, 0);
            cy.wait(500);
            assertLogoutButtonVisible(false);
        });
    });

    context('User-specific account links', () => {
        it('Admin gets admin entries', () => {
            cy.visit('http://localhost:8080?user=uqstaff');
            cy.viewport(1280, 900);
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions();
                    assertUserHasMasquerade(true);
                    assertUserHasAlertsAdmin(true);
                    assertUserHasSpotlightAdmin(true);
                    assertUserHasPromoPanelAdmin(true);
                    assertUserHasTestTagAdmin(false); // admins do not get T&T by default
                    assertUserHasEspaceDashboard(true); // not an admin function, this user happens to have an author account
                });
        });

        it('Test Tag user gets Test and Tag entry', () => {
            cy.visit('http://localhost:8080?user=uqtesttag');
            cy.viewport(1280, 900);
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions();
                    assertUserHasTestTagAdmin(true);
                });
        });

        it('An espace masquerader non-admin sees masquerade but not other admin functions', () => {
            cy.visit('http://localhost:8080?user=uqmasquerade');
            cy.viewport(1280, 900);
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions();
                    assertUserHasMasquerade(true);
                    assertUserHasAlertsAdmin(false);
                    assertUserHasSpotlightAdmin(false);
                    assertUserHasPromoPanelAdmin(false);
                    assertUserHasTestTagAdmin(false);
                    assertUserHasEspaceDashboard(true);
                });
        });

        it('Researcher gets espace but not admin entries', () => {
            cy.visit('http://localhost:8080?user=s1111111');
            cy.viewport(1280, 900);
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions();
                    assertUserHasEspaceDashboard(true);
                    assertUserSeesNOAdminOptions();
                });
        });

        it('A digiteam member gets espace & masquerade but not other admin entries', () => {
            cy.visit('http://localhost:8080?user=digiteamMember');
            cy.viewport(1280, 900);
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions();
                    assertUserHasEspaceDashboard(true);
                    assertUserHasMasquerade(true);
                    assertUserHasAlertsAdmin(false);
                    assertUserHasSpotlightAdmin(false);
                    assertUserHasPromoPanelAdmin(false);
                    assertUserHasTestTagAdmin(false);
                });
        });

        it('non-Researcher gets neither espace nor admin entries', () => {
            cy.visit('http://localhost:8080?user=s3333333');
            cy.viewport(1280, 900);
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions();
                    assertUserSeesNOAdminOptions();
                    assertUserHasEspaceDashboard(false);
                });
        });

        it('Navigates to page from user popup', () => {
            cy.visit('http://localhost:8080?user=s1111111');
            cy.viewport(1280, 900);
            cy.wait(1500);
            cy.intercept('GET', 'https://support.my.uq.edu.au/app/library/feedback', {
                statusCode: 200,
                body: 'user is on library feedback page',
            });
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="mylibrary-menu-feedback"]').should('be.visible');
                    cy.get('[data-testid="mylibrary-menu-feedback"]').click();
                });
            cy.get('body').contains('user is on library feedback page');
        });
    });
});

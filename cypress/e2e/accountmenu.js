/// <reference types="cypress" />
import uqrdav10, { accounts } from '../../mock/data/account';
import UserAccount from '../../src/ApiAccess/UserAccount';
import { apiLocale } from '../../src/ApiAccess/ApiAccess.locale';
import { authLocale } from '../../src/UtilityArea/auth.locale';
import { COLOUR_UQ_PURPLE, getAccountMenuRoot } from '../../src/UtilityArea/helpers';

function assertLogoutButtonVisible(expected = true) {
    if (expected) {
        cy.waitUntil(() => cy.get('auth-button').shadow().find('button:contains("Log out")'));
        cy.get('auth-button').shadow().find('button:contains("Log out")').should('be.visible');
    } else {
        cy.waitUntil(() => cy.get('auth-button').shadow().find('button:contains("Log out")'));
        cy.get('auth-button').shadow().find('button:contains("Log out")').should('not.be.visible');
    }
}

function openAccountDropdown() {
    cy.waitUntil(() => cy.get('auth-button').shadow().find('[data-testid="account-option-button"]').should('exist'));
    cy.get('auth-button').shadow().find('[data-testid="account-option-button"]').click();
    cy.waitUntil(() =>
        cy.get('auth-button').shadow().find('[data-testid="mylibrary-menu-borrowing"]').should('be.visible'),
    );
}

function assertUserHasStandardMyLibraryOptions(userid = 'uqstaff') {
    cy.get('li a[data-testid="mylibrary-menu-borrowing"]').should('exist').contains('Library account');
    cy.get('li a[data-testid="mylibrary-menu-course-resources"]').should('exist').contains('Learning resources');
    cy.get('li a[data-testid="mylibrary-menu-course-resources"]').should(
        'have.attr',
        'href',
        `http://localhost:2020/learning-resources?user=${userid}`,
    );
    cy.get('li a[data-testid="mylibrary-menu-print-balance"]').should('exist').contains('Print balance');
    cy.get('li a[data-testid="mylibrary-menu-room-bookings"]').should('exist').contains('Book a room or desk');
    cy.get('li a[data-testid="mylibrary-menu-saved-items"]').should('exist').contains('Favourites');
    cy.get('li a[data-testid="mylibrary-menu-feedback"]').should('exist').contains('Feedback');
}

function assertUserHasMasquerade(expected, userid = 'uqstaff') {
    if (!!expected) {
        cy.get('li[data-testid="mylibrary-masquerade"]').should('exist').contains('Masquerade');
        cy.get('li a[data-testid="mylibrary-menu-masquerade"]').should(
            'have.attr',
            'href',
            `http://localhost:2020/admin/masquerade?user=${userid}`,
        );
    } else {
        cy.get('li[data-testid="mylibrary-masquerade"]').should('not.exist');
    }
}

function assertUserHasAlertsAdmin(expected, userid = 'uqstaff') {
    if (!!expected) {
        cy.get('li[data-testid="alerts-admin"]').should('exist').contains('Website alerts');
        cy.get('[data-testid="mylibrary-menu-alerts-admin"]').should(
            'have.attr',
            'href',
            `http://localhost:2020/admin/alerts?user=${userid}`,
        );
    } else {
        cy.get('li[data-testid="alerts-admin"]').should('not.exist');
    }
}

function assertUserHasTestTagAdmin(expected) {
    // only staff who are Licensed Electrical Testers (or are on dev team) should have this
    if (!!expected) {
        cy.get('li[data-testid="testTag-admin"]').should('exist').contains('Test and tag');
        cy.get('[data-testid="mylibrary-menu-testTag-admin"]').should(
            'have.attr',
            'href',
            'http://localhost:2020/admin/testntag?user=uqtesttag',
        );
    } else {
        cy.get('li[data-testid="testTag-admin"]').should('not.exist');
    }
}

function assertUserHasDlorAdmin(expected) {
    if (!!expected) {
        cy.get('li[data-testid="dlor-admin"]').should('exist').contains('Digital learning hub');
        cy.get('[data-testid="mylibrary-menu-dlor-admin"]').should(
            'have.attr',
            'href',
            'http://localhost:2020/admin/dlor?user=dloradmn',
        );
    } else {
        cy.get('li[data-testid="dlor-admin"]').should('not.exist');
    }
}

function assertUserHasSpringshareAdmin(expected) {
    if (!!expected) {
        cy.get('li[data-testid="springshare-admin"]').should('exist').contains('LibApps');
        cy.get('[data-testid="mylibrary-menu-springshare-admin"]').should(
            'have.attr',
            'href',
            'https://uq.libapps.com/libapps/login.php?site_id=731',
        );
    } else {
        cy.get('li[data-testid="springshare-admin"]').should('not.exist');
    }
}

function assertUserHasEspaceMenuItem(expected) {
    if (!!expected) {
        cy.get('li[data-testid="mylibrary-espace"]').should('exist').contains('UQ eSpace dashboard');
    } else {
        cy.get('li[data-testid="mylibrary-espace"]').should('not.exist');
    }
}

function visitPageForUser(userName) {
    cy.visit('http://localhost:8080/?user=' + userName);
    cy.waitUntil(() => cy.get('uq-site-header').find('auth-button').should('exist'));
}

function assertUserSeesNOAdminOptions() {
    assertUserHasMasquerade(false);
    assertUserHasAlertsAdmin(false);
    assertUserHasTestTagAdmin(false);
    assertUserHasDlorAdmin(false);
    assertUserHasSpringshareAdmin(false);
    // the admin block has been removed so we don't see the admin border
    cy.get('[data-testid="admin-options"]').should('not.exist');
}

function assertUserisLoggedOut() {
    cy.waitUntil(() => cy.get('auth-button').shadow().find('[data-testid="auth-button-login-label"]').should('exist'));
    cy.get('auth-button')
        .shadow()
        .find('[data-testid="auth-button-login-label"]')
        .should('be.visible')
        .should('contain', 'Log in');
}

describe('Account menu button', () => {
    context('Accessibility', () => {
        it('logged OUT user is accessible', () => {
            visitPageForUser('public');
            cy.injectAxe();
            assertUserisLoggedOut();
            cy.checkA11y('auth-button', {
                reportName: 'Auth Loggedout',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('logged IN user is accessible', () => {
            visitPageForUser('vanilla');
            cy.injectAxe();
            cy.checkA11y('auth-button', {
                reportName: 'Account Loggedin',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            openAccountDropdown();
            // let the colours settle
            cy.waitUntil(() =>
                cy
                    .get('auth-button')
                    .shadow()
                    .find('[data-testid="username-area-label"]')
                    .should('exist')
                    .contains('User, Vanilla')
                    .should('have.css', 'background-color', COLOUR_UQ_PURPLE),
            );
            cy.checkA11y('auth-button', {
                reportName: 'Account Loggedin Dialog Open',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('logged OUT user is accessible on mobile', () => {
            cy.viewport(320, 480);
            visitPageForUser('public');
            cy.injectAxe();
            assertUserisLoggedOut();
            cy.checkA11y('auth-button', {
                reportName: 'Auth Loggedout mobile',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('logged IN user is accessible on mobile', () => {
            cy.viewport(320, 480);
            visitPageForUser('vanilla');
            cy.injectAxe();
            cy.checkA11y('auth-button', {
                reportName: 'Account Loggedin mobile',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            openAccountDropdown();
            // let the colours settle
            cy.waitUntil(() =>
                cy
                    .get('auth-button')
                    .shadow()
                    .find('[data-testid="username-area-label"]')
                    .should('exist')
                    .contains('User, Vanilla')
                    .should('have.css', 'background-color', COLOUR_UQ_PURPLE),
            );
            cy.checkA11y('auth-button', {
                reportName: 'Account Loggedin Dialog Open mobile',
                scopeName: 'Accessibility',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
    context('Account menu button', () => {
        it('`overwriteasloggedout` attribute always show them as logged out', () => {
            cy.visit('http://localhost:8080/index-primo.html');
            cy.viewport(1280, 900);
            assertUserisLoggedOut();
        });

        it('Navigates to login page', () => {
            cy.intercept(/auth.uq.edu.au/, 'user visits login page'); // from https://auth.uq.edu.au/idp/module.php/core/loginuserpass.php?&etc
            cy.intercept(/loginuserpass/, 'user visits login page');
            cy.intercept('GET', authLocale.AUTH_URL_LOGIN, {
                statusCode: 200,
                body: 'user visits login page',
            });

            cy.visit('http://localhost:8080/?user=public');
            cy.viewport(1280, 900);
            cy.waitUntil(() => cy.get('uq-site-header').find('auth-button').should('exist'));

            assertUserisLoggedOut();
            cy.get('auth-button').shadow().find('[data-testid="auth-button-login"]').click();
            cy.get('body').contains('user visits login page');
        });

        it('Navigates to logout page', () => {
            visitPageForUser('s1111111');
            cy.get('auth-button').shadow().find('[data-testid="account-option-button"]').click();
            assertLogoutButtonVisible(true);
            cy.get('auth-button').shadow().find('button:contains("Log out")').click();

            assertUserisLoggedOut();
        });

        it('does not call a tokenised api if the cookies arent available', () => {
            cy.clearCookie(apiLocale.SESSION_COOKIE_NAME);
            cy.clearCookie(apiLocale.SESSION_USER_GROUP_COOKIE_NAME);

            const api = new UserAccount();
            api.announceUserLoggedOut();

            async function checkCookies() {
                let testResult = false;
                await new UserAccount().get().then((result) => {
                    expect(result).to.be.equal(false);
                    testResult = true;
                });
                return testResult;
            }
            checkCookies().then((testValid) => {
                // just a paranoia check that the above test inside an await actually happened.
                expect(testValid).to.be.equal(true);
            });
        });

        // this is failing on aws, and it's a bit of a hack to manually remove the cookie like that,
        // so lets call it an invalid test for the moment
        it('when session cookie auto expires the user logs out', () => {
            visitPageForUser('uqstaff');

            cy.wait(1000);
            cy.clearCookie(apiLocale.SESSION_COOKIE_NAME);
            cy.wait(1000);
            assertUserisLoggedOut();
        });

        it('Pressing esc closes the account menu', () => {
            visitPageForUser('uqstaff');
            openAccountDropdown();
            assertLogoutButtonVisible();
            cy.get('body').type('{esc}', { force: true });
            assertLogoutButtonVisible(false);
        });
        it('arrows change when the account menu is open-closed', () => {
            visitPageForUser('uqstaff');
            // can see down arrow
            cy.get('auth-button').shadow().find('[data-testid="down-arrow"]').should('exist').should('be.visible');
            // up arrow hidden
            cy.get('auth-button').shadow().find('[data-testid="up-arrow"]').should('exist').should('not.be.visible');
            // username is not purple
            cy.get('auth-button')
                .shadow()
                .find('[data-testid="username-area-label"]')
                .should('exist')
                .should('not.have.css', 'background-color', COLOUR_UQ_PURPLE);
            openAccountDropdown();
            // down arrow hidden
            cy.get('auth-button').shadow().find('[data-testid="down-arrow"]').should('exist').should('not.be.visible');
            // can see up arrow
            cy.get('auth-button').shadow().find('[data-testid="up-arrow"]').should('exist').should('be.visible');
            // username is purple
            cy.get('auth-button')
                .shadow()
                .find('[data-testid="username-area-label"]')
                .should('exist')
                .contains('Staff, UQ')
                .should('have.css', 'background-color', COLOUR_UQ_PURPLE);
            // close menu
            cy.get('body').type('{esc}', { force: true }); // close account menu
            // can see down arrow again
            cy.get('auth-button').shadow().find('[data-testid="down-arrow"]').should('exist').should('be.visible');
            // up arrow hidden again
            cy.get('auth-button').shadow().find('[data-testid="up-arrow"]').should('exist').should('not.be.visible');
            // username is not purple
            cy.get('auth-button')
                .shadow()
                .find('[data-testid="username-area-label"]')
                .should('exist')
                .should('not.have.css', 'background-color', COLOUR_UQ_PURPLE);
        });

        it('Clicking the pane closes the account menu', () => {
            visitPageForUser('s1111111');
            openAccountDropdown();
            assertLogoutButtonVisible();
            cy.get('body').click(0, 0);
            assertLogoutButtonVisible(false);
        });
    });
    context('Display names', () => {
        function showsCorrectPatronName(displayName) {
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="username-area-label"]')
                        .should('exist')
                        .should('be.visible')
                        .contains(displayName);
                });
        }

        it('user with a short name will show their complete name', () => {
            visitPageForUser('emfryer');
            showsCorrectPatronName('User, Fryer');
        });
        it('user with a long length name will show their last name with initial', () => {
            visitPageForUser('digiteamMember');
            // This shows that when the surname is long that the first name is reduced to an initial
            // Unfortunately it doesn't test that the surname is truncated on display, because that's just css
            showsCorrectPatronName('C STAFF MEMBER WITH MEGA REALLY TRULY STUPENDOUSLY LONG NAME');
        });
        it('user who uses a single name will not show the "." as a surname', () => {
            visitPageForUser('emhonorary');
            showsCorrectPatronName('Honorary');
        });
    });
    context('User-specific account links', () => {
        it('Admin gets admin entries', () => {
            visitPageForUser('uqstaff');
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions();
                    assertUserHasMasquerade(true);
                    assertUserHasAlertsAdmin(true);
                    assertUserHasTestTagAdmin(false); // admins do not get T&T by default
                    assertUserHasDlorAdmin(false);
                    assertUserHasSpringshareAdmin(true);
                    assertUserHasEspaceMenuItem(true); // not an admin function, this user happens to have an author account
                });
        });

        it('Test Tag user gets "Test and tag" entry', () => {
            visitPageForUser('uqtesttag');
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions('uqtesttag');
                    assertUserHasMasquerade(true, 'uqtesttag');
                    assertUserHasAlertsAdmin(false);
                    assertUserHasTestTagAdmin(true);
                    assertUserHasDlorAdmin(false);
                    assertUserHasSpringshareAdmin(true);
                });
        });

        it('Dlor admin gets Dlor admin access entry', () => {
            visitPageForUser('dloradmn');
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions('dloradmn');
                    assertUserHasMasquerade(false);
                    assertUserHasAlertsAdmin(false);
                    assertUserHasTestTagAdmin(false);
                    assertUserHasDlorAdmin(true);
                    assertUserHasSpringshareAdmin(true);
                });
        });

        it('An espace masquerader non-admin sees masquerade but not other admin functions', () => {
            visitPageForUser('uqmasquerade');
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions('uqmasquerade');
                    assertUserHasMasquerade(true, 'uqmasquerade');
                    assertUserHasAlertsAdmin(false);
                    assertUserHasTestTagAdmin(false);
                    assertUserHasDlorAdmin(false);
                    assertUserHasSpringshareAdmin(true); // is library staff
                    assertUserHasEspaceMenuItem(true);
                });
        });

        it('Researcher gets espace but not admin entries', () => {
            visitPageForUser('s1111111');
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions('s1111111');
                    assertUserHasEspaceMenuItem(true);
                    assertUserSeesNOAdminOptions();
                });
        });

        it('A digiteam member gets espace & masquerade but not other admin entries', () => {
            visitPageForUser('digiteamMember');
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions('digiteamMember');
                    assertUserHasEspaceMenuItem(true);
                    assertUserHasMasquerade(true, 'digiteamMember');
                    assertUserHasAlertsAdmin(false);
                    assertUserHasTestTagAdmin(false);
                    assertUserHasDlorAdmin(false);
                    assertUserHasSpringshareAdmin(true);
                });
        });

        it('non-Researcher doesnt get espace (and not admin entries)', () => {
            visitPageForUser('s3333333');
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions('s3333333');
                    assertUserSeesNOAdminOptions();
                    assertUserHasEspaceMenuItem(false);
                });
        });

        // need to also test a user that gets a null from the author call; s3333333 has this odd incomplete record
        it('other non-Researcher does not get espace', () => {
            visitPageForUser('uqrdav10');
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    assertUserHasStandardMyLibraryOptions('uqrdav10');
                    assertUserHasMasquerade(false);
                    assertUserHasAlertsAdmin(false);
                    assertUserHasTestTagAdmin(false);
                    assertUserHasDlorAdmin(false);
                    assertUserHasSpringshareAdmin(false);
                    assertUserHasEspaceMenuItem(false);
                });
        });

        it('can navigate to some page from account menu', () => {
            cy.intercept('GET', 'https://support.my.uq.edu.au/app/library/feedback', {
                statusCode: 200,
                body: 'user is on library feedback page',
            });
            visitPageForUser('s1111111');
            openAccountDropdown();
            cy.get('auth-button')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="mylibrary-menu-feedback"]').should('be.visible');
                    cy.get('[data-testid="mylibrary-menu-feedback"]').click();
                });
            cy.get('body').contains('user is on library feedback page');
        });
        it('can generate correct admin roots', () => {
            // take the passed in values directly from a console.log(window.location) in the actual live env of interest
            expect(getAccountMenuRoot('www.library.uq.edu.au', 'https:', '/')).to.be.equal(
                'https://www.library.uq.edu.au/',
            );
            expect(getAccountMenuRoot('homepage-development.library.uq.edu.au', 'https:', '/master/')).to.be.equal(
                'https://homepage-development.library.uq.edu.au/master/#/',
            );
            expect(getAccountMenuRoot('homepage-staging.library.uq.edu.au', 'https:', '/')).to.be.equal(
                'https://homepage-staging.library.uq.edu.au/',
            );
            expect(getAccountMenuRoot('localhost', 'http:', '/')).to.be.equal('http://localhost:2020/');
        });
    });
});

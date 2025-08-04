import { expect, test } from '@playwright/test';

const COLOUR_CONTENT_BLACK = 'rgb(25, 21, 28)';

var _ApiAccess = require('../../src/ApiAccess/ApiAccess.locale');
var _helpers = require('../../src/UtilityArea/helpers');

async function assertLogoutButtonVisible(page, expected = true) {
    const authButton = page.locator('uq-site-header').locator('auth-button');
    if (expected) {
        await expect(authButton.getByTestId('auth-button-logout')).toBeVisible();
    } else {
        await expect(authButton.getByTestId('auth-button-logout')).not.toBeVisible();
    }
}

async function openAccountDropdown(page) {
    await expect(page.locator('auth-button').locator('button[data-testid="account-option-button"]')).toBeVisible();
    // await expect(page.locator('auth-button').locator('a[data-testid="mylibrary-menu-borrowing"]')).not.toBeVisible();
    await page.locator('auth-button').locator('button[data-testid="account-option-button"]').click();
    await expect(page.locator('auth-button').locator('a[data-testid="mylibrary-menu-borrowing"]')).toBeVisible();
}

async function assertUserHasStandardMyLibraryOptions(userid, page) {
    const authButton = page.locator('uq-site-header').locator('auth-button');
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-borrowing"]')).toBeVisible();
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-borrowing"]')).toHaveText('Library account');
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-course-resources"]')).toBeVisible();
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-course-resources"]')).toHaveText(
        'Learning resources',
    );
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-course-resources"]')).toHaveAttribute(
        'href',
        `http://localhost:2020/learning-resources?user=${userid}`,
    );
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-print-balance"]')).toBeVisible();
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-print-balance"]')).toHaveText('Print balance');
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-room-bookings"]')).toBeVisible();
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-room-bookings"]')).toHaveText(
        'Book a room or desk',
    );
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-saved-items"]')).toBeVisible();
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-saved-items"]')).toHaveText('Favourites');
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-feedback"]')).toBeVisible();
    await expect(authButton.locator('li a[data-testid="mylibrary-menu-feedback"]')).toHaveText('Feedback');
}

async function assertUserHasMasquerade(expected, page, userid = 'uqstaff') {
    const authButton = page.locator('uq-site-header').locator('auth-button');
    if (!!expected) {
        await expect(authButton.locator('li[data-testid="mylibrary-masquerade"]')).toBeVisible();
        await expect(authButton.locator('li[data-testid="mylibrary-masquerade"]')).toHaveText('Masquerade');
        await expect(authButton.locator('li a[data-testid="mylibrary-menu-masquerade"]')).toHaveAttribute(
            'href',
            `http://localhost:2020/admin/masquerade?user=${userid}`,
        );
    } else {
        await expect(authButton.locator('li[data-testid="mylibrary-masquerade"]')).not.toBeVisible();
    }
}

async function assertUserHasAlertsAdmin(expected, page, userid = 'uqstaff') {
    const authButton = page.locator('uq-site-header').locator('auth-button');
    if (!!expected) {
        await expect(authButton.locator('li[data-testid="alerts-admin"]')).toBeVisible();
        await expect(authButton.locator('li[data-testid="alerts-admin"]')).toHaveText('Website alerts');
        await expect(authButton.locator('li a[data-testid="mylibrary-menu-alerts-admin"]')).toHaveAttribute(
            'href',
            `http://localhost:2020/admin/alerts?user=${userid}`,
        );
    } else {
        await expect(authButton.locator('li[data-testid="alerts-admin"]')).not.toBeVisible();
    }
}

async function assertUserHasTestTagAdmin(expected, page) {
    // only staff who are Licensed Electrical Testers (or are on dev team) should have this
    const authButton = page.locator('uq-site-header').locator('auth-button');
    if (!!expected) {
        await expect(authButton.locator('li[data-testid="testTag-admin"]')).toBeVisible();
        await expect(authButton.locator('li[data-testid="testTag-admin"]')).toHaveText('Test and tag');
        await expect(authButton.locator('li a[data-testid="mylibrary-menu-testTag-admin"]')).toHaveAttribute(
            'href',
            `http://localhost:2020/admin/testntag?user=uqtesttag`,
        );
    } else {
        await expect(authButton.locator('li[data-testid="testTag-admin"]')).not.toBeVisible();
    }
}

async function assertUserHasDlorAdmin(expected, page) {
    const authButton = page.locator('uq-site-header').locator('auth-button');
    if (!!expected) {
        await expect(authButton.locator('li[data-testid="dlor-admin"]')).toBeVisible();
        await expect(authButton.locator('li[data-testid="dlor-admin"]')).toHaveText('Digital learning hub');
        await expect(authButton.locator('li a[data-testid="mylibrary-menu-dlor-admin"]')).toHaveAttribute(
            'href',
            `http://localhost:2020/admin/dlor?user=dloradmn`,
        );
    } else {
        await expect(authButton.locator('li[data-testid="dlor-admin"]')).not.toBeVisible();
    }
}

async function assertUserHasSpringshareAdmin(expected, page) {
    if (!!expected) {
        await expect(page.locator('li[data-testid="springshare-admin"]')).toBeVisible();
        await expect(
            page
                .locator('li[data-testid="springshare-admin"]')
                .getByText(/LibApps/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('[data-testid="mylibrary-menu-springshare-admin"]')).toHaveAttribute(
            'href',
            'https://uq.libapps.com/libapps/login.php?site_id=731',
        );
    } else {
        await expect(page.locator('li[data-testid="springshare-admin"]')).not.toBeVisible();
    }
}

async function assertUserHasEspaceMenuItem(expected, page) {
    if (!!expected) {
        await expect(page.locator('li[data-testid="mylibrary-espace"]')).toBeVisible();
        await expect(
            page
                .locator('li[data-testid="mylibrary-espace"]')
                .getByText(/UQ eSpace dashboard/)
                .first(),
        ).toBeVisible();
    } else {
        await expect(page.locator('li[data-testid="mylibrary-espace"]')).not.toBeVisible();
    }
}

async function visitPageforUser(userName, page) {
    await page.goto('http://localhost:8080/?user=' + userName);
    await expect(page.locator('uq-site-header').locator('auth-button')).toBeVisible();
}

async function assertUserSeesNOAdminOptions(page) {
    assertUserHasMasquerade(false, page);
    assertUserHasAlertsAdmin(false, page);
    assertUserHasTestTagAdmin(false, page);
    assertUserHasDlorAdmin(false, page);
    assertUserHasSpringshareAdmin(false, page);
    // the admin block has been removed so we don't see the admin border
    await expect(page.locator('[data-testid="admin-options"]')).not.toBeVisible();
}

async function assertUserisLoggedOut(page) {
    await expect(page.locator('auth-button').getByTestId('auth-button-login-label')).toBeVisible();
    await expect(page.locator('auth-button').getByTestId('auth-button-login-label')).toHaveText(/Log in/);
}

test.describe('Account menu button', () => {
    // test.describe('Accessibility', () => {
    //     test('logged OUT user is accessible', async ({ page }) => {
    //         await visitPageforUser('public', page);
    //         page.FIXME_injectAxe();
    //
    //         assertUserisLoggedOut(page);
    //         page.FIXME_checkA11y('auth-button', {
    //             reportName: 'Auth Loggedout',
    //             scopeName: 'Accessibility',
    //             includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    //         });
    //     });
    //
    //     test('logged IN user is accessible', async ({ page }) => {
    //         await visitPageforUser('vanilla', page);
    //         page.FIXME_injectAxe();
    //         page.FIXME_checkA11y('auth-button', {
    //             reportName: 'Account Loggedin',
    //             scopeName: 'Accessibility',
    //             includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    //         });
    //         await openAccountDropdown(page);
    //         // let the colours settle
    //         page.FIXME_waitUntil(async () =>
    //             (async () => {
    //                 page.locator('auth-button').FIXME_shadow();
    //                 await expect(
    //                     page.locator('auth-button').locator('[data-testid="username-area-label"]'),
    //                 ).toBeVisible();
    //                 await expect(
    //                     page
    //                         .locator('auth-button')
    //                         .locator('[data-testid="username-area-label"]')
    //                         .getByText(/User, Vanilla/)
    //                         .first(),
    //                 ).toHaveCSS('background-color', _helpers.COLOUR_UQ_PURPLE);
    //                 return page
    //                     .locator('auth-button')
    //                     .locator('[data-testid="username-area-label"]')
    //                     .getByText(/User, Vanilla/)
    //                     .first();
    //             })(),
    //         );
    //         page.FIXME_checkA11y('auth-button', {
    //             reportName: 'Account Loggedin Dialog Open',
    //             scopeName: 'Accessibility',
    //             includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    //         });
    //     });
    //
    //     test('logged OUT user is accessible on mobile', async ({ page }) => {
    //         await page.setViewportSize({ width: 320, height: 480 });
    //         await visitPageforUser('public', page);
    //         page.FIXME_injectAxe();
    //
    //         assertUserisLoggedOut(page);
    //         page.FIXME_checkA11y('auth-button', {
    //             reportName: 'Auth Loggedout mobile',
    //             scopeName: 'Accessibility',
    //             includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    //         });
    //     });
    //
    //     test('logged IN user is accessible on mobile', async ({ page }) => {
    //         await page.setViewportSize({ width: 320, height: 480 });
    //         await visitPageforUser('vanilla', page);
    //         page.FIXME_injectAxe();
    //         page.FIXME_checkA11y('auth-button', {
    //             reportName: 'Account Loggedin mobile',
    //             scopeName: 'Accessibility',
    //             includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    //         });
    //         await openAccountDropdown(page);
    //         // let the colours settle
    //         page.FIXME_waitUntil(async () =>
    //             (async () => {
    //                 page.locator('auth-button').FIXME_shadow();
    //                 await expect(
    //                     page.locator('auth-button').locator('[data-testid="username-area-label"]'),
    //                 ).toBeVisible();
    //                 await expect(
    //                     page
    //                         .locator('auth-button')
    //                         .locator('[data-testid="username-area-label"]')
    //                         .getByText(/User, Vanilla/)
    //                         .first(),
    //                 ).toHaveCSS('background-color', _helpers.COLOUR_UQ_PURPLE);
    //                 return page
    //                     .locator('auth-button')
    //                     .locator('[data-testid="username-area-label"]')
    //                     .getByText(/User, Vanilla/)
    //                     .first();
    //             })(),
    //         );
    //         page.FIXME_checkA11y('auth-button', {
    //             reportName: 'Account Loggedin Dialog Open mobile',
    //             scopeName: 'Accessibility',
    //             includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    //         });
    //     });
    // });
    test.describe('Account menu button', () => {
        test('`overwriteasloggedout` attribute always show them as logged out', async ({ page }) => {
            await page.goto('http://localhost:8080/index-primo.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            await assertUserisLoggedOut(page);
        });

        test('Navigates to login page', async ({ page }) => {
            await page.route('https://auth.library.uq.edu.au/**', async (route) => {
                await route.fulfill({ body: 'user visits login page' });
            });

            await page.goto('http://localhost:8080/?user=public');
            await page.setViewportSize({ width: 1280, height: 900 });

            const authButton = page.locator('uq-site-header').locator('auth-button');
            await expect(authButton).toBeVisible();
            await assertUserisLoggedOut(page);
            await authButton.getByTestId('auth-button-login').click();
            await expect(page.getByText('user visits login page')).toBeVisible();
        });

        test('Can logout', async ({ page }) => {
            await visitPageforUser('s1111111', page);

            const authButton = page.locator('uq-site-header').locator('auth-button');
            // await authButton.getByTestId('account-option-button').click();
            await openAccountDropdown(page);
            await assertLogoutButtonVisible(page, true);
            // await expect(authButton.locator('button:contains("Log out")')).toBeVisible();
            // await expect(authButton.getByTestId('auth-button-logout')).toBeVisible();
            await authButton.getByTestId('auth-button-logout').click();
            await assertUserisLoggedOut(page);
        });

        // // what does this even test?!?!?
        // test('does not call a tokenised api if the cookies arent available', async ({ page, context }) => {
        //     // page.FIXME_clearCookie(_ApiAccess.apiLocale.SESSION_COOKIE_NAME);
        //     // page.FIXME_clearCookie(_ApiAccess.apiLocale.SESSION_USER_GROUP_COOKIE_NAME);
        //     await context.clearCookies({ name: _ApiAccess.apiLocale.SESSION_COOKIE_NAME });
        //     await context.clearCookies({ name: _ApiAccess.apiLocale.SESSION_USER_GROUP_COOKIE_NAME });
        //
        //     // const api = new _UserAccount.default();
        //     // api.announceUserLoggedOut();
        //     //
        //     // async function checkCookies() {
        //     //     let testResult = false;
        //     //     await new _UserAccount.default().get().then(async (result) => {
        //     //         expect(result).FIXME_be_equal(false);
        //     //         testResult = true;
        //     //     });
        //     //     return testResult;
        //     // }
        //     // checkCookies().then(async (testValid) => {
        //     //     // just a paranoia check that the above test inside an await actually happened.
        //     //     expect(testValid).FIXME_be_equal(true);
        //     // });
        // });

        test('when session cookie auto expires the user logs out', async ({ page, context }) => {
            await visitPageforUser('uqstaff', page);
            await page.waitForTimeout(1000);
            await context.clearCookies({ name: _ApiAccess.apiLocale.SESSION_COOKIE_NAME });
            await page.waitForTimeout(1000);
            await assertUserisLoggedOut(page);
        });

        test('Pressing esc closes the account menu', async ({ page }) => {
            await visitPageforUser('uqstaff', page);

            const authButton = page.locator('uq-site-header').locator('auth-button');

            await expect(authButton.getByTestId('up-arrow')).not.toBeVisible(); // the arrow beside the username
            await expect(authButton.getByTestId('down-arrow')).toBeVisible(); // changes when the menu is open

            await openAccountDropdown(page);

            await expect(authButton.getByTestId('up-arrow')).toBeVisible();
            await expect(authButton.getByTestId('down-arrow')).not.toBeVisible();
            await assertLogoutButtonVisible(page, true);

            // hit the escape key to close the menu
            await page.locator('body').press('Escape');
            await page.waitForTimeout(1000);

            // the menu is hidden
            await expect(authButton.getByTestId('up-arrow')).not.toBeVisible();
            await expect(authButton.getByTestId('down-arrow')).toBeVisible();
        });
        test('arrows change when the account menu is open-closed', async ({ page }) => {
            await visitPageforUser('uqstaff', page);
            const authButton = page.locator('uq-site-header').locator('auth-button');

            await expect(authButton.getByTestId('down-arrow')).toBeVisible(); // can see down arrow
            await expect(authButton.getByTestId('up-arrow')).not.toBeVisible(); // up arrow hidden

            // username is black text on white background
            await expect(authButton.getByTestId('username-area-label-field')).toBeVisible();
            await expect(authButton.getByTestId('username-area-label-field')).toHaveCSS(
                'background-color',
                'rgba(0, 0, 0, 0)',
            );
            await expect(authButton.getByTestId('username-area-label-field')).toHaveCSS('color', COLOUR_CONTENT_BLACK);

            await openAccountDropdown(page);

            await expect(authButton.getByTestId('down-arrow')).not.toBeVisible(); // down arrow hidden
            await expect(authButton.getByTestId('up-arrow')).toBeVisible(); // can see up arrow

            // username is white text on purple background
            await expect(authButton.getByTestId('username-area-label-field')).toBeVisible();
            await expect(authButton.getByTestId('username-area-label-field')).toHaveText('Staff, UQ');
            await expect(authButton.getByTestId('username-area-label-field')).toHaveCSS(
                'background-color',
                _helpers.COLOUR_UQ_PURPLE,
            );
            await expect(authButton.getByTestId('username-area-label-field')).toHaveCSS('color', 'rgb(255, 255, 255)');

            // close menu
            await page.locator('body').press('Escape'); // close account menu

            // move focus off the menu item - the hover leaves the colour showing
            await page.locator('h1[id="skiptohere"]').click();

            await expect(authButton.getByTestId('down-arrow')).toBeVisible(); // can see down arrow again
            await expect(authButton.getByTestId('up-arrow')).not.toBeVisible(); // up arrow hidden again
            // username is back to black on white (ie not purple)
            await expect(authButton.getByTestId('username-area-label-field')).toBeVisible();
            await expect(authButton.getByTestId('username-area-label-field')).toHaveCSS(
                'background-color',
                'rgba(0, 0, 0, 0)',
            );
            await expect(authButton.getByTestId('username-area-label-field')).toHaveCSS('color', COLOUR_CONTENT_BLACK);
        });

        test('Clicking the pane closes the account menu', async ({ page }) => {
            await visitPageforUser('s1111111', page);
            const authButton = page.locator('uq-site-header').locator('auth-button');

            await openAccountDropdown(page);
            await assertLogoutButtonVisible(page, true);

            await page.locator('body').click({ position: { x: 0, y: 0 } });

            await assertLogoutButtonVisible(page, false);
        });
    });
    test.describe('Display names', () => {
        async function assertShowsCorrectPatronName(displayName, page) {
            const authButton = page.locator('uq-site-header').locator('auth-button');
            await expect(authButton.getByTestId('username-area-label-field')).toBeVisible();
            await expect(authButton.getByText(displayName).first()).toBeVisible();
        }

        test('user with a short name will show their complete name', async ({ page }) => {
            await visitPageforUser('emfryer', page);
            await assertShowsCorrectPatronName('User, Fryer', page);
        });
        test('user with a long length name will show their last name with initial', async ({ page }) => {
            await visitPageforUser('digiteamMember', page);
            // This shows that when the surname is long that the first name is reduced to an initial
            // Unfortunately it doesn't test that the surname is truncated on display, because that's just css
            await assertShowsCorrectPatronName('C STAFF MEMBER WITH MEGA REALLY TRULY STUPENDOUSLY LONG NAME', page);
        });
        test('user who uses a single name will not show the "." as a surname', async ({ page }) => {
            await visitPageforUser('emhonorary', page);
            await assertShowsCorrectPatronName('Honorary', page);
        });
    });
    test.describe('User-specific account links', () => {
        test('Admin gets admin entries', async ({ page }) => {
            await visitPageforUser('uqstaff', page);
            await openAccountDropdown(page);

            await assertUserHasStandardMyLibraryOptions('uqstaff', page);
            await assertUserHasMasquerade(true, page, 'uqstaff');
            await assertUserHasAlertsAdmin(true, page);
            await assertUserHasTestTagAdmin(false, page); // admins do not get T&T by default
            await assertUserHasDlorAdmin(false, page);
            await assertUserHasSpringshareAdmin(true, page);
            await assertUserHasEspaceMenuItem(true, page); // not an admin function, this user happens to have an author account
        });

        test('Test Tag user gets "Test and tag" entry', async ({ page }) => {
            await visitPageforUser('uqtesttag', page);
            await openAccountDropdown(page);

            await assertUserHasStandardMyLibraryOptions('uqtesttag', page);
            await assertUserHasMasquerade(true, page, 'uqtesttag');
            await assertUserHasAlertsAdmin(false, page);
            await assertUserHasTestTagAdmin(true, page);
            await assertUserHasDlorAdmin(false, page);
            await assertUserHasSpringshareAdmin(true, page);
        });

        test('Dlor admin gets Dlor admin access entry', async ({ page }) => {
            await visitPageforUser('dloradmn', page);
            await openAccountDropdown(page);

            await assertUserHasStandardMyLibraryOptions('dloradmn', page);
            await assertUserHasMasquerade(false, page, 'dloradmn');
            await assertUserHasAlertsAdmin(false, page);
            await assertUserHasTestTagAdmin(false, page);
            await assertUserHasDlorAdmin(true, page);
            await assertUserHasSpringshareAdmin(true, page);
        });

        test('An espace masquerader non-admin sees masquerade but not other admin functions', async ({ page }) => {
            await visitPageforUser('uqmasquerade', page);
            await openAccountDropdown(page);

            await assertUserHasStandardMyLibraryOptions('uqmasquerade', page);
            await assertUserHasMasquerade(true, page, 'uqmasquerade');
            await assertUserHasAlertsAdmin(false, page);
            await assertUserHasTestTagAdmin(false, page);
            await assertUserHasDlorAdmin(false, page);
            await assertUserHasSpringshareAdmin(true, page); // is library staff
            await assertUserHasEspaceMenuItem(true, page);
        });

        test('Researcher gets espace but not admin entries', async ({ page }) => {
            await visitPageforUser('s1111111', page);
            await openAccountDropdown(page);
            await assertUserHasStandardMyLibraryOptions('s1111111', page);
            await assertUserHasEspaceMenuItem(true, page);
            await assertUserSeesNOAdminOptions(page);
        });

        test('A digiteam member gets espace & masquerade but not other admin entries', async ({ page }) => {
            await visitPageforUser('digiteamMember', page);
            await openAccountDropdown(page);

            await assertUserHasStandardMyLibraryOptions('digiteamMember', page);
            await assertUserHasEspaceMenuItem(true, page);
            await assertUserHasMasquerade(true, page, 'digiteamMember');
            await assertUserHasAlertsAdmin(false, page);
            await assertUserHasTestTagAdmin(false, page);
            await assertUserHasDlorAdmin(false, page);
            await assertUserHasSpringshareAdmin(true, page);
        });

        test('non-Researcher doesnt get espace (and not admin entries)', async ({ page }) => {
            await visitPageforUser('s3333333', page);
            await openAccountDropdown(page);

            await assertUserHasStandardMyLibraryOptions('s3333333', page);
            await assertUserSeesNOAdminOptions(page);
            await assertUserHasEspaceMenuItem(false, page);
        });

        // need to also test a user that gets a null from the author call; s3333333 has this odd incomplete record
        test('other non-Researcher does not get espace', async ({ page }) => {
            await visitPageforUser('uqrdav10', page);
            await openAccountDropdown(page);

            await assertUserHasStandardMyLibraryOptions('uqrdav10', page);
            await assertUserHasMasquerade(false, page, 'uqrdav10');
            await assertUserHasAlertsAdmin(false, page);
            await assertUserHasTestTagAdmin(false, page);
            await assertUserHasDlorAdmin(false, page);
            await assertUserHasSpringshareAdmin(false, page);
            await assertUserHasEspaceMenuItem(false, page);
        });

        test('can navigate to some page from account menu', async ({ page }) => {
            await page.route('https://support.my.uq.edu.au/app/library/feedback', async (route) => {
                await route.fulfill({ body: 'user is on library feedback page' });
            });

            await visitPageforUser('s1111111', page);
            await openAccountDropdown(page);
            const authButton = page.locator('uq-site-header').locator('auth-button');
            await expect(authButton.locator('li a[data-testid="mylibrary-menu-feedback"]')).toBeVisible();
            await expect(authButton.locator('li a[data-testid="mylibrary-menu-feedback"]')).toHaveText('Feedback');
            await authButton.locator('[data-testid="mylibrary-menu-feedback"]').click();
            await expect(
                page
                    .locator('body')
                    .getByText(/user is on library feedback page/)
                    .first(),
            ).toBeVisible();
        });
        test('can generate correct admin roots', async ({ page }) => {
            // take the passed in values directly from a console.log(window.location) in the actual live env of interest
            expect(_helpers.getAccountMenuRoot('www.library.uq.edu.au', 'https:', '/')).toEqual(
                'https://www.library.uq.edu.au/',
            );
            expect(_helpers.getAccountMenuRoot('homepage-development.library.uq.edu.au', 'https:', '/master/')).toEqual(
                'https://homepage-development.library.uq.edu.au/master/#/',
            );
            expect(_helpers.getAccountMenuRoot('homepage-staging.library.uq.edu.au', 'https:', '/')).toEqual(
                'https://homepage-staging.library.uq.edu.au/',
            );
            expect(_helpers.getAccountMenuRoot('localhost', 'http:', '/')).toEqual('http://localhost:2020/');
        });
    });
});

import { test, expect } from '@playwright/test';
import { assertAccessibility } from '../lib/axe';

const FIRST_ALERT_ID = 'alert-1';
const SECOND_ALERT_ID = 'alert-4';
const THIRD_ALERT_ID = 'alert-5';
const COLOUR_UQ_INFO = 'rgb(13, 109, 205)';
const COLOUR_UQ_WARN = 'rgb(247, 186, 30)';
const COLOUR_UQ_ALERT = 'rgb(214, 41, 41)';
const ICON_INFO =
    'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27%3E%3Ccircle cx=%2712%27 cy=%2712%27 r=%279.25%27 stroke=%27%23fff%27 stroke-width=%271.5%27 transform=%27rotate%28-180 12 12%29%27/%3E%3Cpath stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-width=%271.5%27 d=%27M12 16.2v-4%27/%3E%3Ccircle cx=%2712%27 cy=%278.4%27 r=%271.1%27 fill=%27%23fff%27 transform=%27rotate%28-180 12 8.4%29%27/%3E%3C/svg%3E")';
const ICON_WARN =
    'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27%3E%3Ccircle cx=%2712%27 cy=%2712%27 r=%279.25%27 stroke=%27%233b383e%27 stroke-width=%271.5%27/%3E%3Cpath stroke=%27%233b383e%27 stroke-linecap=%27round%27 stroke-width=%271.5%27 d=%27M12 7.8v4%27/%3E%3Ccircle cx=%2711.9%27 cy=%2715.6%27 r=%27.6%27 fill=%27%233b383e%27 stroke=%27%233b383e%27/%3E%3C/svg%3E")';
const ICON_ERROR =
    'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27%3E%3Cpath stroke=%27%23fff%27 stroke-width=%271.5%27 d=%27M20.127 18.545a1.18 1.18 0 0 1-1.055 1.706H4.929a1.18 1.18 0 0 1-1.055-1.706l7.072-14.143a1.179 1.179 0 0 1 2.109 0z%27/%3E%3Cpath stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-width=%271.5%27 d=%27M12 9v4%27/%3E%3Ccircle cx=%2711.9%27 cy=%2716.601%27 r=%271.1%27 fill=%27%23fff%27/%3E%3C/svg%3E")';

test.describe('Alert', () => {
    const getBeforeElBackgroundImage = async (el) =>
        el.evaluate(async (el) => (await window.getComputedStyle(el, '::before')).backgroundImage);

    const assertIconIsVisible = async (el, expected) => {
        expect(await getBeforeElBackgroundImage(el.locator('.alert__message'))).toBe(expected);
    };

    test('Alert is visible without interaction at 1280', async ({ page }) => {
        const getAlert = (alertIdentifierString) =>
            page.locator('alert-list').locator(`uq-alert[id="${alertIdentifierString}"]`);

        await page.goto('http://localhost:8080'); // has alerts call with empty system entry
        await page.setViewportSize({ width: 1280, height: 900 });
        await expect(page.locator('alert-list').locator('uq-alert')).toHaveCount(3);

        // first alert as expected
        await assertIconIsVisible(getAlert(FIRST_ALERT_ID), ICON_INFO);
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-title')).toHaveText(
            'This is an info alert that will show on all systems',
        );
        await expect(page.getByTestId(`alert-${FIRST_ALERT_ID}`)).toHaveCSS('background-color', COLOUR_UQ_INFO);
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-message')).toHaveText(
            'This is the first message Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        );
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-link')).toHaveText('Alert 1 button label');
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-close')).toBeVisible();

        // second alert as expected
        await assertIconIsVisible(getAlert(SECOND_ALERT_ID), ICON_WARN);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).toHaveText(
            'This is a permanent urgent alert that will show on all systems 2 of 2',
        );
        await expect(page.getByTestId(`alert-${SECOND_ALERT_ID}`)).toHaveCSS('background-color', COLOUR_UQ_WARN);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-message')).toHaveText('This is the second message');
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-link')).not.toBeVisible();
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-close')).toBeVisible();

        // third alert as expected
        await assertIconIsVisible(getAlert(THIRD_ALERT_ID), ICON_ERROR);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-title')).toHaveText(
            'This is a permanent extreme alert that will show on homepage only',
        );
        await expect(page.getByTestId(`alert-${THIRD_ALERT_ID}`)).toHaveCSS('background-color', COLOUR_UQ_ALERT);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-message')).toHaveText('This is the third message');
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-link')).not.toBeVisible();
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-close')).not.toBeVisible(); // permanent alert, has no hide button

        // alerts for other systems don't appear
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/drupal/);
    });

    test('Alert is visible without interaction at mobile width', async ({ page }) => {
        const getAlert = (alertIdentifierString) =>
            page.locator('alert-list').locator(`uq-alert[id="${alertIdentifierString}"]`);

        await page.goto('http://localhost:8080'); // has alerts call with empty system entry
        await page.setViewportSize({ width: 320, height: 480 });
        await expect(page.locator('alert-list').locator('uq-alert')).toHaveCount(3);

        // first alert as expected
        await assertIconIsVisible(getAlert(FIRST_ALERT_ID), ICON_INFO);
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-title')).toHaveText(
            'This is an info alert that will show on all systems',
        );
        await expect(page.getByTestId(`alert-${FIRST_ALERT_ID}`)).toHaveCSS('background-color', COLOUR_UQ_INFO);
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-message')).toHaveText(
            'This is the first message Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        );
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-link')).toHaveText('Alert 1 button label');
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-close')).toBeVisible();

        // second alert as expected
        await assertIconIsVisible(getAlert(SECOND_ALERT_ID), ICON_WARN);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).toHaveText(
            'This is a permanent urgent alert that will show on all systems 2 of 2',
        );
        await expect(page.getByTestId(`alert-${SECOND_ALERT_ID}`)).toHaveCSS('background-color', COLOUR_UQ_WARN);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-message')).toHaveText('This is the second message');
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-link')).not.toBeVisible();
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-close')).toBeVisible();

        // third alert as expected
        await assertIconIsVisible(getAlert(THIRD_ALERT_ID), ICON_ERROR);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-title')).toHaveText(
            'This is a permanent extreme alert that will show on homepage only',
        );
        await expect(page.getByTestId(`alert-${THIRD_ALERT_ID}`)).toHaveCSS('background-color', COLOUR_UQ_ALERT);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-message')).toHaveText('This is the third message');
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-link')).not.toBeVisible();
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-close')).not.toBeVisible(); // permanent alert, has no hide button

        // alerts for other systems don't appear
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(FIRST_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(THIRD_ALERT_ID).getByTestId('alert-title')).not.toHaveText(/drupal/);
    });

    // we cant get "into" the alert within the alert-list to get an alert
    // so make a page which has just the alerts themselves
    test('Alert passes accessibility', async ({ page }) => {
        const getAlert = (alertIdentifierString) => page.locator(`uq-alert[id="${alertIdentifierString}"]`);

        await page.goto('http://localhost:8080/index-individual-alerts.html');
        await page.setViewportSize({ width: 1280, height: 900 });

        // the default mock page has 3 alerts (shows page has loaded)
        await expect(page.locator('uq-alert')).toHaveCount(6);

        await expect(getAlert(FIRST_ALERT_ID).locator('div#alert')).toHaveAttribute('aria-label', 'Alert.');
        await assertAccessibility(page, `uq-alert[id="${FIRST_ALERT_ID}"]`);

        await expect(getAlert(SECOND_ALERT_ID).locator('div#alert')).toHaveAttribute('aria-label', 'Important alert.');
        await assertAccessibility(page, `uq-alert[id="${SECOND_ALERT_ID}"]`);

        await expect(getAlert(THIRD_ALERT_ID).locator('div#alert')).toHaveAttribute(
            'aria-label',
            'Very important alert.',
        );
        await assertAccessibility(page, `uq-alert[id="${THIRD_ALERT_ID}"]`);
    });

    test('Alert is hidden if clicked to dismiss', async ({ page }) => {
        const getAlert = (alertIdentifierString) =>
            page.locator('alert-list').locator(`uq-alert[id="${alertIdentifierString}"]`);

        await page.goto('http://localhost:8080/#keyword=;campus=;weekstart=');
        await page.setViewportSize({ width: 1280, height: 900 });

        // the default mock page has 3 alerts (shows page has loaded)
        await expect(page.locator('alert-list').locator('uq-alert')).toHaveCount(3);

        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).toBeVisible();
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-close')).toBeVisible();
        await getAlert(SECOND_ALERT_ID).locator('a#alert-close').click();
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).toBeHidden();

        page.reload();
        // only 2 alerts - the hidden one does not re-appear
        await expect(page.locator('alert-list').locator('uq-alert')).toHaveCount(2);
    });

    test('Alert is hidden if cookie is set to hide it', async ({ page, context }) => {
        await context.addCookies([{ name: 'UQ_ALERT_alert-1', value: 'hidden', path: '/', domain: 'localhost:8080' }]);
        await page.goto('http://localhost:8080');
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto('http://localhost:8080');
        await expect(page.locator('alert-list').locator('uq-alert')).toHaveCount(2);
    });

    test('Alert with no param displays correctly', async ({ page }) => {
        const getAlert = () => page.locator(`uq-alert[id="123456789"]`);

        await page.goto('http://localhost:8080/src/Alert/test-empty-alert.html');
        await page.setViewportSize({ width: 1280, height: 900 });

        await assertIconIsVisible(getAlert(), ICON_INFO);
        await expect(getAlert().getByTestId('alert-title')).toHaveText('No title supplied');
        await expect(getAlert().getByTestId('alert-message')).toHaveText('No message supplied');
        await expect(getAlert().getByTestId('alert-link')).not.toBeVisible();
        await expect(getAlert().getByTestId('alert-close')).toBeVisible();
    });

    test('Duplicating the alerts element does not give a second set of alerts', async ({ page }) => {
        // const getAlert = () => page.locator('.multipleAlerts alert-list:first-of-type').locator(`uq-alert[id="${SECOND_ALERT_ID}"]`);
        const getAlert = (alertIdentifierString) =>
            page.locator('alert-list').locator(`uq-alert[id="${alertIdentifierString}"]`);

        await page.goto('http://localhost:8080/src/Alerts/test-multiple-alerts-dont-duplicate.html');
        await page.setViewportSize({ width: 1280, height: 900 });

        // 2 alert list elements have been inserted in the test document
        await expect(page.locator('.multipleAlerts alert-list')).toHaveCount(2);

        // first one has the alerts
        await assertIconIsVisible(getAlert(SECOND_ALERT_ID), ICON_WARN);
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-title')).toHaveText(
            'This is a permanent urgent alert that will show on all systems 2 of 2',
        );
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-message')).toHaveText('This is the second message');
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-link')).not.toBeVisible();
        await expect(getAlert(SECOND_ALERT_ID).getByTestId('alert-close')).toBeVisible();

        // second does not have any alerts
        await expect(
            page.locator('.multipleAlerts alert-list:nth-child(2) [data-testid="alerts-wrapper"]'),
        ).toBeEmpty();
    });

    test('Alert link out works', async ({ page }) => {
        const getAlert = (alertIdentifierString) =>
            page.locator('alert-list').locator(`uq-alert[id="${alertIdentifierString}"]`);

        // mock the landing page for when the link is clicked
        await page.route('http://www.example.com', async (route) => {
            await route.fulfill({ body: 'it worked!' });
        });

        await page.goto('http://localhost:8080');
        await page.setViewportSize({ width: 1280, height: 900 });
        await getAlert(FIRST_ALERT_ID).getByTestId('alert-link').click();

        await expect(page.getByText('it worked!')).toBeVisible();
    });

    test('No alerts show when Alerts api doesnt load; page otherwise correct', async ({ page }) => {
        await page.goto('http://localhost:8080?user=errorUser');
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.waitForTimeout(1500);
        await expect(page.locator('alert-list').getByTestId('alerts-wrapper').locator(':scope > *')).toHaveCount(0);

        // some things on the page look right
        await expect(page.locator('uq-header').getByTestId('uq-header-search-button')).toBeVisible();
        await expect(
            page
                .locator('uq-site-header')
                .getByTestId('site-title')
                .getByText(/Library Test/)
                .first(),
        ).toBeVisible();
    });
    test('the masquerading user sees an alert that announces they are masquerading with logout button', async ({
        page,
    }) => {
        await page.route('https://auth.library.uq.edu.au/**', async (route) => {
            await route.fulfill({ body: 'user visits logout page' });
        });

        await page.goto('http://localhost:8080/?user=uqrdav10'); // the uqrdav10 mock user has the masquerading id set
        await expect(page.locator('uq-site-header').locator('auth-button')).toBeVisible();

        const getAlert = () => page.locator('alert-list').locator('uq-alert[id="masquerade-notice"]');

        await assertIconIsVisible(getAlert(), ICON_WARN);
        await expect(getAlert().getByTestId('alert-title')).toHaveText('Masquerade in place:');
        await expect(getAlert().getByTestId('alert-message')).toHaveText(
            'uqvasai masquerading as Robert DAVIDSON (uqrdav10)',
        );
        await expect(page.getByTestId(`alert-masquerade-notice`)).toHaveCSS('background-color', COLOUR_UQ_WARN);
        await expect(getAlert().getByTestId('alert-close')).not.toBeVisible(); // no close button
        await expect(getAlert().getByTestId('alert-link')).toBeVisible();
        await expect(getAlert().getByTestId('alert-link')).toHaveText('End masquerade');
    });
    test('the masquerading user can end an old session and log out', async ({ page }) => {
        await page.route('https://auth.library.uq.edu.au/**', async (route) => {
            await route.fulfill({ body: 'user visits logout page' });
        });

        await page.goto('http://localhost:8080/?user=uqrdav10'); // the uqrdav10 mock user has the masquerading id set
        await expect(page.locator('uq-site-header').locator('auth-button')).toBeVisible();

        const getAlert = () => page.locator('alert-list').locator('uq-alert[id="masquerade-notice"]');

        await expect(getAlert().getByTestId('alert-link')).toBeVisible();
        await expect(getAlert().getByTestId('alert-link')).toHaveText('End masquerade');
        await getAlert().getByTestId('alert-link').click();

        await expect(page.getByText('user visits logout page')).toBeVisible();
    });
});

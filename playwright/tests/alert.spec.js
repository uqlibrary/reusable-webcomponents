import { test, expect } from '@playwright/test';
import { assertAccessibility } from '../lib/axe';

const FIRST_ALERT_ID = 'alert-1';
const SECOND_ALERT_ID = 'alert-4';
const THIRD_ALERT_ID = 'alert-5';

test.describe('Alert', () => {
    test('Alert is visible without interaction at 1280', async ({ page }) => {
        const getAlert = (alertIdentifierString) =>
            page.locator('alert-list').locator(`uq-alert[id="${alertIdentifierString}"]`);

        await page.goto('http://localhost:8080'); // has alerts call with empty system entry
        await page.setViewportSize({ width: 1280, height: 900 });
        await expect(page.locator('alert-list').locator('uq-alert')).toHaveCount(3);

        // first alert as expected
        await expect(getAlert(FIRST_ALERT_ID).locator('#alert-icon')).toBeVisible();
        await expect(getAlert(FIRST_ALERT_ID).locator('#alert-title')).toHaveText(
            'This is an info alert that will show on all systems',
        );
        await expect(getAlert(FIRST_ALERT_ID).locator('[data-testid="alert-message"]')).toHaveText(
            'This is the first message',
        );
        await expect(getAlert(FIRST_ALERT_ID).locator('#alert-action-desktop')).toHaveText('Alert 1 button label');
        await expect(getAlert(FIRST_ALERT_ID).locator('#alert-close')).toBeVisible();

        // second alert as expected
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-icon')).toBeVisible();
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-title')).toHaveText(
            'This is a permanent urgent alert that will show on all systems 2 of 2',
        );
        await expect(getAlert(SECOND_ALERT_ID).locator('[data-testid="alert-message"]')).toHaveText(
            'This is the second message',
        );
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-action-desktop')).toHaveCount(0); // no link out for this alert
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-close')).toBeVisible();

        // third alert as expected
        await expect(getAlert(THIRD_ALERT_ID).locator('#alert-icon')).toBeVisible();
        await expect(getAlert(THIRD_ALERT_ID).locator('#alert-title')).toHaveText(
            'This is a permanent extreme alert that will show on homepage only',
        );
        await expect(getAlert(THIRD_ALERT_ID).locator('[data-testid="alert-message"]')).toHaveText(
            'This is the third message',
        );
        await expect(getAlert(THIRD_ALERT_ID).locator('#alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(THIRD_ALERT_ID).locator('#alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(THIRD_ALERT_ID).locator('#alert-action-desktop')).toHaveCount(0); // no link out for this alert
        await expect(getAlert(THIRD_ALERT_ID).locator('#alert-close')).not.toBeVisible(); // permanent alert, has no hide button

        // alerts for other systems don't appear
        await expect(getAlert(FIRST_ALERT_ID).locator('#alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(THIRD_ALERT_ID).locator('#alert-title')).not.toHaveText(/primo/);
        await expect(getAlert(FIRST_ALERT_ID).locator('#alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-title')).not.toHaveText(/drupal/);
        await expect(getAlert(THIRD_ALERT_ID).locator('#alert-title')).not.toHaveText(/drupal/);
    });

    // test.only('Alert passes accessibility', async ({ page }) => {
    //     const getAlert = alertIdentifierString => page
    //         .locator('alert-list')
    //         .locator(`uq-alert[id="${alertIdentifierString}"]`);
    //
    //
    //     await page.goto('http://localhost:8080/#keyword=;campus=;weekstart=');
    //     await page.setViewportSize({ width: 1280, height: 900 });
    //
    //     // the default mock page has 3 alerts (shows page has loaded)
    //     await expect(page.locator('alert-list').locator('uq-alert')).toHaveCount(3);
    //
    //     await assertAccessibility(page, 'alert-list uq-alert[id="alert-1"]');
    //
    // //   page
    // //     .locator('alert-list')
    // //     .locator(`uq-alert[id="${FIRST_ALERT_ID}"]`)
    // //     .locator('div#alert')
    // //     .FIXME_checkA11y('alert-list', {
    // //       reportName: 'Alert',
    // //       scopeName: 'Accessibility',
    // //       includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    // //     });
    // //   await expect(
    // //     page
    // //       .locator('alert-list')
    // //       .locator(`uq-alert[id="${FIRST_ALERT_ID}"]`)
    // //       .locator('div#alert')
    // //   ).toHaveAttribute('aria-label', 'Alert.');
    // //   page
    // //     .locator('alert-list')
    // //     .locator(`uq-alert[id="${SECOND_ALERT_ID}"]`)
    // //     .locator('div#alert')
    // //     .FIXME_checkA11y('alert-list', {
    // //       reportName: 'Alert',
    // //       scopeName: 'Accessibility',
    // //       includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    // //     });
    //   await expect(getAlert(SECOND_ALERT_ID).locator('div#alert')).toHaveAttribute('aria-label', 'Important alert.');
    //   await expect(getAlert(THIRD_ALERT_ID).locator('div#alert')).toHaveAttribute('aria-label', 'Very important alert.');
    // });

    test('Alert is hidden if clicked to dismiss', async ({ page }) => {
        const getAlert = (alertIdentifierString) =>
            page.locator('alert-list').locator(`uq-alert[id="${alertIdentifierString}"]`);

        await page.goto('http://localhost:8080/#keyword=;campus=;weekstart=');
        await page.setViewportSize({ width: 1280, height: 900 });

        // the default mock page has 3 alerts (shows page has loaded)
        await expect(page.locator('alert-list').locator('uq-alert')).toHaveCount(3);

        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-title')).toBeVisible();
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-close')).toBeVisible();
        await getAlert(SECOND_ALERT_ID).locator('a#alert-close').click();
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-title')).toBeHidden();

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

        await expect(getAlert().locator('#alert-icon')).toBeVisible();
        await expect(getAlert().locator('#alert-title')).toHaveText('No title supplied');
        await expect(getAlert().locator('[data-testid="alert-message"]')).toHaveText('No message supplied');
        await expect(getAlert().locator('#alert-action-desktop')).toHaveCount(0); // no button for this alert
        await expect(getAlert().locator('#alert-close')).toBeVisible();
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
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-icon')).toBeVisible();
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-title')).toHaveText(
            'This is a permanent urgent alert that will show on all systems 2 of 2',
        );
        await expect(getAlert(SECOND_ALERT_ID).locator('[data-testid="alert-message"]')).toHaveText(
            'This is the second message',
        );
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-action-desktop')).toHaveCount(0); // no button for this alert
        await expect(getAlert(SECOND_ALERT_ID).locator('#alert-close')).toBeVisible();

        // second does not have any alerts
        await expect(page.locator('.multipleAlerts alert-list:nth-child(2) #alerts-wrapper')).toBeEmpty();
    });

    test('Alert link out works', async ({ page }) => {
        // mock the landing page for when the link is clicked
        await page.route('http://www.example.com', async (route) => {
            await route.fulfill({ body: 'it worked!' });
        });

        await page.goto('http://localhost:8080');
        await page.setViewportSize({ width: 1280, height: 900 });
        await page
            .locator('alert-list')
            .locator(`uq-alert[id="${FIRST_ALERT_ID}"]`)
            .locator('#alert-action-desktop')
            .click();

        await expect(page.getByText('it worked!')).toBeVisible();
    });

    test('No alerts show when Alerts api doesnt load; page otherwise correct', async ({ page }) => {
        await page.goto('http://localhost:8080?user=errorUser');
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.waitForTimeout(1500);
        await expect(
            page.locator('alert-list').locator('[data-testid="alerts-wrapper"]').locator(':scope > *'),
        ).toHaveCount(0);

        // some things on the page look right
        await expect(page.locator('uq-header').locator('[data-testid="uq-header-search-button"]')).toBeVisible();
        await expect(
            page
                .locator('uq-site-header')
                .locator('[data-testid="site-title"]')
                .getByText(/Library Test/)
                .first(),
        ).toBeVisible();
    });
});

import { test, expect } from '@playwright/test';
import { assertAccessibility } from '../lib/axe';

test.describe('Skip nav', () => {
    test('Skip menu passes accessibility', async ({ page }) => {
        await page.goto('http://localhost:8080');

        await page.locator('uq-header').locator('#skip-nav').focus();
        await assertAccessibility(page, 'uq-header');
    });

    test('Skip Menu off - no-skip works as expected', async ({ page }) => {
        await page.goto('http://localhost:8080/index-noauth-nomenu-noskip.html');
        await page.setViewportSize({ width: 1280, height: 900 });
        await expect(page.locator('uq-header').locator('#skip-nav')).not.toBeVisible();
    });

    test('Skip Menu on - skip works as expected', async ({ page }) => {
        await page.goto('http://localhost:8080');
        await page.locator('uq-header').getByTestId('skip-nav').focus();

        await expect(page.locator('uq-header').getByTestId('skip-nav')).toBeFocused();
    });
});

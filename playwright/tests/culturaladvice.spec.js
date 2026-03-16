import { test, expect } from '@playwright/test';
import { assertAccessibility } from '../lib/axe';

test.describe('Cultural Advice', () => {
    test.describe('is accessible', () => {
        test('on the desktop', async ({ page }) => {
            await page.goto('http://localhost:8080/index.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(page.locator('cultural-advice').getByTestId('cultural-advice-statement')).toBeVisible();
            await expect(page.locator('cultural-advice').getByTestId('cultural-advice-statement')).toHaveText(
                /custodian/,
            );
            await assertAccessibility(page, 'cultural-advice');
        });

        test('on mobile', async ({ page }) => {
            await page.goto('http://localhost:8080/index.html');
            await page.setViewportSize({ width: 320, height: 480 });
            await expect(page.locator('cultural-advice').getByTestId('cultural-advice-statement')).toBeVisible();
            await expect(page.locator('cultural-advice').getByTestId('cultural-advice-statement')).toHaveText(
                /custodian/,
            );
            await assertAccessibility(page, 'cultural-advice');
        });
    });

    test('link out works', async ({ page }) => {
        // mock the landing page for when the link is clicked
        await page.route('https://web-live.library.uq.edu.au/**', async (route) => {
            await route.fulfill({ body: 'drupal page loaded' });
        });

        await page.goto('http://localhost:8080');
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.locator('cultural-advice').locator('[data-testid="cultural-advice-statement"] a').click();

        await expect(page.getByText('drupal page loaded')).toBeVisible();
    });
});

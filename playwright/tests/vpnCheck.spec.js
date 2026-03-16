import { test, expect } from '@playwright/test';

test.describe('VPN', () => {
    test('user is warned they need vpn when an api completely fails', async ({ page }) => {
        // note this is only done on dev sites
        await page.goto('http://localhost:8080/?user=errorUser');
        await page.setViewportSize({ width: 1280, height: 900 });
        await expect(page.locator('[data-testid="vpn-needed-toast"]')).toBeVisible();
        await expect(page.locator('[data-testid="vpn-needed-toast"]')).toHaveCSS(
            'background-color',
            'rgb(214, 41, 41)',
        );
    });
    test('when no error, no warning', async ({ page }) => {
        // note this is only done on dev sites
        await page.goto('http://localhost:8080/');
        await page.setViewportSize({ width: 1280, height: 900 });
        await expect(page.locator('[data-testid="vpn-needed-toast"]')).not.toBeVisible();
    });
});

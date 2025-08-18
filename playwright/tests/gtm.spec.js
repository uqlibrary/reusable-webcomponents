import { expect, test } from '@playwright/test';

test.describe('GTM', () => {
    test('calls GTM API', async ({ page }) => {
        const gtmCalls = [];
        const gtmNSCalls = [];

        await page.route('**/www.googletagmanager.com/gtm.js*', async (route) => {
            gtmCalls.push(route.request().url());
            await route.fulfill({ status: 200 });
        });

        await page.route('**/www.googletagmanager.com/ns.html*', async (route) => {
            gtmNSCalls.push(route.request().url());
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: '<html><body><!-- GTM noscript --></body></html>',
            });
        });

        await page.goto('http://localhost:8080/index.html');
        await page.waitForLoadState('networkidle');

        // Define the uq-gtm custom element
        await page.waitForFunction(
            () => {
                return window.customElements && window.customElements.get('uq-gtm');
            },
            { timeout: 5000 },
        );
        await page.evaluate(() => {
            const gtmElement = document.querySelector('uq-gtm');
            if (gtmElement) {
                gtmElement.setAttribute('gtm', 'ABC123');
            }
        });

        await page.waitForTimeout(1000);

        expect(gtmCalls.length).toEqual(1);
        expect(gtmNSCalls.length).toEqual(1);
        const gtmScriptCall = gtmCalls.find((url) => url.includes('gtm.js'));
        expect(gtmScriptCall).toBeTruthy();
        expect(gtmScriptCall).toContain('id=ABC123');

        const gtmAttribute = await page.getAttribute('uq-gtm', 'gtm');
        expect(gtmAttribute).toBe('ABC123');

        // console.log('GTM calls intercepted:', gtmCalls);
        // console.log('gtmNSCalls calls intercepted:', gtmNSCalls);
    });

    test('does not call GTM API when no gtm attribute is provided', async ({ page }) => {
        const gtmCalls = [];

        await page.route('**/www.googletagmanager.com/gtm.js*', async (route) => {
            gtmCalls.push(route.request().url());
            await route.fulfill({ status: 200 });
        });

        await page.route('**/www.googletagmanager.com/ns.html*', async (route) => {
            gtmCalls.push(route.request().url());
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: '<html><body><!-- GTM noscript --></body></html>',
            });
        });

        await page.goto('http://localhost:8080/index.html');
        await page.waitForLoadState('networkidle');

        await page.waitForFunction(() => {
            return window.customElements && window.customElements.get('uq-gtm');
        });

        await page.waitForTimeout(1000);

        expect(gtmCalls.length).toEqual(0);
    });
});

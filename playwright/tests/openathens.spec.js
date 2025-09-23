import { test, expect } from '@playwright/test';
import { assertAccessibility } from '../lib/axe';

const BUTTONS_LINK_CREATED_BLOCK = 'copy-options';
const BUTTON_CLEAR_ON_COPY_ENTRY = 'url-clear-button';
const BUTTON_CLEAR_CREATED_LINK = 'create-new-link-button';
const BUTTON_CLEAR_ON_VISIT = 'input-clear-button';

test.describe('OpenAthens', () => {
    async function copyAndToast(toastMessage, page, context, successExpected = true) {
        // only tested in copy-url mode
        await expect(page.locator('open-athens[create-link]').getByTestId('open-athens')).toBeVisible();
        const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');

        await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
        await openAthensElement.getByTestId('input-field').fill('https://www.google.com/');
        await openAthensElement.getByRole('button', { name: 'Create Link' }).click();

        await expect(openAthensElement.getByTestId('url-display-area')).toHaveValue(
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fwww.google.com',
        );

        await expect(openAthensElement.getByTestId('copy-options')).not.toHaveClass(/hidden/);
        // await openAthensElement.getByTestId('input-field').scrollIntoViewIfNeeded();
        await openAthensElement.getByRole('button', { name: 'Copy Link' }).click();

        // Toast appears and disappears
        await expect(openAthensElement.getByTestId('copy-status')).toBeVisible();
        await expect(openAthensElement.getByTestId('copy-status')).toHaveText(toastMessage);

        if (!!successExpected) {
            // Verify the URL was actually "copied", when it is a success message
            // per https://stackoverflow.com/questions/72265518/how-to-access-the-clipboard-contents-using-playwright-in-typescript
            await context.grantPermissions(['clipboard-read', 'clipboard-write']);
            const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
            const clipboardText = await handle.jsonValue();
            expect(clipboardText).toContain(
                'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fwww.google.com',
            );
        }
    }
    test.describe('copy url mode', () => {
        test.describe('success', () => {
            test.beforeEach(async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html');
            });

            test('shows expected elements on load', async ({ page }) => {
                await expect(page.locator('open-athens[create-link]')).toBeVisible();
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await expect(openAthensElement.getByRole('button', { name: 'Create Link' })).toBeVisible();
                await expect(openAthensElement.getByTestId(BUTTON_CLEAR_ON_COPY_ENTRY)).toBeVisible();

                await expect(openAthensElement.getByRole('button', { name: 'Visit Link' })).not.toBeVisible();
                await expect(openAthensElement.getByRole('button', { name: 'Copy Link' })).not.toBeVisible();
                await expect(openAthensElement.getByTestId(BUTTON_CLEAR_CREATED_LINK)).not.toBeVisible();
                await expect(openAthensElement.getByRole('button', { name: 'Go' })).not.toBeVisible();
                await expect(openAthensElement.getByTestId(BUTTON_CLEAR_ON_VISIT)).not.toBeVisible();
            });

            test('shows expected elements on creating a link', async ({ page }) => {
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');

                await openAthensElement.getByTestId('input-field').fill('https://www.google.com/');
                await openAthensElement.getByTestId('input-field').press('Enter');

                await expect(openAthensElement.getByRole('button', { name: 'Visit Link' })).toBeVisible();
                await expect(openAthensElement.getByRole('button', { name: 'Copy Link' })).toBeVisible();
                await expect(openAthensElement.getByTestId(BUTTON_CLEAR_CREATED_LINK)).toBeVisible();
                await expect(openAthensElement.getByRole('button', { name: 'Create Link' })).not.toBeVisible();
            });
            test('opens generated URL in a new window on clicking the Visit button', async ({ page, context }) => {
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');

                await openAthensElement.getByTestId('input-field').fill('https://www.example.com/something');
                await openAthensElement.getByRole('button', { name: 'Create Link' }).click();

                await expect(openAthensElement.getByRole('button', { name: 'Visit Link' })).toBeVisible();
                await openAthensElement.getByRole('button', { name: 'Visit Link' }).click();

                const newTabPromise = page.waitForEvent('popup');
                const newTab = await newTabPromise;
                await newTab.waitForLoadState();
                await expect(newTab).toHaveURL(
                    'https://go.openathens.net/redirector/uq.edu.au?url=https%3A%2F%2Fwww.example.com%2Fsomething',
                );
            });
            test('the toast after clicking copy appears and disappears', async ({ page }) => {
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await openAthensElement.getByTestId('input-field').fill('https://www.google.com/');
                await openAthensElement.getByRole('button', { name: 'Create Link' }).click();
                await openAthensElement.getByRole('button', { name: 'Copy Link' }).click();

                // Toast appears and disappears
                await expect(openAthensElement.getByTestId('copy-status')).toBeVisible();
                await page.waitForTimeout(4000); // give toast time to disappear
                await expect(openAthensElement.getByTestId('copy-status')).not.toBeVisible();
            });
            test('in built command to copy the generated URL to the clipboard on clicking copy button succeeds', async ({
                page,
                context,
            }) => {
                await page.setViewportSize({ width: 900, height: 1200 });
                await context.grantPermissions(['clipboard-read', 'clipboard-write']);
                await copyAndToast('URL copied successfully.', page, context, true);
            });
            test('can clear a created link', async ({ page }) => {
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');
                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await openAthensElement.getByTestId('input-field').fill('https://www.google.com/');
                await openAthensElement.getByRole('button', { name: 'Create Link' }).click();
                await expect(openAthensElement.getByTestId('url-display-area')).toHaveValue(
                    'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fwww.google.com',
                );
                await expect(openAthensElement.getByTestId(BUTTON_CLEAR_CREATED_LINK)).toBeVisible();
                await openAthensElement.getByTestId(BUTTON_CLEAR_CREATED_LINK).click();

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await expect(openAthensElement.getByRole('button', { name: 'Create Link' })).toBeVisible();
                await expect(openAthensElement.getByTestId(BUTTONS_LINK_CREATED_BLOCK)).not.toBeVisible();
                await expect(openAthensElement.getByRole('button', { name: 'Go' })).not.toBeVisible();
                await expect(openAthensElement.getByTestId(BUTTON_CLEAR_ON_VISIT)).not.toBeVisible();
            });
            test('creates doi.org URLs from DOIs as expected', async ({ page }) => {
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await openAthensElement.getByTestId('input-field').fill('10.1016/S2214-109X(21)00061-9');
                await openAthensElement.getByRole('button', { name: 'Create Link' }).click();

                await expect(openAthensElement.getByTestId('url-display-area')).toHaveValue(
                    'https://resolver.library.uq.edu.au/openathens/redir?qurl=https%3A%2F%2Fdx.doi.org%2F10.1016%2FS2214-109X(21)00061-9',
                );
            });
            test('is accessible', async ({ page }) => {
                await page.setViewportSize({
                    width: 1280,
                    height: 900,
                });

                await expect(page.locator('open-athens[create-link]').getByTestId('input-field')).toBeVisible();

                await assertAccessibility(page, 'open-athens');

                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');
                await openAthensElement.getByTestId('input-field').fill('10.1016/S2214-109X(21)00061-9');
                await openAthensElement.getByRole('button', { name: 'Create Link' }).click();
                await assertAccessibility(page, 'open-athens');
            });
        });
        test.describe('failure', () => {
            test('shows expected error messages when Open Athens is not working', async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html?requestType=error');
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await openAthensElement
                    .getByTestId('input-field')
                    .press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
                await openAthensElement.getByTestId('input-field').fill('http://www.example.com');
                await openAthensElement.getByTestId('input-field').press('Enter');

                await expect(openAthensElement.getByTestId('input-error')).toHaveText(
                    'The link generator is temporarily unavailable. Please try again later.',
                );
            });

            test('shows expected error messages for non OA url', async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html?requestType=failure');
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await openAthensElement
                    .getByTestId('input-field')
                    .press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
                await openAthensElement.getByTestId('input-field').fill('http://www.example.com');
                await openAthensElement.getByTestId('input-field').press('Enter');

                await expect(openAthensElement.getByTestId('input-error')).toHaveText(
                    'This link does not require UQ access. Try accessing it directly.',
                );

                // and can clear the field
                await expect(openAthensElement.getByTestId('input-field')).toHaveValue('http://www.example.com');
                await expect(openAthensElement.getByTestId(BUTTON_CLEAR_ON_COPY_ENTRY)).toBeVisible();
                await openAthensElement.getByTestId(BUTTON_CLEAR_ON_COPY_ENTRY).click();

                await expect(openAthensElement.getByTestId('input-field')).toHaveValue('');
            });

            test('shows expected error messages for ill-formed URLs', async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html');
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await openAthensElement.getByTestId('input-field').fill('blah');
                await openAthensElement.getByRole('button', { name: 'Create Link' }).click();

                await expect(openAthensElement.getByTestId('input-error')).toBeVisible();
                await expect(openAthensElement.getByTestId('input-error')).toHaveText(
                    'Invalid URL. Please add the protocol e.g. http://, https://',
                );
                await openAthensElement
                    .getByTestId('input-field')
                    .press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
                await openAthensElement.getByTestId('input-field').fill('http:/www.example.com');
                await openAthensElement.getByRole('button', { name: 'Create Link' }).click();
                await expect(openAthensElement.getByTestId('input-error')).toHaveText('Please enter a valid URL.');
            });

            test('shows expected error messages for old ezproxy domains, type 1', async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html');
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');
                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();

                await openAthensElement
                    .getByTestId('input-field')
                    .fill(
                        'http://www.sciencedirect.com.ezproxy.library.uq.edu.au/science/article/pii/S1744388116300159',
                    );
                await openAthensElement.getByRole('button', { name: 'Create Link' }).click();

                await expect(openAthensElement.getByTestId('input-error')).toBeVisible();
                await expect(openAthensElement.getByTestId('input-error')).toHaveText(
                    'EZproxy links are no longer supported. Please enter a valid URL.',
                );

                // await page.waitForTimeout(1000);
            });
            test('shows expected error messages for old ezproxy domains, type 2', async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html');
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');
                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();

                await openAthensElement
                    .getByTestId('input-field')
                    .fill(
                        'https://ezproxy.library.uq.edu.au/login?url=http://www.sciencedirect.com/science/article/pii/S1744388116300159',
                    );
                await openAthensElement.getByRole('button', { name: 'Create Link' }).click();

                await expect(openAthensElement.getByTestId('input-error')).toBeVisible();
                await expect(openAthensElement.getByTestId('input-error')).toHaveText(
                    'EZproxy links are no longer supported. Please enter a valid URL.',
                );
            });
            test('shows expected error messages for old ezproxy domains, type 3', async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html');
                const openAthensElement = page.locator('open-athens[create-link]').getByTestId('open-athens');

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await openAthensElement
                    .getByTestId('input-field')
                    .fill('https://www-mimsonline-com-au.ezproxy.library.uq.edu.au/Search/Search.aspx');
                await openAthensElement.getByRole('button', { name: 'Create Link' }).click();

                await expect(openAthensElement.getByTestId('input-error')).toBeVisible();
                await expect(openAthensElement.getByTestId('input-error')).toHaveText(
                    'EZproxy links are no longer supported. Please enter a valid URL.',
                );
            });
            test('shows expected error messages when copy mechanisms fail', async ({ browser }) => {
                const context = await browser.newContext({
                    permissions: [], // No permissions granted
                });

                const page = await context.newPage();

                // Navigate to your page
                await page.goto('http://localhost:8080/index-openathens.html');

                // Remove clipboard API and execCommand before any copy operation
                await page.addInitScript(() => {
                    // // Remove modern clipboard API
                    delete navigator.clipboard;

                    // Disable execCommand for copy operations
                    const originalExecCommand = document.execCommand;
                    document.execCommand = function (command, showUI, value) {
                        if (command === 'copy') {
                            return false; // Simulate unsupported
                        }
                        return originalExecCommand.call(this, command, showUI, value);
                    };
                });

                await copyAndToast('The Copy function is not available in this web browser.', page, context, false);
            });
        });
    });
    test.describe('visit url mode', () => {
        test.describe('success', () => {
            test.beforeEach(async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html');
            });
            test('shows expected elements on load', async ({ page }) => {
                const openAthensElement = page.locator('open-athens:not([create-link])').getByTestId('open-athens');

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await expect(openAthensElement.getByRole('button', { name: 'Go' })).toBeVisible();
                await expect(openAthensElement.getByTestId(BUTTON_CLEAR_ON_VISIT)).toBeVisible();

                await expect(openAthensElement.getByRole('button', { name: 'Create Link' })).not.toBeVisible();
                await expect(openAthensElement.getByTestId(BUTTON_CLEAR_ON_COPY_ENTRY)).not.toBeVisible();

                await expect(openAthensElement.getByTestId(BUTTONS_LINK_CREATED_BLOCK)).not.toBeVisible();
                await expect(openAthensElement.getByRole('button', { name: 'Visit Link' })).not.toBeVisible();
                await expect(openAthensElement.getByRole('button', { name: 'Copy Link' })).not.toBeVisible();
                await expect(openAthensElement.getByTestId(BUTTON_CLEAR_CREATED_LINK)).not.toBeVisible();
            });

            test('opens a new window on submitting valid input', async ({ page }) => {
                const openAthensElement = page.locator('open-athens:not([create-link])').getByTestId('open-athens');

                await openAthensElement.getByTestId('input-field').fill('https://www.example.com/something');
                await openAthensElement.getByRole('button', { name: 'Go' }).click();

                const newTabPromise = page.waitForEvent('popup');
                const newTab = await newTabPromise;
                await newTab.waitForLoadState();
                await expect(newTab).toHaveURL(
                    'https://go.openathens.net/redirector/uq.edu.au?url=https%3A%2F%2Fwww.example.com%2Fsomething',
                );
            });
            test('clears the field on clicking the clear button', async ({ page }) => {
                const openAthensElement = page.locator('open-athens:not([create-link])').getByTestId('open-athens');

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await openAthensElement.getByTestId('input-field').fill('https://www.uq.edu.au/');
                await expect(openAthensElement.getByTestId(BUTTON_CLEAR_ON_VISIT)).toBeVisible();
                await expect(openAthensElement.getByTestId('input-field')).not.toBeEmpty();

                await openAthensElement.getByTestId(BUTTON_CLEAR_ON_VISIT).click();

                await expect(openAthensElement.getByTestId('input-field')).toBeEmpty();
            });
            test('is accessible', async ({ page }) => {
                await page.setViewportSize({ width: 1280, height: 900 });

                await expect(page.locator('open-athens:not([create-link])').getByTestId('input-field')).toBeVisible();

                await assertAccessibility(page, 'open-athens');

                const openAthensElement = page.locator('open-athens:not([create-link])').getByTestId('open-athens');
                await openAthensElement.getByTestId('input-field').fill('10.1016/S2214-109X(21)00061-9');
                await openAthensElement.getByRole('button', { name: 'Go' }).click();
                await assertAccessibility(page, 'open-athens');
            });
        });
        test.describe('failure', () => {
            test('shows error if no input was provided', async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html');
                const openAthensElement = page.locator('open-athens:not([create-link])').getByTestId('open-athens');
                await openAthensElement.getByTestId('input-field').scrollIntoViewIfNeeded();
                await expect(openAthensElement.getByTestId('input-field')).toBeEmpty();
                await expect(openAthensElement.getByRole('button', { name: 'Go' })).toBeVisible();

                await openAthensElement.getByRole('button', { name: 'Go' }).click();

                await expect(openAthensElement.getByTestId('input-error')).toBeVisible();
                await expect(openAthensElement.getByTestId('input-error')).toHaveText('Please enter a URL.');
            });
            test('shows expected error messages when Open Athens is not working', async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html?requestType=error');
                await expect(page.locator('open-athens:not([create-link])')).toBeVisible();
                const openAthensElement = page.locator('open-athens:not([create-link])').getByTestId('open-athens');

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await openAthensElement
                    .getByTestId('input-field')
                    .press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
                await openAthensElement.getByTestId('input-field').fill('http://www.example.com');
                await openAthensElement.getByTestId('input-field').press('Enter');

                await expect(openAthensElement.getByTestId('input-error')).toBeVisible();
                await expect(openAthensElement.getByTestId('input-error')).toHaveText(
                    'The link generator is temporarily unavailable. Please try again later.',
                );
            });
            test('shows expected error messages for non OA url', async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html?requestType=failure');
                const openAthensElement = page.locator('open-athens:not([create-link])').getByTestId('open-athens');

                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();
                await openAthensElement
                    .getByTestId('input-field')
                    .press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
                await openAthensElement.getByTestId('input-field').fill('http://www.example.com');
                await openAthensElement.getByTestId('input-field').press('Enter');

                await expect(openAthensElement.getByTestId('input-error')).toBeVisible();
                await expect(openAthensElement.getByTestId('input-error')).toHaveText(
                    'This link does not require UQ access. Try accessing it directly.',
                );
            });
            test('shows expected error messages for ill-formed URLs', async ({ page }) => {
                await page.goto('http://localhost:8080/index-openathens.html');
                const openAthensElement = page.locator('open-athens:not([create-link])').getByTestId('open-athens');
                await expect(openAthensElement.getByTestId('input-field')).toBeVisible();

                // submit form while field empty
                await openAthensElement.getByTestId('input-field').fill('blah');
                await expect(openAthensElement.getByRole('button', { name: 'Go' })).toBeVisible();
                await openAthensElement.getByRole('button', { name: 'Go' }).click();

                await expect(openAthensElement.getByTestId('input-error')).toBeVisible();
                await expect(openAthensElement.getByTestId('input-error')).toHaveText(
                    'Invalid URL. Please add the protocol e.g. http://, https://',
                );

                // submit form with invalid url
                await openAthensElement
                    .getByTestId('input-field')
                    .press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
                await openAthensElement.getByTestId('input-field').fill('http:/www.example.com');
                await openAthensElement.getByRole('button', { name: 'Go' }).click();

                await expect(openAthensElement.getByTestId('input-error')).toBeVisible();
                await expect(openAthensElement.getByTestId('input-error')).toHaveText('Please enter a valid URL.');
            });
        });
    });
});

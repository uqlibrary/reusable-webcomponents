import { test, expect } from '@playwright/test';
import { assertAccessibility } from '../lib/axe';

test.describe('Secure Collection', () => {
    test('Secure Collection passes accessibility', async ({ page }) => {
        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=bomdata&file=abcdef.zip',
        );
        const secureCollectionElement = page.locator('secure-collection');
        await expect(secureCollectionElement.getByTestId('secure-collection-file-extension')).toBeVisible();

        await assertAccessibility(page, 'secure-collection');
    });
    test('a link to a non existant resource says so', async ({ page }) => {
        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=collection&file=doesntExist',
        );
        const secureCollectionElement = page.locator('secure-collection');
        await expect(secureCollectionElement.getByTestId('hero-text')).toBeVisible();
        await expect(
            secureCollectionElement.getByText(/This file does not exist or is unavailable\./).first(),
        ).toBeVisible();
        await expect(secureCollectionElement.getByText(/Please check the link you have used\./).first()).toBeVisible();
    });
    test('when the html is called with no parameters it says so', async ({ page }) => {
        await page.goto('http://localhost:8080/src/applications/securecollection/demo.html');
        const secureCollectionElement = page.locator('secure-collection');

        await expect(secureCollectionElement.getByTestId('hero-text')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('hero-text')).toHaveText('Secure collection');

        await expect(
            secureCollectionElement.getByText(/This file does not exist or is unavailable\./).first(),
        ).toBeVisible();
        await expect(secureCollectionElement.getByText(/Please check the link you have used\./).first()).toBeVisible();
    });

    test('a link that returns an error from the api says so', async ({ page }) => {
        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=public&collection=api&file=fails',
        );
        const secureCollectionElement = page.locator('secure-collection');

        await expect(secureCollectionElement.getByTestId('hero-text')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('hero-text')).toHaveText('Secure collection');

        await expect(secureCollectionElement.getByText(/System temporarily unavailable/).first()).toBeVisible();
        await expect(
            secureCollectionElement
                .getByText(
                    /We're working on the issue and will have service restored as soon as possible\. Please try again later\./,
                )
                .first(),
        ).toBeVisible();
    });

    test('a link that requires a Statutory Copyright statement does so (logged in users only)', async ({ page }) => {
        await page.route('https://files.library.uq.edu.au/**', async (route) => {
            await route.fulfill({ body: 'user receives a coursebank file' });
        });

        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=coursebank&file=111111111111111.pdf',
        );
        const secureCollectionElement = page.locator('secure-collection');

        await expect(secureCollectionElement.getByTestId('hero-text')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('hero-text')).toHaveText('Secure collection');

        await expect(secureCollectionElement.getByTestId('standard-card-copyright-notice').locator('h2')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('standard-card-copyright-notice').locator('h2')).toHaveText(
            'Warning',
        );
        await expect(
            secureCollectionElement
                .getByText(/This material has been reproduced and communicated to you by or on behalf of The/)
                .first(),
        ).toBeVisible();
        await expect(secureCollectionElement.getByText(/\.pdf/).first()).toBeVisible();
        await expect(
            secureCollectionElement.locator('[data-testid="secure-collection-statutory-copyright-download-link"]'),
        ).toHaveAttribute(
            'href',
            'https://files.library.uq.edu.au/secure/coursebank/111111111111111.pdf?Expires=1621060025&Signature=longString&Key-Pair-Id=APKAJNDQICYW445PEOSA',
        );
        await expect(secureCollectionElement.getByTestId('secure-collection-file-extension')).toBeVisible();
        await expect(
            secureCollectionElement.getByTestId('secure-collection-file-extension').filter({ hasText: '.pdf' }),
        ).toBeVisible();
        await secureCollectionElement.getByTestId('secure-collection-statutory-copyright-download-link').click();
        await expect(page.getByText('user receives a coursebank file')).toBeVisible();
    });

    test('a link that does not have a file extension doesnt display the file extension hint to the user (loggedin user only)', async ({
        page,
    }) => {
        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=coursebank&file=2222222',
        );
        const secureCollectionElement = page.locator('secure-collection');

        await expect(secureCollectionElement.getByTestId('hero-text')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('hero-text')).toHaveText('Secure collection');

        await expect(secureCollectionElement.getByTestId('standard-card-copyright-notice').locator('h2')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('standard-card-copyright-notice').locator('h2')).toHaveText(
            'Warning',
        );

        await expect(secureCollectionElement.getByTestId('statutory-copyright-warning')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('statutory-copyright-warning')).toContainText(
            'The material in this communication may be subject to copyright under the Act',
        );
        await expect(secureCollectionElement.getByTestId('fileExtension')).not.toBeVisible();
    });

    test('a link that requires a Commercial Copyright statement does so (logged in user only)', async ({ page }) => {
        await page.route('https://files.library.uq.edu.au/**', async (route) => {
            await route.fulfill({ body: 'user receives a bom file' });
        });

        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=bomdata&file=abcdef.zip',
        );
        const secureCollectionElement = page.locator('secure-collection');

        await expect(secureCollectionElement.getByTestId('hero-text')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('hero-text')).toHaveText('Secure collection');

        await expect(secureCollectionElement.getByTestId('commerical-copyright-h4')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('commerical-copyright-h4')).toHaveText('WARNING');

        await expect(secureCollectionElement.getByTestId('commerical-copyright-subtitle')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('commerical-copyright-subtitle')).toContainText(
            'This file is provided to support teaching and learning for the staff and students of',
        );

        await expect(secureCollectionElement.getByTestId('secure-collection-file-extension')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('secure-collection-file-extension')).toContainText('.zip');

        await expect(
            secureCollectionElement.getByTestId('secure-collection-commercial-copyright-download-link'),
        ).toHaveAttribute(
            'href',
            'https://files.library.uq.edu.au/secure/bomdata/abcdef.zip?Expires=1621060025&Signature=longString&Key-Pair-Id=APKAJNDQICYW445PEOSA',
        );
        await secureCollectionElement.getByTestId('secure-collection-commercial-copyright-download-link').click();
        await expect(page.getByText('user receives a bom file')).toBeVisible();
    });

    test('a link that is missing the appropriate parameters displays a missing page', async ({ page }) => {
        await page.goto('http://localhost:8080/src/applications/securecollection/demo.html');
        await page.setViewportSize({ width: 1300, height: 1000 });
        const secureCollectionElement = page.locator('secure-collection');

        await expect(secureCollectionElement.getByTestId('hero-text')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('hero-text')).toHaveText('Secure collection');

        await expect(secureCollectionElement.getByTestId('standard-card-copyright-notice').locator('h2')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('standard-card-copyright-notice').locator('h2')).toHaveText(
            'This file does not exist or is unavailable.',
        );

        await expect(
            secureCollectionElement.getByTestId('standard-card-copyright-notice').locator('p').first(),
        ).toBeVisible();
        await expect(
            secureCollectionElement.getByTestId('standard-card-copyright-notice').locator('p').first(),
        ).toContainText('Please check the link you have used');
    });

    test('a link that requires certain user types will give an error', async ({ page }) => {
        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=emcommunity&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_EMuser.pdf',
        );
        await page.setViewportSize({ width: 1300, height: 1000 });
        const secureCollectionElement = page.locator('secure-collection');

        await expect(secureCollectionElement.getByTestId('hero-text')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('hero-text')).toHaveText('Secure collection');

        await expect(secureCollectionElement.getByTestId('standard-card-copyright-notice').locator('h2')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('standard-card-copyright-notice').locator('h2')).toHaveText(
            'Access to this file is only available to UQ staff and students.',
        );

        await expect(secureCollectionElement.getByTestId('api-error-options').locator('li').first()).toBeVisible();
        await expect(secureCollectionElement.getByTestId('api-error-options').locator('li').first()).toContainText(
            'If you have another UQ account',
        );
    });

    // manual mode used so we can chek the redirect on click
    test('a resource that requires login can have the login redirect link clicked', async ({ page }) => {
        await page.route('https://auth.library.uq.edu.au/**', async (route) => {
            await route.fulfill({ body: 'auth pages that allows the user to login' });
        });

        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=public&mode=manualRedirect&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf',
        );
        const secureCollectionElement = page.locator('secure-collection');

        await expect(secureCollectionElement.getByTestId('hero-text')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('hero-text')).toHaveText('Secure collection');

        await secureCollectionElement.getByTestId('secure-collection-auth-redirector').click();

        await expect(page.getByText('auth pages that allows the user to login')).toBeVisible();
    });

    test('a resource that requires login will redirect to auth for the public user', async ({ page }) => {
        await page.route('https://auth.library.uq.edu.au/**', async (route) => {
            await route.fulfill({ body: 'auth pages that allows the user to login' });
        });

        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=public&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf',
        );
        await expect(page.getByText('auth pages that allows the user to login')).toBeVisible();
    });

    test('a resource that requires login will redirect to the resource for a logged in user', async ({ page }) => {
        await page.route('https://files.library.uq.edu.au/**', async (route) => {
            await route.fulfill({ body: 'I am a exam file resource delivered to the user' });
        });

        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf',
        );

        await expect(page.getByText('I am a exam file resource delivered to the user')).toBeVisible();
    });

    test('a link that downloads can have the "download" button clicked', async ({ page }) => {
        await page.route('https://files.library.uq.edu.au/**', async (route) => {
            await route.fulfill({ body: 'I am file resource A delivered to the user' });
        });

        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=public&mode=manualRedirect&collection=coursebank&file=22222222222.pdf',
        );
        await page.setViewportSize({ width: 1300, height: 1000 });
        const secureCollectionElement = page.locator('secure-collection');

        await expect(secureCollectionElement.getByTestId('hero-text')).toBeVisible();
        await expect(secureCollectionElement.getByTestId('hero-text')).toHaveText('Secure collection');

        await secureCollectionElement.getByTestId('secure-collection-resource-redirector').click();

        await expect(page.getByText('I am file resource A delivered to the user')).toBeVisible();
    });

    test('a link that downloads will redirect to the resource', async ({ page }) => {
        await page.route('https://files.library.uq.edu.au/**', async (route) => {
            await route.fulfill({ body: 'I am file resource B delivered to the user' });
        });

        // redirects straight away!
        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=exams&file=phil1010.pdf',
        );

        await expect(page.getByText('I am file resource B delivered to the user')).toBeVisible();
    });

    test('a link that does not require acknowledgement will redirect to the file (logged in user only)', async ({
        page,
    }) => {
        await page.route('https://files.library.uq.edu.au/**', async (route) => {
            await route.fulfill({ body: 'I am file resource C delivered to the user' });
        });

        await page.goto(
            'http://localhost:8080/src/applications/securecollection/demo.html?user=s1111111&collection=thomson&file=classic_legal_texts/Thynne_Accountability_And_Control.pdf',
        );

        // then check redirection
        await expect(page.getByText('I am file resource C delivered to the user')).toBeVisible();
    });
});
